import Logo from './Logo.jsx'
import { NAV, SPECIALITIES, CLINIC } from '../data.js'

const icon = (children) => (p) => (
  <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)
const Facebook = icon(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />)
const Instagram = icon(<><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>)
const Twitter = icon(<path d="M4 4l16 16M20 4L4 20" />)
const Linkedin = icon(<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /></>)

const SOCIAL = [
  { icon: Facebook, label: 'Facebook' }, { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'X (Twitter)' }, { icon: Linkedin, label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-sky-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{CLINIC.tagline}</p>
          <ul className="mt-5 flex gap-3">
            {SOCIAL.map(({ icon: Icon, label }) => (
              <li key={label}><a href="#home" aria-label={`${label} (demo link)`} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition hover:border-teal-400 hover:text-teal-400"><Icon size={18} aria-hidden="true" /></a></li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">Navigate</h2>
          <ul className="mt-4 space-y-2 text-sm">{NAV.map((n) => <li key={n.id}><a className="hover:text-teal-400" href={`#${n.id}`}>{n.label}</a></li>)}</ul>
        </nav>
        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">Departments</h2>
          <ul className="mt-4 space-y-2 text-sm">{SPECIALITIES.map((s) => <li key={s.name}><a className="hover:text-teal-400" href="#specialities">{s.name}</a></li>)}</ul>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">Contact</h2>
          <address className="mt-4 space-y-1 text-sm not-italic">{CLINIC.address.map((l) => <p key={l}>{l}</p>)}<p className="pt-2">{CLINIC.phone} (demo)</p><p>{CLINIC.email}</p></address>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs sm:px-8">
        <p>© {new Date().getFullYear()} CarePlus Medical Centre. A fictional demonstration website – all doctors, testimonials, contact details and services are invented.</p>
        <p className="mt-1">Nothing on this site is medical advice. In an emergency call 112.</p>
      </div>
    </footer>
  )
}
