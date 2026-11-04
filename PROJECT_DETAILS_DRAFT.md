# Intellivex — Project Details Content (Draft)

Source: `Intellivex Project Details Content.docx` (Downloads). Draft only — nothing in the website code has been changed or deleted yet.

The portfolio PDF had 50 projects; the 4 Sundar STEM and 10 Namal projects are dropped, leaving **36**. Each entry below fills one Project Details page.

## Field mapping (page element → field)

| Page element | Field |
|---|---|
| Big heading ("Best Features Provided By Intellivex") | **Title** — the `highlight` part goes in the blue accent colour |
| Paragraph under the heading | **Intro** |
| "Client / Industry" pill | **Client / Industry** |
| Three grey pills | **Tags** (3) |
| "The challenge of project" + 4 ticks | **Challenge** + 4 checklist points |
| "Case Studies" + 2 paragraphs | **Solution** (para 1) + **Results** (para 2) |

## Overview

| # | Category | Title (highlight in **bold**) | Client |
|---|---|---|---|
| 01 | Web & Enterprise Software | Unified Workspace for **Programme Operations** | UNDP – MAGP |
| 02 | Web & Enterprise Software | Website for an Education **Reform Network** | Progressive Education Network (PEN) |
| 03 | Web & Enterprise Software | One Dashboard for Every **Customer Channel** | Chughtai Lab |
| 04 | Web & Enterprise Software | Freight Dispatch & **Logistics Platform** | Nexus Dispatch Services |
| 05 | Web & Enterprise Software | Donation-Ready Website for a **Hunger Relief Mission** | Alimentando a México |
| 06 | Web & Enterprise Software | Safe Online Space for **Social Advocacy** | Manzana Roja |
| 07 | Web & Enterprise Software | Clinic Management Software for **Eye Care** | Laser Eye Clinic |
| 08 | Web & Enterprise Software | Cloud Order Management for **Multi-Region Sales** | OrderMeg |
| 09 | E-Commerce & UI/UX Design | Shopify Storefront for a **Gifting & Floral Brand** | ArtInk |
| 10 | E-Commerce & UI/UX Design | Digital Experience Design for a **Vinyl Record Store** | Nivessa |
| 11 | E-Commerce & UI/UX Design | Culturally Aware Design for a **Matchmaking App** | Sharafayn |
| 12 | Mobile Applications | B2B Wholesale Ordering **App** | Pak Traders |
| 13 | Mobile Applications | Digital Health Camp & **Dispensary System** | Amin Welfare |
| 14 | Mobile Applications | Offline Maternal Care App for **Field Health Workers** | SEP Maternal Care Program |
| 15 | Mobile Applications | Smart Home **Control App** | Smartin |
| 16 | Mobile Applications | Health Engagement App for a **WASH Study** | UNDP |
| 17 | Mobile Applications | Preschool Management & **Parent Communication App** | MinFörskola |
| 18 | Mobile Applications | Maternal Health Companion for **Rural Communities** | UNDP |
| 19 | Cloud, Network & Installation | Computer Labs for **Under-Resourced Schools** | Progressive Education Network (PEN) |
| 20 | Cloud, Network & Installation | AWS Migration for CRM & **Billing Systems** | Nexus Dispatch Services |
| 21 | Surveys & Call Centre | Water, Sanitation & Hygiene **Behaviour Study** | UNDP |
| 22 | Surveys & Call Centre | Automated Citizen Feedback During **COVID-19** | UNDP |
| 23 | Surveys & Call Centre | Measuring Development Impact in the **Merged Areas** | UNDP – MAGP |
| 24 | Surveys & Call Centre | Flood Impact Assessment Across **14 Districts** | UNDP |
| 25 | Surveys & Call Centre | Evidence for Programme Decisions: **Sector Surveys** | UNDP |
| 26 | Surveys & Call Centre | Keeping Children in School: **Education Outreach** | Oxford Policy Management (OPM) |
| 27 | Surveys & Call Centre | Citizen Trust in **Public Services** | PCNA ISU, P&D Dept, FATA Secretariat |
| 28 | Surveys & Call Centre | Evaluating Energy, Skills & **Governance Programmes** | MAGP, Govt of Khyber Pakhtunkhwa |
| 29 | Surveys & Call Centre | Large-Scale **Governance Feedback Survey** | P&D Dept, FATA Secretariat & Govt of KP |
| 30 | Surveys & Call Centre | Youth Skills & Employability **Baseline Study** | Liaison Corporation |
| 31 | Surveys & Call Centre | Call Centre Setup & Customer **Satisfaction Survey** | Fly Makkah |
| 32 | Surveys & Call Centre | Integrated Call Centre, ERP & **Mobile App** | Techno Coast |
| 33 | Performance Marketing & Growth | 3.5x Return on Ad Spend for an **Online Gift Store** | Artink.pk |
| 34 | Performance Marketing & Growth | Lead Generation for an **Education Non-Profit** | Progressive Education Network (PEN) |
| 35 | Performance Marketing & Growth | Building Brand Trust for a **Cable Manufacturer** | Pakistan Cables Limited |
| 36 | Performance Marketing & Growth | Boosting Online Sales for a **Footwear Brand** | CAT Footwear Pakistan |

