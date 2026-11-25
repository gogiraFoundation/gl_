'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface Preference {
  id: number
  notification_type: string
  email_enabled: boolean
  in_app_enabled: boolean
}

function getList(data: unknown): Preference[] {
  if (!data) return []
  if (Array.isArray(data)) return data as Preference[]
  return ((data as { results?: Preference[] }).results || []) as Preference[]
}

export default function AdminPreferencesPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = sessionStorage.getItem('access_token') ?? localStorage.getItem('access_token')
    if (!token) router.push('/admin/login')
  }, [router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const response = await api.get('/notifications/preferences/')
      return response.data
    },
  })

  useEffect(() => {
    if ((error as { response?: { status?: number } })?.response?.status === 401) {
      router.push('/admin/login')
    }
  }, [error, router])

  const updatePref = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: number
      patch: Partial<Pick<Preference, 'email_enabled' | 'in_app_enabled'>>
    }) => {
      await api.patch(`/notifications/preferences/${id}/`, patch)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] })
    },
  })

  const preferences = getList(data)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Notification preferences</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {isLoading ? (
          <p>Loading…</p>
        ) : preferences.length === 0 ? (
          <p className="text-gray-500">
            No preferences yet. They are created when notifications fire.
          </p>
        ) : (
          <ul className="space-y-4">
            {preferences.map((pref) => (
              <li
                key={pref.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800"
              >
                <span className="font-medium">{pref.notification_type}</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={pref.email_enabled}
                      onChange={(e) =>
                        updatePref.mutate({
                          id: pref.id,
                          patch: { email_enabled: e.target.checked },
                        })
                      }
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={pref.in_app_enabled}
                      onChange={(e) =>
                        updatePref.mutate({
                          id: pref.id,
                          patch: { in_app_enabled: e.target.checked },
                        })
                      }
                    />
                    In-app
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
