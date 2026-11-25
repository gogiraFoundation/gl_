import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectCard } from '../ProjectCard'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'

const mockProject = {
  id: 1,
  title: 'Afri Cleans Website',
  slug: 'afri-cleans-website',
  description: 'API description fallback',
  featured_image: null as string | null,
  github_url: '',
  live_url: '',
  category: { id: 1, name: 'Website', slug: 'website' },
  technologies: [] as Array<{ id: number; name: string; slug: string; icon: string }>,
  featured: false,
  created_at: '2024-01-01T00:00:00Z',
}

let queryClient: QueryClient

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <AnalyticsProvider>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </AnalyticsProvider>
  )

describe('ProjectCard', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  it('renders a list row linking to the project', () => {
    const { container } = renderWithProviders(<ProjectCard project={mockProject} />)

    expect(screen.getByRole('heading', { name: 'Afri Cleans Website' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Afri Cleans Website/ })).toHaveAttribute(
      'href',
      '/portfolio/afri-cleans-website'
    )
    expect(screen.getByRole('link', { name: 'Read the essay' })).toHaveAttribute(
      'href',
      '/blog/afri'
    )
    expect(screen.getByText('API description fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('project-card-placeholder')).not.toBeInTheDocument()
    expect(screen.queryByAltText(/preview/i)).not.toBeInTheDocument()
    expect(container.querySelector('article')).not.toHaveClass('hover:-translate-y-0.5')
  })

  it('prefers the API category name over editorial labels', () => {
    renderWithProviders(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Website')).toBeInTheDocument()
  })

  it('hides the category line when the project has no category and no editorial label', () => {
    const uncategorised = {
      ...mockProject,
      title: 'Pipe Pop',
      slug: 'pipe-pop',
      category: null,
    }
    renderWithProviders(<ProjectCard project={uncategorised} />)
    expect(screen.queryByText(/blockchain/i)).not.toBeInTheDocument()
  })
})
