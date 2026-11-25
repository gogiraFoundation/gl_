/**
 * Server-only fetch helpers for generateMetadata and RSC.
 * Prefer this over the Axios browser client (sessionStorage / window).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function fetchPublicJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = path.startsWith('http') ? path : `${API_BASE.replace(/\/$/, '')}${path}`
  try {
    const res = await fetch(url, {
      ...init,
      next: { revalidate: 60 },
      headers: {
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}
