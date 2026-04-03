"use client";
import { useState } from "react";
import { ELIOS_CONTEXT } from "@/lib/context";

const PLATFORMS = ["linkedin", "twitter", "instagram", "newsletter", "shorts", "youtube"];
const AUDIENCES = ELIOS_CONTEXT.audiences.map(a => ({ id: a.id, label: a.name }));
const STAGES = [
  { id: "problem_aware", label: "Problem Aware", desc: "Pain articulation, diagnosis, 'this is why you're stuck'" },
  { id: "solution_aware", label: "Solution Aware", desc: "Framework teaching, comparisons, process breakdowns" },
  { id: "product_aware", label: "Product Aware", desc: "Proof posts, objection handling, implementation stories" },
  { id: "unaware", label: "Unaware", desc: "Curiosity hooks, contrarian observations, pattern interrupts" },
  { id: "most_aware", label: "Most Aware", desc: "Direct CTA, urgency, offer specifics" },
];

const SPCL_LABELS: Record<string, string> = { S: "Status", P: "Power", C: "Credibility", L: "Likeness" };
const scoreClass = (s: number) => s >= 90 ? "score-publish" : s >= 75 ? "score-review" : s >= 60 ? "score-regenerate" : "score-discard";
const spclClass = (s: string) => `spcl-${s.toLowerCase()}`;

const SCORE_COLORS: Record<string, string> = { publish: "var(--green)", review: "var(--amber)", regenerate: "var(--fire)", discard: "var(--red)" };

