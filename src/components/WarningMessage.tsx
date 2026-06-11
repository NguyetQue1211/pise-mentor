interface WarningMessageProps {
  message: string;
}

export default function WarningMessage({ message }: WarningMessageProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-warning-100 bg-warning-50 px-4 py-3"
    >
      <span className="mt-0.5 text-warning-600 text-sm leading-none select-none">
        ⚠
      </span>
      <p className="text-sm text-warning-700">{message}</p>
    </div>
  );
}
