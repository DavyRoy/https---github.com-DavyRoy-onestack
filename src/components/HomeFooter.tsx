"use client";
import { serif } from "@/lib/fonts";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import FullScreenDialog from "@/components/FullScreenDialog";
import HomeContact from "@/components/HomeContact";
import WebAppContact from "@/components/WebAppContact";
import MobileContact from "@/components/MobileContact";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Mail, Phone, Send } from "lucide-react";
import { siteName, siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

const ORG = {
  name:      siteName,
  email:     "info@onestack24.ru",
  emailHref: "mailto:info@onestack24.ru",
  phone:     "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
  tgUrl:     "https://t.me/onestack_assistant_bot",
  siteUrl,
};

/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY = {
  ru: {
    footerAria: "Футер",
    ctaLine1: "Готовы",
    ctaLine2: "начать?",
    ctaDiscuss: "Обсудить проект",
    ctaCall: "Позвонить",
    brandBlurb: "Сайты, веб- и мобильные приложения и внедрение ИИ под ключ. Фиксированная смета, сдаём в срок, поддерживаем после запуска.",
    nav: [
      { label: "Сайты",          href: "/sites"  },
      { label: "Веб-приложения", href: "/webapp" },
      { label: "Мобильные",      href: "/mobile" },
      { label: "AI и автоматизация", href: "/ai" },
    ],
    navLabel: "Услуги",
    contactsLabel: "Контакты",
    tags: ["Дизайн-подход", "Senior-команда", "SLA"],
    legal: [
      { label: "Политика", href: "/privacy" },
      { label: "Условия",  href: "/terms"   },
    ],
    rights: "Все права защищены.",
    toTop: "Наверх",
    scrollTopAria: "Прокрутить наверх",
  },
  en: {
    footerAria: "Footer",
    ctaLine1: "Ready to",
    ctaLine2: "start?",
    ctaDiscuss: "Discuss project",
    ctaCall: "Call us",
    brandBlurb: "Turnkey websites, web and mobile apps and AI implementation. Fixed quote, on-time delivery, support after launch.",
    nav: [
      { label: "Websites", href: "/sites"  },
      { label: "Web apps", href: "/webapp" },
      { label: "Mobile",   href: "/mobile" },
      { label: "AI & automation", href: "/ai" },
    ],
    navLabel: "Services",
    contactsLabel: "Contact",
    tags: ["Design-driven", "Senior team", "SLA"],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms",   href: "/terms"   },
    ],
    rights: "All rights reserved.",
    toTop: "Back to top",
    scrollTopAria: "Scroll to top",
  },
} as const;

