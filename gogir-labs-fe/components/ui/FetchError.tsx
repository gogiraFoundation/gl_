'use client'

import axios from 'axios'

export function describeQueryError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The request timed out. Check your connection and try again.'
    }
    if (!error.response) {
      return 'The page could not reach the API. Try again in a moment.'
    }
    if (error.response.status >= 500) {
      return 'The API had a problem responding. Try again in a moment.'
    }
  }
  if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return 'The request timed out. Try again in a moment.'
  }
  return 'Something went wrong while loading this page.'
}

interface FetchErrorProps {
  title: string
  message?: string
  onRetry?: () => void
}

export function FetchError({ title, message, onRetry }: FetchErrorProps) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-xl rounded-sm border border-[orangered]/40 bg-[rgba(255,69,0,0.08)] px-6 py-8 text-center"
    >
      <p className="mb-2 font-semibold text-brutal-ink">{title}</p>
      {message ? <p className="mb-4 text-sm text-brutal-muted">{message}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="border border-brutal-ink bg-brutal-bg px-4 py-2 text-sm font-semibold text-brutal-ink transition-opacity hover:opacity-70"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
