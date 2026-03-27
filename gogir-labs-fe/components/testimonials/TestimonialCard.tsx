'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { cn } from '@/lib/utils'

export interface Testimonial {
  id: number
  client_name: string
  client_role: string
  company: string
  content: string
  rating: number
  client_image: string | null
  company_logo: string | null
  featured: boolean
  created_at: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  /** Light green / orangered accents for carousel or featured layouts */
  accent?: 'green' | 'orange'
  className?: string
}

export function TestimonialCard({ testimonial, accent, className }: TestimonialCardProps) {
  const starFilled =
    accent === 'green'
      ? 'fill-emerald-600/85 text-emerald-600'
      : accent === 'orange'
        ? 'fill-[#ff4500]/85 text-[#ff4500]'
        : 'fill-brutal-ink text-brutal-ink'

  return (
    <GlowCard
      className={cn(
        'group/card h-full p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        'hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-[0_14px_36px_rgba(0,0,0,0.1)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100',
        accent === 'green' &&
          'border-l-[3px] border-l-emerald-300/80 bg-gradient-to-br from-emerald-50/95 via-brutal-bg to-brutal-bg shadow-[0_4px_22px_rgba(16,185,129,0.09)] hover:border-l-emerald-400/90 hover:shadow-[0_16px_40px_rgba(16,185,129,0.14)]',
        accent === 'orange' &&
          'border-l-[3px] border-l-[#ff4500]/50 bg-gradient-to-br from-orange-50/95 via-brutal-bg to-brutal-bg shadow-[0_4px_22px_rgba(255,69,0,0.11)] hover:border-l-[#ff6347]/80 hover:shadow-[0_16px_40px_rgba(255,69,0,0.16)]',
        !accent && 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      <div className="mb-4 flex items-center">
        {testimonial.client_image ? (
          <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full border border-brutal-ink/20 transition-transform duration-300 group-hover/card:scale-105">
            <Image
              src={testimonial.client_image}
              alt={testimonial.client_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              'mr-4 flex h-12 w-12 items-center justify-center rounded-full border bg-brutal-bg transition-transform duration-300 group-hover/card:scale-105',
              accent === 'green' && 'border-emerald-300/50',
              accent === 'orange' && 'border-[#ff4500]/35',
              !accent && 'border-brutal-ink/20'
            )}
          >
            <span className="text-lg font-bold text-brutal-ink">
              {testimonial.client_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-brutal-ink">{testimonial.client_name}</h4>
          <p className="text-sm text-brutal-muted">
            {testimonial.client_role}
            {testimonial.company && ` at ${testimonial.company}`}
          </p>
        </div>
      </div>
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4 transition-transform duration-300 group-hover/card:scale-110',
              i < testimonial.rating ? starFilled : 'fill-transparent text-brutal-ink/25'
            )}
          />
        ))}
      </div>
      <p className="italic leading-relaxed text-brutal-ink">&quot;{testimonial.content}&quot;</p>
    </GlowCard>
  )
}
