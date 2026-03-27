import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

type RequestConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean }

function getTokenStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch {
    return null
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

// Attach JWT from localStorage for protected admin endpoints (Django + DRF SimpleJWT).
// Runs only in the browser.
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

// If a stale/invalid JWT is stored, DRF SimpleJWT returns 401 *before* AllowAny is applied.
// Retry once without Authorization so public routes (portfolio, blog, etc.) still work.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfigWithRetry | undefined
    const status = error.response?.status

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      typeof window === 'undefined'
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
    clearStoredTokens()
    stripAuthorizationHeader(originalRequest)
    return api.request(originalRequest)
  }
)

export default api
