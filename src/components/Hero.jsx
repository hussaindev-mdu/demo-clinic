import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { prefersReducedMotion } from '../hooks/useScrollAnimation.js'
import HeartFallback from './HeartFallback.jsx'

export default function Hero({ webgl, ready }) {
  const root = useRef(null)

  // Headline reveal once the loader has finished
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.1 })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="hero" ref={root} className="relative flex min-h-[100svh] items-end md:items-center">
      <div id="home" className="absolute top-0" />
      {/* soft wash so text stays readable above the 3D canvas */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sky-25/60 via-transparent to-white/70 md:bg-gradient-to-r md:from-white/85 md:via-white/30 md:to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl px-5 pb-14 pt-28 sm:px-8 md:grid-cols-2 md:py-32">
        <div className="max-w-xl">
          <p data-hero className="eyebrow">Premium multispecialty clinic · Chennai</p>
          <h1 data-hero className="text-[2.4rem] font-semibold leading-[1.05] text-navy-900 sm:text-6xl lg:text-7xl">
            Your Health Deserves <span className="text-teal-600">Exceptional</span> Care.
          </h1>
          <p data-hero className="mt-6 max-w-md text-lg leading-relaxed text-navy-700">
            Combining advanced medical expertise with compassionate care for you and your family.
          </p>
          <div data-hero className="mt-8 flex flex-wrap gap-3">
            <a href="#appointment" className="btn btn-primary">Book Appointment <ArrowRight size={16} aria-hidden="true" /></a>
            <a href="#specialities" className="btn btn-ghost">Explore Our Services</a>
          </div>
          <p data-hero className="mt-8 flex items-center gap-2 text-xs text-navy-600">
            <ShieldCheck size={16} className="text-teal-500" aria-hidden="true" />
            Fictional demonstration website – not a real clinic.
          </p>
        </div>
        {!webgl && (
          <div className="mt-10 md:mt-0"><HeartFallback /></div>
        )}
      </div>
      <a href="#about" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-600 md:flex" aria-label="Scroll to About">
        Scroll
        <span className="h-9 w-px animate-pulse bg-gradient-to-b from-teal-500 to-transparent" />
      </a>
    </section>
  )
}
