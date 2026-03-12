'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GradientText } from '@/components/ui/GradientText'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function NewsletterVerifyPage() {
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
    } catch (error: any) {
      console.error('Error verifying email:', error)
      setStatus('error')
      if (error.response?.data?.error) {
        setMessage(error.response.data.error)
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message)
      } else {
        setMessage('Failed to verify email. The verification link may be invalid or expired.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 px-4 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <GradientText>Email Verification</GradientText>
            </h1>
          </div>

          <div className="glass rounded-2xl p-8 scroll-fade-in text-center">
            {status === 'loading' && (
              <div>
                <div className="inline-block p-4 rounded-full bg-purple-500/20 mb-6">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Verifying your email...</h2>
                <p className="text-gray-300">Please wait while we verify your subscription.</p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div className="inline-block p-4 rounded-full bg-green-500/20 mb-6">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Email Verified!</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <p className="text-sm text-gray-400 mb-6">
                  You're all set! You'll start receiving our newsletter updates.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple"
                >
                  Go to Homepage
                </button>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div className="inline-block p-4 rounded-full bg-red-500/20 mb-6">
                  <XCircle className="w-12 h-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Verification Failed</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/newsletter/subscribe')}
                    className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple"
                  >
                    Subscribe Again
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="block w-full px-6 py-3 border-2 border-purple-500 text-purple-400 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300"
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

