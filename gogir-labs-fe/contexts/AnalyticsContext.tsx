'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'

interface AnalyticsContextType {
  consentGiven: boolean | null
  trackingEnabled: boolean
  giveConsent: () => void
  revokeConsent: () => void
  trackPageView: (path: string, referer?: string) => Promise<void>
  trackEvent: (eventName: string, eventType: string, metadata?: Record<string, any>) => Promise<void>
  getSessionId: () => string
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

const CONSENT_KEY = 'analytics_consent'
const SESSION_KEY = 'analytics_session_id'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null)
  const [trackingEnabled, setTrackingEnabled] = useState(false)

  // Initialize consent state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (stored !== null) {
        const hasConsent = stored === 'true'
        setConsentGiven(hasConsent)
        setTrackingEnabled(hasConsent)
      } else {
        setConsentGiven(null) // Not yet decided
      }
    }
  }, [])

  // Generate or retrieve session ID
  const getSessionId = useCallback((): string => {
    if (typeof window === 'undefined') return ''

    const stored = sessionStorage.getItem(SESSION_KEY)
    const storedTime = sessionStorage.getItem(`${SESSION_KEY}_time`)
    
    if (stored && storedTime) {
      const time = parseInt(storedTime, 10)
      const now = Date.now()
      
      // If session is still valid, return existing ID
      if (now - time < SESSION_DURATION) {
        return stored
      }
    }

    // Generate new session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem(SESSION_KEY, newSessionId)
    sessionStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString())
    
    return newSessionId
  }, [])

  const giveConsent = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSENT_KEY, 'true')
      setConsentGiven(true)
      setTrackingEnabled(true)
    }
  }, [])

  const revokeConsent = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSENT_KEY, 'false')
      setConsentGiven(false)
      setTrackingEnabled(false)
      // Clear any stored analytics data
      sessionStorage.removeItem(SESSION_KEY)
      sessionStorage.removeItem(`${SESSION_KEY}_time`)
    }
  }, [])

  const trackPageView = useCallback(async (path: string, referer?: string) => {
    if (!trackingEnabled || typeof window === 'undefined') return

    try {
      const sessionId = getSessionId()
      const userAgent = navigator.userAgent
      
      // Get IP address (will be handled by backend from request)
      await api.post('/analytics/pageviews/', {
        path,
        referer: referer || document.referrer || '',
        user_agent: userAgent,
        session_id: sessionId,
      })
    } catch (error) {
      // Silently fail - don't interrupt user experience
      console.error('Analytics: Failed to track page view', error)
    }
  }, [trackingEnabled, getSessionId])

  const trackEvent = useCallback(async (
    eventName: string,
    eventType: string = 'custom',
    metadata: Record<string, any> = {}
  ) => {
    if (!trackingEnabled || typeof window === 'undefined') return

    try {
      const sessionId = getSessionId()
      const userAgent = navigator.userAgent
      const path = window.location.pathname

      await api.post('/analytics/events/', {
        event_type: eventType,
        event_name: eventName,
        path,
        metadata,
        user_agent: userAgent,
        session_id: sessionId,
      })
    } catch (error) {
      // Silently fail - don't interrupt user experience
      console.error('Analytics: Failed to track event', error)
    }
  }, [trackingEnabled, getSessionId])

  return (
    <AnalyticsContext.Provider
      value={{
        consentGiven,
        trackingEnabled,
        giveConsent,
        revokeConsent,
        trackPageView,
        trackEvent,
        getSessionId,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

