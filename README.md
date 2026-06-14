# ClickEarn — Full Stack Vercel Deployment Guide

## What is ClickEarn?
A monetization platform where users earn real money by completing tasks, watching ads, taking surveys, and inviting friends.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Backend:** Express.js (runs as Vercel Serverless Function)
- **Database:** PostgreSQL (Supabase or Neon recommended)
- **Auth:** JWT + Google OAuth 2.0
- **Deployment:** Vercel (frontend + backend in one project)

---

## Step 1 — Set Up the Database

1. Go to [supabase.com](https://supabase.com) → New Project
2. Once created, go to **SQL Editor** and paste the contents of `schema.sql`
3. Run it — this creates all 9 tables and adds sample data
4. Copy your connection string from **Settings → Database → Connection string (URI)**
   - Format: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`
   - ⚠️ Add `?sslmode=require` at the end if needed

---

## Step 2 — Set Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google+ API** / **Google Identity API**
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized JavaScript origins:
   - `https://your-app.vercel.app` (after deployment)
   - `http://localhost:5173` (for local dev)
7. Add Authorized redirect URIs:
   - `https://your-app.vercel.app`
   - `http://localhost:5173`
8. Copy the **Client ID** — you'll need it as `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`

---

## Step 3 — Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Vercel will auto-detect the config from `vercel.json`
5. Before deploying, add **Environment Variables**:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase connection string |
| `SESSION_SECRET` | A random 32+ character string |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `VITE_GOOGLE_CLIENT_ID` | Same as GOOGLE_CLIENT_ID |

6. Click **Deploy** ✓

### Option B: Via Vercel CLI

```bash
npm install -g vercel
cd clickearn-v3
vercel
# Follow prompts, then add env vars:
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add VITE_GOOGLE_CLIENT_ID
vercel --prod
```

---

## Step 4 — Set Admin User

After your first user registers:

```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

Run this in Supabase SQL Editor.

---

## Local Development

```bash
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

npm run dev
```

The API will NOT work locally with Vercel Functions in dev mode. For local API testing, create a `server/local.ts`:

```ts
import app from './server/app';
app.listen(4000, () => console.log('API running on :4000'));
```

And run: `npx ts-node server/local.ts` in a separate terminal.

---

## Project Structure

```
clickearn-v3/
├── api/
│   └── index.ts         ← Vercel serverless entry (wraps Express)
├── server/
│   ├── db/index.ts      ← Database schema + Drizzle ORM client
│   ├── middleware/auth.ts
│   ├── lib/referralCode.ts
│   └── routes/
│       ├── auth.ts      ← Login, Register, Google OAuth
│       ├── wallet.ts
│       ├── tasks.ts
│       ├── ads.ts       ← Ads + Surveys
│       ├── offers.ts
│       ├── vip.ts
│       ├── referral.ts
│       └── admin.ts
├── src/                 ← React frontend (Vite)
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx  ← AR/EN translations
│   ├── components/
│   │   ├── DashboardLayout.tsx
│   │   └── ui/
│   │       ├── LanguageToggle.tsx   ← Fixed toggle (shows current language)
│   │       ├── ThemeToggle.tsx
│   │       └── GoogleButton.tsx
│   └── pages/           ← All 12 pages
├── schema.sql           ← Run this in your DB first!
├── .env.example         ← Copy to .env
├── vercel.json          ← Vercel config
├── vite.config.ts
└── package.json
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register with email/password |
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/google` | No | Login/register with Google |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/wallet` | Yes | Get wallet balance |
| GET | `/api/wallet/transactions` | Yes | Transaction history |
| POST | `/api/wallet/withdraw` | Yes | Request withdrawal |
| GET | `/api/tasks` | Yes | List tasks |
| POST | `/api/tasks/:id/complete` | Yes | Complete task |
| GET | `/api/offers` | Yes | List offers |
| GET | `/api/ads` | Yes | List ads |
| POST | `/api/ads/:id/claim` | Yes | Claim ad reward |
| GET | `/api/surveys` | Yes | List surveys |
| POST | `/api/surveys/postback` | No | CPX Research postback |
| GET | `/api/vip/levels` | No | VIP levels info |
| POST | `/api/vip/deposit` | Yes | VIP upgrade deposit |
| GET | `/api/referral` | Yes | Referral info |
| GET | `/api/referral/referred` | Yes | List referred users |
| GET | `/api/admin/analytics` | Admin | Platform analytics |
| GET | `/api/admin/users` | Admin | Manage users |
| PATCH | `/api/admin/users/:id` | Admin | Update user |
| GET | `/api/admin/transactions` | Admin | All transactions |
| GET | `/api/admin/settings` | Admin | Platform settings |
| PATCH | `/api/admin/settings` | Admin | Update settings |

---

## Features

- ✅ Google OAuth 2.0 + Email/Password authentication
- ✅ Arabic / English toggle (fixed — shows current language)
- ✅ Dark / Light mode
- ✅ Real-time wallet with transaction history
- ✅ VIP levels (1.5x / 2x / 3x earnings multiplier)
- ✅ Referral system with bonus rewards
- ✅ Admin panel (analytics, user management, settings)
- ✅ CPX Research survey integration (real payouts)
- ✅ Fully deployable on Vercel (no separate backend needed)
