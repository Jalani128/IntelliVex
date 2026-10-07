import { useSearchParams } from 'react-router-dom'
import { FileText, Layers, Package, Tags } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import IconCardsTab from '@/components/admin/content/IconCardsTab'
import { solutionsApi, IMAGE_MB, LIMITS } from '@/services/admin/products'
import ProductsTab from './ProductsTab'
import CategoriesTab from './CategoriesTab'
import PageContentTab from './PageContentTab'

/** products-backend-spec.md §3.3 — icon optional, link required, null clears the icon. */
const SOLUTION_RULES = {
  titleMax: 150,
  descriptionMax: 500,
  linkMax: 2048,
  linkRequired: true,
  iconRequired: false,
  iconMb: IMAGE_MB.icon,
  nullableIcon: true,
}

function SolutionsTab() {
  return (
    <IconCardsTab
      api={solutionsApi}
      noun="Solution"
      section="Ready-to-Deploy / Customizable Solutions"
      page="Products page"
      limit={LIMITS.solutions}
      rules={SOLUTION_RULES}
    />
  )
}

const TABS = [
  { value: 'products', label: 'Products', icon: Package, Content: ProductsTab },
  { value: 'categories', label: 'Solution Categories', icon: Tags, Content: CategoriesTab },
  { value: 'solutions', label: 'Deployable Solutions', icon: Layers, Content: SolutionsTab },
  { value: 'content', label: 'Page Content', icon: FileText, Content: PageContentTab },
]

/**
 * /admin/products — everything on the public Products page: product cards,
 * category pills, solution cards and the page's own headings / CTA.
 * The active tab lives in `?tab=`.
 */
export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'products'

  return (
    <>
      <PageHeader title="Products" description="Products, solution categories, deployable solutions and the content of the website’s Products page." />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'products' ? {} : { tab: value }, { replace: true })} className="gap-4">
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
