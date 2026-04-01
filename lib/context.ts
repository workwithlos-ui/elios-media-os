// lib/context.ts — The canonical business context object
// This is the single source of truth injected into every agent

export const ELIOS_CONTEXT = {
  business: {
    name: "ELIOS",
    founder: "Los Silva",
    current_priority: "pipeline_now",
    revenue_target_30d: 75000,
    cash_urgency: "high",
    primary_offer: "AI Operating Systems — Custom Builds",
    offers: [
      { id: "advisory_os", name: "Advisory Board OS", setup: 20000, monthly: 2000, desc: "5 AI executives 24/7" },
      { id: "content_os", name: "Content OS", setup: 2000, monthly: 1500, desc: "1 input → 50 posts" },
      { id: "sales_os", name: "Sales Acceleration OS", setup: 5000, monthly: 3000, desc: "Speed-to-lead 60s" },
      { id: "cmo_os", name: "CMO OS", setup: 5000, monthly: 1500, desc: "Fractional CMO command center" },
      { id: "aeo_os", name: "AEO OS", setup: 5000, monthly: 4000, desc: "AI search presence" },
      { id: "custom_build", name: "Custom AI Build", setup: 10000, monthly: 3000, desc: "Full-stack Claude-native system" },
    ],
    constraints: ["Claude-native only — no n8n, no Make.com, no Zapier", "Build once sell many", "Every build becomes a product"],
  },

  audiences: [
    {
      id: "agency_owners",
      name: "Agency Owners $1M–$20M",
      top_pains: [
        "Scaling by hiring — $300K+ overhead, thin margins",
        "Content agency charging $4.5K/mo for generic output",
        "Speed-to-lead problems — leads go cold overnight",
        "No attribution from content to revenue",
        "Strategic decisions made alone or in quarterly advisor meetings",
      ],
      desired_outcomes: ["Replace headcount with AI infrastructure", "Inbound pipeline from content", "60-second lead response", "Systems that run without them"],
      objections: ["Too expensive — want ROI proof first", "Already have n8n/Make.com stack", "Not sure it'll sound like us"],
      buying_triggers: ["About to make next hire", "Just lost deal to faster competitor", "Agency contract renewal coming up"],
      spend_level: "10000-30000",
      awareness_stage_distribution: { unaware: 0.15, problem_aware: 0.45, solution_aware: 0.25, product_aware: 0.10, most_aware: 0.05 },
    },
    {
      id: "dtc_brands",
      name: "DTC Brands $5M–$50M",
      top_pains: [
        "Content volume — can't match competitors without a big team",
        "Attribution blindness — no idea which content closed buyers",
        "Agency producing generic content that doesn't convert",
        "UGC and testimonials sitting unused",
      ],
      desired_outcomes: ["Volume at scale", "Closed-loop attribution", "Content that sounds like the brand"],
      objections: ["We already use AI tools", "Our brand voice is unique"],
      buying_triggers: ["Platform algorithm change", "Competitor pulling ahead on organic", "ROAS declining on paid"],
      spend_level: "5000-20000",
      awareness_stage_distribution: { unaware: 0.20, problem_aware: 0.40, solution_aware: 0.25, product_aware: 0.10, most_aware: 0.05 },
    },
    {
      id: "personal_brands",
      name: "Personal Brand Experts",
      top_pains: [
        "Content doesn't sound like them — reads like ChatGPT",
        "No time for volume — posting 1-2x/week at best",
        "No system for turning expertise into consistent output",
      ],
      desired_outcomes: ["Content that sounds exactly like them", "50+ pieces/week from one recording", "Inbound leads from authority content"],
      objections: ["I've tried AI content tools — they all sound generic"],
      buying_triggers: ["Competitor gaining ground on social", "Speaking engagement or launch coming up"],
      spend_level: "3000-15000",
      awareness_stage_distribution: { unaware: 0.25, problem_aware: 0.45, solution_aware: 0.20, product_aware: 0.08, most_aware: 0.02 },
    },
    {
      id: "home_services",
      name: "Home Services $1M–$10M",
      top_pains: [
        "Losing bids to competitors with worse work but more online presence",
        "No content system — post when someone has time (never)",
        "Speed-to-lead — after-hours leads go cold",
        "Local trust deficit vs national brands",
      ],
      desired_outcomes: ["Consistent local presence", "Every job becomes content", "Speed-to-lead 24/7"],
      objections: ["We're not a content company", "Don't have time for social media"],
      buying_triggers: ["Slow season", "Lost big contract to more visible competitor"],
      spend_level: "3000-10000",
      awareness_stage_distribution: { unaware: 0.35, problem_aware: 0.40, solution_aware: 0.15, product_aware: 0.08, most_aware: 0.02 },
    },
  ],

  proof_bank: [
    { id: "p1", type: "case_study", client: "Sales AI Client", summary: "Speed-to-lead: 4 hours 14 minutes → 58 seconds. AI SDR deployed.", strength: 0.95, metric: "4hr → 60s" },
    { id: "p2", type: "case_study", client: "Kent Clothier", summary: "Boardroom Brain — RAG system on Claude for mastermind knowledge. $35K build.", strength: 0.90, metric: "$35K deal" },
    { id: "p3", type: "case_study", client: "Trusted Roofing", summary: "Full CMO OS deployed. Los holds equity stake.", strength: 0.85, metric: "Equity stake" },
    { id: "p4", type: "build_proof", client: "ELIOS OS", summary: "5 live systems deployed in one session. Live at elios-os-los-projects-43728f1d.vercel.app", strength: 0.92, metric: "5 live URLs" },
    { id: "p5", type: "category_proof", client: "Market", summary: "$200K+ headcount replaced per client. Agency overhead at 28% of revenue on average.", strength: 0.80, metric: "$200K replaced" },
  ],

  voice: {
    tone: ["direct", "builder-first", "contrarian", "calm authority", "no fluff"],
    style_ref: "Alex Hormozi meets the agency founder who stopped hiring. Short punchy sentences. Every claim backed by a number or a story. Contrarian angles stated as facts.",
    forbidden: ["leverage", "synergy", "game-changer", "revolutionary", "unlock", "empower", "at the end of the day", "in today's landscape"],
    preferred_patterns: ["specific numbers", "before/after", "named clients", "show the URL", "call out n8n directly", "infrastructure not tools"],
    signature_phrases: ["Claude-native", "no middleware", "deployed URL not a workflow diagram", "build once sell many", "speed-to-lead", "operating system not a tool"],
  },

  platform_specs: {
    linkedin: { format: "long-form post", max_chars: 3000, best_performing: "carousels (21.77% eng)", hook_style: "specific number or confession", cta: "DM keyword or comment" },
    twitter: { format: "thread 5-8 tweets", max_chars: 280, best_performing: "threads with proof", hook_style: "hot take or contrarian claim", cta: "reply or retweet" },
    instagram: { format: "caption + carousel", max_chars: 2200, best_performing: "before/after carousels", hook_style: "visual proof lead", cta: "DM for resource" },
    newsletter: { format: "beehiiv email", max_chars: 600, best_performing: "one-problem one-solution", hook_style: "subject line as secret", cta: "link to system or call" },
    shorts: { format: "60s video script", max_chars: 200, best_performing: "hook in first 3 words", hook_style: "pattern interrupt", cta: "follow or DM" },
    youtube: { format: "long-form script outline", max_chars: 5000, best_performing: "proof-forward opening", hook_style: "result first then how", cta: "subscribe + link in desc" },
  },
};

