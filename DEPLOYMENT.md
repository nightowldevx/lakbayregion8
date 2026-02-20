# Vercel Deployment Guide — Lakbay Region 8

## Pre-flight checklist

Before deploying, confirm these are done locally:

- [ ] `npm run build` passes with no errors
- [ ] `.env.local` is listed in `.gitignore` (never commit real keys)
- [ ] `.env.local.example` is committed (shows required var names with dummy values)
- [ ] `README.md` is up to date
- [ ] Supabase RLS is enabled on all tables

---

## 1. Push to GitHub

```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

> Make sure your repo is **public or private** as preferred. Vercel works with both.

---

## 2. Import project on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Select your GitHub repo (`lakbay-region8`)
3. Vercel auto-detects Next.js — no framework config needed
4. Leave **Root Directory** and **Build Command** as defaults

---

## 3. Add environment variables

In the Vercel project → **Settings → Environment Variables**, add:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |

> Get both values from **Supabase → Project Settings → API**.

> [!CAUTION]
> Never paste your values into the repo. Only add them via the Vercel dashboard.

---

## 4. Deploy

Click **Deploy**. Vercel will:
1. Install dependencies (`npm install`)
2. Build the app (`next build`)
3. Assign a `*.vercel.app` URL

First deploy takes ~2 minutes.

---

## 5. Add your production domain to Supabase CORS

After deploying, Supabase needs to know your production URL.

1. Go to **Supabase → Project Settings → API → Allowed Origins**
2. Add your Vercel URL: `https://lakbay-region8.vercel.app`
3. If using a custom domain, add that too

Without this step, Supabase requests will be blocked in production.

---

## 6. (Optional) Custom domain

1. Vercel Dashboard → **Domains → Add Domain**
2. Add your domain (e.g. `lakbayregion8.ph`)
3. Follow Vercel's DNS instructions for your registrar
4. Add the custom domain to Supabase Allowed Origins as well

---

## Post-deploy verification

- [ ] Visit the live URL — homepage loads with destinations
- [ ] Navigate to `/map` — map renders and markers appear
- [ ] Open a destination detail page — images load from ImageKit
- [ ] Toggle dark mode — works correctly
- [ ] Run your URL through [securityheaders.com](https://securityheaders.com) — expect **A or A+**

---

## Re-deploys

Every `git push` to `main` triggers an automatic re-deploy on Vercel. No manual action needed.

Preview deployments are created automatically for every pull request.
