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
  "published":     { label: "Đã công khai",     variant: "success"  },
  "unpublished":   { label: "Chưa công khai",   variant: "neutral"  },
  "complete":      { label: "Đầy đủ",           variant: "success"  },
  "incomplete":    { label: "Chưa đầy đủ",      variant: "warning"  },
  "linked":        { label: "Đã liên kết",      variant: "success"  },
  "not-linked":    { label: "Chưa liên kết",    variant: "neutral"  },
  "valid-link":    { label: "Link hợp lệ",      variant: "success"  },
  "missing-link":  { label: "Thiếu link",       variant: "error"    },
  "invalid-link":  { label: "Link không hợp lệ", variant: "error"    },
  "check-link":    { label: "Cần kiểm tra link", variant: "warning"  },
};

const variantClasses: Record<Variant, string> = {
  success: "bg-success-50 text-success-700 border-success-100",
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
