export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return ''

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}

export function calculateReadingTime(content: string | null | undefined): number {
  if (!content) return 0
  const words = content.trim().split(/\s+/).length
  const wordsPerMinute = 200
  return Math.max(1, Math.round(words / wordsPerMinute))
}
