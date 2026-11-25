'use client'

import { useAnalytics } from '@/contexts/AnalyticsContext'
import { X, Cookie, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function ConsentBanner() {
  const { consentGiven, giveConsent, revokeConsent } = useAnalytics()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (consentGiven === null) {
      setIsVisible(true)
    }
  }, [consentGiven])

  const handleAccept = () => {
    giveConsent()
    setIsVisible(false)
  }

  const handleDecline = () => {
    revokeConsent()
    setIsVisible(false)
  }

  if (!isVisible || consentGiven !== null) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brutal-ink bg-brutal-bg shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-shell px-6 py-4 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="h-6 w-6 text-brutal-ink" aria-hidden />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="mb-1 flex items-center gap-2 font-sans text-sm font-semibold text-brutal-ink">
                  <Shield className="h-4 w-4" aria-hidden />
                  Privacy &amp; analytics
                </h3>
                <p className="mb-3 text-left text-sm leading-relaxed text-brutal-muted">
                  Anonymous analytics help improve this site. No personal profiles. You can change
                  your preference any time on the privacy page.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={handleAccept} className="btn-brutal btn-brutal-sm">
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="btn-brutal btn-brutal-sm"
                  >
                    Decline
                  </button>
                  <Link
                    href="/privacy"
                    className="inline-flex min-h-11 items-center px-4 py-2 text-sm text-brutal-muted underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDecline}
                className="flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center text-brutal-muted transition-opacity hover:opacity-70"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