## Live CMS match (checked 2026-10-30)

Live API (`/api/admin/projects`) has **51 published projects**. Match against the 36 in this doc:

**A. Update existing live project (27)**

| Doc # | New title | Live ID | Current live title |
|---|---|---|---|
| 01 | Unified Workspace for Programme Operations | 19 | MAGP Collab – Team & Operations Management Tool |
| 02 | Website for an Education Reform Network | 43 | Progressive Education Network (PEN) – Educational Non-Profit Website |
| 03 | One Dashboard for Every Customer Channel | 20 | Unified CRM System for Chughtai Lab |
| 04 | Freight Dispatch & Logistics Platform | 17 | Nexus Dispatch Services – Logistics & Freight Dispatch Platform |
| 05 | Donation-Ready Website for a Hunger Relief Mission | 49 | Alimentando - A México WordPress Website Development |
| 06 | Safe Online Space for Social Advocacy | 37 | Manzana Roja - Website Development |
| 07 | Clinic Management Software for Eye Care | 23 | Laser Eye Clinic Management Software (LECMS) |
| 08 | Cloud Order Management for Multi-Region Sales | 36 | OrderMeg |
| 09 | Shopify Storefront for a Gifting & Floral Brand | 53 | ArtInk – Shopify-Based Gifting & Floral E-Commerce Platform |
| 10 | Digital Experience Design for a Vinyl Record Store | 58 | Nivessa Website *(or 42)* |
| 11 | Culturally Aware Design for a Matchmaking App | 38 | Sharafayn – UI/UX Design *(or 28)* |
| 12 | B2B Wholesale Ordering App | 27 | Pak Traders – B2B Wholesale & Retail Marketplace |
| 14 | Offline Maternal Care App for Field Health Workers | 24 | SEP Maternal Care App |
| 15 | Smart Home Control App | 25 | Smartin Home Automation App |
| 16 | Health Engagement App for a WASH Study | 10 | Sehat App – MAGP WASH KAP Study |
| 17 | Preschool Management & Parent Communication App | 30 | MinFörskola – Smart Preschool Management System |
| 19 | Computer Labs for Under-Resourced Schools | 41 | Computer Labs Installation for PEN |
| 20 | AWS Migration for CRM & Billing Systems | 29 | AWS Cloud Migration for CRM & Billing System – Nexus Dispatch |
| 24 | Flood Impact Assessment Across 14 Districts | 9 | Citizen Consultation Survey – Flood Impact Assessment |
| 27 | Citizen Trust in Public Services | 14 | Citizen Trust Survey – Khyber Pakhtunkhwa & FATA |
| 28 | Evaluating Energy, Skills & Governance Programmes | 11 | Telephonic Surveys – UNDP MAGP Special Emphasis Programmes (SEPs) |
| 31 | Call Centre Setup & Customer Satisfaction Survey | 51 | Call Center for Fly Makkah in Burewala |
| 32 | Integrated Call Centre, ERP & Mobile App | 26 | Techno Coast - Integrated Call Center & ERP Deployment |
| 33 | 3.5x Return on Ad Spend for an Online Gift Store | 54 | Artink.pk's - Performance Marketing |
| 34 | Lead Generation for an Education Non-Profit | 33 | Lead Generation for PEN |
| 35 | Building Brand Trust for a Cable Manufacturer | 32 | Pakistan Cables – Social Media Performance Marketing |
| 36 | Boosting Online Sales for a Footwear Brand | 35 | Performance Marketing Campaign for CAT Footwear Pakistan |

**B. New — not on live yet (9):** 13 Digital Health Camp & Dispensary System (Amin Welfare) · 18 Maternal Health Companion for Rural Communities (UNDP) · 21 Water, Sanitation & Hygiene Behaviour Study (UNDP) · 22 Automated Citizen Feedback During COVID-19 (UNDP) · 23 Measuring Development Impact in the Merged Areas (UNDP – MAGP) · 25 Evidence for Programme Decisions: Sector Surveys (UNDP) · 26 Keeping Children in School: Education Outreach (OPM) · 29 Large-Scale Governance Feedback Survey (P&D / FATA) · 30 Youth Skills & Employability Baseline Study (Liaison Corporation)

**C. Live but not in this doc (24) — leave as is, nothing deleted:**
- Sundar STEM / Namal (doc says removed): 48, 22, 34, 16, 52, 18, 47, 21, 50, 45, 46, 40, 31, 13
- Possible duplicates of doc projects: 15 Chughtais CRM, 42 Nivessa E-Commerce Platform, 28 Sharafayn Matchmaking Platform, 39 UI/UX Design for Smartin, 44 CAT Footwear Pakistan (Web Dev)
- Other: 12 Artlink - UI/UX Design, 59 Pre-K Math App, 56 Dots and Boxes, 57 Speedy Knowledge, 55 Tics Tacs and Toes

---

# Web & Enterprise Software

## 01. Unified Workspace for Programme Operations
- **Highlight:** Programme Operations
- **Intro:** A central operations platform that brings a development programme's tasks, finances, hiring and documents into one secure workspace.
- **Client / Industry:** UNDP – MAGP · International Development
- **Tags:** Web Application · Workflow Automation · Dashboards
- **Challenge:** The programme team ran its work across scattered tools and manual processes. Tracking tasks, budgets and approvals was slow, and accountability was hard to maintain.
  - Centralise team collaboration
  - Digitise manual workflows
  - Control access by role
  - Report on team performance
