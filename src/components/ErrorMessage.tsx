interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-error-100 bg-error-50 px-4 py-3"
    >
      <span className="mt-0.5 text-error-600 text-sm leading-none select-none">
        ✕
      </span>
      <p className="text-sm text-error-700">{message}</p>
    </div>
  );
}
