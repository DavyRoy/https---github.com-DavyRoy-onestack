// app/demo/admin/components/MobileTabbar.client.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconLazy } from "./icon-loader";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

/** ====== ЖЁСТКО ЗАДАННОЕ МЕНЮ ДЛЯ МОБИЛЬНОГО НИЖНЕГО ДОКА ====== */
type Child = { label: string; href: string; icon?: string };
type Item = { label: string; href: string; icon: string; children?: Child[] };
type Category = { key: string; title: string; icon: string; items: Item[] };

const CATEGORIES: Category[] = [
  {
    key: "overview",
    title: "Дашборд",
    icon: "layout-dashboard",
    items: [{ label: "Дашборд", href: "/demo/admin/dashboard", icon: "layout-dashboard" }],
  },
  {
    key: "commerce",
    title: "КОММЕРЦИЯ",
    icon: "store",
    items: [
      {
        label: "Магазин",
        href: "/demo/admin/shop",
        icon: "store",
        children: [
          { label: "Магазин", href: "/demo/admin/shop" },
          { label: "Товары", href: "/demo/admin/shop/products" },
          { label: "Категории", href: "/demo/admin/shop/categories" },
          { label: "Заказы", href: "/demo/admin/orders" },
        ],
      },
      {
        label: "Услуги",
        href: "/demo/admin/services",
        icon: "briefcase",
        children: [
          { label: "Услуги", href: "/demo/admin/services" },
          { label: "Прайс-лист", href: "/demo/admin/services/pricing" },
          { label: "Категории услуг", href: "/demo/admin/services/categories" },
          { label: "Пакеты", href: "/demo/admin/services/bundles" },
        ],
      },
      {
        label: "Бронирование",
        href: "/demo/admin/booking",
        icon: "calendar-days",
        children: [
          { label: "Бронирование", href: "/demo/admin/booking" },
          { label: "Расписания", href: "/demo/admin/booking/schedules" },
          { label: "Политики", href: "/demo/admin/booking/policies" },
          { label: "Календарь", href: "/demo/admin/calendar" },
        ],
      },
    ],
  },
  {
    key: "crm",
    title: "CRM",
    icon: "users-2",
    items: [
      {
        label: "CRM",
        href: "/demo/admin/crm",
        icon: "users-2",
        children: [
          { label: "CRM", href: "/demo/admin/crm" },
          { label: "Клиенты", href: "/demo/admin/crm/clients" },
          { label: "Источники / воронки", href: "/demo/admin/crm/pipelines" },
          { label: "Сегменты", href: "/demo/admin/crm/segments" },
        ],
      },
    ],
  },
  {
    key: "finance",
    title: "ФИНАНСЫ",
    icon: "credit-card",
    items: [
      {
        label: "Платежи",
        href: "/demo/admin/payments",
        icon: "credit-card",
        children: [
          { label: "Платежи", href: "/demo/admin/payments" },
          { label: "Провайдеры", href: "/demo/admin/payments/providers" },
          { label: "Тарифы/комиссии", href: "/demo/admin/payments/fees" },
        ],
      },
    ],
  },
  {
    key: "reports",
    title: "ОТЧЁТЫ",
    icon: "chart-spline",
    items: [
      {
        label: "Аналитика",
        href: "/demo/admin/reports",
        icon: "chart-spline",
        children: [
          { label: "Аналитика", href: "/demo/admin/reports" },
          { label: "Продажи и выручка", href: "/demo/admin/reports/sales" },
          { label: "Бронирования", href: "/demo/admin/reports/booking" },
          { label: "CRM-конверсия", href: "/demo/admin/reports/crm" },
        ],
      },
    ],
  },
  {
    key: "iam",
    title: "УПРАВЛЕНИЕ ДОСТУПОМ",
    icon: "shield",
    items: [
      {
        label: "Пользователи и роли",
        href: "/demo/admin/users",
        icon: "shield",
        children: [
          { label: "Пользователи и роли", href: "/demo/admin/users" },
          { label: "Пользователи", href: "/demo/admin/users/list" },
          { label: "Роли", href: "/demo/admin/users/roles" },
          { label: "Права", href: "/demo/admin/users/permissions" },
        ],
      },
    ],
  },
  {
    key: "integrations",
    title: "ИНТЕГРАЦИИ",
    icon: "plug",
    items: [
      {
        label: "Интеграции",
        href: "/demo/admin/integrations",
        icon: "plug",
        children: [
          { label: "Интеграции", href: "/demo/admin/integrations" },
          { label: "Каналы", href: "/demo/admin/integrations/channels" },
          { label: "Вебхуки", href: "/demo/admin/integrations/webhooks" },
          { label: "Каталог", href: "/demo/admin/integrations/catalog" },
        ],
      },
    ],
  },
  {
    key: "system",
    title: "СИСТЕМА",
    icon: "settings",
    items: [
      {
        label: "Настройки",
        href: "/demo/admin/settings",
        icon: "settings",
        children: [
          { label: "Настройки", href: "/demo/admin/settings" },
          { label: "Бизнес", href: "/demo/admin/settings/business" },
          { label: "Налоги", href: "/demo/admin/settings/taxes" },
          { label: "Валюта/форматы", href: "/demo/admin/settings/currency" },
          { label: "Брендинг", href: "/demo/admin/settings/branding" },
        ],
      },
      {
        label: "Аудит",
        href: "/demo/admin/audit",
        icon: "shield-check",
        children: [
          { label: "Аудит", href: "/demo/admin/audit/logs" },
          { label: "Журнал", href: "/demo/admin/audit/logs" },
          { label: "Состояние", href: "/demo/admin/audit/health" },
        ],
      },
    ],
  },
  {
    key: "session",
    title: "СЕССИЯ",
    icon: "log-out",
    items: [{ label: "Выход", href: "/demo/admin/login", icon: "log-out" }],
  },
];

