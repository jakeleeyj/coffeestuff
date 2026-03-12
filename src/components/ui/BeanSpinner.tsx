export default function BeanSpinner({ size = 20, label }: { size?: number; label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="bean-spinner"
      >
        <ellipse cx="12" cy="12" rx="7" ry="5" transform="rotate(-35 12 12)" stroke="#d4963f" strokeWidth="1.5" fill="rgba(212, 150, 63, 0.15)" />
        <path d="M12 7.5c0 2.5-1.5 4.5-1.5 4.5s1.5 2 1.5 4.5" stroke="#d4963f" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {label && <span className="text-xs text-text-muted">{label}</span>}
    </div>
  )
}
