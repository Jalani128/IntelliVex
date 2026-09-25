import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../sidebar/nav-config'

/**
 * Derive breadcrumbs from the URL + nav config:
 *   /admin/services           → Dashboard / Services
 *   /admin/services/create    → Dashboard / Services / New Service
 *   /admin/services/12        → Dashboard / Services / Service #12
 *   /admin/services/12/edit   → Dashboard / Services / Edit Service
 */
export function useBreadcrumbs() {
  const { pathname } = useLocation()
  const crumbs = [{ label: 'Dashboard', to: '/admin' }]

  const [, , moduleSegment, id, action] = pathname.replace(/\/+$/, '').split('/')
  const item = NAV_ITEMS.find((n) => n.path === `/admin/${moduleSegment}`)
  if (!moduleSegment) return crumbs
  if (!item) return [...crumbs, { label: 'Not found' }]

  crumbs.push({ label: item.label, to: item.path })
  if (id === 'create') crumbs.push({ label: item.crud === false ? 'Not found' : `New ${item.singular}` })
  else if (id && action === 'edit') crumbs.push({ label: `Edit ${item.singular}` })
  else if (id) crumbs.push({ label: `${item.singular} #${id}` })

  return crumbs
}
