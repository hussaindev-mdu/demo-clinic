import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'
import { NAV } from '../data.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight current section
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV.forEach(({ id }) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])

  // Escape closes menu; keep focus trapped inside while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus() }
      if (e.key === 'Tab') {
        const f = [btnRef.current, ...menuRef.current.querySelectorAll('a')]
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const link = (id) => `text-sm font-medium transition-colors hover:text-teal-600 ${active === id ? 'text-teal-600' : 'text-navy-900'}`

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? 'bg-white/90 shadow-soft backdrop-blur-lg' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#home" aria-label="CarePlus Medical Centre – home"><Logo /></a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={link(n.id)} aria-current={active === n.id ? 'true' : undefined}>{n.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#appointment" className="btn btn-primary hidden !py-2.5 sm:inline-flex">Book Appointment</a>
          <button
            ref={btnRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-navy-900/15 bg-white/80 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-white px-5 pb-10 pt-4 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="divide-y divide-sky-100">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 font-display text-2xl text-navy-900">{n.label}</a>
              </li>
            ))}
          </ul>
          <a href="#appointment" onClick={() => setOpen(false)} className="btn btn-primary mt-6 w-full">Book Appointment</a>
        </nav>
      </div>
    </header>
  )
}
