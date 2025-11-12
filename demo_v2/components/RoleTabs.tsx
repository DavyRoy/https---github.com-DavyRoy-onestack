"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, Wrench, CalendarCheck, LayoutDashboard } from "lucide-react";

export type TabItem = {
  slug: string;
  label: string;
};

/* ----------------------------- UI helpers ----------------------------- */
const desktopBtnBase =
  "inline-flex items-center justify-center gap-2 rounded-full h-9 px-3.5 text-sm font-medium outline-none transition";
const desktopBtnGhost =
  "border border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/90 focus:ring-2 focus:ring-[hsl(var(--brand))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--panel))]";
const desktopBtnActive =
  "bg-[hsl(var(--brand))] text-white border-transparent hover:opacity-95 focus:ring-2 focus:ring-[hsl(var(--brand))]/60 focus:ring-offset-2 focus:ring-offset-[hsl(var(--panel))]";

/* На мобиле — предсказуемые размеры */
const mobileBtnBase =
  "flex flex-col items-center justify-center rounded-lg h-10 px-2 select-none outline-none";
const mobileBtnGhost =
  "border border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--fg))] focus:ring-2 focus:ring-[hsl(var(--brand))]";
const mobileBtnActive =
  "bg-[hsl(var(--panel))]/90 border-[hsl(var(--brand))] text-[hsl(var(--fg))] shadow-[inset_0_-2px_0_hsl(var(--brand))]";

/* ------------------------------- Icons -------------------------------- */
function IconFor(slug: string) {
  const cls = "h-5 w-5";
  switch (slug) {
    case "shop":
      return <ShoppingBag className={cls} aria-hidden />;
    case "services":
      return <Wrench className={cls} aria-hidden />;
    case "booking":
      return <CalendarCheck className={cls} aria-hidden />;
    case "crm":
      return <LayoutDashboard className={cls} aria-hidden />;
    default:
      return null;
  }
}

/* ------------------------------ Component ----------------------------- */
export default function RoleTabs({ base, items }: { base: string; items: TabItem[] }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Ключ для восстановления скролла конкретного набора табов
  const storageKey = useMemo(() => `role-tabs-scroll:${base}`, [base]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Восстановить/сохранить горизонтальный скролл
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // restore
    const x = Number(sessionStorage.getItem(storageKey) ?? 0);
    if (Number.isFinite(x)) el.scrollLeft = x;
    // persist
    const onScroll = () => sessionStorage.setItem(storageKey, String(el.scrollLeft));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [storageKey]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      {/* Desktop tabs */}
      <nav aria-label="Разделы роли" className="-mb-2 hidden md:block">
        <div
          ref={scrollerRef}
          className={clsx(
            "relative flex items-center gap-2 overflow-x-auto py-2",
            // fade по краям с помощью mask
            "[-webkit-mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]",
            "[mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]"
          )}
        >
          {items.map(({ slug, label }) => {
            const href = `${base}/${slug}`;
            const active = isActive(href);
            return (
              <div key={slug} className="relative">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(desktopBtnBase, active ? desktopBtnActive : desktopBtnGhost)}
                >
                  {IconFor(slug)}
                  {label}
                </Link>

                {/* Активный underline для «линейрового» ощущения */}
                {active && (
                  <motion.span
                    layoutId={`role-tabs-underline-${base}`} // общий layoutId для плавного перехода
                    className="absolute -bottom-1 left-1/4 right-1/4 h-[2px] rounded-full"
                    style={{ backgroundColor: "hsl(var(--brand))" }}
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 35 }}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom tabs */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 block md:hidden">
        <nav
          aria-label="Навигация по вкладкам"
          className="pointer-events-auto border-t border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 backdrop-blur
                     px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
          style={{ willChange: "transform" }}
        >
          <div className="grid grid-cols-4 gap-2">
            {items.map(({ slug, label }) => {
              const href = `${base}/${slug}`;
              const active = isActive(href);
              return (
                <Link
                  key={slug}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={label}
                  className={clsx(mobileBtnBase, active ? mobileBtnActive : mobileBtnGhost)}
                >
                  {IconFor(slug)}
                  <span className="sr-only">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Spacer, чтобы контент не прятался за таббаром на мобилке */}
      <div aria-hidden className="h-16 md:hidden" />
    </>
  );
}