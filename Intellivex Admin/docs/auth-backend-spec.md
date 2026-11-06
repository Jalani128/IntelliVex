# Admin Login + Protected Admin API — Backend Spec (Laravel)

For the backend developer. The Admin panel is already built against this contract
(`src/services/admin/auth.js`, `src/services/admin/http.js`); production builds
(`.env.production`) call these routes instead of the old hardcoded mock account.

## Why

- Every `/api/admin/...` route currently answers **without any login**, so anyone who
  finds the URL can read, change or delete website content.
- There are no `/api/admin/login`, `/me` or `/logout` routes, so the Admin panel cannot
  sign in against the server.

Until both are fixed the production Admin build cannot log in.

## Auth: Laravel Sanctum personal access tokens

Routes live under the existing admin prefix (`/api/admin`), same `{ data }` envelopes and
422 `{ message, errors }` shape as the other modules.

| Method | Route | Body | Response |
|---|---|---|---|
| POST | `/api/admin/login` | `{ username, password, remember }` | `200 { data: { token, user } }` · `422 { message: "Invalid username or password.", errors: {} }` |
| GET | `/api/admin/me` | — | `200 { data: user }` · `401` when the token is missing, invalid or revoked |
| POST | `/api/admin/logout` | — | `204` (or `200`); revokes the current token |

- `username` is the login name (not necessarily the email). Compare case-insensitively.
- `token` is a Sanctum plain-text token. The Admin sends it as `Authorization: Bearer <token>`.
- `remember` only decides where the browser stores the token; the server may ignore it or
  use it to pick the token's expiry (e.g. 30 days with remember, 1 day without).
- `user` shape (the Admin shows these fields; never include the password):

```json
{ "id": 1, "username": "Jilani", "name": "Jilani", "email": "admin@intellivex.com", "role": "Super Admin", "avatar": null }
```

`avatar` is a full image URL or `null`.

## Protect every admin route

- Put every `/api/admin/*` route except `login` behind `auth:sanctum`.
- Unauthenticated requests must get **401** with JSON (`Accept: application/json` is
  always sent), not a redirect to a login page. The Admin signs the user out on any 401.
- Public website routes (`/api/services`, `/api/testimonials-page`, `POST /api/contact`, …)
  stay public.

## Security basics

- Store passwords with `Hash::make` (bcrypt/argon); never in the repo.
- Rate-limit `POST /api/admin/login` (e.g. `throttle:5,1`).
- Create the first admin account with a seeder or `php artisan tinker` using a new,
  strong password. The old mock password is in the public GitHub repo's history, so it must
  not be used for the real account.

## Done when

1. `GET /api/admin/testimonials` without a token returns 401.
2. `POST /api/admin/login` with the real account returns a token; `GET /api/admin/me`
   with that token returns the user.
3. The production Admin build (`npm run build` in `Intellivex Admin`) signs in and saves
   changes that then appear on the public website.
