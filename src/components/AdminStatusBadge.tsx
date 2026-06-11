type AdminStatus =
  | "published"
  | "unpublished"
  | "complete"
  | "incomplete"
  | "linked"
  | "not-linked"
  | "valid-link"
  | "missing-link"
  | "invalid-link"
  | "check-link";

interface AdminStatusBadgeProps {
  status: AdminStatus;
}

type Variant = "success" | "warning" | "error" | "neutral";

const statusMap: Record<AdminStatus, { label: string; variant: Variant }> = {
  "published":     { label: "Published",     variant: "success"  },
  "unpublished":   { label: "Unpublished",   variant: "neutral"  },
  "complete":      { label: "Complete",      variant: "success"  },
  "incomplete":    { label: "Incomplete",    variant: "warning"  },
  "linked":        { label: "Linked",        variant: "success"  },
  "not-linked":    { label: "Not linked",    variant: "neutral"  },
  "valid-link":    { label: "Valid link",    variant: "success"  },
  "missing-link":  { label: "Missing link",  variant: "error"    },
  "invalid-link":  { label: "Invalid link",  variant: "error"    },
  "check-link":    { label: "Check link",    variant: "warning"  },
};

const variantClasses: Record<Variant, string> = {
  success: "bg-secondary-50 text-secondary-700 border-secondary-100",
  warning: "bg-warning-50 text-warning-700 border-warning-100",
  error:   "bg-error-50 text-error-700 border-error-100",
  neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const { label, variant } = statusMap[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
