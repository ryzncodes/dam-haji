import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import { SignInForm } from '../sign-in-form'

const mockSupabase = {
  auth: {
    signInWithOtp: vi.fn(),
    signUp: vi.fn(),
  },
}

const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn(),
}

// Mock the useSupabase hook
vi.mock('@/components/providers/supabase-provider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSupabase: () => ({
    supabase: mockSupabase,
    user: null,
    loading: false,
  }),
}))

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

// Mock the toast
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email input and buttons', () => {
    render(<SignInForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with email/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play as guest/i })).toBeInTheDocument()
  })

  it('handles email sign in', async () => {
    const { toast } = await import('@/components/ui/use-toast')
    mockSupabase.auth.signInWithOtp.mockResolvedValueOnce({ error: null })

    render(<SignInForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const signInButton = screen.getByRole('button', { name: /sign in with email/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.any(String),
        },
      })
    })

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Check your email',
        description: 'We sent you a login link. Be sure to check your spam folder.',
      })
    })
  })

  it('handles guest sign in', async () => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null })

    render(<SignInForm />)
    
    const guestButton = screen.getByRole('button', { name: /play as guest/i })
    fireEvent.click(guestButton)

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: expect.stringContaining('@guest.damhaji.com'),
        password: expect.any(String),
        options: {
          data: {
            is_guest: true,
            guest_id: expect.any(String),
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/game')
    })
  })
}) 