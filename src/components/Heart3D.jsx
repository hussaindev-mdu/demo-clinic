/**
 * Heart3D – the anatomical heart.
 *
 * 1. If /models/heart.glb exists it is loaded (lazily) and auto-fitted/centred.
 * 2. Otherwise a procedural anatomical placeholder is generated (no network needed).
 *
 * Replacing the placeholder: drop your Blender export at public/models/heart.glb
 * (see public/models/README.md). No code change is required.
 */
import { Component, Suspense, forwardRef, memo, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export const MODEL_URL = `${import.meta.env.BASE_URL}models/heart.glb`

/* ---------- tiny deterministic value-noise (no dependencies) ---------- */
const hash = (x, y, z) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}
const smooth = (t) => t * t * (3 - 2 * t)
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi)
  const l = (a, b, t) => a + (b - a) * t
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz)
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf
  )
}
const fbm = (x, y, z) => noise3(x, y, z) * 0.6 + noise3(x * 2.3, y * 2.3, z * 2.3) * 0.28 + noise3(x * 5.1, y * 5.1, z * 5.1) * 0.12

/* ---------- ventricular surface: unit direction -> heart-shaped point ---------- */
const clamp01 = (v) => Math.min(1, Math.max(0, v))
function ventriclePoint(d, target = new THREE.Vector3()) {
  const t0 = clamp01(-d.y)                  // 0 at equator, 1 at apex
  const t = t0 * t0 * (2 - t0)              // zero slope at the equator → no crease
  const taper = 1 - 0.62 * t
  let x = d.x * 0.92 * taper + 0.46 * t * t // apex leans to patient's left
  let y = d.y * 1.18
  let z = d.z * 0.8 * taper
  // interventricular groove (front + back)
  const groove = Math.exp(-Math.pow((d.x - 0.04) / 0.13, 2)) * (1 - clamp01((d.y - 0.45) / 0.35))
  const k = 1 - 0.05 * groove
  x *= k; z *= k
  return target.set(x, y, z)
}

function buildVentricles(segments) {
  const geo = new THREE.SphereGeometry(1, segments, segments)
  const pos = geo.attributes.position
  const col = new Float32Array(pos.count * 3)
  const d = new THREE.Vector3()
  const p = new THREE.Vector3()
  const muscle = new THREE.Color('#7a1424'), deep = new THREE.Color('#470a16'), fat = new THREE.Color('#c99a58'), c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize()
    ventriclePoint(d, p)
    const n = fbm(d.x * 3 + 7, d.y * 3, d.z * 3)
    p.addScaledVector(d, (n - 0.5) * 0.07)
    pos.setXYZ(i, p.x, p.y, p.z)
    // colour: muscle variation + epicardial fat along grooves / base
    const grooveF = Math.exp(-Math.pow((d.x - 0.04) / 0.2, 2)) * 0.8
    const baseF = clamp01((d.y - 0.35) * 2.2)
    const fatAmt = clamp01(Math.max(grooveF, baseF) * (0.35 + n * 0.9) - 0.15)
    c.copy(deep).lerp(muscle, clamp01(0.35 + n * 0.9)).lerp(fat, fatAmt * 0.5)
    col.set([c.r, c.g, c.b], i * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  geo.computeVertexNormals()
  return geo
}

function blobGeometry(radius, seed, segments, squash = [1, 1, 1]) {
  const geo = new THREE.SphereGeometry(radius, segments, segments)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n = fbm(v.x * 2 + seed, v.y * 2 + seed, v.z * 2)
    v.multiplyScalar(1 + (n - 0.5) * 0.14)
    pos.setXYZ(i, v.x * squash[0], v.y * squash[1], v.z * squash[2])
  }
  geo.computeVertexNormals()
  return geo
}

/** Heart-local anchor points for labelled hotspots (same tilt as the heart group). */
const onSurface = (dx, dy, dz, off = 0.06) => { const d = new THREE.Vector3(dx, dy, dz).normalize(); return ventriclePoint(d).addScaledVector(d, off).toArray() }
export const HEART_TILT = [0.1, 0, -0.12]
export const HEART_SCALE = 0.95
export const ANCHORS = {
  aorta: [0.3, 1.45, -0.1],
  rightAtrium: [-0.68, 0.5, 0.45],
  leftVentricle: onSurface(0.75, -0.3, 0.6),
  coronary: onSurface(0.1, -0.3, 0.95, 0.07),
}

const curve = (pts) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5)

/** Makes a bump texture so the muscle surface catches light like real tissue. */
function makeBumpTexture(size = 256) {
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const ctx = cv.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const n = fbm(x / 18, y / 18, 3) * 0.7 + fbm(x / 4, y / 4, 9) * 0.3
    const v = Math.floor(n * 255), i = (y * size + x) * 4
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 2)
  return tex
}

