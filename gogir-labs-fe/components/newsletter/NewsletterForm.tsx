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
      await api.post('/newsletter/subscribe/', {
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

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <input
              type="email"
              id="newsletter-email-compact"
              {...register('email')}
              className="min-h-[48px] w-full border border-white/30 bg-transparent px-4 py-2 text-sm text-white transition-opacity placeholder:text-white/50 focus:border-white focus:outline-none"
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] w-full touch-manipulation select-none whitespace-nowrap rounded-md border border-orange-500/70 bg-transparent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(255,69,0,0.35)] transition-[color,box-shadow,border-color] duration-300 ease-out hover:border-orange-400 hover:text-[#f5f5f5] hover:shadow-[0_12px_24px_rgba(255,69,0,0.45)] active:border-orange-300 active:text-[#f5f5f5] active:shadow-[0_8px_18px_rgba(255,69,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? '...' : 'Subscribe'}
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className="border border-white/25 p-3 text-sm text-white/90">
            Successfully subscribed! Please check your email to verify.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="border border-white/25 p-3 text-sm text-red-200">{errorMessage}</div>
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
              className="min-w-[100px] whitespace-nowrap text-sm font-medium text-brutal-ink"
            >
              Name (Optional)
            </label>
            <input
              type="text"
              id="newsletter-name"
              {...register('name')}
              className="flex-1 border border-brutal-ink/20 bg-brutal-bg px-4 py-3 text-brutal-ink placeholder:text-brutal-muted focus:border-brutal-ink focus:outline-none"
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
            className="min-w-[100px] whitespace-nowrap text-sm font-medium text-brutal-ink"
          >
            Email *
          </label>
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-brutal-muted" />
            </div>
            <input
              type="email"
              id="newsletter-email"
              {...register('email')}
              className="w-full border border-brutal-ink/20 bg-brutal-bg py-3 pl-10 pr-4 text-brutal-ink placeholder:text-brutal-muted focus:border-brutal-ink focus:outline-none"
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>
        </div>
        {errors.email && <p className="ml-[116px] text-sm text-red-700">{errors.email.message}</p>}
      </div>

      {submitStatus === 'success' && (
        <div className="border border-brutal-ink/20 p-4 text-brutal-ink">
          Successfully subscribed! Please check your email to verify your subscription.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="border border-brutal-ink/20 p-4 text-red-700">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border border-brutal-ink bg-transparent px-5 py-2.5 font-semibold text-brutal-ink transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
      </button>
    </form>
  )
}
