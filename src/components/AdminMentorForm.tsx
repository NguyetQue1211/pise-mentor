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
          setSaveMessage(result.error ?? 'Something went wrong.')
        }
      } else {
        const result = await updateMentorProfile(profileId!, form)
        if (result.success) {
          setSaveStatus('success')
          setSaveMessage('Changes saved.')
          setSaveCalendlyWarning(result.calendlyWarning ?? false)
          router.refresh()
        } else {
          setSaveStatus('error')
          setSaveMessage(result.error ?? 'Something went wrong.')
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
        setPublishMessage('Mentor published.')
        setPublishCalendlyWarning(result.calendlyWarning ?? false)
        router.refresh()
      } else {
        setPublishStatus('error')
        setPublishMessage(result.error ?? 'Cannot publish.')
      }
    })
  }

  function handleUnpublish() {
    startUnpublish(async () => {
      const result = await unpublishMentor(profileId!)
      if (result.success) {
        setLocalIsPublished(false)
        setPublishStatus('success')
        setPublishMessage('Mentor unpublished.')
        router.refresh()
      } else {
        setPublishStatus('error')
        setPublishMessage(result.error ?? 'Something went wrong.')
      }
    })
  }

  const isAnyPending = isSaving || isPublishing || isUnpublishing

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section: Admin / Linkage */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Admin / Linkage
        </h2>

        <Field label="Mentor name" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Nguyen Thi A"
            className={inputClass}
            maxLength={200}
          />
        </Field>

        <Field
          label="Slug"
          required
          hint="Used in the mentor's profile URL. Lowercase letters, numbers, and hyphens only."
        >
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. nguyen-thi-a"
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
          label="Linked mentor user"
          hint="Link this profile to a mentor user account so they can edit it."
        >
          <select
            value={form.user_id}
            onChange={(e) => set('user_id', e.target.value)}
            className={inputClass}
          >
            <option value="">— Not linked —</option>
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
                  ? 'inline-flex items-center gap-1.5 rounded-full bg-secondary-50 border border-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-700'
                  : 'inline-flex items-center gap-1.5 rounded-full bg-warning-50 border border-warning-100 px-3 py-1 text-xs font-semibold text-warning-700'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${localIsPublished ? 'bg-secondary-500' : 'bg-warning-500'}`}
              />
              {localIsPublished ? 'Published' : 'Unpublished'}
            </span>
          </div>
        )}
      </div>

      {/* Section: Basic Information */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Basic information
        </h2>

        <Field label="Photo URL" hint="Link to a publicly accessible image.">
          <input
            type="url"
            value={form.photo_url}
            onChange={(e) => set('photo_url', e.target.value)}
            placeholder="https://i.imgur.com/..."
            className={inputClass}
          />
        </Field>

        <Field label="Current role / title">
          <input
            type="text"
            value={form.role_title}
            onChange={(e) => set('role_title', e.target.value)}
            placeholder="e.g. Senior Product Designer at Shopify"
            className={inputClass}
            maxLength={200}
          />
        </Field>

        <Field label="Short bio">
          <textarea
            value={form.short_bio}
            onChange={(e) => set('short_bio', e.target.value)}
            placeholder="A brief introduction..."
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Section: Discovery tags */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Discovery tags
        </h2>

        <FilterGroup
          label="Location"
          options={filterOptions.locations}
          selected={form.location_slugs}
          onChange={(slug) => toggle('location_slugs', slug)}
        />

        <FilterGroup
          label="Discipline"
          options={filterOptions.disciplines}
          selected={form.discipline_slugs}
          onChange={(slug) => toggle('discipline_slugs', slug)}
        />

        <FilterGroup
          label="Industry"
          options={filterOptions.industries}
          selected={form.industry_slugs}
          onChange={(slug) => toggle('industry_slugs', slug)}
        />

        <FilterGroup
          label="Support areas"
          options={filterOptions.supportAreas}
          selected={form.support_area_slugs}
          onChange={(slug) => toggle('support_area_slugs', slug)}
        />
      </div>

      {/* Section: Profile content */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Profile content
        </h2>

        <Field label="What I can help with">
          <textarea
            value={form.what_i_can_help_with}
            onChange={(e) => set('what_i_can_help_with', e.target.value)}
            placeholder="Describe areas this mentor can help mentees with..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Good fit for (mentee profile)">
          <textarea
            value={form.suitable_mentee_profile}
            onChange={(e) => set('suitable_mentee_profile', e.target.value)}
            placeholder="Describe the type of mentee who would benefit most..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Suggested topics">
          <textarea
            value={form.suggested_topics}
            onChange={(e) => set('suggested_topics', e.target.value)}
            placeholder="e.g. Portfolio review, Career switch strategy, Interview prep..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Section: Booking */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Booking
        </h2>

        <Field label="Calendly URL" hint="e.g. https://calendly.com/mentorname">
          <input
            type="url"
            value={form.calendly_url}
            onChange={(e) => set('calendly_url', e.target.value)}
            placeholder="https://calendly.com/..."
            className={inputClass}
          />
        </Field>

        <Field label="Booking instructions">
          <textarea
            value={form.booking_instruction}
            onChange={(e) => set('booking_instruction', e.target.value)}
            placeholder="Optional guidance for mentees before booking..."
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
            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving…' : mode === 'create' ? 'Create draft' : 'Save changes'}
          </button>

          {saveStatus === 'success' && (
            <div>
              <p className="text-sm text-secondary-700 font-medium">{saveMessage}</p>
              {saveCalendlyWarning && (
                <p className="text-xs text-warning-600">
                  URL saved, but doesn&apos;t look like a Calendly link. Double-check before publishing.
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
                {isUnpublishing ? 'Unpublishing…' : 'Unpublish'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isAnyPending}
                className="inline-flex items-center justify-center rounded-xl bg-secondary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-secondary-700 disabled:opacity-50 transition-colors"
              >
                {isPublishing ? 'Publishing…' : 'Publish'}
              </button>
            )}

            {publishStatus === 'success' && (
              <div>
                <p className="text-sm text-secondary-700 font-medium">{publishMessage}</p>
                {publishCalendlyWarning && (
                  <p className="text-xs text-warning-600">
                    Calendly URL doesn&apos;t look standard. Please double-check.
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
