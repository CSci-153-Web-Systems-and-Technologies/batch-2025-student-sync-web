# Student Sync — Web (Detailed Developer README)

This document expands the quick README with developer-focused details: architecture, component map, routing, data flow, Supabase schema highlights, environment variables, local workflows, deployment guidance, CI suggestions, and troubleshooting.

If you're starting here, also review: [ARCHITECTURE.md](ARCHITECTURE.md), `supabase/` SQL files, and [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## Quick start (reminder)

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env` and set your values

```bash
cp .env.example .env
# on Windows PowerShell
copy .env.example .env
```

3. Run dev server

```bash
npm run dev
```

App entry: `src/main.jsx` → `src/App.jsx` → `src/Routes.jsx`.

## Environment variables (detailed)

All runtime client environment variables must be prefixed with `VITE_` so Vite exposes them to the browser. Example variables and purpose:

- `VITE_SUPABASE_URL` — Supabase project URL (https://<project>.supabase.co)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key (client-safe)
- `VITE_FIREBASE_*` — Optional Firebase configuration if used for alternate demos
- `PORT` — Optional, port for the dev server (overrides default 5173)

Security notes:
- Never add `service_role` or secret keys to client env or commit them. Use server-side functions or environment-backed deployments for privileged actions.

## Architecture & data flow

High level:
- UI components (React) call hooks in `src/components` and `src/hooks` which call `src/supabase.js` client functions.
- Authentication is handled by Supabase Auth; client stores session in localStorage via Supabase JS client.
- Protected routes are enforced client-side in `AuthGuard.jsx` (also rely on RLS in the DB).
- Realtime updates use Supabase Realtime subscriptions via `useRealtimeSubscription.js`.

Sequence example (student loads dashboard):
1. `Routes.jsx` verifies session and role.
2. `StudentDashboard.jsx` calls `useStudent(user.id)`.
3. `useStudent` queries `students` table and subscribes for updates.
4. UI updates on realtime events pushed from Supabase.

## Component map (important files)

- `src/App.jsx` — top-level application, global providers
- `src/Routes.jsx` — route definitions, role-based guarding
- `src/supabase.js` — Supabase client creation and exported helpers
- `src/components/AuthGuard.jsx` — route protection wrapper
- `src/components/LandingPage.jsx` — public landing and auth forms
- `src/components/OAuthButton.jsx` — third-party auth button
- `src/components/ForgotPasswordModal.jsx` — password reset flow
- `src/hooks/*` — data hooks used across components (`useStudents.js`, `useCourses.js`, `useAnnouncements.js`)
- `src/pages/*` — role-specific pages (admin, faculty, student)

When adding features, prefer adding a hook under `src/hooks` for data access and keep components focused on presentation.

## Routing table (overview)

- `/` — Landing / auth
- `/student` — Student dashboard and nested student pages
- `/faculty` — Faculty dashboard
- `/admin` — Admin dashboard
- `/settings` — Shared settings

Each protected route uses `AuthGuard` which checks `user.role` (value provided by user profile record) and redirects to login or unauthorized views.

## Supabase schema highlights

See `supabase/schema.sql` for full definitions. Key tables and important columns:

- `users` (profiles)
  - `id` (uuid) — matches `auth.users.id`
  - `email`, `role` (`student`|`faculty`|`admin`), `first_name`, `last_name`
- `students`
  - `id` (uuid, FK to users), `student_id` (string), `program_id`, `year_level`, `gpa`
- `faculty`
  - `id` (uuid), `department`, `title`
- `degree_programs`
  - `id`, `code`, `name`, `duration_years`, `total_credits`
- `courses` and `course_sections`
  - `courses`: course catalog
  - `course_sections`: specific offerings (term, schedule, faculty_id)
- `enrollments`
  - links students ↔ course_sections with grades and status
- `announcements`, `calendar_events` — cross-role content

RLS & policies (high-level):
- RLS is enabled; policies are configured so that:
  - Students can read their own `students` row and related enrollments
  - Faculty can read students in their course sections
  - Admin role has broader access

If you modify schema, update RLS policies to preserve least privilege.

## Examples: Supabase queries & auth

Create client (already in repo): `src/supabase.js`.

Sign up (example):

```js
const { data, error } = await supabase.auth.signUp({
  email: 'student@example.com',
  password: 'password123'
})
```

Fetch student profile and enrollments:

```js
const { data: student } = await supabase
  .from('students')
  .select('*, user:users(*) , enrollments(*)')
  .eq('id', userId)
  .single()
```

Realtime subscription example (announcements):

```js
const sub = supabase
  .from('announcements')
  .on('INSERT', payload => handleNewAnnouncement(payload.new))
  .subscribe()

// later: supabase.removeSubscription(sub)
```

## Storage (profile images)

If you store avatars or documents in Supabase Storage, use buckets created in the dashboard (`avatars`, `documents`) and apply appropriate policies so only owners can upload/download their own files.

## Testing & QA

Manual tests:
- Create users in Supabase Auth dashboard with different roles and verify pages and RLS.
- Use `supabase/seed.sql` to pre-populate sample datasets.

Unit / integration (suggested):
- Add tests with Jest + React Testing Library for components and hooks.

Example test command to add to `package.json`:

```json
"scripts": {
  "test": "vitest"
}
```

Notes on mocking Supabase:
- Use msw (Mock Service Worker) to mock API responses for hooks and components.

## Linting & formatting

Recommended tooling:
- `eslint` with React rules
- `prettier` for code formatting

Add pre-commit hooks via `husky` and `lint-staged` to keep code consistent.

## Deployment

Static hosting (Vercel / Netlify / Cloudflare Pages):

1. Set build command: `npm run build`
2. Set output directory: `dist`
3. Add environment variables in the hosting UI (use values from `.env` except dev-only values)

Vercel notes:
- Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables to Vercel project settings.
- Do not add server-only keys.

Netlify notes:
- Add env vars under Site settings → Build & deploy → Environment.

Example GitHub Actions for build & deploy (skeleton):

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2 # or setup-node
      - run: npm ci
      - run: npm run build
      - run: npm run test

# Add deployment step according to your platform (Vercel/Netlify action)
```

## CI / Release suggestions

- Run lint, tests, and build on PRs
- Require code owners review for changes to `supabase/` SQL files
- Use semantic-release or conventional commits for automated versioning and changelogs

## Troubleshooting (expanded)

1) Dev server picks different port

- Cause: port 5173 occupied
- Fix: explicitly set `PORT` env var, e.g., `PORT=5176 npm run dev` (on Windows PowerShell: `($env:PORT = 5176) -and (npm run dev)`)

2) "Invalid API key" or auth errors

- Confirm `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after env changes

3) RLS permission denied

- Use Supabase SQL editor to test queries as the authenticated user
- Verify policies allow the operation for the user role

4) Realtime subscription not receiving events

- Confirm Realtime is enabled in the Supabase project
- Verify you subscribed to the correct table and event type

Logging tips:
- Add `console.debug` in `src/supabase.js` when creating client to log connection attempts during local development

## Contribution guidelines (concise)

- Branch naming: `feature/`, `fix/`, `chore/`
- Commit messages: follow Conventional Commits (e.g., `feat(auth): add oauth button`)
- PR checklist:
  - Is the feature tested locally?
  - Are new environment variables documented in `.env.example`?
  - Did you update `supabase/` SQL and policies if schema changed?

## Useful links & references

- Supabase docs: https://supabase.com/docs
- Vite docs: https://vitejs.dev/
- React docs: https://reactjs.org/

---

If you'd like, I can also:
- push the `chore/add-env-and-setup` branch to the remote
- open a PR with these changes
- create a `ci` workflow file and a `husky` pre-commit setup

Tell me which of the above you'd like next.
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
 