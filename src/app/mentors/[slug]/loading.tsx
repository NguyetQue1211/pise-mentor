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

export default function MentorProfileLoading() {
  return (
    <>
      <HeaderSkeleton />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8 animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0 w-28 h-28 rounded-2xl bg-primary-100" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-2/3 bg-neutral-200 rounded-xl" />
            <div className="h-4 w-1/2 bg-neutral-100 rounded-full" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-24 bg-neutral-100 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="border-t border-neutral-200 pt-8 space-y-7">
          {[1, 2, 3].map((s) => (
            <div key={s} className="space-y-2">
              <div className="h-3 w-32 bg-neutral-200 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-4 w-full bg-neutral-100 rounded-full" />
                <div className="h-4 w-5/6 bg-neutral-100 rounded-full" />
                <div className="h-4 w-4/6 bg-neutral-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border-t border-neutral-200 pt-6">
          <div className="h-10 w-40 bg-primary-200 rounded-xl" />
        </div>
      </main>
    </>
  )
}
