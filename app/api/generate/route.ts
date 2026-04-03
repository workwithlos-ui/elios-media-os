import { NextRequest, NextResponse } from "next/server";
import { ELIOS_CONTEXT, SPCL_WEIGHTS } from "@/lib/context";
import { fetchSharedContext, formatContextForPrompt } from "@/lib/shared-context";

// ── Shared helper ────────────────────────────────────────────────
const HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": process.env.ANTHROPIC_API_KEY || "",
  "anthropic-version": "2023-06-01",
};

async function callClaude(system: string, user: string, model = "claude-opus-4-5", maxTokens = 6000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: user }],
      system,
    }),
  });
  const data = await res.json();
  const raw = data.content?.[0]?.text || "";
  return raw.replace(/```json|```/g, "").trim();
}

// ── Stage 1: Generate (no self-scoring) ──────────────────────────
function buildGenSystem(contextStr: string) {
  return `You are the ELIOS Content Generation Agent. You ONLY write content. You do NOT score it.

BUSINESS CONTEXT:
${contextStr}

LOS'S VOICE RULES:
- Direct. Builder-first. No fluff.
- Every claim needs a number OR a specific story
- Contrarian angles stated as facts, not questions
- Forbidden words: leverage, synergy, game-changer, revolutionary, unlock, empower
- Short punchy sentences for LinkedIn. Hook in first 3 words for Shorts.
- NEVER start with "I'm excited to share" or "In today's landscape"

PLATFORM-SPECIFIC:
- LinkedIn: Start with business tension, confession, or specific result. 1500-2500 chars. DM CTA.
- Twitter thread: Each tweet standalone. Hook tweet must land alone. 5-8 tweets. < 280 chars each.
- Instagram: Proof-forward. Carousel-optimized. Bold first line.
- Newsletter: One problem. One solution. Subject line = secret or confession. 300-500 words.
- Shorts: First 3 words = hook. Hard payoff before 60 seconds. Script format.

SELF-CRITIQUE GATE — before finalizing EACH post, check:
1. Would a generic marketing blog say this? → If yes, rewrite with Los-specific proof.
2. Does this require direct experience to know? → If no, add a specific number or named client.
3. Could you swap "ELIOS" for any company name and the post still works? → If yes, too generic. Rewrite.
4. Does the hook create a specific, falsifiable claim? → If not, sharpen it.
5. Is any forbidden word present? → Remove it.

Generate content that attracts buyers who can write $10K–$30K checks. Not likes. Buyers.`;
}

// ── Stage 2: Critique ────────────────────────────────────────────
const CRITIQUE_SYSTEM = `You are a brutal content critic for ELIOS. You did NOT write this content. Your job is to find EVERY weakness.

VOICE STANDARD: Los Silva — direct, builder-first, contrarian, specific numbers, named clients. If a post sounds like it could come from any business coach, it fails.

FORBIDDEN: leverage, synergy, game-changer, revolutionary, unlock, empower, "I'm excited", "In today's landscape"

For each post, provide:
1. WEAKNESSES: List every specific weakness (vague claims, missing proof, generic language, wrong tone, weak hook, etc.)
2. STRONGEST ELEMENT: What works best and should be preserved
3. REVISION INSTRUCTIONS: Exact instructions to fix each weakness

Output ONLY valid JSON: { "critiques": [{ "post_id": "...", "weaknesses": ["..."], "strongest_element": "...", "revision_instructions": ["..."] }] }`;

// ── Stage 3: Revise ──────────────────────────────────────────────
function buildReviseSystem(contextStr: string) {
  return `You are the ELIOS Content Revision Agent. You receive content with critique notes and must produce improved versions.

BUSINESS CONTEXT:
${contextStr}

RULES:
- Preserve the strongest elements identified by the critic
- Fix EVERY weakness identified
- Maintain Los's voice: direct, specific, builder-first
- The revised version must be materially better — not just minor word swaps
- The hook line goes in "hook" field ONLY. Do NOT repeat it in "body".

Output the same JSON structure as the original posts with the improved content.`;
}

