'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { AxiosError } from 'axios'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await api.post('/auth/token/', data)
      const { access, refresh } = response.data
      sessionStorage.setItem('access_token', access)
      sessionStorage.setItem('refresh_token', refresh)
      router.push('/admin')
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ detail?: string }>
      setError(axiosError.response?.data?.detail || 'Invalid credentials')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-secondary)] px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-700/30 bg-[var(--bg-primary)] p-8 shadow-lg">
        <h1
          className="mb-6 text-center text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Admin Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="username"
                className="min-w-[100px] whitespace-nowrap text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register('username')}
                className="flex-1 rounded-lg border border-gray-600 px-4 py-2 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            {errors.username && (
              <p className="ml-[116px] text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="password"
                className="min-w-[100px] whitespace-nowrap text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="flex-1 rounded-lg border border-gray-600 px-4 py-2 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            {errors.password && (
              <p className="ml-[116px] text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
