"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, ListOrdered, Tag, Loader2 } from "lucide-react";

/** Быстрые действия в админ-хабе услуг */
export type QuickActionItem = {
  /** Заголовок карточки */
  title: string;
  /** Ссылка (если задана) откроет страницу; если не задана — используем onClick */
  href?: string;
  /** Пользовательское действие вместо href (не сработает, если есть href) */
  onClick?: () => void;
  /** Краткое описание под заголовком */
  description?: string;
  /** Иконка слева (любой ReactNode) */
  icon?: React.ReactNode;
  /** Отключить элемент */
  disabled?: boolean;
  /** Открывать ссылку в новой вкладке */
  newTab?: boolean;
  /** Подписи для доступности (иначе будет сгенерировано из title) */
  ariaLabel?: string;
  /** Атрибуты для тестов/аналитики */
  "data-testid"?: string;
};

const DEFAULT_ITEMS: QuickActionItem[] = [
  {
    title: "Создать услугу",
    href: "/demo/admin/services/new",
    description: "Добавьте новую услугу в каталог",
    icon: <PlusCircle width={16} height={16} />,
  },
  {
    title: "Прайс-лист",
    href: "/demo/admin/services/pricing",
    description: "Массовое редактирование цен",
    icon: <ListOrdered width={16} height={16} />,
  },
  {
    title: "Новая категория",
    href: "/demo/admin/services/categories/new",
    description: "Создайте категорию для услуг",
    icon: <Tag width={16} height={16} />,
  },
];

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function QuickActions({
  items,
  className = "",
  title = "Быстрые действия",
  subtitle,
  loading = false,
  error,
}: {
  items?: QuickActionItem[];
  className?: string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
}) {
  const safe = React.useMemo<QuickActionItem[]>(
    () => (Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS),
    [items]
  );

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-white/[0.05] p-4",
        className
      )}
      aria-labelledby="qa-title"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div id="qa-title" className="text-sm font-medium">
            {title}
          </div>
          {subtitle && (
            <div className="mt-0.5 text-xs text-white/60">{subtitle}</div>
          )}
        </div>

        {loading && (
          <div className="inline-flex items-center gap-2 text-xs text-white/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            Загрузка…
          </div>
        )}
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
          {error}
        </div>
      ) : (
        <div
          className="mt-3 grid gap-3 xs:grid-cols-2 md:grid-cols-3"
          role="list"
          aria-busy={loading || undefined}
        >
          {safe.map((it) => {
            const content = (
              <>
                <div className="flex items-center gap-2">
                  {it.icon && <span className="opacity-80">{it.icon}</span>}
                  <span className="text-sm font-medium">{it.title}</span>
                </div>
                {it.description && (
                  <div className="mt-1 text-xs text-white/60">
                    {it.description}
                  </div>
                )}
                <div className="mt-2 text-[11px] text-white/50 group-hover:text-white/70">
                  Открыть →
                </div>
              </>
            );

            const commonClass =
              "group block rounded-xl border border-white/15 bg-white/[0.06] p-3 transition hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-white/30";

            const ariaLabel = it.ariaLabel || it.title;

            if (it.href && !it.disabled) {
              return (
                <Link
                  key={it.title}
                  href={it.href}
                  prefetch={false}
                  target={it.newTab ? "_blank" : undefined}
                  rel={it.newTab ? "noopener noreferrer" : undefined}
                  className={commonClass}
                  aria-label={ariaLabel}
                  role="listitem"
                  data-testid={it["data-testid"]}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={it.title}
                type="button"
                onClick={it.onClick}
                disabled={it.disabled}
                className={cls(
                  commonClass,
                  "text-left",
                  it.disabled && "opacity-60 cursor-not-allowed"
                )}
                aria-label={ariaLabel}
                role="listitem"
                data-testid={it["data-testid"]}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}