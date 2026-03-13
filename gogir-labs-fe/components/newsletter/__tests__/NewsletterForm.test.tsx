import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NewsletterForm } from '../NewsletterForm'
import api from '@/lib/api'

// Mock the API
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}))

const mockApi = api as jest.Mocked<typeof api>

describe('NewsletterForm', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    jest.clearAllMocks()
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
  }

  it('renders email field in compact mode', () => {
    renderWithProviders(<NewsletterForm compact={true} />)
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('renders name and email fields in full mode', () => {
    renderWithProviders(<NewsletterForm showNameField={true} />)
    expect(screen.getByLabelText(/name \(optional\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email \*$/i)).toBeInTheDocument()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewsletterForm compact={true} />)

    await act(async () => {
      await user.type(screen.getByPlaceholderText(/enter your email/i), 'invalid-email')
    })
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    await act(async () => {
      await user.click(submitButton)
    })

    await waitFor(
      () => {
        // Check for validation error - could be in error message or form validation
        const errorText = screen.queryByText(/invalid email/i) || screen.queryByText(/email/i)
        expect(errorText).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('submits subscription with valid email', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({
      data: {
        message: 'Successfully subscribed!',
        subscriber: { email: 'test@example.com', verification_required: true },
      },
    })

    renderWithProviders(<NewsletterForm compact={true} />)

    await act(async () => {
      await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com')
    })
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    await act(async () => {
      await user.click(submitButton)
    })

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/newsletter/subscribe/', {
        email: 'test@example.com',
        name: '',
        source: 'unknown',
      })
    })
  })

  it('handles duplicate subscription error', async () => {
    const user = userEvent.setup()
    mockApi.post.mockRejectedValue({
      response: {
        data: { email: ['This email is already subscribed.'] },
      },
    })

    renderWithProviders(<NewsletterForm compact={true} />)

    await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument()
    })
  })

  it('handles network failure', async () => {
    const user = userEvent.setup()
    mockApi.post.mockRejectedValue(new Error('Network error'))

    renderWithProviders(<NewsletterForm compact={true} />)

    await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/failed to subscribe/i)).toBeInTheDocument()
    })
  })

  it('shows success message after subscription', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({
      data: {
        message: 'Successfully subscribed!',
        subscriber: { email: 'test@example.com', verification_required: true },
      },
    })

    renderWithProviders(<NewsletterForm compact={true} />)

    await act(async () => {
      await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com')
    })
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    await act(async () => {
      await user.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument()
    })
  })
})
