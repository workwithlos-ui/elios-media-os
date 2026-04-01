"use client";
import { useState } from "react";

const SOURCE_TYPES = [
  { id: "text", label: "Text / Notes", placeholder: "Paste talking points, meeting notes, ideas, or any raw text..." },
  { id: "transcript", label: "Transcript", placeholder: "Paste a podcast, video, or call transcript..." },
  { id: "url", label: "URL / Article", placeholder: "https://..." },
  { id: "voice_note", label: "Voice Note Summary", placeholder: "Paste the key points from a voice note or Loom recording..." },
];

const ATOM_TYPE_COLORS: Record<string, string> = {
  claim: "var(--fire)", story: "var(--purple)", framework: "var(--blue)",
  proof: "var(--green)", objection_answer: "var(--amber)", contrarian_take: "var(--fire-2)", cta_bridge: "var(--muted)"
};

const SPCL_COLORS: Record<string, string> = { S: "var(--purple)", P: "var(--fire-2)", C: "var(--green)", L: "var(--blue)" };

export default function SourceIngestion() {
  const [sourceType, setSourceType] = useState("text");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("Distilling source...");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [savedAtoms, setSavedAtoms] = useState<string[]>([]);

  const msgs = ["Distilling source...", "Extracting content atoms...", "Mapping to audience segments...", "Scoring strength...", "Building atom library..."];

  async function handleExtract() {
    if (!source.trim()) return;
    setLoading(true); setResult(null); setError("");
    let i = 0;
    const interval = setInterval(() => { i = (i + 1) % msgs.length; setLoadMsg(msgs[i]); }, 900);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, source_type: sourceType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Extraction failed");
    } finally {
      clearInterval(interval); setLoading(false);
    }
  }

  const strengthBar = (v: number) => (
    <div className="score-bar" style={{ flex: 1 }}>
      <div className="score-bar-fill" style={{ width: `${v * 100}%`, background: v >= 0.8 ? "var(--green)" : v >= 0.6 ? "var(--amber)" : "var(--dim)" }} />
    </div>
  );

  return (
    <div className="page-pad">
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Source Distillation Agent</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Source Ingestion</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, maxWidth: "56ch" }}>Drop any raw material. The agent extracts every reusable content atom — claims, stories, proof, frameworks, objection answers — and maps each one to audience segments and SPCL pillars.</p>
      </div>

      {!result ? (
        <div className="card" style={{ padding: 24 }}>
          {/* Source type */}
          <div style={{ marginBottom: 20 }}>
            <div className="field-label" style={{ marginBottom: 10 }}>Source type</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SOURCE_TYPES.map(t => (
                <button key={t.id} className={`platform-chip ${sourceType === t.id ? "active" : ""}`} onClick={() => setSourceType(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{ marginBottom: 20 }}>
            <div className="field-label" style={{ marginBottom: 8 }}>Source material</div>
            <textarea
              className="textarea"
              style={{ minHeight: 200, fontFamily: sourceType === "url" ? "var(--font-mono)" : "var(--font-ui)" }}
              placeholder={SOURCE_TYPES.find(t => t.id === sourceType)?.placeholder}
              value={source}
              onChange={e => setSource(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "var(--dim)" }}>{source.length} characters</span>
              <span style={{ fontSize: 11, color: "var(--dim)" }}>Min 100 chars for good extraction</span>
            </div>
          </div>

          {error && <div style={{ padding: "10px 14px", background: "rgba(229,75,75,0.1)", border: "1px solid rgba(229,75,75,0.25)", borderRadius: "var(--r-sm)", color: "var(--red)", fontSize: 13, marginBottom: 16 }}>{error}</div>}

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 0" }}>
              <div style={{ width: 20, height: 20, border: "2px solid var(--fire-bd)", borderTopColor: "var(--fire)", borderRadius: "50%", animation: "spin 0.85s linear infinite", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{loadMsg}</div>
                <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>Source Distillation Agent running...</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn btn-fire" onClick={handleExtract} disabled={source.length < 100}>
                Extract Content Atoms →
              </button>
              <span style={{ fontSize: 12, color: "var(--dim)" }}>Takes 10–20 seconds</span>
            </div>
          )}
        </div>
      ) : (
        <div className="fade-up">
          {/* Summary */}
          <div className="card card-fire" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Extraction Complete</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{result.core_thesis}</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <div style={{ textAlign: "center", padding: "8px 14px", background: "var(--panel)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--fire)" }}>{result.atoms?.length || 0}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>Atoms</div>
                </div>
                <div style={{ textAlign: "center", padding: "8px 14px", background: "var(--panel)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--green)" }}>{result.atoms?.filter((a: any) => a.strength >= 0.7).length || 0}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>High strength</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{result.source_summary}</div>
          </div>

          {/* Top hooks */}
          {result.top_hooks?.length > 0 && (
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Top Hooks Extracted</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.top_hooks.map((hook: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fire)", flexShrink: 0, minWidth: 20 }}>#{i + 1}</span>
                    <span style={{ fontSize: 13, flex: 1 }}>{hook}</span>
                    <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(hook); }}>Copy</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content atoms */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Content Atoms ({result.atoms?.length || 0})</div>
              <div style={{ fontSize: 11, color: "var(--dim)" }}>Each atom is reusable across any platform or format</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.atoms?.sort((a: any, b: any) => b.strength - a.strength).map((atom: any, i: number) => (
                <div key={i} style={{ padding: "14px 16px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid var(--line)", color: ATOM_TYPE_COLORS[atom.type] || "var(--muted)", fontFamily: "var(--font-mono)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{atom.type}</span>
                    <span className={`score-badge spcl-${(atom.spcl_primary || "p").toLowerCase()}`} style={{ fontSize: 10, padding: "2px 7px" }}>SPCL-{atom.spcl_primary}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 100 }}>
                      {strengthBar(atom.strength)}
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: atom.strength >= 0.8 ? "var(--green)" : "var(--amber)", flexShrink: 0 }}>{Math.round(atom.strength * 100)}%</span>
                    </div>
                    <button className={`copy-btn ${savedAtoms.includes(`${i}`) ? "copied" : ""}`} onClick={() => {
                      navigator.clipboard.writeText(atom.content);
                      setSavedAtoms(prev => [...prev, `${i}`]);
                      setTimeout(() => setSavedAtoms(prev => prev.filter(id => id !== `${i}`)), 2000);
                    }}>{savedAtoms.includes(`${i}`) ? "✓ Copied" : "Copy"}</button>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text)" }}>{atom.content}</div>
                  {atom.audience_ids?.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {atom.audience_ids.map((id: string) => (
                        <span key={id} style={{ fontSize: 10, color: "var(--dim)", padding: "1px 7px", background: "rgba(255,255,255,0.03)", borderRadius: 20, border: "1px solid var(--line)" }}>
                          {id.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content angles */}
          {result.content_angles?.length > 0 && (
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Content Angles This Source Unlocks</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {result.content_angles.map((angle: string, i: number) => (
                  <div key={i} style={{ padding: "10px 14px", background: "var(--panel-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: 13, lineHeight: 1.55 }}>
                    <span style={{ color: "var(--fire)", marginRight: 8, fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}.</span>
                    {angle}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-fire" onClick={() => window.location.href = "/content"}>→ Generate Content from These Atoms</button>
            <button className="btn btn-ghost" onClick={() => { setResult(null); setSource(""); }}>Ingest Another Source</button>
          </div>
        </div>
      )}
    </div>
  );
}
