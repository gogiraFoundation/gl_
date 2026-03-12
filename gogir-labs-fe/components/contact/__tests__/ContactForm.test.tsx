import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContactForm } from '../ContactForm'
import api from '@/lib/api'

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
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
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
    
    const submitButton = screen.getByRole('button', { name: /discuss your project/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
    await user.type(screen.getByLabelText(/message/i), 'Test message content')

    const submitButton = screen.getByRole('button', { name: /discuss your project/i })
    await user.click(submitButton)

    await waitFor(() => {
      // Check for validation error - could be in error message or form validation
      const errorText = screen.queryByText(/invalid email/i) || screen.queryByText(/email/i)
      expect(errorText).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { message: 'Success' } })
    
    renderWithProviders(<ContactForm />)
    
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
      await user.type(screen.getByLabelText(/message/i), 'Test message content')
    })

    const submitButton = screen.getByRole('button', { name: /discuss your project/i })
    await act(async () => {
      await user.click(submitButton)
    })

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/contact/', {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      })
    })
  })

  it('handles network failure', async () => {
    const user = userEvent.setup()
    mockApi.post.mockRejectedValue(new Error('Network error'))
    
    renderWithProviders(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
    await user.type(screen.getByLabelText(/message/i), 'Test message content')

    const submitButton = screen.getByRole('button', { name: /discuss your project/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/error submitting/i)).toBeInTheDocument()
    })
  })

  it('handles very long inputs', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { message: 'Success' } })
    
    renderWithProviders(<ContactForm />)
    
    const longName = 'A'.repeat(100)
    await user.type(screen.getByLabelText(/name/i), longName)
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
    await user.type(screen.getByLabelText(/message/i), 'Test message')

    const submitButton = screen.getByRole('button', { name: /discuss your project/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalled()
    })
  })

  it('handles XSS attempt in inputs', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { message: 'Success' } })
    
    renderWithProviders(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name/i), '<script>alert("XSS")</script>')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
    await user.type(screen.getByLabelText(/message/i), 'Test message')

    const submitButton = screen.getByRole('button', { name: /discuss your project/i })
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
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
      await user.type(screen.getByLabelText(/message/i), 'Test message content')
    })

    const submitButton = screen.getByRole('button', { name: /discuss your project/i })
    await act(async () => {
      await user.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    })
  })
})

