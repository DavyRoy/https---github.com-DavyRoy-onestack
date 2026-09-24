import { ImageResponse } from "next/og";

export const runtime = "edge";

const BG = "#07100e";
const TEAL = "#2dd4bf";

// Квадратный логотип 512×512 для разметки Organization: поисковики и
// ИИ-сервисы показывают его рядом с названием компании.
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BG }}>
        <svg width="360" height="240" viewBox="0 0 48 32" fill="none">
          <path d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z" stroke={TEAL} strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
