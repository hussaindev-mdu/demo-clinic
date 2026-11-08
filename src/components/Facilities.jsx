import { BedDouble, Accessibility, Wifi, Car } from 'lucide-react'
import FacilityArt from './FacilityArt.jsx'
import { FACILITIES } from '../data.js'
import { FACILITY_PHOTOS } from '../assets/images.js'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

const SERVICES = [
  { icon: Accessibility, label: 'Step-free access' },
  { icon: Wifi, label: 'Free waiting-area Wi-Fi' },
  { icon: Car, label: 'On-site parking' },
  { icon: BedDouble, label: 'Day-care observation beds' },
]

export default function Facilities() {
  const ref = useScrollAnimation()
  return (
    <section id="facilities" ref={ref} className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-gradient-to-b from-sky-25 to-white">
      <div className="section">
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow">Patient care &amp; facilities</p>
          <h2 data-reveal className="text-4xl font-semibold sm:text-5xl">A bright, calm space designed around you.</h2>
          <p data-reveal className="mt-4 text-lg text-navy-700">Thoughtful design reduces stress for patients and families, from the moment you walk in.</p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {FACILITIES.map((f, i) => {
            const photo = FACILITY_PHOTOS[f.key]
            const span = i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'
            return (
              <li key={f.key} data-reveal data-delay={(i % 3) * 0.08} className={span}>
                <figure className="card group relative h-full overflow-hidden">
                  <div className={`${i < 2 ? 'aspect-[16/9]' : 'aspect-[4/3]'} overflow-hidden`}>
                    <div className="h-full w-full transition duration-700 group-hover:scale-105">
                      {photo ? <img src={photo} alt={`${f.title} at CarePlus Medical Centre`} loading="lazy" className="h-full w-full object-cover" /> : <FacilityArt kind={f.key} label={f.title} />}
                    </div>
                  </div>
                  <figcaption className="p-5">
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-navy-700">{f.text}</p>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, label }) => (
            <li key={label} data-reveal className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-4 shadow-soft">
              <Icon size={22} className="shrink-0 text-teal-500" aria-hidden="true" />
              <span className="text-sm font-medium text-navy-800">{label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-navy-600">Illustrations stand in for facility photography in this fictional demo.</p>
      </div>
    </section>
  )
}
