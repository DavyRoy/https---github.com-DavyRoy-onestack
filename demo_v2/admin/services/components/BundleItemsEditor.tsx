// app/demo/admin/services/components/BundleItemsEditor.tsx
"use client";

import { useMemo, useState } from "react";
import * as Lucide from "lucide-react";
import {
  ADMIN_SERVICES,
  ADMIN_BUNDLES,
  SERVICE_CATEGORIES,
} from "@/app/demo/(shared)/data/services";

/** ₽ формат */
function fmtPrice(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

type Bundle = (typeof ADMIN_BUNDLES)[number];
type Item = NonNullable<Bundle["items"]>[number];

export default function BundleItemsEditor({ initial }: { initial?: Bundle }) {
  const [items, setItems] = useState<Item[]>(() => initial?.items?.slice() ?? []);
  const [q, setQ] = useState(""); // поиск по списку услуг

  const servicesExist = ADMIN_SERVICES.length > 0;

  // Индексы и отфильтрованный список услуг для селекта
  const { serviceById, filteredCategoryIds } = useMemo(() => {
    const serviceById = new Map(ADMIN_SERVICES.map((s) => [s.id, s]));
    const needle = q.trim().toLowerCase();

    const filteredCategoryIds = SERVICE_CATEGORIES
      .map((c) => c.id)
      .filter((catId) => {
        if (!needle) return true;
        return ADMIN_SERVICES.some(
          (s) =>
            s.categoryId === catId &&
            (s.name.toLowerCase().includes(needle) || s.slug.toLowerCase().includes(needle))
        );
      });

    return { serviceById, filteredCategoryIds };
  }, [q]);

  // Итоги: строки и общий
  const totals = useMemo(() => {
    const rows = items.map((it) => {
      const svc = serviceById.get(it.serviceId);
      const price = svc?.price ?? 0;
      const qty = Math.max(1, Number(it.qty ?? 1));
      return { price, qty, sum: price * qty };
    });
    const total = rows.reduce((s, r) => s + r.sum, 0);
    return { rows, total };
  }, [items, serviceById]);

  // CRUD
  const add = () => {
    if (!servicesExist) return;
    const first = ADMIN_SERVICES[0];
    setItems((xs) => [...xs, { serviceId: first.id, qty: 1 }]);
  };

  const update = (i: number, patch: Partial<Item>) => {
    setItems((xs) => {
      const next = xs.slice();
      next[i] = { ...next[i], ...patch };
      return next;
    });
  };

  const del = (i: number) => setItems((xs) => xs.filter((_, idx) => idx !== i));

  const stepQty = (i: number, delta: number) => {
    setItems((xs) => {
      const next = xs.slice();
      const cur = Math.max(1, Number(next[i].qty ?? 1));
      next[i] = { ...next[i], qty: Math.max(1, cur + delta) };
      return next;
    });
  };

  // Простая валидация: дубликаты услуг
  const duplicateIds = useMemo(() => {
    const seen = new Set<string>();
    const dup = new Set<string>();
    for (const it of items) {
      if (!it.serviceId) continue;
      if (seen.has(it.serviceId)) dup.add(it.serviceId);
      seen.add(it.serviceId);
    }
    return dup;
  }, [items]);

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm"
      aria-labelledby="bundle-items-title"
    >
      {/* Заголовок + действия */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 id="bundle-items-title" className="text-sm font-medium">
            Состав
          </h2>
          <div className="mt-0.5 text-xs text-white/60" aria-live="polite">
            {items.length > 0 ? `${items.length} поз.` : "Пока пусто"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск услуги…"
            className="w-[180px] rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm outline-none md:w-[220px]"
            aria-label="Поиск по услугам в списке"
          />
          <button
            onClick={add}
            disabled={!servicesExist}
            className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 disabled:opacity-50"
            title={servicesExist ? "Добавить строку" : "Нет доступных услуг"}
          >
            <Lucide.Plus className="h-4 w-4" />
            Добавить
          </button>
        </div>
      </div>

      {/* Таблица / список */}
      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        {/* Desktop table */}
        <table className="hidden min-w-full text-sm md:table">
          <thead className="bg-white/[0.03] text-left">
            <tr className="border-b border-white/10">
              <th className="p-2 w-[56px]">#</th>
              <th className="p-2 min-w-[320px]">Услуга</th>
              <th className="p-2 w-[160px]">Кол-во</th>
              <th className="p-2 w-[120px] text-right">Цена</th>
              <th className="p-2 w-[140px] text-right">Сумма</th>
              <th className="p-2 w-[56px]" />
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((it, i) => {
                const svc = serviceById.get(it.serviceId);
                const price = svc?.price ?? 0;
                const qty = Math.max(1, Number(it.qty ?? 1));
                const sum = qty * price;
                const isDup = it.serviceId && duplicateIds.has(it.serviceId);

                return (
                  <tr key={`${it.serviceId || "empty"}-${i}`} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-2 tabular-nums text-white/70">{i + 1}</td>
                    <td className="p-2">
                      <div className="flex flex-col">
                        <select
                          value={it.serviceId || ""}
                          onChange={(e) => update(i, { serviceId: e.target.value })}
                          className={`rounded-lg border px-2 py-2 text-sm outline-none bg-white/10 border-white/15 ${
                            isDup ? "ring-1 ring-rose-400/40" : ""
                          }`}
                          title={svc ? svc.name : "Выберите услугу"}
                        >
                          {!it.serviceId && <option value="">— Выберите услугу —</option>}
                          {filteredCategoryIds.length === 0 && (
                            <option value="">— Услуги не найдены —</option>
                          )}
                          {filteredCategoryIds.map((catId) => {
                            const cat = SERVICE_CATEGORIES.find((c) => c.id === catId)!;
                            const list = ADMIN_SERVICES.filter(
                              (s) =>
                                s.categoryId === catId &&
                                (!q ||
                                  s.name.toLowerCase().includes(q.toLowerCase()) ||
                                  s.slug.toLowerCase().includes(q.toLowerCase()))
                            );
                            if (list.length === 0) return null;
                            return (
                              <optgroup key={cat.id} label={cat.name}>
                                {list.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}
                        </select>
                        <div className="mt-1 text-[11px] text-white/50">
                          {svc?.slug ? `/${svc.slug}` : "—"} • длительность: {svc?.durationMin ?? 0} мин
                          {isDup && <span className="ml-2 text-rose-300">Дублируется</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="inline-flex items-center rounded-lg border border-white/15 bg-white/10">
                        <button
                          type="button"
                          onClick={() => stepQty(i, -1)}
                          className="grid h-8 w-8 place-items-center hover:bg-white/10"
                          aria-label="Уменьшить"
                          title="Уменьшить"
                        >
                          <Lucide.Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(e) => {
                            const n = Math.max(1, Number(e.target.value) || 1);
                            update(i, { qty: n });
                          }}
                          className="w-16 border-x border-white/15 bg-transparent text-center outline-none"
                          aria-label="Количество"
                          inputMode="numeric"
                        />
                        <button
                          type="button"
                          onClick={() => stepQty(i, +1)}
                          className="grid h-8 w-8 place-items-center hover:bg-white/10"
                          aria-label="Увеличить"
                          title="Увеличить"
                        >
                          <Lucide.Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-right tabular-nums">{fmtPrice(price)}</td>
                    <td className="p-2 text-right tabular-nums font-medium">{fmtPrice(sum)}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => del(i)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/10 hover:bg-white/15"
                        title="Удалить строку"
                        aria-label="Удалить строку"
                      >
                        <Lucide.Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-white/70">
                  Пакет пуст. Добавьте одну или несколько услуг.
                </td>
              </tr>
            )}
          </tbody>

          {items.length > 0 && (
            <tfoot>
              <tr className="border-t border-white/10 bg-white/[0.03]">
                <td className="p-2 text-right font-medium" colSpan={4}>
                  Итого:
                </td>
                <td className="p-2 text-right text-lg font-semibold tabular-nums">
                  {fmtPrice(totals.total)}
                </td>
                <td className="p-2" />
              </tr>
            </tfoot>
          )}
        </table>

        {/* Mobile list */}
        <div className="md:hidden divide-y divide-white/10">
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/70">Пакет пуст. Добавьте услугу.</div>
          ) : (
            items.map((it, i) => {
              const svc = serviceById.get(it.serviceId);
              const price = svc?.price ?? 0;
              const qty = Math.max(1, Number(it.qty ?? 1));
              const sum = qty * price;
              const isDup = it.serviceId && duplicateIds.has(it.serviceId);

              return (
                <div key={`${it.serviceId || "empty"}-${i}`} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        {i + 1}. {svc?.name || "—"}
                        {isDup && (
                          <span className="rounded bg-rose-400/15 px-1.5 py-0.5 text-[10px] text-rose-300">
                            Дубликат
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-white/50">
                        {svc?.slug ? `/${svc.slug}` : "—"} • {svc?.durationMin ?? 0} мин
                      </div>

                      <div className="mt-2">
                        <select
                          value={it.serviceId || ""}
                          onChange={(e) => update(i, { serviceId: e.target.value })}
                          className="w-full rounded-lg border border-white/15 bg-white/10 px-2 py-2 text-sm outline-none"
                        >
                          {!it.serviceId && <option value="">— Выберите услугу —</option>}
                          {filteredCategoryIds.map((catId) => {
                            const cat = SERVICE_CATEGORIES.find((c) => c.id === catId)!;
                            const list = ADMIN_SERVICES.filter(
                              (s) =>
                                s.categoryId === catId &&
                                (!q ||
                                  s.name.toLowerCase().includes(q.toLowerCase()) ||
                                  s.slug.toLowerCase().includes(q.toLowerCase()))
                            );
                            if (list.length === 0) return null;
                            return (
                              <optgroup key={cat.id} label={cat.name}>
                                {list.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => del(i)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/10 hover:bg-white/15"
                      title="Удалить строку"
                      aria-label="Удалить строку"
                    >
                      <Lucide.Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-lg border border-white/15 bg-white/10">
                      <button
                        type="button"
                        onClick={() => stepQty(i, -1)}
                        className="grid h-8 w-8 place-items-center hover:bg-white/10"
                        aria-label="−"
                      >
                        <Lucide.Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => {
                          const n = Math.max(1, Number(e.target.value) || 1);
                          update(i, { qty: n });
                        }}
                        className="w-14 border-x border-white/15 bg-transparent text-center outline-none"
                        aria-label="Количество"
                        inputMode="numeric"
                      />
                      <button
                        type="button"
                        onClick={() => stepQty(i, +1)}
                        className="grid h-8 w-8 place-items-center hover:bg-white/10"
                        aria-label="+"
                      >
                        <Lucide.Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-white/60">Цена</div>
                      <div className="tabular-nums">{fmtPrice(price)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/60">Сумма</div>
                      <div className="font-medium tabular-nums">{fmtPrice(sum)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Подвал секции */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <Lucide.Info className="h-4 w-4 opacity-60" />
          Подсказка: можно добавлять одинаковые услуги несколько раз (например, для разных условий).
        </div>
        <div className="text-white/80">
          Итого к оплате: <span className="font-medium">{fmtPrice(totals.total)}</span>
        </div>
      </div>
    </section>
  );
}