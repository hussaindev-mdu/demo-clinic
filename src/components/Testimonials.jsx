import { Quote } from 'lucide-react'
import { TESTIMONIALS } from '../data.js'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

export default function Testimonials() {
  const ref = useScrollAnimation()
  return (
    <section ref={ref} aria-labelledby="testi-title" className="bg-white">
      <div className="section">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p data-reveal className="eyebrow">Patient testimonials</p>
            <h2 id="testi-title" data-reveal className="text-4xl font-semibold sm:text-5xl">Kind words from our patients.</h2>
          </div>
          <p data-reveal className="rounded-full border border-teal-500/30 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700">Fictional demo testimonials</p>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.name} data-reveal data-delay={i * 0.1}>
              <figure className="card flex h-full flex-col p-8">
                <Quote className="text-teal-400" size={32} aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-navy-800">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-sky-100 font-display text-lg text-navy-700" aria-hidden="true">{t.name[0]}</span>
                  <span><span className="block font-semibold">{t.name}</span><span className="text-sm text-navy-600">{t.place}</span></span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
