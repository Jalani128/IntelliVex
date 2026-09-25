import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import AdminLayout from '@/components/admin/layout/AdminLayout'
import { AuthProvider } from '@/hooks/useAuth'
import { GuestOnly, RequireAuth } from './guards'
import ModulePlaceholder from '@/components/admin/common/ModulePlaceholder'
import PageLoader from '@/components/admin/common/PageLoader'
import { NAV_ITEMS, RESOURCE_MODULES } from '@/components/admin/sidebar/nav-config'

const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const NotFound = lazy(() => import('@/pages/admin/NotFound'))
const Login = lazy(() => import('@/pages/auth/Login'))

const page = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>

/**
 * Module routes follow one convention:
 *   /admin/:module            list
 *   /admin/:module/create     create form   (skipped when crud: false)
 *   /admin/:module/:id        detail
 *   /admin/:module/:id/edit   edit form     (skipped when crud: false)
 * Modules still render a placeholder until they are built — swap `element`
 * for the real pages as each module lands.
 */
const moduleRoutes = RESOURCE_MODULES.map((item) => {
  const placeholder = <ModulePlaceholder item={item} />
  const hasForms = item.crud !== false
  return {
    path: item.key,
    children: [
      { index: true, element: placeholder },
      // Without this, "create" would be matched as a record id on read-only modules.
      { path: 'create', element: hasForms ? placeholder : page(<NotFound />) },
      { path: ':id', element: placeholder },
      ...(hasForms ? [{ path: ':id/edit', element: placeholder }] : []),
    ],
  }
})

const settings = NAV_ITEMS.find((item) => item.key === 'settings')

export const router = createBrowserRouter([
  {
    // Auth context sits inside the router so guards and pages can navigate.
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { path: '/', element: <Navigate to="/admin" replace /> },
      { path: '/login', element: <GuestOnly>{page(<Login />)}</GuestOnly> },
      {
        path: '/admin',
        element: (
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: page(<Dashboard />) },
          ...moduleRoutes,
          { path: 'settings', element: <ModulePlaceholder item={settings} /> },
          { path: '*', element: page(<NotFound />) },
        ],
      },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
])
