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
    <div className="relative rounded-lg border border-slate-200 bg-slate-50/90 p-8 dark:border-gray-700 dark:bg-gray-900/50">
      <div className="mb-6 flex items-center gap-2">
        <Quote className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What People Say</h2>
      </div>

      <div className="relative min-h-[200px]">
        <div className="text-center">
          {/* Rating */}
          <div className="mb-4 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < currentTestimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <blockquote className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
            &quot;{currentTestimonial.content}&quot;
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-center gap-4">
            {currentTestimonial.client_image && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={currentTestimonial.client_image}
                  alt={currentTestimonial.client_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {currentTestimonial.client_name}
              </div>
              <div className="text-sm text-slate-500 dark:text-gray-400">
                {currentTestimonial.client_role}
                {currentTestimonial.company && ` at ${currentTestimonial.company}`}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {featuredTestimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-transparent dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-transparent dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-purple-600 dark:bg-purple-400'
                      : 'bg-slate-300 hover:bg-slate-400 dark:bg-gray-600 dark:hover:bg-gray-500'
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
