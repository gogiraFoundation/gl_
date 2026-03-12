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
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  )
}

