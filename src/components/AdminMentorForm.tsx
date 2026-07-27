'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import FilterGroup, { type FilterOption } from '@/components/FilterGroup'
import {
  createMentorProfile,
  updateMentorProfile,
  publishMentor,
  unpublishMentor,
  uploadMentorPhotoAsAdmin,
  type AdminProfileData,
} from '@/app/actions/admin'

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

type MentorUser = { id: string; name: string | null; email: string }

type FilterOptions = {
  locations: FilterOption[]
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

function fieldClass(isEditing: boolean) {
  return isEditing
    ? 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors'
    : 'w-full rounded-xl border border-transparent bg-transparent px-3 py-2 -mx-3 text-sm text-neutral-700 disabled:cursor-default'
}

function buildFormFromProfile(profile: ProfileInit | undefined): AdminProfileData {
  return {
    name: profile?.name ?? '',
    slug: profile?.slug ?? '',
    user_id: profile?.user_id ?? '',
    photo_url: profile?.photo_url ?? '',
    role_title: profile?.role_title ?? '',
    short_bio: profile?.short_bio ?? '',
    location_slugs: profile?.location_slugs ?? [],
    industry_slugs: profile?.industry_slugs ?? [],
    support_area_slugs: profile?.support_area_slugs ?? [],
    what_i_can_help_with: profile?.what_i_can_help_with ?? '',
    suitable_mentee_profile: profile?.suitable_mentee_profile ?? '',
    suggested_topics: profile?.suggested_topics ?? '',
    booking_instruction: profile?.booking_instruction ?? '',
    calendly_url: profile?.calendly_url ?? '',
  }
}

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

  const [form, setForm] = useState<AdminProfileData>(() => buildFormFromProfile(profile))
  const [isEditing, setIsEditing] = useState(mode === 'create')

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

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const inputClass = fieldClass(isEditing)

  function handleEdit() {
    setIsEditing(true)
    setSaveStatus('idle')
    setSaveMessage(null)
  }

  function handleCancel() {
    setForm(buildFormFromProfile(profile))
    setIsEditing(false)
    setSaveStatus('idle')
    setSaveMessage(null)
    setPhotoError(null)
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

    const result = await uploadMentorPhotoAsAdmin(uploadData, form.user_id)

    setIsUploadingPhoto(false)

    if (result.success) {
      setForm((prev) => ({ ...prev, photo_url: result.url }))
      setSaveStatus('idle')
    } else {
      setPhotoError(result.error)
    }
  }

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
    field: 'location_slugs' | 'industry_slugs' | 'support_area_slugs',
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
          setIsEditing(false)
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action bar */}
      {mode === 'edit' && !isEditing && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105 transition-[filter]"
          >
            Chỉnh sửa hồ sơ mentor
          </button>
        </div>
      )}

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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Ảnh đại diện
          </p>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 h-20 w-20 rounded-2xl overflow-hidden bg-gradient-primary flex items-center justify-center">
              {form.photo_url ? (
                <img
                  src={form.photo_url}
                  alt={form.name || 'Mentor'}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <span className="text-xl font-bold text-white/80">
                  {form.name ? getInitials(form.name) : '?'}
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
            placeholder="Giới thiệu ngắn gọn..."
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
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
          disabled={!isEditing}
        />

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

        <Field label="Mentor có thể hỗ trợ gì">
          <textarea
            value={form.what_i_can_help_with}
            onChange={(e) => set('what_i_can_help_with', e.target.value)}
            placeholder="Mô tả những lĩnh vực mentor này có thể hỗ trợ mentee..."
            rows={4}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
          />
        </Field>

        <Field label="Phù hợp với mentee như thế nào">
          <textarea
            value={form.suitable_mentee_profile}
            onChange={(e) => set('suitable_mentee_profile', e.target.value)}
            placeholder="Mô tả kiểu mentee sẽ được hưởng lợi nhiều nhất..."
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

        <Field label="Đường dẫn Calendly" hint="VD: https://calendly.com/tenmentorname">
          <input
            type="url"
            value={form.calendly_url}
            onChange={(e) => set('calendly_url', e.target.value)}
            placeholder="https://calendly.com/..."
            className={inputClass}
            disabled={!isEditing}
          />
        </Field>

        <Field label="Hướng dẫn đặt lịch">
          <textarea
            value={form.booking_instruction}
            onChange={(e) => set('booking_instruction', e.target.value)}
            placeholder="Hướng dẫn thêm cho mentee trước khi đặt lịch (không bắt buộc)..."
            rows={3}
            className={`${inputClass} resize-none`}
            disabled={!isEditing}
          />
        </Field>
      </div>

      {/* Footer actions */}
      <div className="space-y-4">
        {/* Save row */}
        {isEditing && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isAnyPending}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50 transition-[filter]"
          >
            {isSaving ? 'Đang lưu…' : mode === 'create' ? 'Tạo bản nháp' : 'Lưu thay đổi'}
          </button>

          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isAnyPending}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              Hủy
            </button>
          )}

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
        )}

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
