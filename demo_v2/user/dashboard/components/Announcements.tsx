// src/app/demo/user/dashboard/components/Announcements.tsx
"use client";

import Link from "next/link";
import {
  Megaphone,
  ArrowRight,
  Bell,
  Sparkles,
  AlertCircle,
  Info,
  Percent,
  Gift,
  Star,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";
import {
  cn,
  TITLE_ID,
  TITLE_SM,
  SUBTITLE_SM,
  SECTION_WRAP,
  CARD_BASE,
  CHIP,
  FOCUS_RING,
  FOCUS_RING_OFFSET,
  useStableId,
  BADGE_NEUTRAL,
  TAPPABLE,
} from "./_shared";
import type { Announcement as AnnouncementBase } from "../data/mockUserDashboard";
import EmptyState from "./EmptyState";

/* -----------------------------------------------------------------------------
 * Локальное расширение типов (не ломаем общий тип в data/, но поддерживаем поля
 * icon/type/date/author, которые теперь приходят вместо картинок)
 * ---------------------------------------------------------------------------*/
type Announcement = AnnouncementBase & {
  type?: "info" | "promo" | "alert" | "news";
  icon?: string;    // имя иконки lucide (например, 'Sparkles')
  date?: string;
  author?: string;
};

/* -----------------------------------------------------------------------------
 * Справочник иконок по строковому имени (безопасный)
 * ---------------------------------------------------------------------------*/
const ICONS: Record<string, React.ComponentType<any>> = {
  Megaphone,
  Bell,
  Sparkles,
  AlertCircle,
  Info,
  Percent,
  Gift,
  Star,
  CalendarDays,
  ShoppingBag,
};

/** Иконка по типу уведомления (фолбэк) */
function getIconByType(type?: Announcement["type"]) {
  switch (type) {
    case "info":
      return Bell;
    case "promo":
      return Sparkles;
    case "alert":
      return AlertCircle;
    case "news":
      return Info;
    default:
      return Megaphone;
  }
}

/** Тон карточки по акценту */
function accentTone(accent?: Announcement["accent"]) {
  switch (accent) {
    case "brand":
      return {
        wrap: "border-blue-400/30 bg-blue-400/10",
        chip: "bg-blue-400/15 text-blue-200 ring-blue-400/25",
        icon: "text-blue-400",
        hover: "hover:bg-blue-400/15 hover:border-blue-400/40",
      };
    case "success":
      return {
        wrap: "border-emerald-400/30 bg-emerald-400/10",
        chip: "bg-emerald-400/15 text-emerald-200 ring-emerald-400/25",
        icon: "text-emerald-400",
        hover: "hover:bg-emerald-400/15 hover:border-emerald-400/40",
      };
    case "warning":
      return {
        wrap: "border-amber-400/30 bg-amber-400/10",
        chip: "bg-amber-400/15 text-amber-200 ring-amber-400/25",
        icon: "text-amber-400",
        hover: "hover:bg-amber-400/15 hover:border-amber-400/40",
      };
    case "danger":
      return {
        wrap: "border-rose-400/30 bg-rose-400/10",
        chip: "bg-rose-400/15 text-rose-200 ring-rose-400/25",
        icon: "text-rose-400",
        hover: "hover:bg-rose-400/15 hover:border-rose-400/40",
      };
    case "muted":
    default:
      return {
        wrap: "border-white/12 bg-white/8",
        chip: "bg-white/12 text-[rgba(236,240,255,0.64)] ring-white/20",
        icon: "text-[rgba(236,240,255,0.64)]",
        hover: "hover:bg-white/10 hover:border-white/18",
      };
  }
}

type Props = {
  /** Список объявлений; если не передан, отрисуем пустое состояние */
  list?: Announcement[];
  /** Заголовок секции (по умолчанию «Объявления») */
  title?: string;
  /** Подзаголовок/описание секции */
  subtitle?: string;
  /** Сколько карточек показывать (обрезка), по умолчанию все */
  limit?: number;
  /** Компактный режим */
  compact?: boolean;
};

export default function Announcements({
  list = [],
  title = "Объявления",
  subtitle,
  limit,
  compact = false,
}: Props) {
  const originalCount = list.length;
  const items = typeof limit === "number" ? list.slice(0, Math.max(limit, 0)) : list;

  // ✅ Стабильный id (нет hydration mismatch)
  const headingId = useStableId(`${TITLE_ID}-ann`);

  return (
    <section
      className={cn(SECTION_WRAP, compact ? "p-3" : "p-4", "transition-all hover:border-white/16")}
      aria-labelledby={headingId}
    >
      {/* Заголовок секции */}
      <div className={cn("flex items-center justify-between gap-3", compact ? "mb-2" : "mb-3")}>
        <div className="flex items-center gap-2 min-w-0">
          <Megaphone
            width={compact ? 16 : 18}
            height={compact ? 16 : 18}
            className="text-[rgba(236,240,255,0.64)]"
            aria-hidden
          />
          <div className="min-w-0">
            <h2 id={headingId} className={cn(TITLE_SM, "truncate text-[rgba(255,255,255,0.92)]")}>
              {title}
            </h2>
            {subtitle && <p className={cn(SUBTITLE_SM, "truncate")}>{subtitle}</p>}
          </div>
        </div>

        {items.length > 0 && <span className={cn(BADGE_NEUTRAL, "shrink-0")}>{items.length}</span>}
      </div>

      {/* Пусто */}
      {items.length === 0 ? (
        <EmptyState
          title="Пока нет объявлений"
          description="Здесь появятся новости сервиса, персональные предложения и важные уведомления."
          Icon={Megaphone}
          tone="muted"
          align="start"
          size={compact ? "xs" : "sm"}
          variant="panel"
        />
      ) : (
        <ul className={cn("grid gap-2", compact && "gap-1.5")} role="list" aria-describedby={headingId}>
          {items.map((ann) => {
            const tone = accentTone(ann.accent);
            const ByName = ann.icon && ICONS[ann.icon] ? ICONS[ann.icon] : null;
            const FallbackByType = getIconByType(ann.type);
            const IconComponent = ByName ?? FallbackByType;
            const href = ann.href || "#";
            const descriptionId = `ann-desc-${ann.id}`;
            const titleId = `ann-title-${ann.id}`;

            return (
              <li key={ann.id}>
                <Link
                  href={href}
                  prefetch={false}
                  className={cn(
                    CARD_BASE,
                    "group flex items-start gap-3 border transition-all p-3",
                    tone.wrap,
                    tone.hover,
                    FOCUS_RING,
                    FOCUS_RING_OFFSET,
                    TAPPABLE,
                    compact && "p-2"
                  )}
                  aria-labelledby={titleId}
                  aria-describedby={descriptionId}
                >
                  {/* Иконка */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                      compact && "h-6 w-6 rounded-lg",
                      "border-white/15 bg-white/8 transition-colors group-hover:bg-white/10"
                    )}
                  >
                    <IconComponent
                      width={compact ? 14 : 16}
                      height={compact ? 14 : 16}
                      className={tone.icon}
                      aria-hidden
                    />
                  </div>

                  {/* Контент */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {ann.cta && (
                            <span
                              className={cn(
                                CHIP,
                                "ring-1 ring-inset text-xs",
                                tone.chip,
                                compact && "text-[11px] px-1.5 py-0.5"
                              )}
                            >
                              {ann.cta}
                            </span>
                          )}
                          {ann.badge && <span className={cn(BADGE_NEUTRAL, "text-[11px]")}>{ann.badge}</span>}
                        </div>

                        <h3
                          id={titleId}
                          className={cn(
                            "font-semibold text-[rgba(255,255,255,0.92)] leading-tight",
                            compact ? "text-sm truncate" : "text-sm mb-1"
                          )}
                        >
                          {ann.title}
                        </h3>
                      </div>

                      <ArrowRight
                        width={compact ? 14 : 16}
                        height={compact ? 14 : 16}
                        className="shrink-0 text-[rgba(236,240,255,0.48)] transition-all group-hover:translate-x-0.5 group-hover:text-[rgba(255,255,255,0.92)] mt-0.5"
                        aria-hidden
                      />
                    </div>

                    {ann.description && (
                      <p
                        id={descriptionId}
                        className={cn(
                          "text-[rgba(236,240,255,0.64)] leading-relaxed",
                          compact ? "text-xs line-clamp-1" : "text-sm line-clamp-2"
                        )}
                      >
                        {ann.description}
                      </p>
                    )}

                    {/* Мета-информация */}
                    {(ann.date || ann.author) && (
                      <div className={cn("flex items-center gap-2 mt-1", compact ? "text-[11px]" : "text-xs")}>
                        {ann.date && <span className="text-[rgba(236,240,255,0.48)]">{ann.date}</span>}
                        {ann.author && (
                          <>
                            <span className="text-[rgba(236,240,255,0.32)]">•</span>
                            <span className="text-[rgba(236,240,255,0.48)]">{ann.author}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Футер: показываем «Все объявления», если было усечение по limit */}
      {typeof limit === "number" && originalCount > items.length && (
        <div className={cn("border-top border-white/10 pt-3 mt-3", compact && "pt-2 mt-2")}>
          <Link
            href="/demo/user/announcements"
            prefetch={false}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs text-[rgba(236,240,255,0.64)] transition-all hover:text-[rgba(255,255,255,0.92)]",
              FOCUS_RING
            )}
          >
            <span>Все объявления</span>
            <ArrowRight width={12} height={12} aria-hidden />
          </Link>
        </div>
      )}
    </section>
  );
}