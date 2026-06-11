import AppHeader from "@/components/AppHeader";

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-lg space-y-5">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest">
            PISE Mentorship Portal
          </p>
          <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
            Find the right mentor for your next step
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            Browse PISE mentors by location, discipline, and industry. Open a
            mentor profile to understand what they can help with before booking.
          </p>
          <p className="text-sm text-neutral-400">
            Portal access is by invitation only. Sign in with your approved
            PISE email to get started.
          </p>
        </div>
      </main>
    </>
  );
}
