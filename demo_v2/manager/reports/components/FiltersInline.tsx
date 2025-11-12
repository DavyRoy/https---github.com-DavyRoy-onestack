"use client";

export default function FiltersInline() {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Фильтры для отчётов"
    >
      <span className="text-sm text-white/70">Фильтры:</span>

      {["Канал", "Услуга", "Сотрудник"].map((label) => (
        <button
          key={label}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 transition-colors"
          onClick={() => alert(`Фильтр "${label}" (демо)`)}
        >
          {label}
        </button>
      ))}

      <span className="ml-auto text-sm text-white/60">
        Применяются ко всем виджетам (демо)
      </span>
    </div>
  );
}