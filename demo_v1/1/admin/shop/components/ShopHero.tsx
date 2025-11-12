// app/demo/admin/shop/components/ShopHero.tsx
"use client";

import Link from "next/link";
import { Package, Layers, ShoppingBag } from "lucide-react";

type ShopHeroProps = {
  className?: string;
  /** можно передавать фильтры из родителя, если нужно */
  period?: string;
  channel?: string;
  stock?: string;
  status?: string;
  q?: string;
  baseHref?: string;
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ShopHero({
  className = "",
  baseHref = "/demo/admin",
}: ShopHeroProps) {
  const cards = [
    {
      title: "Товары",
      desc: "Каталог, цены, остатки и медиа",
      href: `${baseHref}/shop/products`,
      icon: <Package className="w-5 h-5 opacity-80" />,
    },
    {
      title: "Категории",
      desc: "Структура каталога и SEO-настройки",
      href: `${baseHref}/shop/categories`,
      icon: <Layers className="w-5 h-5 opacity-80" />,
    },
    {
      title: "Заказы",
      desc: "Просмотр, аудит и агрегаты (read-only)",
      href: `${baseHref}/orders`,
      icon: <ShoppingBag className="w-5 h-5 opacity-80" />,
    },
  ];

  return (
    <section
      className={cls(
        "grid gap-3 sm:grid-cols-2 md:grid-cols-3",
        className
      )}
      aria-labelledby="shop-hero-title"
    >
      {cards.map((c) => (
        <Link
          key={c.title}
          href={c.href}
          prefetch={false}
          className="group flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{c.title}</div>
            <span className="text-white/70 group-hover:text-white transition">
              {c.icon}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/70 leading-snug">{c.desc}</p>
        </Link>
      ))}
    </section>
  );
}