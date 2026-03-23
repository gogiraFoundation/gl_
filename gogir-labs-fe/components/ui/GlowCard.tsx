'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'purple' | 'blue'
  /** default: true; portfolio variant uses CSS-only hover lift (no double scale) */
  hover?: boolean
  /** Softer surface for portfolio listing cards */
  variant?: 'default' | 'portfolio'
}

export function GlowCard({
  children,
  className,
  glowColor = 'purple',
  hover,
  variant = 'default',
}: GlowCardProps) {
  const isPortfolio = variant === 'portfolio'
  const enableHoverScale = hover ?? !isPortfolio

  return (
    <div
      className={cn(
        'card-glow',
        isPortfolio && 'card-glow--portfolio rounded-3xl p-6 md:p-8',
        !isPortfolio && 'rounded-lg p-5',
        enableHoverScale &&
          'transition-transform duration-300 hover:scale-105 active:scale-100',
        enableHoverScale && glowColor === 'purple' && 'hover:shadow-glow-purple',
        enableHoverScale && glowColor === 'blue' && 'hover:shadow-glow-blue',
        className
      )}
    >
      {children}
    </div>
  )
}