- **Solution:** We built a modular platform on PHP (CodeIgniter) and MySQL with role-based access control. Modules cover task management, financial dashboards, recruitment and procurement workflows, calendar scheduling and secure file sharing.
- **Results:** The team now coordinates projects from a single system. Clearer reporting has improved accountability and strengthened internal governance.

## 02. Website for an Education Reform Network
- **Highlight:** Reform Network
- **Intro:** The official website for a non-profit working to improve public education across Pakistan.
- **Client / Industry:** Progressive Education Network (PEN) · Non-Profit Education
- **Tags:** Website Development · Data Visualisation · UX
- **Challenge:** The organisation runs school adoption, digital learning and intervention programmes. It needed one clear place to explain them to donors, partners and the public.
  - Explain programmes clearly
  - Make navigation simple
  - Present impact data
  - Strengthen donor relationships
- **Solution:** We built the website with PHP (CodeIgniter) and JavaScript, using ApexCharts for data visualisation. Responsive design keeps it easy to use on any device.
- **Results:** The site gives the organisation a central online presence, strengthening stakeholder communication and donor engagement across the country.

## 03. One Dashboard for Every Customer Channel
- **Highlight:** Customer Channel
- **Intro:** A CRM that unifies a diagnostic lab's customer service channels into one real-time dashboard.
- **Client / Industry:** Chughtai Lab · Healthcare & Diagnostics
- **Tags:** CRM System · System Integration · Automated Reporting
- **Challenge:** The customer relations team worked across several disconnected systems. That slowed responses and gave managers no single view of performance.
  - Remove operational silos
  - Sync data in real time
  - Automate reporting
  - Speed up customer responses
- **Solution:** We integrated NEXUS, Home Sampling, WhatsApp Business and Aheeva CCS into a single dashboard. Automated reporting, live data sync and performance monitoring tools keep the team and its managers aligned.
- **Results:** The department now responds faster, with clearer oversight and better insight from unified reports, which has improved the customer experience.

## 04. Freight Dispatch & Logistics Platform
- **Highlight:** Logistics Platform
- **Intro:** A dispatch management system that helps a logistics company plan loads, optimise routes and track shipments in real time.
- **Client / Industry:** Nexus Dispatch Services · Logistics & Freight
- **Tags:** Management System · Real-Time Tracking · Dashboards
- **Challenge:** Dispatch work relied on manual coordination, so the team struggled to keep loads, routes and drivers in sync around the clock.
  - Digitise dispatch workflows
  - Manage loads efficiently
  - Optimise routes
  - Track shipments 24/7
- **Solution:** We built the platform on PHP (CodeIgniter) with a dynamic JavaScript front end and ApexCharts visualisations. It supports load management, route optimisation and live tracking on any device.
- **Results:** Coordination has improved, and real-time data gives the team full visibility, making dispatch operations easier to scale.

## 05. Donation-Ready Website for a Hunger Relief Mission
- **Highlight:** Hunger Relief Mission
- **Intro:** A multilingual WordPress website that tells a food-security charity's story and makes donating simple.
- **Client / Industry:** Alimentando a México · Non-Profit
- **Tags:** WordPress · UX/UI Design · Donation Integration
- **Challenge:** The charity needed to explain its mission and programmes clearly, reach a multilingual audience and accept donations securely online.
  - Tell the mission's story
  - Support multiple languages
  - Accept donations securely
  - Perform well on mobile
- **Solution:** We designed and developed a storytelling-led WordPress site with multilingual setup, an integrated donation gateway, and blog and news sections. Performance tuning keeps it fast on every device.
- **Results:** The site has boosted awareness and community engagement, and makes it easy for supporters to contribute.

## 06. Safe Online Space for Social Advocacy
- **Highlight:** Social Advocacy
- **Intro:** A privacy-focused platform that raises awareness of sexual abuse and gives survivors access to education and support.
- **Client / Industry:** Manzana Roja · Social Advocacy
- **Tags:** Web Platform · Data Visualisation · Privacy by Design
- **Challenge:** The organisation needed a trustworthy place to share sensitive resources, real stories and research, while protecting visitors' privacy.
  - Protect visitor privacy
  - Share research data clearly
  - Make resources easy to find
  - Support awareness campaigns
- **Solution:** We built the platform with PHP (CodeIgniter) and JavaScript, using ApexCharts to make research statistics easy to understand. It includes educational resources, real-life stories, legal information and interactive campaigns.
- **Results:** The result is a secure, informative space that supports advocacy and community engagement.

## 07. Clinic Management Software for Eye Care
- **Highlight:** Eye Care
- **Intro:** A complete management system that streamlines patient care, scheduling, billing and stock for a laser eye clinic.
- **Client / Industry:** Laser Eye Clinic · Healthcare
- **Tags:** Management System · Patient Records · Billing
- **Challenge:** Clinical and administrative work was handled through separate, manual processes, which made records and finances harder to manage accurately.
  - Manage patient records
  - Simplify appointment booking
  - Track billing accurately
  - Monitor inventory
