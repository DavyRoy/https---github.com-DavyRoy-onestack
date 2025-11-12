"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = { className?: string };

// небольшая утилита: собрать новый URLSearchParams на основе текущих
function mergeParams(sp: URLSearchParams, next: Record<string, string | undefined>) {
  const p = new URLSearchParams(sp.toString());
  Object.entries(next).forEach(([k, v]) => {
    if (v === undefined || v === "") p.delete(k);
    else p.set(k, v);
  });
  return p;
}

export default function SegmentsFiltersBar({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // локальное состояние (контролируемые поля)
  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [type, setType] = React.useState(sp.get("type") ?? "");
  const [updated, setUpdated] = React.useState(sp.get("updated") ?? "");
  const [sizeMin, setSizeMin] = React.useState(sp.get("size_min") ?? "");
  const [sizeMax, setSizeMax] = React.useState(sp.get("size_max") ?? "");
  const [sort, setSort] = React.useState(sp.get("sort") ?? "updated_desc");

  // когда история/URL меняется (назад/вперёд) — синхронизируем поля
  React.useEffect(() => {
    setQ(sp.get("q") ?? "");
    setType(sp.get("type") ?? "");
    setUpdated(sp.get("updated") ?? "");
    setSizeMin(sp.get("size_min") ?? "");
    setSizeMax(sp.get("size_max") ?? "");
    setSort(sp.get("sort") ?? "updated_desc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp?.toString()]);

  const apply = () => {
    // при изменениях сбрасываем page
    const p = mergeParams(sp, {
      q,
      type,
      updated,
      size_min: sizeMin,
      size_max: sizeMax,
      sort,
      page: "1",
    });
    router.replace(`${pathname}?${p.toString()}`);
  };

  const reset = () => {
    router.replace(pathname);
  };

  // отправка по Enter в любом инпуте
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    if (e.key === "Enter") apply();
  };

  // helper: только цифры
  const onlyDigits = (v: string) => v.replace(/[^\d]/g, "");

  return (
    <section
      className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 ${className ?? ""}`}
    >
      <div className="grid gap-3 md:grid-cols-6">
        {/* Поиск */}
        <div className="md:col-span-2">
          <label className="block text-xs text-white/60 mb-1">Поиск</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Название сегмента / правило"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        {/* Тип */}
        <div>
          <label className="block text-xs text-white/60 mb-1">Тип</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">Все</option>
            <option value="tag">Тег</option>
            <option value="static">Статический</option>
            <option value="dynamic">Динамический</option>
          </select>
        </div>

        {/* Обновлён */}
        <div>
          <label className="block text-xs text-white/60 mb-1">Обновлён</label>
          <select
            value={updated}
            onChange={(e) => setUpdated(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">Любое время</option>
            <option value="7d">за 7 дней</option>
            <option value="30d">за 30 дней</option>
            <option value="90d">за 90 дней</option>
          </select>
        </div>

        {/* Размер от/до */}
        <div>
          <label className="block text-xs text-white/60 mb-1">Размер ≥</label>
          <input
            value={sizeMin}
            onChange={(e) => setSizeMin(onlyDigits(e.target.value))}
            onKeyDown={onKeyDown}
            inputMode="numeric"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1">Размер ≤</label>
          <input
            value={sizeMax}
            onChange={(e) => setSizeMax(onlyDigits(e.target.value))}
            onKeyDown={onKeyDown}
            inputMode="numeric"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
            placeholder="∞"
          />
        </div>

        {/* Сортировка */}
        <div>
          <label className="block text-xs text-white/60 mb-1">Сортировка</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="updated_desc">По обновлению ↓</option>
            <option value="name_asc">Имя A→Z</option>
            <option value="size_desc">Размер ↓</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={apply}
          className="rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white"
        >
          Применить
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
        >
          Сбросить
        </button>
      </div>
    </section>
  );
}