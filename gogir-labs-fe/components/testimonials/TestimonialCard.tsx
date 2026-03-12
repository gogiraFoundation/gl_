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
      <div className="flex items-center mb-4">
        {testimonial.client_image ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-500/50">
            <Image
              src={testimonial.client_image}
              alt={testimonial.client_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mr-4 border-2 border-purple-500/50">
            <span className="text-white font-bold text-lg">
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
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      <p className="text-gray-300 italic leading-relaxed">&quot;{testimonial.content}&quot;</p>
    </GlowCard>
  )
}

