import { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import SupabaseProvider from '@/components/providers/supabase-provider'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SupabaseProvider>
  )
}

function renderWithProviders(ui: ReactElement) {
  return render(ui, {
    wrapper: Providers,
  })
}

export * from '@testing-library/react'
export { renderWithProviders as render } 