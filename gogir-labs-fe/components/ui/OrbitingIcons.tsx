'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface OrbitingIconsProps {
  centerIcon: ReactNode
  icons: Array<{ icon: ReactNode; delay?: number }>
  radius?: number
  className?: string
}

export function OrbitingIcons({ centerIcon, icons, radius = 100, className }: OrbitingIconsProps) {
  return (
    <div className={cn('relative flex h-64 w-full items-center justify-center sm:h-96', className)}>
      {/* Center Icon */}
      <div className="relative z-10 flex h-16 w-16 animate-pulse-glow items-center justify-center rounded-full bg-gradient-primary shadow-glow-purple sm:h-24 sm:w-24">
        {centerIcon}
      </div>

      {/* Orbiting Icons */}
      {icons.map((item, index) => {
        const angle = (360 / icons.length) * index
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius

        return (
          <div
            key={index}
            className="absolute flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-500/50 bg-gray-800 transition-all duration-300 hover:scale-125 hover:border-purple-500 hover:shadow-glow-purple sm:h-12 sm:w-12"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {item.icon}
          </div>
        )
      })}
    </div>
  )
}
