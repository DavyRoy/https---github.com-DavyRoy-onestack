// app/demo/admin/services/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import ServicesHero from "@/app/demo/admin/services/components/ServicesHero";
import ServicesStats from "./components/ServicesStats";
import QuickActions from "./components/QuickActions";

// Переключаемся на общий «shared» источник данных (общий для ролей)
import {
  ADMIN_SERVICES,
  SERVICE_CATEGORIES,
  ADMIN_SPECIALISTS,
} from "@/app/demo/(shared)/data/services";

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n);
}

export default function AdminServicesHubPage() {
  // Дет. граница для "за 7 дней" — фиксированная, чтобы не было рассинхронизации при гидрации
  const CHANGED_WINDOW_START = "2025-08-30";

  const { activeServices, noCategory, changed7d, activeSpecialists, totalSkills } = useMemo(() => {
    const activeServices = ADMIN_SERVICES.filter(s => s.status === "active").length;

    // Без категории: либо categoryId пуст, либо не найден в справочнике
    const catIds = new Set(SERVICE_CATEGORIES.map(c => c.id));
    const noCategory = ADMIN_SERVICES.filter(s => !s.categoryId || !catIds.has(s.categoryId)).length;

    const changed7d = ADMIN_SERVICES.filter(
      s => s.changedAt && s.changedAt >= CHANGED_WINDOW_START
    ).length;

    const activeSpecialists = ADMIN_SPECIALISTS.filter(sp => sp.status === "active").length;
    const totalSkills = ADMIN_SPECIALISTS.reduce(
      (sum, sp) => sum + sp.skills.filter(k => k.isActive).length,
      0
    );

    return { activeServices, noCategory, changed7d, activeSpecialists, totalSkills };
  }, []);

  // Топ-5 последних изменений цен (детерминированно по строковой дате)
  const lastPriceChanges = useMemo(() => {
    return ADMIN_SERVICES
      .filter(s => !!s.changedAt)
      .slice() // копия
      .sort((a, b) => (b.changedAt || "").localeCompare(a.changedAt || ""))
      .slice(0, 5);
  }, []);

  // Категории с количеством услуг
  const catsWithCounts = useMemo(() => {
    const byCat = new Map<string, number>();
    for (const s of ADMIN_SERVICES) {
      if (!s.categoryId) continue;
      byCat.set(s.categoryId, (byCat.get(s.categoryId) || 0) + 1);
    }
    return SERVICE_CATEGORIES
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.name.localeCompare(b.name, "ru"))
      .map(c => ({ ...c, count: byCat.get(c.id) || 0 }));
  }, []);

  return (
    <div className="grid gap-6">
      <ServicesHero />

      <ServicesStats
        items={[
          { title: "Активных услуг", value: activeServices, href: "/demo/admin/services?q=&status=active" },
          { title: "Без категории", value: noCategory, href: "/demo/admin/services?q=&category=none" },
          { title: "Цена менялась за 7д", value: changed7d, href: "/demo/admin/services/pricing?changed=7d" },
          { title: "Активных специалистов", value: activeSpecialists, href: "/demo/admin/services/specialists" },
          { title: "Навыков у специалистов", value: totalSkills, href: "/demo/admin/services/specialists?tab=skills" },
        ]}
      />

      {/* Быстрый поиск/переходы */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium">Быстрый поиск</div>
            <p className="text-xs text-white/70 mt-0.5">
              Поиск по названию / категории / статусу
            </p>
          </div>
          <form
            action="/demo/admin/services"
            method="get"
            className="flex w-full max-w-lg items-center gap-2"
          >
            <input
              type="search"
              name="q"
              placeholder="Например: массаж, вечерний макияж…"
              className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90"
            >
              Найти
            </button>
          </form>
        </div>
      </section>

      <QuickActions />

      {/* Категории (мини-обзор) */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-medium">Категории услуг</div>
            <p className="text-xs text-white/70 mt-0.5">
              Структура витрины и фильтров для записи
            </p>
          </div>
          <Link
            href="/demo/admin/services/categories"
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Управлять
          </Link>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {catsWithCounts.map(c => (
            <Link
              key={c.id}
              href={`/demo/admin/services?q=&category=${encodeURIComponent(c.id)}`}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-sm">{c.name}</div>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{fmt(c.count)}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-white/60">/{c.slug}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Последние изменения цен */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Последние изменения цен</div>
          <Link
            href="/demo/admin/services/pricing?changed=7d"
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Все изменения
          </Link>
        </div>

        <div className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="text-left">
              <tr className="border-b border-white/10">
                <th className="p-2">Услуга</th>
                <th className="p-2 hidden md:table-cell">Категория</th>
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
                lastPriceChanges.map(s => {
                  const cat = SERVICE_CATEGORIES.find(c => c.id === s.categoryId);
                  return (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-2">
                        <Link href={`/demo/admin/services/${s.id}`} className="hover:underline">
                          {s.name}
                        </Link>
                        {s.tags?.length ? (
                          <span className="ml-2 text-[11px] text-white/60">
                            {s.tags.join(" • ")}
                          </span>
                        ) : null}
                      </td>
                      <td className="p-2 hidden md:table-cell">
                        {cat ? (
                          <Link
                            href={`/demo/admin/services?q=&category=${encodeURIComponent(cat.id)}`}
                            className="hover:underline text-white/80"
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

      {/* Быстрые ссылки (из вашего варианта) */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm font-medium mb-2">Быстрые ссылки</div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <Link href="/demo/admin/services/pricing" className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/15">
            Прайс-лист
          </Link>
          <Link href="/demo/admin/services/categories" className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/15">
            Категории
          </Link>
          <Link href="/demo/admin/services/bundles" className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/15">
            Пакеты/абонементы
          </Link>
          <Link href="/demo/admin/services/specialists" className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/15">
            Специалисты
          </Link>
        </div>
      </section>
    </div>
  );
}