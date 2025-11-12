"use client";

import { useSearchParams } from "next/navigation";
import UsersFiltersBar from "../components/UsersFiltersBar";
import UsersTable from "../components/UsersTable";
import { USERS } from "@/app/demo/(shared)/users/data/index";

export default function AdminUsersListPage() {
  const sp = useSearchParams();

  // демо-фильтрация по q
  const q = (sp.get("q") ?? "").toLowerCase();
  const rows = USERS.filter((u) =>
    q ? `${u.name} ${u.email}`.toLowerCase().includes(q) : true
  );

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
        <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-8 text-center">
          <div className="text-lg font-semibold">Ничего не найдено</div>
          <div className="text-white/60 mt-1">
            Попробуйте изменить запрос или сбросить фильтр.
          </div>
        </section>
      )}
    </div>
  );
}