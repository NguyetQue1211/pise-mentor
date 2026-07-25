import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-sm px-8 py-10 space-y-6 text-center">
        <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">
          PISE Mentors
        </p>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-neutral-900">Không tìm thấy trang</h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Trang bạn đang tìm không tồn tại hoặc đã bị gỡ bỏ.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/mentors"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105 transition-[filter]"
          >
            Xem danh sách mentor
          </Link>
        </div>
      </div>
    </main>
  )
}
