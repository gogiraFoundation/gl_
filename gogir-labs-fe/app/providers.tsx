'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ThemeProvider>
      <AnalyticsProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* React Query DevTools temporarily disabled due to chunk loading issues */}
          {/* To enable: Install browser extension or use dynamic import with error handling */}
        </QueryClientProvider>
      </AnalyticsProvider>
    </ThemeProvider>
  )
}
