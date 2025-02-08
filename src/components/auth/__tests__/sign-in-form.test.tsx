import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import { SignInForm } from '../sign-in-form'
import { useSupabase } from '@/components/providers/supabase-provider'

// Mock the useSupabase hook
vi.mock('@/components/providers/supabase-provider', () => ({
  useSupabase: vi.fn(() => ({
    supabase: {
      auth: {
        signInWithOtp: vi.fn(),
        signUp: vi.fn(),
      },
    },
  })),
}))

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}))

describe('SignInForm', () => {
  it('renders email input and buttons', () => {
    render(<SignInForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with email/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play as guest/i })).toBeInTheDocument()
  })

  it('handles email sign in', async () => {
    const mockSignInWithOtp = vi.fn().mockResolvedValue({ error: null })
    const useSupabaseMock = useSupabase as unknown as ReturnType<typeof vi.fn>
    useSupabaseMock.mockImplementation(() => ({
      supabase: {
        auth: {
          signInWithOtp: mockSignInWithOtp,
        },
      },
    }))

    render(<SignInForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const signInButton = screen.getByRole('button', { name: /sign in with email/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.any(String),
        },
      })
    })
  })

  it('handles guest sign in', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    const useSupabaseMock = useSupabase as unknown as ReturnType<typeof vi.fn>
    useSupabaseMock.mockImplementation(() => ({
      supabase: {
        auth: {
          signUp: mockSignUp,
        },
      },
    }))

    render(<SignInForm />)
    
    const guestButton = screen.getByRole('button', { name: /play as guest/i })
    fireEvent.click(guestButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
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
  })
}) 