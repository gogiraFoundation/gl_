'use client'

import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import api from '@/lib/api'
import { NotificationDropdown } from './NotificationDropdown'

interface NotificationStats {
  total: number
  unread: number
  read: number
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)

  const { data: stats } = useQuery<NotificationStats>({
    queryKey: ['notifications', 'stats'],
    queryFn: async () => {
      const response = await api.get('/notifications/stats/')
      return response.data
    },
    refetchInterval: 30000, // Poll every 30 seconds
  })

  const unreadCount = stats?.unread || 0

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  )
}
