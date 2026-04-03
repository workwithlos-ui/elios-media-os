# SAGE
**Strategic Automated Growth Editor**

SAGE is a synthetic content strategist — it replaces the $120K/yr senior editor by running every piece of content through a rigorous 4-stage critique pipeline before it ever reaches an audience.

## What SAGE Does

- **Generates** first-draft content using Claude Opus with full business context (ICPs, voice rules, proof bank) loaded from Supabase
- **Critiques** the draft independently using Claude Sonnet — a separate model specifically to avoid self-serving feedback
- **Revises** based on the critique, producing a hardened second draft
- **Scores** the final output across weighted SPCL dimensions (Status, Power, Credibility, Likeness) to quantify strategic strength

## Architecture

Next.js App Router. The entire pipeline runs server-side in a single API route (`app/api/generate/route.ts`) that sequences four Claude calls. Business context loads from Supabase (`lib/shared-context.ts`) with a fallback to hardcoded context (`lib/context.ts`) if Supabase is unavailable.

Two models are used deliberately:
- **claude-opus-4-5** — generation and revision (creative output)
- **claude-sonnet-4-20250514** — critique and scoring (independent evaluation)

This separation prevents the model from grading its own work.

## Key Files

| File | Purpose |
|------|---------|
| `app/api/generate/route.ts` | The 4-stage pipeline: Generate → Critique → Revise → Score |
| `lib/shared-context.ts` | Supabase dynamic context fetcher with 5-min cache + fallback |
| `lib/context.ts` | Hardcoded fallback context (used when Supabase is unreachable) |
| `app/page.tsx` | Main content input UI |
| `app/layout.tsx` | Root layout |

## Environment Variables

```env
ANTHROPIC_API_KEY=          # Claude API — required for all pipeline stages
NEXT_PUBLIC_SUPABASE_URL=   # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon key (read-only context access)
```

## Development

```bash
npm install
npm run dev
```

## Deployment

Auto-deploys from `main` branch via Vercel.
Live: [elios-media-os.vercel.app](https://elios-media-os.vercel.app)

## Part of the ELIOS Suite

SAGE is one of five synthetic employees in the ELIOS product suite:
- **PAID** — Professional Analytics Intelligence Dashboard (Growth Diagnostic)
- **SAGE** — Strategic Automated Growth Editor (Content Strategy)
- **PRESS** — Platform Revenue Engine for Scaled Stories (Content Production)
- **SUITE** — Synthetic Unified Intelligence Team of Executives (Advisory Board)
- **RISE** — Revenue Intelligence Strategy Employee (Growth Analyst)

All five share a context layer via Supabase, so they know the same business data, ICPs, proof bank, and voice rules.
