"use client";

import { useMemo } from "react";

export default function LivePreviewFrame({
  theme,
  assets,
}: {
  theme: any;
  assets: any;
}) {
  const styles = useMemo(
    () => ({
      borderRadius: (theme?.radius ?? 16) + "px",
      borderColor: "rgba(255,255,255,.15)",
      background: "rgba(255,255,255,.04)",
    }),
    [theme]
  );

  const primary = theme?.primary || "#22c55e";

  return (
    <div
      className="w-full max-w-full min-w-0 border border-white/10 p-4 sm:p-6 transition-all duration-300"
      style={styles}
    >
      {/* Верхняя панель */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {assets?.logoLight ? (
            <img
              src={assets.logoLight}
              alt="logo"
              className="h-8 w-auto max-w-[140px] object-contain"
            />
          ) : (
            <div className="h-8 w-24 rounded bg-white/10" />
          )}
          <div className="text-sm text-white/80 truncate">
            Предпросмотр темы
          </div>
        </div>

        <div
          className="text-xs text-white/60 font-mono px-2 py-1 rounded bg-white/[0.03] border border-white/10 self-start sm:self-auto"
          style={{ color: primary }}
        >
          {primary}
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            style={{
              background: primary,
              boxShadow: `0 0 0 2px ${primary}20 inset`,
            }}
          >
            Пример CTA
          </button>
        </div>
      </div>

      {/* Карточка с примером фона и скруглений */}
      <div
        className="mt-4 rounded-xl p-4 border border-white/10 text-sm text-white/70"
        style={{
          borderRadius: theme?.radius ? `${theme.radius}px` : "16px",
        }}
      >
        <div className="text-xs text-white/50 mb-1">Демонстрация скругления:</div>
        <div
          className="w-full h-10 sm:h-12 bg-white/[0.08]"
          style={{ borderRadius: theme?.radius ?? 16 }}
        ></div>
      </div>
    </div>
  );
}