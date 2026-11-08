import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Media query hook (SSR-safe, updates on change). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/**
 * Reveals every [data-reveal] descendant of the returned ref as it scrolls into view.
 * data-reveal="up" (default) | "fade" | "left" | "right"; optional data-delay (seconds).
 * Content stays visible if motion is reduced or JS fails (CSS only hides under .js-motion).
 */
export function useScrollAnimation() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    if (prefersReducedMotion()) return
    document.documentElement.classList.add('js-motion')

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-reveal]', root)
      items.forEach((el) => {
        const kind = el.dataset.reveal || 'up'
        const from = { opacity: 0 }
        if (kind === 'up' || kind === '') from.y = 28
        if (kind === 'left') from.x = -40
        if (kind === 'right') from.x = 40
        gsap.fromTo(el, from, {
          opacity: 1, x: 0, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: parseFloat(el.dataset.delay || '0'),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return ref
}
