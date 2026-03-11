const variants: Record<string, string> = {
  light:  'bg-amber-900/30 text-amber-300 border border-amber-800/40',
  medium: 'bg-bloom-glow text-bloom border border-bloom-dim',
  dark:   'bg-surface-raised text-text-muted border border-border',
}

export default function Badge({ label }: { label: string }) {
  const cls = variants[label] ?? 'bg-surface-raised text-text-muted border border-border'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${cls}`}>
      {label}
    </span>
  )
}
