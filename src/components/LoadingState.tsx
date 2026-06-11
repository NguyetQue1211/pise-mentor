interface LoadingStateProps {
  rows?: number;
}

export default function LoadingState({ rows = 3 }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="space-y-4 animate-pulse"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <div className="h-4 bg-neutral-200 rounded-full w-1/3" />
          <div className="h-3 bg-neutral-100 rounded-full w-2/3" />
          <div className="h-3 bg-neutral-100 rounded-full w-1/2" />
        </div>
      ))}
    </div>
  );
}
