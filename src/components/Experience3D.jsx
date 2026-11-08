/**
 * Experience3D – the fixed full-screen R3F canvas behind the story sections
 * (Hero → About/Innovation → Specialities). A GSAP ScrollTrigger timeline writes
 * camera/heart keyframes into a plain object; useFrame damps towards them.
 * All 3D logic lives here and in Heart3D – UI components never import three.
 */
import { Suspense, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Html } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Heart3D, { ANCHORS, HEART_TILT, HEART_SCALE } from './Heart3D.jsx'
import { prefersReducedMotion, useMediaQuery } from '../hooks/useScrollAnimation.js'

gsap.registerPlugin(ScrollTrigger)

/* Keyframes expressed in screen fractions so the layout works at any aspect ratio.
   hx/hy: heart position as a fraction of half-width / half-height at its depth. */
const KEYS = {
  desktop: [
    { hx: 0.46, hy: -0.02, s: 1.0, dist: 8.6, az: 0.0, el: 0.0, open: 0, fade: 1 },   // hero
    { hx: -0.5, hy: -0.02, s: 1.05, dist: 7.6, az: 0.45, el: 0.12, open: 1, fade: 1 }, // innovation (closer)
    { hx: 0.66, hy: 0.38, s: 0.62, dist: 8.4, az: -0.35, el: 0.28, open: 0, fade: 0.4 }, // specialities
    { hx: 0.7, hy: 0.9, s: 0.5, dist: 9, az: -0.4, el: 0.35, open: 0, fade: 0 },     // exit
  ],
  mobile: [
    { hx: 0, hy: 0.5, s: 0.62, dist: 11, az: 0, el: 0, open: 0, fade: 1 },
    { hx: 0, hy: 0.6, s: 0.66, dist: 10.5, az: 0.3, el: 0.1, open: 0, fade: 0.4 },
    { hx: 0.4, hy: 0.8, s: 0.45, dist: 11, az: -0.2, el: 0.2, open: 0, fade: 0.2 },
    { hx: 0.4, hy: 1.1, s: 0.4, dist: 11, az: -0.2, el: 0.2, open: 0, fade: 0 },
  ],
}

/** Studio lighting built from Lightformers – no HDR download needed. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 5, 6]} intensity={1.5} color="#fff6ee" />
      <directionalLight position={[-5, 2, 3]} intensity={0.9} color="#cfe6ff" />
      <pointLight position={[0, -3, 4]} intensity={8} color="#2bb5ab" distance={12} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} position={[0, 5, 4]} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#d6ebff" />
        <Lightformer form="rect" intensity={1.6} position={[6, 0, -2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} color="#ffe9dc" />
        <Lightformer form="ring" intensity={1.2} position={[0, -3, 5]} scale={5} color="#9fe8e0" />
      </Environment>
    </>
  )
}

const HOTSPOTS = [
  { label: 'Aorta', pos: ANCHORS.aorta, side: 'right' },
  { label: 'Right atrium', pos: ANCHORS.rightAtrium, side: 'left' },
  { label: 'Left ventricle', pos: ANCHORS.leftVentricle, side: 'right' },
  { label: 'Coronary artery', pos: ANCHORS.coronary, side: 'left' },
]

function Hotspot({ label, pos, side, stateRef }) {
  const el = useRef()
  useFrame(() => {
    if (el.current) {
      const o = stateRef.current.cur.open
      el.current.style.opacity = o.toFixed(2)
      el.current.style.transform = `translateY(${(1 - o) * 8}px)`
    }
  })
  return (
    <Html position={pos} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
      <div ref={el} style={{ opacity: 0 }} className={`flex items-center gap-2 ${side === 'left' ? 'flex-row-reverse -translate-x-full' : ''}`} aria-hidden="true">
        <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-70" /><span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-teal-500" /></span>
        <span className="whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900 shadow-soft backdrop-blur">{label}</span>
      </div>
    </Html>
  )
}

/** Moves camera + heart towards the scroll-driven target, adds idle rotation and mouse parallax. */
function Rig({ stateRef, mobile, reduced, showHotspots }) {
  const heart = useRef()
  const group = useRef()
  const { camera, size, pointer } = useThree()
  const look = useRef(new THREE.Vector3())
  const spin = useRef(0)
  const hot = useRef()

  useFrame((s, dt) => {
    const k = stateRef.current
    const damp = reduced ? 1 : 1 - Math.exp(-dt * 4)
    const c = stateRef.current.cur
    for (const key of ['hx', 'hy', 's', 'dist', 'az', 'el', 'open']) c[key] += (k[key] - c[key]) * damp

    // mouse parallax (disabled on touch/mobile & reduced motion)
    const px = mobile || reduced ? 0 : pointer.x
    const py = mobile || reduced ? 0 : pointer.y
    c.px += (px - c.px) * (1 - Math.exp(-dt * 3))
    c.py += (py - c.py) * (1 - Math.exp(-dt * 3))

    const az = c.az + c.px * 0.12
    const el = c.el + c.py * 0.06
    camera.position.set(Math.sin(az) * Math.cos(el) * c.dist, Math.sin(el) * c.dist, Math.cos(az) * Math.cos(el) * c.dist)
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * c.dist
    const halfW = halfH * (size.width / size.height)
    group.current.position.set(c.hx * halfW, c.hy * halfH, 0)
    group.current.scale.setScalar(c.s)
    camera.lookAt(look.current.set(0, 0, 0))

    if (heart.current && !reduced) {
      // slow rotation; eases to face front while the labelled "structure" view is open
      const open = c.open
      spin.current += dt * 0.28 * (1 - open)
      const front = Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2
      const w = open * open * (3 - 2 * open)
      heart.current.rotation.y = spin.current + (front - spin.current) * w + Math.sin(s.clock.elapsedTime * 0.6) * 0.12 * w
      if (hot.current) hot.current.rotation.y = 0
      const t = s.clock.elapsedTime * 1.2 % 1        // ~72 bpm, subtle lub-dub
      const beat = 1 + 0.022 * Math.exp(-Math.pow((t - 0.06) * 16, 2)) + 0.014 * Math.exp(-Math.pow((t - 0.3) * 16, 2))
      heart.current.scale.setScalar(0.95 * beat)
    }
  })

  return (
    <group ref={group}>
      <Heart3D ref={heart} lowPower={mobile} />
      {showHotspots && (
        <group ref={hot} rotation={HEART_TILT} scale={HEART_SCALE}>
          {HOTSPOTS.map((h) => <Hotspot key={h.label} {...h} stateRef={stateRef} />)}
        </group>
      )}
    </group>
  )
}

