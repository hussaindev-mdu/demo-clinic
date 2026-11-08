import { CheckCircle2 } from 'lucide-react'
import { WHY } from '../data.js'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

export default function WhyChooseUs() {
  const ref = useScrollAnimation()
  return (
    <section ref={ref} aria-labelledby="why-title" className="relative bg-navy-900 text-white">
      <div className="section grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p data-reveal className="eyebrow !text-teal-400">Why choose CarePlus</p>
          <h2 id="why-title" data-reveal className="text-4xl font-semibold sm:text-5xl">Care that feels as good as it works.</h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {WHY.map((w, i) => (
            <li key={w.title} data-reveal data-delay={i * 0.07} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
              <CheckCircle2 className="text-teal-400" size={24} aria-hidden="true" />
              <h3 className="mt-3 text-xl font-semibold">{w.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-sky-200">{w.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
