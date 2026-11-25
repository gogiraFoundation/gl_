import React from 'react'
import { render, screen } from '@testing-library/react'
import { EssayNav } from '../EssayNav'

describe('EssayNav', () => {
  it('renders Essays, Portfolio, About, Resume, and Contact links with name-first brand', () => {
    render(<EssayNav />)

    expect(screen.getByRole('link', { name: /Emmanuel Ugbaje/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Essays' })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '/portfolio')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('href', '/resume')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('marks the active Portfolio link with aria-current', () => {
    render(<EssayNav active="portfolio" />)

    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Essays' })).not.toHaveAttribute('aria-current')
  })
})