// ── Stage 4: Independent Score ───────────────────────────────────
const SCORE_SYSTEM = `You are an independent SPCL Scoring Agent. You did NOT write or revise this content. Score it honestly and harshly.

SPCL SCORING RUBRIC:

STATUS (weight 0.18):
  9-10: Names a specific outcome only accessible through elite access (e.g., "I sat in on a $2M deal negotiation")
  7-8: Implies scarce access without naming it specifically
  5-6: General authority claim without proof
  <5: No status signal

POWER (weight 0.20 — highest):
  9-10: Gives a complete, implementable framework with steps someone could follow TODAY
  7-8: Teaches a principle with one specific example
  5-6: Makes a claim about what works without showing how
  <5: Generic advice

CREDIBILITY (weight 0.15):
  9-10: Names a specific client, dollar amount, AND timeframe
  7-8: References a real result without all three specifics
  5-6: Claims results without naming anything specific
  <5: No proof

LIKENESS (weight 0.10):
  9-10: Sounds unmistakably like Los — builder-first, contrarian, uses signature phrases ("Claude-native", "no middleware", "deployed URL not a workflow diagram")
  7-8: Consistent voice but without signature phrases
  5-6: Generic professional tone
  <5: Sounds like ChatGPT

ICP_FIT (weight 0.12): How well does this post address the specific pains/outcomes of the target audience?
CONVERSION_RELEVANCE (weight 0.10): How likely is this to move a $10K+ buyer toward a conversation?
PLATFORM_FIT (weight 0.08): Does it match the platform's format, length, and engagement patterns?
NOVELTY (weight 0.05): Is this a fresh angle, or has this been said 1000 times?
RISK (penalty -0.08): Could this damage brand, alienate buyers, or be factually wrong?

CRITICAL: Score honestly. A mediocre post should score 50-65. Only genuinely excellent, specific, proof-laden content should score 80+. Do NOT grade on a curve. Be harsh.

Output ONLY valid JSON.`;

// ── Scoring math ─────────────────────────────────────────────────
function calcTotal(s: any, weights: Record<string, number>) {
  return Math.round(
    s.status * (weights.status || 0.18) * 10 +
    s.power * (weights.power || 0.20) * 10 +
    s.credibility * (weights.credibility || 0.15) * 10 +
    s.likeness * (weights.likeness || 0.10) * 10 +
    s.icp_fit * (weights.icp_fit || 0.12) * 10 +
    s.conversion_relevance * (weights.conversion_relevance || 0.10) * 10 +
    s.platform_fit * (weights.platform_fit || 0.08) * 10 +
    s.novelty * (weights.novelty || 0.05) * 10 -
    s.risk * Math.abs(weights.risk || -0.08) * 10
  );
}

function routeStatus(total: number) {
  return total >= 90 ? "publish" : total >= 75 ? "review" : total >= 60 ? "regenerate" : "discard";
}

