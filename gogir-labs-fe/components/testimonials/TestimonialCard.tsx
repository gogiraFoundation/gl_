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
  /** Left-edge accent for carousel layouts */
  accent?: 'green' | 'orange'
  className?: string
}

export function TestimonialCard({ testimonial, accent, className }: TestimonialCardProps) {
  return (
    <GlowCard
      className={cn(
        'h-full border border-brutal-ink/10 p-6 transition-transform duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        accent === 'green' && 'border-l-[3px] border-l-brutal-ink/40',
        accent === 'orange' && 'border-l-[3px] border-l-[orangered]',
        className
      )}
    >
      <div className="mb-4 flex items-center">
        {testimonial.client_image ? (
          <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full border border-brutal-ink/20">
            <Image
              src={testimonial.client_image}
              alt={testimonial.client_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full border border-brutal-ink/20 bg-brutal-bg">
            <span className="text-lg font-bold text-brutal-ink">
              {testimonial.client_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="text-left">
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
              'h-4 w-4',
              i < testimonial.rating
                ? 'fill-brutal-ink text-brutal-ink'
                : 'fill-transparent text-brutal-ink/25'
            )}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-left leading-relaxed text-brutal-ink">&quot;{testimonial.content}&quot;</p>
    </GlowCard>
  )
}
