import { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import SupabaseProvider from '@/components/providers/supabase-provider'

interface ProvidersProps {
  children: React.ReactNode
  withTheme?: boolean
}

function Providers({ children, withTheme = false }: ProvidersProps) {
  let content = children

  if (withTheme) {
    content = (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {content}
      </ThemeProvider>
    )
  }

  return <SupabaseProvider>{content}</SupabaseProvider>
}

function renderWithProviders(ui: ReactElement, { withTheme = false } = {}) {
  return render(ui, {
    wrapper: ({ children }) => <Providers withTheme={withTheme}>{children}</Providers>,
  })
}

export * from '@testing-library/react'
export { renderWithProviders as render } 