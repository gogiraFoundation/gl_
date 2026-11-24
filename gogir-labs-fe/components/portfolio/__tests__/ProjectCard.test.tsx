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

  it('renders a typographic placeholder when there is no featured image', () => {
    const { container } = renderWithProviders(<ProjectCard project={mockProject} />)

    expect(screen.getByTestId('project-card-placeholder')).toBeInTheDocument()
    expect(screen.queryByAltText(/preview/i)).not.toBeInTheDocument()
    expect(document.body.innerHTML).not.toContain('picsum.photos')
    expect(screen.getAllByText('Afri Cleans Website').length).toBeGreaterThanOrEqual(1)
    expect(container.querySelector('article')).toHaveClass('opacity-100')
    expect(container.querySelector('article')).not.toHaveClass('opacity-0')
  })

  it('renders the featured image with preview alt text when present', () => {
    const withImage = {
      ...mockProject,
      featured_image: '/media/projects/afri.jpg',
    }
    renderWithProviders(<ProjectCard project={withImage} />)

    expect(screen.getByAltText('Afri Cleans Website preview')).toBeInTheDocument()
    expect(screen.queryByTestId('project-card-placeholder')).not.toBeInTheDocument()
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
