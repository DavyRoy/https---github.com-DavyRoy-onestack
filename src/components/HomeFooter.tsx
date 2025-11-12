// src/components/HomeFooter.tsx
"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Mail, Phone, MapPin, Send, Globe2 } from "lucide-react";

const ORG = {
  name: "OneStack",
  email: "info@onestack24.ru",
  emailHref: "mailto:info@onestack24.ru",
  phone: "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
  siteLabel: "onestack24.ru",
  siteHref: "https://onestack24.ru",
  tgName: "OneStack Assistant",
  tgUrl: "https://t.me/onestack_assistant", // подключим позже
};

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.2 },
});

/** статические данные вынесены из JSX (меньше лишних аллокаций) */
const SOCIALS: { href?: string; label: string; icon: React.ReactNode; external?: boolean; soon?: boolean }[] = [
  // Telegram — будет подключён позже
  { href: undefined, label: "Telegram (скоро)", icon: <Send className="h-4 w-4" aria-hidden="true" />, external: true, soon: true },
];

const LEGAL: { href: string; label: string }[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function HomeFooter() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const reduced = useReducedMotion();

  const scrollTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  // если включено reduced motion — не передаём анимационные пропсы
  const a = (delay = 0) => (reduced ? {} : fadeUp(delay));

  return (
    <footer
      id="footer"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white pt-20 pb-10 px-6 md:px-12 lg:px-20"
      aria-labelledby="footer-title"
      role="contentinfo"
    >
      {/* скрытый заголовок для связывания aria-labelledby */}
      <h2 id="footer-title" className="sr-only">Футер сайта OneStack</h2>

      {/* мягкие свечения */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ===== Быстрый контакт (CTA) ===== */}
        <motion.section
          {...a(0)}
          aria-labelledby="cta-title"
          className="mb-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6"
          role="region"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <div id="cta-title" className="text-sm uppercase tracking-[0.25em] text-white/60">
                быстрый контакт
              </div>
              <p className="mt-2 text-xl md:text-2xl font-semibold">
                Остались вопросы? Давайте обсудим задачу
              </p>
              <p className="mt-1 text-sm text-white/60">
                Обычно отвечаем в течение рабочего дня.
              </p>
            </div>

            <div className="md:ml-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Link
                href="/#contact"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2.5 font-semibold hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition"
              >
                Написать нам
              </Link>

              {/* Telegram: пока отключено, заменим на ссылку после подключения бота */}
              <span
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white/70"
                title="Скоро подключим Telegram-бота"
                aria-disabled="true"
                role="button"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Telegram — скоро
              </span>
              {/* Для активации замените блок выше на:
              <a
                href={ORG.tgUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
                aria-label="Открыть Telegram"
                title="Telegram"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {ORG.tgName}
              </a>
              */}

              <a
                href={ORG.emailHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
                aria-label="Написать на email"
                title="Email"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email
              </a>
            </div>
          </div>
        </motion.section>

        {/* ===== Две основные плитки: Бренд + Контакты ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Бренд / описание */}
          <motion.section
            {...a(0.05)}
            aria-labelledby="brand-title"
            className="flex min-h-[320px] flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <CrownIcon className="h-6 w-6" aria-hidden="true" />
              <h3 id="brand-title" className="text-xl font-semibold">OneStack</h3>
            </div>

            <p className="mt-3 text-white/70 text-sm leading-relaxed max-w-prose">
              Один стек — бесконечные возможности. Создаём сайты, веб- и мобильные приложения,
              настраиваем инфраструктуру и берём на поддержку. Прозрачно по срокам, бюджету и качеству.
            </p>

            {/* маленькие бейджи */}
            <ul className="mt-6 flex flex-wrap gap-2 text-xs" aria-label="Наши сильные стороны">
              {["Design-driven", "Senior team", "SLA & CI/CD"].map((b) => (
                <li key={b}>
                  <span className="inline-block rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* соцсети */}
            <nav aria-label="Социальные сети" className="mt-auto pt-6">
              <ul className="flex items-center gap-2">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    {s.soon || !s.href ? (
                      <span
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] p-2 text-white/60"
                        title="Скоро"
                        aria-disabled="true"
                      >
                        {s.icon}
                      </span>
                    ) : (
                      <Social href={s.href} label={s.label} external={s.external}>
                        {s.icon}
                      </Social>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </motion.section>

          {/* Контакты */}
          <motion.section
            {...a(0.08)}
            aria-labelledby="contacts-title"
            className="flex min-h-[320px] flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 backdrop-blur-sm"
          >
            <h3 id="contacts-title" className="text-white/80 font-semibold mb-4">Контакты</h3>

            <address className="not-italic flex flex-col divide-y divide-white/10" aria-label="Контактные данные">
              <ContactItem
                icon={<Mail className="h-5 w-5" aria-hidden="true" />}
                label="Email"
                value={ORG.email}
                href={ORG.emailHref}
              />
              <ContactItem
                icon={<Phone className="h-5 w-5" aria-hidden="true" />}
                label="Телефон"
                value={ORG.phone}
                href={ORG.phoneHref}
              />
              <ContactItem
                icon={<Globe2 className="h-5 w-5" aria-hidden="true" />}
                label="Сайт"
                value={ORG.siteLabel}
                href={ORG.siteHref}
              />
              <ContactItem
                icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
                label="Локация"
                value="Москва / Санкт-Петербург · remote-first"
              />
            </address>

            <div className="mt-auto pt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-white/60">Мы бережно относимся к данным. Подробнее:</div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                {LEGAL.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    prefetch={false}
                    className="rounded-full border border-white/10 px-3 py-1.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        {/* ===== Нижняя планка ===== */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © <span suppressHydrationWarning>{year}</span> {ORG.name}. Все права защищены.
          </p>

          <div className="flex items-center gap-3 text-xs">
            {LEGAL.map((l, i) => (
              <span key={l.href} className="flex items-center gap-3">
                <Link href={l.href} prefetch={false} className="text-white/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded">
                  {l.label}
                </Link>
                {i < LEGAL.length - 1 && <span className="text-white/20">•</span>}
              </span>
            ))}

            <button
              onClick={scrollTop}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
              aria-label="Прокрутить наверх"
              type="button"
            >
              Наверх <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===== helpers ===== */

function Social({
  href,
  label,
  children,
  external,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const common =
    "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] p-2 hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" aria-label={label} title={label} className={common}>
      {children}
    </a>
  ) : (
    <Link href={href} aria-label={label} className={common} prefetch={false}>
      {children}
    </Link>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3 py-3 px-2 hover:bg-white/[0.05] focus-within:bg-white/[0.05] rounded-lg transition">
      <span className="shrink-0 rounded-xl bg-white/10 p-2">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-sm font-medium text-white/90 break-words">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-lg" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer noopener" : undefined}>
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

function CrownIcon({ className = "h-5 w-5", ...props }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true" {...(props as any)}>
      <path d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
