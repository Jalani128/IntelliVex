import { hoursAgo } from './helpers'

// Audit trail of admin actions shown on the dashboard.
export const activityMock = [
  { id: 1, user: 'Ayesha Khan', action: 'published', subject: 'service', target: 'AI & Automation', created_at: hoursAgo(0.4) },
  { id: 2, user: 'Bilal Ahmed', action: 'updated', subject: 'project', target: 'Nexa Pay Mobile Wallet', created_at: hoursAgo(1.5) },
  { id: 3, user: 'Ayesha Khan', action: 'replied to', subject: 'inquiry', target: 'Sarah Mitchell', created_at: hoursAgo(3) },
  { id: 4, user: 'Sara Malik', action: 'added', subject: 'testimonial', target: 'Brightline Health', created_at: hoursAgo(6) },
  { id: 5, user: 'Bilal Ahmed', action: 'archived', subject: 'product', target: 'Legacy Analytics Suite', created_at: hoursAgo(20) },
  { id: 6, user: 'Sara Malik', action: 'created', subject: 'industry', target: 'Logistics', created_at: hoursAgo(28) },
  { id: 7, user: 'Ayesha Khan', action: 'updated', subject: 'team member', target: 'Hamza Qureshi', created_at: hoursAgo(49) },
]
