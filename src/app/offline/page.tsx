export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-4xl mb-4">☕</p>
      <h1 className="font-display text-2xl text-text mb-2">You&apos;re offline</h1>
      <p className="text-sm text-text-muted">Check your connection and try again.</p>
    </div>
  )
}
