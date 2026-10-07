export function CompanyLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Anchor circle */}
      <circle cx="24" cy="24" r="22" stroke="#0ea5e9" strokeWidth="2" fill="#0c4a6e" />
      {/* Ship hull */}
      <path
        d="M12 28 L36 28 L33 34 L15 34 Z"
        fill="#e0f2fe"
      />
      {/* Ship cabin */}
      <rect x="19" y="20" width="10" height="8" rx="1" fill="#7dd3fc" />
      {/* Mast */}
      <line x1="24" y1="10" x2="24" y2="20" stroke="#e0f2fe" strokeWidth="1.5" />
      {/* Sail */}
      <path d="M24 11 L24 19 L31 19 Z" fill="#bae6fd" />
      {/* Waves */}
      <path d="M10 38 Q14 36 18 38 T26 38 T34 38 T42 38" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
      <path d="M10 41 Q14 39 18 41 T26 41 T34 41 T42 41" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  )
}
