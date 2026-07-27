'use client'

import { useRef, useState, useTransition } from 'react'
import FilterGroup, { type FilterOption } from '@/components/FilterGroup'
import { updateOwnMentorProfile, uploadMentorPhoto, type UpdateProfileData } from '@/app/actions/mentor'

const MAX_PHOTO_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export type MentorProfileFormData = {
  name: string
  photo_url: string | null
  role_title: string | null
  short_bio: string | null
  location_slugs: string[]
  industry_slugs: string[]
  support_area_slugs: string[]
  what_i_can_help_with: string | null
  suitable_mentee_profile: string | null
  suggested_topics: string | null
  booking_instruction: string | null
  calendly_url: string | null
}

type FilterOptions = {
  locations: FilterOption[]
  industries: FilterOption[]
  supportAreas: FilterOption[]
}

interface MentorProfileFormProps {
  profile: MentorProfileFormData
  filterOptions: FilterOptions
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{label}</p>
      {children}
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  )
}

function buildFormFromProfile(profile: MentorProfileFormData): UpdateProfileData {
  return {
    photo_url: profile.photo_url ?? '',
    role_title: profile.role_title ?? '',
    short_bio: profile.short_bio ?? '',
    location_slugs: profile.location_slugs ?? [],
    industry_slugs: profile.industry_slugs ?? [],
    support_area_slugs: profile.support_area_slugs ?? [],
    what_i_can_help_with: profile.what_i_can_help_with ?? '',
    suitable_mentee_profile: profile.suitable_mentee_profile ?? '',
    suggested_topics: profile.suggested_topics ?? '',
    booking_instruction: profile.booking_instruction ?? '',
    calendly_url: profile.calendly_url ?? '',
  }
}

// location_slugs may contain one free-text entry (from the "Khác" option)
// alongside recognized filter_options slugs. Split them apart so the
// FilterGroup checkboxes only ever deal with known slugs.
function splitLocationSlugs(slugs: string[], knownSlugs: Set<string>) {
  return {
    recognized: slugs.filter((s) => knownSlugs.has(s)),
    custom: slugs.find((s) => !knownSlugs.has(s)) ?? '',
  }
}

function fieldClass(isEditing: boolean) {
  return isEditing
    ? 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors'
    : 'w-full rounded-xl border border-transparent bg-transparent px-3 py-2 -mx-3 text-sm text-neutral-700 disabled:cursor-default'
}

