'use client'

export function OceanWaves({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Wave layer 1 - back, slow */}
      <svg
        className="absolute bottom-0 w-[200%] animate-wave-slow opacity-20"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#0ea5e9"
          d="M0,160 C240,260 480,60 720,160 C960,260 1200,60 1440,160 L1440,320 L0,320 Z"
        />
      </svg>
      {/* Wave layer 2 - mid */}
      <svg
        className="absolute bottom-0 w-[200%] animate-wave-mid opacity-15"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#38bdf8"
          d="M0,200 C180,280 360,120 540,200 C720,280 900,120 1080,200 C1260,280 1440,200 1440,200 L1440,320 L0,320 Z"
        />
      </svg>
      {/* Wave layer 3 - front, fast */}
      <svg
        className="absolute bottom-0 w-[200%] animate-wave-fast opacity-10"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#7dd3fc"
          d="M0,240 C160,300 320,180 480,240 C640,300 800,180 960,240 C1120,300 1280,240 1440,240 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  )
}

export function SailingShip({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-block animate-ship-bob ${className}`}>
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Mast */}
        <line x1="60" y1="8" x2="60" y2="50" stroke="#0c4a6e" strokeWidth="2" />
        {/* Big sail */}
        <path d="M60 10 L60 46 L86 46 Q72 28 60 10 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="1" />
        {/* Small sail */}
        <path d="M60 14 L60 44 L42 44 Q52 30 60 14 Z" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1" />
        {/* Flag */}
        <path d="M60 8 L72 10 L60 14 Z" fill="#ef4444" />
        {/* Hull */}
        <path d="M20 50 L100 50 L92 64 L28 64 Z" fill="#0c4a6e" />
        {/* Hull detail */}
        <path d="M26 54 L94 54" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
        {/* Cabin */}
        <rect x="48" y="42" width="24" height="8" rx="1" fill="#075985" />
        {/* Window */}
        <circle cx="55" cy="46" r="1.5" fill="#7dd3fc" />
        <circle cx="65" cy="46" r="1.5" fill="#7dd3fc" />
      </svg>
    </div>
  )
}

export function SteeringWheel({ className = '', spin = false }: { className?: string; spin?: boolean }) {
  const spokes = Array.from({ length: 8 }, (_, i) => i * 45)
  return (
    <div className={`inline-block ${spin ? 'animate-wheel-spin' : ''} ${className}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Handles - protruding outside the rim (pirate style) */}
        {spokes.map((deg) => (
          <g key={`h-${deg}`} transform={`rotate(${deg} 60 60)`}>
            <rect x="56.5" y="4" width="7" height="18" rx="3.5" fill="#c4a35a" stroke="#8b6914" strokeWidth="1" />
            <circle cx="60" cy="6" r="3" fill="#d4b56a" />
          </g>
        ))}
        {/* Outer rim - wooden */}
        <circle cx="60" cy="60" r="40" stroke="#a0783c" strokeWidth="7" fill="none" />
        <circle cx="60" cy="60" r="40" stroke="#c4a35a" strokeWidth="2.5" fill="none" />
        {/* Inner rim */}
        <circle cx="60" cy="60" r="30" stroke="#8b6914" strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* Spokes */}
        {spokes.map((deg) => (
          <g key={`s-${deg}`} transform={`rotate(${deg} 60 60)`}>
            <rect x="57.5" y="24" width="5" height="26" rx="2" fill="#a0783c" stroke="#8b6914" strokeWidth="0.8" />
          </g>
        ))}
        {/* Center hub */}
        <circle cx="60" cy="60" r="14" fill="#8b6914" stroke="#c4a35a" strokeWidth="2.5" />
        <circle cx="60" cy="60" r="8" fill="#a0783c" />
        <circle cx="60" cy="60" r="3.5" fill="#5c4410" />
      </svg>
    </div>
  )
}
