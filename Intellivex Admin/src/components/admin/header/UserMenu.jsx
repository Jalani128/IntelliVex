import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { initials } from '@/lib/format'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return <Skeleton className="size-9 rounded-full" />

  const handleLogout = async () => {
    await logout()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pr-2">
        <Avatar className="size-9">
          {user.avatar && <AvatarImage src={user.avatar} alt="" />}
          <AvatarFallback className="bg-navy text-[13px] font-medium text-white dark:bg-primary">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden text-left leading-tight xl:block">
          <span className="block text-sm font-medium">{user.name}</span>
          <span className="block text-xs text-muted-foreground">{user.role}</span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground xl:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
