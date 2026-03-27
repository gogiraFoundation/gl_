'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'purple' | 'blue'
  hover?: boolean
  variant?: 'default' | 'portfolio'
}

/** Flat elevated surface — shadow replaces border (Brutalist Elegance). */
export function GlowCard({
  children,
  className,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        'bg-brutal-bg shadow-[0_4px_16px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,0.04)_inset]',
        className
      )}
    >
      {children}
    </div>
  )
}
