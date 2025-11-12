"use client";

import React from "react";

type Preset = "Admin" | "Manager" | "User" | "ReadOnly";

export default function PresetSelector({
  className = "",
  onApply,
}: {
  className?: string;
  onApply?: (preset: Preset) => void;
}) {
  const [preset, setPreset] = React.useState<Preset>("Admin");

  const handleApply = () => {
    onApply?.(preset);
    if (!onApply) alert(`Применён пресет: ${preset} (демо)`);
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
            className="
              w-full min-w-0
              rounded-lg border border-white/20 bg-white/[0.05]
              px-3 py-2 text-sm text-white
              outline-none focus:ring-2 focus:ring-white/30
            "
            aria-describedby="preset-help"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
            <option value="ReadOnly">ReadOnly</option>
          </select>
          <div id="preset-help" className="sr-only">
            Выберите шаблон прав доступа
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="
            w-full sm:w-auto
            rounded-lg border border-white/20
            px-3 py-2 text-sm
            bg-white/[0.05] hover:bg-white/[0.10]
            transition-colors
            outline-none focus:ring-2 focus:ring-white/30
            text-center
          "
        >
          Применить пресет
        </button>
      </div>
    </div>
  );
}