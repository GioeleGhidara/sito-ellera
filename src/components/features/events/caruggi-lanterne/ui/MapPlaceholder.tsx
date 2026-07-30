export default function MapPlaceholder({ label = "Mappa in arrivo.." }: { label?: string }) {
  return (
    <div className="cel-map-placeholder" role="img" aria-label={label}>
      <svg viewBox="0 0 64 64" className="cel-map-placeholder-icon" aria-hidden="true">
        <path
          d="M8 14 L24 8 L40 14 L56 8 L56 50 L40 56 L24 50 L8 56 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="24" y1="8" x2="24" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="40" y1="14" x2="40" y2="56" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="32" cy="30" r="4" fill="currentColor" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
