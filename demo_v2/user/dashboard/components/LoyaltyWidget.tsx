"use client";

import Link from "next/link";
import { useCallback, useId, useMemo, useState } from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import {
  Gift,
  Users,
  Wallet2,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  CARD,
  EYEBROW,
  TITLE_SM,
  BTN_PRIMARY,
  BTN_GHOST,
  ROW,
  TAPPABLE,
  cn,
} from "./_shared";

type LoyaltyStatus = "standard" | "premium" | "vip";

export interface LoyaltyData {
  /** текущий статус/тариф */
  status?: LoyaltyStatus;
  /** уровень (число), например 1 */
  level?: number;
  /** бонусный баланс в рублях (строка в форматированном виде, например "0 ₽") */
  bonusBalance?: string;
  /** прогресс до следующего уровня (0–100) */
  nextTierProgress?: number;
  /** сколько баллов нужно до следующего уровня (текст) */
  remainingToNextTierLabel?: string; // напр. "Накопите ещё 150 баллов"
  /** приглашено друзей из целевого количества */
  invites?: { invited: number; target: number };
  /** реферальный код */
  referralCode?: string;
  /** реферальная ссылка */
  referralLink?: string;
  /** список преимуществ */
  perks?: string[];
  /** пользователь может потратить бонусы */
  useBonusHref?: string;
  /** пригласить друзей */
  inviteHref?: string;
  /** страница условий */
  termsHref?: string;
}

const STATUS_PRESET: Record<
  LoyaltyStatus,
  {
    label: string;
    wrap: string;
    text: string;
    icon: typeof ShieldCheck;
    badge?: string;
    gradient: string;
  }
> = {
  standard: {
    label: "Standard",
    wrap: "border-white/20 bg-white/10",
    text: "text-white/80",
    icon: ShieldCheck,
    badge: "Ур. 1",
    gradient: "from-gray-500/10 to-gray-600/5",
  },
  premium: {
    label: "Premium",
    wrap: "border-amber-500/30 bg-amber-500/15",
    text: "text-amber-200",
    icon: Crown,
    badge: "Ур. 2",
    gradient: "from-amber-500/10 to-orange-500/5",
  },
  vip: {
    label: "VIP",
    wrap: "border-purple-500/30 bg-purple-500/15",
    text: "text-purple-200",
    icon: Crown,
    badge: "Ур. 3",
    gradient: "from-purple-500/10 to-pink-500/5",
  },
};

interface Props {
  loyalty?: LoyaltyData;
  variant?: "default" | "compact" | "featured";
  withAnimations?: boolean;
}

