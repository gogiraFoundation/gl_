'use client'

import { useState, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Mail, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import type { AxiosError } from 'axios'

const fieldClass =
  'contact-input w-full min-h-[48px] border border-[orangered] bg-brutal-bg px-4 py-3 text-brutal-ink placeholder:text-brutal-muted focus:outline-none focus:ring-1 focus:ring-[orangered]/40'
const primaryBtn = 'btn-brutal btn-brutal-md w-full'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [successMode, setSuccessMode] = useState<'token' | 'email-link'>('token')

  const handleUnsubscribe = useCallback(
    async (unsubscribeToken?: string, emailAddress?: string) => {
      setIsSubmitting(true)
      setStatus('idle')
      setMessage('')

      const resolvedToken = (unsubscribeToken || token || '').trim()
      const resolvedEmail = (emailAddress || email || '').trim()
      const payload: { token?: string; email?: string } = {}
      if (resolvedToken) payload.token = resolvedToken
      if (resolvedEmail) payload.email = resolvedEmail

      try {
        const response = await api.post('/newsletter/unsubscribe/', payload)

        setSuccessMode(resolvedToken ? 'token' : 'email-link')
        setStatus('success')
        setMessage(
          response.data.message ||
            (resolvedToken
              ? 'You have been unsubscribed from the newsletter.'
              : 'If a matching subscription exists, an unsubscribe link has been sent.')
        )
      } catch (error: unknown) {
        setStatus('error')

        const axiosError = error as AxiosError<{
          error?: string
          detail?: string | string[]
          email?: string[]
          non_field_errors?: string[]
        }>
        const data = axiosError.response?.data
        const backendError =
          data?.error ||
          (typeof data?.detail === 'string' ? data.detail : undefined) ||
          data?.email?.[0] ||
          data?.non_field_errors?.[0]
        setMessage(backendError || 'Could not unsubscribe. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [token, email]
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token) {
      handleUnsubscribe(token)
      return
    }
    if (email) {
      handleUnsubscribe(undefined, email)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-16 md:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10 text-left">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
              <Mail className="h-7 w-7 text-brutal-ink" aria-hidden />
            </div>
            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Unsubscribe
            </h1>
            <p className="max-w-xl text-left text-base leading-relaxed text-brutal-muted md:text-lg">
              Use the link from your email, or enter your address to receive a one-click unsubscribe
              link.
            </p>
          </header>

          <div className="border border-brutal-ink bg-brutal-bg p-6 md:p-8">
            {status === 'success' ? (
              <div className="text-left">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
                  <CheckCircle className="h-7 w-7 text-brutal-ink" aria-hidden />
                </div>
                <h2 className="mb-4 font-serif text-2xl font-semibold">
                  {successMode === 'token' ? 'Request received' : 'Check your email'}
                </h2>
                <p className="mb-4 text-base leading-relaxed text-brutal-muted">{message}</p>
                <p className="text-sm text-brutal-muted">
                  {successMode === 'token'
                    ? 'If this address was subscribed, newsletter mail will stop. You can subscribe again any time from the newsletter page.'
                    : 'Open the link in that email to finish unsubscribing.'}
                </p>
              </div>
            ) : status === 'error' ? (
              <div className="text-left">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
                  <XCircle className="h-7 w-7 text-brutal-ink" aria-hidden />
                </div>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Unsubscribe failed</h2>
                <p className="mb-6 text-base leading-relaxed text-brutal-muted">{message}</p>
                <form onSubmit={onSubmit} className="space-y-4">
                  {!token && (
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-left text-sm font-medium text-brutal-ink"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldClass}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || (!token && !email)}
                    className={primaryBtn}
                  >
                    {isSubmitting
                      ? token
                        ? 'Unsubscribing…'
                        : 'Sending link…'
                      : token
                        ? 'Confirm unsubscribe'
                        : 'Email me an unsubscribe link'}
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6 text-left">
                {!token && (
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-brutal-ink"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={fieldClass}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                )}

                {token && (
                  <p className="text-base leading-relaxed text-brutal-muted">
                    Confirm below to leave the newsletter. This step keeps link scanners from
                    unsubscribing you automatically.
                  </p>
                )}

                <p className="text-sm text-brutal-muted">
                  {token
                    ? 'Your subscription stays active until you confirm.'
                    : 'We email a confirmation link if this address is subscribed. Your subscription stays active until you open that link.'}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || (!token && !email)}
                  className={primaryBtn}
                >
                  {isSubmitting
                    ? token
                      ? 'Unsubscribing…'
                      : 'Sending link…'
                    : token
                      ? 'Confirm unsubscribe'
                      : 'Email me an unsubscribe link'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
          <Header />
          <main className="flex-grow px-6 py-16 lg:px-8">
            <p className="text-left text-brutal-muted">Loading…</p>
          </main>
          <Footer />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  )
}
