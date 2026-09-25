import {
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  Handshake,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Settings,
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
      { key: 'partnerships', label: 'Partnerships', singular: 'Partnership', path: '/admin/partnerships', icon: Handshake },
      { key: 'team', label: 'Team', singular: 'Team Member', path: '/admin/team', icon: Users },
    ],
  },
  {
    label: 'Leads',
    items: [{ key: 'inquiries', label: 'Inquiries', singular: 'Inquiry', path: '/admin/inquiries', icon: Inbox, crud: false }],
  },
  {
    label: 'System',
    items: [{ key: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings, standalone: true }],
  },
]

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items)

/** Content modules that get list / detail / create / edit routes. */
export const RESOURCE_MODULES = NAV_ITEMS.filter((item) => item.key !== 'dashboard' && !item.standalone)
