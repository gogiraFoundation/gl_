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
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/notifications"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Notifications
                {notificationStats && notificationStats.unread > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 rounded-full text-xs">
                    {notificationStats.unread}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Time Range</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Notifications</h2>
            <Link
              href="/admin/notifications"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
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
            <p className="text-gray-500 text-center">Loading notification stats...</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Page Views
            </h3>
            <p className="text-3xl font-bold">
              {loadingPageViews ? '...' : pageViewStats?.total_views || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Unique Visitors
            </h3>
            <p className="text-3xl font-bold">
              {loadingPageViews ? '...' : pageViewStats?.unique_visitors || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Events
            </h3>
            <p className="text-3xl font-bold">
              {loadingEvents ? '...' : eventStats?.total_events || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Event Types
            </h3>
            <p className="text-3xl font-bold">
              {loadingEvents ? '...' : eventStats?.events_by_type?.length || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Page Views Over Time</h2>
            {loadingPageViews ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <AnalyticsChart
                data={pageViewStats?.views_by_day || []}
                dataKey="count"
                nameKey="day"
                label="Page Views"
              />
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Events Over Time</h2>
            {loadingEvents ? (
              <div className="text-center py-12">Loading...</div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Top Pages</h2>
            {loadingPageViews ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <ul className="space-y-2">
                {pageViewStats?.top_pages?.slice(0, 10).map((page, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300 truncate">{page.path}</span>
                    <span className="text-gray-500 dark:text-gray-400">{page.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Top Events</h2>
            {loadingEvents ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <ul className="space-y-2">
                {eventStats?.top_events?.slice(0, 10).map((event, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300 truncate">
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

