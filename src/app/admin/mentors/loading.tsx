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

export default function AdminMentorsLoading() {
  return (
    <>
      <HeaderSkeleton />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-primary-100 rounded" />
            <div className="h-7 w-48 bg-neutral-200 rounded-xl" />
          </div>
          <div className="h-10 w-44 bg-primary-200 rounded-xl" />
        </div>

        {/* Table skeleton */}
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          {/* Table header */}
          <div className="border-b border-neutral-100 px-4 py-3 flex gap-6">
            {['w-32', 'w-16', 'w-20', 'w-20', 'w-24', 'w-20'].map((w, i) => (
              <div key={i} className={`h-3 ${w} bg-neutral-100 rounded`} />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-neutral-100 last:border-0 px-4 py-3 flex items-center gap-6"
            >
              <div className="space-y-1.5 flex-1 max-w-[200px]">
                <div className="h-4 w-full bg-neutral-200 rounded" />
                <div className="h-3 w-3/4 bg-neutral-100 rounded" />
              </div>
              <div className="h-5 w-14 bg-neutral-100 rounded-full hidden sm:block" />
              <div className="h-5 w-20 bg-neutral-100 rounded-full hidden md:block" />
              <div className="h-5 w-16 bg-neutral-100 rounded-full hidden md:block" />
              <div className="h-5 w-20 bg-neutral-100 rounded-full" />
              <div className="h-4 w-16 bg-neutral-100 rounded hidden lg:block" />
              <div className="flex gap-2 ml-auto">
                <div className="h-8 w-14 bg-neutral-100 rounded-lg" />
                <div className="h-8 w-20 bg-neutral-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
