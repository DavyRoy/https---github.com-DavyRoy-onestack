"use client";

import Link from "next/link";

export default function AccessHero() {
  return (
    <section
      className="
        rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6
        backdrop-blur-sm w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Верхний блок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold break-words">
            Пользователи и роли
          </h1>
          <p className="text-sm text-white/70 mt-1 leading-snug">
            Управляйте доступом команды: приглашайте пользователей, назначайте роли и настраивайте права.
          </p>
        </div>

        {/* Кнопки */}
        <div
          className="
            flex flex-wrap gap-2 w-full sm:w-auto
            [&>*]:flex-1 [&>*]:text-center sm:[&>*]:flex-none
          "
        >
          <Link
            href="/demo/admin/users/list"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
          >
            Список
          </Link>
          <Link
            href="/demo/admin/users/roles"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
          >
            Роли
          </Link>
          <Link
            href="/demo/admin/users/permissions"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
          >
            Права
          </Link>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div
        className="
          mt-4 grid gap-3
          sm:grid-cols-2 lg:grid-cols-4
          min-w-0
        "
      >
        <Link
          href="/demo/admin/users/list?status=invited"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Быстрая ссылка</div>
          <div className="font-medium mt-1 break-words">
            Приглашения в ожидании
          </div>
        </Link>

        <Link
          href="/demo/admin/users/list?no2fa=true"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Контроль безопасности</div>
          <div className="font-medium mt-1 break-words">
            Пользователи без 2FA
          </div>
        </Link>

        <Link
          href="/demo/admin/users/roles/new"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Быстрое действие</div>
          <div className="font-medium mt-1 break-words">Создать роль</div>
        </Link>

        <Link
          href="/demo/admin/users/list?created=30d"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Аналитика</div>
          <div className="font-medium mt-1 break-words">Новые за 30 дней</div>
        </Link>
      </div>
    </section>
  );
}