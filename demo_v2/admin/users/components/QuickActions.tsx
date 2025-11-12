"use client";

import Link from "next/link";
import React from "react";

type ActionItem = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
};

export default function QuickActions({
  className = "",
}: {
  className?: string;
}) {
  const items: ActionItem[] = [
    {
      title: "Пригласить пользователя",
      href: "/demo/admin/users/list?invite=true",
      description: "Отправить приглашение новому сотруднику",
    },
    {
      title: "Создать роль",
      href: "/demo/admin/users/roles/new",
      description: "Задать права доступа и шаблон ролей",
    },
    {
      title: "Экспорт списка (демо)",
      href: "#",
      description: "Скачать CSV/XLSX-файл с пользователями",
    },
  ];

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (href === "#") {
      e.preventDefault();
      alert("Экспорт выполняется в демо-режиме и не сохраняется.");
    }
  };

  return (
    <section
      className={`
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 md:p-5
        ${className}
      `}
      aria-labelledby="quick-actions-title"
    >
      <h2
        id="quick-actions-title"
        className="text-sm font-semibold text-white/85 mb-2"
      >
        Быстрые действия
      </h2>

      <div
        className="
          grid gap-3 sm:grid-cols-2 md:grid-cols-3
          min-w-0
        "
      >
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            onClick={(e) => handleClick(e, it.href)}
            className="
              group rounded-xl border border-white/12 bg-white/[0.08]
              p-4 flex flex-col justify-center items-center text-center
              text-sm font-medium text-white/85
              hover:bg-white/[0.12] hover:border-white/20
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
              transition-all duration-150 min-w-0
            "
          >
            <span className="break-words">{it.title}</span>
            {it.description && (
              <span className="text-xs text-white/60 mt-1 leading-snug break-words">
                {it.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}