/* ------------------------------ procedural heart ------------------------------ */
const ProceduralHeart = memo(forwardRef(function ProceduralHeart({ lowPower = false }, ref) {
  const seg = lowPower ? 48 : 112
  const tube = lowPower ? 32 : 72
  const radial = lowPower ? 10 : 20

  const parts = useMemo(() => {
    const ventricles = buildVentricles(seg)
    const rAtrium = blobGeometry(0.5, 3, seg / 2, [1, 1.05, 0.9])
    const lAppendage = blobGeometry(0.3, 11, seg / 2, [0.85, 1.15, 0.8])
    const surf = (dx, dy, dz, off = 0.03) => {
      const d = new THREE.Vector3(dx, dy, dz).normalize()
      return ventriclePoint(d).addScaledVector(d, off).toArray()
    }
    const tubes = {
      aorta: curve([[0.1, 0.7, 0.05], [0.14, 1.12, 0.0], [0.3, 1.45, -0.1], [0.68, 1.58, -0.25], [0.98, 1.32, -0.4], [1.04, 0.8, -0.5]]),
      pulmonary: curve([[0.32, 0.66, 0.48], [0.34, 1.0, 0.5], [0.42, 1.28, 0.4], [0.75, 1.36, 0.14], [1.15, 1.2, -0.05]]),
      pulmonaryR: curve([[0.4, 1.26, 0.38], [0.1, 1.38, 0.15], [-0.3, 1.42, -0.1]]),
      svc: curve([[-0.62, 0.55, -0.05], [-0.64, 1.0, -0.08], [-0.6, 1.5, -0.12]]),
      lad: curve([surf(0.02, 0.6, 0.8), surf(0.04, 0.2, 0.97), surf(0.1, -0.3, 0.95), surf(0.2, -0.7, 0.68), surf(0.28, -0.96, 0.1)]),
      lcx: curve([surf(0.3, 0.55, 0.78), surf(0.75, 0.5, 0.45), surf(0.97, 0.38, 0.0), surf(0.8, 0.3, -0.55)]),
      rca: curve([surf(-0.15, 0.55, 0.82), surf(-0.6, 0.5, 0.6), surf(-0.95, 0.35, 0.1), surf(-0.7, 0.2, -0.7)]),
    }
    return { ventricles, rAtrium, lAppendage, tubes }
  }, [seg])

  const bump = useMemo(() => makeBumpTexture(lowPower ? 128 : 256), [lowPower])
  useEffect(() => () => { bump.dispose(); Object.values(parts).forEach((p) => p.dispose?.()) }, [bump, parts])

  const muscleProps = { vertexColors: true, roughness: 0.5, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.35, sheen: 0.35, sheenColor: '#ff7a86', bumpMap: bump, bumpScale: 2.2, envMapIntensity: 0.75 }
  const T = parts.tubes
  const vessel = (name, r, color, rough = 0.5) => (
    <group key={name}>
      <mesh geometry={new THREE.TubeGeometry(T[name], tube, r, radial, false)} castShadow>
        <meshPhysicalMaterial color={color} roughness={rough} clearcoat={0.5} clearcoatRoughness={0.4} bumpMap={bump} bumpScale={0.5} />
      </mesh>
      <mesh position={T[name].getPoint(1)}><sphereGeometry args={[r, radial, radial]} /><meshPhysicalMaterial color={color} roughness={rough} clearcoat={0.5} /></mesh>
    </group>
  )

  return (
    <group ref={ref} rotation={HEART_TILT} scale={HEART_SCALE}>
      <mesh geometry={parts.ventricles}>
        <meshPhysicalMaterial {...muscleProps} />
      </mesh>
      <mesh geometry={parts.rAtrium} position={[-0.68, 0.46, 0.0]}>
        <meshPhysicalMaterial {...muscleProps} color="#8d1f2f" vertexColors={false} />
      </mesh>
      <mesh geometry={parts.lAppendage} position={[0.62, 0.78, 0.3]} rotation={[0.2, 0.4, -0.6]}>
        <meshPhysicalMaterial {...muscleProps} color="#80192a" vertexColors={false} />
      </mesh>
      {vessel('aorta', 0.17, '#c93f55', 0.42)}
      {vessel('pulmonary', 0.15, '#6f5a9c', 0.45)}
      {vessel('pulmonaryR', 0.1, '#6f5a9c', 0.45)}
      {vessel('svc', 0.12, '#4d62a3', 0.5)}
      {vessel('lad', 0.04, '#e0344c', 0.3)}
      {vessel('lcx', 0.036, '#e0344c', 0.3)}
      {vessel('rca', 0.038, '#e0344c', 0.3)}
    </group>
  )
}))

/* ------------------------------ GLB heart (optional) ------------------------------ */
function GLBHeart({ url, lowPower }) {
  const { scene } = useGLTF(url)
  const { object, scale } = useMemo(() => {
    const obj = scene.clone(true)
    const box = new THREE.Box3().setFromObject(obj)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    obj.position.sub(center)
    obj.traverse((m) => {
      if (m.isMesh) {
        m.frustumCulled = true
        if (m.material) { m.material.envMapIntensity = 1.2; if (lowPower) m.material.normalMap = null }
      }
    })
    return { object: obj, scale: 3.4 / Math.max(size.x, size.y, size.z) }
  }, [scene, lowPower])
  return <group scale={scale}><primitive object={object} /></group>
}

class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFail?.() }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

/** Checks (once) whether a real GLB is deployed, without throwing on SPA 404 fallbacks. */
let glbProbe
function probeGLB(url) {
  glbProbe ??= fetch(url, { method: 'HEAD' })
    .then((r) => r.ok && !(r.headers.get('content-type') || '').includes('text/html') && Number(r.headers.get('content-length') || 1) > 1024)
    .catch(() => false)
  return glbProbe
}

const Heart3D = forwardRef(function Heart3D({ lowPower = false }, ref) {
  const [hasGLB, setHasGLB] = useState(false)
  useEffect(() => { let on = true; probeGLB(MODEL_URL).then((ok) => on && setHasGLB(ok)); return () => { on = false } }, [])
  const placeholder = <ProceduralHeart ref={ref} lowPower={lowPower} />
  if (!hasGLB) return placeholder
  return (
    <Boundary fallback={placeholder}>
      <Suspense fallback={placeholder}>
        <group ref={ref}><GLBHeart url={MODEL_URL} lowPower={lowPower} /></group>
      </Suspense>
    </Boundary>
  )
})

export default memo(Heart3D)
