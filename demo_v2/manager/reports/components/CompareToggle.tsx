"use client";

export default function CompareToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 transition-colors"
      aria-label="Переключатель сравнения с предыдущим периодом"
    >
      <input
        type="checkbox"
        className="accent-white cursor-pointer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      Сравнить с предыдущим
    </label>
  );
}