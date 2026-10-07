import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import AdminLayout from '@/components/admin/layout/AdminLayout'
import { AuthProvider } from '@/hooks/useAuth'
import { GuestOnly, RequireAuth } from './guards'
import ModulePlaceholder from '@/components/admin/common/ModulePlaceholder'
import PageLoader from '@/components/admin/common/PageLoader'
import { RESOURCE_MODULES } from '@/components/admin/sidebar/nav-config'

const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const NotFound = lazy(() => import('@/pages/admin/NotFound'))
const Login = lazy(() => import('@/pages/auth/Login'))
const WebsitePages = lazy(() => import('@/pages/admin/pages/WebsitePages'))
const InquiriesList = lazy(() => import('@/pages/admin/inquiries/InquiriesList'))
const InquiryDetail = lazy(() => import('@/pages/admin/inquiries/InquiryDetail'))
const ServicesPage = lazy(() => import('@/pages/admin/services/ServicesPage'))
const ServiceForm = lazy(() => import('@/pages/admin/services/ServiceForm'))
const IndustriesList = lazy(() => import('@/pages/admin/industries/IndustriesList'))
const IndustryForm = lazy(() => import('@/pages/admin/industries/IndustryForm'))
const PartnershipsPage = lazy(() => import('@/pages/admin/partnerships/PartnershipsPage'))
const PartnerForm = lazy(() => import('@/pages/admin/partnerships/PartnerForm'))
const TestimonialsPage = lazy(() => import('@/pages/admin/testimonials/TestimonialsPage'))
const ReviewForm = lazy(() => import('@/pages/admin/testimonials/ReviewForm'))
const ClientStoriesPage = lazy(() => import('@/pages/admin/client-stories/ClientStoriesPage'))
const ClientForm = lazy(() => import('@/pages/admin/client-stories/ClientForm'))
const ProductsPage = lazy(() => import('@/pages/admin/products/ProductsPage'))
const ProductForm = lazy(() => import('@/pages/admin/products/ProductForm'))
const PortfolioPage = lazy(() => import('@/pages/admin/projects/PortfolioPage'))
const ProjectForm = lazy(() => import('@/pages/admin/projects/ProjectForm'))
const TeamPage = lazy(() => import('@/pages/admin/team/TeamPage'))
const TeamMemberForm = lazy(() => import('@/pages/admin/team/TeamMemberForm'))
const TeamMemberDetail = lazy(() => import('@/pages/admin/team/TeamMemberDetail'))

const page = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>

/** Modules that have real pages; the rest still render the placeholder. */
const BUILT_PAGES = {
  // Tabs for the Home and About Us page content; there are no records to open.
  pages: { list: page(<WebsitePages />), detail: <Navigate to="/admin/pages" replace /> },
  inquiries: { list: page(<InquiriesList />), detail: page(<InquiryDetail />) },
  // Content modules have no separate detail view — the record opens straight in its form.
  // Tabs for services and the Services page content; create / edit are for services.
  services: {
    list: page(<ServicesPage />),
    create: page(<ServiceForm />),
    detail: <Navigate to="edit" replace />,
    edit: page(<ServiceForm />),
  },
  industries: {
    list: page(<IndustriesList />),
    create: page(<IndustryForm />),
    detail: <Navigate to="edit" replace />,
    edit: page(<IndustryForm />),
  },
  // List page holds three tabs (partners, platforms, page content); create / edit are for partners.
  partnerships: {
    list: page(<PartnershipsPage />),
    create: page(<PartnerForm />),
    detail: <Navigate to="edit" replace />,
    edit: page(<PartnerForm />),
  },
  // Tabs for reviews and page content; create / edit are for reviews.
  testimonials: {
    list: page(<TestimonialsPage />),
    create: page(<ReviewForm />),
    detail: <Navigate to="edit" replace />,
    edit: page(<ReviewForm />),
  },
  // Tabs for clients and success stories; create / edit are full pages for clients.
  'client-stories': {
    list: page(<ClientStoriesPage />),
    create: page(<ClientForm />),
    detail: <Navigate to="edit" replace />,
    edit: page(<ClientForm />),
  },
  // Tabs for products, categories, solutions and page content; create / edit are for products.
  products: {
    list: page(<ProductsPage />),
    create: page(<ProductForm />),
    detail: <Navigate to="edit" replace />,
    edit: page(<ProductForm />),
  },
  // Portfolio (nav key "projects"): tabs for projects and page content; create / edit are for projects.
  projects: {
    list: page(<PortfolioPage />),
    create: page(<ProjectForm />),
    detail: <Navigate to="edit" replace />,
    edit: page(<ProjectForm />),
  },
  // Tabs for team members and the "Our Leadership" section content; members get a read-only detail view.
  team: {
    list: page(<TeamPage />),
    create: page(<TeamMemberForm />),
    detail: page(<TeamMemberDetail />),
    edit: page(<TeamMemberForm />),
  },
}

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
  const built = BUILT_PAGES[item.key] ?? {}
  const hasForms = item.crud !== false
  return {
    path: item.key,
    children: [
      { index: true, element: built.list ?? placeholder },
      // Without this, "create" would be matched as a record id on read-only modules.
      { path: 'create', element: hasForms ? (built.create ?? placeholder) : page(<NotFound />) },
      { path: ':id', element: built.detail ?? placeholder },
      ...(hasForms ? [{ path: ':id/edit', element: built.edit ?? placeholder }] : []),
    ],
  }
})

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
          { path: '*', element: page(<NotFound />) },
        ],
      },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
])
