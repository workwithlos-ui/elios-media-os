# CLAUDE.md — SAGE

## Project Overview
SAGE (Strategic Automated Growth Editor) is a content strategy engine that runs a 4-stage pipeline on every piece of content: Generate → Critique → Revise → Score. It uses two different Claude models deliberately — Opus for creative output, Sonnet for independent evaluation — and pulls business context from Supabase to produce strategically grounded content. It replaces a $120K/yr content strategist.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **AI:** Anthropic Claude API via **raw fetch** (no `@anthropic-ai/sdk`)
- **Context:** Supabase REST API
- **Models:** claude-opus-4-5 (generation + revision), claude-sonnet-4-20250514 (critique + scoring)

## Architecture

The pipeline lives entirely in one API route: `app/api/generate/route.ts`. It makes four sequential Claude calls:

1. **Generate** — Opus receives the user brief + full shared context → produces first draft
2. **Critique** — Sonnet receives the draft (no access to the brief) → produces structured critique
3. **Revise** — Opus receives original draft + critique → produces hardened revision
4. **Score** — Sonnet receives the final draft → outputs SPCL scores (0–100, weighted)

The model split is **intentional and important**: never use the same model for generation and critique. Sonnet must remain the independent evaluator.

Context loading order:
1. Try `lib/shared-context.ts` → Supabase `shared_context` table (5-min cache)
2. Fall back to `lib/context.ts` → hardcoded context object

## Key Files

| File | Description |
|------|-------------|
| `app/api/generate/route.ts` | **The pipeline.** All 4 stages, sequential Claude calls, error handling. |
| `lib/shared-context.ts` | Supabase context fetcher — 5-min cache, graceful fallback |
| `lib/context.ts` | Hardcoded fallback context — update when brand info changes |
| `app/page.tsx` | Content brief input UI |
| `app/layout.tsx` | Root layout, fonts, global styles |

## Shared Context Layer
All ELIOS products read from a shared Supabase table (`shared_context`) containing:
- Business info (name, founder, priority, revenue target)
- Audiences (4 ICPs with pains, outcomes, objections, triggers)
- Proof bank (5 case studies with strength scores)
- Voice rules (tone, forbidden words, signature phrases)
- Platform specs, SPCL weights, offers, constraints

The shared context fetcher is in `lib/shared-context.ts`. It uses raw fetch to Supabase REST API with 5-minute caching and graceful fallback.

## Conventions
- No new dependencies without explicit approval
- TypeScript strict mode
- **Raw fetch for Claude API calls** — do not install or use `@anthropic-ai/sdk`
- Every stage of the pipeline must handle errors gracefully (one failed stage should not crash the whole route)
- Do not combine the generation model and critique model — keep Sonnet as the independent scorer
- Push to main for auto-deploy via Vercel

## Testing
1. Run `npm run dev`, open the UI, submit a content brief
2. Watch the server logs to confirm all 4 pipeline stages fire sequentially
3. Verify the final response includes: draft, critique, revision, and SPCL scores
4. Disconnect Supabase (bad key) and confirm fallback context kicks in without error
