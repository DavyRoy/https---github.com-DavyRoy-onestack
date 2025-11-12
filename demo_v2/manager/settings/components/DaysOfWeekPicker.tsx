"use client";

const DAYS = [
  { id: "mon", title: "Пн" },
  { id: "tue", title: "Вт" },
  { id: "wed", title: "Ср" },
  { id: "thu", title: "Чт" },
  { id: "fri", title: "Пт" },
  { id: "sat", title: "Сб" },
  { id: "sun", title: "Вс" },
];

export default function DaysOfWeekPicker({
  value,
  onChange,
}: {
  value: string[]; // ids
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
      {DAYS.map((d) => {
        const active = value.includes(d.id);
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => toggle(d.id)}
            className={
              "rounded-lg border px-3 py-1.5 text-sm " +
              (active
                ? "border-white bg-white text-black"
                : "border-white/15 bg-white/[0.05] hover:bg-white/[0.08]")
            }
          >
            {d.title}
          </button>
        );
      })}
    </div>
  );
}