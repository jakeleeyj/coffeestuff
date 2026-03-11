export default function PostLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-surface animate-pulse" />
        <div className="h-3 w-24 bg-surface rounded animate-pulse" />
      </div>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="aspect-square bg-surface-raised animate-pulse" />
        <div className="p-5 space-y-3">
          <div className="h-5 w-20 bg-surface-raised rounded-full animate-pulse" />
          <div className="h-3 w-full bg-surface-raised rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-surface-raised rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
