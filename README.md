# MERN Base Starter

A reusable React + Express + MongoDB base. **No Next.js. No business-specific application.**

Sidebar, header, layouts, themes, authentication and one removable API example are ready to extend.
The source is plain JavaScript (`.js` / `.jsx`) and plain CSS. No Tailwind or MUI installation is needed.

## Start here

**Needs:** Node.js 22.12+ (or a compatible newer LTS), npm, and a running MongoDB database.

From the extracted `mern-base-starter` folder:

```bash
npm run setup
```

This creates both `.env` files and a random backend JWT secret. It never overwrites existing files.

Open `backend/.env` and set **MONGO_URI** to your local database or MongoDB Atlas connection string.
Keep the database name in the URI, for example `/mern_base`. The key must be named `MONGO_URI` exactly.

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. Choose **Create an account**, register, then sign in.
There is **no preset user, demo password or default admin account** in the application itself.

### Optional: a demo account for your first look

If you would rather sign in straight away, run this once (development only):

```bash
npm run seed
```

That creates **student@example.com** / **MernBase@2026** plus two sample records.
Override with `SEED_EMAIL`, `SEED_PASSWORD` and `SEED_NAME` if you prefer your own values.
It refuses to run when `NODE_ENV=production`. Delete `backend/scripts/seed.js` once you have real accounts.

The root command starts frontend and backend together. Stop both with Ctrl+C.
To run separate terminals: `npm run dev:backend` and `npm run dev:frontend`.

### Choose ONE database

- **Already installed MongoDB:** start your local MongoDB service. The example URI uses `127.0.0.1:27017/mern_base`.
- **Atlas:** replace `MONGO_URI` with your own database-user URI; allow your current IP in Atlas. Do not paste the Atlas website password.
- **Optional Docker:** run `docker compose up -d mongo` from this folder. The database port is bound to localhost only.

Do not start two databases on the same port. Do not commit `.env` files.

## What is included?

| Base feature | Files |
| --- | --- |
| Responsive desktop / mobile sidebar | `frontend/src/components/layout/Sidebar.jsx` |
| Shared header + sign out | `frontend/src/components/layout/Header.jsx` |
| Auth and app layouts | `frontend/src/layouts/` |
| Light / dark / system appearance | `context/ThemeProvider.jsx`, `styles/theme.css` |
| Login, registration, restore session | `pages/auth/`, `context/AuthProvider.jsx` |
| Profile name update | `pages/profile/ProfilePage.jsx` |
| Browser navigation + protected pages | `routes/AppRoutes.jsx`, `routes/ProtectedRoute.jsx` |
| Shared fetch wrapper | `frontend/src/lib/api.js` |
| Endpoint functions | `frontend/src/services/` |
| Real MongoDB-backed auth | `backend/src/services/auth.service.js` |
| Sample CRUD endpoints | `backend/src/routes/example.routes.js` |
| Env / DB setup | `backend/src/config/` |
| Request validation / error handling | `backend/src/validators/`, `middleware/` |

No payment module, AI integration, bulk mail, fake charts, analytics dashboard or admin-management app is included.
The sample records module exists only to show one frontend-to-database flow; remove it for your project.

## Folder map

```text
mern-base-starter/
  frontend/
    src/
      main.jsx           # Providers + React boot
      App.jsx            # Route composition only
      config/            # App name, API URL, navigation
      routes/            # Page URL mapping and guards
      layouts/           # Auth layout / sidebar layout
      components/
        layout/          # Header, sidebar, brand, theme control
        ui/              # Button, field, alert, dialog, etc.
      pages/             # Auth, overview, profile, settings, example
      context/           # Auth and theme providers
      hooks/             # useAuth, useTheme, useAsyncData
      lib/api.js         # One fetch wrapper
      services/          # Named API calls per feature
      styles/            # Theme tokens + CSS
      utils/             # Browser preference helpers
  backend/
    src/
      server.js          # Validate env, connect DB, listen
      app.js             # Express + middleware + mounted routes
      config/            # Environment + database connection
      routes/            # HTTP method / path
      validators/        # Check and whitelist input
      middleware/        # Auth, logging, request checks, errors
      controllers/       # HTTP request / response
      services/          # Business rules and database operations
      models/            # User, Session, removable Example
      utils/             # Small helpers
  docs/                  # Flow, API reference, customization, troubleshooting
  scripts/setup.mjs      # Creates env files; generates local secret
  compose.yaml           # Optional local MongoDB
```