export default function ContentEngine() {
  const [platform, setPlatform] = useState("linkedin");
  const [audience, setAudience] = useState("agency_owners");
  const [stage, setStage] = useState("problem_aware");
  const [count, setCount] = useState(3);
  const [angle, setAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [assets, setAssets] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [approved, setApproved] = useState<string[]>([]);
  const [copying, setCopying] = useState<string | null>(null);

  const msgs = ["Generating content...", "Applying SPCL framework...", "Scoring against context...", "Ranking by buyer intent...", "Finalizing assets..."];

  async function generate() {
    setLoading(true); setAssets([]);
    let i = 0;
    const interval = setInterval(() => { i = (i + 1) % msgs.length; setLoadMsg(msgs[i]); }, 800);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform, audience_id: audience, awareness_stage: stage, count,
          plan: { core_angles: angle ? [angle] : [], offer_priority: "advisory_os" },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAssets(data.assets || []);
      if (data.assets?.length > 0) setExpanded(data.assets[0].id);
    } catch (e: any) { alert(e.message); }
    finally { clearInterval(interval); setLoading(false); }
  }

  function copyAsset(asset: any) {
    const hook: string = asset.hook || "";
    // The AI sometimes starts the body with the hook line again -- strip it if so
    const rawBody: string = asset.body || asset.content || asset.text || asset.caption || asset.post || "";
    const bodyFirstLine = rawBody.split("\n")[0].trim();
    const body = bodyFirstLine === hook.trim() ? rawBody.split("\n").slice(1).join("\n").trimStart() : rawBody;
    const cta: string = asset.cta || "";
    const parts = [hook, body, cta].filter(p => p.trim().length > 0);
    const text = parts.join("\n\n");
    navigator.clipboard.writeText(text);
    setCopying(asset.id);
    setTimeout(() => setCopying(null), 2000);
  }

  const ScoreBar = ({ label, val, max = 10 }: { label: string; val: number; max?: number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <div style={{ fontSize: 10, color: "var(--dim)", width: 80, flexShrink: 0 }}>{label}</div>
      <div className="score-bar" style={{ flex: 1 }}>
        <div className="score-bar-fill" style={{ width: `${(val / max) * 100}%`, background: val >= 7 ? "var(--green)" : val >= 5 ? "var(--amber)" : "var(--dim)" }} />
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", width: 20, textAlign: "right" }}>{val}</div>
    </div>
  );

  return (
    <div className="page-pad">
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Generation + SPCL Scoring Agent</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Content Engine</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, maxWidth: "60ch" }}>Configure platform, audience, and awareness stage. The agent generates content optimized for qualified buyers, scores every asset on SPCL, and routes automatically.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start" }}>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Platform */}
          <div className="card" style={{ padding: 16 }}>
            <div className="field-label" style={{ marginBottom: 10 }}>Platform</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PLATFORMS.map(p => (
                <button key={p} className={`platform-chip ${platform === p ? "active" : ""}`} onClick={() => setPlatform(p)} style={{ textTransform: "capitalize" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="card" style={{ padding: 16 }}>
            <div className="field-label" style={{ marginBottom: 10 }}>Target Audience</div>
            {AUDIENCES.map(a => (
              <div key={a.id} onClick={() => setAudience(a.id)} style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4, background: audience === a.id ? "var(--fire-soft)" : "transparent", border: `1px solid ${audience === a.id ? "var(--fire-bd)" : "transparent"}`, fontSize: 12, color: audience === a.id ? "var(--text)" : "var(--muted)", transition: "all 0.12s" }}>
                {a.label}
              </div>
            ))}
          </div>

          {/* Awareness stage */}
          <div className="card" style={{ padding: 16 }}>
            <div className="field-label" style={{ marginBottom: 10 }}>Awareness Stage</div>
            {STAGES.map(s => (
              <div key={s.id} onClick={() => setStage(s.id)} style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4, background: stage === s.id ? "var(--fire-soft)" : "transparent", border: `1px solid ${stage === s.id ? "var(--fire-bd)" : "transparent"}`, transition: "all 0.12s" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: stage === s.id ? "var(--text)" : "var(--muted)", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "var(--dim)", lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Optional angle */}
          <div className="card" style={{ padding: 16 }}>
            <div className="field-label" style={{ marginBottom: 8 }}>Core Angle (optional)</div>
            <input className="input" placeholder="e.g. n8n vs Claude-native architecture..." value={angle} onChange={e => setAngle(e.target.value)} style={{ marginBottom: 12 }} />
            <div className="field-label" style={{ marginBottom: 8 }}>Count</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 5].map(n => (
                <button key={n} onClick={() => setCount(n)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${count === n ? "var(--fire-bd)" : "var(--line)"}`, background: count === n ? "var(--fire-soft)" : "transparent", color: count === n ? "var(--fire)" : "var(--muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-fire" onClick={generate} disabled={loading} style={{ width: "100%", padding: "12px", justifyContent: "center" }}>
            {loading ? "Generating..." : `Generate ${count} Asset${count > 1 ? "s" : ""} →`}
          </button>

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--panel)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
              <div style={{ width: 16, height: 16, border: "2px solid var(--fire-bd)", borderTopColor: "var(--fire)", borderRadius: "50%", flexShrink: 0, animation: "spin 0.85s linear infinite" }} />
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{loadMsg}</span>
            </div>
          )}
        </div>

        {/* Output */}
        <div>
          {assets.length === 0 && !loading ? (
            <div style={{ padding: "60px 40px", textAlign: "center", color: "var(--dim)", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "var(--r)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8, color: "var(--muted)" }}>No assets yet.</div>
              <div style={{ fontSize: 13 }}>Configure the controls and hit Generate. Every asset gets SPCL-scored and routed automatically.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {assets.map((asset: any) => {
                const isOpen = expanded === asset.id;
                const isApproved = approved.includes(asset.id);
                return (
                  <div key={asset.id} className="card" style={{ borderColor: isApproved ? "rgba(26,158,117,0.3)" : "var(--line)", transition: "all 0.2s" }}>
                    {/* Header */}
                    <div style={{ padding: "16px 18px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }} onClick={() => setExpanded(isOpen ? null : asset.id)}>
                      {/* Score ring */}
                      <div style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${SCORE_COLORS[asset.status] || "var(--line)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: SCORE_COLORS[asset.status] }}>{asset.scores?.total ?? "?"}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4, marginBottom: 8 }}>{asset.hook}</div>
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
                          <span className={`score-badge ${scoreClass(asset.scores?.total || 0)}`} style={{ fontSize: 11 }}>{asset.status?.toUpperCase()}</span>
                          <span className={`score-badge ${spclClass(asset.spcl_primary)}`} style={{ fontSize: 11 }}>SPCL-{asset.spcl_primary} · {SPCL_LABELS[asset.spcl_primary]}</span>
                          <span style={{ fontSize: 11, color: "var(--dim)", textTransform: "capitalize" }}>{platform}</span>
                          <span style={{ fontSize: 11, color: "var(--dim)" }}>{stage.replace(/_/g, " ")}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 16, color: "var(--dim)", flexShrink: 0, marginTop: 4, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</div>
                    </div>

                    {/* Expanded body */}
                    {isOpen && (
                      <div style={{ borderTop: "1px solid var(--line)" }}>
                        {/* Full post content */}
                        <div style={{ padding: "18px 20px" }}>
                          <div style={{ fontSize: 12, color: "var(--fire)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Post Content</div>
                          <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.75, color: "var(--text)", padding: "16px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", marginBottom: 12 }}>
                            {asset.hook}{"\n\n"}{asset.body}{"\n\n"}{asset.cta}
                          </div>

                          {/* SPCL scores breakdown */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                            <div style={{ padding: "14px 16px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>SPCL Scores</div>
                              <ScoreBar label="Status" val={asset.scores?.status || 0} />
                              <ScoreBar label="Power" val={asset.scores?.power || 0} />
                              <ScoreBar label="Credibility" val={asset.scores?.credibility || 0} />
                              <ScoreBar label="Likeness" val={asset.scores?.likeness || 0} />
                            </div>
                            <div style={{ padding: "14px 16px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Buyer Scores</div>
                              <ScoreBar label="ICP Fit" val={asset.scores?.icp_fit || 0} />
                              <ScoreBar label="Conversion" val={asset.scores?.conversion_relevance || 0} />
                              <ScoreBar label="Platform" val={asset.scores?.platform_fit || 0} />
                              <ScoreBar label="Novelty" val={asset.scores?.novelty || 0} />
                            </div>
                          </div>

                          {/* Rationale */}
                          {asset.rationale && (
                            <div style={{ padding: "12px 14px", background: "rgba(232,93,38,0.05)", border: "1px solid var(--fire-bd)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--muted)", lineHeight: 1.65, marginBottom: 14 }}>
                              <span style={{ color: "var(--fire)", fontWeight: 500 }}>Why it works: </span>{asset.rationale}
                            </div>
                          )}

                          {/* Actions */}
                          <div style={{ display: "flex", gap: 10 }}>
                            <button className={`btn ${isApproved ? "btn-ghost" : "btn-fire"}`} onClick={() => setApproved(prev => isApproved ? prev.filter(id => id !== asset.id) : [...prev, asset.id])}>
                              {isApproved ? "✓ Approved" : "Approve"}
                            </button>
                            <button className="btn btn-dark" onClick={() => copyAsset(asset)}>
                              {copying === asset.id ? "✓ Copied" : "Copy Post"}
                            </button>
                            <button className="btn btn-ghost" onClick={generate}>Regenerate</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {assets.length > 0 && (
                <div style={{ display: "flex", gap: 10, padding: "4px 0" }}>
                  <button className="btn btn-fire" onClick={generate}>Generate {count} More</button>
                  <div style={{ fontSize: 12, color: "var(--dim)", display: "flex", alignItems: "center" }}>
                    {assets.filter((a: any) => approved.includes(a.id)).length} approved · {assets.filter((a: any) => a.status === "publish").length} auto-publish
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
