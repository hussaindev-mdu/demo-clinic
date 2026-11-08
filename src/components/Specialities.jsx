import { ArrowUpRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SPECIALITIES, prefillAppointment } from '../data.js'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

function Detail({ item, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (item && d && !d.open) d.showModal()
    if (!item && d?.open) d.close()
  }, [item])
  if (!item) return <dialog ref={ref} />
  const Icon = item.icon
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-labelledby="spec-title" className="w-[min(92vw,34rem)] rounded-3xl border-0 p-0 shadow-lift backdrop:bg-navy-900/50 backdrop:backdrop-blur-sm">
      <div className="p-7 sm:p-9">
        <div className="flex items-start justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-600"><Icon size={28} aria-hidden="true" /></span>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full hover:bg-sky-50"><X size={20} /></button>
        </div>
        <h3 id="spec-title" className="mt-5 text-3xl font-semibold">{item.name}</h3>
        <p className="mt-2 text-navy-700">{item.blurb}</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-teal-600">Commonly covered</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {item.topics.map((t) => <li key={t} className="rounded-xl bg-sky-50 px-3 py-2 text-sm text-navy-800">{t}</li>)}
        </ul>
        <p className="mt-5 text-xs text-navy-600">General information for this demo only – not medical advice.</p>
        <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => { onClose(); prefillAppointment({ department: item.name }) }}>Send an enquiry for {item.name}</button>
      </div>
    </dialog>
  )
}

export default function Specialities() {
  const ref = useScrollAnimation()
  const [selected, setSelected] = useState(null)
  return (
    <section id="specialities" ref={ref} className="relative bg-gradient-to-b from-transparent via-sky-25/85 to-sky-25">
      <div className="section">
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow">Our specialities</p>
          <h2 data-reveal className="text-4xl font-semibold text-navy-900 sm:text-5xl">Six departments, one coordinated team.</h2>
          <p data-reveal className="mt-4 text-lg text-navy-700">From everyday concerns to specialist care, find the right department and request an appointment enquiry in minutes.</p>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALITIES.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={s.name} data-reveal data-delay={(i % 3) * 0.1}>
                <article className="card group flex h-full flex-col p-7">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-50 to-sky-100 text-teal-600 transition duration-300 group-hover:scale-110 group-hover:from-teal-500 group-hover:to-teal-600 group-hover:text-white"><Icon size={28} aria-hidden="true" /></span>
                  <h3 className="mt-5 text-2xl font-semibold">{s.name}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-navy-700">{s.blurb}</p>
                  <button type="button" onClick={() => setSelected(s)} className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-teal-700 hover:gap-2.5 transition-all" aria-label={`Learn more about ${s.name}`}>
                    Learn More <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      <Detail item={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
