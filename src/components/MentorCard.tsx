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

export default function MentorCard({ mentor, labelMap }: MentorCardProps) {
  const label = (slug: string) => labelMap[slug] ?? slug

  return (
    <Link href={`/mentors/${mentor.slug}`} className="flex flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden h-80 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer">
      {/* Photo — 3/4 */}
      <div className="h-3/4 w-full bg-primary-100 overflow-hidden">
        {mentor.photo_url ? (
          <img
            src={mentor.photo_url}
            alt={mentor.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-bold text-primary-300">
              {getInitials(mentor.name)}
            </span>
          </div>
        )}
      </div>

      {/* Content — 1/4 */}
      <div className="h-1/4 px-3 py-2.5 flex flex-col justify-center gap-0.5">
        <p className="text-xs font-semibold text-neutral-900 leading-snug truncate">
          {mentor.name}
        </p>
        {mentor.role_title && (
          <p className="text-[10px] text-neutral-500 leading-snug truncate">
            {mentor.role_title}
          </p>
        )}
        {mentor.location_slugs.length > 0 && (
          <p className="text-[10px] text-neutral-400 truncate">
            📍 {mentor.location_slugs.map(label).join(' · ')}
          </p>
        )}
      </div>
    </Link>
  )
}
