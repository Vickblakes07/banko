# Banko — Banking Dashboard (Full Stack)

## Folder structure

```
banko/
├── README.md
├── package.json             # optional: npm run dev starts API + web together
├── .gitignore
├── server/                    # Express + MongoDB API
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Account.js
│       │   └── Transaction.js
│       ├── middleware/
│       │   └── auth.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── account.routes.js
│       └── utils/
│           └── jwt.js
└── client/                    # Next.js + Tailwind
    ├── package.json
    ├── vercel.json            # forces Next.js on Vercel (avoids wrong "public" output dir)
    ├── next.config.ts
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── .env.example
    ├── public/                # static assets (optional; keeps Next layout standard)
    └── src/
        ├── app/
        │   ├── api/
        │   │   └── [...path]/
        │   │       └── route.ts   # proxies /api/* → Render (runtime API_INTERNAL_URL)
        │   ├── health/
        │   │   └── route.ts       # proxies GET /health → Render
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── providers.tsx
        │   ├── login/page.tsx
        │   ├── signup/page.tsx
        │   └── dashboard/
        │       ├── layout.tsx
        │       └── page.tsx
        ├── components/
        │   ├── BalanceCard.tsx
        │   ├── LoadingSpinner.tsx
        │   ├── Sidebar.tsx
        │   ├── ThemeToggle.tsx
        │   ├── TransactionsTable.tsx
        │   └── WithdrawModal.tsx
        └── lib/
            ├── api.ts
            ├── auth-storage.ts
            ├── types.ts
            └── upstream-api.ts
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) locally or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

## Install (copy-paste)

Use **PowerShell** (or Command Prompt). If `&&` errors on your PowerShell version, run each line separately or use `;` instead of `&&`.

**1. Backend**

```powershell
cd e:\banko\server
npm install
copy .env.example .env
```

Edit `e:\banko\server\.env`: set `MONGODB_URI` (local or Atlas) and a long random `JWT_SECRET`.

**2. Frontend**

```powershell
cd e:\banko\client
npm install
copy .env.example .env.local
```

Edit `e:\banko\client\.env.local` only if you need a custom setup (see `.env.example`).

**3. MongoDB**: run `mongod` locally, or put an Atlas connection string in `MONGODB_URI`.

**4. Start both apps (recommended — one command)**

From the **repo root** so both the API and the website start (avoids `ERR_CONNECTION_REFUSED` when only one of them is running):

```powershell
cd e:\banko
npm install
npm run dev
```

Or use **two terminals** if you prefer:

Terminal A — API:

```powershell
cd e:\banko\server
npm run dev
```

Terminal B — Next.js:

```powershell
cd e:\banko\client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (the **website** is port **3000**; the API is **5000** and is used automatically via the Next.js proxy). Sign up, then use the dashboard.

### If the browser says `ERR_CONNECTION_REFUSED`

| You opened | Meaning |
|------------|--------|
| `http://localhost:3000` | Next.js is not running. Use `npm run dev` from `e:\banko` (root) or from `e:\banko\client`. |
| `http://localhost:5000` | Only the API runs there (JSON). The UI is on **3000**. If this also refuses, start the server: `cd e:\banko\server` then `npm run dev`. |

**Check that the API is reachable**

