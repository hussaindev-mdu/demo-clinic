import { Target, Eye, Award, Activity, Layers, Waves } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

const PILLARS = [
  { icon: Target, title: 'Our mission', text: 'To deliver accurate, accessible and respectful healthcare that treats every patient as a person first.' },
  { icon: Eye, title: 'Our vision', text: 'A trusted neighbourhood centre where families find every speciality they need, together under one roof.' },
  { icon: Award, title: 'Medical excellence', text: 'Evidence-based practice, continuous learning and transparent communication in every consultation.' },
]

const INNOVATION = [
  { icon: Activity, text: 'Digital cardiac assessment tools' },
  { icon: Layers, text: 'Integrated records across departments' },
  { icon: Waves, text: 'On-site imaging and laboratory testing' },
]

/** Contains the "Medical Innovation" story beat; the 3D heart moves close beside this text. */
export default function About() {
  const ref = useScrollAnimation()
  return (
    <section id="about" ref={ref} className="relative">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 sm:px-8 md:min-h-[110vh] md:grid-cols-2 md:items-center md:py-32">
        <div className="md:col-start-2">
          <p data-reveal className="eyebrow">Medical innovation</p>
          <h2 data-reveal className="text-4xl font-semibold leading-tight text-navy-900 sm:text-5xl">Where technology supports the human touch.</h2>
          <p data-reveal className="mt-5 text-lg leading-relaxed text-navy-700">
            CarePlus Medical Centre is a fictional multispecialty clinic in Chennai. We imagine a healthcare experience where modern diagnostics help clinicians see more clearly, and clear explanations help patients feel confident about their care.
          </p>
          <p data-reveal className="mt-4 leading-relaxed text-navy-700">
            Look closely at the heart beside you: every chamber and vessel is a reminder of why precise assessment and calm, compassionate communication matter.
          </p>
          <ul className="mt-8 space-y-3">
            {INNOVATION.map(({ icon: Icon, text }) => (
              <li key={text} data-reveal className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white/85 px-4 py-3 shadow-soft backdrop-blur">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600"><Icon size={20} aria-hidden="true" /></span>
                <span className="font-medium text-navy-800">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }, i) => (
            <article key={title} data-reveal data-delay={i * 0.1} className="card bg-white/90 p-7 backdrop-blur">
              <Icon className="text-teal-500" size={28} aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-navy-700">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
