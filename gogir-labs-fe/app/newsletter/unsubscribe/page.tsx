'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GradientText } from '@/components/ui/GradientText'
import { Mail, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // If token is provided, auto-unsubscribe
    if (token) {
      handleUnsubscribe(token)
    }
  }, [token])

  const handleUnsubscribe = async (unsubscribeToken?: string, emailAddress?: string) => {
    setIsSubmitting(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await api.post('/newsletter/unsubscribe/', {
        token: unsubscribeToken || token,
        email: emailAddress || email,
      })

      setStatus('success')
      setMessage(response.data.message || 'Successfully unsubscribed from newsletter.')
    } catch (error: any) {
      console.error('Error unsubscribing:', error)
      setStatus('error')
      if (error.response?.data?.error) {
        setMessage(error.response.data.error)
      } else {
        setMessage('Failed to unsubscribe. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      handleUnsubscribe(undefined, email)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-12 animate-fade-in-up text-center">
            <div className="bg-gradient-primary/20 mb-6 inline-block rounded-full p-4">
              <Mail className="h-12 w-12 text-purple-400" />
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              <GradientText>Unsubscribe</GradientText>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              We're sorry to see you go. You can unsubscribe from our newsletter below.
            </p>
          </div>

          <div className="glass scroll-fade-in rounded-2xl p-8">
            {status === 'success' ? (
              <div className="text-center">
                <div className="mb-6 inline-block rounded-full bg-green-500/20 p-4">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Unsubscribed Successfully</h2>
                <p className="mb-6 text-gray-300">{message}</p>
                <p className="text-sm text-gray-400">
                  You can resubscribe at any time by visiting our website.
                </p>
              </div>
            ) : status === 'error' ? (
              <div className="text-center">
                <div className="mb-6 inline-block rounded-full bg-red-500/20 p-4">
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Unsubscribe Failed</h2>
                <p className="mb-6 text-gray-300">{message}</p>
                <form onSubmit={onSubmit} className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass w-full rounded-lg px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                {!token && (
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass w-full rounded-lg px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                )}

                {token && (
                  <div className="text-center">
                    <p className="mb-4 text-gray-300">Processing your unsubscribe request...</p>
                  </div>
                )}

                {!token && (
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
                  </button>
                )}
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
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="relative flex-grow px-4 py-20">
            <div className="text-center">
              <p className="text-gray-300">Loading...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  )
}