export default function LoyaltyWidget({
  loyalty,
  variant = "default",
  withAnimations = true,
}: Props) {
  const reduced = useReducedMotion();

  const titleId = useId();
  const liveId = useId();
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const fade = (i = 0): MotionProps =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: {
            delay: 0.05 + i * 0.04,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        };

  const scale =
    reduced || !withAnimations
      ? {}
      : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  // Нормализация входных данных (мемоизировано)
  const D: Required<LoyaltyData> = useMemo(
    () => ({
      status: loyalty?.status ?? "standard",
      level: loyalty?.level ?? 1,
      bonusBalance: loyalty?.bonusBalance ?? "0 ₽",
      nextTierProgress: Math.min(100, Math.max(0, loyalty?.nextTierProgress ?? 25)),
      remainingToNextTierLabel:
        loyalty?.remainingToNextTierLabel ?? "Накопите ещё 150 баллов",
      invites: loyalty?.invites ?? { invited: 0, target: 5 },
      referralCode: loyalty?.referralCode ?? "WELCOME10",
      referralLink: loyalty?.referralLink ?? "https://example.com/r/abc123",
      perks:
        loyalty?.perks ?? [
          "Скидка на первую покупку",
          "Персональные предложения",
          "Приоритетная запись",
        ],
      useBonusHref: loyalty?.useBonusHref ?? "/demo/user/checkout?useBonus=1",
      inviteHref: loyalty?.inviteHref ?? "/demo/user/referrals",
      termsHref: loyalty?.termsHref ?? "/demo/user/loyalty/terms",
    }),
    [loyalty]
  );

  const statusPreset = STATUS_PRESET[D.status];
  const StatusIcon = statusPreset.icon;

  const invitePercent = useMemo(() => {
    const p =
      D.invites.target > 0
        ? Math.round((D.invites.invited / D.invites.target) * 100)
        : 0;
    return Math.max(0, Math.min(100, p));
  }, [D.invites]);

  const invitesLeft = Math.max(0, D.invites.target - D.invites.invited);

  const nextTierName =
    D.status === "standard"
      ? "Premium"
      : D.status === "premium"
      ? "VIP"
      : "максимального уровня";

  const handleCopy = useCallback(async (text: string, what: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }, []);

  const sizeConfig = {
    default: "p-4 sm:p-6",
    compact: "p-3 sm:p-4",
    featured: "p-4 sm:p-7",
  };

  return (
    <motion.section
      {...fade(0)}
      aria-labelledby={titleId}
      className={cn(
        CARD,
        sizeConfig[variant],
        "relative overflow-hidden backdrop-blur-sm w-full max-w-full",
        "box-border", // Важно для правильного расчета размеров
        variant === "featured" && `bg-gradient-to-br ${statusPreset.gradient}`
      )}
      style={{ maxWidth: '100vw' }} // Защита от выхода за пределы экрана
    >
      {/* Анимированный фон */}
      {variant === "featured" && (
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              "radial-gradient(60% 60% at 20% 20%, rgba(245, 158, 11, 0.15), transparent)",
              "radial-gradient(60% 60% at 80% 20%, rgba(168, 85, 247, 0.15), transparent)",
              "radial-gradient(60% 60% at 20% 20%, rgba(245, 158, 11, 0.15), transparent)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      )}

      {/* Заголовок */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-3 sm:mb-2">
            <div className={cn(
              "rounded-lg p-2 border flex-shrink-0",
              statusPreset.wrap
            )}>
              <Gift className="w-4 h-4 text-white/70" />
            </div>
            <p className={cn(EYEBROW, "truncate")}>программа лояльности</p>
          </div>

          <div className="flex flex-col xs:flex-row xs:items-center gap-3">
            <h2
              id={titleId}
              className={cn(
                TITLE_SM,
                "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent whitespace-nowrap"
              )}
            >
              Ваш статус
            </h2>

            <motion.span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold w-fit flex-shrink-0",
                statusPreset.wrap,
                statusPreset.text
              )}
              whileHover={{ scale: 1.05 }}
              aria-label={`Статус: ${statusPreset.label} ${
                D.level ? `уровень ${D.level}` : ""
              }`}
            >
              <StatusIcon className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{statusPreset.label}</span>
              {statusPreset.badge && (
                <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs whitespace-nowrap">
                  {statusPreset.badge}
                </span>
              )}
            </motion.span>
          </div>
        </div>

        <motion.div {...scale} className="self-start sm:self-auto">
          <Link
            href={D.termsHref}
            prefetch={false}
            className={cn(
              BTN_GHOST,
              "h-10 sm:h-11 px-3 sm:px-4 text-sm whitespace-nowrap",
              TAPPABLE,
              "inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            )}
            aria-label="Условия программы лояльности"
          >
            <span>Условия</span>
            <ArrowUpRight className="h-4 w-4 flex-shrink-0" />
          </Link>
        </motion.div>
      </div>

      {/* 3 ключевые карточки - исправленная сетка */}
      <div className="relative z-10 mt-6 grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Баланс */}
        <motion.article
          {...fade(0.05)}
          {...scale}
          onHoverStart={() => setHoveredCard("balance")}
          onHoverEnd={() => setHoveredCard(null)}
          className={cn(
            "rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 w-full min-w-0",
            "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15",
            hoveredCard === "balance" && "ring-2 ring-emerald-500/20"
          )}
          aria-label="Бонусный баланс"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/20 p-2 border border-emerald-500/30 flex-shrink-0">
              <Wallet2 className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/90 font-semibold truncate">Бонусный баланс</p>
              <p className="text-white/60 text-sm truncate">Доступно для оплаты</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col xs:flex-row xs:items-end justify-between gap-3">
            <p className="text-2xl font-extrabold text-white tabular-nums whitespace-nowrap">
              {D.bonusBalance}
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
              <Link
                href={D.useBonusHref}
                prefetch={false}
                className={cn(
                  "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold w-full xs:w-auto",
                  "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
                  "hover:from-green-600 hover:to-emerald-700 transition-all",
                  TAPPABLE
                )}
                aria-label="Использовать бонусы"
              >
                <Zap className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Использовать</span>
              </Link>
            </motion.div>
          </div>
        </motion.article>

        {/* Приглашения */}
        <motion.article
          {...fade(0.09)}
          {...scale}
          onHoverStart={() => setHoveredCard("invites")}
          onHoverEnd={() => setHoveredCard(null)}
          className={cn(
            "rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 w-full min-w-0",
            "border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/15",
            hoveredCard === "invites" && "ring-2 ring-blue-500/20"
          )}
          aria-label="Приглашения друзей"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2 border border-blue-500/30 flex-shrink-0">
              <Users className="h-4 w-4 text-blue-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/90 font-semibold truncate">Приглашения</p>
              <p className="text-white/60 text-sm truncate">Пригласите друзей</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <div className="flex items-center justify-between">
              <p className="font-mono tabular-nums whitespace-nowrap">
                {D.invites.invited}/{D.invites.target}
              </p>
              <span className="text-blue-300 font-semibold whitespace-nowrap">{invitePercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${invitePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-white/60 truncate">
              {invitesLeft > 0
                ? `${invitesLeft} приглашени${invitesLeft === 1 ? "е" : invitesLeft < 5 ? "я" : "й"} до бонуса`
                : "Цель по приглашениям выполнена"}
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-3">
            <Link
              href={D.inviteHref}
              prefetch={false}
              className={cn(
                "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold",
                "border-blue-500/40 bg-blue-500/15 text-blue-200 hover:bg-blue-500/20",
                TAPPABLE
              )}
              aria-label="Пригласить друзей"
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Пригласить</span>
            </Link>
          </motion.div>
        </motion.article>

        {/* Промокод / ссылка */}
        <motion.article
          {...fade(0.13)}
          {...scale}
          onHoverStart={() => setHoveredCard("promo")}
          onHoverEnd={() => setHoveredCard(null)}
          className={cn(
            "rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 w-full min-w-0",
            "border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/15",
            hoveredCard === "promo" && "ring-2 ring-purple-500/20"
          )}
          aria-label="Ваш промокод и ссылка"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/20 p-2 border border-purple-500/30 flex-shrink-0">
              <Gift className="h-4 w-4 text-purple-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/90 font-semibold truncate">Ваш промокод</p>
              <p className="text-white/60 text-sm truncate">Делитесь с друзьями</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {/* Код */}
            <div
              className={cn(
                "flex flex-col xs:flex-row xs:items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 p-3 w-full min-w-0"
              )}
            >
              <p className="font-mono text-lg font-bold text-white tracking-wider break-all xs:break-keep xs:truncate">
                {D.referralCode}
              </p>
              <motion.button
                type="button"
                onClick={() => handleCopy(D.referralCode, "code")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all flex-shrink-0 w-full xs:w-auto justify-center",
                  copied === "code" 
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400" 
                    : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15",
                  TAPPABLE
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-live="polite"
                aria-label="Скопировать промокод"
              >
                {copied === "code" ? (
                  <Check className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Copy className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {copied === "code" ? "Скопировано" : "Копировать"}
                </span>
              </motion.button>
            </div>

            {/* Ссылка */}
            <div
              className={cn(
                "flex flex-col xs:flex-row xs:items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 p-3 w-full min-w-0"
              )}
            >
              <p className="text-white/80 text-sm break-all xs:truncate flex-1 min-w-0" title={D.referralLink}>
                {D.referralLink}
              </p>
              <motion.button
                type="button"
                onClick={() => handleCopy(D.referralLink, "link")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all flex-shrink-0 w-full xs:w-auto justify-center",
                  copied === "link" 
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400" 
                    : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15",
                  TAPPABLE
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-live="polite"
                aria-label="Скопировать ссылку"
              >
                {copied === "link" ? (
                  <Check className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Copy className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {copied === "link" ? "Скопировано" : "Копировать"}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.article>
      </div>

      {/* Прогресс до следующего уровня */}
      <motion.div 
        {...fade(0.17)}
        className="relative z-10 mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm w-full min-w-0"
      >
        <div className="flex flex-col xs:flex-row xs:items-center justify-between text-sm text-white/80 mb-2 gap-2">
          <div className="inline-flex items-center gap-2 whitespace-nowrap">
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span>Прогресс до {nextTierName}</span>
          </div>
          <span className="tabular-nums font-semibold text-amber-400 whitespace-nowrap">{D.nextTierProgress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${D.nextTierProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p
          id={liveId}
          className="mt-2 text-sm text-white/60 break-words"
          role="status"
          aria-live="polite"
        >
          {D.remainingToNextTierLabel}
        </p>
      </motion.div>

      {/* Преимущества */}
      {D.perks.length > 0 && (
        <motion.div 
          className="relative z-10 mt-6 w-full min-w-0"
          {...fade(0.21)}
        >
          <p className="text-xs uppercase tracking-wider text-white/70 mb-3 whitespace-nowrap">
            Ваши преимущества
          </p>
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {D.perks.map((perk, i) => (
              <motion.div
                key={`${perk}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/80 backdrop-blur-sm min-w-0"
              >
                <div className={cn(
                  "rounded-lg p-1.5 border flex-shrink-0",
                  statusPreset.wrap
                )}>
                  <Sparkles className="h-3 w-3 flex-shrink-0" />
                </div>
                <span className="text-sm truncate">{perk}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}