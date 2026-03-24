import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../i18n'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/AuthProvider'

// Clear auth state if token is older than 60 minutes
const tokenTime = localStorage.getItem('token_time')
if (tokenTime && Date.now() - Number(tokenTime) > 60 * 60 * 1000) {
  localStorage.removeItem('token')
  localStorage.removeItem('auth_user')
  localStorage.removeItem('token_time')
}
document.documentElement.classList.add('dark')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})
createRoot(document.getElementById('root')!).render(
  <>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  </>
)
