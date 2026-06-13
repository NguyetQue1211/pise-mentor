'use client'

import { useState, useEffect, useRef } from 'react'
import { recordBookingIntent } from '@/app/actions/booking'

interface CalendlyWidgetProps {
  url: string
  mentorProfileId: string
}

export default function CalendlyWidget({ url, mentorProfileId }: CalendlyWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const initialized = useRef(false)

  // Detect when user completes booking inside the embed
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (
        e.origin === 'https://calendly.com' &&
        e.data?.event === 'calendly.event_scheduled'
      ) {
        recordBookingIntent(mentorProfileId).catch(() => {})
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [mentorProfileId])

  // Initialize Calendly inline widget on first open
  useEffect(() => {
    if (!isOpen || initialized.current) return

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Calendly = (window as any).Calendly
      if (!Calendly) return
      Calendly.initInlineWidget({
        url,
        parentElement: document.getElementById('calendly-embed'),
      })
      initialized.current = true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Calendly) {
      init()
    } else {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = init
      document.head.appendChild(script)
    }
  }, [isOpen, url])

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
      >
        Book via Calendly
      </button>

      {/* Keep in DOM after first open so widget stays initialized */}
      <div
        id="calendly-embed"
        className={isOpen ? '' : 'hidden'}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  )
}
