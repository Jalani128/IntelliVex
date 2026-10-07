import { Link, useSearchParams } from 'react-router-dom'
import { FileText, Layers, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import ServicesList from './ServicesList'
import PageContentTab from './PageContentTab'

const TABS = [
  { value: 'services', label: 'Services', icon: Layers, Content: ServicesList },
  { value: 'content', label: 'Page Content', icon: FileText, Content: PageContentTab },
]

/**
 * /admin/services — the service cards (Home grid, Services page, header menu,
 * detail pages) and the Services page's own content. The active tab lives in `?tab=`.
 */
export default function ServicesPage() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'services'

  return (
    <>
      <PageHeader
        title="Services"
        description="Services shown on the website — home page grid, Services page, header menu and detail pages."
        actions={
          tab === 'services' && (
            <Button asChild>
              <Link to="/admin/services/create">
                <Plus /> Add Service
              </Link>
            </Button>
          )
        }
      />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'services' ? {} : { tab: value }, { replace: true })} className="gap-4">
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
