# Student Sync — Web

Comprehensive frontend for the Student Sync platform — a React + Vite application that demonstrates user authentication, role-based dashboards (student, faculty, admin), and integration with Supabase (primary) and Firebase (ancillary). This repository contains the web client used for demos, local development, and integration testing.

## Table of Contents
- Project overview
- Features
- Tech stack
- Getting started (local development)
- Configuration (environment variables)
- Supabase setup & database seeds
- Project structure
- Scripts
- Deployment
- Troubleshooting
- Contributing
- License & contact

## Project overview

Student Sync is a sample application that manages student identities, enrollments, courses, announcements, and role-based access. The frontend showcases:
- Authentication flows (sign in, sign up, forgot password, OAuth)
- Role-protected routes for `student`, `faculty`, and `admin`
- Dashboards and pages for academic data, communications, schedules, and settings
- Real-time updates and subscriptions (via Supabase realtime)

This repo focuses on the UI and integration points — backend data is provided by a Supabase instance (see `supabase/` folder for SQL schema and seeds).

## Features
- Role-based authentication and route guarding
- Student profile and enrollment views
- Faculty courses, schedule, and communications
- Admin: programs, faculty management, analytics, and system settings
- Realtime announcements and subscriptions
- Demo-ready with SQL seeds for Supabase

## Tech stack
- Framework: React (JSX) with Vite
- Styling: CSS modules + plain CSS
- Auth & DB: Supabase (Postgres + Realtime)
- Optional: Firebase helper file is present (`src/firebase.js`) for demos that require Firebase services
- Tooling: npm, Vite, esbuild

## Getting started (local development)

Prerequisites:
- Node.js (LTS, recommended 18+)
- npm
- A Supabase project (free tier is fine) or a local/postgres instance compatible with the included SQL

1) Install dependencies

```bash
npm install
```

2) Configure environment variables (see next section)

3) Run the dev server

```bash
npm run dev
```

By default Vite serves at `http://localhost:5173` (it will auto-probe other ports if busy).

4) Open the app in the browser and sign up / sign in using the configured Supabase auth.

## Configuration (environment variables)

Copy `.env.example` (create if missing) and set values for your Supabase project and Firebase if used. Typical variables:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — anon/public key for the client
- `VITE_FIREBASE_API_KEY` — (optional) Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` — (optional)

Example (local `.env`):

```
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
# Optional Firebase values if you use firebase.js
# VITE_FIREBASE_API_KEY=...
```

Notes:
- Client keys are public by design; never commit production service_role keys.
- If you run into CORS or network errors, ensure your browser can reach the Supabase URL and that the project is configured to allow the origin.

## Supabase setup & database seeds

This repo includes SQL schema and seeds under the `supabase/` folder. To set up a Supabase instance for local testing or the hosted service:

1. See `supabase/SUPABASE_SETUP.md` and `supabase/README_SUPABASE.md` for step-by-step instructions.
2. Use `supabase/full_schema.sql` or `supabase/schema.sql` to create tables.
3. Run `supabase/seed.sql` or `supabase/seed_full.sql` to insert demo data (students, faculty, programs, courses, enrollments, and sample users).

The `scripts/check-supabase.js` utility can be used to validate connectivity from the repo to your Supabase instance — update environment variables before running it.

## Project structure

Top-level layout (key folders/files):

- `src/` — React application source
  - `App.jsx`, `main.jsx`, `Routes.jsx` — app entry and routing
  - `supabase.js`, `App.supabase.jsx` — supabase client and integrations
  - `firebase.js` — optional firebase helper
  - `components/` — reusable components and hooks
  - `pages/` — role-based pages (admin, faculty, student)
- `supabase/` — SQL schema, seeds, and setup docs
- `scripts/` — helper scripts (e.g., `check-supabase.js`)
- `index.html`, `package.json`, `vite.config.*` — build and dev config

See `ARCHITECTURE.md` for a higher-level diagram and reasoning about the project layout.

## Scripts

Available npm scripts (check `package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — produce a production build
- `npm run preview` — preview the production build locally

If you use Windows PowerShell, run those commands in a compatible shell (PowerShell, Git Bash, or Windows Terminal). If the dev port is busy you may see output like "Port 5173 is in use, trying another one..." — the server will try the next free port.

## Deployment

This is a static frontend and can be hosted on any static hosting provider: Vercel, Netlify, Cloudflare Pages, etc.

Deployment checklist:
- Build with `npm run build`.
- Ensure environment variables (Supabase URL & anon key) are set on the host.
- Do not expose service_role keys in client-side env.

## Troubleshooting & common issues

- Port in use: Vite will auto-select another port; to force a port set `PORT` env var before `npm run dev`.
- Supabase connectivity errors: verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct and the project allows requests from your origin.
- Auth flows failing: check Supabase Auth settings (redirect URLs, email templates) in the Supabase dashboard.

If you need to inspect logs or reproduce backend locally, use the SQL files in `supabase/` and the Supabase dashboard tools.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch (`feature/xxxx`)
3. Open a PR with a concise description and testing steps

Please follow the existing code style and keep changes focused. If you add new API integrations or change the database schema, update `supabase/` with corresponding SQL and documentation.

## License & contact

This demo repository does not include a formal license file. If you need one, add a `LICENSE` file to the repo.

For questions or help, open an issue in this repository with a clear title and reproduction steps.

---

Files with additional guidance:
- `ARCHITECTURE.md` — architecture overview
- `QUICKSTART.md` — quick local startup notes
- `SUPABASE_SETUP.md` & `README_SUPABASE.md` — Supabase-specific setup

Happy hacking!
# student-sync-web

Landing page demo for "Student ID and Profile management" built with React + Vite.

Run the project:

1. Install dependencies

```powershell
npm install
```

2. Start the dev server

```powershell
npm run dev
```

Open the app at `http://localhost:5173` (Vite default).

This workspace contains a minimal React app in `src/` implementing a modern login / signup landing card.
 