Supabase connection check and setup

1) Ensure your `.env` file (project root) contains:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

2) To run a quick connectivity test locally (Node needed):

- Install dependencies (if you don't have `dotenv`):

```bash
npm install dotenv
```

- Run the check script:

```bash
node scripts/check-supabase.js

Or using the npm script:

```bash
npm run check:supabase
```
```

Exit codes:
- `0` = success (connected)
- `1` = connection failure (invalid URL/key or network error)
- `2` = missing env vars

3) Apply the database schema to your Supabase project:

- Using Supabase CLI (recommended):

```bash
# install supabase CLI if needed
npm install -g supabase
# login and select project, then
supabase db remote set <your-connection-string>
supabase db reset --file supabase/full_schema.sql
```

- Or in the Supabase SQL editor: open `supabase/full_schema.sql` and run it.

4) Troubleshooting tips:
- Make sure `.env` values are exact and have no surrounding quotes.
- If using the Vite dev server, restart it after editing `.env`.
- Network: ensure your machine can reach the Supabase URL (try `curl https://your-project.supabase.co`).
- If you get 403/401, double-check the anon key and that it's not rotated.

If you'd like, I can also:
- Add a `npm run check:supabase` script into `package.json`.
- Add `dotenv` to `devDependencies` and run the check for you.
