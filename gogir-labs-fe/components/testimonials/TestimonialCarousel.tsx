'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

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
  published?: boolean
}

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'featured'],
    queryFn: async () => {
      const response = await api.get('/testimonials/', {
        params: { featured: true, published: true },
      })
      return response.data.results || response.data
    },
    staleTime: 10 * 60 * 1000,
  })

  const featuredTestimonials = testimonials.filter((t) => t.featured && t.published).slice(0, 5)

  useEffect(() => {
    if (!isAutoPlaying || featuredTestimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredTestimonials.length])

  if (featuredTestimonials.length === 0) {
    return null
  }

  const currentTestimonial = featuredTestimonials[currentIndex]

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(
      (prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length
    )
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <div className="relative border border-brutal-ink/15 bg-brutal-bg p-8 md:p-10">
      <div className="mb-6 flex items-center gap-3">
        <Quote className="h-6 w-6 text-brutal-ink" />
        <h2 className="font-serif text-2xl font-semibold text-brutal-ink md:text-[2rem]">
          What people say
        </h2>
      </div>

      <div className="relative min-h-[200px]">
        <div className="text-left md:text-center">
          <div className="mb-4 flex justify-start gap-1 md:justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < currentTestimonial.rating
                    ? 'fill-brutal-ink text-brutal-ink'
                    : 'text-brutal-ink/25'
                }`}
              />
            ))}
          </div>

          <blockquote className="mb-6 font-sans text-lg leading-relaxed text-brutal-ink">
            &quot;{currentTestimonial.content}&quot;
          </blockquote>

          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-center">
            {currentTestimonial.client_image && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-brutal-ink/15">
                <Image
                  src={currentTestimonial.client_image}
                  alt={currentTestimonial.client_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-left md:text-center">
              <div className="font-semibold text-brutal-ink">{currentTestimonial.client_name}</div>
              <div className="text-sm text-brutal-muted">
                {currentTestimonial.client_role}
                {currentTestimonial.company && ` at ${currentTestimonial.company}`}
              </div>
            </div>
          </div>
        </div>

        {featuredTestimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 hidden -translate-y-1/2 border border-brutal-ink/20 bg-brutal-bg p-2 text-brutal-ink transition-opacity hover:opacity-70 md:block"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 border border-brutal-ink/20 bg-brutal-bg p-2 text-brutal-ink transition-opacity hover:opacity-70 md:block"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="mt-8 flex justify-start gap-2 md:justify-center">
              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-brutal-ink'
                      : 'w-1.5 bg-brutal-ink/25 hover:bg-brutal-ink/45'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
