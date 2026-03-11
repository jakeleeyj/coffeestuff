export default function FeedLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
      <div className="h-8 w-20 bg-surface rounded-lg animate-pulse" />
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="aspect-square bg-surface-raised animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-surface-raised animate-pulse" />
              <div className="h-3 w-24 bg-surface-raised rounded animate-pulse" />
            </div>
            <div className="h-3 w-full bg-surface-raised rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-surface-raised rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
