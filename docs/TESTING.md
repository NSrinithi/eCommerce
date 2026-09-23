# Tests and preparation status

## Checks performed in the preparation environment

- Archive inspected before conversion.
- Relative imports and JavaScript/JSX syntax checked.
- 21 dependency-free request-validation and fetch-wrapper tests executed: 21 passed.
- 68 JavaScript/JSX files parsed with no syntax errors; all relative imports resolved.
- Setup script checked for secret generation and preserving existing .env files.

## Not verified in that environment

npm registry access failed (DNS/network unavailable); MongoDB was not available.
`npm install`, the real Vite build, full Express/MongoDB integration and full app browser end-to-end flows were **not** run successfully there.
A local Chromium visual-preview attempt was also blocked by the environment (ERR_BLOCKED_BY_ADMINISTRATOR).

## Verified later on a real machine (2026-09-15)

Run on Linux with Node 24.18.0, npm 11.16.0 and a real local `mongod`:

- `npm install` (221 packages), `npm test` 21/21 passed.
- `npm run test:api` against a real MongoDB `_test` database: 10/10 passed, including
  ownership isolation (a second account cannot read or change the first account's record).
- `npm run build` succeeded: 289 KB JS (91 KB gzip), 16 KB CSS.
- Browser end-to-end: register, sign in, create/edit/delete a record, profile update,
  deep-link reload with session restore. No console errors or React warnings.
- Session token confirmed absent from `document.cookie` and `localStorage`.
- Rejected as expected: NoSQL operator injection, POST without the `X-App-Request` header,
  cross-origin POST, bodies over 16 KB, and login attempt 21 within the rate-limit window.
- MongoDB indexes confirmed: unique `email`, TTL on `sessions.expiresAt`, `owner + createdAt`.
- Layout: no horizontal overflow at 320, 375, 768 and 1280 px viewport widths.
- All light and dark theme colour pairs meet the WCAG AA 4.5:1 contrast minimum.
- `SERVE_CLIENT=true` one-host mode served the built client, deep links and the API together.

Two defects found during that run are fixed in this version:

1. `scripts/setup.mjs` passed `mode: 0o600` to `writeFileSync` on a file that `copyFileSync`
   had already created, so the mode was ignored and `backend/.env` stayed world-readable.
   It now calls `chmodSync` explicitly.
2. A `PORT` set by your shell, Docker or PM2 silently overrides `backend/.env`, because
   dotenv never overwrites an existing environment variable. The port-in-use error now
   says so instead of leaving you guessing.

Still not claimed: load testing, and production readiness on any specific host.
Read `docs/SECURITY.md` before you deploy anywhere public.

## On your machine

```bash
npm run setup
# Set backend/.env MONGO_URI to your local or Atlas database.
npm install
npm test
npm run build
npm run dev
```

## Optional real API integration suite

Use a NEW disposable MongoDB database whose name ends in `_test`.
The test suite DROPS that database at the end. Never point it at real user data.

Linux/macOS:

```bash
TEST_MONGO_URI=mongodb://127.0.0.1:27017/mern_base_test npm run test:api
```

PowerShell:

```powershell
$env:TEST_MONGO_URI="mongodb://127.0.0.1:27017/mern_base_test"
npm run test:api
```

The suite tests registration, invalid credentials, cookie login, private endpoints,
CRUD, ownership isolation, profile field allowlisting and logout/replayed cookie denial.
No TEST_MONGO_URI: integration tests are skipped, not passed.

## Browser checks before teaching

Register → sign in → overview → create sample record → edit → reload → delete → update profile → sign out.
Confirm private URL redirects to login. Refresh when logged in; your session should restore.
Try light/dark/system mode, collapse the desktop sidebar and open/close mobile navigation.
Check 390px mobile and 1440px desktop; keyboard Tab/Escape; browser back/forward; direct route refresh.
No inert “forgot password”, fake notifications or dummy admin buttons are included.
