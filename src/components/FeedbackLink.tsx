interface FeedbackLinkProps {
  url?: string;
}

export default function FeedbackLink({ url }: FeedbackLinkProps) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors underline-offset-2 hover:underline"
    >
      Gửi phản hồi buổi mentoring
      <span aria-hidden="true" className="text-xs">↗</span>
    </a>
  );
}
