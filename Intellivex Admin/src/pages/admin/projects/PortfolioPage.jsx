import { useSearchParams } from 'react-router-dom'
import { BriefcaseBusiness, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import ProjectsTab from './ProjectsTab'
import PageContentTab from './PageContentTab'

const TABS = [
  { value: 'projects', label: 'Projects', icon: BriefcaseBusiness, Content: ProjectsTab },
  { value: 'content', label: 'Page Content', icon: FileText, Content: PageContentTab },
]

/**
 * /admin/projects — the public Portfolio page and its Project Details pages.
 * The active tab lives in `?tab=`.
 */
export default function PortfolioPage() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'projects'

  return (
    <>
      <PageHeader title="Portfolio" description="Case studies for the website’s Portfolio page, Project Details pages, Home and Industries." />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'projects' ? {} : { tab: value }, { replace: true })} className="gap-4">
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
