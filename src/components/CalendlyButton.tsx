interface CalendlyButtonProps {
  url?: string;
}

export default function CalendlyButton({ url }: CalendlyButtonProps) {
  if (!url) {
    return (
      <p className="text-sm text-neutral-500">
        Booking is temporarily unavailable for this mentor.
      </p>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
    >
      Book via Calendly
      <span aria-hidden="true" className="text-xs opacity-75">↗</span>
    </a>
  );
}
