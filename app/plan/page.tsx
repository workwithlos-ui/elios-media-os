"use client";
import { useState } from "react";
import { ELIOS_CONTEXT } from "@/lib/context";

export default function WeeklyPlan() {
  const [week, setWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState("");

  async function generatePlan() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week_number: week }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
    } catch (e: any) { setError(e.message || "Planning failed"); }
    finally { setLoading(false); }
  }

  const SPCL_MIX = [
    { label: "Power", pct: 40, color: "var(--fire)", desc: "Frameworks, audits, actionable breakdowns" },
    { label: "Credibility", pct: 25, color: "var(--green)", desc: "Case studies, proof, named results" },
    { label: "Likeness", pct: 20, color: "var(--blue)", desc: "Founder POV, beliefs, behind the scenes" },
    { label: "Status", pct: 15, color: "var(--purple)", desc: "Elite access, scale signals, hard patterns" },
  ];

  return (
    <div className="page-pad">
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Chief Strategy Agent</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Weekly Plan</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, maxWidth: "56ch" }}>The strategy agent determines this week's objective, audience priority, SPCL mix, asset targets, and CTA path — based on revenue target and cash urgency.</p>
      </div>

      {/* SPCL mix — always visible */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Hormozi SPCL Weekly Mix</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {SPCL_MIX.map(m => (
            <div key={m.label} style={{ padding: "14px 16px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: `1px solid rgba(255,255,255,0.06)`, borderTop: `3px solid ${m.color}` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 500, color: m.color, marginBottom: 4 }}>{m.pct}%</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--fire-soft)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          <span style={{ color: "var(--fire)", fontWeight: 500 }}>Hormozi's rule: </span>Power gets 40% because "giving directions that work creates the strongest influence." Revenue urgency is HIGH — weight toward Power + Credibility this week.
        </div>
      </div>

      {/* Week selector + generate */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: loading ? 16 : 0 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ marginBottom: 8 }}>Week</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4].map(w => (
                <button key={w} onClick={() => setWeek(w)} style={{ padding: "9px 20px", borderRadius: 8, border: `1px solid ${week === w ? "var(--fire-bd)" : "var(--line)"}`, background: week === w ? "var(--fire-soft)" : "transparent", color: week === w ? "var(--fire)" : "var(--muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                  Week {w}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-fire" onClick={generatePlan} disabled={loading} style={{ marginTop: 20, flexShrink: 0 }}>
            {loading ? "Planning..." : "Generate Plan →"}
          </button>
        </div>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 16, height: 16, border: "2px solid var(--fire-bd)", borderTopColor: "var(--fire)", borderRadius: "50%", animation: "spin 0.85s linear infinite" }} />
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Strategy agent analyzing revenue target and context...</span>
          </div>
        )}
        {error && <div style={{ marginTop: 12, fontSize: 13, color: "var(--red)" }}>{error}</div>}
      </div>

      {/* Plan output */}
      {plan && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Goal */}
          <div className="card card-fire" style={{ padding: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Week {week} Primary Goal</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>{plan.primary_goal}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{plan.revenue_rationale}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <span style={{ fontSize: 12, padding: "4px 10px", background: "var(--fire-soft)", border: "1px solid var(--fire-bd)", borderRadius: 20, color: "var(--fire)" }}>
                Audience: {plan.audience_priority?.replace(/_/g, " ")}
              </span>
              <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(26,158,117,0.08)", border: "1px solid rgba(26,158,117,0.2)", borderRadius: 20, color: "var(--green)" }}>
                Offer: {plan.offer_priority?.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* Asset targets */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Asset Targets This Week</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {Object.entries(plan.asset_targets || {}).map(([platform, target]) => (
                <div key={platform} style={{ padding: "12px 14px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, textTransform: "capitalize", color: "var(--muted)" }}>{platform}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: Number(target) > 0 ? "var(--text)" : "var(--dim)" }}>{String(target)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Awareness mix */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Awareness Stage Mix</div>
            {Object.entries(plan.awareness_mix || {}).map(([stage, pct]) => {
              const p = Math.round(Number(pct) * 100);
              return (
                <div key={stage} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, textTransform: "capitalize", color: "var(--muted)" }}>{stage.replace(/_/g, " ")}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text)" }}>{p}%</span>
                  </div>
                  <div className="score-bar">
                    <div className="score-bar-fill" style={{ width: `${p}%`, background: p >= 40 ? "var(--fire)" : p >= 25 ? "var(--amber)" : "var(--dim)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core angles */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Core Angles (max 3)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.core_angles?.map((angle: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fire)", flexShrink: 0, marginTop: 2 }}>0{i + 1}</span>
                  <span style={{ fontSize: 13 }}>{angle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA path */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>CTA Path — Funnel Alignment</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { label: "Top of Funnel", val: plan.cta_path?.top_of_funnel, color: "var(--muted)" },
                { label: "Mid Funnel", val: plan.cta_path?.mid_funnel, color: "var(--amber)" },
                { label: "Bottom Funnel", val: plan.cta_path?.bottom_funnel, color: "var(--fire)" },
              ].map(item => (
                <div key={item.label} style={{ padding: "14px 16px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 10, color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: item.color, fontWeight: 500 }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="/content" style={{ textDecoration: "none" }}>
              <button className="btn btn-fire">→ Generate Content for This Plan</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