function Experience3D({ onReady }) {
  const mobile = useMediaQuery('(max-width: 767px)')
  const reduced = prefersReducedMotion()
  const wrapRef = useRef(null)
  const [active, setActive] = useState(true)
  const stateRef = useRef({ ...KEYS.desktop[0], cur: { ...KEYS.desktop[0], px: 0, py: 0 } })

  // Scroll-linked keyframe timeline (GSAP ScrollTrigger)
  useLayoutEffect(() => {
    const stage = document.getElementById('stage')
    if (!stage) return
    const keys = mobile ? KEYS.mobile : KEYS.desktop
    let ctx
    const build = () => {
      ctx?.revert()
      const base = stateRef.current
      Object.assign(base, keys[0])
      const vh = window.innerHeight
      const total = Math.max(1, stage.offsetHeight - vh)
      const centers = ['hero', 'about', 'specialities'].map((id) => {
        const el = document.getElementById(id)
        if (!el) return 0
        return Math.min(total, Math.max(0, el.offsetTop + el.offsetHeight / 2 - vh / 2))
      })
      const stops = [0, centers[1], centers[2], total].map((v, i, a) => (i ? Math.max(v, a[i - 1] + 1) : v))
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 0.5, invalidateOnRefresh: true },
          defaults: { ease: 'power2.inOut' },
        })
        for (let i = 1; i < keys.length; i++) {
          const { hx, hy, s, dist, az, el, open, fade } = keys[i]
          tl.to(base, { hx, hy, s, dist, az, el, open, fade, duration: stops[i] - stops[i - 1] }, stops[i - 1])
        }
        tl.duration(total)
      })
    }
    build()
    let t
    const onResize = () => { clearTimeout(t); t = setTimeout(build, 250) }
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(build)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); ctx?.revert() }
  }, [mobile, reduced])

  // Fade canvas with scroll and stop rendering when the stage is off-screen
  useEffect(() => {
    const stage = document.getElementById('stage')
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' })
    stage && io.observe(stage)
    let raf
    const tick = () => {
      if (wrapRef.current) wrapRef.current.style.opacity = String(Math.max(0, Math.min(1, stateRef.current.cur.fade)))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={wrapRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ fov: 35, position: [0, 0, 8.6], near: 0.1, far: 60 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => onReady?.()}
      >
        <Suspense fallback={null}>
          <StudioLights />
          <Rig stateRef={stateRef} mobile={mobile} reduced={reduced} showHotspots={!mobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default memo(Experience3D)
