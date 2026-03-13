# Deploy & Seed — quick guide

This file explains how to add the `DATABASE_URL` secret, run the seed workflow, and configure Vercel.

1) Add GitHub secret (repository)

- Go to the repository → Settings → Secrets and variables → Actions → New repository secret
- Name: `DATABASE_URL`
- Value: your Neon connection string (full URL including `?sslmode=require&channel_binding=require`)

2) Run the seed workflow (GitHub Actions)

- Manual: GitHub → Actions → "Run DB Seed" workflow → Run workflow
- From CLI (if you prefer):

```bash
# ensure you have push access and the repo checked out
git checkout main
git push origin main
# or trigger via the Actions UI
```

3) Configure Vercel

- In Vercel project settings → Environment Variables add `DATABASE_URL` (Production, Preview, Development as needed).
- Build Command: `npm run build`
- Output Directory: `dist`

4) Test locally before deploy

PowerShell example:

```powershell
$env:DATABASE_URL='postgresql://neondb_owner:SECRET@ep-....neon.tech/neondb?sslmode=require&channel_binding=require'
npm run seed
npm run build
npm run dev
```

5) Notes & troubleshooting

- The project already runs `prisma generate` during `npm run build`.
- If you see "No database host or connection string was set" ensure `DATABASE_URL` is set and contains the full connection string.
- For Neon include the `?sslmode=require&channel_binding=require` query parameters.
