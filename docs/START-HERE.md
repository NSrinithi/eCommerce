# Start here — 5 steps

1. Install Node.js 22.12+ or a compatible newer LTS.
2. Extract the ZIP and open `mern-base-starter` in VS Code.
3. Open its terminal and run `npm run setup`.
4. Open `backend/.env` and set `MONGO_URI` to a running local MongoDB or Atlas database.
5. Run `npm install`, then `npm run dev`. Open http://localhost:5173.

Choose **Create an account** first. There is no hardcoded login.

## What to open when teaching

| Show this | Open this file |
| --- | --- |
| Application name | frontend/.env |
| Sidebar links | frontend/src/config/navigation.js |
| Header | frontend/src/components/layout/Header.jsx |
| Page layout | frontend/src/layouts/AppLayout.jsx |
| Theme colors | frontend/src/styles/theme.css |
| Login form | frontend/src/pages/auth/LoginPage.jsx |
| API wrapper | frontend/src/lib/api.js |
| Sample API call | frontend/src/services/exampleApi.js |
| Backend entry | backend/src/server.js |
| Express middleware | backend/src/app.js |
| Sample route | backend/src/routes/example.routes.js |
| Controller | backend/src/controllers/example.controller.js |
| Service / query | backend/src/services/example.service.js |
| MongoDB shape | backend/src/models/Example.js |

No commands are needed to download fonts or install Tailwind.
