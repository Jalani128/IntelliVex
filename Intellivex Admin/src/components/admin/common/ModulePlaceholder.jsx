import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/card'
import PageHeader from '../layout/PageHeader'
import EmptyState from './EmptyState'

/** Temporary page for modules scheduled in Phase 3. */
export default function ModulePlaceholder({ item }) {
  return (
    <>
      <PageHeader title={item.label} description={`Manage ${item.label.toLowerCase()} shown on the IntelliVex website.`} />
      <Card className="py-0">
        <EmptyState
          icon={Construction}
          title={`${item.label} module is coming next`}
          description="The list, detail and form pages for this module will be built in the next phase."
        />
      </Card>
    </>
  )
}
