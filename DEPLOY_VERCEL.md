# Deploy to Vercel — instructions

Follow these steps to deploy the project to Vercel and ensure Prisma + Neon work correctly.

1) Required Vercel Environment Variables

- `DATABASE_URL` = your Neon connection string (production). Example:
  postgresql://neondb_owner:SECRET@ep-xxxxxx.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

Optional (aliases): `NEON_DATABASE_URL` or `NEON_URL` — the code will read these if `DATABASE_URL` is not set.

2) Vercel Project Settings

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: leave default (`npm ci`) or use your preferred package manager

Notes:
- `package.json` already runs `prisma generate` as part of the `build` script.
- Vercel automatically sets `VERCEL=1` in builds.

3) How to add env var via Vercel UI

- Go to your project on Vercel → Settings → Environment Variables → Add
- Name: `DATABASE_URL`
- Value: (paste your Neon connection string)
- Environment: `Production` (also add to `Preview` and `Development` if you need branches/staging)

4) How to add env var via Vercel CLI

Install Vercel CLI and run:

```bash
vercel login
vercel env add DATABASE_URL production
```

Follow prompts and paste the connection string.

5) Seeding the database

You can run the seed locally after setting `DATABASE_URL` in your local environment:

PowerShell example:

```powershell
$env:DATABASE_URL='postgresql://neondb_owner:SECRET@ep-....neon.tech/neondb?sslmode=require&channel_binding=require'
npm run seed
```

If you want to seed in the cloud, add a CI step or run a one-off using the Vercel CLI in a controlled environment with the env var set.

6) Verify after deploy

- Check Vercel build logs: confirm `prisma generate` runs without errors.
- Test the previously failing endpoint (`/api/blog/subscribe`) and watch for DB connection errors in logs.

7) Troubleshooting

- If you see "No database host or connection string was set" ensure the exact env var name is `DATABASE_URL` (or `NEON_DATABASE_URL`) and contains the full connection string.
- For Neon, include the `?sslmode=require&channel_binding=require` parameters.
