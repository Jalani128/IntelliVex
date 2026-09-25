import { createResource } from './createResource'
import { inquiriesMock } from '@/mock/admin/inquiries.mock'

export const inquiriesApi = createResource('inquiries', {
  seed: inquiriesMock,
  searchFields: ['name', 'email', 'company', 'service'],
})
