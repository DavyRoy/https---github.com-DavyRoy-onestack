"use client";

import * as React from "react";

type Props = {
  tags: string[];
  onChange?: (next: string[]) => void; // опционально — редактируемые теги
};

export default function ClientTagsCard({ tags, onChange }: Props) {
  const [value, setValue] = React.useState("");

  function addTag() {
    const t = value.trim();
    if (!t) return;
    const next = Array.from(new Set([...(tags || []), t]));
    onChange ? onChange(next) : alert("Демо: добавили тег " + t);
    setValue("");
  }
  function removeTag(t: string) {
    const next = (tags || []).filter((x) => x !== t);
    onChange ? onChange(next) : alert("Демо: удалили тег " + t);
  }

  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03]">
      <div className="text-sm text-white/70 mb-2">Метки</div>
      <div className="flex flex-wrap gap-2">
        {(tags && tags.length) ? (
          tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-xs"
            >
              {t}
              <button
                type="button"
                className="opacity-70 hover:opacity-100"
                aria-label={`Удалить тег ${t}`}
                onClick={() => removeTag(t)}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm opacity-70">—</span>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Добавить тег…"
          className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Добавить
        </button>
      </div>
    </section>
  );
}