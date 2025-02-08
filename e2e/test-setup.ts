import { test as base } from '@playwright/test'
import type { SupabaseClient, AuthError, User, AuthResponse, Session } from '@supabase/supabase-js'

type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'USER_DELETED'
type AuthStateCallback = (event: AuthChangeEvent, session: { user: User | null; session: Session | null }) => void

// Disable ESLint for the next line because it's a Playwright function, not a React Hook
// eslint-disable-next-line react-hooks/rules-of-hooks
export const test = base.extend({
  context: async ({ context }, use) => {
    // Mock Supabase client methods
    await context.addInitScript(() => {
      // Create an event emitter for auth state changes
      const authStateChangeCallbacks = new Set<AuthStateCallback>()

      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: null,
      }))

      const mockSupabase = {
        auth: {
          signInWithOtp: async ({ email }: { email: string }): Promise<{ error: AuthError | null }> => {
            // Simulate OTP email being sent
            console.log('Sending OTP to:', email)
            return { error: null }
          },
          signUp: async ({ email, password, options }: { 
            email: string, 
            password: string, 
            options?: { data?: Record<string, unknown> } 
          }): Promise<AuthResponse> => {
            // Simulate successful signup
            console.log('Creating account with:', { email, password: '***', options })
            const user = { 
              id: 'test-user-id',
              email,
              user_metadata: options?.data ?? {}
            } as User
            const session = {
              access_token: 'test-token',
              refresh_token: 'test-refresh-token',
              user,
              expires_in: 3600
            } as Session
            // Emit auth state change
            authStateChangeCallbacks.forEach(callback => 
              callback('SIGNED_IN', { user, session })
            )
            return { data: { user, session }, error: null }
          },
          getSession: () => Promise.resolve({ 
            data: { session: null }, 
            error: null 
          }),
          onAuthStateChange: (callback: AuthStateCallback) => {
            authStateChangeCallbacks.add(callback)
            return {
              data: { subscription: { unsubscribe: () => {
                authStateChangeCallbacks.delete(callback)
              }}},
            }
          },
        },
        // Add required properties to match SupabaseClient type
        supabaseUrl: 'http://localhost:54321',
        supabaseKey: 'test-key',
        realtime: { 
          connect: () => {}, 
          disconnect: () => {} 
        },
        realtimeUrl: 'ws://localhost:54321/realtime/v1',
        rest: {},
        channel: () => ({ 
          subscribe: () => ({
            unsubscribe: () => {}
          }) 
        }),
        removeChannel: () => {},
        removeAllChannels: () => {},
        getChannels: () => [],
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: [], error: null }),
          update: () => Promise.resolve({ data: [], error: null }),
          delete: () => Promise.resolve({ data: [], error: null }),
        }),
        rpc: () => Promise.resolve({ data: null, error: null }),
        storage: {
          from: () => ({
            upload: () => Promise.resolve({ data: null, error: null }),
            download: () => Promise.resolve({ data: null, error: null }),
            list: () => Promise.resolve({ data: [], error: null }),
          }),
        },
        functions: {
          invoke: () => Promise.resolve({ data: null, error: null }),
        },
      } as unknown as SupabaseClient

      window.__SUPABASE_CLIENT__ = mockSupabase
    })

    await use(context)
  },
})

export { expect } from '@playwright/test' 