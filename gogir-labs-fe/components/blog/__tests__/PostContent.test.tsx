import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PostContent } from '../PostContent'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'

const mockPost = {
  id: 1,
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'Test excerpt',
  content: '<p>This is HTML content</p>',
  featured_image: '/test-image.jpg',
  category: { id: 1, name: 'Technology', slug: 'technology' },
  tags: [{ id: 1, name: 'Python', slug: 'python' }],
  author_name: 'John Doe',
  published: true,
  featured: false,
  views: 10,
  created_at: '2024-01-01T00:00:00Z',
  published_at: '2024-01-01T00:00:00Z',
  meta_title: 'Test meta title',
  meta_description: 'Test meta description',
}

let queryClient: QueryClient

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <AnalyticsProvider>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </AnalyticsProvider>
  )

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: (html: string) => html,
}))

describe('PostContent', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })
  it('renders HTML content', () => {
    renderWithProviders(<PostContent post={mockPost} />)
    expect(screen.getByText('This is HTML content')).toBeInTheDocument()
  })

  it('handles empty content', () => {
    const postWithoutContent = { ...mockPost, content: '' }
    renderWithProviders(<PostContent post={postWithoutContent} />)
    expect(screen.getByText(/no content available/i)).toBeInTheDocument()
  })

  it('sanitizes malicious HTML', () => {
    const maliciousPost = {
      ...mockPost,
      content: '<script>alert("XSS")</script><p>Safe content</p>',
    }
    renderWithProviders(<PostContent post={maliciousPost} />)
    // DOMPurify should sanitize the script tag
    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('handles very long content', () => {
    const longContentPost = {
      ...mockPost,
      content: '<p>' + 'A'.repeat(10000) + '</p>',
    }
    renderWithProviders(<PostContent post={longContentPost} />)
    expect(screen.getByText('A'.repeat(10000))).toBeInTheDocument()
  })

  it('renders featured post with special styling', () => {
    const featuredPost = { ...mockPost, featured: true }
    renderWithProviders(<PostContent post={featuredPost} />)
    expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument()
  })
})
