import { useSearchParams } from 'react-router-dom'
import { Building, ImageIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import ClientsTab from './ClientsTab'
import StoriesTab from './StoriesTab'

const TABS = [
  { value: 'clients', label: 'Clients', icon: Building, Content: ClientsTab },
  { value: 'stories', label: 'Success Stories', icon: ImageIcon, Content: StoriesTab },
]

/**
 * /admin/client-stories — clients (logo bar, Client Portfolio grid and the
 * /client-portfolio/{slug} pages) and the Success Stories cards. Reviews and the
 * page's own content stay in the Testimonials module. The active tab lives in `?tab=`.
 */
export default function ClientStoriesPage() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'clients'

  return (
    <>
      <PageHeader
        title="Client Stories"
        description="Clients for the logo bar and Client Portfolio pages, and the Success Stories cards on the Testimonials page."
      />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'clients' ? {} : { tab: value }, { replace: true })} className="gap-4">
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
