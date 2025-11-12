"use client";

import * as React from "react";

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
};

export default function CompareToggle({ value, onChange }: Props) {
  const toggle = () => onChange(!value);

  return (
    <label className="flex items-center gap-3 select-none cursor-pointer">
      {/* Кнопка-свитч (доступная версия) */}
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={toggle}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${
          value ? "bg-emerald-500/70" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      {/* Подпись */}
      <span className="text-sm text-white/80 leading-tight">
        Сравнить с&nbsp;предыдущим&nbsp;периодом
      </span>
    </label>
  );
}