- **Solution:** We built a secure, scalable system with modules for patients, appointments, billing, inventory, reporting and user access control.
- **Results:** The clinic now runs more efficiently, with automated workflows, accurate financial tracking and better-organised patient records.

## 08. Cloud Order Management for Multi-Region Sales
- **Highlight:** Multi-Region Sales
- **Intro:** A cloud-native SaaS platform that digitises order intake, tracking and fulfilment for businesses selling across several regions.
- **Client / Industry:** OrderMeg · SaaS & Retail Distribution
- **Tags:** SaaS Platform · REST APIs · Analytics
- **Challenge:** Businesses operating in many regions needed one reliable system to sync orders in real time and connect with their existing tools.
  - Sync orders in real time
  - Keep each client's data separate
  - Integrate POS, CRM and WhatsApp
  - Analyse sales by location
- **Solution:** We engineered a modular, multi-tenant platform with secure RESTful APIs and an event-driven architecture. It includes role-based access, dynamic dashboards and ready-made integrations for POS, CRM, WhatsApp and logistics systems.
- **Results:** Clients gain real-time performance monitoring and location-based analytics, improving transparency and sales across their markets.

---

# E-Commerce & UI/UX Design

## 09. Shopify Storefront for a Gifting & Floral Brand
- **Highlight:** Gifting & Floral Brand
- **Intro:** A visually rich Shopify store that pairs artistic product presentation with a fast, simple checkout.
- **Client / Industry:** ArtInk · Retail & E-Commerce
- **Tags:** Shopify Development · UI/UX Design · E-Commerce
- **Challenge:** The brand wanted an online store that felt as artistic as its products, while handling catalogue, orders and promotions smoothly as sales grew.
  - Showcase products beautifully
  - Simplify the buying journey
  - Manage stock and orders easily
  - Scale with growing demand
- **Solution:** We ran the full UX process, from user research and personas to wireframes, prototypes and usability testing. We then built the Shopify store with a structured catalogue, secure checkout, customer accounts, order tracking and campaign tools, in a minimalist design that puts product photography first.
- **Results:** The store gives shoppers a smooth, elegant experience. Engagement and navigation have improved, and the brand is well placed to grow in a competitive market.

## 10. Digital Experience Design for a Vinyl Record Store
- **Highlight:** Vinyl Record Store
- **Intro:** A complete UI/UX redesign that gives a Los Angeles vinyl record store a modern, mobile-first online identity.
- **Client / Industry:** Nivessa · Music Retail
- **Tags:** UI/UX Design · Design System · Mobile-First
- **Challenge:** The store needed a fresh digital identity that made browsing records enjoyable on any screen and reflected the character of the brand.
  - Map the customer journey
  - Design mobile-first
  - Create a consistent design system
  - Modernise the brand identity
- **Solution:** We mapped user journeys, created wireframes and interactive prototypes, and planned the experience for mobile first. A unified design system ties every screen together.
- **Results:** The result is a balanced, intuitive and responsive interface that is easier to use and more engaging for shoppers.

## 11. Culturally Aware Design for a Matchmaking App
- **Highlight:** Matchmaking App
- **Intro:** A respectful, privacy-first user experience for a community-focused matchmaking platform.
- **Client / Industry:** Sharafayn · Social & Community Apps
- **Tags:** UI/UX Design · Privacy-Focused UX · Flutter
- **Challenge:** The app had to feel modern and easy to use while respecting cultural values and keeping users' personal information protected.
  - Respect cultural values
  - Simplify onboarding
  - Put privacy first
  - Stay consistent across platforms
- **Solution:** We designed culturally respectful visuals, streamlined onboarding and privacy-focused interactions. The design follows accessibility standards and is tailored for Flutter, so it stays consistent across iOS and Android.
- **Results:** The final design is secure, elegant and intuitive. It builds user trust and supports genuine engagement.

---

# Mobile Applications

## 12. B2B Wholesale Ordering App
- **Highlight:** App
- **Intro:** A mobile marketplace that connects retailers with suppliers across Pakistan for simple, fast wholesale buying.
- **Client / Industry:** Pak Traders · Wholesale & Retail
- **Tags:** Flutter App · Node.js Backend · Marketplace
- **Challenge:** Retailers needed an easier way to compare wholesale prices, place orders and track deliveries without long phone calls and paperwork.
  - Give access to wide catalogues
  - Offer wholesale pricing
  - Track orders in real time
  - Take payments securely
- **Solution:** We built the app in Flutter (Dart), with a Node.js and Express.js back end and a MongoDB database. It includes live order tracking, secure payments, wholesale pricing management and a streamlined ordering flow.
- **Results:** Retailers can now browse large catalogues, order at competitive prices and get next-day delivery, which simplifies procurement and strengthens the supply chain.

## 13. Digital Health Camp & Dispensary System
- **Highlight:** Dispensary System
- **Intro:** A mobile and web system that helps an NGO deliver and record healthcare in underserved rural areas of Sindh.
- **Client / Industry:** Amin Welfare · Healthcare NGO
- **Tags:** Mobile App · Web Dashboard · Offline-First
- **Challenge:** Medical teams in remote villages worked with paper records, weak internet and limited stock visibility, making continuity of care difficult.
  - Work offline in remote areas
  - Support English, Urdu and Sindhi
  - Track medicine stock
  - Keep patient data secure
