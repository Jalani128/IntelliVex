import { cn } from '@/lib/utils'
import { initials } from '@/lib/format'

/** Round team-member photo; their initials when there's none. */
export default function MemberAvatar({ member, className }) {
  return (
    <span
      className={cn(
        'grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {member.photo_url ? <img src={member.photo_url} alt="" className="size-full object-cover" /> : initials(member.name)}
    </span>
  )
}

/** First validation message from an API error, else its general message. */
export const apiErrorMessage = (err) => Object.values(err?.errors ?? {})[0]?.[0] ?? err?.message
