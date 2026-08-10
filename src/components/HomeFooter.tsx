"use client";
import { serif } from "@/lib/fonts";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Mail, Phone, Send, ArrowRight } from "lucide-react";
import { siteName, siteUrl } from "@/app/seo.config";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const ORG = {
  name:      siteName,
  email:     "info@onestack24.ru",
  emailHref: "mailto:info@onestack24.ru",
  phone:     "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
  tgUrl:     "https://t.me/onestack_assistant_bot",
  siteUrl,
};

const NAV = [
  { label: "Сайты",           href: "/sites"   },
  { label: "Веб-приложения",  href: "/webapp"  },
  { label: "Мобильные",       href: "/mobile"  },
] as const;

const LEGAL = [
  { label: "Политика",   href: "/privacy" },
  { label: "Условия",    href: "/terms"   },
] as const;

export default function HomeFooter() {
  const year    = useMemo(() => new Date().getFullYear(), []);
  const reduced = useReducedMotion();

  const scrollTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG.name, url: ORG.siteUrl,
    email: ORG.email, telephone: ORG.phone,
    sameAs: [ORG.siteUrl, ORG.tgUrl],
  }), []);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <>
      <Script id="ld-home-footer" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <footer id="footer" role="contentinfo" aria-label="Футер"
        className="relative overflow-hidden" style={{ background: BG }}>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }} aria-hidden />

        {/* Separator */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-14">
          <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14 pt-16 sm:pt-20 pb-10">

          {/* ── Big CTA row ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 sm:mb-20">
            <div>
              {(["Готовы", "начать?"] as const).map((text, i) => (
                <motion.div key={i}
                  className={`${serif.className} block font-normal leading-[1.0] tracking-[-0.04em]`}
                  style={i === 0
                    ? { fontSize: "clamp(3rem, 8vw, 9rem)", WebkitTextStroke: `1.5px ${TEAL}`, color: "transparent" }
                    : { fontSize: "clamp(3rem, 8vw, 9rem)", color: WHITE }}
                  initial={reduced ? undefined : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}>
                  {text}
                </motion.div>
              ))}
            </div>

            <motion.div className="flex flex-col sm:flex-row gap-3 lg:pb-4" {...fadeUp(0.15)}>
              <Link href="/home#contact"
                className="inline-flex items-center gap-2 py-4 px-7 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] focus:outline-none"
                style={{ background: TEAL, color: BG }}>
                Обсудить проект <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={ORG.phoneHref}
                className="inline-flex items-center gap-2 py-4 px-6 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/5 focus:outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(244,250,248,0.6)" }}>
                <Phone className="w-4 h-4" /> Позвонить
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
                <span className="text-base font-semibold" style={{ color: WHITE }}>OneStack</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-xs"
                style={{ color: "rgba(244,250,248,0.42)" }}>
                Фиксированная цена, предсказуемый срок, поддержка после запуска. Сайты, веб- и мобильные приложения под ключ.
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
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-5"
                style={{ color: "rgba(244,250,248,0.28)" }}>Услуги</p>
              <ul className="space-y-3">
                {NAV.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} prefetch={false}
                      className="text-sm transition-colors duration-200 hover:opacity-100 focus:outline-none"
                      style={{ color: "rgba(244,250,248,0.5)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contacts */}
            <motion.div {...fadeUp(0.12)}>
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-5"
                style={{ color: "rgba(244,250,248,0.28)" }}>Контакты</p>
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
                    <span className="text-sm transition-colors group-hover:opacity-80"
                      style={{ color: "rgba(244,250,248,0.65)" }}>{val}</span>
                  </a>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Дизайн-подход", "Senior-команда", "SLA"].map(tag => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.15)", color: "rgba(244,250,248,0.5)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(244,250,248,0.28)" }}>
              © <span suppressHydrationWarning>{year}</span> {ORG.name}. Все права защищены.
            </p>

            <div className="flex items-center gap-5">
              {LEGAL.map(({ label, href }) => (
                <Link key={href} href={href} prefetch={false}
                  className="text-xs transition-colors hover:opacity-80 focus:outline-none"
                  style={{ color: "rgba(244,250,248,0.3)" }}>
                  {label}
                </Link>
              ))}
              <button onClick={scrollTop} type="button" aria-label="Прокрутить наверх"
                className="flex items-center gap-1.5 text-xs py-2 px-3.5 rounded-full transition-all duration-300 hover:bg-white/5 focus:outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(244,250,248,0.35)" }}>
                Наверх <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </footer>
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
