"use client";
import { useState } from "react";
import { ELIOS_CONTEXT } from "@/lib/context";

const TABS = ["ICPs", "Offers", "Proof Bank", "Voice Rules", "Platform Specs"];

export default function ContextManager() {
  const [tab, setTab] = useState(0);

  const sBar = (v: number) => (
    <div className="score-bar" style={{ width: 60, display: "inline-flex" }}>
      <div className="score-bar-fill" style={{ width: `${v * 100}%`, background: v >= 0.8 ? "var(--green)" : v >= 0.6 ? "var(--amber)" : "var(--dim)" }} />
    </div>
  );

  return (
    <div className="page-pad">
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Canonical Context Object</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Context Manager</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, maxWidth: "60ch" }}>Every agent reads from this object. ICPs, offers, proof bank, voice rules. This is the single source of truth that makes content intelligent instead of generic.</p>
      </div>

      {/* Business header */}
      <div className="card card-fire" style={{ padding: 18, marginBottom: 16, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        {[
          { label: "Business", val: ELIOS_CONTEXT.business.name },
          { label: "Priority", val: ELIOS_CONTEXT.business.current_priority.replace(/_/g, " ") },
          { label: "Revenue Target", val: `$${ELIOS_CONTEXT.business.revenue_target_30d.toLocaleString()}` },
          { label: "Cash Urgency", val: ELIOS_CONTEXT.business.cash_urgency.toUpperCase() },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: 10, color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: item.label === "Cash Urgency" ? "var(--fire)" : "var(--text)" }}>{item.val}</div>
          </div>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <span style={{ fontSize: 11, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>v1.0 · April 2026</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "var(--panel)", padding: 4, borderRadius: 10, border: "1px solid var(--line)" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", background: tab === i ? "var(--fire-soft)" : "transparent", color: tab === i ? "var(--text)" : "var(--muted)", fontSize: 12, fontWeight: tab === i ? 500 : 400, cursor: "pointer", transition: "all 0.12s", fontFamily: "var(--font-ui)", borderColor: tab === i ? "var(--fire-bd)" : "transparent", outline: tab === i ? `1px solid var(--fire-bd)` : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* ICP tab */}
      {tab === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ELIOS_CONTEXT.audiences.map(icp => (
            <div key={icp.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 4 }}>{icp.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fire)", letterSpacing: "0.1em" }}>Avg spend: {icp.spend_level}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--fire)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Top Pains</div>
                  {icp.top_pains.slice(0, 4).map((p, i) => <div key={i} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, paddingLeft: 10, borderLeft: "2px solid var(--fire-bd)", lineHeight: 1.5 }}>{p}</div>)}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Desired Outcomes</div>
                  {icp.desired_outcomes.map((o, i) => <div key={i} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, paddingLeft: 10, borderLeft: "2px solid rgba(26,158,117,0.3)", lineHeight: 1.5 }}>{o}</div>)}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Buying Triggers</div>
                  {icp.buying_triggers.map((t, i) => <div key={i} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, paddingLeft: 10, borderLeft: "2px solid rgba(232,151,58,0.3)", lineHeight: 1.5 }}>{t}</div>)}
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <div style={{ fontSize: 11, color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Awareness distribution</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {Object.entries(icp.awareness_stage_distribution).map(([stage, pct]) => (
                    <div key={stage} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{Math.round(Number(pct) * 100)}%</div>
                      <div style={{ fontSize: 9, color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stage.replace(/_/g, " ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offers tab */}
      {tab === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {ELIOS_CONTEXT.business.offers.map(offer => (
            <div key={offer.id} className="card" style={{ padding: 18 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 6 }}>{offer.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, lineHeight: 1.55 }}>{offer.desc}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, padding: "10px 12px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--green)" }}>${offer.setup.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 2 }}>Setup</div>
                </div>
                <div style={{ flex: 1, padding: "10px 12px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--green)" }}>${offer.monthly.toLocaleString()}/mo</div>
                  <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 2 }}>Monthly</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof bank */}
      {tab === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ELIOS_CONTEXT.proof_bank.map(proof => (
            <div key={proof.id} className="card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--green-soft)", border: "1px solid rgba(26,158,117,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", fontWeight: 600 }}>{proof.id.toUpperCase()}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{proof.client}</span>
                  <span style={{ fontSize: 10, color: "var(--dim)", padding: "1px 7px", border: "1px solid var(--line)", borderRadius: 20, textTransform: "capitalize" }}>{proof.type.replace(/_/g, " ")}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{proof.summary}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: proof.strength >= 0.85 ? "var(--green)" : "var(--amber)", marginBottom: 4 }}>{Math.round(proof.strength * 100)}%</div>
                <div style={{ fontSize: 10, color: "var(--dim)" }}>Strength</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voice rules */}
      {tab === 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "var(--green)" }}>✓ Preferred Patterns</div>
            {[...ELIOS_CONTEXT.voice.tone, ...ELIOS_CONTEXT.voice.preferred_patterns].map((p, i) => (
              <div key={i} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--green)", flexShrink: 0 }}>→</span>{p}
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "var(--red)" }}>✗ Forbidden Words/Patterns</div>
            {ELIOS_CONTEXT.voice.forbidden.map((p, i) => (
              <div key={i} style={{ fontSize: 12, padding: "6px 10px", background: "rgba(229,75,75,0.06)", border: "1px solid rgba(229,75,75,0.15)", borderRadius: 6, marginBottom: 6, color: "var(--muted)", textDecoration: "line-through", textDecorationColor: "var(--red)" }}>
                {p}
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "var(--fire)" }}>✦ Signature Phrases</div>
              {ELIOS_CONTEXT.voice.signature_phrases.map((p, i) => (
                <div key={i} style={{ fontSize: 12, color: "var(--fire-2)", marginBottom: 6, padding: "4px 10px", background: "var(--fire-soft)", borderRadius: 6, border: "1px solid var(--fire-bd)", fontFamily: "var(--font-mono)" }}>
                  "{p}"
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform specs */}
      {tab === 4 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {Object.entries(ELIOS_CONTEXT.platform_specs).map(([platform, spec]) => (
            <div key={platform} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, textTransform: "capitalize", marginBottom: 12 }}>{platform}</div>
              {Object.entries(spec).map(([key, val]) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--dim)", textTransform: "capitalize", marginBottom: 2 }}>{key.replace(/_/g, " ")}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>{String(val)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