- With **only** the Next app running, `http://localhost:5000/health` will **fail** — nothing is listening on 5000.
- Start the API (`cd e:\banko\server` then `npm run dev`), **or** use root `cd e:\banko` then `npm run dev` so both start.
- After the API is up, open **`http://localhost:3000/health`** — Next.js proxies to Express, so you should see JSON like `{"ok":true,"database":"connected"}` (or `"disconnected"` if MongoDB is not running yet; `ok` is still `true`).
- Direct API: [http://127.0.0.1:5000/health](http://127.0.0.1:5000/health) when the server process is running.

## API summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Sign up |
| POST | `/api/auth/login` | No | Login (returns JWT) |
| GET | `/api/account/me` | Yes | Account + transactions |
| POST | `/api/account/withdraw` | Yes | Blocked; returns review message |
| POST | `/api/account/withdraw-notify` | Yes | “Notify me” preference |

JWT: send header `Authorization: Bearer <token>`.

## Push to GitHub

Secrets (`server/.env`, `client/.env.local`) are **gitignored** — do not commit them.

```powershell
cd e:\banko
git init
git add .
git commit -m "Initial commit: Banko full-stack app"
```

Create an **empty** repository on GitHub (no README/license), then connect and push (replace `YOUR_USER` / `YOUR_REPO`):

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

If GitHub shows HTTPS auth issues, use [GitHub CLI](https://cli.github.com/) (`gh auth login`) or a [Personal Access Token](https://github.com/settings/tokens) as the password.

## Deploy on Vercel (frontend)

Vercel runs the **Next.js app** in `client/`. The **Express API** in `server/` does not run on Vercel as a long-lived Node server — host the API separately (e.g. [Render](https://render.com/), [Railway](https://railway.app/), [Fly.io](https://fly.io/)) and point the app at it.

1. **Push** this repo to GitHub (steps above).
2. In [Vercel](https://vercel.com/) → **Add New Project** → import the repo.
3. Set **Root Directory** to `client` (important).
4. Under **Build & Development Settings**, leave **Output Directory** **empty** (default). If it says `public`, **clear it** — Next.js outputs to `.next`; a wrong `public` output setting causes: *“No Output Directory named public found”*. **Framework Preset** should be **Next.js** (we ship `client/vercel.json` with `"framework": "nextjs"` to help).
5. **Environment variables** (Vercel → Project → Settings → Environment Variables), for *Production* (and Preview if you use previews):

   | Name | Value |
   |------|--------|
   | `API_INTERNAL_URL` | Your Render API base URL, e.g. `https://banko-psp6.onrender.com` (no trailing slash). Read **at request time** by the Next.js API proxy — set this in Vercel and **redeploy** so serverless picks it up. |
   
   Leave `NEXT_PUBLIC_API_URL` **unset** so the browser keeps using same-origin `/api/...` (proxied by Vercel to your API).

6. On your **API host**, set `MONGODB_URI`, `JWT_SECRET`, and **`PORT`** (Render sets this). **`CLIENT_ORIGIN`** is optional for standard Vercel URLs (`https://*.vercel.app` is allowed by default). Add `CLIENT_ORIGIN` for **custom domains** or set **`CORS_STRICT=true`** if you want to allow only the comma-separated list + localhost.

7. Redeploy Vercel after changing env vars.

## Deploy API on [Render](https://render.com/)

Use Render for the **Express** app in `server/`. Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) for `MONGODB_URI` — Render does not include MongoDB on the free web service.

1. In Render → **New** → **Web Service** → connect repo [Vickblakes07/banko](https://github.com/Vickblakes07/banko) (or your fork).
2. **Settings:**
   - **Root Directory:** `server`
   - **Runtime:** Node (LTS)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment** (Render → Environment → add):

   | Key | Example / notes |
   |-----|------------------|
   | `MONGODB_URI` | Atlas connection string (`mongodb+srv://...`) |
   | `JWT_SECRET` | Long random string (not the default from `.env.example`) |
   | `CLIENT_ORIGIN` | Optional extra allowlist (custom domains, non-Vercel frontends). Comma-separated. `https://*.vercel.app` is allowed automatically unless `CORS_STRICT=true`. |
   | `CORS_STRICT` | Set to `true` to allow only `CLIENT_ORIGIN` + localhost (stricter). |
   | `HOST` | `0.0.0.0` (optional; helps bind on all interfaces) |

   Render injects **`PORT`** automatically — your app already uses `process.env.PORT`.

4. **Create Web Service** and wait for the first deploy. Copy the service URL (e.g. `https://banko-api.onrender.com`).
5. **Vercel:** set `API_INTERNAL_URL` to that exact origin (**no** trailing slash), then **Redeploy**.
6. **Cold starts:** On Render’s free tier the service sleeps after idle time; the first request after sleep can take ~30–60s.

**Smoke test:** open `https://YOUR-SERVICE.onrender.com/health` — you should see `{"ok":true,"database":"connected"}` when MongoDB is reachable.

Local dev is unchanged: run API on port 5000 and Next on 3000 (or `npm run dev` from repo root).
