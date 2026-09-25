import { Ellipsis, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * "⋯" action menu for a table row. Only the handlers passed are shown;
 * `extra` adds custom items ([{ label, icon, onSelect }]) above Delete.
 */
export default function RowActions({ onView, onEdit, onDelete, extra = [], label = 'Row actions' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} onClick={(e) => e.stopPropagation()}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
        {onView && (
          <DropdownMenuItem onSelect={onView}>
            <Eye /> View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil /> Edit
          </DropdownMenuItem>
        )}
        {extra.map(({ label: itemLabel, icon: Icon, onSelect }) => (
          <DropdownMenuItem key={itemLabel} onSelect={onSelect}>
            {Icon && <Icon />} {itemLabel}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
