import { getApiBaseUrl } from '@/lib/apiBase'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const DEFAULT_TIMEOUT_MS = 8000

/** Server-side fetch. Does not depend on browser CORS. */
export async function fetchApi<T>(path: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const base = getApiBaseUrl()
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  })
  if (!response.ok) {
    throw new ApiError(response.status, `API responded with ${response.status}`)
  }
  return (await response.json()) as T
}

export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && Array.isArray((data as { results?: unknown }).results)) {
    return (data as { results: T[] }).results
  }
  return []
}

/**
 * Server-only fetch for generateMetadata. Returns null on failure instead of throwing.
 */
export async function fetchPublicJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  const base = getApiBaseUrl()
  const url = path.startsWith('http') ? path : `${base.replace(/\/$/, '')}${path}`
  try {
    const res = await fetch(url, {
      ...init,
      next: { revalidate: 60, ...(init && 'next' in init ? (init.next as object) : {}) },
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
