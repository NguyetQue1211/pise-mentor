'use client'

import { useState, useTransition } from 'react'
import FilterGroup, { type FilterOption } from '@/components/FilterGroup'
import { updateOwnMentorProfile, type UpdateProfileData } from '@/app/actions/mentor'

export type MentorProfileFormData = {
  photo_url: string | null
  role_title: string | null
  short_bio: string | null
  location_slugs: string[]
  discipline_slugs: string[]
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
  disciplines: FilterOption[]
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

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors'

export default function MentorProfileForm({
  profile,
  filterOptions,
}: MentorProfileFormProps) {
  const [form, setForm] = useState<UpdateProfileData>({
    photo_url: profile.photo_url ?? '',
    role_title: profile.role_title ?? '',
    short_bio: profile.short_bio ?? '',
    location_slugs: profile.location_slugs ?? [],
    discipline_slugs: profile.discipline_slugs ?? [],
    industry_slugs: profile.industry_slugs ?? [],
    support_area_slugs: profile.support_area_slugs ?? [],
    what_i_can_help_with: profile.what_i_can_help_with ?? '',
    suitable_mentee_profile: profile.suitable_mentee_profile ?? '',
    suggested_topics: profile.suggested_topics ?? '',
    booking_instruction: profile.booking_instruction ?? '',
    calendly_url: profile.calendly_url ?? '',
  })

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [calendlyWarning, setCalendlyWarning] = useState(false)

  function set(field: keyof UpdateProfileData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (status !== 'idle') setStatus('idle')
  }

  function toggle(field: 'location_slugs' | 'discipline_slugs' | 'industry_slugs' | 'support_area_slugs', slug: string) {
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
    startTransition(async () => {
      const result = await updateOwnMentorProfile(form)
      if (result.success) {
        setStatus('success')
        setMessage('Profile saved.')
        setCalendlyWarning(result.calendlyWarning ?? false)
      } else {
        setStatus('error')
        setMessage(result.error ?? 'Something went wrong.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section: Basic */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Basic information
        </h2>

        <Field label="Photo URL" hint="Link to a publicly accessible image (e.g. LinkedIn photo, Imgur direct link).">
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
            placeholder="A brief introduction about yourself..."
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Section: Discovery */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Discovery tags
        </h2>
        <p className="text-xs text-neutral-400 -mt-3">
          Mentees use these to filter and find you. Select all that apply.
        </p>

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
            placeholder="Describe the areas you can help mentees with..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Good fit for (mentee profile)">
          <textarea
            value={form.suitable_mentee_profile}
            onChange={(e) => set('suitable_mentee_profile', e.target.value)}
            placeholder="Describe the type of mentee who would benefit most from your mentorship..."
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

        <Field
          label="Calendly URL"
          hint="Your personal Calendly booking page, e.g. https://calendly.com/yourname"
        >
          <input
            type="url"
            value={form.calendly_url}
            onChange={(e) => set('calendly_url', e.target.value)}
            placeholder="https://calendly.com/..."
            className={inputClass}
          />
        </Field>

        <Field label="Booking instructions" hint="Optional guidance for mentees before they book.">
          <textarea
            value={form.booking_instruction}
            onChange={(e) => set('booking_instruction', e.target.value)}
            placeholder="e.g. Please share your portfolio link in the Calendly notes before booking."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving…' : 'Save profile'}
        </button>

        {status === 'success' && (
          <div className="space-y-0.5">
            <p className="text-sm text-secondary-700 font-medium">{message}</p>
            {calendlyWarning && (
              <p className="text-xs text-warning-600">
                URL saved, but it doesn&apos;t look like a Calendly link. Double-check it&apos;s correct.
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
