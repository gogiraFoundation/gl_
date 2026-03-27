'use client'

import { useAnalytics } from '@/contexts/AnalyticsContext'
import { X, Cookie, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ConsentBanner() {
  const { consentGiven, giveConsent, revokeConsent } = useAnalytics()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show banner if consent hasn't been given yet
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-900 shadow-lg dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="h-6 w-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
                  <Shield className="h-4 w-4" />
                  Privacy & Analytics
                </h3>
                <p className="mb-3 text-sm text-gray-300">
                  We use analytics to improve your experience. This helps us understand how visitors
                  interact with our website. Your data is anonymized and used only for statistical
                  purposes. You can change your preference at any time.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAccept}
                    className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleDecline}
                    className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 transition-all duration-300 hover:bg-gray-600"
                  >
                    Decline
                  </button>
                  <a
                    href="/privacy"
                    className="px-4 py-2 text-sm text-gray-400 underline transition-colors hover:text-gray-200"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-200"
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
