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

# Student Sync — Web

Lightweight developer README for the Student Sync frontend (React + Vite) with essential setup and references.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill values (see `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

3. Start dev server:

```bash
npm run dev
```

App entry: `src/main.jsx` → `src/App.jsx` → `src/Routes.jsx`.

## Key env vars

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase public anon key
- Optional: `VITE_FIREBASE_*` if using Firebase helpers

Security: never commit service_role or secret keys.

## Supabase setup (short)

1. Create a Supabase project and copy Project URL + anon key.
2. Apply `supabase/schema.sql` in the SQL editor, then `supabase/seed.sql` (optional).
3. Check auth settings and RLS policies. See `SUPABASE_SETUP.md` for CLI/psql commands.

## Project structure (important paths)

- `src/` — UI, hooks, and pages
- `src/supabase.js` — Supabase client
- `src/components/` — shared components (AuthGuard, LandingPage, ForgotPasswordModal)
- `supabase/` — schema and seed SQL

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Deployment

Build with `npm run build` and deploy `dist` to static hosts (Vercel, Netlify, Cloudflare). Add `VITE_` env vars in the host settings.

## Troubleshooting (brief)

- Port conflicts: set `PORT` env var before `npm run dev`.
- Invalid API key: confirm `.env` values and restart dev server.
- RLS errors: verify policies in Supabase Dashboard.

## Contributing

- Branches: `feature/`, `fix/`, `chore/`
- Document new env vars in `.env.example` and update `supabase/` SQL if schema changes.

For more details see `ARCHITECTURE.md` and `SUPABASE_SETUP.md`.

---

If you'd like this shortened README adjusted further (more or less detail), tell me what to keep or remove.
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