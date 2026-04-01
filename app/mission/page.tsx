"use client";
import { useState, useEffect } from "react";
import { ELIOS_CONTEXT } from "@/lib/context";

const WEEK_TARGETS = { linkedin: 7, twitter: 3, instagram: 2, newsletter: 1, shorts: 2, youtube: 0 };
const WEEK_DONE = { linkedin: 2, twitter: 1, instagram: 0, newsletter: 0, shorts: 0, youtube: 0 };

const REVIEW_QUEUE = [
  { id: "a1", hook: "I stopped hiring. Started building. Here's the math.", platform: "LinkedIn", score: 92, status: "publish", spcl: "P" },
  { id: "a2", hook: "n8n is not AI. Here's what AI actually looks like deployed.", platform: "LinkedIn", score: 88, status: "review", spcl: "P" },
  { id: "a3", hook: "Your content agency is charging $4,500/mo to sound like everyone else.", platform: "LinkedIn", score: 85, status: "review", spcl: "C" },
  { id: "a4", hook: "Industry avg speed-to-lead: 47 hours. Ours: 60 seconds.", platform: "Twitter", score: 79, status: "review", spcl: "P" },
  { id: "a5", hook: "The roofing company with 200 posts beat the one with 30 years experience.", platform: "LinkedIn", score: 71, status: "regenerate", spcl: "S" },
];

const PIPELINE = [
  { name: "Sales AI Client", offer: "Sales OS", value: 8000, stage: "Proposal Sent", days: 3 },
  { name: "Kent Clothier", offer: "Custom Build", value: 35000, stage: "Delivery", days: 0 },
  { name: "Inbound — Agency Owner", offer: "Advisory OS", value: 22000, stage: "Demo Booked", days: 1 },
  { name: "DTC Brand (cold DM)", offer: "Content OS", value: 3500, stage: "Interest", days: 5 },
];

