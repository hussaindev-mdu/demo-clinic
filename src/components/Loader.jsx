import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../hooks/useScrollAnimation.js'

/** Full-screen loading animation: drawing ECG line; fades out once `ready`. */
export default function Loader({ ready, onDone }) {
  const root = useRef(null)
  const path = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || !path.current) return
    const len = path.current.getTotalLength()
    gsap.set(path.current, { strokeDasharray: len, strokeDashoffset: len })
    const tween = gsap.to(path.current, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.2 })
    return () => tween.kill()
  }, [])

  useEffect(() => {
    if (!ready) return
    if (prefersReducedMotion()) { onDone(); return }
    const t = gsap.to(root.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut', delay: 0.3, onComplete: onDone })
    return () => t.kill()
  }, [ready, onDone])

  return (
    <div ref={root} role="status" aria-live="polite" className="fixed inset-0 z-[100] grid place-items-center bg-white">
      <div className="text-center">
        <svg viewBox="0 0 240 60" width="240" height="60" aria-hidden="true">
          <path d="M0 30h70l10-22 14 44 12-30 8 8h126" fill="none" stroke="#e1ecf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path ref={path} d="M0 30h70l10-22 14 44 12-30 8 8h126" fill="none" stroke="#0e9f94" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-4 font-display text-2xl text-navy-900">CarePlus</p>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-navy-600">Loading your care experience…</p>
      </div>
    </div>
  )
}
