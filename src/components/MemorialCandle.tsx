/**
 * Refined memorial candle — slim ivory taper on a minimal gold base,
 * with a soft warm glow (redesigned per family feedback).
 */
export function MemorialCandle() {
  return (
    <div className="relative">
      {/* Soft outer glow */}
      <div
        className="absolute -inset-14 bg-gradient-radial from-amber-200/25 via-amber-100/5 to-transparent rounded-full animate-pulse"
        style={{ animationDuration: '5s' }}
      />
      <div className="absolute -inset-6 bg-gradient-radial from-amber-200/30 to-transparent rounded-full animate-candle-glow" />

      <div className="relative flex flex-col items-center">
        {/* Flame */}
        <svg className="w-8 h-14 animate-flame" viewBox="0 0 32 56" fill="none">
          <defs>
            <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#c5741a" />
              <stop offset="35%" stopColor="#e9a23b" />
              <stop offset="70%" stopColor="#f7cf6f" />
              <stop offset="100%" stopColor="#fdf3d0" />
            </linearGradient>
            <filter id="flameGlow">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Slender teardrop flame */}
          <path
            d="M16 2C16 2 5 20 5 35C5 46 9.9 54 16 54C22.1 54 27 46 27 35C27 20 16 2 16 2Z"
            fill="url(#flameGradient)"
            filter="url(#flameGlow)"
          />
          <ellipse cx="16" cy="40" rx="4.5" ry="8" fill="#fffbe9" opacity="0.9" />
        </svg>

        {/* Wick */}
        <div className="w-0.5 h-1.5 bg-[#3a2d1a] rounded-full -mt-1" />

        {/* Slim taper candle */}
        <div className="w-6 h-28 bg-gradient-to-b from-[#faf6ec] via-[#f0e8d6] to-[#e3d7bf] rounded-t-[3px] shadow-md relative overflow-hidden">
          {/* Subtle wax highlight */}
          <div className="absolute top-0 bottom-0 start-1 w-1.5 bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-full" />
        </div>

        {/* Minimal matte-gold base */}
        <div className="w-10 h-1.5 bg-gradient-to-b from-[#d8b877] to-[#c5a059] rounded-sm" />
        <div className="w-14 h-1 bg-gradient-to-b from-[#a9884b] to-[#8a6f3c] rounded-b-md" />
      </div>
    </div>
  )
}
