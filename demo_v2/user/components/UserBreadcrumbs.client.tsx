// app/demo/user/components/UserBreadcrumbs.client.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import config from "./nav.config.json";

type Child = { label: string; href: string };
type Item = { label: string; href: string; children?: Child[] };
type Group = { title?: string; items: Item[] };

// Унифицируем возможные формы конфига: либо массив групп, либо { sections: Group[] }
const groups: Group[] = (() => {
  const raw = config as unknown as Group[] | { sections: Group[] };
  return Array.isArray(raw) ? raw : raw.sections ?? [];
})();

// titleMap по последнему сегменту href
const titleMap: Record<string, string> = (() => {
  const map: Record<string, string> = { demo: "Демо", user: "Пользователь" };
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

export default function UserBreadcrumbs() {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const userIdx = parts.findIndex((p) => p === "user");
    const head = userIdx >= 0 ? parts.slice(0, userIdx + 1) : parts;
    const tail = userIdx >= 0 ? parts.slice(userIdx + 1) : [];

    return [
      { href: "/demo", label: "Главная" },
      { href: "/demo/user", label: "Пользователь" },
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
    <nav
      className="flex flex-wrap items-center gap-1 text-xs font-medium text-white/60"
      aria-label="Хлебные крошки"
    >
      {crumbs.map((item, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={`${item.href}::${i}`} className="inline-flex items-center gap-1">
            {i > 0 && <span className="opacity-40" aria-hidden>/</span>}
            <Link
              href={item.href}
              prefetch={false}
              className={
                last
                  ? "pointer-events-none text-white"
                  : "text-white/70 transition hover:text-white hover:underline"
              }
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