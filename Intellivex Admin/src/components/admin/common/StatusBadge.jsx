import { cn } from '@/lib/utils'

const TONES = {
  success: 'bg-success/10 text-success ring-success/20',
  warning: 'bg-warning/10 text-warning ring-warning/25',
  info: 'bg-info/10 text-info ring-info/20',
  danger: 'bg-destructive/10 text-destructive ring-destructive/20',
  neutral: 'bg-muted text-muted-foreground ring-border',
}

/** Status value → tone + label, shared across every module. */
const STATUS_MAP = {
  published: { tone: 'success', label: 'Published' },
  active: { tone: 'success', label: 'Active' },
  closed: { tone: 'success', label: 'Closed' },
  draft: { tone: 'warning', label: 'Draft' },
  pending: { tone: 'warning', label: 'Pending' },
  in_progress: { tone: 'warning', label: 'In Progress' },
  new: { tone: 'info', label: 'New' },
  contacted: { tone: 'neutral', label: 'Contacted' },
  inactive: { tone: 'neutral', label: 'Inactive' },
  archived: { tone: 'neutral', label: 'Archived' },
  rejected: { tone: 'danger', label: 'Rejected' },
}

export const statusLabel = (status) => STATUS_MAP[status]?.label ?? status

export default function StatusBadge({ status, className }) {
  const { tone, label } = STATUS_MAP[status] ?? { tone: 'neutral', label: status }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  )
}
