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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-12">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Quote className="h-8 w-8 text-purple-400" />
              <h1 className="gradient-text text-4xl font-bold md:text-5xl">Testimonials</h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              What clients and colleagues say about working with me
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-gray-400">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400">No testimonials available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