export default function MentorProfileForm({
  profile,
  filterOptions,
}: MentorProfileFormProps) {
  const knownLocationSlugs = new Set(filterOptions.locations.map((o) => o.slug))

  const [form, setForm] = useState<UpdateProfileData>(() => {
    const base = buildFormFromProfile(profile)
    return { ...base, location_slugs: splitLocationSlugs(base.location_slugs, knownLocationSlugs).recognized }
  })
  const [isEditing, setIsEditing] = useState(false)

  const [otherLocationEnabled, setOtherLocationEnabled] = useState(
    () => !!splitLocationSlugs(profile.location_slugs ?? [], knownLocationSlugs).custom
  )
  const [otherLocationText, setOtherLocationText] = useState(
    () => splitLocationSlugs(profile.location_slugs ?? [], knownLocationSlugs).custom
  )

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [calendlyWarning, setCalendlyWarning] = useState(false)

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const inputClass = fieldClass(isEditing)

  function handleEdit() {
    setIsEditing(true)
    setStatus('idle')
    setMessage(null)
  }

  function handleCancel() {
    const base = buildFormFromProfile(profile)
    const { recognized, custom } = splitLocationSlugs(base.location_slugs, knownLocationSlugs)
    setForm({ ...base, location_slugs: recognized })
    setOtherLocationEnabled(!!custom)
    setOtherLocationText(custom)
    setIsEditing(false)
    setStatus('idle')
    setMessage(null)
    setPhotoError(null)
  }

  function handleOtherLocationToggle() {
    setOtherLocationEnabled((prev) => {
      const next = !prev
      if (!next) setOtherLocationText('')
      return next
    })
    if (status !== 'idle') setStatus('idle')
  }

  function handlePhotoButtonClick() {
    fileInputRef.current?.click()
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file again later
    if (!file) return

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError('Vui lòng chọn ảnh JPG, PNG hoặc WebP.')
      return
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError('Ảnh phải nhỏ hơn hoặc bằng 5MB.')
      return
    }

    setPhotoError(null)
    setIsUploadingPhoto(true)

    const uploadData = new FormData()
    uploadData.append('file', file)

    const result = await uploadMentorPhoto(uploadData)

    setIsUploadingPhoto(false)

    if (result.success) {
      setForm((prev) => ({ ...prev, photo_url: result.url }))
    } else {
      setPhotoError(result.error)
    }
  }

  function set(field: keyof UpdateProfileData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (status !== 'idle') setStatus('idle')
  }

  function toggle(field: 'location_slugs' | 'industry_slugs' | 'support_area_slugs', slug: string) {
    setForm((prev) => {
      const current = prev[field] as string[]
      return {
        ...prev,
        [field]: current.includes(slug)
          ? current.filter((s) => s !== slug)
          : [...current, slug],
      }
    })
    if (status !== 'idle') setStatus('idle')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCalendlyWarning(false)
    const location_slugs = [
      ...form.location_slugs,
      ...(otherLocationEnabled && otherLocationText.trim() ? [otherLocationText.trim()] : []),
    ]
    startTransition(async () => {
      const result = await updateOwnMentorProfile({ ...form, location_slugs })
      if (result.success) {
        setStatus('success')
        setMessage('Đã lưu hồ sơ.')
        setCalendlyWarning(result.calendlyWarning ?? false)
        setIsEditing(false)
      } else {
        setStatus('error')
        setMessage(result.error ?? 'Đã có lỗi xảy ra.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action bar */}
      {!isEditing && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105 transition-[filter]"
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>
      )}

      {/* Section: Basic */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Thông tin cơ bản
        </h2>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Ảnh đại diện
          </p>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 h-20 w-20 rounded-2xl overflow-hidden bg-gradient-primary flex items-center justify-center">
              {form.photo_url ? (
                <img
                  src={form.photo_url}
                  alt={profile.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <span className="text-xl font-bold text-white/80">
                  {getInitials(profile.name)}
                </span>
              )}

              {isUploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handlePhotoButtonClick}
                    disabled={isUploadingPhoto}
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                  >
                    {isUploadingPhoto ? 'Đang tải lên…' : form.photo_url ? 'Đổi ảnh' : 'Tải ảnh lên'}
                  </button>
                  <p className="text-xs text-neutral-400">JPG, PNG hoặc WebP. Tối đa 5MB.</p>
                  {photoError && <p className="text-xs text-red-600">{photoError}</p>}
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        <Field label="Chức danh / vai trò hiện tại">
          <input
            type="text"
            value={form.role_title}
            onChange={(e) => set('role_title', e.target.value)}
            placeholder="VD: Senior Product Designer tại Shopify"
            className={inputClass}
            maxLength={200}
            disabled={!isEditing}
          />
        </Field>

        <Field label="Giới thiệu ngắn">
          <textarea
            value={form.short_bio}
            onChange={(e) => set('short_bio', e.target.value)}
            placeholder="Giới thiệu ngắn gọn về bản thân..."
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
          />
        </Field>
      </div>

      {/* Section: Discovery */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Thông tin phân loại
        </h2>
        <p className="text-xs text-neutral-400 -mt-3">
          Mentee sẽ dùng những thông tin này để lọc và tìm bạn. Hãy chọn tất cả mục phù hợp.
        </p>

        <FilterGroup
          label="Địa điểm"
          options={filterOptions.locations}
          selected={form.location_slugs}
          onChange={(slug) => toggle('location_slugs', slug)}
          disabled={!isEditing}
        />

        <div className="px-4 -mt-3 pb-4 border-b border-neutral-100 space-y-2">
          <button
            type="button"
            onClick={handleOtherLocationToggle}
            disabled={!isEditing}
            className={
              otherLocationEnabled
                ? 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border border-transparent transition-[filter] bg-gradient-primary text-white hover:brightness-105 disabled:opacity-60 disabled:hover:brightness-100 disabled:cursor-default'
                : 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-60 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:cursor-default'
            }
          >
            Khác
          </button>

          {otherLocationEnabled && (
            <input
              type="text"
              value={otherLocationText}
              onChange={(e) => setOtherLocationText(e.target.value)}
              placeholder="Nhập địa điểm của bạn..."
              maxLength={100}
              disabled={!isEditing}
              className={inputClass}
            />
          )}
        </div>

        <FilterGroup
          label="Chuyên môn"
          options={filterOptions.industries}
          selected={form.industry_slugs}
          onChange={(slug) => toggle('industry_slugs', slug)}
          disabled={!isEditing}
        />

        <FilterGroup
          label="Lĩnh vực hỗ trợ"
          options={filterOptions.supportAreas}
          selected={form.support_area_slugs}
          onChange={(slug) => toggle('support_area_slugs', slug)}
          disabled={!isEditing}
        />
      </div>

      {/* Section: Profile content */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Nội dung hồ sơ
        </h2>

        <Field label="Bạn có thể hỗ trợ gì">
          <textarea
            value={form.what_i_can_help_with}
            onChange={(e) => set('what_i_can_help_with', e.target.value)}
            placeholder="Mô tả những lĩnh vực bạn có thể hỗ trợ mentee..."
            rows={4}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
          />
        </Field>

        <Field label="Phù hợp với mentee như thế nào">
          <textarea
            value={form.suitable_mentee_profile}
            onChange={(e) => set('suitable_mentee_profile', e.target.value)}
            placeholder="Mô tả kiểu mentee sẽ được hưởng lợi nhiều nhất từ sự hỗ trợ của bạn..."
            rows={3}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
          />
        </Field>

        <Field label="Chủ đề gợi ý">
          <textarea
            value={form.suggested_topics}
            onChange={(e) => set('suggested_topics', e.target.value)}
            placeholder="VD: Xem portfolio, Chiến lược chuyển ngành, Luyện phỏng vấn..."
            rows={3}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
          />
        </Field>
      </div>

      {/* Section: Booking */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Đặt lịch
        </h2>

        <Field
          label="Đường dẫn Calendly"
          hint="Trang đặt lịch Calendly cá nhân của bạn, VD: https://calendly.com/tenbancuaban"
        >
          <input
            type="url"
            value={form.calendly_url}
            onChange={(e) => set('calendly_url', e.target.value)}
            placeholder="https://calendly.com/..."
            className={inputClass}
            disabled={!isEditing}
          />
        </Field>

        <Field label="Hướng dẫn đặt lịch" hint="Hướng dẫn thêm cho mentee trước khi đặt lịch (không bắt buộc).">
          <textarea
            value={form.booking_instruction}
            onChange={(e) => set('booking_instruction', e.target.value)}
            placeholder="VD: Vui lòng chia sẻ link portfolio trong phần ghi chú của Calendly trước khi đặt lịch."
            rows={3}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
          />
        </Field>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        {isEditing && (
          <>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50 transition-[filter]"
            >
              {isPending ? 'Đang lưu…' : 'Lưu hồ sơ'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              Hủy
            </button>
          </>
        )}

        {status === 'success' && (
          <div className="space-y-0.5">
            <p className="text-sm text-success-700 font-medium">{message}</p>
            {calendlyWarning && (
              <p className="text-xs text-warning-600">
                Đã lưu URL, nhưng có vẻ không phải link Calendly. Hãy kiểm tra lại cho chắc.
              </p>
            )}
          </div>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-600">{message}</p>
        )}
      </div>
    </form>
  )
}