/** ====== УТИЛИТЫ UI ====== */
const PILL_WIDTH = 136;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/** ====== КОМПОНЕНТ ====== */
function MobileTabbarInner() {
  const router = useRouter();
  const pathname = usePathname();

  const categories = useMemo(() => CATEGORIES, []);
  const [openKey, setOpenKey] = useState<string | null>(null);

  // двухшаговость: в шаге 1 показываем пункты категории; в шаге 2 — её children
  const [stage, setStage] = useState<"items" | "children">("items");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const railRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const popupRef = useRef<HTMLDivElement | null>(null);

  // автоскролл активной категории в доке
  useEffect(() => {
    const cat = categories.find((c) => c.items.some((it) => isActive(pathname, it.href)));
    const key = cat?.key;
    if (key && btnRefs.current[key]) {
      btnRefs.current[key]!.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [pathname, categories]);

  // закрыть попап
  const close = useCallback(() => {
    setOpenKey(null);
    setStage("items");
    setSelectedItem(null);
  }, []);

  // позиция каретки (над пилюлей)
  const [caretX, setCaretX] = useState<number | null>(null);
  const onOpen = useCallback((key: string) => {
    const el = btnRefs.current[key];
    if (el) {
      const rect = el.getBoundingClientRect();
      setCaretX(rect.left + rect.width / 2);
    }
    setOpenKey((k) => (k === key ? null : key));
    setStage("items");
    setSelectedItem(null);
  }, []);

  // шаг 1: клик по пункту (если есть children — переходим в children; если нет — явный router.push)
  const onItemClick = useCallback(
    (it: Item) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (it.children && it.children.length) {
        e.preventDefault(); // раскрываем подпункты, не уходим со страницы
        setSelectedItem(it);
        setStage("children");
      } else {
        e.preventDefault();
        router.push(it.href); // надёжный переход
        // если нужно — можно закрыть меню: close();
      }
    },
    [router]
  );

  // шаг 2: клик по подпункту — всегда явная навигация
  const onChildClick = useCallback(
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push(href); // надёжный переход
      // если нужно — можно закрыть меню: close();
    },
    [router]
  );

  // закрытие по ESC и по тапу вне
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const currentCategory = useMemo(
    () => categories.find((c) => c.key === openKey) || null,
    [categories, openKey]
  );

  return (
    <>
      {/* ===== ОВЕРЛЕЙ ДЛЯ КЛИКА ВНЕ (под попапом) ===== */}
      {openKey && (
        <div
          className="fixed inset-0 z-40 bg-transparent sm:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      {/* ===== ВСПЛЫВАЮЩЕЕ МЕНЮ (двухшаговое) ===== */}
      <div
        className="fixed inset-x-0 bottom-16 z-60 sm:hidden"
        style={{ paddingBottom: "max(0px, calc(env(safe-area-inset-bottom) - 8px))" }}
        aria-live="polite"
      >
        {currentCategory && (
          <div className="relative">
            {/* каретка */}
            {caretX !== null && (
              <span
                className="pointer-events-none absolute -top-1 h-2 w-2 rotate-45 rounded-[2px] bg-[#050910]/90"
                style={{ left: caretX - 4 }}
                aria-hidden
              />
            )}

          <div
            ref={popupRef}
            role="menu"
            aria-label={currentCategory.title}
            className={cn(
                "admin-surface mx-auto w-[min(94%,560px)] rounded-2xl p-3 shadow-2xl"
            )}
          >
              {/* заголовок */}
              <div className="mb-2 flex items-center justify-center gap-2 px-1">
                <IconLazy name={currentCategory.icon} aria-hidden size={16} />
                <div className="text-[11px] uppercase tracking-wide text-white/70">
                  {currentCategory.title}
                </div>
              </div>

              {/* Шаг 1: пункты категории */}
              {stage === "items" && (
                <div className="flex flex-col items-center gap-2">
                  {currentCategory.items.map((it) => {
                    const active = isActive(pathname, it.href);
                    return (
                      <Link
                        key={it.href}
                        href={it.href}
                        prefetch={false}
                        role="menuitem"
                        aria-current={active ? "page" : undefined}
                        onClick={onItemClick(it)}
                      className={cn(
                          "inline-flex h-12 w-[min(92%,500px)] items-center justify-center gap-2",
                          "rounded-xl border border-white/12 bg-white/10 px-3 text-sm whitespace-nowrap text-center transition",
                          "hover:bg-white/16 hover:border-white/16 text-white",
                          active && "bg-white/18 border-white/20"
                      )}
                      >
                        <IconLazy name={it.icon} aria-hidden size={16} className="shrink-0" />
                        <span className="truncate leading-none">{it.label}</span>
                        {it.children && it.children.length ? (
                          <span className="ml-2 text-xs text-white/60">›</span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Шаг 2: подпункты выбранного пункта */}
              {stage === "children" && selectedItem && (
                <div className="flex flex-col items-center gap-2">
                  <div className="mb-1 text-xs text-white/60">{selectedItem.label}</div>

                  {selectedItem.children!.map((ch) => {
                    const active = isActive(pathname, ch.href);
                    return (
                      <Link
                        key={ch.href}
                        href={ch.href}
                        prefetch={false}
                        role="menuitem"
                        aria-current={active ? "page" : undefined}
                        onClick={onChildClick(ch.href)}
                      className={cn(
                          "inline-flex h-12 w-[min(92%,500px)] items-center justify-center gap-2",
                          "rounded-xl border border-white/12 bg-white/10 px-3 text-sm whitespace-nowrap text-center transition",
                          "hover:bg-white/16 hover:border-white/16 text-white",
                          active && "bg-white/18 border-white/20"
                      )}
                      >
                        {ch.icon && <IconLazy name={ch.icon} aria-hidden size={16} className="shrink-0" />}
                        <span className="truncate leading-none">{ch.label}</span>
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      setStage("items");
                      setSelectedItem(null);
                    }}
                    className="mt-1 inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-white/80 hover:bg-white/10"
                  >
                    ← Назад к {currentCategory.title}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== НИЖНИЙ ДОК (категории) ===== */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/12 bg-[#050910]/85 backdrop-blur-xl sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        role="navigation"
        aria-label="Нижнее меню (категории)"
      >
        <div className="relative">
          {/* мягкие градиенты по краям */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/60 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/60 to-transparent" />

          {/* лента «пилюль» одинаковой ширины */}
          <div
            ref={railRef}
            className={cn(
              "grid auto-cols-[var(--pill-w)] grid-flow-col content-center gap-2 overflow-x-auto px-2 py-2",
              "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
            )}
            style={{ ["--pill-w" as any]: `136px` }}
          >
            <div className="w-1" aria-hidden />
            {categories.map((cat) => {
              const anyActive = cat.items.some((it) => isActive(pathname, it.href));
              const isOpen = openKey === cat.key;
              return (
                <button
                  key={cat.key}
                  ref={(el) => (btnRefs.current[cat.key] = el)}
                  className={cn(
                    "inline-flex h-11 snap-start items-center gap-2 rounded-2xl border px-3 text-left transition",
                    "border-white/12 bg-white/10 hover:border-white/16 hover:bg-white/16 active:scale-[0.98]",
                    (anyActive || isOpen) && "border-white/20 bg-white/16 shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset]"
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`submenu-${cat.key}`}
                  onClick={() => onOpen(cat.key)}
                >
                  <IconLazy name={cat.icon} aria-hidden size={18} />
                  <span className="min-w-0 leading-4">
                    <span className="block truncate text-[10px] uppercase tracking-wide text-white/60">
                      {cat.title}
                    </span>
                    <span className="block truncate text-xs text-white">
                      {cat.items[0]?.label}
                    </span>
                  </span>
                  {(anyActive || isOpen) && (
                    <span className="ml-auto inline-block h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden />
                  )}
                </button>
              );
            })}
            <div className="w-1" aria-hidden />
          </div>

          {/* внутренний деликатный разделитель */}
          <div className="px-2 pb-1">
            <div className="h-px w-full rounded bg-white/10" aria-hidden />
          </div>
        </div>
      </div>
    </>
  );
}

const MobileTabbar = memo(MobileTabbarInner);
export default MobileTabbar;
