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
  disabled?: boolean
}

export default function FilterGroup({
  label,
  options,
  selected,
  onChange,
  disabled = false,
}: FilterGroupProps) {
  if (options.length === 0) return null

  return (
    <div className="border-b border-neutral-100 px-4 py-4 last:border-b-0">
      <p className="text-sm font-semibold text-neutral-800 mb-3">
        {label}
        {selected.length > 0 && (
          <span className="ml-1.5 text-xs font-medium text-primary-600">
            ({selected.length})
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.slug)
          return (
            <button
              key={opt.slug}
              type="button"
              onClick={() => onChange(opt.slug)}
              disabled={disabled}
              className={
                isSelected
                  ? 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border border-transparent transition-[filter] bg-gradient-primary text-white hover:brightness-105 disabled:opacity-60 disabled:hover:brightness-100 disabled:cursor-default'
                  : 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-60 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:cursor-default'
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
