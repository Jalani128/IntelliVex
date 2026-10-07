import IconCardsTab from '@/components/admin/content/IconCardsTab'
import { platformsApi, LIMITS } from '@/services/admin/partnerships'

/** "Platforms & Technologies Supported" cards on the Partnerships page. */
export default function PlatformsTab() {
  return (
    <IconCardsTab
      api={platformsApi}
      noun="Platform"
      section="Platforms & Technologies Supported"
      page="Partnerships page"
      limit={LIMITS.platforms}
    />
  )
}
