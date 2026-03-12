'use client'

import { useAnalytics } from '@/contexts/AnalyticsContext'
import { X, Cookie, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 dark:bg-gray-800 border-t border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy & Analytics
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  We use analytics to improve your experience. This helps us understand how visitors interact with our website. 
                  Your data is anonymized and used only for statistical purposes. You can change your preference at any time.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple text-sm"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 text-sm"
                  >
                    Decline
                  </button>
                  <a
                    href="/privacy"
                    className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors text-sm underline"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

