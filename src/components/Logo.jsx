export default function Logo({ light = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill={light ? '#fff' : '#0a2540'} />
        <path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" fill="#2bb5ab" />
      </svg>
      <span className={`font-display text-xl font-semibold leading-none ${light ? 'text-white' : 'text-navy-900'}`}>
        CarePlus<span className="block pt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-500">Medical Centre</span>
      </span>
    </span>
  )
}
