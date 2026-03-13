'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'

interface Testimonial {
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
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <GlowCard glowColor="purple" className="p-6">
      <div className="mb-4 flex items-center">
        {testimonial.client_image ? (
          <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full border-2 border-purple-500/50">
            <Image
              src={testimonial.client_image}
              alt={testimonial.client_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-500/50 bg-gradient-primary">
            <span className="text-lg font-bold text-white">
              {testimonial.client_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-white">{testimonial.client_name}</h4>
          <p className="text-sm text-gray-400">
            {testimonial.client_role}
            {testimonial.company && ` at ${testimonial.company}`}
          </p>
        </div>
      </div>
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      <p className="italic leading-relaxed text-gray-300">&quot;{testimonial.content}&quot;</p>
    </GlowCard>
  )
}
