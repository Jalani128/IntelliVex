import { cn } from '@/lib/utils'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/** Card shell for dashboard panels: title, optional description and header action. */
export default function ChartCard({ title, description, action, children, className, contentClassName }) {
  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader>
        <CardTitle className="font-display text-base font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className={cn('flex-1', contentClassName)}>{children}</CardContent>
    </Card>
  )
}
