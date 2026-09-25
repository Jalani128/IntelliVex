import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes'

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={150}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </TooltipProvider>
    </ThemeProvider>
  )
}
