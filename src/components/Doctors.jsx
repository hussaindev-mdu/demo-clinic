import { useEffect, useRef, useState } from 'react'
import { X, Clock, GraduationCap } from 'lucide-react'
import DoctorPortrait from './DoctorPortrait.jsx'
import { DOCTORS, prefillAppointment } from '../data.js'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

function Profile({ doctor, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (doctor && d && !d.open) d.showModal()
    if (!doctor && d?.open) d.close()
  }, [doctor])
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-labelledby="doc-title" className="w-[min(92vw,38rem)] overflow-hidden rounded-3xl border-0 p-0 shadow-lift backdrop:bg-navy-900/50 backdrop:backdrop-blur-sm">
      {doctor && (
        <div className="grid sm:grid-cols-[200px_1fr]">
          <div className="h-56 sm:h-full"><DoctorPortrait doctor={doctor} /></div>
          <div className="relative p-7">
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-sky-50"><X size={20} /></button>
            <p className="eyebrow">Fictional demo profile</p>
            <h3 id="doc-title" className="text-3xl font-semibold">{doctor.name}</h3>
            <p className="mt-1 font-medium text-teal-700">{doctor.speciality}</p>
            <p className="mt-4 flex gap-2 text-sm text-navy-700"><GraduationCap size={18} className="shrink-0 text-teal-500" aria-hidden="true" />{doctor.quals}</p>
            <p className="mt-2 flex gap-2 text-sm text-navy-700"><Clock size={18} className="shrink-0 text-teal-500" aria-hidden="true" />{doctor.years} years of experience (fictional)</p>
            <p className="mt-4 text-sm leading-relaxed text-navy-700">{doctor.bio}</p>
            <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => { onClose(); prefillAppointment({ department: doctor.speciality, doctor: doctor.name }) }}>Send enquiry for this doctor</button>
          </div>
        </div>
      )}
    </dialog>
  )
}

export default function Doctors() {
  const ref = useScrollAnimation()
  const [selected, setSelected] = useState(null)
  return (
    <section id="doctors" ref={ref} className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-white shadow-[0_-30px_60px_-30px_rgba(10,37,64,0.18)]">
      <div className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p data-reveal className="eyebrow">Our doctors</p>
            <h2 data-reveal className="text-4xl font-semibold sm:text-5xl">Specialists who listen first.</h2>
          </div>
          <p data-reveal className="rounded-full border border-teal-500/30 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700">All profiles are fictional demonstration content</p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DOCTORS.map((d, i) => (
            <li key={d.id} data-reveal data-delay={i * 0.08}>
              <article className="card group flex h-full flex-col overflow-hidden">
                <div className="aspect-[4/4.4] overflow-hidden"><div className="h-full transition duration-700 group-hover:scale-105"><DoctorPortrait doctor={d} /></div></div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold">{d.name}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-teal-700">{d.speciality}</p>
                  <p className="mt-2 text-sm text-navy-700">{d.quals}</p>
                  <p className="mt-1 mb-5 text-sm text-navy-600">{d.years} years experience</p>
                  <button type="button" onClick={() => setSelected(d)} className="btn btn-ghost mt-auto w-full !py-2.5" aria-label={`View profile of ${d.name}`}>View Profile</button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <Profile doctor={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
