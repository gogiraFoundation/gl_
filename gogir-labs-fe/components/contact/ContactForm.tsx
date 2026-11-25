'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '@/lib/api'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { cn } from '@/lib/utils'

const SUBJECT_OPTIONS = ['Project enquiry', 'Security review', 'Role / hiring', 'Other'] as const

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.enum(SUBJECT_OPTIONS, { required_error: 'Select a subject' }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

const fieldClass = cn(
  'contact-input w-full min-h-[48px] border border-essay-ink/20 bg-essay-bg px-4 py-3 font-essay-sans text-essay-ink transition-colors duration-essay-fast ease-essay',
  'placeholder:text-essay-muted',
  'focus-visible:border-essay-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-essay-accent'
)

const labelClass = 'mb-1.5 block font-essay-sans text-sm font-semibold text-essay-ink'

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
        {errors.name && <p className="text-sm text-red-700">{errors.name.message}</p>}
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
        {errors.email && <p className="text-sm text-red-700">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className={labelClass}>
          Subject *
        </label>
        <select id="subject" {...register('subject')} className={fieldClass} defaultValue="">
          <option value="" disabled>
            Select a subject
          </option>
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.subject && <p className="text-sm text-red-700">{errors.subject.message}</p>}
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
          placeholder="Problem, stack, and timeline…"
          autoComplete="off"
        />
        {errors.message && <p className="text-sm text-red-700">{errors.message.message}</p>}
      </div>

      {submitStatus === 'success' && (
        <div className="border border-essay-ink/20 p-4 font-essay-sans text-essay-ink">
          Thank you for your message. I will get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="border border-essay-ink/20 p-4 font-essay-sans text-red-700">
          There was an error submitting your message. Please try again.
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="essay-btn-primary inline-flex min-h-[48px] w-full max-w-xs items-center justify-center bg-essay-accent px-6 font-essay-sans text-sm font-medium text-white transition-opacity duration-essay-fast ease-essay hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
        </button>
        <p className="text-center font-essay-sans text-xs text-essay-muted">
          I will only use your email to reply. No lists, no follow-up.
        </p>
      </div>
    </form>
  )
}
