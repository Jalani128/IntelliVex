import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdminBreadcrumb from '../layout/AdminBreadcrumb'
import GlobalSearch from './GlobalSearch'
import NotificationsMenu from './NotificationsMenu'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default function Header({ onOpenMobileNav }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="icon" className="-ml-1 lg:hidden" onClick={onOpenMobileNav} aria-label="Open navigation">
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <AdminBreadcrumb />
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <GlobalSearch />
        <ThemeToggle />
        <NotificationsMenu />
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden />
        <UserMenu />
      </div>
    </header>
  )
}