- **Solution:** We combined a mobile app for doctors, dispensers and social workers with a web dashboard for administrators. It records consultations, diagnoses and prescriptions, tracks referrals, monitors mother and child health with vaccination schedules, and sends stock alerts. Offline mode syncs automatically once a connection is available.
- **Results:** Records are now more accurate and accountability has improved. Patients in remote regions receive more consistent care.

## 14. Offline Maternal Care App for Field Health Workers
- **Highlight:** Field Health Workers
- **Intro:** An Android app that helps health workers monitor pregnancies and manage referrals in remote parts of Khyber Pakhtunkhwa.
- **Client / Industry:** SEP Maternal Care Program · Public Health
- **Tags:** Android App · Offline-First · EMR
- **Challenge:** Health workers in low-resource areas needed a reliable way to record patient data and spot high-risk pregnancies, often without internet access.
  - Work without internet
  - Keep medical records secure
  - Flag high-risk pregnancies
  - Simplify referrals
- **Solution:** We built an offline-first Android app with secure electronic medical records, role-based screens, risk assessment tools, referral workflows and educational audio content.
- **Results:** Data collection is now structured, risk monitoring has improved, and referrals move faster, strengthening care in low-resource settings.

## 15. Smart Home Control App
- **Highlight:** Control App
- **Intro:** An IoT mobile app that lets homeowners control lighting, climate and security from their phone.
- **Client / Industry:** Smartin · Smart Home & IoT
- **Tags:** IoT Development · Mobile App · UI/UX Design
- **Challenge:** Home automation is often complex to set up and use. The client wanted control to feel simple for every member of the household.
  - Control devices remotely
  - Make device pairing easy
  - Keep connections secure
  - Help save energy
- **Solution:** We integrated ESP8266 and ESP32 microcontrollers for real-time control and scalable connectivity, with secure architecture and energy optimisation. A user-centred design keeps navigation clear and pairing straightforward.
- **Results:** Users can now manage their homes remotely with custom automation settings, in an app that is easy to use and supports energy-efficient living.

## 16. Health Engagement App for a WASH Study
- **Highlight:** WASH Study
- **Intro:** An Android app that delivered health messages and collected daily data from participants in a UNDP-funded hygiene study.
- **Client / Industry:** UNDP · International Development & Public Health
- **Tags:** Android App · Push Notifications · Data Collection
- **Challenge:** The study needed to reach participants with targeted messages and gather reliable daily data, even where connectivity was poor.
  - Send targeted messages
  - Support several languages
  - Collect daily health reports
  - Work in low-connectivity areas
- **Solution:** We built push notifications for text, image, video and audio, with user segmentation and a multilingual interface. The app also includes consent-based GPS tracking, daily health reports and built-in surveys.
- **Results:** The app became a core part of the study, supporting health communication, behaviour tracking, COVID-19 symptom reporting and data-driven evaluation.

## 17. Preschool Management & Parent Communication App
- **Highlight:** Parent Communication App
- **Intro:** A full-stack app that connects preschool teachers, administrators and parents in one secure place.
- **Client / Industry:** MinFörskola · Education Technology
- **Tags:** React Native · Firebase · EdTech
- **Challenge:** Staff spent too much time on attendance, updates and scheduling, and parents wanted a clearer view of their child's day.
  - Digitise attendance
  - Share photos and updates
  - Notify parents instantly
  - Protect children's data
- **Solution:** We built the app in React Native with REST APIs (Node.js/Django) and Firebase for authentication, storage, database and notifications. Modules cover attendance, media documentation, scheduling, parent messaging and offline caching.
- **Results:** The preschool now has real-time communication, central child records and digital attendance, with stronger privacy and smoother coordination.

## 18. Maternal Health Companion for Rural Communities
- **Highlight:** Rural Communities
- **Intro:** A lightweight, culturally appropriate app that guides expectant mothers and connects them with local health workers.
- **Client / Industry:** UNDP · Maternal & Child Health
- **Tags:** Mobile App · Offline Access · Low-Literacy Design
- **Challenge:** Women in Pakistan's merged areas faced barriers to reliable pregnancy information and care. Many had low literacy and limited internet access.
  - Design for low-literacy users
  - Work offline
  - Connect mothers with health workers
  - Respect local culture
- **Solution:** We built pregnancy tracking, appointment reminders, health alerts and education on nutrition and child health. Dashboards help programme managers monitor engagement and outcomes, and the lightweight design runs well on basic phones.
- **Results:** Mothers now have better access to maternal health information, which has encouraged earlier care-seeking and more informed decisions.

---

# Cloud, Network & Installation

## 19. Computer Labs for Under-Resourced Schools
- **Highlight:** Under-Resourced Schools
- **Intro:** Fully equipped computer labs that bring digital learning to students in schools with limited resources.
- **Client / Industry:** Progressive Education Network (PEN) · Education
- **Tags:** IT Installation · LAN Setup · Digital Literacy
- **Challenge:** Many partner schools had no working computer facilities, so students missed out on basic digital skills.
  - Set up reliable networks
  - Install computers and devices
  - Plan power backup
  - Build labs that last
