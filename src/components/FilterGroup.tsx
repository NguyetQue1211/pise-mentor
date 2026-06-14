'use client'

export type FilterOption = {
  slug: string
  label: string
}

interface FilterGroupProps {
  label: string
  options: FilterOption[]
  selected: string[]
  onChange: (slug: string) => void
}

export default function FilterGroup({
  label,
  options,
  selected,
  onChange,
}: FilterGroupProps) {
  if (options.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.slug)
          return (
            <button
              key={opt.slug}
              type="button"
              onClick={() => onChange(opt.slug)}
              className={
                isSelected
                  ? 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-colors bg-primary-600 border-primary-600 text-white'
                  : 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
              }
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
