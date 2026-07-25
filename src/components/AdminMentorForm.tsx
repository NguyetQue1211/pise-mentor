'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import FilterGroup, { type FilterOption } from '@/components/FilterGroup'
import {
  createMentorProfile,
  updateMentorProfile,
  publishMentor,
  unpublishMentor,
  type AdminProfileData,
} from '@/app/actions/admin'

type MentorUser = { id: string; name: string | null; email: string }

type FilterOptions = {
  locations: FilterOption[]
  disciplines: FilterOption[]
  industries: FilterOption[]
  supportAreas: FilterOption[]
}

type ProfileInit = Partial<AdminProfileData> & {
  id?: string
  is_published?: boolean
}

interface AdminMentorFormProps {
  mode: 'create' | 'edit'
  profile?: ProfileInit
  filterOptions: FilterOptions
  mentorUsers: MentorUser[]
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors'

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string
  children: React.ReactNode
  hint?: string
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </p>
      {children}
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  )
}

export default function AdminMentorForm({
  mode,
  profile,
  filterOptions,
  mentorUsers,
}: AdminMentorFormProps) {
  const router = useRouter()
  const profileId = profile?.id

  const [form, setForm] = useState<AdminProfileData>({
    name: profile?.name ?? '',
    slug: profile?.slug ?? '',
    user_id: profile?.user_id ?? '',
    photo_url: profile?.photo_url ?? '',
    role_title: profile?.role_title ?? '',
    short_bio: profile?.short_bio ?? '',
    location_slugs: profile?.location_slugs ?? [],
    discipline_slugs: profile?.discipline_slugs ?? [],
    industry_slugs: profile?.industry_slugs ?? [],
    support_area_slugs: profile?.support_area_slugs ?? [],
    what_i_can_help_with: profile?.what_i_can_help_with ?? '',
    suitable_mentee_profile: profile?.suitable_mentee_profile ?? '',
    suggested_topics: profile?.suggested_topics ?? '',
    booking_instruction: profile?.booking_instruction ?? '',
    calendly_url: profile?.calendly_url ?? '',
  })

  const [slugEdited, setSlugEdited] = useState(mode === 'edit')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [saveCalendlyWarning, setSaveCalendlyWarning] = useState(false)

  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [publishMessage, setPublishMessage] = useState<string | null>(null)
  const [publishCalendlyWarning, setPublishCalendlyWarning] = useState(false)

  const [localIsPublished, setLocalIsPublished] = useState(profile?.is_published ?? false)

  const [isSaving, startSave] = useTransition()
  const [isPublishing, startPublish] = useTransition()
  const [isUnpublishing, startUnpublish] = useTransition()

  function set(field: keyof AdminProfileData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugEdited ? prev.slug : toSlug(value),
    }))
    setSaveStatus('idle')
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true)
    set('slug', value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-'))
  }

  function toggle(
    field: 'location_slugs' | 'discipline_slugs' | 'industry_slugs' | 'support_area_slugs',
    slug: string
  ) {
    setForm((prev) => {
      const current = prev[field] as string[]
      return {
        ...prev,
        [field]: current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
      }
    })
    setSaveStatus('idle')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaveCalendlyWarning(false)

    startSave(async () => {
      if (mode === 'create') {
        const result = await createMentorProfile(form)
        if (result.success && result.id) {
          router.push(`/admin/mentors/${result.id}/edit`)
        } else {
          setSaveStatus('error')
          setSaveMessage(result.error ?? 'Đã có lỗi xảy ra.')
        }
      } else {
        const result = await updateMentorProfile(profileId!, form)
        if (result.success) {
          setSaveStatus('success')
          setSaveMessage('Đã lưu thay đổi.')
          setSaveCalendlyWarning(result.calendlyWarning ?? false)
          router.refresh()
        } else {
          setSaveStatus('error')
          setSaveMessage(result.error ?? 'Đã có lỗi xảy ra.')
        }
      }
    })
  }

  function handlePublish() {
    setPublishCalendlyWarning(false)
    startPublish(async () => {
      const result = await publishMentor(profileId!)
      if (result.success) {
        setLocalIsPublished(true)
        setPublishStatus('success')
        setPublishMessage('Đã công khai hồ sơ mentor.')
        setPublishCalendlyWarning(result.calendlyWarning ?? false)
        router.refresh()
      } else {
        setPublishStatus('error')
        setPublishMessage(result.error ?? 'Không thể công khai.')
      }
    })
  }

  function handleUnpublish() {
    startUnpublish(async () => {
      const result = await unpublishMentor(profileId!)
      if (result.success) {
        setLocalIsPublished(false)
        setPublishStatus('success')
        setPublishMessage('Đã ẩn hồ sơ mentor.')
        router.refresh()
      } else {
        setPublishStatus('error')
        setPublishMessage(result.error ?? 'Đã có lỗi xảy ra.')
      }
    })
  }

  const isAnyPending = isSaving || isPublishing || isUnpublishing

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section: Admin / Linkage */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Quản trị / Liên kết
        </h2>

        <Field label="Tên mentor" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="VD: Nguyễn Thị A"
            className={inputClass}
            maxLength={200}
          />
        </Field>

        <Field
          label="Slug"
          required
          hint="Dùng trong URL hồ sơ mentor. Chỉ gồm chữ thường, số và dấu gạch ngang."
        >
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="VD: nguyen-thi-a"
            className={`${inputClass} font-mono`}
            maxLength={100}
          />
          {form.slug && (
            <p className="text-xs text-neutral-400 mt-0.5">
              URL: /mentors/<span className="font-mono text-neutral-600">{form.slug}</span>
            </p>
          )}
        </Field>

        <Field
          label="Tài khoản mentor liên kết"
          hint="Liên kết hồ sơ này với một tài khoản mentor để họ có thể tự chỉnh sửa."
        >
          <select
            value={form.user_id}
            onChange={(e) => set('user_id', e.target.value)}
            className={inputClass}
          >
            <option value="">— Chưa liên kết —</option>
            {mentorUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name ? `${u.name} (${u.email})` : u.email}
              </option>
            ))}
          </select>
        </Field>

        {mode === 'edit' && (
          <div className="flex items-center gap-2">
            <span
              className={
                localIsPublished
                  ? 'inline-flex items-center gap-1.5 rounded-full bg-success-50 border border-success-100 px-3 py-1 text-xs font-semibold text-success-700'
                  : 'inline-flex items-center gap-1.5 rounded-full bg-warning-50 border border-warning-100 px-3 py-1 text-xs font-semibold text-warning-700'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${localIsPublished ? 'bg-success-500' : 'bg-warning-500'}`}
              />
              {localIsPublished ? 'Đã công khai' : 'Chưa công khai'}
            </span>
          </div>
        )}
      </div>

      {/* Section: Basic Information */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Thông tin cơ bản
        </h2>

        <Field label="Đường dẫn ảnh" hint="Liên kết tới một ảnh có thể truy cập công khai.">
          <input
            type="url"
            value={form.photo_url}
            onChange={(e) => set('photo_url', e.target.value)}
            placeholder="https://i.imgur.com/..."
            className={inputClass}
          />
        </Field>

        <Field label="Chức danh / vai trò hiện tại">
          <input
            type="text"
            value={form.role_title}
            onChange={(e) => set('role_title', e.target.value)}
            placeholder="VD: Senior Product Designer tại Shopify"
            className={inputClass}
            maxLength={200}
          />
        </Field>

        <Field label="Giới thiệu ngắn">
          <textarea
            value={form.short_bio}
            onChange={(e) => set('short_bio', e.target.value)}
            placeholder="Giới thiệu ngắn gọn..."
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Section: Discovery tags */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Thông tin phân loại
        </h2>

        <FilterGroup
          label="Địa điểm"
          options={filterOptions.locations}
          selected={form.location_slugs}
          onChange={(slug) => toggle('location_slugs', slug)}
        />

        <FilterGroup
          label="Lĩnh vực"
          options={filterOptions.disciplines}
          selected={form.discipline_slugs}
          onChange={(slug) => toggle('discipline_slugs', slug)}
        />

        <FilterGroup
          label="Ngành nghề"
          options={filterOptions.industries}
          selected={form.industry_slugs}
          onChange={(slug) => toggle('industry_slugs', slug)}
        />

        <FilterGroup
          label="Lĩnh vực hỗ trợ"
          options={filterOptions.supportAreas}
          selected={form.support_area_slugs}
          onChange={(slug) => toggle('support_area_slugs', slug)}
        />
      </div>

      {/* Section: Profile content */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Nội dung hồ sơ
        </h2>

        <Field label="Mentor có thể hỗ trợ gì">
          <textarea
            value={form.what_i_can_help_with}
            onChange={(e) => set('what_i_can_help_with', e.target.value)}
            placeholder="Mô tả những lĩnh vực mentor này có thể hỗ trợ mentee..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Phù hợp với mentee như thế nào">
          <textarea
            value={form.suitable_mentee_profile}
            onChange={(e) => set('suitable_mentee_profile', e.target.value)}
            placeholder="Mô tả kiểu mentee sẽ được hưởng lợi nhiều nhất..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Chủ đề gợi ý">
          <textarea
            value={form.suggested_topics}
            onChange={(e) => set('suggested_topics', e.target.value)}
            placeholder="VD: Xem portfolio, Chiến lược chuyển ngành, Luyện phỏng vấn..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Section: Booking */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Đặt lịch
        </h2>

        <Field label="Đường dẫn Calendly" hint="VD: https://calendly.com/tenmentorname">
          <input
            type="url"
            value={form.calendly_url}
            onChange={(e) => set('calendly_url', e.target.value)}
            placeholder="https://calendly.com/..."
            className={inputClass}
          />
        </Field>

        <Field label="Hướng dẫn đặt lịch">
          <textarea
            value={form.booking_instruction}
            onChange={(e) => set('booking_instruction', e.target.value)}
            placeholder="Hướng dẫn thêm cho mentee trước khi đặt lịch (không bắt buộc)..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Footer actions */}
      <div className="space-y-4">
        {/* Save row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isAnyPending}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50 transition-[filter]"
          >
            {isSaving ? 'Đang lưu…' : mode === 'create' ? 'Tạo bản nháp' : 'Lưu thay đổi'}
          </button>

          {saveStatus === 'success' && (
            <div>
              <p className="text-sm text-success-700 font-medium">{saveMessage}</p>
              {saveCalendlyWarning && (
                <p className="text-xs text-warning-600">
                  Đã lưu URL, nhưng có vẻ không phải link Calendly. Hãy kiểm tra lại trước khi công khai.
                </p>
              )}
            </div>
          )}
          {saveStatus === 'error' && (
            <p className="text-sm text-red-600">{saveMessage}</p>
          )}
        </div>

        {/* Publish/Unpublish row (edit mode only) */}
        {mode === 'edit' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100">
            {localIsPublished ? (
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={isAnyPending}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
              >
                {isUnpublishing ? 'Đang ẩn…' : 'Ẩn hồ sơ'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isAnyPending}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50 transition-[filter]"
              >
                {isPublishing ? 'Đang công khai…' : 'Công khai'}
              </button>
            )}

            {publishStatus === 'success' && (
              <div>
                <p className="text-sm text-success-700 font-medium">{publishMessage}</p>
                {publishCalendlyWarning && (
                  <p className="text-xs text-warning-600">
                    Đường dẫn Calendly có vẻ không đúng chuẩn. Vui lòng kiểm tra lại.
                  </p>
                )}
              </div>
            )}
            {publishStatus === 'error' && (
              <p className="text-sm text-red-600">{publishMessage}</p>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