- **Solution:** We handled structured cabling, LAN deployment, installation of computers and network devices, secure configuration and power backup planning. Every system was tested and tuned for long-term use.
- **Results:** Thousands of students now have access to computer-based learning, and the schools are better equipped for modern teaching.

## 20. AWS Migration for CRM & Billing Systems
- **Highlight:** Billing Systems
- **Intro:** An end-to-end move of legacy on-premise CRM and billing systems to a managed AWS cloud environment.
- **Client / Industry:** Nexus Dispatch Services · Logistics
- **Tags:** AWS Migration · Amazon RDS & S3 · Cost Analysis
- **Challenge:** Ageing on-premise systems limited performance and growth. The business needed to move critical customer and billing data safely, without disrupting operations.
  - Migrate data securely
  - Avoid service downtime
  - Forecast cloud costs
  - Improve performance
- **Solution:** We started with a pre-migration assessment and long-term cost forecast. We then moved customer and billing data to Amazon RDS and Amazon S3 with near-zero downtime, and delivered a migration strategy report, security compliance documents and a post-migration cost-performance analysis.
- **Results:** The systems are now faster, more reliable and easier to scale, with clear visibility of cloud spending.

---

# Surveys & Call Centre Solutions

## 21. Water, Sanitation & Hygiene Behaviour Study
- **Highlight:** Behaviour Study
- **Intro:** A large Knowledge, Attitudes and Practices (KAP) study on water, sanitation and hygiene, designed to guide behaviour-change and public health work.
- **Client / Industry:** UNDP · International Development & Public Health
- **Tags:** Digital Surveys · Behavioural Research · Live Dashboards
- **Challenge:** UNDP needed reliable evidence on community hygiene habits, and a way to test whether behavioural messages actually changed them.
  - Build and pilot valid tools
  - Survey thousands of respondents
  - Test behavioural messaging
  - Deliver analysis-ready data
- **Solution:** After developing and piloting the survey tools, we ran a baseline survey of 4,000 respondents, delivered behavioural messaging interventions, and followed up with a 4,000-person midline survey. The study also used game-based data collection, snowball-sampled business listings and telephone interviews.
- **Results:** Our custom survey platform with phone integration, live dashboards and built-in QA checks produced accurate, analysis-ready datasets for the programme.

## 22. Automated Citizen Feedback During COVID-19
- **Highlight:** COVID-19
- **Intro:** Large-scale robocall surveys that captured rapid public feedback on the pandemic's impact to inform timely policy decisions.
- **Client / Industry:** UNDP · Governance & Public Policy
- **Tags:** Robocall Surveys · Voice Automation · Live Analytics
- **Challenge:** During the pandemic, decision-makers needed fast, wide-reaching citizen input. Traditional surveys were too slow and face-to-face contact was restricted.
  - Reach citizens at scale
  - Survey in several languages
  - Collect data quickly
  - Report results in real time
- **Solution:** We ran automated mass outreach using multilingual voice-based survey modules to capture citizens' experiences during pandemic disruptions.
- **Results:** Our robocall infrastructure handled more than 250,000 automated calls per day, with automatic response recording, live dashboards and structured data exports for reporting.

## 23. Measuring Development Impact in the Merged Areas
- **Highlight:** Merged Areas
- **Intro:** Eleven specialised telephone surveys that measured the results of development programmes in Energy, Skills, Mining and Governance.
- **Client / Industry:** UNDP – MAGP · International Development
- **Tags:** Telephonic Surveys · Impact Evaluation · QA Monitoring
- **Challenge:** The programme needed trustworthy data on whether its interventions were working, collected inclusively across a large and remote region.
  - Run baseline, midline and endline rounds
  - Include women respondents fairly
  - Train enumerators well
  - Protect data quality
- **Solution:** We ran 11 surveys over three phases, with gender-sensitive participation strategies, structured enumerator training, pilot testing and ongoing quality supervision.
- **Results:** Our telephone survey system provided automated dialling, multilingual questionnaires, real-time incentive payments, live monitoring and QA validation, so every phase produced reliable results.

## 24. Flood Impact Assessment Across 14 Districts
- **Highlight:** 14 Districts
- **Intro:** A telephone survey of 12,000 people that gave UNDP citizen-level data to plan flood recovery in Khyber Pakhtunkhwa's Merged Areas.
- **Client / Industry:** UNDP · Disaster Recovery & Development
- **Tags:** Telephonic Surveys · Large-Scale Data · Live Monitoring
- **Challenge:** After the floods, recovery planners needed fast, accurate information from affected households across 14 districts.
  - Reach 12,000 respondents
  - Run three questionnaire versions
  - Maintain strict quality checks
  - Give the client live access
- **Solution:** We completed 4,000 interviews for each of three questionnaire variants (A, B and C). The process included pilot testing, enumerator training, structured QA review and live monitoring access for UNDP representatives.
- **Results:** Our survey platform, supervision dashboards and export tools delivered clean datasets ready to inform recovery and rehabilitation planning.

