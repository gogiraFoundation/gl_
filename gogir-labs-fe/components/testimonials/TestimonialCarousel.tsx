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
}

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'featured'],
    queryFn: async () => {
      const response = await api.get('/testimonials/', { params: { featured: true, published: true } })
      return response.data.results || response.data
    },
    staleTime: 10 * 60 * 1000,
  })

  const featuredTestimonials = testimonials.filter(t => t.featured && t.published).slice(0, 5)

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
    setCurrentIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
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
    <div className="relative bg-gray-900/50 rounded-lg p-8 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Quote className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">What People Say</h2>
      </div>

      <div className="relative min-h-[200px]">
        <div className="text-center">
          {/* Rating */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < currentTestimonial.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <blockquote className="text-lg text-gray-300 mb-6 leading-relaxed">
            &quot;{currentTestimonial.content}&quot;
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-center gap-4">
            {currentTestimonial.client_image && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={currentTestimonial.client_image}
                  alt={currentTestimonial.client_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold text-white">{currentTestimonial.client_name}</div>
              <div className="text-sm text-gray-400">
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-purple-400 w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
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

