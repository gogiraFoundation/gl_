'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface Comment {
  id: number
  name: string
  content: string
  created_at: string
  approved?: boolean
  post?: number
  email?: string
}

function getList(data: unknown): Comment[] {
  if (!data) return []
  if (Array.isArray(data)) return data as Comment[]
  return ((data as { results?: Comment[] }).results || []) as Comment[]
}

export default function AdminCommentsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [approvedFilter, setApprovedFilter] = useState('false')

  useEffect(() => {
    const token = sessionStorage.getItem('access_token') ?? localStorage.getItem('access_token')
    if (!token) router.push('/admin/login')
  }, [router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'comments', approvedFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (approvedFilter) params.set('approved', approvedFilter)
      const response = await api.get(`/blog/comments/?${params.toString()}`)
      return response.data
    },
  })

  useEffect(() => {
    if ((error as { response?: { status?: number } })?.response?.status === 401) {
      router.push('/admin/login')
    }
  }, [error, router])

  const approve = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      await api.patch(`/blog/comments/${id}/`, { approved })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] })
    },
  })

  const comments = getList(data)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Comment moderation</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <select
          value={approvedFilter}
          onChange={(e) => setApprovedFilter(e.target.value)}
          className="mb-6 rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
        >
          <option value="">All</option>
          <option value="false">Pending</option>
          <option value="true">Approved</option>
        </select>

        {isLoading ? (
          <p>Loading…</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{comment.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      approve.mutate({
                        id: comment.id,
                        approved: !(comment.approved ?? false),
                      })
                    }
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    {comment.approved ? 'Unapprove' : 'Approve'}
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
