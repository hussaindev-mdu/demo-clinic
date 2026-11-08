/** Static illustration shown when WebGL is unavailable. */
export default function HeartFallback({ className = '' }) {
  return (
    <svg viewBox="0 0 400 420" role="img" aria-label="Illustration of an anatomical human heart" className={`mx-auto w-full max-w-md ${className}`}>
      <defs>
        <radialGradient id="hf-body" cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="#d4586b" /><stop offset=".55" stopColor="#9b1f31" /><stop offset="1" stopColor="#5b0e1d" />
        </radialGradient>
        <linearGradient id="hf-art" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e57a8a" /><stop offset="1" stopColor="#b8344a" /></linearGradient>
        <linearGradient id="hf-vein" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7f8fcf" /><stop offset="1" stopColor="#4a5a9a" /></linearGradient>
        <filter id="hf-shadow"><feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#0a2540" floodOpacity=".22" /></filter>
      </defs>
      <g filter="url(#hf-shadow)">
        <path d="M150 120c-8-50 10-95 40-100 18-2 28 12 30 30 2 40-6 80-28 110z" fill="url(#hf-art)" />
        <path d="M232 128c4-38 30-70 66-62 28 6 36 40 10 62-14 12-40 18-76 14z" fill="url(#hf-vein)" />
        <path d="M110 150c0-24 20-38 50-34 56 6 120 0 150 30 34 34 20 90-14 150-30 54-70 100-92 118-22-18-62-62-86-118-16-38-8-110-8-146z" fill="url(#hf-body)" />
        <path d="M205 140c6 70 4 140-6 210" stroke="#e8a3ac" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".7" />
        <path d="M205 150c30 20 60 50 76 100" stroke="#e8a3ac" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".6" />
        <ellipse cx="170" cy="190" rx="38" ry="64" fill="#fff" opacity=".1" />
      </g>
    </svg>
  )
}
