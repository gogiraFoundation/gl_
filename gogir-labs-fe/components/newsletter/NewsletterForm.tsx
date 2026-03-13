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

export function NewsletterForm({
  source = 'unknown',
  showNameField = false,
  compact = false,
}: NewsletterFormProps) {
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
              {...register('email')}
              className="glass min-h-[48px] w-full rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="whitespace-nowrap rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? '...' : 'Subscribe'}
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/20 p-3 text-sm text-green-300">
            Successfully subscribed! Please check your email to verify.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-3 text-sm text-red-300">
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
        {...register('website')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {showNameField && (
        <div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="newsletter-name"
              className="min-w-[100px] whitespace-nowrap text-sm font-medium text-white"
            >
              Name (Optional)
            </label>
            <input
              type="text"
              id="newsletter-name"
              {...register('name')}
              className="glass flex-1 rounded-lg px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-4">
          <label
            htmlFor="newsletter-email"
            className="min-w-[100px] whitespace-nowrap text-sm font-medium text-white"
          >
            Email *
          </label>
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="newsletter-email"
              {...register('email')}
              className="glass w-full rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>
        </div>
        {errors.email && <p className="ml-[116px] text-sm text-red-400">{errors.email.message}</p>}
      </div>

      {submitStatus === 'success' && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/20 p-4 text-green-300">
          Successfully subscribed! Please check your email to verify your subscription.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-red-300">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gradient-primary px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
      </button>
    </form>
  )
}
