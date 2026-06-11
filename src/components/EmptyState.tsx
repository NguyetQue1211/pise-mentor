"use client";

import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Renders a link-style action (server-safe). */
  actionLabel?: string;
  actionHref?: string;
  /** Renders a button-style action (e.g. clear filters). */
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <p className="text-base font-semibold text-neutral-800">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-neutral-500 max-w-sm">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
