@AGENTS.md

# CareConnectHub AI — Frontend

AI-powered symptom checker and emergency triage assistant. This is the Next.js frontend. Prompt 3 complete — real AI symptom analysis via HuggingFace DeepSeek.

## Stack

- Next.js 16 App Router (Server Components by default)
- React 19, TypeScript (strict)
- Tailwind CSS v4 (CSS-first config in `app/globals.css`)
- shadcn/ui (Radix primitives, components in `components/ui/`)
- `@supabase/ssr` + `@supabase/supabase-js` (cookie-based auth, App Router)
- HuggingFace Inference API — `deepseek-ai/DeepSeek-R1-Distill-Llama-8B` (symptom analysis, requires `HF_TOKEN`)
- `@mapcn/map` (MapLibre GL wrapper, used in `/hospital-nearby`)
- Lucide React (icons, 1.5px stroke)
- Inter font via `next/font/google`

## Routes

| Route              | Status        | Notes                                     |
| ------------------ | ------------- | ----------------------------------------- |
| `/`                | Static UI     | Landing page                              |
| `/check`           | Protected     | Free-text symptom input + pill helpers, calls AI API |
| `/result`          | Protected     | Real AI analysis results or emergency screen         |
| `/history`         | Protected     | Empty state placeholder — requires auth   |
| `/login`           | Auth page     | Real Supabase email/password sign-in      |
| `/signup`          | Auth page     | Real Supabase sign-up, email verification |
| `/profile`         | Protected     | Age, gender, pre-existing conditions form |
| `/hospital-nearby` | Public        | MapLibre map + location overlay           |
| `/admin`           | Protected     | Access-denied placeholder                 |
| `/auth/confirm`    | Route handler | Email OTP verification redirect           |

## Supabase setup (manual — before running)

1. Create a Supabase project at supabase.com
2. Copy `frontend/.env.local.example` → `frontend/.env.local` and fill in all keys
3. In Supabase dashboard → SQL editor, run `supabase/migrations/20240001_profiles.sql`
4. Set `NEXT_PUBLIC_SITE_URL` to your deployed URL in production

## AI analysis setup (Prompt 3)

- Get a free HuggingFace token at huggingface.co/settings/tokens
- Add `HF_TOKEN=hf_...` to `frontend/.env.local`
- API route: `app/api/analyze/route.ts` — POST `{ userText, age?, duration? }`
- Client-side red-flag check runs before API call (23 dangerous keyword patterns)
- DeepSeek-R1 returns `<think>` traces — these are stripped before JSON parse
- Result stored in `sessionStorage` key `ccr_analysis`; read by `/result` page

## Auth flow

- Sign-up sends a confirmation email → user clicks link → `/auth/confirm` exchanges OTP → redirect to `/check`
- Sign-in → redirect to `/check` (or the `redirectTo` param)
- Protected routes checked in `middleware.ts` via `@supabase/ssr` cookie session
- New user profile row auto-created via Postgres trigger on `auth.users`

## Design system

Yellow palette. Tokens in `../templates/colors_and_type.css`. Prototype: `../templates/ui_kits/web_app/index.html`.

- Primary: `#F5C518` — text on primary is always `#1C1A0F` (dark), never white
- Background: `#FFFEF5` · Surface: `#FEFCE8` · Border: `#FDE68A`
- Severity: Low `#DCFCE7`/`#15803D` · Moderate `#FEF3C7`/`#B45309` · High `#FEE2E2`/`#B91C1C`
- No emoji in UI. No photography. Lucide icons only.

## Directory layout

```
app/          Route segments (page.tsx, loading.tsx, error.tsx per route)
  auth/confirm/   Email OTP verification route handler
  login/      Sign-in page + server action
  signup/     Sign-up page + server action
  signout/    Sign-out server action only (no page)
  profile/    Profile setup page + server action
components/   Shared components (nav-bar, disclaimer-bar, page-shell, etc.)
components/ui/  shadcn-generated primitives
lib/
  supabase/   client.ts (browser) · server.ts (server) · middleware.ts (session)
  utils.ts    cn() helper
  dummy-data.ts  symptom categories, red-flag patterns, AnalyzeResult/AICondition types
middleware.ts  Route protection (explicit matcher — no static asset leakage)
supabase/migrations/  SQL to run in Supabase dashboard
public/       SVG assets (logo, logomark, heartbeat-motif, cross-motif)
```

## Rules (see ../me/practices/)

- TypeScript strict, no `any`
- Server Components by default; `"use client"` only for state/events
- Tailwind only — no inline styles, no CSS modules
- Min touch target 48×48px mobile
- One `<h1>` per page, one primary CTA per screen
- Sentence-case headlines, Title Case CTAs, ALL-CAPS severity badges
- `loading.tsx` + `error.tsx` in every async route segment
- `error.tsx` must include a recovery action (retry/back)
- RLS enabled on every Supabase table — enforce isolation in DB, not app code
- Middleware has explicit matcher — never run on static assets (billing trap)
- Never log or expose raw auth tokens, passwords, or internal error messages

## Roadmap

- ~~Prompt 3: AI symptom analysis (HuggingFace DeepSeek)~~ — complete
- Prompt 4: Geolocation + hospital search for `/hospital-nearby`
- Prompt 5: Admin dashboard