## 25. Evidence for Programme Decisions: Sector Surveys
- **Highlight:** Sector Surveys
- **Intro:** A series of 11 telephone surveys under UNDP's Merged Areas Governance Programme, producing impact data to international standards.
- **Client / Industry:** UNDP · International Development
- **Tags:** Proprietary Survey Software · Impact Evaluation · Reporting
- **Challenge:** Programme managers needed high-quality datasets and clear reporting to judge progress across four sectors over several years.
  - Cover four key sectors
  - Track change over time
  - Ensure inclusive sampling
  - Report to international standards
- **Solution:** Using our own survey software, with automated dialling, multilingual questionnaires, live monitoring and validation, we ran surveys in Energy & Power, Skills Development, Mines & Minerals and Governance across baseline, midline and endline phases.
- **Results:** The project delivered high-quality datasets, impact insights and structured reports aligned with international development standards.

## 26. Keeping Children in School: Education Outreach
- **Highlight:** Education Outreach
- **Intro:** A multi-channel engagement programme that helped reduce school dropouts after grade five in District Chiniot.
- **Client / Industry:** Oxford Policy Management (OPM) · Education & Research
- **Tags:** CATI Surveys · SMS & WhatsApp Outreach · Behaviour Change
- **Challenge:** Many students in the district left school after grade five. The programme needed to find at-risk families and encourage them to keep children enrolled.
  - Identify at-risk families
  - Reach parents on several channels
  - Escalate high-risk cases
  - Track enrolment decisions
- **Solution:** We used CATI telephone surveys to identify at-risk families, followed by targeted robocalls, WhatsApp messages and SMS reminders. High-risk cases were escalated and followed up, with script checks, live monitoring, automated validation and secure data handling throughout.
- **Results:** The project reached more than 200 families and strengthened their intent to keep children in school. OPM formally recognised the team for effective implementation.

## 27. Citizen Trust in Public Services
- **Highlight:** Public Services
- **Intro:** A 16,000-interview telephone survey measuring how citizens in Khyber Pakhtunkhwa and FATA view government service delivery.
- **Client / Industry:** PCNA Implementation Support Unit, P&D Department, FATA Secretariat · Government
- **Tags:** Telephonic Surveys · Quota Sampling · Incentive Automation
- **Challenge:** The government needed a fair, representative picture of public trust across many tehsils and frontier regions to improve its governance models.
  - Sample citizens fairly
  - Survey in local languages
  - Reward respondents instantly
  - Meet ethical standards
- **Solution:** We conducted 16,000 interviews using random mobile subscriber selection and geographic quotas for proportional representation. Respondents chose their preferred language and received incentives as soon as they finished.
- **Results:** Automated dialling, live supervision dashboards, telecom balance-transfer APIs for incentives and call recording for compliance kept the project accurate and transparent.

## 28. Evaluating Energy, Skills & Governance Programmes
- **Highlight:** Governance Programmes
- **Intro:** Structured telephone surveys that evaluated Special Emphasis Programmes under the Accelerated Implementation Programme (AIP I & II).
- **Client / Industry:** Merged Areas Governance Programme (MAGP), Government of Khyber Pakhtunkhwa · Government
- **Tags:** Programme Evaluation · Telephonic Surveys · Data Validation
- **Challenge:** The government needed evidence on whether off-grid solar, youth skills, mining livelihoods and district governance initiatives were delivering results.
  - Assess off-grid solar projects
  - Review youth skills training
  - Study mining livelihoods
  - Gauge citizen engagement
- **Solution:** We designed and ran surveys for each intervention area, supported by real-time monitoring and validation checks.
- **Results:** The validated datasets and insights now support MAGP's planning and programme refinement, strengthening accountability and informing policy across the Merged Areas.

## 29. Large-Scale Governance Feedback Survey
- **Highlight:** Governance Feedback Survey
- **Intro:** A proactive survey of around 16,000 citizens that helped government stakeholders review and strengthen service delivery.
- **Client / Industry:** P&D Department, FATA Secretariat & Government of Khyber Pakhtunkhwa · Government
- **Tags:** Call Centre Surveys · Survey App Development · Analytics
- **Challenge:** Officials needed direct citizen feedback across selected tehsils and sub-divisions to see where governance and services were working, and where they were not.
  - Identify active mobile users
  - Select respondents randomly
  - Record every response accurately
  - Deliver clear summary reports
- **Solution:** We identified active subscribers across telecom networks, selected respondents at random and ran structured interviews through our call centre. A dedicated survey application recorded each response and managed data collection.
- **Results:** The client received structured datasets, call recordings and summary reports to assess trust levels and target improvements in governance and accountability.

## 30. Youth Skills & Employability Baseline Study
- **Highlight:** Baseline Study
- **Intro:** A baseline survey assessing the education, skills and job readiness of 1,000 students across Balochistan.
- **Client / Industry:** Liaison Corporation · Research & Skills Development
- **Tags:** Baseline Research · CATI & Field Surveys · Data Cleaning
- **Challenge:** The client needed a reliable starting benchmark to design skills programmes, including for students in hard-to-reach rural districts.
  - Cover rural and urban districts
  - Reach remote students
  - Validate data every day
  - Set clear benchmarks
- **Solution:** We built a stratified sampling framework and combined CATI telephone interviews with field operations. Supervisors monitored interviews live, ran validation checks and cleaned data daily with range and logic checks.
- **Results:** The client received a clean, validated dataset and an analytical brief, giving it a strong evidence base for targeted skills programmes and future progress tracking.

