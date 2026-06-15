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

export default function HomeLoading() {
  return (
    <>
      <HeaderSkeleton />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-16 space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-3 w-40 bg-primary-100 rounded-full" />
          <div className="h-9 w-3/4 bg-neutral-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-neutral-100 rounded-full" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded-full" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 shrink-0" />
              <div className="flex-1 h-4 bg-neutral-100 rounded-full" />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-36 bg-primary-200 rounded-xl" />
        </div>
      </main>
    </>
  )
}
