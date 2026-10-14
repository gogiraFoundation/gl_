'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface ContactListItem {
  id: number
  name: string
  email: string
  subject: string
  read: boolean
  replied: boolean
  created_at: string
}

interface ContactDetail extends ContactListItem {
  message: string
  reply_body: string | null
  replied_at: string | null
}

interface ContactListResponse {
  results?: ContactListItem[]
  count?: number
}

function getList(data: ContactListResponse | ContactListItem[] | undefined): ContactListItem[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  return data.results || []
}

export default function AdminContactPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [readFilter, setReadFilter] = useState<string>('')
  const [repliedFilter, setRepliedFilter] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('access_token') ?? localStorage.getItem('access_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  const { data: listData, isLoading, error: listError } = useQuery({
    queryKey: ['contact', 'messages', readFilter, repliedFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page_size', '100')
      if (readFilter) params.set('read', readFilter)
      if (repliedFilter) params.set('replied', repliedFilter)
      const response = await api.get(`/contact/messages/?${params.toString()}`)
      return response.data as ContactListResponse | ContactListItem[]
    },
    retry: false,
  })

  useEffect(() => {
    if ((listError as { response?: { status?: number } } | null)?.response?.status === 401) {
      router.push('/admin/login')
    }
  }, [listError, router])

  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['contact', 'message', selectedId],
    queryFn: async () => {
      const response = await api.get(`/contact/messages/${selectedId}/`)
      return response.data as ContactDetail
    },
    enabled: selectedId !== null,
  })

  const patchMessage = useMutation({
    mutationFn: async ({ id, patch }: { id: number; patch: { read?: boolean } }) => {
      await api.patch(`/contact/messages/${id}/`, patch)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] })
    },
  })

  const sendReply = useMutation({
    mutationFn: async ({ id, message }: { id: number; message: string }) => {
      const response = await api.post(`/contact/messages/${id}/reply/`, { message })
      return response.data
    },
    onSuccess: () => {
      setReplyText('')
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['contact'] })
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number; data?: { detail?: string } } })
        ?.response?.status
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data
        ?.detail
      if (status === 409) {
        setError(detail || 'This message has already been replied to.')
        queryClient.invalidateQueries({ queryKey: ['contact'] })
        return
      }
      setError(detail || 'Failed to send reply. The message was left unreplied.')
    },
  })

  const messages = getList(listData)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Contact Inbox</h1>
          <Link href="/admin" className="text-blue-600 hover:underline dark:text-blue-400">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex flex-wrap gap-3">
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            >
              <option value="">All read states</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
            <select
              value={repliedFilter}
              onChange={(e) => setRepliedFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
            >
              <option value="">All reply states</option>
              <option value="false">Unreplied</option>
              <option value="true">Replied</option>
            </select>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading…</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500">No messages.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(msg.id)
                      setError(null)
                      if (!msg.read) {
                        patchMessage.mutate({ id: msg.id, patch: { read: true } })
                      }
                    }}
                    className={`w-full px-2 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedId === msg.id ? 'bg-blue-50 dark:bg-blue-950' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-medium ${msg.read ? '' : 'font-bold'}`}>{msg.subject}</span>
                      <span className="text-xs text-gray-500">
                        {msg.replied ? 'Replied' : msg.read ? 'Read' : 'New'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {msg.name} &lt;{msg.email}&gt;
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          {!selectedId ? (
            <p className="text-gray-500">Select a message to read and reply.</p>
          ) : loadingDetail ? (
            <p className="text-gray-500">Loading message…</p>
          ) : detail ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{detail.subject}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  From {detail.name} &lt;{detail.email}&gt;
                </p>
                <p className="mt-4 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{detail.message}</p>
              </div>

              {detail.reply_body && (
                <div className="rounded border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                  <p className="mb-1 text-sm font-medium text-green-800 dark:text-green-300">Your reply</p>
                  <p className="whitespace-pre-wrap text-sm">{detail.reply_body}</p>
                </div>
              )}

              {!detail.replied ? (
                <div>
                  <label htmlFor="reply" className="mb-2 block text-sm font-medium">
                    Reply
                  </label>
                  <textarea
                    id="reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
                    placeholder="Write a reply…"
                  />
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  <button
                    type="button"
                    disabled={!replyText.trim() || sendReply.isPending}
                    onClick={() => sendReply.mutate({ id: detail.id, message: replyText.trim() })}
                    className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {sendReply.isPending ? 'Sending…' : 'Send reply'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}
