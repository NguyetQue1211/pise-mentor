function HeaderSkeleton() {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-14 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminLoading() {
  return (
    <>
      <HeaderSkeleton />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-primary-100 rounded" />
          <div className="h-7 w-64 bg-neutral-200 rounded-xl" />
          <div className="h-4 w-3/4 bg-neutral-100 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 space-y-2">
            <div className="h-4 w-32 bg-neutral-200 rounded" />
            <div className="h-3 w-full bg-neutral-100 rounded" />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 space-y-2">
            <div className="h-4 w-32 bg-neutral-200 rounded" />
            <div className="h-3 w-full bg-neutral-100 rounded" />
          </div>
        </div>
      </main>
    </>
  )
}
