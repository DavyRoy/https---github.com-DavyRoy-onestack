// app/demo/admin/services/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import ServicesHero from "@/app/demo/admin/services/components/ServicesHero";
import ServicesStats from "./components/ServicesStats";
import QuickActions from "./components/QuickActions";
import {
  ADMIN_SERVICES,
  SERVICE_CATEGORIES,
  ADMIN_SPECIALISTS,
} from "@/app/demo/(shared)/data/services";

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n);
}

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

// безопасный парсинг ISO-даты
function toTime(s?: string | null) {
  if (!s) return NaN;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : NaN;
}

export default function AdminServicesHubPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // граница «последние 7 дней» (время — сейчас минус 7 суток)
  const changedWindowStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.getTime();
  }, []);

  const { activeServices, noCategory, changed7d, activeSpecialists, totalSkills } = useMemo(() => {
    const activeServices = ADMIN_SERVICES.filter((s) => s.status === "active").length;

    const catIds = new Set(SERVICE_CATEGORIES.map((c) => c.id));
    const noCategory = ADMIN_SERVICES.filter((s) => !s.categoryId || !catIds.has(s.categoryId)).length;

    const changed7d = ADMIN_SERVICES.filter((s) => {
      const t = toTime(s.changedAt);
      return Number.isFinite(t) && t >= changedWindowStart;
    }).length;

    const activeSpecialists = ADMIN_SPECIALISTS.filter((sp) => sp.status === "active").length;
    const totalSkills = ADMIN_SPECIALISTS.reduce(
      (sum, sp) => sum + sp.skills.filter((k) => k.isActive).length,
      0
    );

    return { activeServices, noCategory, changed7d, activeSpecialists, totalSkills };
  }, [changedWindowStart]);

  const lastPriceChanges = useMemo(
    () =>
      ADMIN_SERVICES.filter((s) => !!s.changedAt)
        .slice()
        .sort((a, b) => {
          const ta = toTime(a.changedAt);
          const tb = toTime(b.changedAt);
          if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
          // если парсинг не удался — падение к лексикографической сортировке
          return (b.changedAt || "").localeCompare(a.changedAt || "");
        })
        .slice(0, 5),
    []
  );

  const catsWithCounts = useMemo(() => {
    const byCat = new Map<string, number>();
    for (const s of ADMIN_SERVICES) {
      if (!s.categoryId) continue;
      byCat.set(s.categoryId, (byCat.get(s.categoryId) || 0) + 1);
    }
    return SERVICE_CATEGORIES.slice()
      .sort(
        (a, b) =>
          (a.position ?? 0) - (b.position ?? 0) ||
          a.name.localeCompare(b.name, "ru")
      )
      .map((c) => ({ ...c, count: byCat.get(c.id) || 0 }));
  }, []);

  return (
    <>
      <ServicesHero />

      <ServicesStats
        items={[
          { title: "Активных услуг", value: activeServices, href: `${base}/services?q=&status=active` },
          { title: "Без категории", value: noCategory, href: `${base}/services?q=&category=none` },
          { title: "Цена менялась за 7д", value: changed7d, href: `${base}/services/pricing?changed=7d` },
          { title: "Активных специалистов", value: activeSpecialists, href: `${base}/services/specialists` },
          { title: "Навыков у специалистов", value: totalSkills, href: `${base}/services/specialists?tab=skills` },
        ]}
      />

      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium text-white/85">Быстрый поиск</div>
            <p className="mt-0.5 text-xs text-white/65">Ищите услуги по названию, категории или статусу.</p>
          </div>
          <form action={`${base}/services`} method="get" className="flex w-full max-w-lg items-center gap-2">
            <input
              type="search"
              name="q"
              placeholder="Например: массаж, вечерний макияж…"
              className="flex-1 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/30"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Найти
            </button>
          </form>
        </div>
      </section>

      <QuickActions />

      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-medium text-white/85">Категории услуг</div>
            <p className="mt-0.5 text-xs text-white/65">Структура витрины и фильтров для записи.</p>
          </div>
          <Link
            href={`${base}/services/categories`}
            className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Управлять
          </Link>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {catsWithCounts.map((c) => (
            <Link
              key={c.id}
              href={`${base}/services?q=&category=${encodeURIComponent(c.id)}`}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">{c.name}</div>
                <span className="rounded bg-white/12 px-2 py-0.5 text-xs text-white/75">{fmt(c.count)}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-white/60">/{c.slug}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white/85">Последние изменения цен</div>
          <Link
            href={`${base}/services/pricing?changed=7d`}
            className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Все изменения
          </Link>
        </div>

        <div className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="text-left">
              <tr className="border-b border-white/10">
                <th className="p-2">Услуга</th>
                <th className="hidden p-2 md:table-cell">Категория</th>
                <th className="p-2 text-right">Цена, ₽</th>
                <th className="p-2 text-right">Обновлено</th>
              </tr>
            </thead>
            <tbody>
              {lastPriceChanges.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-white/70">
                    За период изменений не было.
                  </td>
                </tr>
              ) : (
                lastPriceChanges.map((s) => {
                  const cat = SERVICE_CATEGORIES.find((c) => c.id === s.categoryId);
                  return (
                    <tr key={s.id} className="border-b border-white/5 transition hover:bg-white/8">
                      <td className="p-2">
                        <Link
                          href={`${base}/services/${s.id}`}
                          className="text-white/90 transition hover:text-white hover:underline"
                        >
                          {s.name}
                        </Link>
                        {s.tags?.length ? (
                          <span className="ml-2 text-[11px] text-white/60">{s.tags.join(" • ")}</span>
                        ) : null}
                      </td>
                      <td className="hidden p-2 md:table-cell">
                        {cat ? (
                          <Link
                            href={`${base}/services?q=&category=${encodeURIComponent(cat.id)}`}
                            className="text-white/80 transition hover:text-white hover:underline"
                          >
                            {cat.name}
                          </Link>
                        ) : (
                          <span className="text-white/60">—</span>
                        )}
                      </td>
                      <td className="p-2 text-right tabular-nums">{fmt(s.price)}</td>
                      <td className="p-2 text-right text-white/70">{s.changedAt || "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section border-white/12 bg-white/8">
        <div className="mb-2 text-sm font-medium text-white/85">Быстрые ссылки</div>
        <div className="grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-4">
          <Link
            href={`${base}/services/pricing`}
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Прайс-лист
          </Link>
          <Link
            href={`${base}/services/categories`}
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Категории
          </Link>
          <Link
            href={`${base}/services/bundles`}
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Пакеты / абонементы
          </Link>
          <Link
            href={`${base}/services/specialists`}
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Специалисты
          </Link>
        </div>
      </section>
    </>
  );
}