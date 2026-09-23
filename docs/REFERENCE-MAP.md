# From the supplied Next.js archive to this MERN base

Source inspected: `nextjs-auth-app-main.zip`.

| Source file / concept | MERN replacement |
| --- | --- |
| src/app/layout.js | main.jsx providers + AppLayout / AuthLayout |
| src/app/*/page.js | src/pages/ + routes/AppRoutes.jsx |
| src/components/Navbar.js | Header.jsx + Sidebar.jsx |
| src/components/ThemeRegistry.js | ThemeProvider.jsx + theme.css |
| src/context/AuthContext.js | AuthProvider.jsx + useAuth.js |
| src/utils/mockAuth.js (real API calls despite its name) | services/authApi.js + lib/api.js |
| src/app/api/auth/*/route.js | backend routes / controllers / services |
| src/models/User.js | backend/src/models/User.js |
| src/lib/mongodb.js | backend/src/config/db.js |

Retained reference direction: blue primary color (#1976d2), system font, light surfaces, rounded controls,
auth card, login/register and protected-page concept.

New requirements implemented: persistent sidebar, collapse/mobile behavior, light/dark/system theme,
auth/workspace layouts, profile update, a standalone Express API, sample CRUD and a reusable folder hierarchy.

Simplifications are intentional: no Next.js server rendering, Material UI, role-management screen,
JWT stored through js-cookie, history-blocking behavior or client-supplied role at registration.
Plain CSS is easier to rebrand without adding a CSS framework. Roles/SSR can be added later when the new project needs them.
