# Pages Content + Service Card Tags — Backend Spec (Laravel)

For the backend developer. The Admin panel and the website are already built against this contract
(Admin runs on mock data until these routes exist; the website shows its built-in copy until then).

Source of the content: **IntelliVex - Website Content.docx**. Ready-to-import data:
[`website-content-seed.json`](website-content-seed.json) + images in [`website-content-assets/`](website-content-assets/)
(`"upload:<file>"` in the seed = upload that file to the image field — they are the icons/images the website already uses).

Conventions are the same as the existing modules (`services-backend-spec`, `testimonials-page`):
admin routes under `/api/admin`, public routes under `/api`, `{ data }` envelopes, 422 `{ message, errors }`,
images uploaded as multipart files and returned as full `*_url`, `remove_{field}=1` clears an image,
updates with a file arrive as `POST` + `_method=PUT`.

---

## Part A — Services: card tags (extends the existing Services module)

Each service card shows its sub-services as tag pills (Services page and Home). They are short labels,
not separate services (no detail page, icon or description), so they get a child table like `service_benefits`.

### A.1 Table `service_tags`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| service_id | FK → services.id, cascade delete | |
| text | string(100) | e.g. "AWS, Azure & Google Cloud" (commas are allowed) |
| sort_order | integer, default 0 | display order |

### A.2 Admin API (`/api/admin/services`, existing routes)

- Create / update payload gains `tags[] → { id?, text, sort_order }`.
  Sync exactly like `benefits`: with `id` → update, without → create, missing from payload → delete.
- Validation: `tags: array`, `tags.*.text: required|string|max:100`, `tags.*.sort_order: integer|min:0`.
- `GET /services/{id}` returns `tags: [{ id, text, sort_order }]` sorted by `sort_order`.

### A.3 Public API (`/api/services`, existing routes)

Every service object (catalog, `?featured=1`, detail) gains `tags: ["…", "…"]` — strings in `sort_order`.
The website uses `tags` for the pills on **both** card variants; services without tags fall back to their `children`.

### A.4 Rule changes

- `description` (detail-page rich text) stays **nullable** as the spec already says — the content file
  has no detail-page text for these services. (The Admin form no longer requires it.)
- `card_variant = innovation`: card shows title + highlight + tags only (no icon, no description on the card).

### A.5 Data from the content file (6 top-level services, in this order)

| sort_order | title / highlight | variant | icon (existing website asset) | Home | Menu | tags |
|---|---|---|---|---|---|---|
| 0 | Software Engineering | default | software-engineering.png | ✓ | ✓ | 6 |
| 1 | Mobile Development | default | mobile-development.png | ✓ | ✓ | 6 |
| 2 | Cloud & Cybersecurity | default | cloud-cybersecurity.png | ✓ | ✓ | 6 |
| 3 | `AI &` / `Data Innovation` | innovation | — | | | 7 |
| 4 | Web Development | default | web-development.png | | | 6 |
| 5 | Game Development | default | game-development.png | | | 6 |

Full text and tag lists are in the seed file. Existing slugs `engineering` and `cloud-security` are kept
so current links (`/services/engineering`, `/services/cloud-security`) keep working.

---

## Part B — Page content (3 new single-row endpoints)

Same pattern as `testimonials-page`: one row per page, created by a seeder, never deleted.

| Page | Admin (GET / PUT) | Public (GET) | Admin screen |
|---|---|---|---|
| Home | `/api/admin/home-page` | `/api/home-page` | Pages → Home |
| About Us | `/api/admin/about-page` | `/api/about-page` | Pages → About Us |
| Services | `/api/admin/services-page` | `/api/services-page` | Services → Page Content |

Responses: `{ "data": { …all columns…, "updated_at": "…" } }`. Public and admin responses are the same
fields (images as `*_url`). Cards inside these pages are **not** stored here — they come from Services,
Portfolio, Testimonials and Team as today.

