import { useSearchParams } from 'react-router-dom'
import { House, Info } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import HomePageTab from './HomePageTab'
import AboutPageTab from './AboutPageTab'

const TABS = [
  { value: 'home', label: 'Home', icon: House, Content: HomePageTab },
  { value: 'about', label: 'About Us', icon: Info, Content: AboutPageTab },
]

/**
 * /admin/pages — content of the website pages that have no module of their own.
 * Cards inside them (services, projects, reviews, team) stay in their modules.
 * The Services page content is a tab of the Services module. Active tab lives in `?tab=`.
 */
export default function WebsitePages() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'home'

  return (
    <>
      <PageHeader title="Pages" description="Section headings, text and banners of the website’s Home and About Us pages." />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'home' ? {} : { tab: value }, { replace: true })} className="gap-4">
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
