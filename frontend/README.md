# CareConnectHub AI

AI-powered symptom checker and emergency triage assistant. Tell us how you're feeling — we'll help you understand what's next, clearly, calmly, and without the guesswork.

## Quickstart

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description | Status |
|---|---|---|
| `/` | Landing page | Static UI |
| `/check` | Symptom input (pill toggle + free text) | Static UI |
| `/result` | Severity badge, conditions, precautions | Static UI |
| `/history` | Symptom check history | Placeholder |
| `/login` | Sign-in form | Static UI |
| `/signup` | Registration form | Static UI |
| `/hospital-nearby` | Interactive map + location | Static UI |
| `/admin` | Admin dashboard | Placeholder |

## Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Maps:** `@mapcn/map` (MapLibre GL, no API key required)
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

## Design system

Yellow palette — primary `#F5C518`, background `#FFFEF5`. Full token reference in [`../templates/colors_and_type.css`](../templates/colors_and_type.css). Interactive prototype in [`../templates/ui_kits/web_app/index.html`](../templates/ui_kits/web_app/index.html).

## Roadmap

1. **Prompt 2** — Supabase auth (login, signup, session management)
2. **Prompt 3** — AI symptom analysis (Claude API integration)
3. **Prompt 4** — Geolocation + live hospital search
4. **Prompt 5** — Admin dashboard with usage analytics

---

> **Medical disclaimer:** CareConnectHub AI is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
