# CareConnectHub AI

AI-powered symptom checker and emergency triage assistant. Tell us how you're feeling — we'll help you understand what's next, clearly, calmly, and without the guesswork.

## Quickstart

```bash
cd frontend
cp .env.local.example .env.local   # fill in Supabase + HuggingFace keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before running: fill in `.env.local` with your Supabase keys and a HuggingFace token (`HF_TOKEN`). Run the SQL migration in `supabase/migrations/20240001_profiles.sql` via the Supabase dashboard SQL editor.

## Routes

| Route | Description | Status |
|---|---|---|
| `/` | Landing page | Static UI |
| `/check` | Free-text symptom description + optional pill helpers | Protected |
| `/result` | Real AI analysis: conditions, severity, precautions, specialist | Protected |
| `/history` | Symptom check history | Placeholder |
| `/login` | Sign-in form | Real Supabase auth |
| `/signup` | Registration form | Real Supabase auth |
| `/profile` | Age, gender, pre-existing conditions | Protected |
| `/hospital-nearby` | Interactive map + location | Public |
| `/admin` | Admin dashboard | Placeholder |
| `/auth/confirm` | Email verification handler | Route handler |

## Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Auth:** Supabase Auth (`@supabase/ssr`, cookie-based, App Router)
- **AI:** HuggingFace Inference API — DeepSeek-R1-Distill-Llama-8B (requires `HF_TOKEN`)
- **Database:** Supabase Postgres (profiles table with RLS)
- **Maps:** `@mapcn/map` (MapLibre GL, no API key required)
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `frontend/.env.local.example` → `frontend/.env.local`; fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run `frontend/supabase/migrations/20240001_profiles.sql` in the Supabase SQL editor
4. In production, set `NEXT_PUBLIC_SITE_URL` to your deployed domain

## AI (HuggingFace) setup

1. Get a free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Add `HF_TOKEN=hf_...` to `frontend/.env.local`
3. The app calls `deepseek-ai/DeepSeek-R1-Distill-Llama-8B` via the HF Inference API
4. Response time varies (10–45 s on free tier); a loading spinner shows during analysis

## Design system

Yellow palette — primary `#F5C518`, background `#FFFEF5`. Full token reference in [`../templates/colors_and_type.css`](../templates/colors_and_type.css). Interactive prototype in [`../templates/ui_kits/web_app/index.html`](../templates/ui_kits/web_app/index.html).

## Roadmap

1. **Prompt 2** ✅ — Supabase auth (login, signup, session, profiles)
2. **Prompt 3** ✅ — AI symptom analysis (HuggingFace DeepSeek, red-flag engine)
3. **Prompt 4** — Geolocation + live hospital search
4. **Prompt 5** — Admin dashboard with usage analytics

---

> **Medical disclaimer:** CareConnectHub AI is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
