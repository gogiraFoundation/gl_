'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  gradient?: 'primary' | 'secondary'
}

export function GradientText({ children, className, gradient = 'primary' }: GradientTextProps) {
  return (
    <span
      className={cn(
        'gradient-text font-bold',
        gradient === 'primary' && 'bg-gradient-primary',
        gradient === 'secondary' && 'bg-gradient-secondary',
        className
      )}
    >
      {children}
    </span>
  )
}

