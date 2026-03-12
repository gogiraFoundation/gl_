'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Check } from 'lucide-react'
import { useEffect, useRef } from 'react'
import api from '@/lib/api'
import Link from 'next/link'

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

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useQuery<NotificationResponse>({
    queryKey: ['notifications', 'list'],
    queryFn: async () => {
      const response = await api.get('/notifications/?read=false&page_size=10')
      return response.data
    },
  })

  const queryClient = useQueryClient()

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const notifications = data?.results || []

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No new notifications</div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead.mutate(notification.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    aria-label="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link
            href="/admin/notifications"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}

