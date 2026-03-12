'use client'

import { useCallback } from 'react'
import { useAnalytics } from '@/contexts/AnalyticsContext'

export type EventType = 'click' | 'download' | 'form_submit' | 'video_play' | 'custom'

interface TrackEventOptions {
  eventType?: EventType
  metadata?: Record<string, any>
}

export function useAnalyticsEvent() {
  const { trackEvent, trackingEnabled } = useAnalytics()

  const trackClick = useCallback((eventName: string, metadata?: Record<string, any>) => {
    if (trackingEnabled) {
      trackEvent(eventName, 'click', metadata)
    }
  }, [trackEvent, trackingEnabled])

  const trackDownload = useCallback((fileName: string, metadata?: Record<string, any>) => {
    if (trackingEnabled) {
      trackEvent(`download_${fileName}`, 'download', { fileName, ...metadata })
    }
  }, [trackEvent, trackingEnabled])

  const trackFormSubmit = useCallback((formName: string, metadata?: Record<string, any>) => {
    if (trackingEnabled) {
      trackEvent(`form_submit_${formName}`, 'form_submit', { formName, ...metadata })
    }
  }, [trackEvent, trackingEnabled])

  const trackVideoPlay = useCallback((videoName: string, metadata?: Record<string, any>) => {
    if (trackingEnabled) {
      trackEvent(`video_play_${videoName}`, 'video_play', { videoName, ...metadata })
    }
  }, [trackEvent, trackingEnabled])

  const trackCustom = useCallback((eventName: string, metadata?: Record<string, any>) => {
    if (trackingEnabled) {
      trackEvent(eventName, 'custom', metadata)
    }
  }, [trackEvent, trackingEnabled])

  return {
    trackClick,
    trackDownload,
    trackFormSubmit,
    trackVideoPlay,
    trackCustom,
    trackEvent: (eventName: string, options?: TrackEventOptions) => {
      if (trackingEnabled) {
        trackEvent(eventName, options?.eventType || 'custom', options?.metadata)
      }
    },
  }
}

