import { NextRequest, NextResponse } from "next/server";
import { SPCL_WEIGHTS } from "@/lib/context";

export async function POST(req: NextRequest) {
  try {
    const { scores } = await req.json();
    const s = scores;
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
    return NextResponse.json({ total, status });
  } catch (e) {
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
