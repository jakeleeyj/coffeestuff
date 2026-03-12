export default function BeansLoading() {
  return (
    <div className="max-w-lg md:max-w-4xl mx-auto px-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-8 w-36" />
        <div className="skeleton h-9 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="rounded-2xl border border-border/50 p-4 space-y-3" style={{ opacity: 1 - i * 0.12 }}>
            <div className="flex justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
              <div className="skeleton h-5 w-14 rounded-full" />
            </div>
            <div className="skeleton h-3 w-1/3" />
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map(j => (
                <div key={j} className="skeleton w-4 h-4 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
