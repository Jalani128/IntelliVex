import { useSearchParams } from 'react-router-dom'
import { FileText, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import TeamMembersTab from './TeamMembersTab'
import SectionContentTab from './SectionContentTab'

const TABS = [
  { value: 'members', label: 'Team Members', icon: Users, Content: TeamMembersTab },
  { value: 'content', label: 'Section Content', icon: FileText, Content: SectionContentTab },
]

/**
 * /admin/team — the "Our Leadership" section of the website's About page:
 * team members and the section's own heading / VIEW ALL button.
 * The active tab lives in `?tab=` so links and the back button keep it.
 */
export default function TeamPage() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'members'

  return (
    <>
      <PageHeader title="Team" description="Team members and the “Our Leadership” section of the website’s About page." />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'members' ? {} : { tab: value }, { replace: true })} className="gap-4">
        <TabsList className="h-auto min-h-10 flex-wrap">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="px-3 py-1.5">
              <Icon /> {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value, Content }) => (
          <TabsContent key={value} value={value}>
            <Content />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
