type TagVariant = "location" | "industry" | "support_area" | "default";

interface MentorTagProps {
  label: string;
  variant?: TagVariant;
}

const variantClasses: Record<TagVariant, string> = {
  location:     "bg-neutral-100 text-neutral-600",
  industry:     "bg-secondary-50 text-secondary-700",
  support_area: "bg-neutral-100 text-neutral-600",
  default:      "bg-neutral-100 text-neutral-600",
};

export default function MentorTag({ label, variant = "default" }: MentorTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
