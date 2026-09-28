# GlassSaaS

A MERN-stack project dashboard: authenticated users manage projects and see
live metrics, activity, and upcoming deadlines based on their own data.
The interface supports light and dark themes with a forest-green and amber
palette.

## Tech stack

**Client:** React 18, Vite 5, TypeScript, Tailwind CSS, React Router,
Recharts, lucide-react (icons).
**Server:** Node.js, Express, TypeScript, MongoDB + Mongoose, JWT (httpOnly
cookie), bcryptjs, dotenv, CORS, cookie-parser.

## Folder structure

```
glasssaas/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          Button, Card/GlassCard, Input, Textarea, Badge,
│   │   │   │                Skeleton, EmptyState, ErrorState, ConfirmDialog,
│   │   │   │                ThemeToggle, Container
│   │   │   ├── auth/        ProtectedRoute
│   │   │   ├── layout/      Sidebar, Topbar, DashboardShell, MobileDrawer
│   │   │   ├── dashboard/   DashboardGreeting, StatCardsRow,
│   │   │   │                RecentActivityTable, UpcomingDeadlines
│   │   │   ├── charts/      RevenueChart (Recharts ComposedChart)
│   │   │   └── projects/    ProjectFormModal, ProjectListItem
│   │   ├── pages/           Landing, Login, Register, Dashboard, Projects
│   │   ├── context/         AuthContext, ThemeContext
│   │   ├── hooks/           useAuth, useTheme, useProjects, useDashboardSummary,
│   │   │                    useDrawer, useMediaQuery
│   │   ├── services/        api.ts (fetch wrapper), auth.ts, projects.ts, dashboard.ts
│   │   ├── types/           shared TS types matching the API contract
│   │   ├── App.tsx, main.tsx, index.css
│   ├── tailwind.config.ts, vite.config.ts, package.json
├── server/
│   └── src/
│       ├── config/          db.ts (Mongoose connection), env.ts (startup validation)
│       ├── models/          User.ts, Project.ts
│       ├── middleware/      auth.ts (JWT verify), errorHandler.ts, notFound.ts
│       ├── controllers/     authController.ts, projectController.ts, dashboardController.ts
│       ├── services/        authService.ts, projectService.ts, dashboardService.ts
│       ├── routes/          authRoutes.ts, projectRoutes.ts, dashboardRoutes.ts
│       ├── utils/           ApiError.ts, asyncHandler.ts, jwt.ts
│       ├── app.ts           Express app factory (CORS, cookies, routes)
│       └── server.ts        entry point (env validation, DB connect, listen)
├── .gitignore
├── .env.example
└── README.md
```

## Local setup

Requires Node.js ≥ 18 and a MongoDB connection string (local `mongod` or a
free MongoDB Atlas M0 cluster).

The environment examples use a local MongoDB URI and a dummy JWT secret.
Replace the secret before using real accounts or data. Start MongoDB locally
or set `MONGO_URI` to your Atlas connection string before starting the API.

```bash
git clone <repo-url>
cd glasssaas
```

**Server:**
```bash
cd server
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET (see below)
npm install
npm run dev                # tsx watch -> http://localhost:5000
```

**Client** (separate terminal):
```bash
cd client
cp .env.example .env      # defaults to http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

### MongoDB setup

Either:
- **Local:** install MongoDB Community Edition, run `mongod`, use
  `MONGO_URI=mongodb://127.0.0.1:27017/glasssaas`.
- **Atlas (recommended, free tier):** create an M0 cluster, add a database
  user, add `0.0.0.0/0` to Network Access (fine for a take-home, not for
  real production), and use the provided `mongodb+srv://...` string. URL-encode
  reserved characters in the database password; for example, encode `@` as
  `%40` so it is not parsed as part of the URI structure.

### Troubleshooting: `querySrv ECONNREFUSED` on Windows

Some Windows networks hit a specific issue with `mongodb+srv://` URIs:
Node's own DNS resolver fails to resolve the Atlas `_mongodb._tcp.<cluster>`
SRV record with `querySrv ECONNREFUSED`, even though `nslookup` succeeds for
the exact same record. This is a Node-vs-OS-resolver mismatch, not a
problem with your Atlas cluster, credentials, or Network Access settings.

If you hit this, add one line to `server/.env`:
```
MONGO_SRV_DNS_WORKAROUND=true
```
This points Node's internal DNS resolver at Google's public DNS
(8.8.8.8/8.8.4.4) for this process only — it doesn't touch your Windows
network settings, the OS resolver, or any other application. It's
hard-disabled whenever `NODE_ENV=production` regardless of this setting,
and does nothing at all unless you opt in. See the comment above
`applyDevDnsWorkaroundIfEnabled()` in `server/src/config/db.ts` for the
full reasoning.

## Environment variables

**`server/.env`**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens — never commit a real value |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | API port (default `5000`) |
| `CLIENT_URL` | Exact frontend origin for CORS — no wildcards, required for cookies to work |
| `NODE_ENV` | `development` or `production` — controls cookie `secure`/`sameSite` |
| `MONGO_SRV_DNS_WORKAROUND` | Optional, dev-only — see Troubleshooting above. Default `false`. |

`MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` are validated at startup
(`server/src/config/env.ts`) — the server refuses to start with a clear
error message if any are missing, rather than degrading silently (this
matters most for `CLIENT_URL`: the `cors` package's default behavior for a
missing `origin` is permissive, which would quietly defeat the "no
wildcard with credentials" requirement).

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base API URL, e.g. `http://localhost:5000/api` (no hardcoded fallback in code) |

## Deploying to Render and Vercel

1. Push this repository to GitHub and create a Vercel project from it. Set
  **Root Directory** to `client`, the build command to `npm run build`, and
  the output directory to `dist`. Add `VITE_API_URL` as
  `https://glasssaas-api.onrender.com/api` and deploy. This matches the
  Render service name below. If you choose a different Render service name,
  update this URL to match it and redeploy Vercel.
2. In Render, choose **New > Web Service**, connect this repository, and
  configure the service: name `glasssaas-api`, root directory `server`,
  runtime `Node`, build command `npm install && npm run build`, start command
  `npm start`, and health check path `/health`. Choose the Free instance if
  desired.
3. Add these environment variables in the Render service settings:
   `MONGO_URI` (your MongoDB Atlas connection string), `JWT_SECRET` (a long,
   random secret), `JWT_EXPIRES_IN=7d`, `NODE_ENV=production`, and
   `CLIENT_URL` (the exact Vercel production URL, including `https://` and
   with no trailing slash). Render provides the `PORT` variable automatically.
4. In MongoDB Atlas, allow the Render service to connect under **Network
  Access**. Render's free service does not have a stable outbound IP, so
  allowing `0.0.0.0/0` is the simplest option but permits connection attempts
  from any IP; use strong database credentials and restrict access further
  if your hosting plan provides stable outbound IPs.
5. Confirm `https://<your-render-service>.onrender.com/health` returns
  `{"status":"ok"}`. The API base URL is
  `https://<your-render-service>.onrender.com/api`. Redeploy Vercel after
  changing `VITE_API_URL`; Vite embeds it into the built files.

The API uses credentialed CORS and an httpOnly auth cookie. The frontend URL
must match exactly, and the API's production cookie is configured for HTTPS
cross-site requests. Use the stable Vercel production domain for `CLIENT_URL`,
not a temporary preview deployment URL.

## Scripts

**`server/package.json`:** `npm run dev` (tsx watch), `npm run build`
(`tsc` → `dist/`), `npm start` (`node dist/server.js`), `npm run typecheck`.

**`client/package.json`:** `npm run dev` (Vite), `npm run build`
(`tsc -b && vite build`), `npm run preview`, `npm run typecheck`.

## Authentication approach

JWT stored in an **httpOnly cookie**, not localStorage — chosen so the
token is never reachable from JS (mitigates XSS token theft) at the cost
of needing CORS `credentials: true` + an exact `CLIENT_URL` instead of a
wildcard. Passwords are hashed with bcryptjs (never stored or returned in
plaintext — enforced at the schema level via `select: false` + a `toJSON`
transform, not just by controller discipline). `GET /api/auth/me`
restores the session from the cookie on page refresh. A 401 from *any*
authenticated request (not just the initial session check) flips the
frontend's auth state and redirects to `/login` — covers the
session-expired-mid-use case, not only "never logged in."

## API overview

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Authenticate, set cookie |
| POST | `/api/auth/logout` | Yes | Clear cookie |
| GET | `/api/auth/me` | Yes | Restore session |
| GET | `/api/projects` | Yes | List (paginated, optional `?status=`) |
| POST | `/api/projects` | Yes | Create |
| PATCH | `/api/projects/:id` | Yes | Update |
| DELETE | `/api/projects/:id` | Yes | Delete |
| GET | `/api/dashboard/summary` | Yes | Aggregated stats/chart/status/recent/deadlines |

Every project route derives ownership from the authenticated user
(`req.userId`, set by verifying the JWT) — a project ID alone is never
sufficient; queries are always scoped to `{_id, owner: req.userId}`, and a
cross-user access attempt returns 404 (not 403), so it doesn't even
confirm another user's project exists.

## Dashboard and security

- Dashboard metrics, monthly project activity, recent activity, and
  upcoming deadlines are loaded from the authenticated user's projects.
  The server aggregates dashboard data in one MongoDB `$facet` pipeline.
- Authentication uses a JWT in an httpOnly cookie. The API requires an
  exact `CLIENT_URL` and credentialed CORS; production cookies use HTTPS
  cross-site settings.
- Project queries are scoped to the authenticated owner. A project ID alone
  never grants access to another user's project.
- Passwords are hashed with bcryptjs. Its pure-JavaScript implementation
  avoids native build requirements on hosts such as Render.

## Known limitations

- There is no automated test suite or ESLint configuration yet.
- Free-tier Render services may spin down after inactivity, making the first
  request after a pause slower.
