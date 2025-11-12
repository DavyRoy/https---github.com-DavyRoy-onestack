// app/demo/admin/services/bundles/new/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Lucide from "lucide-react";
import BundleForm from "@/app/demo/admin/services/components/BundleForm";
import BundleItemsEditor from "@/app/demo/admin/services/components/BundleItemsEditor";
import BundlePricingPanel from "@/app/demo/admin/services/components/BundlePricingPanel";
import BundleRulesPanel from "@/app/demo/admin/services/components/BundleRulesPanel";

/** Определить базовый префикс (admin/manager/user) по пути */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminBundleNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const [saving, setSaving] = React.useState<false | "draft" | "create">(false);

  const save = (asDraft = false) => {
    if (saving) return; // защита от даблкликов
    setSaving(asDraft ? "draft" : "create");
    try {
      alert(asDraft ? "Сохранено как черновик (демо)" : "Пакет создан (демо)");
      router.push(`${base}/services/bundles`);
    } finally {
      // если переход отменят, чтобы кнопки не залипали
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60 truncate" aria-label="Хлебные крошки">
              <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
              <span className="mx-1 opacity-50">/</span>
              <Link href={`${base}/services/bundles`} className="hover:underline">Пакеты</Link>
              <span className="mx-1 opacity-50">/</span>
              <span className="text-white/80">Новый</span>
            </nav>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Новый пакет / абонемент
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Соберите состав, задайте цену и правила использования.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href={`${base}/services/bundles`}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
            >
              Отмена
            </Link>
            <button
              onClick={() => save(true)}
              disabled={!!saving}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 disabled:opacity-50"
              title="Сохранить как черновик"
              aria-busy={saving === "draft" || undefined}
            >
              {saving === "draft" ? "Сохранение…" : "Сохранить как черновик"}
            </button>
            <button
              onClick={() => save(false)}
              disabled={!!saving}
              className="rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
              aria-busy={saving === "create" || undefined}
            >
              {saving === "create" ? "Создание…" : "Создать"}
            </button>
          </div>
        </div>
      </header>

      {/* Контент */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-3">
          {/* Основные поля пакета */}
          <BundleForm />
          {/* Состав: услуги и количества */}
          <BundleItemsEditor />
        </div>

        <aside className="grid gap-3">
          {/* Ценообразование / срок подписки */}
          <BundlePricingPanel />
          {/* Ограничения и правила использования */}
          <BundleRulesPanel />

          {/* Подсказка */}
          <section className="rounded-2xl border border-white/12 bg-white/10 p-4">
            <div className="text-sm font-medium text-white/85">Подсказка</div>
            <ul className="mt-2 space-y-1 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <Lucide.BadgePercent className="h-4 w-4 mt-0.5 opacity-70" aria-hidden="true" />
                <span>Укажите скидку в панели цены — она пересчитается от базовой суммы позиций.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lucide.Hourglass className="h-4 w-4 mt-0.5 opacity-70" aria-hidden="true" />
                <span>Для подписки задайте <em>periodDays</em> — срок действия в днях.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lucide.ShieldCheck className="h-4 w-4 mt-0.5 opacity-70" aria-hidden="true" />
                <span>Правила ограничат, кто и как может активировать пакет (например, только топ-мастера).</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {/* Липкие действия на мобильных */}
      <div className="md:hidden sticky bottom-3 z-10 mx-3">
        <div className="rounded-2xl border border-white/12 bg-white/10 backdrop-blur p-2 flex items-center justify-between">
          <Link
            href={`${base}/services/bundles`}
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85"
          >
            Отмена
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => save(true)}
              disabled={!!saving}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 disabled:opacity-50"
            >
              {saving === "draft" ? "…" : "Черновик"}
            </button>
            <button
              onClick={() => save(false)}
              disabled={!!saving}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {saving === "create" ? "…" : "Создать"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}