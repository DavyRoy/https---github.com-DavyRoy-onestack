"use client";

import React from "react";

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
};

export default function CompareToggle({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      {/* Кастомный свитч */}
      <div
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          value ? "bg-emerald-500/70" : "bg-white/20"
        }`}
        onClick={() => onChange(!value)}
      >
        <div
          className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>

      {/* Подпись */}
      <span className="text-sm text-white/80 leading-tight">
        Сравнить с&nbsp;предыдущим&nbsp;периодом
      </span>
    </label>
  );
}