**Heading convention** (same as the Industries / Portfolio APIs): `*_title` is the **whole** heading,
`*_highlight` is the phrase **inside** it shown in the gradient. Example: `"The IntelliVex Advantage"` / `"Advantage"`.
**Paragraphs:** one text column; a blank line (`\n\n`) separates paragraphs.

### B.1 Shared column groups

**Heading** `{p}_eyebrow` string(50) required · `{p}_title` string(150) required · `{p}_highlight` string(100) nullable

**Differentiators** — heading group `differentiators_*` plus
`differentiators_description` text(1000) nullable · `differentiators_items` JSON array of strings, `required|array|min:1`, `*.required|string|max:200` (order = display order)

**CTA** `cta_title_line1` string(100) required · `cta_title_line2` string(100) nullable · `cta_description` text(500) nullable ·
`cta_button_label` string(50) required · `cta_button_link` string(255) required (site path `/contact` or full URL)

### B.2 `home_page`

| Section on the website | Columns |
|---|---|
| Key Differentiators | Differentiators group |
| Our Services (heading above the 3 featured cards) | heading group `services_*` |
| CTA Banner | CTA group |

### B.3 `about_page`

| Section on the website | Columns |
|---|---|
| Company Overview | heading group `overview_*` · `overview_description` text(5000) required (paragraphs) |
| Trusted Partners card | `partners_title` string(100) required · `partners_highlight` string(50) nullable · `partners_description` text(1000) required · `partners_rating` tinyint 1–5 default 5 · `partners_logo` image (png/svg, max 1 MB) nullable → `partners_logo_url` |
| Our Vision | `vision_title` string(100) required · `vision_highlight` string(50) nullable · `vision_description` text(1000) required |
| Our Mission | `mission_title` · `mission_highlight` · `mission_description` (same rules as Vision) |
| How We Deliver | heading group `process_*` · `process_description` text(1000) nullable · `process_steps` JSON array, **exactly 3** items `{ title: required|max:80, description: required|max:300, sort_order }` (the timeline is drawn for 3 steps; "STEP n" labels are added by the website) |
| Key Differentiators | Differentiators group |
| CTA Banner | CTA group |

### B.4 `services_page`

| Section on the website | Columns |
|---|---|
| Services Overview | heading group `overview_*` · `overview_description` text(5000) required (paragraphs) · `overview_image` image (jpg/png/webp, max 3 MB) nullable → `overview_image_url` · `overview_image_alt` string(150), required when an image is set |
| Our Services (heading above the card grid) | heading group `services_*` |
| CTA Banner | CTA group |

### B.5 Sample — `GET /api/home-page`

```json
{
  "data": {
    "differentiators_eyebrow": "Why IntelliVex",
    "differentiators_title": "The IntelliVex Advantage",
    "differentiators_highlight": "Advantage",
    "differentiators_description": "We don’t just write code; we engineer outcomes. …",
    "differentiators_items": ["One partner, end-to-end: from strategy to support.", "…"],
    "services_eyebrow": "Overview",
    "services_title": "Capabilities That Drive Results",
    "services_highlight": "Results",
    "cta_title_line1": "Reimagine your",
    "cta_title_line2": "business with Intellivex",
    "cta_description": "Let’s turn your ideas into intelligent, high-impact solutions. …",
    "cta_button_label": "Book a Free Consultation",
    "cta_button_link": "/contact",
    "updated_at": "2026-10-06T09:00:00Z"
  }
}
```

### B.6 Rules

- Seed each row from `website-content-seed.json` (keys `home-page`, `about-page`, `services-page`).
- `PUT` accepts the full form (the Admin always sends every field); empty strings arrive as `null`.
- Booleans/numbers in multipart arrive as strings — cast `partners_rating` to int.
- JSON array columns arrive as `field[0]`, `field[0][title]` … in multipart (when an image is attached) and as real arrays in JSON requests.
- Clear the website cache for the page on save, if one is used.
