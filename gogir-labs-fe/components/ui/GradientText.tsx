import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  gradient?: 'primary' | 'secondary'
}

/** Serif display text — flat ink (no gradient). */
export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span className={cn('font-serif font-semibold text-brutal-ink', className)}>{children}</span>
  )
}
