import { SITE_SERVICES, hoursAgo } from './helpers'

// Contact-form submissions (public site: /contact).
const people = [
  ['Sarah Mitchell', 'Brightline Health', 'We need a patient portal rebuilt with appointment booking.'],
  ['Omar Haddad', 'Nexa Pay', 'Looking for a mobile wallet MVP for iOS and Android.'],
  ['Emily Carter', 'UrbanNest Realty', 'Interested in an AI assistant for property listings.'],
  ['Daniel Kim', 'ShopSphere', 'Migrating our store to the cloud before Q4 traffic.'],
  ['Aisha Rahman', 'LearnLoop', 'Need analytics dashboards for student engagement.'],
  ['Lucas Moreau', 'Freightly', 'Route-optimisation model for our delivery fleet.'],
  ['Priya Nair', 'MedCore Labs', 'Security audit and HIPAA-aligned infrastructure review.'],
  ['James O’Connor', 'Vaultline Capital', 'Fraud detection pipeline on transaction data.'],
  ['Hannah Schulz', 'GreenCart', 'Marketing site redesign and headless CMS.'],
  ['Mateo García', 'Casa Prime', 'Virtual tour content and listing video production.'],
  ['Chen Wei', 'EduBridge', 'Cross-platform learning app with offline mode.'],
  ['Fatima Zahra', 'CareConnect', 'Chatbot for patient triage on our website.'],
  ['Noah Williams', 'Stackwise', 'Engineering team augmentation for 6 months.'],
  ['Layla Hassan', 'TradeNest', 'Real-time market data dashboard.'],
  ['Ethan Brooks', 'Parcelio', 'Warehouse scanning app for Android handhelds.'],
  ['Sofia Rossi', 'Moda Lane', 'Recommendation engine for our online boutique.'],
  ['Arjun Mehta', 'FinEdge', 'Cloud cost optimisation and DevOps pipelines.'],
  ['Grace Lee', 'Northwind Clinics', 'Data warehouse for multi-clinic reporting.'],
  ['Yusuf Karim', 'Keystone Estates', 'CRM integration for our agents.'],
  ['Olivia Brown', 'SkillForge', 'Content series for our course launch.'],
  ['Ali Raza', 'RouteMax', 'Predictive ETA service for last-mile delivery.'],
  ['Isabella Clark', 'PulsePay', 'PCI-DSS readiness assessment.'],
  ['Kenji Tanaka', 'Kaizen Retail', 'Inventory forecasting with ML.'],
  ['Zara Ahmed', 'MindWell', 'Telehealth web app with video consultations.'],
]

const statuses = ['new', 'new', 'contacted', 'in_progress', 'closed']

export const inquiriesMock = people.map(([name, company, message], i) => {
  const created_at = hoursAgo(i * 17 + 2)
  return {
    id: i + 1,
    name,
    email: `${name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    phone: `+1 (555) ${String(200 + i * 7).padStart(3, '0')}-${String(1000 + i * 131).slice(0, 4)}`,
    company,
    service: SITE_SERVICES[i % SITE_SERVICES.length],
    message,
    status: statuses[i % statuses.length],
    created_at,
    updated_at: created_at,
  }
})
