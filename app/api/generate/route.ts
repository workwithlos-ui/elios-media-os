import { NextRequest, NextResponse } from "next/server";
import { ELIOS_CONTEXT, SPCL_WEIGHTS } from "@/lib/context";

const GEN_SYSTEM = `You are the ELIOS Content Generation + SPCL Scoring Agent. 

BUSINESS CONTEXT:
${JSON.stringify(ELIOS_CONTEXT, null, 2)}

SPCL SCORING FORMULA (weights):
Status: 0.18, Power: 0.20 (highest), Credibility: 0.15, Likeness: 0.10
ICP fit: 0.12, Conversion relevance: 0.10, Platform fit: 0.08, Novelty: 0.05
Risk penalty: -0.08

ROUTING RULES:
- 90+ total score → status: "publish"
- 75-89 → status: "review"  
- 60-74 → status: "regenerate"
- <60 → status: "discard"

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

Generate content that attracts buyers who can write $10K–$30K checks. Not likes. Buyers.`;

export async function POST(req: NextRequest) {
  try {
    const { atoms, plan, platform, count = 3, audience_id, awareness_stage } = await req.json();

    const platformSpec = ELIOS_CONTEXT.platform_specs[platform as keyof typeof ELIOS_CONTEXT.platform_specs];
    const audience = ELIOS_CONTEXT.audiences.find(a => a.id === audience_id) || ELIOS_CONTEXT.audiences[0];

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 6000,
        messages: [{
          role: "user",
          content: `Generate ${count} ${platform.toUpperCase()} posts.

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
  "hook": "the first line/sentence",
  "body": "full post content",
  "cta": "the call to action",
  "spcl_primary": "S|P|C|L",
  "scores": {
    "status": 0-10,
    "power": 0-10,
    "credibility": 0-10,
    "likeness": 0-10,
    "icp_fit": 0-10,
    "conversion_relevance": 0-10,
    "platform_fit": 0-10,
    "novelty": 0-10,
    "risk": 0-10,
    "total": calculated_0_to_100
  },
  "rationale": "Why this post will attract $10K+ buyers",
  "proof_used": ["proof IDs referenced"],
  "status": "publish|review|regenerate|discard"
}

Wrap all ${count} posts in: {"assets": [...]}`
        }],
        system: GEN_SYSTEM,
      }),
    });

    const data = await res.json();
    const raw = data.content?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Recalculate total scores server-side using the formula
    if (result.assets) {
      result.assets = result.assets.map((asset: any) => {
        const s = asset.scores;
        const total = Math.round(
          s.status * SPCL_WEIGHTS.status * 10 +
          s.power * SPCL_WEIGHTS.power * 10 +
          s.credibility * SPCL_WEIGHTS.credibility * 10 +
          s.likeness * SPCL_WEIGHTS.likeness * 10 +
          s.icp_fit * SPCL_WEIGHTS.icp_fit * 10 +
          s.conversion_relevance * SPCL_WEIGHTS.conversion_relevance * 10 +
          s.platform_fit * SPCL_WEIGHTS.platform_fit * 10 +
          s.novelty * SPCL_WEIGHTS.novelty * 10 -
          s.risk * Math.abs(SPCL_WEIGHTS.risk) * 10
        );
        const status = total >= 90 ? "publish" : total >= 75 ? "review" : total >= 60 ? "regenerate" : "discard";
        return { ...asset, scores: { ...s, total }, status };
      });
      // Sort by total score descending
      result.assets.sort((a: any, b: any) => b.scores.total - a.scores.total);
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
