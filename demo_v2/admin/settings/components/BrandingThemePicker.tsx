"use client";
import React from "react";

type Theme = {
  mode: "light" | "dark" | "auto";
  primary: string; // hex
  radius: number;  // px
};

const COLOR_PRESETS = ["#22c55e", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#14b8a6"];

export default function BrandingThemePicker({
  value,
  onChange,
}: {
  value: Partial<Theme> | undefined;
  onChange: (v: Theme) => void;
}) {
  const v: Theme = {
    mode: (value?.mode as Theme["mode"]) ?? "auto",
    primary: value?.primary ?? "#22c55e",
    radius: typeof value?.radius === "number" ? value!.radius : 16,
  };

  const set = (patch: Partial<Theme>) => onChange({ ...v, ...patch });

  const previewBg =
    v.mode === "light" ? "#ffffff" : v.mode === "dark" ? "#0b0b12" : "transparent";
  const previewText = v.mode === "light" ? "#0b0b12" : "#ffffff";

  const cardStyle = React.useMemo<React.CSSProperties>(
    () => ({
      borderRadius: `${v.radius}px`,
      border: "1px solid rgba(255,255,255,.15)",
      background:
        v.mode === "auto"
          ? "linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))"
          : "rgba(255,255,255,.04)",
    }),
    [v.mode, v.radius]
  );

  return (
    <section className="grid gap-3 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Тема</div>

      {/* Контролы */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        <label className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Режим</span>
          <select
            aria-label="Режим темы"
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.mode}
            onChange={(e) => set({ mode: e.target.value as Theme["mode"] })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
          <span className="text-[11px] text-white/50">
            Auto — наследовать системную тему
          </span>
        </label>

        <label className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Primary</span>
          <div className="flex items-center gap-2">
            <input
              aria-label="Выбор основного цвета"
              type="color"
              className="h-10 w-14 rounded-md bg-transparent border border-white/10"
              value={v.primary}
              onChange={(e) => set({ primary: e.target.value })}
            />
            <input
              aria-label="Hex значение цвета"
              className="flex-1 min-w-0 rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
              value={v.primary}
              onChange={(e) => set({ primary: normalizeHex(e.target.value) })}
              placeholder="#22c55e"
              pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
              title="HEX цвет: #RGB или #RRGGBB"
            />
          </div>

          {/* мини-палитра пресетов */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Выбрать ${c}`}
                onClick={() => set({ primary: c })}
                className={`h-6 w-6 rounded-md border border-white/20 outline-none focus:ring-2 focus:ring-white/25 ${
                  c.toLowerCase() === v.primary.toLowerCase() ? "ring-2 ring-white/30" : ""
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          <span className="text-[11px] text-white/50">HEX, например #22c55e</span>
        </label>

        <label className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Скругление (px)</span>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
            <input
              aria-label="Скругление углов"
              type="range"
              min={0}
              max={28}
              step={1}
              value={v.radius}
              onChange={(e) => set({ radius: clampInt(e.target.value, 0, 28) })}
              className="w-full"
            />
            <input
              aria-label="Скругление углов (число)"
              inputMode="numeric"
              type="number"
              min={0}
              max={28}
              step={1}
              className="w-20 rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
              value={v.radius}
              onChange={(e) => set({ radius: clampInt(e.target.value, 0, 28) })}
            />
          </div>
          <span className="text-[11px] text-white/50">Диапазон 0–28</span>
        </label>
      </div>

      {/* Превью */}
      <div className="grid gap-2">
        <div className="text-sm text-white/70">Предпросмотр</div>
        <div
          className="rounded-xl border border-white/10 p-4"
          style={{ background: previewBg }}
          aria-label="Предпросмотр темы"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div style={cardStyle} className="p-4">
              <div className="text-sm" style={{ color: previewText, opacity: 0.7 }}>
                Карточка интерфейса
              </div>
              <div className="text-lg font-semibold mt-1" style={{ color: previewText }}>
                Заголовок
              </div>
              <button
                className="mt-3 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: withAlpha(v.primary, 0.15),
                  color: previewText,
                  border: `1px solid ${withAlpha(v.primary, 0.35)}`,
                }}
              >
                Кнопка (primary)
              </button>
            </div>

            <div style={cardStyle} className="p-4">
              <div className="text-sm" style={{ color: previewText, opacity: 0.7 }}>
                Статусы
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["OK", "Info", "Warn"].map((t, i) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded-md text-xs"
                    style={{
                      border: "1px solid rgba(255,255,255,.1)",
                      background:
                        i === 0
                          ? withAlpha(v.primary, 0.18)
                          : i === 1
                          ? "rgba(255,255,255,.08)"
                          : "rgba(255,255,255,.06)",
                      color: previewText,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="mt-3 text-[11px]"
            style={{ color: previewText, opacity: 0.6 }}
            aria-live="polite"
          >
            Режим: <b>{v.mode}</b> • Primary: <b>{v.primary}</b> • Radius:{" "}
            <b>{v.radius}px</b>
          </div>
        </div>
      </div>
    </section>
  );
}

/* helpers */
function clampInt(v: string | number, min: number, max: number) {
  const n = Math.floor(Number(v));
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function normalizeHex(s: string) {
  let v = s.trim();
  if (!v) return v;
  if (!v.startsWith("#")) v = `#${v}`;
  // допустимы #RGB или #RRGGBB
  if (/^#([0-9a-fA-F]{3}){1,2}$/.test(v)) return v.toLowerCase();
  // если ввод ещё «недописан», не мешаем — вернём как есть
  return s;
}

function withAlpha(hex: string, alpha: number) {
  const to255 = (h: string) => parseInt(h, 16);
  let r = 34, g = 197, b = 94; // fallback для #22c55e
  const m3 = /^#([0-9a-f]{3})$/i.exec(hex);
  const m6 = /^#([0-9a-f]{6})$/i.exec(hex);
  if (m3) {
    r = to255(m3[1][0] + m3[1][0]);
    g = to255(m3[1][1] + m3[1][1]);
    b = to255(m3[1][2] + m3[1][2]);
  } else if (m6) {
    r = to255(m6[1].slice(0, 2));
    g = to255(m6[1].slice(2, 4));
    b = to255(m6[1].slice(4, 6));
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}