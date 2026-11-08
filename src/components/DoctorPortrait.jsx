import { useId } from 'react'
import { PORTRAITS } from '../assets/images.js'

/** Illustrated placeholder portrait. Swap with real photography via src/assets/images.js. */
export default function DoctorPortrait({ doctor }) {
  const id = useId()
  const photo = PORTRAITS[doctor.id]
  if (photo) return <img src={photo} alt={`Portrait of ${doctor.name}`} loading="lazy" className="h-full w-full object-cover" />
  const [bg, accent] = doctor.tone
  const f = doctor.gender === 'f'
  return (
    <svg viewBox="0 0 300 340" role="img" aria-label={`Illustrated placeholder portrait of ${doctor.name} (fictional)`} className="h-full w-full">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={bg} /><stop offset="1" stopColor="#fff" /></linearGradient>
      </defs>
      <rect width="300" height="340" fill={`url(#${id}-bg)`} />
      <circle cx="230" cy="70" r="90" fill={accent} opacity=".1" />
      {f && <path d="M92 150c-6-60 30-92 58-92s64 32 58 92c2 40 10 70 6 96H86c-4-26 4-56 6-96z" fill={doctor.hair} />}
      {/* coat + shoulders */}
      <path d="M40 340c0-70 40-100 110-100s110 30 110 100z" fill="#fff" />
      <path d="M118 240l32 52 32-52" fill="#e8f7f6" />
      <path d="M150 292v48" stroke="#c9ece9" strokeWidth="2" />
      <path d="M104 244c-8 30 6 60 30 66" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <circle cx="136" cy="314" r="9" fill="none" stroke={accent} strokeWidth="5" />
      {/* neck + head */}
      <rect x="132" y="206" width="36" height="44" rx="14" fill={doctor.skin} />
      <ellipse cx="150" cy="160" rx="52" ry="62" fill={doctor.skin} />
      {!f && <path d="M97 150c-4-48 22-78 53-78s57 30 53 78c-10-24-26-34-53-34s-43 10-53 34z" fill={doctor.hair} />}
      {f && <path d="M98 152c6-40 26-60 52-60s46 20 52 60c-14-14-30-22-52-22s-38 8-52 22z" fill={doctor.hair} />}
      <circle cx="130" cy="164" r="4.2" fill="#2a1d18" /><circle cx="170" cy="164" r="4.2" fill="#2a1d18" />
      <path d="M134 192c10 9 22 9 32 0" fill="none" stroke="#7b3f32" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
