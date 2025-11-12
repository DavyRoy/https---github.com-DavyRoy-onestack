"use client";

export default function MultiSelect({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (id: string) => {
    const set = new Set(value);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange(Array.from(set));
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => toggle(o.id)}
            className={
              "rounded-lg border px-3 py-1.5 text-sm " +
              (active ? "border-white bg-white text-black" : "border-white/15 bg-white/[0.05] hover:bg-white/[0.08]")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}