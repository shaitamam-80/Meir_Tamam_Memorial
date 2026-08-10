export function MemorialCandle() {
  return (
    <div className="relative">
      {/* Outer glow */}
      <div
        className="absolute -inset-12 bg-gradient-radial from-amber-100/40 via-amber-50/10 to-transparent rounded-full animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      {/* Inner glow */}
      <div className="absolute -inset-6 bg-gradient-radial from-amber-200/50 to-transparent rounded-full animate-candle-glow" />

      <div className="relative">
        {/* Flame */}
        <svg className="w-12 h-20 mx-auto animate-flame" viewBox="0 0 48 80" fill="none">
          <defs>
            <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef9c3" />
            </linearGradient>
            <filter id="flameGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M24 0C24 0 4 28 4 52C4 68 12.954 80 24 80C35.046 80 44 68 44 52C44 28 24 0 24 0Z"
            fill="url(#flameGradient)"
            filter="url(#flameGlow)"
          />
          <ellipse cx="24" cy="58" rx="8" ry="12" fill="#fffbeb" opacity="0.9" />
          <ellipse cx="24" cy="60" rx="4" ry="8" fill="#fff" opacity="0.7" />
        </svg>

        {/* Candle body */}
        <div className="w-10 h-24 bg-gradient-to-b from-[#faf8f5] via-[#f0ebe0] to-[#e5ddd0] rounded-t-sm mx-auto shadow-md relative overflow-hidden">
          <div className="absolute top-0 start-1 w-2 h-4 bg-gradient-to-b from-white/60 to-transparent rounded-b-full" />
          <div className="absolute top-0 end-2 w-1.5 h-3 bg-gradient-to-b from-white/40 to-transparent rounded-b-full" />
        </div>

        {/* Candle holder */}
        <div className="relative">
          <div className="w-14 h-3 bg-gradient-to-b from-[#c9a962] via-[#b8963e] to-[#a08040] rounded-t-sm mx-auto" />
          <div className="w-16 h-2 bg-gradient-to-b from-[#a08040] to-[#7a6030] mx-auto" />
          <div className="w-20 h-3 bg-gradient-to-b from-[#7a6030] via-[#8a7040] to-[#6a5020] rounded-b-md mx-auto shadow-lg" />
        </div>
      </div>
    </div>
  )
}
