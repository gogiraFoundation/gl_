'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import api from '@/lib/api'

const primaryBtn = 'btn-brutal btn-brutal-md'
const secondaryBtn = 'btn-brutal btn-brutal-md w-full'

interface NewsletterVerifyClientProps {
  token: string
}

export default function NewsletterVerifyClient({ token }: NewsletterVerifyClientProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const verifyEmail = async () => {
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token.')
      return
    }
    setStatus('loading')
    try {
      const response = await api.post(`/newsletter/verify/${token}/`)
      setStatus('success')
      setMessage(response.data.message || 'Email verified successfully.')
    } catch (error: unknown) {
      setStatus('error')
      const err = error as { response?: { data?: { error?: string; message?: string } } }
      if (err.response?.data?.error) {
        setMessage(err.response.data.error)
      } else if (err.response?.data?.message) {
        setMessage(err.response.data.message)
      } else {
        setMessage('Verification failed. The link may be invalid or expired.')
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-16 md:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10 text-left">
            <h1 className="mb-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Email verification
            </h1>
            <p className="text-left text-base text-brutal-muted">
              Confirm your newsletter subscription.
            </p>
          </header>

          <div className="border border-brutal-ink bg-brutal-bg p-6 text-left md:p-8">
            {status === 'idle' && (
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
                  <Mail className="h-7 w-7 text-brutal-ink" aria-hidden />
                </div>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Confirm your email</h2>
                <p className="mb-6 text-base leading-relaxed text-brutal-muted">
                  Click below to verify ownership of this mailbox. Your subscription stays inactive
                  until you confirm.
                </p>
                <button type="button" onClick={verifyEmail} className={primaryBtn}>
                  Verify email address
                </button>
              </div>
            )}

            {status === 'loading' && (
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
                  <Loader2 className="h-7 w-7 animate-spin text-brutal-ink" aria-hidden />
                </div>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Verifying…</h2>
                <p className="text-base text-brutal-muted">Please wait a moment.</p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
                  <CheckCircle className="h-7 w-7 text-brutal-ink" aria-hidden />
                </div>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Email verified</h2>
                <p className="mb-6 text-base leading-relaxed text-brutal-muted">{message}</p>
                <button type="button" onClick={() => router.push('/')} className={primaryBtn}>
                  Back to home
                </button>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
                  <XCircle className="h-7 w-7 text-brutal-ink" aria-hidden />
                </div>
                <h2 className="mb-4 font-serif text-2xl font-semibold">Verification failed</h2>
                <p className="mb-6 text-base leading-relaxed text-brutal-muted">{message}</p>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle')
                      setMessage('')
                    }}
                    className={primaryBtn}
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/newsletter/subscribe')}
                    className={secondaryBtn}
                  >
                    Subscribe again
                  </button>
                  <button type="button" onClick={() => router.push('/')} className={secondaryBtn}>
                    Back to home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
