import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OneStack — мобильные приложения";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG   = "#07100e";
const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "60px 80px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, border: `2px solid ${TEAL}30`, display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "auto" }}>
          <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
            <path d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z" stroke={TEAL} strokeWidth="2.5" />
          </svg>
          <span style={{ color: WHITE, fontSize: 22, fontWeight: 600 }}>OneStack</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 60 }}>
          <span style={{ fontSize: 88, color: "transparent", WebkitTextStroke: `1.5px ${TEAL}`, lineHeight: 0.9, letterSpacing: "-4px", display: "flex" }}>Мобильные</span>
          <span style={{ fontSize: 88, color: WHITE, lineHeight: 0.9, letterSpacing: "-4px", marginTop: 8, display: "flex" }}>приложения</span>
        </div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 24, color: `${WHITE}70` }}>iOS · Android · React Native · 40+ проектов · MVP 3–6 нед</span>
          <span style={{ fontSize: 20, color: TEAL }}>onestack24.ru/mobile</span>
        </div>
        <div style={{ position: "absolute", right: -80, top: "50%", width: 560, height: 560, borderRadius: "50%", border: `1px dashed ${TEAL}22`, display: "flex", transform: "translateY(-50%)" }} />
      </div>
    ),
    { ...size }
  );
}
