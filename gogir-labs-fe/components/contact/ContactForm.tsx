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
  'contact-input w-full min-h-[48px] border border-[orangered] bg-brutal-bg px-4 py-3 text-brutal-ink transition-[opacity,box-shadow] duration-200 hover:shadow-[0_8px_20px_rgba(107,114,128,0.25),0_4px_10px_rgba(0,0,0,0.25)]',
  'placeholder:text-brutal-muted',
  'focus:border-[orangered] focus:outline-none'
)

const labelClass = 'mb-1.5 block text-sm font-semibold text-brutal-ink'

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
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className={fieldClass}
          placeholder="What’s this regarding?"
          autoComplete="off"
        />
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
          placeholder="Tell me about your project, requirements, or opportunity…"
          autoComplete="off"
        />
        {errors.message && <p className="text-sm text-red-700">{errors.message.message}</p>}
      </div>

      {submitStatus === 'success' && (
        <div className="border border-brutal-ink/20 p-4 text-brutal-ink">
          Thank you for your message! We will get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="border border-brutal-ink/20 p-4 text-red-700">
          There was an error submitting your message. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mx-auto mt-[10px] flex min-h-[38px] w-[72%] items-center justify-center border border-brutal-ink bg-transparent px-3 py-2 text-[11px] font-bold text-brutal-ink shadow-[0_10px_24px_rgba(255,69,0,0.24),0_4px_12px_rgba(112,128,144,0.34),0_1px_0_rgba(255,255,255,0.35)_inset] transition-[color,box-shadow,border-color] hover:cursor-default hover:text-[orangered] hover:shadow-[0_12px_28px_rgba(255,69,0,0.3),0_6px_16px_rgba(112,128,144,0.4),0_1px_0_rgba(255,255,255,0.4)_inset] active:border-[lightgreen] disabled:cursor-not-allowed disabled:opacity-50 sm:w-[34%]"
      >
        {isSubmitting ? 'Sending...' : 'Discuss Your Project'}
      </button>
    </form>
  )
}
