# IntelliVex Website — Client se Data Checklist

Frontend ka audit. Do hisse hain:
- **A. Missing / placeholder data** — jo abhi site par khali hai ya temporary hai.
- **B. Dynamic modules ki list** — jin ka content CMS (Admin panel) se aata hai; client se real data lena hai.

Note: Frontend "fallback-first" hai, yani API na ho to built-in copy dikhti hai. Neeche "Built-in copy" ka matlab hai ke abhi code mein likha hua text dikh raha hai, client se confirm/final karwana hai.

---

## A. Missing data (abhi site par hai hi nahi)

| # | Page / Section | Kya missing hai | Client se kya chahiye |
|---|---|---|---|
| 1 | **Partnerships → Technology & Strategic Partners** | Section hidden hai (description + logos khali) | Section description (2–3 lines) + partner logos (PNG/SVG, transparent) |
| 2 | **Partnerships → Partner / Integration Logos** | Section hidden hai (`items: []`) | 6 logos (3x2 grid) + har logo ka naam |
| 3 | **Partnerships → Success Stories** | `paragraphs: []` khali, image sirf placeholder (`story1.png`) | Success story ke paragraphs + real image |
| 4 | **Partnerships → Overview paragraphs** | `DEFAULT_PARTNERSHIP_DATA.paragraphs` khali | Partnership page ka overview text |
| 5 | **Partnerships → Technology Integrations video** | Video ki jagah static image (`suquare.png`) + play icon; koi real video nahi | Video file ya YouTube/Vimeo link + thumbnail |
| 6 | **Partnerships → Platforms & Technologies Supported** | Sirf 3 cards (Engineering, Mobile, Cloud) hardcoded | Final list of platforms/technologies + icons |
| 7 | **Footer → Social links** | Sab generic hain (`youtube.com`, `facebook.com`, `twitter.com`, `instagram.com`, `linkedin.com`) | Company ke asal social profile URLs |
| 8 | **Footer → "Help Center" link** | `#help` — koi page/section nahi | Help Center ka URL, ya link hatana hai (client decide kare) |
| 9 | **Contact page → Map** | Sirf ek static image (`map.png`) jo Google Maps search par jati hai | Exact office address/Google Maps link (ya embed link) |
| 10 | **Contact / Consultation → Phone, email, address** | Hardcoded: +994 10 243 9644 / 9645, info@theintellivex.com, Azure Business Center Baku | Confirm karwana: yeh final hain? Koi aur office/country? |
| 11 | **Contact form → dropdown options** (`SERVICE_OPTIONS`, `TIMELINE_OPTIONS`) | Hardcoded list | Final services list aur project timeline options |
| 12 | **Contact form → Privacy notice / Terms** | Checkbox "agree privacy notice" hai magar koi Privacy Policy page nahi | Privacy Policy (aur Terms) ka text/URL |
| 13 | **Home → Hero** | Heading, "10+ Years Of Experience", hero image sab hardcoded | Final hero headline, experience years, hero image/art |
| 14 | **Services detail → sub-services (e.g. Generative AI Consulting, AI Agents, AI Workshops…)** | Sub-service pages ka alag content nahi; sirf Data Science ka page (`/services/data-science`) bana hua hai | Har sub-service ke liye: intro, benefits, FAQs, image — ya confirm karein ke pills sirf labels hain |
| 15 | **Services detail → image** | Poore detail pages ek hi image use karte hain (`serviceDetail.png`) | Har service ki apni image |
| 16 | **Service icons (Game Development / Web)** | Game Development icon `cloud.png` (brain mark) use ho raha hai, naam mismatch | Final icons for all 6 services |
| 17 | **SEO** | Static pages (Home, About, Contact, Partnerships, Services-detail) ka meta title/description nahi | Har page ka SEO title + description + OG image |
| 18 | **Favicon / OG image / logo variants** | Sirf `logo.svg` | Favicon, social share image |
| 19 | **Section eyebrows** (small labels jaise "WHAT WE CAN DO", "FOCUSED", "LATEST WORK") | Code mein hardcoded, API mein field nahi, aur kuch copy placeholder jaisi lagti hai ("HOW IT WORK") | Client se final wording |
| 20 | **Language** | Sirf English | Agar Azerbaijani/doosri language chahiye to translations |

---

## B. Dynamic modules (CMS / Admin se manage hone wale) — client se data

Har module ke samne likha hai API endpoint, aur client se kya lena hai. Images ka size/format Admin specs (`Intellivex Admin/docs/`) ke mutabiq.

