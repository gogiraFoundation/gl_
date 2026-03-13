import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../../ThemeToggle'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('toggles theme on click', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorageMock.getItem('theme')).toBe('light')
  })

  it('persists theme in localStorage', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)

    expect(localStorageMock.getItem('theme')).toBe('light')
  })

  it('handles missing localStorage gracefully', () => {
    // Remove localStorage
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      writable: true,
    })

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('loads theme from localStorage on mount', () => {
    localStorageMock.setItem('theme', 'light')

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
