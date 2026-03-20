import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

// Attach JWT from localStorage for protected admin endpoints (Django + DRF SimpleJWT).
// Runs only in the browser.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
