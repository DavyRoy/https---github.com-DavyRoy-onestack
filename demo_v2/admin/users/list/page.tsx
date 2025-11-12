// app/demo/admin/users/list/page.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import UsersFiltersBar from "../components/UsersFiltersBar";
import UsersTable from "../components/UsersTable";
import { USERS } from "@/app/demo/(shared)/users/data/index";

export default function AdminUsersListPage() {
  const sp = useSearchParams();
  const [mounted, setMounted] = React.useState(false);

  // Ждём маунта, чтобы исключить расхождение SSR/CSR при чтении searchParams
  React.useEffect(() => setMounted(true), []);

  // Читаем q только после маунта
  const q = mounted ? (sp.get("q") ?? "").toLowerCase() : "";

  const rows = React.useMemo(() => {
    if (!mounted) return USERS; // пока монтируется — показываем все (или скелетон ниже)
    if (!q) return USERS;
    return USERS.filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(q)
    );
  }, [q, mounted]);

  // Скелетон на время маунта: без скачков
  if (!mounted) {
    return (
      <div className="grid gap-4 w-full max-w-full min-w-0 supports-[overflow:clip]:overflow-x-clip overflow-x-hidden">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-64 bg-white/10 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-9 w-28 bg-white/10 rounded animate-pulse" />
        </header>

        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
          <div className="h-9 w-full bg-white/10 rounded animate-pulse" />
        </section>

        <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
          <div className="h-5 w-1/3 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-white/8 rounded animate-pulse" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold">Пользователи</h1>
          <p className="text-white/60 text-sm mt-1">
            Управляйте аккаунтами, ролями и 2FA
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => alert("Приглашение (демо)")}
            className="w-full sm:w-auto rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white"
          >
            Пригласить
          </button>
        </div>
      </header>

      {/* Панель фильтров */}
      <div className="min-w-0">
        <UsersFiltersBar />
      </div>

      {/* Таблица / Пустое состояние */}
      {rows.length > 0 ? (
        <UsersTable rows={rows} />
      ) : (
        <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-8 text-center min-w-0">
          <div className="text-lg font-semibold">Ничего не найдено</div>
          <div className="text-white/60 mt-1">
            Попробуйте изменить запрос или сбросить фильтр.
          </div>
        </section>
      )}
    </div>
  );
}