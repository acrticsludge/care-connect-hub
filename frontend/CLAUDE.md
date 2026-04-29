@AGENTS.md

# CareConnectHub AI — Frontend

AI-powered symptom checker and emergency triage assistant. This is the Next.js frontend. Currently a static UI shell (Prompt 1) — no backend, AI, or auth wired yet.

## Stack

- Next.js 16 App Router (Server Components by default)
- React 19, TypeScript (strict)
- Tailwind CSS v4 (CSS-first config in `app/globals.css`)
- shadcn/ui (Radix primitives, components in `components/ui/`)
- `@mapcn/map` (MapLibre GL wrapper, used in `/hospital-nearby`)
- Lucide React (icons, 1.5px stroke)
- Inter font via `next/font/google`

## Routes

| Route | Status | Notes |
|---|---|---|
| `/` | Static UI | Landing page, hero + feature row |
| `/check` | Static UI | Symptom input + pill toggle (client component) |
| `/result` | Static UI | Hardcoded dummy results |
| `/history` | Static UI | Empty state placeholder |
| `/login` | Static UI | Form only, no Supabase yet |
| `/signup` | Static UI | Form only, no Supabase yet |
| `/hospital-nearby` | Static UI | MapLibre map + location overlay |
| `/admin` | Static UI | Access-denied placeholder |

## Design system

Yellow palette. Tokens in `../templates/colors_and_type.css`. Prototype: `../templates/ui_kits/web_app/index.html`.

- Primary: `#F5C518` — text on primary is always `#1C1A0F` (dark), never white
- Background: `#FFFEF5` · Surface: `#FEFCE8` · Border: `#FDE68A`
- Severity: Low `#DCFCE7`/`#15803D` · Moderate `#FEF3C7`/`#B45309` · High `#FEE2E2`/`#B91C1C`
- No emoji in UI. No photography. Lucide icons only.

## Directory layout

```
app/          Route segments (page.tsx, loading.tsx, error.tsx per route)
components/   Shared components (nav-bar, disclaimer-bar, page-shell, etc.)
components/ui/  shadcn-generated primitives
lib/          utils.ts (cn helper), dummy-data.ts (static data)
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

## Roadmap

- Prompt 2: Supabase auth (login, signup, session)
- Prompt 3: AI symptom analysis (Claude API / HuggingFace)
- Prompt 4: Geolocation + hospital search for `/hospital-nearby`
- Prompt 5: Admin dashboard
