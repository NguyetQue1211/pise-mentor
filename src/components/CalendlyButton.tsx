'use client';

import { useRef, useState } from 'react';
import Script from 'next/script';

interface CalendlyButtonProps {
  url?: string;
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const FALLBACK_TIMEOUT_MS = 4000;

export default function CalendlyButton({ url }: CalendlyButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!url) {
    return (
      <p className="text-sm text-neutral-500">
        Hiện chưa thể đặt lịch với mentor này.
      </p>
    );
  }

  function openWidget() {
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: url! });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setIsOpening(false);
  }

  function handleClick() {
    if (window.Calendly) {
      openWidget();
      return;
    }
    // Widget script is still loading — show feedback and open as soon as it's ready,
    // or fall back to a new tab if it never becomes ready.
    setIsOpening(true);
    fallbackTimer.current = setTimeout(openWidget, FALLBACK_TIMEOUT_MS);
  }

  return (
    <>
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onReady={() => {
          if (isOpening) openWidget();
        }}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isOpening}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-70 disabled:cursor-wait transition-[filter]"
      >
        {isOpening && (
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        )}
        {isOpening ? 'Đang mở lịch…' : 'Đặt lịch hẹn với mentor'}
      </button>
    </>
  );
}
