'use client'

import { TestimonialCard, type Testimonial } from '@/components/testimonials/TestimonialCard'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

/** Infinite horizontal marquee (left → right flow); pauses on hover. */
export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  if (testimonials.length === 0) return null

  const loop = [...testimonials, ...testimonials]

  return (
    <div className="space-y-6">
      {/* Reduced motion: static grid, no duplicate strip */}
      <div className="hidden grid-cols-1 gap-8 motion-reduce:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} accent={i % 2 === 0 ? 'green' : 'orange'} />
        ))}
      </div>

      <div
        className="group relative -mx-4 overflow-hidden py-2 motion-reduce:hidden md:-mx-6"
        aria-label="Testimonials carousel"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-brutal-bg via-brutal-bg/90 to-transparent sm:w-14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-brutal-bg via-brutal-bg/90 to-transparent sm:w-14"
          aria-hidden
        />

        <div className="flex w-max animate-testimonial-marquee gap-6 group-hover:[animation-play-state:paused] md:gap-8">
          {loop.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="w-[min(calc(100vw-3rem),320px)] shrink-0 sm:w-[300px] md:w-[320px]"
            >
              <TestimonialCard testimonial={t} accent={i % 2 === 0 ? 'green' : 'orange'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