// ── Main handler ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { atoms, plan, platform, count = 3, audience_id, awareness_stage } = await req.json();

    const sharedCtx = await fetchSharedContext();
    const contextStr = sharedCtx ? formatContextForPrompt(sharedCtx) : JSON.stringify(ELIOS_CONTEXT, null, 2);
    const platformSpec = sharedCtx?.platform_specs[platform] ?? ELIOS_CONTEXT.platform_specs[platform as keyof typeof ELIOS_CONTEXT.platform_specs];
    const audience = sharedCtx?.audiences.find((a: any) => a.id === audience_id) ?? ELIOS_CONTEXT.audiences.find(a => a.id === audience_id) ?? ELIOS_CONTEXT.audiences[0];
    const weights = sharedCtx?.spcl_weights ?? SPCL_WEIGHTS;

    // ── STAGE 1: Generate raw content (no scoring) ───────────────
    const genPrompt = `Generate ${count} ${platform.toUpperCase()} posts.

TARGET AUDIENCE: ${audience.name}
AUDIENCE PAINS: ${audience.top_pains.join("; ")}
AWARENESS STAGE: ${awareness_stage || "problem_aware"}
WEEKLY ANGLES: ${plan?.core_angles?.join(", ") || "Use business context"}
PRIMARY OFFER THIS WEEK: ${plan?.offer_priority || "advisory_os"}
AVAILABLE ATOMS: ${atoms ? JSON.stringify(atoms.slice(0, 8)) : "Use business context directly"}

PLATFORM SPEC:
${JSON.stringify(platformSpec, null, 2)}

For each post, output:
{
  "id": "unique_id",
  "platform": "${platform}",
  "awareness_stage": "${awareness_stage || "problem_aware"}",
  "audience_id": "${audience_id || "agency_owners"}",
  "objective": "what this post achieves",
  "hook": "the opening line only -- do NOT repeat this in body",
  "body": "full post body text -- start AFTER the hook, do not repeat the hook here",
  "cta": "the call to action -- a single closing line or sentence",
  "spcl_primary": "S|P|C|L",
  "rationale": "Why this post will attract $10K+ buyers",
  "proof_used": ["proof IDs referenced"]
}

Do NOT include scores — scoring is handled by a separate agent.
Wrap all ${count} posts in: {"assets": [...]}`;

    const genRaw = await callClaude(buildGenSystem(contextStr), genPrompt, "claude-opus-4-5", 6000);
    const genResult = JSON.parse(genRaw);
    const drafts = genResult.assets || [];

    if (drafts.length === 0) {
      return NextResponse.json({ assets: [], pipeline: "no_drafts" });
    }

    // ── STAGE 2: Critique (Sonnet — fast, cheap, independent) ────
    const critiquePrompt = `Critique these ${platform.toUpperCase()} posts written for ${audience.name} at the ${awareness_stage || "problem_aware"} awareness stage.

POSTS TO CRITIQUE:
${JSON.stringify(drafts, null, 2)}

For each post, identify every weakness and provide specific revision instructions.`;

    const critiqueRaw = await callClaude(CRITIQUE_SYSTEM, critiquePrompt, "claude-sonnet-4-20250514", 4000);
    let critiques: any[] = [];
    try {
      const critiqueResult = JSON.parse(critiqueRaw);
      critiques = critiqueResult.critiques || [];
    } catch {
      // If critique parsing fails, continue without it
      console.error("Critique parse failed, continuing with drafts");
    }

    // ── STAGE 3: Revise based on critique ────────────────────────
    let revisedAssets = drafts;

    if (critiques.length > 0) {
      const revisePrompt = `Revise these posts based on the critique notes below.

ORIGINAL POSTS:
${JSON.stringify(drafts, null, 2)}

CRITIQUE NOTES:
${JSON.stringify(critiques, null, 2)}

TARGET: ${audience.name}, ${awareness_stage || "problem_aware"} stage, ${platform} platform.

For each post, produce a revised version. Preserve what works. Fix every identified weakness. Output the same JSON structure:
{"assets": [...]}

Each asset must have: id, platform, awareness_stage, audience_id, objective, hook, body, cta, spcl_primary, rationale, proof_used.
Do NOT include scores.`;

      try {
        const reviseRaw = await callClaude(buildReviseSystem(contextStr), revisePrompt, "claude-opus-4-5", 6000);
        const reviseResult = JSON.parse(reviseRaw);
        if (reviseResult.assets && reviseResult.assets.length > 0) {
          revisedAssets = reviseResult.assets;
        }
      } catch {
        console.error("Revision parse failed, using original drafts");
      }
    }

    // ── STAGE 4: Independent scoring (Sonnet) ────────────────────
    const scorePrompt = `Score each of these ${platform.toUpperCase()} posts independently.

TARGET AUDIENCE: ${audience.name}
AWARENESS STAGE: ${awareness_stage || "problem_aware"}

POSTS TO SCORE:
${JSON.stringify(revisedAssets.map((a: any) => ({ id: a.id, hook: a.hook, body: a.body, cta: a.cta, spcl_primary: a.spcl_primary })), null, 2)}

For each post, score on all dimensions (0-10 each):
status, power, credibility, likeness, icp_fit, conversion_relevance, platform_fit, novelty, risk

Output ONLY valid JSON:
{"scores": [{"post_id": "...", "status": N, "power": N, "credibility": N, "likeness": N, "icp_fit": N, "conversion_relevance": N, "platform_fit": N, "novelty": N, "risk": N}]}`;

    let independentScores: any[] = [];
    try {
      const scoreRaw = await callClaude(SCORE_SYSTEM, scorePrompt, "claude-sonnet-4-20250514", 3000);
      const scoreResult = JSON.parse(scoreRaw);
      independentScores = scoreResult.scores || [];
    } catch {
      console.error("Independent scoring failed");
    }

    // ── Merge scores into assets ─────────────────────────────────
    const finalAssets = revisedAssets.map((asset: any, idx: number) => {
      // Find matching independent score
      const indScore = independentScores.find((s: any) => s.post_id === asset.id)
        || independentScores[idx]
        || { status: 5, power: 5, credibility: 5, likeness: 5, icp_fit: 5, conversion_relevance: 5, platform_fit: 5, novelty: 5, risk: 3 };

      const scores = {
        status: indScore.status || 5,
        power: indScore.power || 5,
        credibility: indScore.credibility || 5,
        likeness: indScore.likeness || 5,
        icp_fit: indScore.icp_fit || 5,
        conversion_relevance: indScore.conversion_relevance || 5,
        platform_fit: indScore.platform_fit || 5,
        novelty: indScore.novelty || 5,
        risk: indScore.risk || 3,
        total: 0,
      };
      scores.total = calcTotal(scores, weights);

      return {
        ...asset,
        scores,
        status: routeStatus(scores.total),
        pipeline: "generate→critique→revise→score",
      };
    });

    // Sort by total score descending
    finalAssets.sort((a: any, b: any) => b.scores.total - a.scores.total);

    return NextResponse.json({ assets: finalAssets });
  } catch (e) {
    console.error("Generate pipeline error:", e);
    return NextResponse.json({ error: "Generation pipeline failed" }, { status: 500 });
  }
}
