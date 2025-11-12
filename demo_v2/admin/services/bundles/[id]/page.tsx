// app/demo/admin/services/bundles/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ADMIN_BUNDLES } from "@/app/demo/(shared)/data/services";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function patchParams(sp: URLSearchParams, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams(Array.from(sp.entries()));
  for (const [k, v] of Object.entries(patch)) {
    if (!v || v === "all") next.delete(k);
    else next.set(k, v);
  }
  return next;
}

function fmtPrice(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

function StatusBadge({ status }: { status: (typeof ADMIN_BUNDLES)[number]["status"] }) {
  const tone =
    status === "active"
      ? "bg-emerald-400/15 text-emerald-300"
      : status === "draft"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-white/10 text-white/70";
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs uppercase tracking-wide ${tone}`}
      aria-label={`Статус: ${status}`}
      title={`Статус: ${status}`}
    >
      {status}
    </span>
  );
}

/** Поддержка разных схем моков: services[] или items[] */
function getItemsCount(bundle: (typeof ADMIN_BUNDLES)[number]): number {
  // @ts-expect-error — совместимость моков
  const services = (bundle as any)?.services as unknown[] | undefined;
  // @ts-expect-error — совместимость моков
  const items = (bundle as any)?.items as unknown[] | undefined;
  return (services?.length ?? items?.length ?? 0) as number;
}

/** Чтение произвольного периода для абонементов, если есть */
function getPeriodDays(bundle: (typeof ADMIN_BUNDLES)[number]): number | null {
  // @ts-expect-error — совместимость моков
  const days = (bundle as any)?.periodDays;
  return Number.isFinite(days) ? Number(days) : null;
}

export default function AdminBundlesPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const sp = useSearchParams();
  const router = useRouter();

  const q = sp.get("q")?.trim() ?? "";
  const type = sp.get("type") ?? "all";
  const status = sp.get("status") ?? "all";

  const { rows, found } = useMemo(() => {
    let xs = [...ADMIN_BUNDLES];

    if (q) {
      const needle = q.toLowerCase();
      xs = xs.filter(
        (bundle) =>
          bundle.name.toLowerCase().includes(needle) ||
          // @ts-expect-error — у некоторых моков есть slug
          (bundle.slug ?? "").toLowerCase().includes(needle)
      );
    }
    if (type !== "all") xs = xs.filter((bundle) => bundle.type === type);
    if (status !== "all") xs = xs.filter((bundle) => bundle.status === status);

    xs.sort((a, b) => {
      const rank = (s: string) => (s === "active" ? 0 : s === "draft" ? 1 : 2);
      return rank(a.status) - rank(b.status) || a.name.localeCompare(b.name, "ru");
    });

    return { rows: xs, found: xs.length };
  }, [q, type, status]);

  const setParams = (patch: Record<string, string | undefined>) => {
    const next = patchParams(sp, patch);
    router.push(`${base}/services/bundles?${next.toString()}`);
  };

  const chips = useMemo(() => {
    const xs: Array<{ label: string; onClear: () => void }> = [];
    if (q) xs.push({ label: `Поиск: “${q}”`, onClear: () => setParams({ q: "" }) });
    if (type !== "all") {
      xs.push({
        label: type === "package" ? "Тип: пакет" : "Тип: абонемент",
        onClear: () => setParams({ type: "all" }),
      });
    }
    if (status !== "all") {
      const map: Record<string, string> = { active: "Активен", draft: "Черновик", archived: "Архив" };
      xs.push({ label: `Статус: ${map[status] ?? status}`, onClear: () => setParams({ status: "all" }) });
    }
    return xs;
  }, [q, type, status]);

  return (
    <div className="grid gap-5 md:gap-6">
      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60 truncate" aria-label="Хлебные крошки">
              <Link href={`${base}/services`} className="hover:underline">
                Услуги
              </Link>
              <span className="mx-1 opacity-50">/</span>
              <span className="text-white/80">Пакеты и абонементы</span>
            </nav>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-white">Пакеты и абонементы</h1>
            <p className="mt-1 text-sm text-white/70">
              Управляйте пакетами услуг и подписками. Найдено: <span className="text-white/85">{found}</span>
            </p>
          </div>

          <Link
            href={`${base}/services/bundles/new`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Создать
          </Link>
        </div>
      </section>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Активные фильтры">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onClear}
              className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
              aria-label={`Сбросить фильтр: ${chip.label}`}
            >
              <span>{chip.label}</span>
              <span aria-hidden>×</span>
            </button>
          ))}
          <button
            onClick={() => setParams({ q: "", type: "all", status: "all" })}
            className="ml-auto rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Сбросить все
          </button>
        </div>
      )}

      <section className="admin-section border-white/12 bg-white/8" aria-label="Фильтры">
        <div className="grid gap-2 md:grid-cols-4">
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs opacity-70">Поиск</span>
            <input
              defaultValue={q}
              onKeyDown={(e) => {
                if (e.key === "Enter") setParams({ q: (e.currentTarget as HTMLInputElement).value });
                if (e.key === "Escape") setParams({ q: "" });
              }}
              onBlur={(e) => setParams({ q: e.currentTarget.value })}
              placeholder="Название или slug…"
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Поиск по пакетам"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs opacity-70">Тип</span>
            <select
              value={type}
              onChange={(e) => setParams({ type: e.target.value })}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Фильтр по типу"
            >
              <option value="all">Все</option>
              <option value="package">Пакет</option>
              <option value="subscription">Абонемент</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs opacity-70">Статус</span>
            <select
              value={status}
              onChange={(e) => setParams({ status: e.target.value })}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Фильтр по статусу"
            >
              <option value="all">Все</option>
              <option value="active">Активен</option>
              <option value="draft">Черновик</option>
              <option value="archived">Архив</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-white/70">
            Подсказка: нажмите <kbd className="rounded bg-white/10 px-1">Enter</kbd>, чтобы применить поиск.
          </div>
          <button
            onClick={() => setParams({ q: "", type: "all", status: "all" })}
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Сбросить
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/12 bg-white/8">
        {/* Мобильный список */}
        <div className="divide-y divide-white/10 md:hidden">
          {rows.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/70">Пакетов нет.</div>
          ) : (
            rows.map((bundle) => {
              const itemsCount = getItemsCount(bundle);
              const periodDays = bundle.type === "subscription" ? getPeriodDays(bundle) : null;
              return (
                <div key={bundle.id} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`${base}/services/bundles/${bundle.id}`}
                        className="truncate text-sm font-medium text-white transition hover:text-white/90 hover:underline"
                        title="Открыть карточку пакета"
                      >
                        {bundle.name}
                      </Link>
                      {bundle.description && (
                        <div className="mt-0.5 text-xs text-white/60">{bundle.description}</div>
                      )}
                    </div>
                    <StatusBadge status={bundle.status} />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
                    <span>{bundle.type === "package" ? "Пакет" : "Абонемент"}</span>
                    {periodDays !== null && (
                      <>
                        <span>•</span>
                        <span>{periodDays} дн.</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{itemsCount} услуг</span>
                    <span>•</span>
                    <span>{fmtPrice(bundle.price)}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href={`${base}/services/bundles/${bundle.id}`}
                      className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                    >
                      Открыть
                    </Link>
                    <button
                      onClick={() => alert("Демо: быстрые действия")}
                      className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                      aria-label="Быстрые действия"
                    >
                      ⋯
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Десктопная таблица */}
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/12 text-left">
                <th className="p-3" scope="col">Название</th>
                <th className="p-3" scope="col">Описание</th>
                <th className="p-3" scope="col">Тип</th>
                <th className="p-3 text-right" scope="col">Цена</th>
                <th className="p-3 text-right" scope="col">Состав</th>
                <th className="p-3 text-right" scope="col">Статус</th>
                <th className="p-3 text-right" scope="col">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-white/70">
                    Пакетов нет.
                  </td>
                </tr>
              ) : (
                rows.map((bundle) => {
                  const itemsCount = getItemsCount(bundle);
                  return (
                    <tr key={bundle.id} className="border-b border-white/10 transition hover:bg-white/8">
                      <td className="p-3">
                        <Link
                          href={`${base}/services/bundles/${bundle.id}`}
                          className="text-white/90 transition hover:text-white hover:underline"
                          title="Открыть карточку пакета"
                        >
                          {bundle.name}
                        </Link>
                      </td>
                      <td className="p-3 text-white/60 max-w-sm truncate">{bundle.description}</td>
                      <td className="p-3 text-white/70">
                        {bundle.type === "package" ? "Пакет" : "Абонемент"}
                      </td>
                      <td className="p-3 text-right tabular-nums">{fmtPrice(bundle.price)}</td>
                      <td className="p-3 text-right text-white/70">{itemsCount}</td>
                      <td className="p-3 text-right">
                        <StatusBadge status={bundle.status} />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`${base}/services/bundles/${bundle.id}`}
                            className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                          >
                            Открыть
                          </Link>
                          <button
                            onClick={() => alert("Демо: быстрые действия")}
                            className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                            aria-label="Быстрые действия"
                          >
                            ⋯
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}