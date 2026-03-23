'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '@/lib/api'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

const fieldClass = cn(
  'w-full min-h-[48px] rounded-xl border px-4 py-3 text-[var(--text-primary)] transition-all duration-200',
  'border-[var(--border-default)] bg-[var(--surface-input)]',
  'placeholder:text-[var(--text-tertiary)]',
  'focus:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]'
)

const labelClass = 'mb-1.5 block text-sm font-semibold text-[var(--text-primary)]'

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

      trackFormSubmit('contact', {
        subject: data.subject,
      })

      setSubmitStatus('success')
      reset()
    } catch (error: unknown) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input
        type="text"
        id="website"
        {...register('website')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-2">
        <label htmlFor="name" className={labelClass}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={fieldClass}
          placeholder="Your name"
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className={labelClass}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={fieldClass}
          placeholder="your.email@example.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className={labelClass}>
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className={fieldClass}
          placeholder="What's this about?"
          autoComplete="off"
        />
        {errors.subject && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          className={cn(fieldClass, 'min-h-[140px] resize-none')}
          placeholder="Tell me about your project or opportunity..."
          autoComplete="off"
        />
        {errors.message && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="rounded-xl border border-green-600/40 bg-green-500/10 p-4 text-green-800 dark:border-green-500/50 dark:bg-green-500/20 dark:text-green-300">
          Thank you for your message! We will get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="rounded-xl border border-red-600/40 bg-red-500/10 p-4 text-red-800 dark:border-red-500/50 dark:bg-red-500/20 dark:text-red-300">
          There was an error submitting your message. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-900/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:hover:shadow-purple-900/35"
      >
        {isSubmitting ? 'Sending...' : 'Discuss Your Project'}
      </button>
    </form>
  )
}
