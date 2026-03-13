'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '@/lib/api'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(), // Honeypot field
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const { trackFormSubmit } = useAnalyticsEvent()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot spam protection
    if (data.website) {
      console.warn('Spam detected: honeypot field filled')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await api.post('/contact/', {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })

      // Track form submission
      trackFormSubmit('contact', {
        subject: data.subject,
      })

      setSubmitStatus('success')
      reset()
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        id="website"
        {...register('website')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <label
            htmlFor="name"
            className="min-w-[100px] whitespace-nowrap text-sm font-semibold text-white"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="min-h-[48px] flex-1 rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your name"
            autoComplete="name"
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
          />
        </div>
        {errors.name && <p className="ml-[116px] text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <label
            htmlFor="email"
            className="min-w-[100px] whitespace-nowrap text-sm font-semibold text-white"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="min-h-[48px] flex-1 rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your.email@example.com"
            autoComplete="email"
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
          />
        </div>
        {errors.email && <p className="ml-[116px] text-sm text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <label
            htmlFor="subject"
            className="min-w-[100px] whitespace-nowrap text-sm font-semibold text-white"
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            {...register('subject')}
            className="min-h-[48px] flex-1 rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="What's this about?"
            autoComplete="off"
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
          />
        </div>
        {errors.subject && (
          <p className="ml-[116px] text-sm text-red-400">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-4">
          <label
            htmlFor="message"
            className="min-w-[100px] whitespace-nowrap pt-3 text-sm font-semibold text-white"
          >
            Message *
          </label>
          <textarea
            id="message"
            rows={6}
            {...register('message')}
            className="flex-1 resize-none rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Tell me about your project or opportunity..."
            autoComplete="off"
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
          />
        </div>
        {errors.message && (
          <p className="ml-[116px] text-sm text-red-400">{errors.message.message}</p>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/20 p-4 text-green-300">
          Thank you for your message! We will get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-red-300">
          There was an error submitting your message. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 min-h-[44px] w-full rounded-lg bg-gradient-primary px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting ? 'Sending...' : 'Discuss Your Project'}
      </button>
    </form>
  )
}
