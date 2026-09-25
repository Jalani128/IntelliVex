import { http } from './http'
import { USE_MOCK } from './config'
import { delay } from './mockAdapter'
import { inquiriesApi } from './inquiries'
import { statsMock, inquiryTrendMock, projectsByIndustryMock } from '@/mock/admin/dashboard.mock'
import { activityMock } from '@/mock/admin/activity.mock'

const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90 }
const get = (url, params) => http.get(url, { params }).then((r) => r.data)

/**
 * Dashboard endpoints. Expected Laravel routes:
 *   GET /dashboard/stats?range=30d            → { data: { inquiries, projects, services, testimonials } }
 *   GET /dashboard/inquiry-trend?range=30d    → { data: [{ date, inquiries, converted }] }
 *   GET /dashboard/projects-by-industry       → { data: [{ industry, projects }] }
 *   GET /dashboard/activity?limit=6           → { data: [{ id, user, action, subject, target, created_at }] }
 * Recent inquiries reuse the inquiries resource.
 */
export const dashboardApi = USE_MOCK
  ? {
      getStats: (range) => delay({ data: statsMock[range] }),
      getInquiryTrend: (range) => delay({ data: inquiryTrendMock.slice(-RANGE_DAYS[range]) }, 650),
      getProjectsByIndustry: () => delay({ data: projectsByIndustryMock }, 550),
      getActivity: (limit = 6) => delay({ data: activityMock.slice(0, limit) }, 500),
      getRecentInquiries: (limit = 5) => inquiriesApi.list({ per_page: limit }),
    }
  : {
      getStats: (range) => get('/dashboard/stats', { range }),
      getInquiryTrend: (range) => get('/dashboard/inquiry-trend', { range }),
      getProjectsByIndustry: () => get('/dashboard/projects-by-industry'),
      getActivity: (limit = 6) => get('/dashboard/activity', { limit }),
      getRecentInquiries: (limit = 5) => inquiriesApi.list({ per_page: limit }),
    }
