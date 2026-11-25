import { useLocation } from 'react-router-dom'
import { NAV_ITEMS, STUDIO_NAV_ITEMS } from '../sidebar/nav-config'

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

  // Game Studio: /admin/studio/{section}[/create | /{id}/edit]
  if (moduleSegment === 'studio') {
    const [, , , section, recordId, recordAction] = pathname.replace(/\/+$/, '').split('/')
    const studio = STUDIO_NAV_ITEMS.find((n) => n.path === `/admin/studio/${section}`)
    crumbs.push({ label: 'Game Studio', to: '/admin/studio' })
    if (!studio) return [...crumbs, { label: 'Not found' }]
    if (!recordId) return [...crumbs, { label: studio.label }]
    crumbs.push({ label: studio.label, to: studio.path })
    return [...crumbs, { label: recordId === 'create' ? `New ${studio.singular}` : recordAction === 'edit' ? `Edit ${studio.singular}` : 'Not found' }]
  }

  const item = NAV_ITEMS.find((n) => n.path === `/admin/${moduleSegment}`)
  if (!moduleSegment) return crumbs
  if (!item) return [...crumbs, { label: 'Not found' }]

  crumbs.push({ label: item.label, to: item.path })
  if (id === 'create') crumbs.push({ label: item.crud === false ? 'Not found' : `New ${item.singular}` })
  else if (id && action === 'edit') crumbs.push({ label: `Edit ${item.singular}` })
  else if (id) crumbs.push({ label: `${item.singular} #${id}` })

  return crumbs
}
