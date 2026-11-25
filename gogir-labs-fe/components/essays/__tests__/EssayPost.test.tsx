import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EssayPost } from '../EssayPost'

jest.mock('dompurify', () => ({
  sanitize: (html: string) => html,
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(async (url: string) => {
      if (url.includes('portfolio/projects/by-slug')) {
        const err = new Error('Not found') as Error & { response?: { status: number } }
        err.response = { status: 404 }
        throw err
      }
      return {
        data: {
          results: [
            { slug: 'tr-bot', title: 'tr_bot' },
            { slug: 'traqhq', title: 'TraqHq' },
            { slug: 'uk-re-market-intel', title: 'UK RE' },
          ],
        },
      }
    }),
  },
}))

describe('EssayPost', () => {
  it('renders byline, title, and next essay link for tr-bot after sanitize', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <EssayPost
          post={{
            title: 'tr_bot',
            slug: 'tr-bot',
            content: '<h2>The problem</h2><p>Body text here.</p><script>evil()</script>',
            author_name: 'Emmanuel',
            created_at: '2024-01-01T00:00:00Z',
            published_at: '2024-01-01T00:00:00Z',
          }}
        />
      </QueryClientProvider>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'tr_bot' })).toBeInTheDocument()
    expect(screen.getByText(/Emmanuel Ugbaje/i)).toBeInTheDocument()
    expect(screen.getByText(/SIMULATED/i)).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: /Reading progress/i })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /The problem/i })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Next essay/i })).toHaveAttribute(
        'href',
        '/blog/traqhq'
      )
    })

    await waitFor(() => {
      const github = screen.getAllByRole('link', { name: /View on GitHub/i })
      expect(github[0]).toHaveAttribute('href', 'https://github.com/gogiraFoundation/trader-joes')
    })
  })
})