export type BusinessContext = typeof ELIOS_CONTEXT;

export const SPCL_WEIGHTS = {
  status: 0.18,
  power: 0.20,    // Highest — Hormozi says this is the strongest lever
  credibility: 0.15,
  likeness: 0.10,
  icp_fit: 0.12,
  conversion_relevance: 0.10,
  platform_fit: 0.08,
  novelty: 0.05,
  risk: -0.08,    // Subtract risk
};

export const AWARENESS_STAGES = ["unaware", "problem_aware", "solution_aware", "product_aware", "most_aware"] as const;
export type AwarenessStage = typeof AWARENESS_STAGES[number];

export const PLATFORMS = ["linkedin", "twitter", "instagram", "newsletter", "shorts", "youtube"] as const;
export type Platform = typeof PLATFORMS[number];

export interface ContentAtom {
  type: "claim" | "story" | "framework" | "proof" | "objection_answer" | "contrarian_take" | "cta_bridge";
  content: string;
  spcl_primary: "S" | "P" | "C" | "L";
  audience_ids: string[];
  awareness_stages: AwarenessStage[];
  proof_ids: string[];
  strength: number;
}

export interface GeneratedAsset {
  id: string;
  platform: Platform;
  awareness_stage: AwarenessStage;
  audience_id: string;
  objective: string;
  hook: string;
  body: string;
  cta: string;
  spcl_primary: "S" | "P" | "C" | "L";
  scores: {
    status: number;
    power: number;
    credibility: number;
    likeness: number;
    icp_fit: number;
    conversion_relevance: number;
    platform_fit: number;
    novelty: number;
    risk: number;
    total: number;
  };
  rationale: string;
  proof_used: string[];
  atoms_used: string[];
  status: "publish" | "review" | "regenerate" | "discard";
}

export interface WeeklyPlan {
  week_of: string;
  primary_goal: string;
  audience_priority: string;
  offer_priority: string;
  awareness_mix: Record<AwarenessStage, number>;
  asset_targets: Record<Platform, number>;
  core_angles: string[];
  cta_path: {
    top_of_funnel: string;
    mid_funnel: string;
    bottom_funnel: string;
  };
  revenue_rationale: string;
}
