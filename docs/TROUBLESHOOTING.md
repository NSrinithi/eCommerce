# Fix setup problems in this order

## Backend will not start

1. Run `node -v`; use Node 22.12+ or a compatible newer LTS.
2. Run `npm run setup` from the extracted project root.
3. Check the key is `MONGO_URI`, not `MONGODB_URI`, in `backend/.env`.
4. Start local MongoDB, or verify the Atlas database user/password and IP access list.
5. A URI containing special password characters needs percent-encoding in its credentials.
6. A DNS/SRV error is a networking issue, not fixed by changing your application login password.

Do not paste your full Mongo URI into screenshots, frontend code or Git. Rotate exposed credentials.

## Frontend shows “Connect your backend”

Start the API and database. Click Try again. Open `http://localhost:5000/api/health` to check reachability.
`/api/ready` checks the database. Startup requires DB connection; health becomes available after initial startup succeeds.

## Wrong response or CORS

Default frontend API URL is `/api`, using Vite's proxy. Leave it that way for the simplest setup.
If you change the backend port, update `PORT` and frontend `DEV_API_TARGET`, then restart both.
If the browser origin changes, update `CLIENT_ORIGINS` exactly (protocol, hostname, port; no trailing slash).
Do not mix `localhost` and `127.0.0.1` in browser URLs. The proxy target may use 127.0.0.1; the browser stays at localhost.
Use `credentials: include` for direct cross-origin calls, as the supplied api.js does.

## Sign-in problems

Create an account first; no demo login is seeded. Use the same email/password. Session cookies are HTTP-only, so
`document.cookie` will not show them. Inspect DevTools → Application → Cookies.
A 401 leads back to login. A 429 means wait for the rate limit. A failed sign-out shows an error rather than claiming logout succeeded.

## Sample record errors

400: inspect the request fields/record ID. 404: the record is absent or belongs to another account.
A server restart does not delete MongoDB records. The example list shows the latest 50.

## Build/deploy

Run `npm run build`. For one-host serving, set backend `SERVE_CLIENT=true`, then run `npm start`.
Local preview can keep NODE_ENV=development. A public deployment must use HTTPS and NODE_ENV=production.
Missing dist: build first. Separate static frontend hosting needs an SPA fallback to index.html for client routes;
never rewrite `/api` errors to index.html.

## Debugging

Browser console → Network URL/method/body/status/response → X-Request-Id → API terminal → service/model.
Fix the first confirmed failure. Do not disable authentication or CORS just to hide an error.
