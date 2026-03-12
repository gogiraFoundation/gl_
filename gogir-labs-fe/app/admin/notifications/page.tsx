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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Notifications</h1>
            <div className="flex items-center gap-4">
              <select
                value={readFilter || ''}
                onChange={(e) => setReadFilter(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="">All</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
              {notifications.length > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No notifications found</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 rounded-lg border ${
                    notification.read
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                          {notification.type_display}
                        </span>
                        {!notification.read && (
                          <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded">
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{notification.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{notification.message}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead.mutate(notification.id)}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          aria-label="Mark as read"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification.mutate(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
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

