import { useSearchParams } from 'react-router-dom'
import { FileText, MessageSquareQuote } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import ReviewsTab from './ReviewsTab'
import PageContentTab from './PageContentTab'

const TABS = [
  { value: 'reviews', label: 'Reviews', icon: MessageSquareQuote, Content: ReviewsTab },
  { value: 'content', label: 'Page Content', icon: FileText, Content: PageContentTab },
]

/**
 * /admin/testimonials — reviews (Testimonials page and Home page) and the
 * Testimonials page's own content. Clients and success stories live in the
 * Client Stories module. The active tab lives in `?tab=`.
 */
export default function TestimonialsPage() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'reviews'

  return (
    <>
      <PageHeader title="Testimonials" description="Client reviews and the content of the website’s Testimonials page. Client logos and success stories are in Client Stories." />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'reviews' ? {} : { tab: value }, { replace: true })} className="gap-4">
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
