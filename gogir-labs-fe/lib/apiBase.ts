/** API base used by the browser client and by server-side fetches. */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  return raw.replace(/\/$/, '')
}

/** Origin of the API host, for routes that live outside `/api/v1` (feeds). */
export function getApiOrigin(): string {
  try {
    return new URL(getApiBaseUrl()).origin
  } catch {
    return 'http://localhost:8000'
  }
}
