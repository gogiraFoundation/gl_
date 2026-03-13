'use client'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import api from '@/lib/api'
import { useEffect } from 'react'

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const [pageViews, events] = await Promise.all([
        api.get('/analytics/pageviews/stats/', { params: { days: 30 } }),
        api.get('/analytics/events/stats/', { params: { days: 30 } }),
      ])
      return {
        pageViews: pageViews.data,
        events: events.data,
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    document.title = 'Analytics Dashboard | Admin - Emmanuel Ugbaije'
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-12">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <h1 className="gradient-text mb-8 text-4xl font-bold md:text-5xl">Analytics Dashboard</h1>
          {isLoading ? (
            <div className="py-12 text-center text-gray-400">Loading analytics...</div>
          ) : stats ? (
            <AnalyticsDashboard stats={stats} />
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
