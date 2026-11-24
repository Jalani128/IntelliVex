import {
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  Contact,
  FileText,
  Gamepad2,
  Handshake,
  Inbox,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Package,
  PanelsTopLeft,
  Users,
} from 'lucide-react'

/**
 * Single source of truth for admin navigation.
 * The sidebar, breadcrumbs, global search and router all read from here.
 *
 * `singular` names the record type for breadcrumbs ("New Service", "Edit Service").
 * `crud: false` means the module only has list + detail pages (no create/edit).
 */
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ key: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Website Content',
    items: [
      // Single-row page content (Home, About Us) — no records to create, so no create / edit routes.
      { key: 'pages', label: 'Pages', singular: 'Page', path: '/admin/pages', icon: PanelsTopLeft, crud: false },
      { key: 'services', label: 'Services', singular: 'Service', path: '/admin/services', icon: Layers },
      { key: 'industries', label: 'Industries', singular: 'Industry', path: '/admin/industries', icon: Building2 },
      { key: 'projects', label: 'Portfolio', singular: 'Project', path: '/admin/projects', icon: BriefcaseBusiness },
      { key: 'client-stories', label: 'Client Stories', singular: 'Client Story', path: '/admin/client-stories', icon: BookOpenText },
      { key: 'products', label: 'Products', singular: 'Product', path: '/admin/products', icon: Package },
    ],
  },
  {
    label: 'Company',
    items: [
      { key: 'testimonials', label: 'Testimonials', singular: 'Testimonial', path: '/admin/testimonials', icon: MessageSquareQuote },
      { key: 'partnerships', label: 'Partnerships', singular: 'Partner', path: '/admin/partnerships', icon: Handshake },
      { key: 'team', label: 'Team', singular: 'Team Member', path: '/admin/team', icon: Users },
    ],
  },
  {
    label: 'Leads',
    items: [{ key: 'inquiries', label: 'Inquiries', singular: 'Inquiry', path: '/admin/inquiries', icon: Inbox, crud: false }],
  },
]

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items)

/** Content modules that get list / detail / create / edit routes. */
export const RESOURCE_MODULES = NAV_ITEMS.filter((item) => item.key !== 'dashboard')

/**
 * Game Studio website. Shown as the whole sidebar while under /admin/studio.
 * Kept out of NAV_ITEMS: these pages are registered by hand in routes/index.jsx.
 */
export const STUDIO_NAV_GROUPS = [
  {
    label: 'Game Studio',
    items: [
      { key: 'studio-games', label: 'Games', singular: 'Game', path: '/admin/studio/games', icon: Gamepad2 },
      { key: 'studio-news', label: 'News', singular: 'Article', path: '/admin/studio/news', icon: Newspaper },
      { key: 'studio-careers', label: 'Careers', singular: 'Role', path: '/admin/studio/careers', icon: BriefcaseBusiness },
      { key: 'studio-team', label: 'Team', singular: 'Team Member', path: '/admin/studio/team', icon: Users },
      { key: 'studio-testimonials', label: 'Testimonials', singular: 'Testimonial', path: '/admin/studio/testimonials', icon: MessageSquareQuote },
      { key: 'studio-partners', label: 'Partners', singular: 'Partner', path: '/admin/studio/partners', icon: Handshake },
    ],
  },
  {
    label: 'Studio Pages',
    items: [
      { key: 'studio-home', label: 'Home Page', path: '/admin/studio/home', icon: LayoutDashboard },
      { key: 'studio-about', label: 'Our Studio', path: '/admin/studio/about', icon: PanelsTopLeft },
      { key: 'studio-contact', label: 'Contact Page', path: '/admin/studio/contact', icon: Contact },
    ],
  },
  {
    label: 'Studio Leads',
    items: [
      { key: 'studio-inquiries', label: 'Inquiries', path: '/admin/studio/inquiries', icon: Inbox },
      { key: 'studio-subscribers', label: 'Subscribers', path: '/admin/studio/subscribers', icon: Mail },
      { key: 'studio-applications', label: 'Applications', path: '/admin/studio/applications', icon: FileText },
    ],
  },
  {
    label: 'Switch',
    items: [{ key: 'main-dashboard', label: 'Main website', path: '/admin', icon: LayoutDashboard, end: true }],
  },
]

export const STUDIO_NAV_ITEMS = STUDIO_NAV_GROUPS.flatMap((g) => g.items)
