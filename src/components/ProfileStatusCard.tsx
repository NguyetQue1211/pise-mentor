import type { ProfileStatus } from '@/lib/mentor/getProfileStatus'

interface ProfileStatusCardProps {
  status: ProfileStatus
}

export default function ProfileStatusCard({ status }: ProfileStatusCardProps) {
  const { isPublished, isComplete, missingFields } = status

  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 space-y-4 text-left">
      <div className="flex flex-wrap gap-2">
        {/* Published / Unpublished */}
        {isPublished ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 border border-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-700">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 inline-block" />
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 border border-warning-100 px-3 py-1 text-xs font-semibold text-warning-700">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-500 inline-block" />
            Unpublished
          </span>
        )}

        {/* Complete / Incomplete */}
        {isComplete ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 border border-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-700">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 inline-block" />
            Complete
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 border border-warning-100 px-3 py-1 text-xs font-semibold text-warning-700">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-500 inline-block" />
            Incomplete
          </span>
        )}
      </div>

      {!isPublished && (
        <p className="text-sm text-neutral-600">
          Your profile is not published yet. PISE admin will publish it after review.
        </p>
      )}

      {!isComplete && missingFields.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-sm text-neutral-600">
            Complete the required fields so PISE can review and publish your profile.
          </p>
          <ul className="text-sm text-warning-700 space-y-0.5">
            {missingFields.map((field) => (
              <li key={field} className="flex items-center gap-1.5">
                <span className="text-warning-500">·</span>
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
