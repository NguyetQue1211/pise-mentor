interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-neutral-900 leading-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-base text-neutral-600 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
