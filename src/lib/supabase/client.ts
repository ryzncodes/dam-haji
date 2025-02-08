import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    __SUPABASE_CLIENT__?: SupabaseClient
  }
}

export const createClient = () => {
  // Use mocked client in E2E tests
  if (typeof window !== 'undefined' && window.__SUPABASE_CLIENT__) {
    return window.__SUPABASE_CLIENT__
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 