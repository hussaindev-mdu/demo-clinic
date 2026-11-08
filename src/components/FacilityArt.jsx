/** Lightweight illustrated scenes used until real facility photography is supplied. */
const wall = <rect width="400" height="260" fill="#eef5fd" />
const floor = <rect y="190" width="400" height="70" fill="#dfeafa" />

const SCENES = {
  consult: (
    <>
      {wall}{floor}
      <rect x="40" y="30" width="110" height="90" rx="8" fill="#fff" stroke="#c5d9f2" strokeWidth="4" /><path d="M95 30v90M40 75h110" stroke="#c5d9f2" strokeWidth="3" />
      <rect x="190" y="130" width="170" height="14" rx="6" fill="#1c4673" /><rect x="205" y="144" width="10" height="56" fill="#12345a" /><rect x="335" y="144" width="10" height="56" fill="#12345a" />
      <rect x="250" y="90" width="64" height="40" rx="5" fill="#0a2540" /><rect x="255" y="95" width="54" height="30" rx="3" fill="#2bb5ab" opacity=".7" /><rect x="276" y="130" width="12" height="6" fill="#0a2540" />
      <rect x="120" y="150" width="50" height="14" rx="7" fill="#2bb5ab" /><rect x="132" y="164" width="8" height="36" fill="#0b857c" />
      <circle cx="60" cy="170" r="16" fill="#2bb5ab" opacity=".25" />
    </>
  ),
  diagnostic: (
    <>
      {wall}{floor}
      <circle cx="200" cy="120" r="78" fill="#fff" stroke="#c5d9f2" strokeWidth="6" /><circle cx="200" cy="120" r="46" fill="#0a2540" /><circle cx="200" cy="120" r="46" fill="none" stroke="#2bb5ab" strokeWidth="4" opacity=".7" />
      <rect x="60" y="150" width="280" height="16" rx="8" fill="#1c4673" /><rect x="90" y="166" width="12" height="34" fill="#12345a" /><rect x="298" y="166" width="12" height="34" fill="#12345a" />
      <rect x="320" y="40" width="50" height="34" rx="4" fill="#0a2540" /><path d="M326 58h8l4-8 6 14 4-6h16" stroke="#2bb5ab" strokeWidth="2.5" fill="none" />
    </>
  ),
  waiting: (
    <>
      {wall}{floor}
      <rect x="40" y="110" width="150" height="56" rx="14" fill="#2d5a8a" /><rect x="40" y="90" width="150" height="34" rx="14" fill="#1c4673" /><rect x="52" y="166" width="8" height="24" fill="#12345a" /><rect x="170" y="166" width="8" height="24" fill="#12345a" />
      <rect x="220" y="110" width="140" height="56" rx="14" fill="#0e9f94" /><rect x="220" y="90" width="140" height="34" rx="14" fill="#0b857c" />
      <rect x="196" y="150" width="16" height="30" rx="3" fill="#a56b3d" /><path d="M204 150c-14-14-14-30 0-40 14 10 14 26 0 40z" fill="#2bb5ab" /><path d="M204 150c-22-4-30-16-28-28 16 2 28 12 28 28z" fill="#0e9f94" />
      <circle cx="320" cy="50" r="22" fill="#fff" stroke="#c5d9f2" strokeWidth="4" /><path d="M320 38v12l8 6" stroke="#1c4673" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  treatment: (
    <>
      {wall}{floor}
      <rect x="110" y="120" width="200" height="30" rx="12" fill="#fff" stroke="#c5d9f2" strokeWidth="4" /><rect x="110" y="104" width="60" height="22" rx="10" fill="#c9ece9" /><rect x="130" y="150" width="10" height="42" fill="#12345a" /><rect x="280" y="150" width="10" height="42" fill="#12345a" />
      <rect x="338" y="40" width="5" height="150" fill="#1c4673" /><rect x="324" y="34" width="34" height="5" rx="2" fill="#1c4673" /><rect x="322" y="52" width="14" height="26" rx="5" fill="#c9ece9" stroke="#2bb5ab" strokeWidth="2" />
      <path d="M30 20h50v140H30z" fill="#c9ece9" opacity=".8" /><path d="M40 20v140M52 20v140M64 20v140" stroke="#fff" strokeWidth="3" opacity=".7" />
    </>
  ),
  lab: (
    <>
      {wall}{floor}
      <rect x="30" y="140" width="340" height="14" rx="5" fill="#1c4673" /><rect x="50" y="154" width="300" height="46" fill="#dfeafa" /><path d="M200 154v46" stroke="#c5d9f2" strokeWidth="3" />
      <path d="M90 140v-28l-12-30" stroke="#0a2540" strokeWidth="9" strokeLinecap="round" fill="none" /><rect x="70" y="72" width="30" height="12" rx="5" fill="#0a2540" /><rect x="76" y="140" width="40" height="6" rx="3" fill="#0a2540" />
      {[170, 200, 230, 260].map((x, i) => (
        <g key={x}><rect x={x} y="96" width="18" height="44" rx="9" fill="#fff" stroke="#c5d9f2" strokeWidth="3" /><rect x={x + 3} y={118 - i * 4} width="12" height={22 + i * 4} rx="6" fill={['#2bb5ab', '#e57a8a', '#7f8fcf', '#f0c36d'][i]} opacity=".85" /></g>
      ))}
      <rect x="300" y="82" width="52" height="58" rx="6" fill="#fff" stroke="#c5d9f2" strokeWidth="4" /><circle cx="326" cy="108" r="12" fill="#0e9f94" opacity=".3" />
    </>
  ),
}

export default function FacilityArt({ kind, label }) {
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label={`Illustration: ${label} (placeholder for photography)`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {SCENES[kind]}
    </svg>
  )
}
