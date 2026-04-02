# CLAUDE.md — SIGNAL (Media OS)
# Drop this in the root of workwithlos-ui/elios-media-os

## What this is
SIGNAL is a 33V content intelligence OS. Source material → SPCL atoms → weekly plan → scored posts → revenue.
Live: elios-media-os.vercel.app | Target: signal.33v.ai

## Stack
Next.js 14 App Router · TypeScript · Claude API · Vercel
Models: claude-sonnet-4-5 (speed/generation) + claude-opus-4-5 (strategy/planning)

## Env var
ANTHROPIC_API_KEY — required for ALL routes

## Route map
| Route | Agent | Status |
|---|---|---|
| /api/extract | Source Distillation | WORKING |
| /api/plan | Chief Strategy Agent | WORKING |
| /api/generate | Content Gen + SPCL | WORKING |
| /api/score | SPCL Scorer | WORKING |

## SPCL formula (DO NOT CHANGE)
Score = 0.18S + 0.20P + 0.15C + 0.10L + 0.12ICP + 0.10CVR + 0.08PLT − 0.08RISK
P (Power) = highest weight. Hormozi's strongest influence lever.
Routing: 90+ auto-publish | 75-89 review | 60-74 regenerate | <60 discard

## Pages
/mission — pipeline + quota tracker (LIVE with real data)
/source — paste raw material → extract atoms
/plan — Chief Strategy Agent weekly plan
/content — generate + score + approve
/context — ICPs, offers, proof bank, voice rules

## Critical file
lib/context.ts — ELIOS_CONTEXT canonical object. All agents read from this.
When adding multi-client: replace with dynamic per-client context from DB.

## Build queue (in order)
1. Auth (Clerk) + multi-client context object (replaces hardcoded ELIOS_CONTEXT)
2. Stripe: Solo $297 | Pro $797 | Agency $2,497 | Managed $5K
3. Direct publish: LinkedIn API + X API + Beehiiv API
4. Content calendar (schedule 30 days)
5. Performance tracking (content → engagement → pipeline)
6. Perplexity Sonar Pro injection before /api/plan

## NEVER break
- The 4 API routes (they chain: extract → plan → generate → score)
- SPCL weights in lib/context.ts
- 5-page structure (Mission/Source/Plan/Content/Context)

## Test after any change
elios-media-os.vercel.app/mission → Mission Control should show pipeline data
elios-media-os.vercel.app/content → generate a LinkedIn post → should show SPCL score
