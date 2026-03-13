'use client'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TestimonialCard } from '@/components/testimonials/TestimonialCard'
import api from '@/lib/api'
import { useEffect } from 'react'
import { Quote } from 'lucide-react'

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

export default function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const response = await api.get('/testimonials/', { params: { published: true } })
      return response.data.results || response.data
    },
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    document.title = 'Testimonials | Emmanuel Ugbaije'
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Quote className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">Testimonials</h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              What clients and colleagues say about working with me
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No testimonials available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial: Testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

