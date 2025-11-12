"use client";

import Link from "next/link";
import React from "react";

export default function QuickActions() {
  const items = [
    { title: "Пригласить пользователя", href: "/demo/admin/users/list?invite=true" },
    { title: "Создать роль", href: "/demo/admin/users/roles/new" },
    { title: "Экспорт списка (демо)", href: "#" },
  ];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm text-white/70 mb-2">Быстрые действия</div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="
              rounded-xl border border-white/15 bg-white/[0.03]
              p-4 text-center text-sm font-medium
              hover:bg-white/[0.08] hover:border-white/25
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-white/30
            "
          >
            {it.title}
          </Link>
        ))}
      </div>
    </section>
  );
}