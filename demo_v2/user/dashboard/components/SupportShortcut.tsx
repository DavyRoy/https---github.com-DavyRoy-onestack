// src/app/demo/user/dashboard/components/SupportShortcut.tsx
"use client";

import Link from "next/link";
import { useId, type ReactNode, useState, type ComponentType, type SVGProps } from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import type { SupportData } from "../data/mockUserDashboard";
import {
  MessageCircle,
  Timer,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Sparkles,
  HeadphonesIcon,
  BookOpen,
  Video,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Bot,
} from "lucide-react";
import { CARD, EYEBROW, TITLE_SM, BTN_PRIMARY, BTN_GHOST, TAPPABLE, cn } from "./_shared";

interface SupportShortcutProps {
  support?: SupportData;
  className?: string;
  variant?: "default" | "compact" | "featured" | "minimal";
  withAnimations?: boolean;
  showChannels?: boolean;
}

/* ---------------- Иконки: безопасный резолвер строковых имён ---------------- */

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  Video,
  HeadphonesIcon,
  ShieldCheck,
  Timer,
  Zap,
  Sparkles,
  Clock,
  CheckCircle2,
  Bot,
  ArrowUpRight,
};

function resolveIcon(icon: unknown): ComponentType<SVGProps<SVGSVGElement>> {
  if (typeof icon === "string") return ICONS[icon] ?? MessageCircle;
  if (typeof icon === "function") return icon as ComponentType<SVGProps<SVGSVGElement>>;
  return MessageCircle;
}

/** Нормализуем данные и защищаемся от пустых полей */
function normalizeSupport(s?: SupportData) {
  return {
    primaryChannel: s?.primaryChannel ?? "Поддержка",
    manager: s?.manager ?? "Оператор онлайн",
    responseTime: s?.responseTime ?? "Обычно отвечает за 5–10 мин",
    chatHref: s?.chatHref ?? "/demo/user/help/contact",
    guideHref: s?.guideHref ?? "/demo/user/help",
    status: s?.status ?? "online",
    rating: s?.rating ?? "4.9",
    channels:
      s?.channels ??
      [
        { name: "Чат", href: "/demo/user/help/chat", icon: "MessageCircle", description: "Мгновенная помощь" },
        { name: "Телефон", href: "/demo/user/help/phone", icon: "Phone", description: "Звонок специалисту" },
        { name: "Email", href: "/demo/user/help/email", icon: "Mail", description: "Подробный ответ" },
        { name: "База знаний", href: "/demo/user/help/knowledge", icon: "BookOpen", description: "Статьи и гайды" },
      ],
    availability: s?.availability ?? "24/7",
    features: s?.features ?? ["Конфиденциально", "Безопасно", "Быстро"],
  };
}

/** Конфигурация статусов поддержки */
const STATUS_CONFIG = {
  online: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    label: "Онлайн",
  },
  away: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    label: "Нет на месте",
  },
  offline: {
    icon: Clock,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    label: "Оффлайн",
  },
  busy: {
    icon: Timer,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-500/30",
    label: "Занят",
  },
};

const isExternal = (href: string) => /^(?:https?:)?\/\//i.test(href);

