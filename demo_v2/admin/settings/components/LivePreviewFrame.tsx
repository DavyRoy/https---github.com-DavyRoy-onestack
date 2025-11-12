"use client";

import React, { useMemo } from "react";

/* Типы пропсов (явные и безопасные) */
type Theme = {
  mode?: "light" | "dark" | "auto";
  primary?: string; // HEX #rgb / #rrggbb
  radius?: number;  // px
};

type Assets = {
  logoLight?: string;
  logoDark?: string;
  favicon?: string;
};

export default function LivePreviewFrame({
  theme,
  assets,
}: {
  theme?: Theme;
  assets?: Assets;
}) {
  // Нормализуем входные значения (детерминированно, без дат/рандома)
  const v = {
    mode: theme?.mode ?? "auto",
    primary: normalizeHex(theme?.primary ?? "#22c55e") || "#22c55e",
    radius: clamp(theme?.radius ?? 16, 0, 32),
  };

  // CSS vars + базовые стили контейнера
  const styles = useMemo<React.CSSProperties>(() => {
    return {
      // визуал контейнера
      borderRadius: `${v.radius}px`,
      borderColor: "rgba(255,255,255,.15)",
      background: "rgba(255,255,255,.04)",
      // css-переменные
      // @ts-expect-error — кастомные свойства ок
      ["--primary" as any]: v.primary,
      ["--primaryShadow" as any]: hexToRgba(v.primary, 0.125), // для теней/обводок
      ["--radius" as any]: `${v.radius}px`,
    };
  }, [v.primary, v.radius]);

  // Выбор логотипа в зависимости от режима (если есть оба)
  const logoUrl = useMemo(() => {
    if (assets?.logoDark && v.mode === "light") return assets.logoDark;
    if (assets?.logoLight) return assets.logoLight;
    return assets?.logoDark || "";
  }, [assets?.logoDark, assets?.logoLight, v.mode]);

  // Контраст текста на кнопке относительно primary
  const buttonTextColor = useMemo<"black" | "white">(
    () => (isColorLight(v.primary) ? "black" : "white"),
    [v.primary]
  );

  return (
    <div
      className="
        w-full max-w-full min-w-0
        border border-white/10 p-4 sm:p-6
        transition-all duration-300
      "
      style={styles}
      aria-label="Предпросмотр бренд-темы"
    >
      {/* Верхняя панель */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Логотип"
              className="h-8 w-auto max-w-[160px] object-contain"
              draggable={false}
            />
          ) : (
            <div
              className="h-8 w-28 rounded bg-white/10"
              aria-hidden="true"
              role="img"
            />
          )}

          <div className="text-sm text-white/80 truncate">
            Предпросмотр темы
          </div>
        </div>

        <div
          className="
            text-xs font-mono px-2 py-1 rounded
            bg-white/[0.03] border border-white/10
            self-start sm:self-auto
          "
          style={{ color: "var(--primary)" }}
          aria-label="Текущий основной цвет"
          title="Основной цвет (primary)"
        >
          {v.primary}
        </div>
      </div>

      {/* Основной контент предпросмотра */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="text-sm text-white/80 mb-2">Элемент интерфейса</div>

        <div className="grid gap-3 sm:grid-cols-2 items-center">
          <div className="text-xs text-white/60">
            Кнопка с основным цветом:
          </div>

          <button
            className="rounded-lg px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.02]"
            style={{
              background: "var(--primary)",
              color: buttonTextColor,
              boxShadow: `0 0 0 2px var(--primaryShadow) inset`,
            }}
            aria-label="Пример кнопки с primary-цветом"
            type="button"
          >
            Пример CTA
          </button>
        </div>

        {/* Быстрые бейджи/статусы */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["OK", "Info", "Warn"].map((t, i) => (
            <span
              key={t}
              className="px-2 py-1 rounded-md text-xs border"
              style={{
                borderColor: "rgba(255,255,255,.12)",
                background:
                  i === 0
                    ? hexToRgba(v.primary, 0.16)
                    : i === 1
                    ? "rgba(255,255,255,.08)"
                    : "rgba(255,255,255,.06)",
              }}
              aria-label={`Бейдж ${t}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Карточка с примером фона и скруглений */}
      <div
        className="mt-4 rounded-xl p-4 border border-white/10 text-sm text-white/70"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="text-xs text-white/50 mb-1">
          Демонстрация скругления:
        </div>
        <div
          className="w-full h-10 sm:h-12 bg-white/[0.08]"
          style={{ borderRadius: "var(--radius)" }}
          aria-hidden="true"
        />
      </div>

      {/* Доп. превью ассетов (favicon) */}
      <div className="mt-4 flex items-center gap-3">
        <div className="text-xs text-white/60">Favicon:</div>
        {assets?.favicon ? (
          <img
            src={assets.favicon}
            alt="Favicon"
            className="h-6 w-6 rounded-sm border border-white/10"
            draggable={false}
          />
        ) : (
          <div
            className="h-6 w-6 rounded-sm border border-white/10 bg-white/10"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

/* ===== helpers (детерминированные, без побочных эффектов) ===== */

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

function normalizeHex(s: string) {
  const v = (s || "").trim().toLowerCase();
  if (!v) return "";
  const withHash = v.startsWith("#") ? v : `#${v}`;
  if (/^#([0-9a-f]{3}){1,2}$/.test(withHash)) return withHash;
  return ""; // невалидный HEX
}

function hexToRgba(hex: string, alpha = 1) {
  const h = normalizeHex(hex) || "#22c55e";
  const m3 = /^#([0-9a-f]{3})$/i.exec(h);
  const m6 = /^#([0-9a-f]{6})$/i.exec(h);
  let r = 34,
    g = 197,
    b = 94; // fallback для #22c55e
  if (m3) {
    r = parseInt(m3[1][0] + m3[1][0], 16);
    g = parseInt(m3[1][1] + m3[1][1], 16);
    b = parseInt(m3[1][2] + m3[1][2], 16);
  } else if (m6) {
    r = parseInt(m6[1].slice(0, 2), 16);
    g = parseInt(m6[1].slice(2, 4), 16);
    b = parseInt(m6[1].slice(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// относительная яркость (sRGB) — чтобы выбрать цвет текста на кнопке
function isColorLight(hex: string) {
  const h = normalizeHex(hex) || "#22c55e";
  const m3 = /^#([0-9a-f]{3})$/i.exec(h);
  const m6 = /^#([0-9a-f]{6})$/i.exec(h);
  let r = 34,
    g = 197,
    b = 94;
  if (m3) {
    r = parseInt(m3[1][0] + m3[1][0], 16);
    g = parseInt(m3[1][1] + m3[1][1], 16);
    b = parseInt(m3[1][2] + m3[1][2], 16);
  } else if (m6) {
    r = parseInt(m6[1].slice(0, 2), 16);
    g = parseInt(m6[1].slice(2, 4), 16);
    b = parseInt(m6[1].slice(4, 6), 16);
  }
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  // относительная яркость WCAG
  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return L > 0.6; // простая отсечка: светлый фон → тёмный текст
}