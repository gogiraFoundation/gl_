import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScrollAnimation } from '../ScrollAnimation'

describe('ScrollAnimation', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    })
  })

  it('shows children immediately when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    render(
      <ScrollAnimation animationType="fade-in" delay={500}>
        <p>Visible without waiting</p>
      </ScrollAnimation>
    )

    const child = screen.getByText('Visible without waiting')
    expect(child).toBeInTheDocument()
    expect(child.parentElement).toHaveClass('visible')
  })
})
