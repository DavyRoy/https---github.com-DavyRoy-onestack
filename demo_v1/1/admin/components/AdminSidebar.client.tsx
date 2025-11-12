// app/demo/admin/components/AdminSidebar.client.tsx — мелкий апдейт: на мобилках скрыт, на десктопе тянется на всю высоту
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import config from "./nav.config.json";
import { IconLazy } from "./icon-loader";

type Child = { label: string; href: string };
type Item = { label: string; href: string; icon?: string; children?: Child[] };
type Group = { title: string; items: Item[] };

const groups = config as Group[];

const sidebarShell = "hidden xl:flex xl:w-[300px] xl:flex-col"; // чуть шире на full-width лэйауте
const sidebarInner = "sticky top-16 flex-1 overflow-y-auto pb-12 pr-3"; // top-16 под новый topbar

const navLink = "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition";
const navMuted = "text-white/80 hover:bg-white/10";
const navActive = "bg-white/10 text-white";

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function Children({ item, pathname }: { item: Item; pathname: string }) {
  const open = isActive(item.href, pathname) && item.children?.length;
  if (!open) return null;
  return (
    <div className="mt-1 ml-4 grid gap-1" role="group" aria-label={item.label}>
      {item.children!.map((child) => {
        const active = pathname === child.href;
        return (
          <Link
            key={child.href}
            href={child.href}
            prefetch={false}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${
              active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/10"
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

export default function Sidebar() {
  const pathname = usePathname();

  const content = useMemo(
    () =>
      groups.map((group) => (
        <div key={group.title} className="grid gap-2">
          <div className="px-2 text-xs uppercase tracking-wide text-white/60">{group.title}</div>
          <div className="grid gap-1">
            {group.items.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={`${navLink} ${active ? navActive : navMuted}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.icon && <IconLazy name={item.icon} aria-hidden />}
                    {item.label}
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
    <aside className={sidebarShell} aria-label="Боковая навигация администратора">
      <div className={sidebarInner + " pl-4"}>
        <nav className="mt-4 grid gap-6">{content}</nav>
      </div>
    </aside>
  );
}