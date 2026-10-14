'use client'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TestimonialCard } from '@/components/testimonials/TestimonialCard'
import api from '@/lib/api'
import { useEffect } from 'react'

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
    document.title = 'Testimonials | Emmanuel Ugbaje'
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-16 lg:px-8 md:py-24">
        <div className="mx-auto max-w-shell">
          <header className="mb-12 max-w-2xl text-left">
            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
              Testimonials
            </h1>
            <p className="text-left text-base leading-relaxed text-brutal-muted md:text-lg">
              What clients and colleagues say about the work.
            </p>
          </header>

          {isLoading ? (
            <p className="py-12 text-left text-brutal-muted">Loading testimonials…</p>
          ) : testimonials.length === 0 ? (
            <p className="py-12 text-left text-brutal-muted">No testimonials published yet.</p>
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