## How a request travels

```text
Page -> service (exampleApi.js) -> lib/api.js -> HTTP
  -> Express -> middleware -> route -> controller -> service -> model -> MongoDB
  -> JSON response -> React state -> UI
```

`server.js` runs at startup; it is not re-executed for each API request. Utilities/config are helpers, not mandatory request hops.

## Everyday commands

```bash
npm run dev          # Frontend and backend
npm run build        # Build React to frontend/dist
npm test             # Dependency-free validation / API-wrapper unit tests
npm run test:api     # Optional real-MongoDB integration tests; see docs/TESTING.md
npm run seed         # Optional demo account for development; see above
npm start            # Backend; optionally serves a built frontend
```

## Make it your project

1. Rename `VITE_APP_NAME` in `frontend/.env`, then restart Vite.
2. Change colors in `frontend/src/styles/theme.css`.
3. Add a page in `pages/`, route in `routes/AppRoutes.jsx`, and sidebar item in `config/navigation.js`.
4. Follow `docs/ADD-A-FEATURE.md` for the matching backend/API files.

## Authentication choice

The browser gets a signed **HTTP-only session cookie**, not a token in localStorage.
A JWT identifies a MongoDB `Session` record. Every protected request checks the token and the active session.
Logout deletes that session, so replaying that session token no longer grants access. Sessions expire after 7 days by default.
Passwords are hashed using bcrypt. Registration never accepts admin roles.
This starter intentionally does not add refresh-token rotation, social login, password reset or email verification.

Mutation calls use `X-App-Request: mern-base`, JSON bodies and an origin allowlist. `api.js` adds the header automatically.
CORS is not authentication. HTTP-only cookies do not protect against all XSS/CSRF attacks.
See `docs/SECURITY.md` before any public deployment.

## About your supplied Next.js reference

The archive was inspected. It uses Next.js App Router, a blue Material UI theme, top navigation/mobile drawer,
login/register pages, AuthContext, protected pages and MongoDB user authentication.

This MERN version retains the blue visual direction and core auth/page ideas, but is not a byte-for-byte port.
**Requested additions:** a persistent collapsible sidebar, shared workspace layout, theme preferences,
separate Express backend, `api.js`, and sample CRUD APIs.
**Deliberate simplifications:** plain CSS replaces Material UI; admin-specific pages and client role selection are removed.
Next.js APIs/routing are replaced with Express/React Router. Browser back navigation is not intercepted.
Cookie handling is server-only and logout revokes a stored session.

## Validation status

Source syntax, import paths and dependency-free tests were checked in the preparation environment.
That environment could not reach the npm registry or run MongoDB. **Dependency installation, Vite production build and full login/CRUD browser integration were not verified there.**
Run the commands above on your machine before teaching or deploying. A real-database integration suite is included.
No `node_modules` or build output is included.
The `package-lock.json` in this archive is real: it was produced by a successful `npm install`
and the test suite was run against it. Commit it so every machine installs the same versions.
After a successful `npm install`, review and commit the generated `package-lock.json` for reproducible installs.

## Official references

- Vite: https://vite.dev/guide/
- React: https://react.dev/learn
- React Router: https://reactrouter.com/start/declarative/installation
- Express: https://expressjs.com/en/guide/routing.html
- Mongoose: https://mongoosejs.com/docs/connections.html
- bcryptjs: https://github.com/dcodeIO/bcrypt.js
- jsonwebtoken: https://github.com/auth0/node-jsonwebtoken

See `docs/START-HERE.md` for the shortest setup steps.
See `docs/GIT-GUIDE.md` for the git commands used with this project.
