import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/** Titled card grouping related form fields. */
export default function FormSection({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-5">{children}</CardContent>
    </Card>
  )
}
