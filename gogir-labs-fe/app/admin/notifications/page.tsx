'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import api from '@/lib/api'
import { Check, Trash2, Filter } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: number
  type: string
  type_display: string
  title: string
  message: string
  read: boolean
  created_at: string
}

interface NotificationResponse {
  results: Notification[]
  count: number
  next: string | null
  previous: string | null
}

export default function NotificationsPage() {
  const [readFilter, setReadFilter] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<NotificationResponse>({
    queryKey: ['notifications', 'list', readFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (readFilter !== null) {
        params.append('read', readFilter)
      }
      const response = await api.get(`/notifications/?${params.toString()}`)
      return response.data
    },
  })

  const markAsRead = useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/notifications/${id}/mark_read/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllRead = useMutation({
    mutationFn: async () => {
      await api.post('/notifications/mark_all_read/')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const deleteNotification = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/notifications/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const notifications = data?.results || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Notifications</h1>
            <div className="flex items-center gap-4">
              <select
                value={readFilter || ''}
                onChange={(e) => setReadFilter(e.target.value || null)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="">All</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
              {notifications.length > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No notifications found</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-6 ${
                    notification.read
                      ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">
                          {notification.type_display}
                        </span>
                        {!notification.read && (
                          <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">{notification.title}</h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead.mutate(notification.id)}
                          className="p-2 text-gray-400 transition-colors hover:text-green-600 dark:hover:text-green-400"
                          aria-label="Mark as read"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification.mutate(notification.id)}
                        className="p-2 text-gray-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
