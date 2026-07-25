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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 border border-success-100 px-3 py-1 text-xs font-semibold text-success-700">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 inline-block" />
            Đã công khai
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 border border-warning-100 px-3 py-1 text-xs font-semibold text-warning-700">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-500 inline-block" />
            Chưa công khai
          </span>
        )}

        {/* Complete / Incomplete */}
        {isComplete ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 border border-success-100 px-3 py-1 text-xs font-semibold text-success-700">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 inline-block" />
            Đầy đủ
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 border border-warning-100 px-3 py-1 text-xs font-semibold text-warning-700">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-500 inline-block" />
            Chưa đầy đủ
          </span>
        )}
      </div>

      {!isPublished && (
        <p className="text-sm text-neutral-600">
          Hồ sơ của bạn chưa được công khai. Admin PISE sẽ công khai sau khi xét duyệt.
        </p>
      )}

      {!isComplete && missingFields.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-sm text-neutral-600">
            Hãy hoàn thiện các mục bắt buộc để PISE có thể xét duyệt và công khai hồ sơ của bạn.
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