export default function SupportShortcut({
  support,
  className,
  variant = "default",
  withAnimations = true,
  showChannels = true,
}: SupportShortcutProps) {
  const data = normalizeSupport(support);
  const statusConfig = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.online;
  const StatusIcon = statusConfig.icon;

  const reduced = useReducedMotion();
  const uid = useId();
  const TITLE_ID = `support-shortcut-title-${uid}`;
  const RESP_ID = `support-shortcut-resp-${uid}`;
  const NOTE_ID = `support-shortcut-note-${uid}`;
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  const fade = (delay = 0): MotionProps =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1 },
          transition: {
            delay,
            duration: 0.4,
            ease: "easeOut",
          },
        };

  const scale = reduced || !withAnimations ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  // Конфигурация вариантов
  const sizeConfig = {
    default: "p-4 sm:p-5",
    compact: "p-3 sm:p-4",
    featured: "p-5 sm:p-6",
    minimal: "p-3",
  };

  return (
    <motion.section
      {...fade(0)}
      role="region"
      aria-labelledby={TITLE_ID}
      className={cn(CARD, "relative w-full overflow-hidden backdrop-blur-sm", sizeConfig[variant], className)}
    >
      {/* Заголовок */}
      <div className="relative z-10 mb-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg border border-white/10 bg-white/10 p-2">
            <HeadphonesIcon className="h-4 w-4 text-white/70" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn(EYEBROW, "text-white/60")}>поддержка</p>
            <h2 id={TITLE_ID} className={cn(TITLE_SM, "text-lg text-white/90 sm:text-xl")}>
              {data.primaryChannel}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              statusConfig.bg,
              statusConfig.border,
              statusConfig.color,
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" aria-hidden />
            <span>{statusConfig.label}</span>
          </div>

          {data.rating && variant !== "minimal" && (
            <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3 w-3" aria-hidden />
              <span>{data.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* KPI информация */}
      <div className="relative z-10 mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/80">
            <Timer className="h-4 w-4 shrink-0" aria-hidden />
            <span id={RESP_ID}>{data.responseTime}</span>
          </div>

          {data.availability && variant !== "minimal" && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/15 px-3 py-2 text-sm text-green-400">
              <Zap className="h-4 w-4" aria-hidden />
              <span>{data.availability}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-white/70">{data.manager}</p>
      </div>

      {/* Каналы поддержки */}
      {showChannels && variant !== "minimal" && (
        <motion.div className="relative z-10 mb-6" {...fade(0.1)}>
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-white/10 p-1.5">
              <MessageCircle className="h-4 w-4 text-white/70" aria-hidden />
            </div>
            <p className="text-sm uppercase tracking-wider text-white/70">Доступные каналы</p>
          </div>

          <div className={cn("grid gap-3", variant === "compact" ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4")}>
            {data.channels.slice(0, variant === "compact" ? 2 : 4).map((channel) => {
              const ChannelIcon = resolveIcon(channel.icon);
              const isHovered = hoveredChannel === channel.name;

              return (
                <motion.div
                  key={channel.name}
                  onHoverStart={() => setHoveredChannel(channel.name)}
                  onHoverEnd={() => setHoveredChannel(null)}
                  {...scale}
                >
                  <SmartLink
                    href={channel.href}
                    ariaLabel={`Открыть ${channel.name}: ${channel.description}`}
                    className={cn(
                      "h-full w-full min-h-[100px] flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10",
                    )}
                    compact
                  >
                    <div
                      className={cn(
                        "rounded-lg border border-white/20 bg-white/10 p-2 transition-colors",
                        isHovered && "border-blue-500/40 bg-blue-500/15",
                      )}
                      aria-hidden
                    >
                      <ChannelIcon className="h-4 w-4 text-white/70" aria-hidden />
                    </div>
                    <div className="min-w-0 text-center">
                      <p className="text-sm font-medium text-white break-words">{channel.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60">{channel.description}</p>
                    </div>
                  </SmartLink>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Основные действия */}
      <div className="relative z-10 mb-6">
        <div className={cn("flex gap-3", variant === "minimal" ? "flex-col" : "flex-col sm:flex-row")}>
          <SmartLink
            href={data.chatHref}
            primary
            ariaLabel="Открыть чат с поддержкой"
            className={cn("h-11 px-5 font-semibold", variant === "minimal" ? "w-full" : "flex-1")}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Открыть чат
          </SmartLink>

          <div className={cn("flex gap-3", variant === "minimal" ? "flex-col" : "flex-1 sm:flex-initial")}>

            {variant === "featured" && (
              <SmartLink href="/demo/user/help/video" ariaLabel="Видео-инструкции и обучение" className="h-11 flex-1 px-4">
                <Video className="h-4 w-4" aria-hidden />
                Видео
              </SmartLink>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      {variant !== "minimal" && (
        <motion.div className="relative z-10 mb-6" {...fade(0.2)}>
          <div className="flex flex-wrap gap-2">
            {data.features.map((feature) => (
              <div
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" aria-hidden />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Note */}
      <motion.div
        id={NOTE_ID}
        className={cn("relative z-10 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-sm")}
        {...fade(0.3)}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
          <div className="min-w-0">
            <span className="break-words">
              Сообщайте данные оплаты только в защищённом чате и проверяйте адрес ссылки.
            </span>
            {variant === "featured" && (
              <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                <Bot className="h-3 w-3" aria-hidden />
                <span>Доступен AI-помощник для быстрых ответов</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

/* ---------------- SmartLink Component ---------------- */

function SmartLink({
  href,
  children,
  primary = false,
  ariaLabel,
  className = "",
  compact = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  ariaLabel?: string;
  className?: string;
  compact?: boolean;
}) {
  const external = isExternal(href);
  const base = primary ? BTN_PRIMARY : BTN_GHOST;

  return (
    <Link
      href={href || "#"}
      prefetch={false}
      aria-label={ariaLabel}
      className={cn(
        base,
        "group inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200",
        compact ? "min-h-[auto]" : "min-h-[44px]",
        TAPPABLE,
        className,
      )}
      {...(external ? { target: "_blank", rel: "noreferrer noopener", title: "Откроется в новой вкладке" } : {})}
    >
      {children}
      <ArrowUpRight className={cn("opacity-80 transition-transform group-hover:translate-x-0.5", compact ? "h-3 w-3" : "h-4 w-4")} aria-hidden />
    </Link>
  );
}