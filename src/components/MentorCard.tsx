import Link from 'next/link'

export type MentorCardData = {
  id: string
  slug: string
  name: string
  photo_url: string | null
  role_title: string | null
  short_bio: string | null
  location_slugs: string[]
  discipline_slugs: string[]
  industry_slugs: string[]
  support_area_slugs: string[]
}

interface MentorCardProps {
  mentor: MentorCardData
  labelMap: Record<string, string>
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4 shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v1.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4 shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  )
}

export default function MentorCard({ mentor, labelMap }: MentorCardProps) {
  const label = (slug: string) => labelMap[slug] ?? slug
  const disciplineLabel = mentor.discipline_slugs[0] ? label(mentor.discipline_slugs[0]) : null
  const industryLabel = mentor.industry_slugs[0] ? label(mentor.industry_slugs[0]) : null
  const locationText = mentor.location_slugs.map(label).join(' · ')

  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 hover:border-neutral-300 hover:shadow-sm transition-all"
    >
      {/* Photo */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-primary">
        {mentor.photo_url ? (
          <img
            src={mentor.photo_url}
            alt={mentor.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-bold text-white/80">
              {getInitials(mentor.name)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-1 pb-1 flex flex-col gap-1.5">
        <p className="text-base font-bold text-neutral-900 leading-snug truncate">
          {mentor.name}
        </p>

        {mentor.role_title && (
          <div className="flex items-center gap-1.5 text-sm text-neutral-600">
            <BriefcaseIcon />
            <span className="truncate">{mentor.role_title}</span>
          </div>
        )}

        {locationText && (
          <div className="flex items-center gap-1.5 text-sm text-neutral-600">
            <MapPinIcon />
            <span className="truncate">{locationText}</span>
          </div>
        )}

        {(disciplineLabel || industryLabel) && (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50 px-3 py-2 mt-1">
            <div className="min-w-0">
              <p className="text-[11px] text-neutral-400">Lĩnh vực</p>
              <p className="text-xs font-semibold text-neutral-800 truncate">
                {disciplineLabel ?? '—'}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-neutral-400">Ngành nghề</p>
              <p className="text-xs font-semibold text-neutral-800 truncate">
                {industryLabel ?? '—'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
