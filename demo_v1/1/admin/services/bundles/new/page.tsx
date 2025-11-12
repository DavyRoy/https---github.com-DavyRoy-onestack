"use client";

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

  const save = (asDraft = false) => {
    alert(asDraft ? "Сохранено как черновик (демо)" : "Пакет создан (демо)");
    router.push(`${base}/services/bundles`);
  };

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60">
              <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
              <span className="mx-1">/</span>
              <Link href={`${base}/services/bundles`} className="hover:underline">Пакеты</Link>
              <span className="mx-1">/</span>
              <span className="text-white/80">Новый</span>
            </nav>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
              Новый пакет/абонемент
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Соберите состав, задайте цену и правила использования.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href={`${base}/services/bundles`}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              Отмена
            </Link>
            <button
              onClick={() => save(true)}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              title="Сохранить как черновик"
            >
              Сохранить как черновик
            </button>
            <button
              onClick={() => save(false)}
              className="rounded-xl bg-white px-3 py-1.5 text-sm text-black hover:bg-white/90"
            >
              Создать
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
          {/* Ценообразование / скидки / период подписки */}
          <BundlePricingPanel />
          {/* Ограничения и правила использования */}
          <BundleRulesPanel />

          {/* Подсказка */}
          <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
            <div className="text-sm font-medium">Подсказка</div>
            <ul className="mt-2 space-y-1 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <Lucide.BadgePercent className="h-4 w-4 mt-0.5 opacity-70" />
                <span>Укажите скидку в панели цены — она пересчитается от базовой суммы позиций.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lucide.Hourglass className="h-4 w-4 mt-0.5 opacity-70" />
                <span>Для подписки задайте <em>periodDays</em> — срок действия в днях.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lucide.ShieldCheck className="h-4 w-4 mt-0.5 opacity-70" />
                <span>Правила ограничат, кто и как может активировать пакет (например, только топ-мастера).</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {/* Липкие действия на мобильных */}
      <div className="md:hidden sticky bottom-3 z-10 mx-3">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-2 flex items-center justify-between">
          <Link
            href={`${base}/services/bundles`}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
          >
            Отмена
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => save(true)}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            >
              Черновик
            </button>
            <button
              onClick={() => save(false)}
              className="rounded-xl bg-white px-3 py-2 text-sm text-black"
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}