### 1. Services  — `GET /api/services`, `/api/services/{slug}`
Required: **6 top-level services** (Software Engineering, Mobile Development, Cloud & Cybersecurity, AI & Data Innovation, Web Development, Game Development).
Har service ke liye:
- Title + highlight phrase, slug, short description (card ke liye)
- Icon (white glyph) — Innovation card ko icon nahi chahiye
- Card variant (default / innovation), "Home par dikhao?" aur "Menu mein dikhao?"
- **Tags** (6–7 sub-service labels per service)
- Detail page: intro paragraphs (rich text), hero image, **Benefits** (description + items), **FAQs** (question/answer)
- Sub-services (agar alag pages chahiye): har ek ka same content
- Linked industries/projects (agar applicable)

Status: Built-in copy 6 services ki `data/serviceDetails.js` (2400 lines) mein hai — client se **review/approve** karwana hai.

### 2. Services Page content (single row) — `GET /api/services-page`
- Overview: eyebrow, heading + highlight, description (paragraphs), image + alt text
- "Our Services" section heading
- CTA banner (2 lines, description, button label + link)
- SEO

### 3. Home Page content (single row) — `GET /api/home-page`
- Key Differentiators: eyebrow, heading + highlight, description, **6 bullet items**
- "Our Services" heading
- CTA banner
- (Hero abhi API se nahi aata — upar A-13 dekhein)

### 4. About Page content (single row) — `GET /api/about-page`
- Company Overview: eyebrow, heading, paragraphs
- Trusted Partners card: title, description, rating (1–5), logo
- Vision & Mission: title, highlight, description (har ek)
- How We Deliver: heading, description, **exactly 3 steps** (title + description)
- Key Differentiators + CTA banner

### 5. Team (Our Leadership) — `GET /api/team-section`
- Section heading (eyebrow, title, highlight)
- **Maximum 3 featured members**: name, designation, photo (+ alt), initials, Facebook / Instagram / LinkedIn URLs (jo hon)
- (Zyada members chahiye to client se batayein — abhi site sirf 3 dikhati hai)

### 6. Portfolio (Projects) — `GET /api/portfolio-page`, `/api/projects`, `/api/projects/{slug}`
Page: heading, category pills, CTA, SEO.
Har project: title, slug, category, card image, short description, "Home par dikhao?", detail page — header info (client, industry, date, etc.), long description, **gallery images**, prev/next navigation.

### 7. Industries — `GET /api/industries-page`, `/api/industries/{slug}`, menu endpoint
Page: heading, overview text, CTA, SEO, featured projects.
Har industry: title, slug, icon, short description, hero, **challenges** list, **linked services**, linked projects.

### 8. Products — `GET /api/products-page`, `/api/products/{slug}`
Page: headings, category pills, solution cards, use-case industries, button labels, CTA, SEO.
Har product: name, slug, category, image, description, features/capabilities, ecosystem items, deployable solutions, use cases (industries), showcase.

### 9. Testimonials & Clients — `GET /api/testimonials-page`, `/api/clients/{slug}`
- Client logos bar
- **Reviews**: reviewer name, designation, company, photo, rating, review text (Home par pehle 3 dikhte hain)
- **Success stories**: title, text, image
- **Client Portfolio** cards + har client ka detail page (slug, logo, industry, story, related stories, related reviews)
- Headings, CTA, SEO

### 10. Contact submissions — `POST /api/contact` (client data nahi, magar backend ready hona chahiye)
- Notification email address(es) jahan inquiries jayengi
- Auto-reply email text (agar chahiye)
- CAPTCHA keys (site key) — form mein captcha hai

### 11. Navigation menus — `fetchMenuServices`, `fetchMenuIndustries`
Services aur Industries dropdown dono Services/Industries modules ke "Menu mein dikhao" flag se bante hain — alag data nahi chahiye, bas flags set karne hain.

---

## Static (CMS mein nahi) — sirf confirm karwana hai
Navbar links, Footer links, copyright line ("Intellivex @ 2026"), Contact page details, breadcrumbs, consultation form labels, Partnerships page ke sab sections (is page ka koi API/module hi nahi hai).

## Sab se pehle kya mangwayein (priority)
1. Partnerships page ka poora content (logos, text, video) — poora page abhi khali hai.
2. Real social links + contact details + Privacy Policy.
3. Team members (3) ke photos + details.
4. Reviews, client logos, success stories.
5. Portfolio projects aur Products ki images + descriptions.
6. Services ke detail content ka approval.
7. SEO titles/descriptions.

## Backend ke liye note
Ready-to-import data `Intellivex Admin/docs/website-content-seed.json` mein hai (home/about/services pages + 6 services). Partnerships ke liye abhi **koi backend module/spec nahi hai** — ya to naya module banega ya page static rahega.
