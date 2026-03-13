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
        'relative rounded-lg border-2 border-gray-300 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900',
        className
      )}
      style={{ zIndex }}
    >
      {/* Browser Header */}
      <div className="flex items-center gap-2 border-b border-gray-300 p-3 dark:border-gray-700">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        {title && (
          <div className="flex-1 truncate text-center text-xs text-gray-500 dark:text-gray-400">
            {title}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  )
}
