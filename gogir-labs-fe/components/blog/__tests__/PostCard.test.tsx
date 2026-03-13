import React from 'react'
import { render, screen } from '@testing-library/react'
import { PostCard } from '../PostCard'

const mockPost = {
  id: 1,
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'Test excerpt content',
  featured_image: '/test-image.jpg',
  category: { id: 1, name: 'Technology', slug: 'technology' },
  tags: [{ id: 1, name: 'Python', slug: 'python' }],
  author_name: 'John Doe',
  published: true,
  featured: false,
  views: 10,
  created_at: '2024-01-01T00:00:00Z',
  published_at: '2024-01-01T00:00:00Z',
}

describe('PostCard', () => {
  it('renders post data', () => {
    render(<PostCard post={mockPost} featured={false} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test excerpt content')).toBeInTheDocument()
  })

  it('renders featured post with special styling', () => {
    const featuredPost = { ...mockPost, featured: true }
    render(<PostCard post={featuredPost} featured={true} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    // Featured badge should be present
    expect(screen.getByText(/featured/i)).toBeInTheDocument()
  })

  it('handles missing image gracefully', () => {
    const postWithoutImage = { ...mockPost, featured_image: null }
    render(<PostCard post={postWithoutImage} featured={false} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('handles very long title', () => {
    const longTitlePost = {
      ...mockPost,
      title: 'A'.repeat(200),
    }
    render(<PostCard post={longTitlePost} featured={false} />)
    expect(screen.getByText('A'.repeat(200))).toBeInTheDocument()
  })

  it('handles missing data gracefully', () => {
    const incompletePost = {
      ...mockPost,
      category: null,
      tags: [],
    }
    render(<PostCard post={incompletePost} featured={false} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })
})
