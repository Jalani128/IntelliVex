import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import PageLoader from '@/components/admin/common/PageLoader'

const FullScreenLoader = () => (
  <div className="grid min-h-screen place-items-center">
    <PageLoader />
  </div>
)

/** Admin pages: send guests to /login, remembering where they were going. */
export function RequireAuth({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

/** Login page: already signed-in admins go straight to the dashboard. */
export function GuestOnly({ children }) {
  const { status } = useAuth()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'authenticated') return <Navigate to="/admin" replace />
  return children
}
