// app/demo/manager/components/ManagerSidebar.client.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { groups } from "./managerNav.data";

type Child = { label: string; href: string };
type Item = { label: string; href: string; icon?: React.ComponentType<{ className?: string }>; children?: Child[] };
type Group = { title: string; items: Item[] };

const sidebarShell = "hidden xl:flex xl:w-[300px] xl:flex-col xl:pt-2";
const sidebarInner = "sticky top-[5.2rem] flex-1 overflow-y-auto pb-24 pr-2";

const navLink = "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition";
const navMuted = "border-transparent text-white/70 hover:border-white/10 hover:bg-white/12";
const navActive = "border-white/20 bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset]";

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function Children({ item, pathname }: { item: Item; pathname: string }) {
  const open = isActive(item.href, pathname) && item.children?.length;
  if (!open) return null;

  return (
    <div className="ml-4 mt-1 grid gap-1" role="group" aria-label={item.label}>
      {item.children!.map((child, i) => {
        const active = pathname === child.href;
        const key = `${child.href}::${child.label}::${i}`;
        return (
          <Link
            key={key}
            href={child.href}
            prefetch={false}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${
              active
                ? "border-white/20 bg-white/10 text-white"
                : "border-transparent text-white/60 hover:border-white/10 hover:bg-white/12"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {child.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function ManagerSidebar() {
  const pathname = usePathname();

  const content = useMemo(
    () =>
      (groups as Group[]).map((group, gi) => (
        <div key={`${group.title}::${gi}`} className="grid gap-2">
          <div className="px-2 text-xs uppercase tracking-wide text-white/60">{group.title}</div>

          <div className="grid gap-1">
            {group.items.map((item, ii) => {
              const active = isActive(item.href, pathname);
              const Icon = item.icon;
              const key = `${item.href}::${item.label}::${ii}`;

              return (
                <div key={key}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={`${navLink} ${active ? navActive : navMuted}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {Icon ? <Icon className="h-4 w-4 opacity-90" /> : null}
                    <span className="truncate">{item.label}</span>
                  </Link>

                  <Children item={item} pathname={pathname} />
                </div>
              );
            })}
          </div>
        </div>
      )),
    [pathname]
  );

  return (
    <aside className={sidebarShell} aria-label="Боковая навигация менеджера">
      <div className={`${sidebarInner} pl-3`}>
        <div className="admin-surface px-4 py-5">
          <nav className="grid gap-6">{content}</nav>
        </div>
      </div>
    </aside>
  );
}