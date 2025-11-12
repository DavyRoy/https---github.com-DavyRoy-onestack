"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import * as Lucide from "lucide-react";
import { ADMIN_BUNDLES } from "@/app/demo/(shared)/data/services";
import BundleForm from "@/app/demo/admin/services/components/BundleForm";
import BundleItemsEditor from "@/app/demo/admin/services/components/BundleItemsEditor";
import BundlePricingPanel from "@/app/demo/admin/services/components/BundlePricingPanel";
import BundleRulesPanel from "@/app/demo/admin/services/components/BundleRulesPanel";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function StatusBadge({ v }: { v: "active" | "draft" | "archived" }) {
  const cls =
    v === "active"
      ? "bg-emerald-400/15 text-emerald-300"
      : v === "draft"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-white/10 text-white/70";
  return (
    <span className={`rounded-lg px-2 py-0.5 text-xs uppercase tracking-wide ${cls}`}>
      {v}
    </span>
  );
}

export default function AdminBundleDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const router = useRouter();

  const bundle = ADMIN_BUNDLES.find((b) => b.id === params.id);

  if (!bundle) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Пакет не найден
          </h1>
          <Link
            href={`${base}/services/bundles`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>

        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70">
          Проверьте ссылку или вернитесь к списку пакетов.
        </section>
      </div>
    );
  }

  const print = () => window.print();
  const toggleArchive = () => {
    // демо: просто уведомление
    if (bundle.status === "archived") {
      alert("Разархивировано (демо)");
    } else {
      alert("Архивировано (демо)");
    }
  };
  const duplicate = () => {
    alert("Создана копия пакета (демо)");
    // В реале: POST /api/services/bundles/duplicate
  };

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60">
              <Link href={`${base}/services`} className="hover:underline">
                Услуги
              </Link>
              <span className="mx-1">/</span>
              <Link href={`${base}/services/bundles`} className="hover:underline">
                Пакеты
              </Link>
              <span className="mx-1">/</span>
              <span className="text-white/80 truncate inline-block max-w-[70vw] align-bottom">
                {bundle.name}
              </span>
            </nav>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
                {bundle.name}
              </h1>
              <StatusBadge v={bundle.status} />
            </div>
            <div className="mt-1 text-xs text-white/60">
              ID: <span className="font-mono">{bundle.id}</span>
              {bundle.type === "subscription" && bundle.periodDays ? (
                <> • Подписка {bundle.periodDays} дн.</>
              ) : (
                <> • Пакет</>
              )}
            </div>
          </div>

          {/* Действия */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`${base}/services/bundles`}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              К списку
            </Link>
            <button
              onClick={duplicate}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              title="Создать копию"
            >
              Дублировать
            </button>
            <button
              onClick={toggleArchive}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              title={bundle.status === "archived" ? "Разархивировать" : "Архивировать"}
            >
              {bundle.status === "archived" ? "Разархивировать" : "Архивировать"}
            </button>
            <button
              onClick={print}
              className="rounded-xl bg-white px-3 py-1.5 text-sm text-black hover:bg-white/90"
              title="Печать"
            >
              Печать
            </button>
          </div>
        </div>
      </header>

      {/* Контент */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-3">
          {/* Основные свойства и состав пакета */}
          <BundleForm initial={bundle} />
          <BundleItemsEditor initial={bundle} />
        </div>

        <aside className="grid gap-3">
          {/* Ценообразование и правила использования */}
          <BundlePricingPanel initial={bundle} />
          <BundleRulesPanel initial={bundle} />

          {/* Подсказка / ссылки */}
          <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
            <div className="text-sm font-medium">Подсказка</div>
            <p className="mt-1 text-xs text-white/70">
              Пакет может включать разные услуги и количества. Для подписки задайте период
              действия. В реальном проекте здесь будут права доступа и статусы публикации.
            </p>
            <div className="mt-2 grid gap-2">
              <button
                onClick={() => alert("Сохранено (демо)")}
                className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90"
              >
                Сохранить изменения
              </button>
              <button
                onClick={() => router.push(`${base}/services/bundles`)}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              >
                В список пакетов
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}