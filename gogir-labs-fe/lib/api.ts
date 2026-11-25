import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getApiBaseUrl } from '@/lib/apiBase'

const baseURL = getApiBaseUrl()

const api = axios.create({
  baseURL,
  withCredentials: true,
  // Fail instead of leaving React Query in isLoading forever.
  timeout: 12000,
})

type RequestConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshPromise: Promise<string | null> | null = null

function getTokenStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function getStoredRefreshToken(): string | null {
  const storage = getTokenStorage()
  return storage?.getItem('refresh_token') ?? localStorage.getItem('refresh_token')
}

function persistTokens(access: string, refresh?: string) {
  const storage = getTokenStorage()
  try {
    storage?.setItem('access_token', access)
    if (refresh) {
      storage?.setItem('refresh_token', refresh)
    }
  } catch {
    /* ignore (private mode / storage blocked) */
  }
}

function clearStoredTokens() {
  const storage = getTokenStorage()
  try {
    storage?.removeItem('access_token')
    storage?.removeItem('refresh_token')
    // Backward compatibility for users with older persisted tokens.
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  } catch {
    /* ignore (private mode / storage blocked) */
  }
}

function stripAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const headers = config.headers
  if (!headers) return
  if (typeof headers.delete === 'function') {
    headers.delete('Authorization')
    headers.delete('authorization')
  } else {
    const h = headers as Record<string, unknown>
    delete h.Authorization
    delete h.authorization
  }
}

function isAuthTokenUrl(url: string | undefined): boolean {
  if (!url) return false
  return (
    url.includes('/auth/token/') ||
    url.includes('/auth/token/refresh/') ||
    url.includes('/auth/token/blacklist/')
  )
}

/**
 * Rotate the access token (and refresh when the API returns a new one).
 * Uses a bare axios call so the api interceptor cannot recurse.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refresh = getStoredRefreshToken()
    if (!refresh) return null

    try {
      const { data } = await axios.post<{ access: string; refresh?: string }>(
        `${baseURL}/auth/token/refresh/`,
        { refresh },
        { withCredentials: true }
      )
      if (!data?.access) {
        clearStoredTokens()
        return null
      }
      persistTokens(data.access, data.refresh)
      return data.access
    } catch {
      clearStoredTokens()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// Attach JWT from sessionStorage for protected admin endpoints.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storage = getTokenStorage()
    const token = storage?.getItem('access_token') ?? localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
  }
  return config
})

// On 401: refresh once (rotating refresh tokens), then retry. If refresh fails,
// strip Authorization and retry so public routes still work with a stale token.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfigWithRetry | undefined
    const status = error.response?.status

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      typeof window === 'undefined' ||
      isAuthTokenUrl(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    const authHeader =
      originalRequest.headers?.get?.('Authorization') ??
      (originalRequest.headers as Record<string, string> | undefined)?.Authorization ??
      (originalRequest.headers as Record<string, string> | undefined)?.authorization

    if (!authHeader) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const access = await refreshAccessToken()
    if (access) {
      originalRequest.headers = originalRequest.headers ?? {}
      ;(originalRequest.headers as Record<string, string>).Authorization = `Bearer ${access}`
      return api.request(originalRequest)
    }

    stripAuthorizationHeader(originalRequest)
    return api.request(originalRequest)
  }
)

export default api
