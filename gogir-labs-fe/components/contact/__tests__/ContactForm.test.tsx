import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContactForm } from '../ContactForm'
import api from '@/lib/api'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'

// Mock the API
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}))

const mockApi = api as jest.Mocked<typeof api>

describe('ContactForm', () => {
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
    return render(
      <AnalyticsProvider>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </AnalyticsProvider>
    )
  }

  const fillValidFields = async (
    user: ReturnType<typeof userEvent.setup>,
    overrides?: { name?: string; email?: string; message?: string }
  ) => {
    await user.type(screen.getByLabelText(/name \*/i), overrides?.name ?? 'John Doe')
    await user.type(screen.getByLabelText(/email \*/i), overrides?.email ?? 'john@example.com')
    await user.selectOptions(screen.getByLabelText(/subject \*/i), 'Project enquiry')
    await user.type(
      screen.getByLabelText(/message \*/i),
      overrides?.message ?? 'Test message content'
    )
  }

  it('renders form fields', () => {
    renderWithProviders(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
    })
  })

  it('does not use orangered field styling', () => {
    renderWithProviders(<ContactForm />)
    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput.className).not.toMatch(/orangered/)
    expect(nameInput.className).toMatch(/border-essay-ink/)
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ContactForm />)

    await fillValidFields(user, { email: 'invalid-email' })

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // type="email" blocks submit before Zod, so the inline Zod message is not shown.
    expect(mockApi.post).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/email \*/i)).toBeInvalid()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { message: 'Success' } })

    renderWithProviders(<ContactForm />)

    await act(async () => {
      await fillValidFields(user)
    })

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await act(async () => {
      await user.click(submitButton)
    })

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/contact/', {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project enquiry',
        message: 'Test message content',
      })
    })
  })

  it('handles network failure', async () => {
    const user = userEvent.setup()
    mockApi.post.mockRejectedValue(new Error('Network error'))

    renderWithProviders(<ContactForm />)

    await fillValidFields(user)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/error submitting/i)).toBeInTheDocument()
    })
  })

  it('handles very long inputs', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { message: 'Success' } })

    renderWithProviders(<ContactForm />)

    await fillValidFields(user, { name: 'A'.repeat(100), message: 'Test message' })

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalled()
    })
  })

  it('handles XSS attempt in inputs', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { message: 'Success' } })

    renderWithProviders(<ContactForm />)

    await fillValidFields(user, { name: '<script>alert("XSS")</script>', message: 'Test message' })

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalled()
    })
    // Form should submit (sanitization happens server-side)
  })

  it('shows success message after submission', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { message: 'Success' } })

    renderWithProviders(<ContactForm />)

    await act(async () => {
      await fillValidFields(user)
    })

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await act(async () => {
      await user.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    })
  })
})
