"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, LayoutGrid, List, RotateCcw, Sparkles, Star } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";

type Props = {
  mode: "cards" | "table";
  setMode: (m: "cards" | "table") => void;
};

const CATS = [
  { id: "", label: "Все категории" },
  { id: "hair", label: "Волосы" },
  { id: "nails", label: "Ногти" },
  { id: "spa", label: "SPA" },
  { id: "brows", label: "Брови" },
  { id: "makeup", label: "Макияж" },
];

const SORTS = [
  { id: "popular", label: "Популярное" },
  { id: "price_asc", label: "Цена ↑" },
  { id: "price_desc", label: "Цена ↓" },
  { id: "duration_asc", label: "Длительность ↑" },
  { id: "duration_desc", label: "Длительность ↓" },
];

export default function ServicesFiltersBar({ mode, setMode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // Controlled local search with debounce
  const qUrl = sp.get("q") || "";
  const [q, setQ] = useState(qUrl);
  useEffect(() => setQ(qUrl), [qUrl]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (q === qUrl) return;
      const next = new URLSearchParams(sp.toString());
      if (q.trim()) next.set("q", q.trim());
      else next.delete("q");
      next.set("page", "1");
      router.push(`${pathname}?${next.toString()}`);
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const cat = sp.get("cat") || "";
  const dur_to = sp.get("dur_to") || "";
  const price_from = sp.get("price_from") || "";
  const price_to = sp.get("price_to") || "";
  const status = sp.get("status") || "";
  const staff = sp.get("staff") || "";
  const sort = sp.get("sort") || "popular";
  const popular = sp.get("popular") === "1";
  const seasonal = sp.get("seasonal") === "1";

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value && value !== "") next.set(key, value);
    else next.delete(key);
    // сбрасываем пагинацию
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  };

  const toggleFlag = (key: "popular" | "seasonal") => {
    const next = new URLSearchParams(sp.toString());
    const on = next.get(key) === "1";
    if (on) next.delete(key);
    else next.set(key, "1");
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  };

  const resetAll = () => {
    router.push(pathname);
  };

  const chips = useMemo(() => {
    const list: { key: string; label: string }[] = [];
    if (cat) list.push({ key: "cat", label: CATS.find((c) => c.id === cat)?.label || cat });
    if (dur_to) list.push({ key: "dur_to", label: `до ${dur_to} мин` });
    if (price_from || price_to)
      list.push({
        key: "price",
        label: `цена ${price_from ? "от " + price_from : ""}${price_from && price_to ? " " : ""}${
          price_to ? "до " + price_to : ""
        }`,
      });
    if (status) list.push({ key: "status", label: status === "active" ? "активные" : "неактивные" });
    if (staff) list.push({ key: "staff", label: `сотр. ${staff}` });
    if (popular) list.push({ key: "popular", label: "хит" });
    if (seasonal) list.push({ key: "seasonal", label: "сезон" });
    return list;
  }, [cat, dur_to, price_from, price_to, status, staff, popular, seasonal]);

  return (
    <div className={`${T.cardSoft} grid gap-3`}>
      {/* Верхняя строка: Поиск + быстрые тумблеры */}
      <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию и ключевым словам…"
            className={T.input + " pl-8"}
            aria-label="Поиск по услугам"
          />
          <Filter width={14} height={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
        </div>

        {/* Тумблеры «Хит/Сезон» */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFlag("popular")}
            data-active={popular}
            className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm data-[active=true]:bg-white data-[active=true]:text-black"
            title="Показать только хиты"
          >
            <Star width={14} height={14} /> Хит
          </button>
          <button
            type="button"
            onClick={() => toggleFlag("seasonal")}
            data-active={seasonal}
            className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm data-[active=true]:bg-white data-[active=true]:text-black"
            title="Показать сезонные"
          >
            <Sparkles width={14} height={14} /> Сезон
          </button>
        </div>

        {/* Переключатель режима */}
        <div className="flex items-center justify-end gap-1">
          <span className="text-xs text-white/60 hidden sm:inline">Режим:</span>
          <button
            className={`rounded-lg border border-white/15 px-2 py-1 ${mode === "cards" ? "bg-white text-black" : "bg-white/10"}`}
            onClick={() => setMode("cards")}
            aria-pressed={mode === "cards"}
            title="Карточки"
          >
            <LayoutGrid width={14} height={14} />
          </button>
          <button
            className={`rounded-lg border border-white/15 px-2 py-1 ${mode === "table" ? "bg-white text-black" : "bg-white/10"}`}
            onClick={() => setMode("table")}
            aria-pressed={mode === "table"}
            title="Таблица"
          >
            <List width={14} height={14} />
          </button>
        </div>
      </div>

      {/* Нижняя строка: селекты/инпуты фильтров */}
      <div className="grid gap-2 md:grid-cols-6">
        {/* Категория */}
        <select
          value={cat}
          onChange={(e) => setParam("cat", e.target.value)}
          className={T.input}
          aria-label="Категория"
        >
          {CATS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Длительность до */}
        <select
          value={dur_to}
          onChange={(e) => setParam("dur_to", e.target.value)}
          className={T.input}
          aria-label="Длительность до"
        >
          <option value="">Длительность: любая</option>
          <option value="30">До 30 мин</option>
          <option value="60">До 60 мин</option>
          <option value="90">До 90 мин</option>
        </select>

        {/* Цена от / до */}
        <div className="flex gap-2">
          <input
            inputMode="numeric"
            pattern="\d*"
            placeholder="Цена от"
            className={T.input}
            defaultValue={price_from}
            onBlur={(e) => setParam("price_from", e.currentTarget.value.replace(/\D/g, "") || undefined)}
            aria-label="Цена от"
          />
          <input
            inputMode="numeric"
            pattern="\d*"
            placeholder="Цена до"
            className={T.input}
            defaultValue={price_to}
            onBlur={(e) => setParam("price_to", e.currentTarget.value.replace(/\D/g, "") || undefined)}
            aria-label="Цена до"
          />
        </div>

        {/* Статус */}
        <select
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
          className={T.input}
          aria-label="Статус"
        >
          <option value="">Статус: любой</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>

        {/* Сотрудник */}
        <input
          placeholder="Сотрудник (id)"
          className={T.input}
          defaultValue={staff}
          onBlur={(e) => setParam("staff", e.currentTarget.value.trim() || undefined)}
          aria-label="Сотрудник"
        />

        {/* Сортировка */}
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className={T.input}
          aria-label="Сортировка"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Активные чипы + сброс */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {chips.length > 0 ? (
            chips.map((c, i) => (
              <span
                key={`${c.key}-${i}`}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/80"
              >
                {c.label}
              </span>
            ))
          ) : (
            <span className="text-xs text-white/60">Фильтры не применены</span>
          )}
        </div>

        <button className="inline-flex items-center gap-1 text-xs underline opacity-80 hover:opacity-100" onClick={resetAll}>
          <RotateCcw width={14} height={14} /> Сбросить
        </button>
      </div>
    </div>
  );
}