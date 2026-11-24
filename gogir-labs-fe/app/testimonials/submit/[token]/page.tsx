'use client'

import { FormEvent, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import api from '@/lib/api'

export default function TestimonialSubmitPage() {
  const params = useParams()
  const token = params.token as string
  const [clientName, setClientName] = useState('')
  const [clientRole, setClientRole] = useState('')
  const [company, setCompany] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')
    try {
      const response = await api.post(`/testimonials/submit/${token}/`, {
        client_name: clientName,
        client_role: clientRole,
        company,
        content,
        rating,
      })
      setStatus('done')
      setMessage(response.data.message || 'Thank you for your testimonial.')
    } catch (err: unknown) {
      setStatus('error')
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'This link is no longer valid.'
      setMessage(detail)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-xl flex-grow px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold">Share a testimonial</h1>
        {status === 'done' ? (
          <p className="text-green-700 dark:text-green-400">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="role">
                Role
              </label>
              <input
                id="role"
                required
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="company">
                Company
              </label>
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="rating">
                Rating
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="content">
                Testimonial
              </label>
              <textarea
                id="content"
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            {status === 'error' && <p className="text-sm text-red-600">{message}</p>}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
