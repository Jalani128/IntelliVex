import { useSearchParams } from 'react-router-dom'
import { FileText, Handshake, Layers } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import PartnersTab from './PartnersTab'
import PlatformsTab from './PlatformsTab'
import PageContentTab from './PageContentTab'

const TABS = [
  { value: 'partners', label: 'Partners', icon: Handshake, Content: PartnersTab },
  { value: 'platforms', label: 'Supported Platforms', icon: Layers, Content: PlatformsTab },
  { value: 'content', label: 'Page Content', icon: FileText, Content: PageContentTab },
]

/**
 * /admin/partnerships — everything on the public Partnerships page:
 * partner logos, platform cards and the page's own headings / video / CTA.
 * The active tab lives in `?tab=` so links and the back button keep it.
 */
export default function PartnershipsPage() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'partners'

  return (
    <>
      <PageHeader title="Partnerships" description="Partner logos, supported platforms and the content of the website’s Partnerships page." />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'partners' ? {} : { tab: value }, { replace: true })} className="gap-4">
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
