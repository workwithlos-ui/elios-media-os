import { NextRequest, NextResponse } from "next/server";
import { ELIOS_CONTEXT, ContentAtom } from "@/lib/context";

const EXTRACT_SYSTEM = `You are the ELIOS Source Distillation Agent. Your job is to extract reusable content atoms from raw source material.

BUSINESS CONTEXT:
${JSON.stringify(ELIOS_CONTEXT, null, 2)}

Extract every reusable idea into typed atoms. Each atom is ONE of:
- claim: direct assertion with a specific number or outcome
- story: narrative with tension, resolution, and business lesson  
- framework: named repeatable system or process
- proof: concrete evidence, result, or third-party validation
- objection_answer: response to a buyer objection
- contrarian_take: anti-consensus angle that challenges assumptions
- cta_bridge: sentence linking value to action

For each atom, determine:
- Which SPCL pillar it primarily serves (S=Status, P=Power, C=Credibility, L=Likeness)
- Which audience IDs it resonates with most
- Which awareness stages it's best for
- Which proof assets from the bank it references
- Strength score 0-1

CRITICAL: Los's voice is direct, specific, builder-first. No fluff. Every claim needs a number or a story. Flag generic inspiration as low strength (< 0.4).

Output ONLY valid JSON:
{
  "source_summary": "2-sentence summary of what the source is about",
  "core_thesis": "The single most powerful idea in this source",
  "atoms": [
    {
      "type": "claim|story|framework|proof|objection_answer|contrarian_take|cta_bridge",
      "content": "The exact reusable atom content — written in Los's voice",
      "spcl_primary": "S|P|C|L",
      "audience_ids": ["agency_owners"],
      "awareness_stages": ["problem_aware", "solution_aware"],
      "proof_ids": ["p1"],
      "strength": 0.85
    }
  ],
  "top_hooks": ["5 high-impact hooks derived from this source"],
  "best_proof_moments": ["Specific quotable proof moments"],
  "content_angles": ["5-7 angles this source could become"]
}`;

export async function POST(req: NextRequest) {
  try {
    const { source, source_type } = await req.json();
    if (!source?.trim()) return NextResponse.json({ error: "No source provided" }, { status: 400 });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `SOURCE TYPE: ${source_type || "text"}\n\nSOURCE MATERIAL:\n${source}\n\nExtract all content atoms. Be thorough — extract every reusable idea, even small ones. Minimum 8 atoms, maximum 25.`
        }],
        system: EXTRACT_SYSTEM,
      }),
    });

    const data = await res.json();
    const raw = data.content?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Extract error:", e);
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
  }
}
