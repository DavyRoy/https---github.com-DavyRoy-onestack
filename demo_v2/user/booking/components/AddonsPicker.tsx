"use client";

type Addon = {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration: number;
};

type AddonsPickerProps = {
  addons: Addon[];
  selected: string[];
  onToggle: (id: string) => void;
};

export default function AddonsPicker({ addons, selected, onToggle }: AddonsPickerProps) {
  if (!addons.length) return null;
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Дополнительные услуги</h3>
      <div className="space-y-3">
        {addons.map((addon) => {
          const active = selected.includes(addon.id);
          return (
            <label
              key={addon.id}
              className={`flex flex-col gap-1 rounded-2xl border px-3 py-2 text-sm transition ${
                active
                  ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/15"
                  : "border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/60 hover:bg-[hsl(var(--panel))]/70"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-[hsl(var(--fg))]">{addon.title}</span>
                <span className="text-xs text-[hsl(var(--muted))]">
                  +{addon.duration} мин • +{addon.price.toLocaleString("ru-RU")} ₽
                </span>
              </div>
              {addon.description ? (
                <span className="text-xs text-[hsl(var(--muted))]">{addon.description}</span>
              ) : null}
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(addon.id)}
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
