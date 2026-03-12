'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WireframeMockupProps {
  children: ReactNode
  className?: string
  title?: string
  zIndex?: number
}

export function WireframeMockup({ children, className, title, zIndex = 1 }: WireframeMockupProps) {
  return (
    <div
      className={cn(
        'relative bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-xl',
        className
      )}
      style={{ zIndex }}
    >
      {/* Browser Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-300 dark:border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        {title && (
          <div className="flex-1 text-center text-xs text-gray-500 dark:text-gray-400 truncate">
            {title}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  )
}

