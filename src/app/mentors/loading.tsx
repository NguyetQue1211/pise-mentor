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

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden h-80">
      <div className="h-3/4 w-full bg-neutral-100" />
      <div className="h-1/4 px-3 py-2.5 space-y-2">
        <div className="h-3 w-3/4 bg-neutral-200 rounded-full" />
        <div className="h-2.5 w-1/2 bg-neutral-100 rounded-full" />
      </div>
    </div>
  )
}

export default function MentorsLoading() {
  return (
    <>
      <HeaderSkeleton />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        {/* Page title */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-neutral-200 rounded-xl" />
          <div className="h-4 w-2/3 bg-neutral-100 rounded-full" />
        </div>

        {/* Browser layout */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Filters sidebar */}
          <aside className="lg:w-60 xl:w-64 shrink-0 space-y-6">
            <div className="h-4 w-16 bg-neutral-200 rounded" />
            {[1, 2, 3].map((g) => (
              <div key={g} className="space-y-2">
                <div className="h-3 w-20 bg-neutral-100 rounded" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((c) => (
                    <div key={c} className="h-7 w-20 bg-neutral-100 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* Card grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
