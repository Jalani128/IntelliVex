import { hoursAgo } from './helpers'

// "Get Free Consultation" form submissions (public site: /contact).
// Shape matches CONTACT_INQUIRIES_API.md (Inquiry Object).
const people = [
  ['Sarah Mitchell', 'Patient portal rebuild', 'We need a patient portal rebuilt with appointment booking.'],
  ['Omar Haddad', 'Mobile wallet MVP', 'Looking for a mobile wallet MVP for iOS and Android.'],
  ['Emily Carter', 'AI assistant for listings', 'Interested in an AI assistant for property listings.'],
  ['Daniel Kim', 'Cloud migration', 'Migrating our store to the cloud before Q4 traffic.'],
  ['Aisha Rahman', 'Analytics dashboards', 'Need analytics dashboards for student engagement.'],
  ['Lucas Moreau', 'Route optimisation', 'Route-optimisation model for our delivery fleet.'],
  ['Priya Nair', 'Security audit', 'Security audit and HIPAA-aligned infrastructure review.'],
  ['James O’Connor', 'Fraud detection', 'Fraud detection pipeline on transaction data.'],
  ['Hannah Schulz', 'Website redesign', 'Marketing site redesign and headless CMS.'],
  ['Mateo García', 'Video production', 'Virtual tour content and listing video production.'],
  ['Chen Wei', 'Learning app', 'Cross-platform learning app with offline mode.'],
  ['Fatima Zahra', 'Website chatbot', 'Chatbot for patient triage on our website.'],
  ['Noah Williams', 'Team augmentation', 'Engineering team augmentation for 6 months.'],
  ['Layla Hassan', 'Market data dashboard', 'Real-time market data dashboard.'],
  ['Ethan Brooks', 'Warehouse scanning app', 'Warehouse scanning app for Android handhelds.'],
  ['Sofia Rossi', 'Recommendation engine', 'Recommendation engine for our online boutique.'],
  ['Arjun Mehta', 'DevOps pipelines', 'Cloud cost optimisation and DevOps pipelines.'],
  ['Grace Lee', 'Data warehouse', 'Data warehouse for multi-clinic reporting.'],
  ['Yusuf Karim', 'CRM integration', 'CRM integration for our agents.'],
  ['Olivia Brown', 'Course launch content', 'Content series for our course launch.'],
  ['Ali Raza', 'Predictive ETA', 'Predictive ETA service for last-mile delivery.'],
  ['Isabella Clark', 'PCI-DSS assessment', 'PCI-DSS readiness assessment.'],
  ['Kenji Tanaka', 'Inventory forecasting', 'Inventory forecasting with ML.'],
  ['Zara Ahmed', 'Telehealth web app', 'Telehealth web app with video consultations.'],
]

const statuses = ['new', 'new', 'contacted', 'in_progress', 'closed']

export const inquiriesMock = people.map(([full_name, subject, message], i) => {
  const received_at = hoursAgo(i * 17 + 2)
  const status = statuses[i % statuses.length]
  return {
    id: i + 1,
    full_name,
    phone: `+994 10 ${String(200 + i * 7).padStart(3, '0')} ${String(1000 + i * 131).slice(0, 4)}`,
    email: `${full_name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
    subject,
    message,
    status,
    is_read: status !== 'new',
    received_at,
    updated_at: received_at,
  }
})
