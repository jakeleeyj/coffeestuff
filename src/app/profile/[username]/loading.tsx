export default function ProfileLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-8">
      <div className="rounded-2xl border border-border/50 flex flex-col items-center text-center gap-4 p-6">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="space-y-2 w-full flex flex-col items-center">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-3.5 w-20" />
        </div>
        <div className="skeleton h-3.5 w-16" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-1 md:gap-2">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton aspect-square rounded-lg" style={{ opacity: 1 - i * 0.12 }} />
        ))}
      </div>
    </div>
  )
}
