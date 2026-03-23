'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GradientText } from '@/components/ui/GradientText'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function NewsletterVerifyClient() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await api.get(`/newsletter/verify/${verificationToken}/`)
      setStatus('success')
      setMessage(response.data.message || 'Email verified successfully!')
    } catch (error: unknown) {
      setStatus('error')
      const err = error as { response?: { data?: { error?: string; message?: string } } }
      if (err.response?.data?.error) {
        setMessage(err.response.data.error)
      } else if (err.response?.data?.message) {
        setMessage(err.response.data.message)
      } else {
        setMessage('Failed to verify email. The verification link may be invalid or expired.')
      }
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
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              <GradientText>Email Verification</GradientText>
            </h1>
          </div>

          <div className="glass scroll-fade-in rounded-2xl p-8 text-center">
            {status === 'loading' && (
              <div>
                <div className="mb-6 inline-block rounded-full bg-purple-500/20 p-4">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Verifying your email...</h2>
                <p className="text-gray-300">Please wait while we verify your subscription.</p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div className="mb-6 inline-block rounded-full bg-green-500/20 p-4">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Email Verified!</h2>
                <p className="mb-6 text-gray-300">{message}</p>
                <p className="mb-6 text-sm text-gray-400">
                  You're all set! You'll start receiving our newsletter updates.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
                >
                  Go to Homepage
                </button>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div className="mb-6 inline-block rounded-full bg-red-500/20 p-4">
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Verification Failed</h2>
                <p className="mb-6 text-gray-300">{message}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/newsletter/subscribe')}
                    className="rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
                  >
                    Subscribe Again
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="block w-full rounded-lg border-2 border-purple-500 px-6 py-3 font-semibold text-purple-400 transition-all duration-300 hover:bg-purple-500/10"
                  >
                    Go to Homepage
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
