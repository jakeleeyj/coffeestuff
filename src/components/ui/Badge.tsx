const variants: Record<string, string> = {
  light:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  medium: 'bg-bloom/10 text-bloom border border-bloom/20',
  dark:   'bg-surface-raised text-text-muted border border-border',
}

export default function Badge({ label }: { label: string }) {
  const cls = variants[label] ?? 'bg-surface-raised text-text-muted border border-border'
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize tracking-wide ${cls}`}>
      {label}
    </span>
  )
}
