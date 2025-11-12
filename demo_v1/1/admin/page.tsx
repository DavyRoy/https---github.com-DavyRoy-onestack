// app/admin/page.tsx (или где у тебя лежит страница роли администратора)
import Link from "next/link";

export const metadata = {
  title: "Администратор",
  description:
    "Настройки, роли, аналитика и финансы. Демо-панель администратора.",
  alternates: { canonical: "/admin" },
};

type Module = {
  key: string;
  title: string;
  href?: string; // если появится реальный маршрут — просто добавь сюда
  subtitle?: string;
  status?: "wip" | "ready";
};

const MODULES: Module[] = [
  { key: "crm", title: "CRM-панель", subtitle: "В разработке", status: "wip" },
  { key: "shop", title: "Магазин", subtitle: "В разработке", status: "wip" },
  { key: "services", title: "Услуги", subtitle: "В разработке", status: "wip" },
  {
    key: "booking",
    title: "Бронирование",
    subtitle: "В разработке",
    status: "wip",
  },
];

export default function AdminPage() {
  return (
    <main
      className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14"
      aria-labelledby="admin-title"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 id="admin-title" className="text-2xl font-semibold">
            Демо — Администратор
          </h1>
          <p className="mt-2 text-neutral-600 max-w-2xl">
            Настройки, роли, аналитика и финансы. Заглушка для сценариев
            администратора.
          </p>
        </div>

        {/* Крошка/возврат */}
        <nav aria-label="Хлебные крошки" className="shrink-0">
          <Link
            href="/demo"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            <span aria-hidden>←</span> На главную демо
          </Link>
        </nav>
      </header>

      {/* Модули */}
      <section aria-labelledby="modules-title" className="mt-8">
        <h2 id="modules-title" className="sr-only">
          Модули администратора
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <li key={m.key} className="contents">
              <article
                className="rounded-lg border p-4 transition-shadow hover:shadow-sm"
                aria-labelledby={`module-${m.key}-title`}
              >
                <div
                  id={`module-${m.key}-title`}
                  className="font-medium tracking-tight"
                >
                  {m.title}
                </div>

                <p className="mt-1 text-sm text-neutral-600">
                  {m.subtitle ?? (m.status === "ready" ? "Готово" : "В разработке")}
                </p>

                <div className="mt-3">
                  {m.href ? (
                    <Link
                      href={m.href}
                      prefetch={false}
                      className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
                    >
                      Открыть
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex cursor-not-allowed items-center rounded-md border px-3 py-1.5 text-sm text-neutral-500"
                      title="Раздел в разработке"
                    >
                      Скоро
                    </span>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}