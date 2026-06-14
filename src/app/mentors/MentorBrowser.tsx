'use client'

import { useState, useMemo } from 'react'
import MentorCard, { type MentorCardData } from '@/components/MentorCard'
import FilterGroup, { type FilterOption } from '@/components/FilterGroup'

interface FilterOptions {
  locations: FilterOption[]
  disciplines: FilterOption[]
  industries: FilterOption[]
}

interface MentorBrowserProps {
  mentors: MentorCardData[]
  filterOptions: FilterOptions
}

function toggleSlug(slug: string, selected: string[]): string[] {
  return selected.includes(slug)
    ? selected.filter((s) => s !== slug)
    : [...selected, slug]
}

export default function MentorBrowser({ mentors, filterOptions }: MentorBrowserProps) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])

  const labelMap = useMemo(() => {
    const map: Record<string, string> = {}
    const all = [
      ...filterOptions.locations,
      ...filterOptions.disciplines,
      ...filterOptions.industries,
    ]
    for (const opt of all) {
      map[opt.slug] = opt.label
    }
    return map
  }, [filterOptions])

  const hasFilters =
    selectedLocations.length > 0 ||
    selectedDisciplines.length > 0 ||
    selectedIndustries.length > 0

  function clearFilters() {
    setSelectedLocations([])
    setSelectedDisciplines([])
    setSelectedIndustries([])
  }

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const matchesLocation =
        selectedLocations.length === 0 ||
        mentor.location_slugs.some((s) => selectedLocations.includes(s))

      const matchesDiscipline =
        selectedDisciplines.length === 0 ||
        mentor.discipline_slugs.some((s) => selectedDisciplines.includes(s))

      const matchesIndustry =
        selectedIndustries.length === 0 ||
        mentor.industry_slugs.some((s) => selectedIndustries.includes(s))

      return matchesLocation && matchesDiscipline && matchesIndustry
    })
  }, [mentors, selectedLocations, selectedDisciplines, selectedIndustries])

  if (mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base font-medium text-neutral-700">
          No mentors are available yet.
        </p>
        <p className="text-sm text-neutral-500 mt-1">Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      {/* Filters */}
      <aside className="lg:w-60 xl:w-64 shrink-0 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-700">Filters</p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <FilterGroup
          label="Location"
          options={filterOptions.locations}
          selected={selectedLocations}
          onChange={(slug) => setSelectedLocations(toggleSlug(slug, selectedLocations))}
        />
        <FilterGroup
          label="Discipline"
          options={filterOptions.disciplines}
          selected={selectedDisciplines}
          onChange={(slug) => setSelectedDisciplines(toggleSlug(slug, selectedDisciplines))}
        />
        <FilterGroup
          label="Industry"
          options={filterOptions.industries}
          selected={selectedIndustries}
          onChange={(slug) => setSelectedIndustries(toggleSlug(slug, selectedIndustries))}
        />
      </aside>

      {/* Mentor grid */}
      <div className="flex-1 min-w-0">
        {filteredMentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-base font-medium text-neutral-700">
              No mentors match your current filters.
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              Try removing one filter or browsing all mentors.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} labelMap={labelMap} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
