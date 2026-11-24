'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import api from '@/lib/api'
import { useEffect } from 'react'

export default function AnalyticsPage() {
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('access_token') ?? localStorage.getItem('access_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
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
    retry: false,
  })

  useEffect(() => {
    document.title = 'Analytics Dashboard | Admin - Emmanuel Ugbaje'
  }, [])

  useEffect(() => {
    if ((error as { response?: { status?: number } } | null)?.response?.status === 401) {
      router.push('/admin/login')
    }
  }, [error, router])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 px-4 py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Analytics dashboard
          </h1>
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Loading analytics…</div>
          ) : stats ? (
            <AnalyticsDashboard stats={stats} />
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
