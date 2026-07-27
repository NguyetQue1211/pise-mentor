'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMentorProfile } from '@/app/actions/admin'

interface AdminDeleteMentorButtonProps {
  id: string
  name: string
}

export default function AdminDeleteMentorButton({ id, name }: AdminDeleteMentorButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteMentorProfile(id)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error ?? 'Đã có lỗi xảy ra.')
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-500">Xoá {name}?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
        >
          {isPending ? '…' : 'Xác nhận'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="inline-flex items-center rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
        >
          Huỷ
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
      >
        Xoá
      </button>
      {error && <p className="text-[10px] text-red-600 leading-tight max-w-[140px]">{error}</p>}
    </div>
  )
}
