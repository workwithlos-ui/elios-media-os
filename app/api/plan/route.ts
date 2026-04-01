import { NextRequest, NextResponse } from "next/server";
import { ELIOS_CONTEXT } from "@/lib/context";

const PLAN_SYSTEM = `You are the ELIOS Chief Strategy Agent. You decide the weekly media plan.

BUSINESS CONTEXT:
${JSON.stringify(ELIOS_CONTEXT, null, 2)}

HORMOZI'S SPCL FRAMEWORK:
- Status (18%): Control of scarce resources/outcomes others want
- Power (20% — highest weight): Say-do correspondence. Give advice that works. This is the strongest lever.
- Credibility (15%): Third-party validation, specific proof, objective metrics
- Likeness (10%): Authenticity, shared values, founder-real

AWARENESS STAGE RULES:
- Unaware: curiosity hooks, contrarian observations, pattern interrupts
- Problem-aware: pain articulation, diagnosis, "this is why you're stuck"
- Solution-aware: framework teaching, comparisons, process breakdowns  
- Product-aware: proof posts, objection handling, implementation stories
- Most aware: direct CTA, urgency, offer specifics

WEEKLY ASSET WEIGHT (Hormozi-aligned):
- 40% Power posts (frameworks, audits, teardowns)
- 25% Credibility posts (case studies, proof, results)
- 20% Likeness posts (founder POV, story, beliefs)
- 15% Status posts (elite access, scale signals, hard-won patterns)

Revenue urgency is HIGH. Pipeline_now mode. Prioritize posts that attract buyers over posts that build brand.

Output ONLY valid JSON matching the WeeklyPlan type.`;

export async function POST(req: NextRequest) {
  try {
    const { atoms, recent_performance, week_number } = await req.json();

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `Generate the weekly media plan.
          
Week number: ${week_number || 1}
Revenue target (30-day): $75,000
Cash urgency: HIGH — pipeline now, not authority building

Available content atoms: ${atoms ? JSON.stringify(atoms.slice(0, 5)) : "No atoms yet — use business context"}

Recent performance: ${recent_performance || "No data yet — first week"}

Output a WeeklyPlan JSON:
{
  "week_of": "2026-04-${String(((week_number || 1) - 1) * 7 + 1).padStart(2, '0')}",
  "primary_goal": "string — specific and measurable",
  "audience_priority": "agency_owners|dtc_brands|personal_brands|home_services",
  "offer_priority": "advisory_os|content_os|sales_os|cmo_os|aeo_os|custom_build",
  "awareness_mix": {
    "unaware": 0.10,
    "problem_aware": 0.45,
    "solution_aware": 0.30,
    "product_aware": 0.12,
    "most_aware": 0.03
  },
  "asset_targets": {
    "linkedin": 5,
    "twitter": 3,
    "instagram": 2,
    "newsletter": 1,
    "shorts": 2,
    "youtube": 0
  },
  "core_angles": ["angle 1", "angle 2", "angle 3"],
  "cta_path": {
    "top_of_funnel": "follow for more",
    "mid_funnel": "DM keyword",
    "bottom_funnel": "book 15-min call"
  },
  "revenue_rationale": "Why this plan prioritizes $75K revenue target this week"
}`
        }],
        system: PLAN_SYSTEM,
      }),
    });

    const data = await res.json();
    const raw = data.content?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(clean));
  } catch (e) {
    console.error("Plan error:", e);
    return NextResponse.json({ error: "Planning failed" }, { status: 500 });
  }
}
