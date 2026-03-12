'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '@/lib/api'
import { Mail } from 'lucide-react'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().optional(),
  website: z.string().optional(), // Honeypot field
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterFormProps {
  source?: string
  showNameField?: boolean
  compact?: boolean
}

export function NewsletterForm({ source = 'unknown', showNameField = false, compact = false }: NewsletterFormProps) {
  const { trackFormSubmit } = useAnalyticsEvent()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      source,
    },
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await api.post('/newsletter/subscribe/', {
        email: data.email,
        name: data.name || '',
        source: data.source || source,
      })
      
      // Track form submission
      trackFormSubmit('newsletter', {
        source: data.source || source,
        hasName: !!data.name,
      })
      
      setSubmitStatus('success')
      reset()
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error)
      setSubmitStatus('error')
      if (error.response?.data?.email) {
        setErrorMessage(error.response.data.email[0])
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message)
      } else {
        setErrorMessage('Failed to subscribe. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          id="website"
          name="website"
          {...register('website')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="email"
              id="newsletter-email-compact"
              name="email"
              {...register('email')}
              className="w-full px-4 py-2 min-h-[48px] glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm whitespace-nowrap"
          >
            {isSubmitting ? '...' : 'Subscribe'}
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className="p-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg text-sm">
            Successfully subscribed! Please check your email to verify.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        id="newsletter-website"
        name="website"
        {...register('website')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {showNameField && (
        <div>
          <div className="flex items-center gap-4">
            <label htmlFor="newsletter-name" className="text-sm font-medium text-white whitespace-nowrap min-w-[100px]">
              Name (Optional)
            </label>
            <input
              type="text"
              id="newsletter-name"
              name="name"
              {...register('name')}
              className="flex-1 px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-4">
            <label htmlFor="newsletter-email" className="text-sm font-medium text-white whitespace-nowrap min-w-[100px]">
              Email *
            </label>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                {...register('email')}
              className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>
        </div>
        {errors.email && (
          <p className="ml-[116px] text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg">
          Successfully subscribed! Please check your email to verify your subscription.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-5 py-2.5 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
      </button>
    </form>
  )
}

