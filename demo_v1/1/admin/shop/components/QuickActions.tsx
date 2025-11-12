// app/demo/admin/shop/components/QuickActions.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, PackagePlus, FolderPlus } from "lucide-react";

type QuickActionsProps = {
  className?: string;
  role?: "admin" | "manager" | "user";
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function QuickActions({ className = "", role = "admin" }: QuickActionsProps) {
  const [showImport, setShowImport] = useState(false);

  const actions = [
    {
      label: "Создать товар",
      href: "/demo/admin/shop/products/new",
      icon: <PackagePlus className="w-4 h-4" />,
    },
    {
      label: "Импорт CSV / XLSX",
      onClick: () => setShowImport(true),
      icon: <Upload className="w-4 h-4" />,
    },
    {
      label: "Новая категория",
      href: "/demo/admin/shop/categories/new",
      icon: <FolderPlus className="w-4 h-4" />,
    },
  ];

  const filteredActions = role === "manager" ? actions.slice(0, 2) : actions;

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="quick-shop-actions"
    >
      <div id="quick-shop-actions" className="text-sm font-medium">
        Быстрые действия
      </div>

      <div className="mt-3 grid gap-2">
        {filteredActions.map((a) =>
          a.href ? (
            <Link
              key={a.label}
              href={a.href}
              prefetch={false}
              className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/30 transition"
            >
              <span className="opacity-80 group-hover:opacity-100">{a.icon}</span>
              <span>{a.label}</span>
            </Link>
          ) : (
            <button
              key={a.label}
              onClick={a.onClick}
              className="group flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/30 transition"
            >
              <span className="opacity-80 group-hover:opacity-100">{a.icon}</span>
              <span>{a.label}</span>
            </button>
          )
        )}
      </div>

      {showImport && (
        <div className="mt-3 rounded-xl border border-white/15 bg-black/40 p-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="text-sm font-medium">Импорт товаров</div>
          <p className="text-xs text-white/70 mt-1 leading-snug">
            Здесь появится мастер импорта CSV / XLSX с проверкой структуры и предпросмотром.
            <br />
            Пока это демо-заглушка.
          </p>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setShowImport(false)}
              className="rounded-lg bg-white px-3 py-1.5 text-sm text-black hover:bg-white/90 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-white/60">
        Набор действий зависит от роли: у менеджера доступно меньше опций.
      </div>
    </section>
  );
}