export default function HomeFooter() {
  const { locale } = useI18n();
  const lang = locale === "ru" ? "ru" : "en";
  const c = COPY[lang];
  const year    = useMemo(() => new Date().getFullYear(), []);
  const reduced = useReducedMotion();
  const pathname = usePathname() || "/";

  /* На главной форма есть прямо на странице — просто прокручиваем к ней.
     На остальных страницах ссылка вела на главную, уводя человека с раздела,
     поэтому там открываем форму модальным окном. */
  const isHome = pathname === "/" || pathname === "/en";
  const [contactOpen, setContactOpen] = useState(false);

  const openDiscuss = useCallback(() => {
    // Если страница собрана из слоёв (/sites, /webapp), у неё уже есть раздел
    // «Обсудить проект» — просим открыть его, чтобы на одной странице не
    // оказалось двух разных форм. Слой отвечает preventDefault; если никто не
    // ответил, показываем собственное окно.
    const ev = new CustomEvent("site-open-section", { detail: "contact", cancelable: true });
    const handled = !window.dispatchEvent(ev);
    if (!handled) setContactOpen(true);
  }, []);

  const scrollTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);


  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: d },
  };

  return (
    <>

      <footer id="footer" role="contentinfo" aria-label={c.footerAria}
        className="relative overflow-hidden" style={{ background: isHome ? "transparent" : BG }}>

        {/* On home the footer sits on the shared seamless background, so no top rule */}
        {!isHome && (
          <div className="footer-inner">
            <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>
        )}

        {/* Ширина как у блоков страницы: на главной 1280px, на страницах услуг 1440px. */}
        <div className={`relative z-10 ${isHome ? "mx-auto w-full max-w-[1280px] px-5 md:px-10" : "footer-inner"} pb-10`} style={{ paddingTop: "clamp(72px,10svh,110px)" }}>

          {/* ── Big CTA row ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <motion.h2 {...fadeUp(0)} className={serif.className}
              style={{ fontSize: "clamp(2.3rem, 5.06vw, 3.91rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: WHITE, margin: 0 }}>
              {c.ctaLine1} {c.ctaLine2}
            </motion.h2>

            <motion.div className="flex flex-col sm:flex-row gap-3" {...fadeUp(0.15)}>
              {isHome ? (
                <Link href="/#contact" className="service-button service-button--primary">
                  {c.ctaDiscuss}<ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              ) : (
                <button type="button" onClick={openDiscuss} className="service-button service-button--primary">
                  {c.ctaDiscuss}<ArrowUpRight size={18} aria-hidden="true" />
                </button>
              )}
              <a href={ORG.phoneHref} className="service-button service-button--secondary">
                <Phone size={18} aria-hidden="true" />{c.ctaCall}
              </a>
            </motion.div>
          </div>

          {/* ── 3-col grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr] gap-10 sm:gap-12 mb-16 pb-16 border-b"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}>

            {/* Brand */}
            <motion.div {...fadeUp(0)}>
              <div className="flex items-center gap-2.5 mb-5">
                <OneStackIcon />
                <span className="text-lg font-semibold" style={{ color: WHITE }}>OneStack</span>
              </div>
              <p className="text-lg leading-relaxed mb-6 max-w-xs"
                style={{ color: "rgba(244,250,248,0.42)" }}>
                {c.brandBlurb}
              </p>
              <div className="flex gap-2">
                {[
                  { href: ORG.tgUrl, icon: <Send className="w-3.5 h-3.5" />, label: "Telegram" },
                  { href: ORG.emailHref, icon: <Mail className="w-3.5 h-3.5" />, label: "Email" },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined} aria-label={label}
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 hover:scale-110 focus:outline-none"
                    style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", color: TEAL }}>
                    {icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Nav */}
            <motion.div {...fadeUp(0.07)}>
              <p className="text-[13px] tracking-[0.2em] uppercase font-medium mb-5"
                style={{ color: "rgba(244,250,248,0.28)" }}>{c.navLabel}</p>
              <ul className="space-y-3">
                {c.nav.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} prefetch={false}
                      className="text-lg transition-colors duration-200 hover:opacity-100 focus:outline-none"
                      style={{ color: "rgba(244,250,248,0.5)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contacts */}
            <motion.div {...fadeUp(0.12)}>
              <p className="text-[13px] tracking-[0.2em] uppercase font-medium mb-5"
                style={{ color: "rgba(244,250,248,0.28)" }}>{c.contactsLabel}</p>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-3.5 h-3.5" />, val: ORG.email,     href: ORG.emailHref },
                  { icon: <Phone className="w-3.5 h-3.5" />, val: ORG.phone,    href: ORG.phoneHref },
                ].map(({ icon, val, href }) => (
                  <a key={val} href={href}
                    className="flex items-center gap-3 group focus:outline-none">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: TEAL }}>
                      {icon}
                    </span>
                    <span className="text-lg transition-colors group-hover:opacity-80"
                      style={{ color: "rgba(244,250,248,0.65)" }}>{val}</span>
                  </a>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {c.tags.map(tag => (
                  <span key={tag} className="text-[14px] px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.15)", color: "rgba(244,250,248,0.5)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-base" style={{ color: "rgba(244,250,248,0.28)" }}>
              © <span suppressHydrationWarning>{year}</span> {ORG.name}. {c.rights}
            </p>

            <div className="flex items-center gap-5">
              {c.legal.map(({ label, href }) => (
                <Link key={href} href={href} prefetch={false}
                  className="text-base transition-colors hover:opacity-80 focus:outline-none"
                  style={{ color: "rgba(244,250,248,0.3)" }}>
                  {label}
                </Link>
              ))}
              <button onClick={scrollTop} type="button" aria-label={c.scrollTopAria}
                className="flex items-center gap-1.5 text-base py-2 px-3.5 rounded-full transition-all duration-300 hover:bg-white/5 focus:outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(244,250,248,0.35)" }}>
                {c.toTop} <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Форма в модальном окне — для страниц, где её нет в потоке.
          Раздел берём под страницу, чтобы текст соответствовал контексту. */}
      {contactOpen && (
        <FullScreenDialog
          title={c.ctaDiscuss}
          closeLabel={locale === "en" ? "Close" : "Закрыть"}
          onClose={() => setContactOpen(false)}
        >
          {/\/webapp(\/|$)/.test(pathname)
            ? <WebAppContact inDialog />
            : /\/mobile(\/|$)/.test(pathname)
              ? <MobileContact inDialog />
              : <HomeContact />}
        </FullScreenDialog>
      )}
    </>
  );
}

/* ─── OneStack icon ────────────────────────────────────────────────────── */
function OneStackIcon() {
  return (
    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-5" aria-hidden="true">
      <path d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z" stroke="#2dd4bf" strokeWidth="2.5" />
    </svg>
  );
}
