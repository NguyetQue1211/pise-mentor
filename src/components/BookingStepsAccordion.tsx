'use client'

import { useState } from 'react'

interface Step {
  title: string
  description: string
}

const steps: Step[] = [
  {
    title: 'Tìm mentor phù hợp với bạn',
    description:
      'Lọc theo địa điểm, lĩnh vực hoặc chuyên môn để tìm mentor mà bạn thấy hợp với mình nhất.',
  },
  {
    title: 'Đọc hồ sơ mentor',
    description:
      'Xem mentor có kinh nghiệm gì, giỏi về mảng nào, và có thể giúp bạn những vấn đề gì.',
  },
  {
    title: 'Đặt lịch hẹn trò chuyện',
    description:
      'Nghĩ trước bạn muốn hỏi gì để buổi trò chuyện thật hữu ích. Sau đó bấm "Đặt lịch hẹn với mentor" trên hồ sơ mentor để chọn giờ hẹn phù hợp với bạn.',
  },
]

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-45' : ''}`}
    >
      <path strokeLinecap="round" d="M12 4.5v15M4.5 12h15" />
    </svg>
  )
}

export default function BookingStepsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="border-t border-neutral-200">
      {steps.map((step, i) => {
        const isOpen = openIndex === i
        return (
          <div key={step.title} className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-base font-medium text-neutral-900">
                <span className="text-primary-600 font-semibold mr-2">{i + 1}.</span>
                {step.title}
              </span>
              <span className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-300 shrink-0">
                <PlusIcon open={isOpen} />
              </span>
            </button>

            {isOpen && (
              <p className="pb-4 pr-12 text-sm text-neutral-600 leading-relaxed">
                {step.description}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
