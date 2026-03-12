'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'purple' | 'blue'
  hover?: boolean
}

export function GlowCard({ children, className, glowColor = 'purple', hover = true }: GlowCardProps) {
  return (
    <div
      className={cn(
        'card-glow rounded-lg p-5',
        hover && 'hover:scale-105 transition-transform duration-300 active:scale-100',
        glowColor === 'purple' && 'hover:shadow-glow-purple',
        glowColor === 'blue' && 'hover:shadow-glow-blue',
        className
      )}
    >
      {children}
    </div>
  )
}

