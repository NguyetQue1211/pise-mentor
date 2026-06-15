'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { publishMentor, unpublishMentor } from '@/app/actions/admin'

interface AdminPublishToggleProps {
  id: string
  isPublished: boolean
  isComplete: boolean
}

export default function AdminPublishToggle({
  id,
  isPublished,
  isComplete,
}: AdminPublishToggleProps) {
  const router = useRouter()
  const [localPublished, setLocalPublished] = useState(isPublished)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handle() {
    setError(null)
    startTransition(async () => {
      if (localPublished) {
        const result = await unpublishMentor(id)
        if (result.success) {
          setLocalPublished(false)
          router.refresh()
        } else {
          setError(result.error ?? 'Error.')
        }
      } else {
        const result = await publishMentor(id)
        if (result.success) {
          setLocalPublished(true)
          router.refresh()
        } else {
          setError(result.error ?? 'Cannot publish.')
        }
      }
    })
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handle}
        disabled={isPending || (!localPublished && !isComplete)}
        title={!localPublished && !isComplete ? 'Profile must be complete before publishing' : undefined}
        className={
          localPublished
            ? 'inline-flex items-center rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors'
            : 'inline-flex items-center rounded-lg bg-secondary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary-700 disabled:opacity-40 transition-colors'
        }
      >
        {isPending ? '…' : localPublished ? 'Unpublish' : 'Publish'}
      </button>
      {error && <p className="text-[10px] text-red-600 leading-tight max-w-[140px]">{error}</p>}
    </div>
  )
}
