const roastColors: Record<string, string> = {
  light: 'bg-amber-100 text-amber-800',
  medium: 'bg-coffee-300 text-coffee-900',
  dark: 'bg-coffee-800 text-cream',
}

export default function Badge({ label }: { label: string }) {
  const colorClass = roastColors[label] ?? 'bg-coffee-200 text-coffee-800'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {label}
    </span>
  )
}
