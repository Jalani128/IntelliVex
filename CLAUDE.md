# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent Vite + React 18 apps (JavaScript, no TypeScript) for the IntelliVex company website. Each has its own `package.json` / `node_modules`; there is no root package. The backend is a separate Laravel API that is **not** in this repo.

- `Intellivex Frontend/` — public marketing site (port 5173). Read-only consumer of the public API (`/api/...`).
- `Intellivex Admin/` — CMS/admin panel (port 5174) that edits the same content through `/api/admin/...`.
- `Intellivex Admin/docs/` — backend specs (`*-backend-spec.docx/.md`) that define the API contract both apps are built against, plus `website-content-seed.json`. Check these before changing payload shapes or validation.

Folder names contain spaces — quote paths in shell commands.

## Commands

Run inside the app folder:

```bash
npm install
npm run dev        # Frontend :5173, Admin :5174
npm run build
npm run preview
npm run dev:mock   # Admin only: in-memory mock data, no API needed (port 5175, .env.mock)
```

There is no lint or test setup in either app. Preview configs live in each app's `.claude/launch.json`.

## Environment / API proxy (both apps)

In dev, `.env.development` sets `VITE_API_PROXY_TARGET` to the Laravel server; `vite.config.js` proxies `/api` and `/storage` to it with `secure: false` (the server uses a self-signed cert, and same-origin avoids CORS). Without that variable there is no proxy.

Uploaded image URLs returned by the API point at an unreachable private host. Both apps run every API response through `rewriteMedia` (`services/media.js` / `services/admin/media.js`), which rewrites any key matching `image|icon|logo|photo|avatar(_url)` to `VITE_MEDIA_URL` + the path after `/storage/`. New image fields must follow that naming to be rewritten.

## Frontend architecture

- Routes in `src/App.jsx`; detail pages are fetched by `:slug`. Old static `/…/details` URLs redirect to list pages. Production build uses `base: '/demo/'` (router uses `import.meta.env.BASE_URL`); Vercel rewrites everything to `index.html`.
- **Fallback-first data**: every page ships built-in content in `src/data/*.js`. `useApiData(fetcher, map, fallback)` renders the fallback immediately and swaps in API data only if the request succeeds and maps to something non-empty — the site must never render blank when the API is down or an endpoint isn't deployed yet.
- `src/services/*.js` hold one module per resource: fetchers (`api.get(...)` → `r.data.data`) plus `toXxx(apiData, fallback)` mappers that convert API fields into component props, falling back field by field. Keep API-shape knowledge in these mappers, not in components.
- Detail fetchers reject with `{ notFound: true }` on a real 404 but treat Laravel's "The route … could not be found" 404 as an API problem (keep fallback) — see `fetchService` in `services/services.js`.
- Headings with a gradient phrase come from the CMS as a full title + `highlight` substring, split by `splitHeading` (`services/portfolio.js`).
- Styling: Tailwind v4 with design tokens in `@theme` in `src/styles/index.css` (`bg-navy`, `text-accent`, `font-display`, `rounded-card`, …). Animations use framer-motion/GSAP; respect `useReducedMotion`. `bootstrap` is in package.json but unused.

## Admin architecture

- `@/` alias → `src/`. UI primitives in `src/components/ui/` are shadcn (new-york, JSX); admin-specific building blocks in `src/components/admin/` (DataTable, FormSection, ImageUpload, GalleryField, RichTextEditor (Tiptap), ConfirmDeleteDialog, …).
- **`components/admin/sidebar/nav-config.js` is the single source of truth** for modules: sidebar, breadcrumbs, global search and routes all derive from it. `crud: false` = list + detail only.
- `src/routes/index.jsx` generates `/admin/:module`, `/create`, `/:id`, `/:id/edit` for each module; real pages are registered in `BUILT_PAGES`, unbuilt ones render `ModulePlaceholder`. Most content modules redirect detail → edit. Many list pages are tabbed (records + a "Page content" tab for that website page's single-row content).
- **Service layer** (`src/services/admin/`): `createResource(endpoint, { seed, searchFields, imageFields, galleryFields })` returns `list/get/create/update/remove/setStatus`; `createSingleton(endpoint, …)` for single-row page content (`get/update`). Payloads containing a `File` are sent as multipart (`key[0][field]`, booleans → 1/0), and updates then go as `POST` + `_method=PUT`. Images upload as `{field}` and come back as `{field}_url`; `remove_{field}: true` clears one. `per_page` is capped at 100 and `'all'` filter values are stripped.
- **Mock mode**: `VITE_USE_MOCK` (default on unless `'false'`) serves every resource from `src/mock/admin/*.mock.js` via `mockAdapter.js`, mimicking Laravel's `{ data, meta: { current_page, per_page, total, last_page } }` shape. `VITE_USE_MOCK_AUTH` does the same for login (Laravel has no auth endpoints yet). When adding a resource, add a mock seed too so `dev:mock` keeps working.
- `http.js` adds the Bearer token (localStorage if "remember me", else sessionStorage), fires `iv-admin:unauthorized` on 401, and normalizes errors to `{ message, status, errors }` where `errors` is Laravel's 422 bag.
- Data fetching uses `useApiQuery(fetcher, deps)` (drops superseded responses). Forms use react-hook-form + zod schemas that mirror the Laravel validation rules in the docs specs; toasts via `sonner`.