export default function MissionControl() {
  const [approved, setApproved] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState<string[]>([]);

  const totalTarget = Object.values(WEEK_TARGETS).reduce((a, b) => a + b, 0);
  const totalDone = Object.values(WEEK_DONE).reduce((a, b) => a + b, 0);
  const pct = Math.round((totalDone / totalTarget) * 100);

  const pipeline_total = PIPELINE.reduce((a, b) => a + b.value, 0);
  const gap = ELIOS_CONTEXT.business.revenue_target_30d - pipeline_total;

  const scoreClass = (s: number) =>
    s >= 90 ? "score-publish" : s >= 75 ? "score-review" : s >= 60 ? "score-regenerate" : "score-discard";
  const spclClass = (s: string) => `spcl-${s.toLowerCase()}`;

  return (
    <div className="page-pad">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>April 2026 · Week 1</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Mission Control</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Pipeline now. Every asset must move money or build the case for it.</p>
      </div>

      {/* Top metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "April Target", val: "$75,000", color: "var(--fire)", sub: "High urgency" },
          { label: "Pipeline Value", val: `$${pipeline_total.toLocaleString()}`, color: "var(--green)", sub: `${PIPELINE.length} active deals` },
          { label: "Revenue Gap", val: `$${gap.toLocaleString()}`, color: gap > 30000 ? "var(--amber)" : "var(--green)", sub: "Needs closing" },
          { label: "Content Progress", val: `${totalDone}/${totalTarget}`, color: "var(--text)", sub: `${pct}% this week` },
        ].map(m => (
          <div key={m.label} className="card metric-card">
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 500, color: m.color, marginBottom: 3 }}>{m.val}</div>
            <div style={{ fontSize: 11, color: "var(--dim)" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Weekly content quota */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Weekly Quota</div>
            <div className="score-badge score-review">{pct}%</div>
          </div>
          {Object.entries(WEEK_TARGETS).map(([platform, target]) => {
            const done = WEEK_DONE[platform as keyof typeof WEEK_DONE] || 0;
            const p = Math.min(100, Math.round((done / target) * 100));
            return (
              <div key={platform} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, textTransform: "capitalize", color: "var(--muted)" }}>{platform}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: done >= target ? "var(--green)" : "var(--text)" }}>{done}/{target}</span>
                </div>
                <div className="score-bar">
                  <div className="score-bar-fill" style={{
                    width: `${p}%`,
                    background: done >= target ? "var(--green)" : done > 0 ? "var(--amber)" : "var(--dim)"
                  }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <a href="/content" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fire)", textDecoration: "none", fontWeight: 500 }}>
              Generate content → Content Engine
            </a>
          </div>
        </div>

        {/* Active pipeline */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Active Pipeline</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--green)" }}>${pipeline_total.toLocaleString()}</div>
          </div>
          {PIPELINE.map(deal => (
            <div key={deal.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{deal.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{deal.offer} · {deal.stage}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--green)" }}>${deal.value.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 2 }}>{deal.days === 0 ? "Active" : `${deal.days}d ago`}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "10px 12px", background: "var(--fire-soft)", border: "1px solid var(--fire-bd)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--fire)", fontWeight: 500 }}>${gap.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>Still needed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Queue */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Review Queue</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Score-ranked. Approve → Copy → Post. Takes 10 minutes.</div>
          </div>
          <a href="/content" style={{ fontSize: 12, color: "var(--fire)", textDecoration: "none" }}>Generate more →</a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {REVIEW_QUEUE.map(asset => (
            <div key={asset.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: "var(--panel-2)", borderRadius: "var(--r-sm)",
              border: `1px solid ${approved.includes(asset.id) ? "rgba(26,158,117,0.3)" : "var(--line)"}`,
              opacity: approved.includes(asset.id) ? 0.6 : 1,
              transition: "all 0.2s"
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--fire)" }}>{asset.score}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{asset.hook}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "var(--muted)" }}>{asset.platform}</span>
                  <span className={`score-badge ${spclClass(asset.spcl)}`} style={{ padding: "1px 6px", fontSize: 10 }}>SPCL-{asset.spcl}</span>
                  <span className={`score-badge ${scoreClass(asset.score)}`} style={{ padding: "1px 6px", fontSize: 10 }}>{asset.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                {asset.status !== "regenerate" && (
                  <button
                    className="btn btn-dark"
                    style={{ padding: "6px 12px", fontSize: 11 }}
                    onClick={() => {
                      navigator.clipboard.writeText(asset.hook);
                    }}
                  >Copy</button>
                )}
                {!approved.includes(asset.id) && asset.status !== "regenerate" ? (
                  <button
                    className="btn btn-fire"
                    style={{ padding: "6px 12px", fontSize: 11 }}
                    onClick={() => setApproved(prev => [...prev, asset.id])}
                  >✓ Approve</button>
                ) : asset.status === "regenerate" ? (
                  <button
                    className="btn btn-ghost"
                    style={{ padding: "6px 12px", fontSize: 11 }}
                    onClick={() => {
                      setRegenerating(prev => [...prev, asset.id]);
                      setTimeout(() => setRegenerating(prev => prev.filter(id => id !== asset.id)), 2000);
                    }}
                  >
                    {regenerating.includes(asset.id) ? "⟳" : "Regenerate"}
                  </button>
                ) : (
                  <div style={{ fontSize: 11, color: "var(--green)", padding: "6px 12px" }}>✓ Approved</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This week's plan summary */}
      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>This Week's Angles</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { angle: "Why hiring is the wrong scaling model", spcl: "L", audience: "Agency Owners" },
            { angle: "60-second speed-to-lead — the proof post", spcl: "P", audience: "Agency Owners" },
            { angle: "n8n vs Claude-native — architecture breakdown", spcl: "P", audience: "Agencies + DTC" },
          ].map((a, i) => (
            <div key={i} style={{ padding: "12px 14px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 12, marginBottom: 6, lineHeight: 1.5 }}>{a.angle}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <span className={`score-badge spcl-${a.spcl.toLowerCase()}`} style={{ fontSize: 10, padding: "1px 7px" }}>SPCL-{a.spcl}</span>
                <span style={{ fontSize: 10, color: "var(--dim)" }}>{a.audience}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>
          <a href="/plan" style={{ fontSize: 12, color: "var(--fire)", textDecoration: "none" }}>→ Full weekly plan</a>
          <a href="/source" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>→ Ingest new source</a>
        </div>
      </div>
    </div>
  );
}
