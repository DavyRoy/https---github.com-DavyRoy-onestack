"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
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
function getBase(pathname: string | null, baseHref?: string) {
  if (baseHref) return baseHref.replace(/\/$/, "");
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** Собрать query только из заданных фильтров */
function buildQuery(params: Partial<Record<"period"|"channel"|"stock"|"status"|"q", string>>) {
  const qs = new URLSearchParams();
  (["period","channel","stock","status","q"] as const).forEach((k) => {
    const v = params[k];
    if (typeof v === "string" && v.trim() !== "") qs.set(k, v.trim());
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export default function ShopHero({
  className = "",
  baseHref,
  period,
  channel,
  stock,
  status,
  q,
}: ShopHeroProps) {
  const pathname = usePathname();
  const base = getBase(pathname, baseHref);

  const query = useMemo(
    () => buildQuery({ period, channel, stock, status, q }),
    [period, channel, stock, status, q]
  );

  const cards = useMemo(
    () => [
      {
        title: "Товары",
        desc: "Каталог, цены, остатки и медиа",
        href: `${base}/shop/products${query}`,
        icon: <Package className="w-5 h-5 opacity-80" aria-hidden="true" />,
      },
      {
        title: "Категории",
        desc: "Структура каталога и SEO-настройки",
        href: `${base}/shop/categories${query}`,
        icon: <Layers className="w-5 h-5 opacity-80" aria-hidden="true" />,
      },
      {
        title: "Заказы",
        desc: "Просмотр, аудит и агрегаты (только чтение)",
        href: `${base}/orders${query}`,
        icon: <ShoppingBag className="w-5 h-5 opacity-80" aria-hidden="true" />,
      },
    ],
    [base, query]
  );

  return (
    <section
      className={cls(
        "admin-section rounded-2xl border border-white/12 bg-white/8 p-4 md:p-6 backdrop-blur-sm",
        className
      )}
      aria-labelledby="shop-hero-title"
      role="region"
    >
      <h2 id="shop-hero-title" className="mb-3 text-sm font-medium text-white/85 sm:mb-4">
        Основные разделы магазина
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            prefetch={false}
            className="group flex flex-col justify-between rounded-2xl border border-white/12 bg-white/10 p-4 text-white/85 transition-all hover:border-white/18 hover:bg-white/16 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label={`Открыть раздел: ${c.title}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{c.title}</div>
              <span className="text-white/70 transition-colors group-hover:text-white">
                {c.icon}
              </span>
            </div>
            <p className="mt-2 text-xs leading-snug text-white/60">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}