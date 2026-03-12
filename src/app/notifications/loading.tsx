export default function NotificationsLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
      <div className="skeleton h-8 w-36 mb-6" />
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/50" style={{ opacity: 1 - i * 0.15 }}>
            <div className="skeleton w-9 h-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3.5 w-3/4" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
