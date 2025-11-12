// app/demo/admin/components/AdminBreadcrumbs.client.tsx — titleMap из JSON
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import config from "./nav.config.json";

type Child = { label: string; href: string };
type Item = { label: string; href: string; children?: Child[] };
type Group = { title: string; items: Item[] };

const groups = config as Group[];

// Собираем map сегмент→label из конфигурации (берём последний сегмент href)
const titleMap: Record<string, string> = (() => {
  const map: Record<string, string> = {
    demo: "Демо",
    admin: "Администратор",
  };
  const push = (href: string, label: string) => {
    const seg = href.split("/").filter(Boolean).at(-1);
    if (seg) map[seg] = label;
  };
  for (const g of groups) {
    for (const it of g.items) {
      push(it.href, it.label);
      it.children?.forEach((c) => push(c.href, c.label));
    }
  }
  return map;
})();

function prettifyFallback(key: string) {
  return decodeURIComponent(key).replace(/(^|\s|-)\S/g, (m) => m.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const adminIdx = parts.findIndex((p) => p === "admin");
    const head = adminIdx >= 0 ? parts.slice(0, adminIdx + 1) : parts;
    const tail = adminIdx >= 0 ? parts.slice(adminIdx + 1) : [];

    return [
      { href: "/demo", label: "Главная" },
      { href: "/demo/admin", label: "Администратор" },
      ...tail.map((_, idx) => {
        const segs = [...head, ...tail.slice(0, idx + 1)];
        const href = "/" + segs.join("/");
        const key = tail[idx];
        const label = titleMap[key] ?? prettifyFallback(key);
        return { href, label };
      }),
    ];
  }, [pathname]);

  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-white/70" aria-label="Хлебные крошки">
      {crumbs.map((item, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={item.href} className="inline-flex items-center gap-1">
            {i > 0 && <span className="opacity-40" aria-hidden>/</span>}
            <Link
              href={item.href}
              prefetch={false}
              className={last ? "text-white/80 pointer-events-none" : "hover:underline"}
              aria-current={last ? "page" : undefined}
            >
              {item.label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}