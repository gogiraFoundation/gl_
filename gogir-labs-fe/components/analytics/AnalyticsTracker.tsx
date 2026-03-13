'use client'

import { usePageView } from '@/hooks/usePageView'
import { ConsentBanner } from './ConsentBanner'

/**
 * AnalyticsTracker component that handles automatic page view tracking
 * Should be included in the root layout
 */
export function AnalyticsTracker() {
  // Automatically track page views on route changes
  usePageView()

  return <ConsentBanner />
}
