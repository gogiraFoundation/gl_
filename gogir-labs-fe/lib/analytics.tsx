/**
 * Analytics utility functions for automatic event tracking
 * These can be used to add analytics tracking to any component
 */

import React from 'react'

import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

/**
 * Higher-order component to automatically track clicks on links
 */
export function withAnalyticsTracking<T extends { onClick?: () => void }>(
  Component: React.ComponentType<T>,
  eventName: string,
  metadata?: Record<string, any>
) {
  return function TrackedComponent(props: T) {
    const { trackClick } = useAnalyticsEvent()

    const handleClick = () => {
      trackClick(eventName, metadata)
      props.onClick?.()
    }

    return <Component {...props} onClick={handleClick} />
  }
}

/**
 * Utility to track external link clicks
 */
export function trackExternalLink(url: string, linkText?: string) {
  if (typeof window === 'undefined') return

  // This will be called from components that have access to useAnalyticsEvent
  return {
    eventName: 'external_link_click',
    metadata: {
      url,
      linkText,
      domain: new URL(url).hostname,
    },
  }
}

/**
 * Utility to track download events
 */
export function trackDownload(fileName: string, fileType?: string) {
  return {
    eventName: 'download',
    metadata: {
      fileName,
      fileType,
    },
  }
}
