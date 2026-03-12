export default function FeedLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
      {/* Greeting skeleton */}
      <div>
        <div className="skeleton h-7 w-48 mb-2" />
        <div className="skeleton h-4 w-32" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex gap-2">
        {[40, 64, 56, 72, 48].map((w, i) => (
          <div key={i} className="skeleton h-7 rounded-full shrink-0" style={{ width: w }} />
        ))}
      </div>

      {/* Hero card skeleton */}
      <div className="rounded-2xl overflow-hidden border border-border/50">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="skeleton h-3.5 w-20" />
        </div>
        <div className="skeleton aspect-[4/5] rounded-none" />
        <div className="px-4 pt-3 pb-4 space-y-2.5">
          <div className="flex gap-2">
            <div className="skeleton w-6 h-6 rounded" />
            <div className="skeleton w-6 h-6 rounded" />
          </div>
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-3/5" />
        </div>
      </div>

      {/* Regular card skeletons */}
      {[0, 1].map(i => (
        <div key={i} className="rounded-2xl overflow-hidden border border-border/50" style={{ opacity: 1 - i * 0.3 }}>
          <div className="flex items-center gap-2.5 px-4 py-3">
            <div className="skeleton w-7 h-7 rounded-full" />
            <div className="skeleton h-3.5 w-20" />
          </div>
          <div className="skeleton aspect-square rounded-none" />
          <div className="px-4 pt-3 pb-4 space-y-2.5">
            <div className="flex gap-2">
              <div className="skeleton w-6 h-6 rounded" />
              <div className="skeleton w-6 h-6 rounded" />
            </div>
            <div className="skeleton h-3.5 w-full" />
            <div className="skeleton h-3.5 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
