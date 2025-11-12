"use client";

import React from "react";

export type Preset = "Admin" | "Manager" | "User" | "ReadOnly";

type Props = {
  className?: string;
  onApply?: (preset: Preset) => void;
  /** Кастомный список пресетов (по умолчанию — стандартные) */
  presets?: Preset[];
  /** Начальное значение селектора */
  defaultPreset?: Preset;
  /** Текст кнопки */
  applyLabel?: string;
};

export default function PresetSelector({
  className = "",
  onApply,
  presets = ["Admin", "Manager", "User", "ReadOnly"],
  defaultPreset = "Admin",
  applyLabel = "Применить пресет",
}: Props) {
  const [preset, setPreset] = React.useState<Preset>(defaultPreset);
  const [busy, setBusy] = React.useState(false);
  const liveRef = React.useRef<HTMLDivElement>(null);

  const handleApply = async () => {
    if (busy) return;
    setBusy(true);
    try {
      onApply?.(preset);
      if (!onApply) alert(`Применён пресет: ${preset} (демо)`);
      // Обновим aria-live регион кратким сообщением
      if (liveRef.current) liveRef.current.textContent = `Пресет "${preset}" применён`;
    } finally {
      // Небольшая задержка, чтобы не «дребезжала» кнопка в демо
      setTimeout(() => setBusy(false), 250);
    }
  };

  return (
    <div
      className={`
        w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
        ${className}
      `}
      role="group"
      aria-label="Выбор пресета прав"
    >
      <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="preset-select">
            Пресет прав
          </label>
          <select
            id="preset-select"
            value={preset}
            onChange={(e) => setPreset(e.target.value as Preset)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
            className="
              w-full min-w-0
              rounded-lg border border-white/20 bg-white/[0.05]
              px-3 py-2 text-sm text-white
              outline-none focus:ring-2 focus:ring-white/30
            "
            aria-describedby="preset-help"
          >
            {presets.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div id="preset-help" className="sr-only">
            Выберите шаблон прав доступа и нажмите «{applyLabel}»
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={busy}
          aria-disabled={busy}
          className={`
            w-full sm:w-auto
            rounded-lg border border-white/20
            px-3 py-2 text-sm
            bg-white/[0.05] hover:bg-white/[0.10]
            transition-colors
            outline-none focus:ring-2 focus:ring-white/30
            text-center
            ${busy ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {busy ? "Применяю…" : applyLabel}
        </button>

        {/* aria-live регион для ненавязчивых статусов (экранные читатели) */}
        <div
          ref={liveRef}
          aria-live="polite"
          className="sr-only"
        />
      </div>
    </div>
  );
}