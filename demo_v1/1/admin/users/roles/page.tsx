"use client";

import Link from "next/link";
import RolesTable from "../components/RolesTable";
import { ROLES } from "@/app/demo/(shared)/users/roles/roles";

export default function AdminRolesListPage() {
  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Хедер */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold">Роли</h1>
          <p className="text-white/60 text-sm mt-1">
            Управляйте ролями, правами и участниками.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href="/demo/admin/users/roles/new"
            className="w-full sm:w-auto rounded-lg bg-white/90 text-black px-3 py-2 text-sm text-center hover:bg-white"
          >
            Создать роль
          </Link>
        </div>
      </header>

      {/* Таблица ролей */}
      <div className="min-w-0">
        {ROLES.length > 0 ? (
          <RolesTable rows={ROLES} />
        ) : (
          <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-8 text-center">
            <div className="text-lg font-semibold">Нет ролей</div>
            <div className="text-white/60 mt-1">
              Добавьте первую роль, чтобы задать права доступа.
            </div>
          </section>
        )}
      </div>
    </div>
  );
}