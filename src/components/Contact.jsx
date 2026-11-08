import { MapPin, Phone, Clock, MessageCircle, Mail } from 'lucide-react'
import { CLINIC, HOURS } from '../data.js'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

function MapPlaceholder() {
  return (
    <div className="relative h-full min-h-[300px] overflow-hidden rounded-3xl border border-sky-100 bg-sky-100" role="img" aria-label="Map placeholder – embed Google Maps here">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="300" fill="#e4eefb" />
        <path d="M0 210c80-30 120 20 200-10s140-60 200-30v130H0z" fill="#cfe2f7" />
        <g stroke="#fff" strokeWidth="14" strokeLinecap="round" fill="none"><path d="M-10 90L410 140" /><path d="M120-10l60 320" /><path d="M280-10l-40 320" /></g>
        <g stroke="#fff" strokeWidth="6" fill="none"><path d="M-10 180L410 60" /><path d="M0 40l200 60" /></g>
        <rect x="205" y="40" width="50" height="34" rx="6" fill="#c9ece9" /><rect x="40" y="110" width="60" height="40" rx="6" fill="#c9ece9" />
      </svg>
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-full text-center">
        <MapPin size={44} className="mx-auto fill-teal-500 text-white drop-shadow-lg" aria-hidden="true" />
      </div>
      <p className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 p-3 text-center text-xs font-medium text-navy-700 backdrop-blur">Google Maps placeholder – replace with your embed code (fictional location)</p>
    </div>
  )
}

export default function Contact() {
  const ref = useScrollAnimation()
  return (
    <section id="contact" ref={ref} className="bg-white">
      <div className="section">
        <p data-reveal className="eyebrow">Contact</p>
        <h2 data-reveal className="text-4xl font-semibold sm:text-5xl">Visit or get in touch.</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4">
            <div data-reveal className="card flex gap-4 p-6 hover:!translate-y-0">
              <MapPin className="mt-1 shrink-0 text-teal-500" aria-hidden="true" />
              <address className="not-italic leading-relaxed text-navy-800"><strong className="block">Address</strong>{CLINIC.address.map((l) => <span key={l} className="block">{l}</span>)}</address>
            </div>
            <div data-reveal className="card flex gap-4 p-6 hover:!translate-y-0">
              <Phone className="mt-1 shrink-0 text-teal-500" aria-hidden="true" />
              <div><strong>Phone <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-navy-700">DEMO</span></strong><p className="text-navy-800">{CLINIC.phone}</p><p className="text-xs text-navy-600">Placeholder number – not a working line.</p></div>
            </div>
            <div data-reveal className="card flex gap-4 p-6 hover:!translate-y-0">
              <Clock className="mt-1 shrink-0 text-teal-500" aria-hidden="true" />
              <div className="w-full"><strong>Opening hours</strong>
                <dl className="mt-1 space-y-1 text-navy-800">{HOURS.map(([d, t]) => <div key={d} className="flex flex-wrap justify-between gap-x-4"><dt>{d}</dt><dd className="font-medium">{t}</dd></div>)}</dl>
              </div>
            </div>
            <div data-reveal className="flex flex-wrap gap-3">
              <a className="btn btn-primary" href={`https://wa.me/?text=${encodeURIComponent('Hello CarePlus Medical Centre (demo), I would like to enquire about an appointment.')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp enquiry<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a className="btn btn-ghost" href={`mailto:${CLINIC.email}`}><Mail size={18} aria-hidden="true" /> Email (demo)</a>
            </div>
          </div>
          <div data-reveal><MapPlaceholder /></div>
        </div>
      </div>
    </section>
  )
}
