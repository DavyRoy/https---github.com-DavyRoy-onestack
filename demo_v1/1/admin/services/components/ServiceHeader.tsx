"use client";

import Link from "next/link";
import { Layers3, Tag, PackageSearch, Menu } from "lucide-react";
import { useState } from "react";

export default function ServicesHero() {
  const [open, setOpen] = useState(false);

  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Левая часть — заголовок */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Layers3 className="w-6 h-6 opacity-70" />
            Услуги
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Управление каталогом, ценами, категориями и пакетами
          </p>
        </div>

        {/* Правая часть — кнопки */}
        <div className="relative">
          {/* Desktop кнопки */}
          <div className="hidden sm:flex flex-wrap gap-2">
            <Link
              href="/demo/admin/services/pricing"
              className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              <PackageSearch className="w-4 h-4 opacity-70" />
              Прайс-лист
            </Link>

            <Link
              href="/demo/admin/services/categories"
              className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              <Tag className="w-4 h-4 opacity-70" />
              Категории
            </Link>

            <Link
              href="/demo/admin/services/bundles"
              className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              <Layers3 className="w-4 h-4 opacity-70" />
              Пакеты
            </Link>
          </div>

          {/* Mobile dropdown */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              aria-expanded={open}
            >
              <Menu className="w-4 h-4 opacity-70" />
              Меню
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-black/80 backdrop-blur-sm shadow-lg p-2 text-sm z-10">
                <Link
                  href="/demo/admin/services/pricing"
                  className="block px-2 py-1.5 rounded hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Прайс-лист
                </Link>
                <Link
                  href="/demo/admin/services/categories"
                  className="block px-2 py-1.5 rounded hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Категории
                </Link>
                <Link
                  href="/demo/admin/services/bundles"
                  className="block px-2 py-1.5 rounded hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Пакеты
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}