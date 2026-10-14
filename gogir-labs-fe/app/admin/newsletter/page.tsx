'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface NewsletterStats {
  total_subscribers: number
  active_subscribers: number
  verified_subscribers: number
  unverified_subscribers: number
  inactive_subscribers: number
}

interface Subscriber {
  id: number
  email: string
  name: string | null
  is_active: boolean
  is_verified: boolean
  subscribed_at: string
}

function getList(data: unknown): Subscriber[] {
  if (!data) return []
  if (Array.isArray(data)) return data as Subscriber[]
  return ((data as { results?: Subscriber[] }).results || []) as Subscriber[]
}

export default function AdminNewsletterPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('access_token') ?? localStorage.getItem('access_token')
    if (!token) router.push('/admin/login')
  }, [router])

  const { data: stats, error: statsError } = useQuery({
    queryKey: ['newsletter', 'stats'],
    queryFn: async () => {
      const response = await api.get('/newsletter/stats/')
      return response.data as NewsletterStats
    },
    retry: false,
  })

  const { data: subscribersData, isLoading, error: subscribersError } = useQuery({
    queryKey: ['newsletter', 'subscribers', search],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page_size', '100')
      if (search) params.set('search', search)
      const response = await api.get(`/newsletter/subscribers/?${params.toString()}`)
      return response.data
    },
    retry: false,
  })

  useEffect(() => {
    const status =
      (statsError as { response?: { status?: number } } | null)?.response?.status ??
      (subscribersError as { response?: { status?: number } } | null)?.response?.status
    if (status === 401) {
      router.push('/admin/login')
    }
  }, [statsError, subscribersError, router])

  const sendTest = useMutation({
    mutationFn: async () => {
      const response = await api.post('/newsletter/send/', {
        subject,
        message,
        test_email: testEmail,
      })
      return response.data
    },
    onSuccess: (data) => {
      setFeedback(data.message || 'Test email sent.')
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response?.data
          ?.message ||
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to send test email.'
      setFeedback(String(msg))
    },
  })

  const subscribers = getList(subscribersData)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!testEmail.trim() || !subject.trim() || !message.trim()) return
    sendTest.mutate()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Newsletter</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {stats && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {(
              [
                ['Total', stats.total_subscribers],
                ['Active', stats.active_subscribers],
                ['Verified', stats.verified_subscribers],
                ['Unverified', stats.unverified_subscribers],
                ['Inactive', stats.inactive_subscribers],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        <section className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold">Send test email</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            />
            <input
              required
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            />
            <textarea
              required
              rows={5}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            />
            <button
              type="submit"
              disabled={sendTest.isPending}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {sendTest.isPending ? 'Sending…' : 'Send test'}
            </button>
            {feedback && <p className="text-sm text-gray-600 dark:text-gray-300">{feedback}</p>}
          </form>
        </section>

        <section className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Subscribers</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email"
              className="rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            />
          </div>
          {isLoading ? (
            <p>Loading…</p>
          ) : subscribers.length === 0 ? (
            <p className="text-gray-500">No subscribers.</p>
          ) : (
            <ul className="divide-y dark:divide-gray-700">
              {subscribers.map((sub) => (
                <li key={sub.id} className="flex justify-between py-3 text-sm">
                  <span>
                    {sub.email}
                    {sub.name ? ` (${sub.name})` : ''}
                  </span>
                  <span className="text-gray-500">
                    {sub.is_verified ? 'Verified' : 'Unverified'} ·{' '}
                    {sub.is_active ? 'Active' : 'Inactive'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