## 31. Call Centre Setup & Customer Satisfaction Survey
- **Highlight:** Satisfaction Survey
- **Intro:** A fully operational 5-seat call centre in Burewala, plus a structured telephone survey of customer satisfaction.
- **Client / Industry:** Fly Makkah · Travel & Customer Service
- **Tags:** Call Centre Setup · Ticketing System · Customer Feedback
- **Challenge:** The company needed a dedicated team to handle customer queries efficiently, and better insight into how customers rated its service.
  - Set up a working call centre
  - Track every query to resolution
  - Survey 600 customers
  - Find areas to improve
- **Solution:** We set up the infrastructure, deployed the call-handling system, configured integrated ticketing and structured the query-resolution workflow. We then ran a telephone satisfaction survey with 600 respondents.
- **Results:** The company now runs an operational call centre with organised ticket management, and the survey findings are guiding improvements in customer service.

## 32. Integrated Call Centre, ERP & Mobile App
- **Highlight:** Mobile App
- **Intro:** A connected digital setup that combines an Android app, a full ERP platform and a VoIP call centre.
- **Client / Industry:** Techno Coast · Business Services
- **Tags:** ERP Development · VoIP Call Centre · Android App
- **Challenge:** Customer conversations, operations and data lived in separate systems, so information was often out of sync.
  - Build a full ERP platform
  - Launch an Android app
  - Deploy a VoIP call centre
  - Keep all data in sync
- **Solution:** We developed the Android app, engineered the ERP and deployed the VoIP call centre. The call centre connects directly to the ERP modules, so customer data, workflows and call records stay aligned in real time.
- **Results:** The unified system has improved efficiency, transparency and service continuity, and gives the business communication channels that can scale.

---

# Performance Marketing & Growth

## 33. 3.5x Return on Ad Spend for an Online Gift Store
- **Highlight:** Online Gift Store
- **Intro:** A performance marketing campaign that grew an e-commerce brand's traffic, conversions and ad returns within 60 days.
- **Client / Industry:** Artink.pk · Retail & E-Commerce
- **Tags:** Meta & Google Ads · A/B Testing · Landing Page Optimisation
- **Challenge:** The brand wanted faster online growth, but its ad spend was not turning into enough visits and sales.
  - Improve audience targeting
  - Optimise landing pages
  - Test ads systematically
  - Raise conversion rates
- **Solution:** We ran targeted campaigns on Meta and Google Ads, supported by landing page optimisation and structured A/B testing. Refined audience segments and creative storytelling strengthened the brand's positioning.
- **Results:** Within 60 days, the campaign achieved a 3.5x return on ad spend, a 180% increase in website traffic and a 40% rise in conversion rates.

## 34. Lead Generation for an Education Non-Profit
- **Highlight:** Education Non-Profit
- **Intro:** A focused Facebook lead campaign that grew a non-profit's supporter base and donor leads.
- **Client / Industry:** Progressive Education Network (PEN) · Non-Profit Education
- **Tags:** Facebook Lead Ads · Creative Design · Campaign Optimisation
- **Challenge:** The organisation wanted more supporters and donor leads, from people who genuinely care about public education.
  - Attract quality leads
  - Create persuasive ads
  - Place clear calls to action
  - Optimise continuously
- **Solution:** We used Facebook Lead Ads with persuasive creatives and well-placed calls to action. Ongoing optimisation and data monitoring kept targeting focused on the right audience.
- **Results:** The campaign expanded the supporter base, increased community engagement and delivered measurable growth in donor leads.

## 35. Building Brand Trust for a Cable Manufacturer
- **Highlight:** Cable Manufacturer
- **Intro:** A social media campaign that taught consumers how to spot genuine products and strengthened a leading brand's credibility.
- **Client / Industry:** Pakistan Cables Limited · Manufacturing & Electrical
- **Tags:** Social Media Marketing · Audience Segmentation · Visual Storytelling
- **Challenge:** Counterfeit products were a risk to the brand's reputation, so customers needed to learn how to identify authentic cables.
  - Educate on product authenticity
  - Target the right audiences
  - Tell the story visually
  - Track and improve reach
- **Solution:** We combined targeted advertising, audience segmentation and engaging visual storytelling, with continuous performance tracking to refine the campaign.
- **Results:** The campaign improved brand engagement and digital reach, supported lead generation and reinforced the company's position as a trusted name in electrical solutions.

## 36. Boosting Online Sales for a Footwear Brand
- **Highlight:** Footwear Brand
- **Intro:** A data-driven marketing campaign that increased traffic, engagement and online sales for an international footwear brand in Pakistan.
- **Client / Industry:** CAT Footwear Pakistan · Retail & Fashion
- **Tags:** Social Media Ads · Influencer Marketing · Seasonal Campaigns
- **Challenge:** The brand wanted stronger online visibility and sales, especially around key seasonal shopping periods.
  - Grow website traffic
  - Partner with influencers
  - Plan around seasonal sales
  - Optimise ads in real time
- **Solution:** We ran targeted social media ads and influencer collaborations, timed campaigns around seasonal sales events, and used analytics to monitor and adjust performance in real time.
- **Results:** The campaign increased website traffic, engagement and online sales, showing how creative storytelling and careful analysis work together.
