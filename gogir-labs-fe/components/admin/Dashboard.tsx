'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnalyticsChart } from './AnalyticsChart'
import api from '@/lib/api'
import { useState } from 'react'

interface AnalyticsStats {
  total_views: number
  unique_visitors: number
  top_pages: Array<{ path: string; count: number }>
  views_by_day: Array<{ day: string; count: number }>
}

interface EventStats {
  total_events: number
  events_by_type: Array<{ event_type: string; count: number }>
  top_events: Array<{ event_name: string; count: number }>
  events_by_day: Array<{ day: string; count: number }>
}

interface NotificationStats {
  total: number
  unread: number
  read: number
}

export function Dashboard() {
  const router = useRouter()
  const [days, setDays] = useState(30)

  const { data: pageViewStats, isLoading: loadingPageViews } = useQuery<AnalyticsStats>({
    queryKey: ['analytics', 'pageviews', days],
    queryFn: async () => {
      const response = await api.get(`/analytics/pageviews/stats/?days=${days}`)
      return response.data
    },
  })

  const { data: eventStats, isLoading: loadingEvents } = useQuery<EventStats>({
    queryKey: ['analytics', 'events', days],
    queryFn: async () => {
      const response = await api.get(`/analytics/events/stats/?days=${days}`)
      return response.data
    },
  })

  const { data: notificationStats } = useQuery<NotificationStats>({
    queryKey: ['notifications', 'stats'],
    queryFn: async () => {
      const response = await api.get('/notifications/stats/')
      return response.data
    },
    refetchInterval: 30000, // Poll every 30 seconds
  })

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/notifications"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Notifications
                {notificationStats && notificationStats.unread > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs">
                    {notificationStats.unread}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Time Range</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Notifications</h2>
            <Link
              href="/admin/notifications"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              View All
            </Link>
          </div>
          {notificationStats ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{notificationStats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {notificationStats.unread}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {notificationStats.read}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading notification stats...</p>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Page Views
            </h3>
            <p className="text-3xl font-bold">
              {loadingPageViews ? '...' : pageViewStats?.total_views || 0}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Unique Visitors
            </h3>
            <p className="text-3xl font-bold">
              {loadingPageViews ? '...' : pageViewStats?.unique_visitors || 0}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Events
            </h3>
            <p className="text-3xl font-bold">
              {loadingEvents ? '...' : eventStats?.total_events || 0}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Event Types
            </h3>
            <p className="text-3xl font-bold">
              {loadingEvents ? '...' : eventStats?.events_by_type?.length || 0}
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Page Views Over Time</h2>
            {loadingPageViews ? (
              <div className="py-12 text-center">Loading...</div>
            ) : (
              <AnalyticsChart
                data={pageViewStats?.views_by_day || []}
                dataKey="count"
                nameKey="day"
                label="Page Views"
              />
            )}
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Events Over Time</h2>
            {loadingEvents ? (
              <div className="py-12 text-center">Loading...</div>
            ) : (
              <AnalyticsChart
                data={eventStats?.events_by_day || []}
                dataKey="count"
                nameKey="day"
                label="Events"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Top Pages</h2>
            {loadingPageViews ? (
              <div className="py-12 text-center">Loading...</div>
            ) : (
              <ul className="space-y-2">
                {pageViewStats?.top_pages?.slice(0, 10).map((page, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="truncate text-gray-700 dark:text-gray-300">{page.path}</span>
                    <span className="text-gray-500 dark:text-gray-400">{page.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Top Events</h2>
            {loadingEvents ? (
              <div className="py-12 text-center">Loading...</div>
            ) : (
              <ul className="space-y-2">
                {eventStats?.top_events?.slice(0, 10).map((event, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="truncate text-gray-700 dark:text-gray-300">
                      {event.event_name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{event.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
