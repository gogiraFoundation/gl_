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
    <div className={cn('relative w-full h-64 sm:h-96 flex items-center justify-center', className)}>
      {/* Center Icon */}
      <div className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-primary shadow-glow-purple animate-pulse-glow">
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
            className="absolute flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border-2 border-purple-500/50 hover:scale-125 hover:border-purple-500 hover:shadow-glow-purple transition-all duration-300"
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
