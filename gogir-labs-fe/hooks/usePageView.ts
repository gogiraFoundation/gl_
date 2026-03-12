'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAnalytics } from '@/contexts/AnalyticsContext'

export function usePageView() {
  const pathname = usePathname()
  const { trackPageView, trackingEnabled } = useAnalytics()
  const previousPathname = useRef<string>()

  useEffect(() => {
    // Only track if consent is given and pathname has changed
    if (trackingEnabled && pathname && pathname !== previousPathname.current) {
      // Small delay to ensure page is fully loaded
      const timeoutId = setTimeout(() => {
        trackPageView(pathname, previousPathname.current)
        previousPathname.current = pathname
      }, 100)

      return () => clearTimeout(timeoutId)
    } else if (pathname) {
      previousPathname.current = pathname
    }
  }, [pathname, trackPageView, trackingEnabled])
}

