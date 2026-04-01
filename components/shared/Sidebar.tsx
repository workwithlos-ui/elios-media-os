"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/mission", label: "Mission Control", icon: "◈", desc: "Weekly goals + pipeline" },
  { href: "/source", label: "Source Ingestion", icon: "◉", desc: "Drop your raw material" },
  { href: "/plan", label: "Weekly Plan", icon: "◆", desc: "Strategy + asset targets" },
  { href: "/content", label: "Content Engine", icon: "◎", desc: "Generate + score + approve" },
  { href: "/context", label: "Context Manager", icon: "◇", desc: "ICPs, offers, proof bank" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <nav style={{ width: "var(--sidebar)", position: "fixed", top: 0, left: 0, height: "100vh", background: "#0e0e0c", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", zIndex: 100 }}>

      {/* Logo */}
      <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#f0ece6", marginBottom: 2 }}>ELIOS</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fire)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Media OS</div>
      </div>

      {/* Revenue target */}
      <div style={{ margin: "12px 12px 0", padding: "10px 12px", background: "rgba(232,93,38,0.07)", border: "1px solid rgba(232,93,38,0.18)", borderRadius: "9px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>April Target</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 500, color: "var(--fire)" }}>$75,000</div>
        <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>Pipeline now · High urgency</div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 8px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--dim)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0 8px 8px" }}>Systems</div>
        {NAV.map(item => {
          const active = path.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 10px", borderRadius: "10px", marginBottom: 2, background: active ? "rgba(232,93,38,0.08)" : "transparent", border: `1px solid ${active ? "rgba(232,93,38,0.22)" : "transparent"}`, cursor: "pointer", transition: "all 0.12s", position: "relative" }}>
                {active && <div style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", width: 3, height: 14, background: "var(--fire)", borderRadius: "0 2px 2px 0" }} />}
                <span style={{ fontSize: 12, color: active ? "var(--fire)" : "var(--dim)", flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: active ? 500 : 400, color: active ? "var(--text)" : "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.desc}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(232,93,38,0.12)", border: "1px solid rgba(232,93,38,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--fire)", flexShrink: 0 }}>L</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Los Silva</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>Founder · ELIOS</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
