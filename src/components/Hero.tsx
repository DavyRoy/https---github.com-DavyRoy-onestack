// src/app/components/Hero.tsx
"use client";

import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  FormEvent,
  forwardRef,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail, Phone, Building2, Paperclip, CheckCircle2 } from "lucide-react";

const ThreadsBg = dynamic(() => import("./Threads"), { ssr: false });

/* ================================= SEO JSON-LD ================================= */

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OneStack",
  url: "https://onestack24.ru",
  logo: "https://onestack24.ru/vercal.png",
  sameAs: ["https://onestack24.ru"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "info@onestack24.ru",
      telephone: "+7-910-948-61-06",
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: ["ru"],
    },
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OneStack",
  url: "https://onestack24.ru",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://onestack24.ru/search?q={query}",
    "query-input": "required name=query",
  },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Разработка сайтов и приложений под ключ — OneStack",
  url: "https://onestack24.ru",
  inLanguage: "ru-RU",
  description:
    "Создаём сайты, веб- и мобильные приложения: дизайн, разработка, интеграции и поддержка. Понятные сроки и бюджет.",
  isPartOf: { "@type": "WebSite", url: "https://onestack24.ru", name: "OneStack" },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAV_LINKS = [
  { href: "/home", label: "Домашняя" },
  { href: "/sites", label: "Сайты" },
  { href: "/webapp", label: "Веб-приложение" },
  { href: "/mobile", label: "Мобильное приложение" },
] as const;

/* ================================= Types ================================= */

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  agree: boolean;
  file: File | null;
};

/* ================================= Analytics helper ================================= */

function track(event: string, params: Record<string, unknown> = {}) {
  try {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event, ...params });
    (window as any).ym?.(103909522, "reachGoal", event, params);
  } catch {}
}

/* ================================= Component ================================= */

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    agree: false,
    file: null,
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const desktopNav = useMemo(() => NAV_LINKS, []);
  const setField = useCallback(
    <K extends keyof ContactForm>(k: K, v: ContactForm[K]) =>
      setForm((s) => ({ ...s, [k]: v })),
    []
  );

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Как к вам обращаться?";
    if (!EMAIL_RE.test(form.email)) e.email = "Введите корректный email";
    if (!form.agree) e.agree = "Подтвердите согласие на обработку";
    if (form.file && form.file.size > 10 * 1024 * 1024) {
      e.file = "Файл больше 10 МБ";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form.name, form.email, form.agree, form.file]);

  const submitContact = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setSending(true);
      // имитация отправки
      await new Promise((r) => setTimeout(r, 700));
      setSending(false);
      setSent(true);
      track("lead_submit", { place: "hero_modal", hasFile: Boolean(form.file) });
    },
    [validate, form.file]
  );

  const openContact = useCallback(() => {
    setContactOpen(true);
    setMenuOpen(false);
    track("open_contact", { place: "hero" });
  }, []);

  const closeContact = useCallback(() => {
    setContactOpen(false);
    setSent(false);
    setErrors({});
  }, []);

  /* ===== a11y & UX ===== */
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(q.matches);
    const fn = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    q.addEventListener?.("change", fn);
    return () => q.removeEventListener?.("change", fn);
  }, []);

  useEffect(() => {
    if (!contactOpen) return;
    const t = setTimeout(() => nameRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [contactOpen]);

  // Esc to close
  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContactOpen(false);
        setSent(false);
        setErrors({});
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen]);

  // lock body scroll while overlays are opened
  useEffect(() => {
    const shouldLock = contactOpen || menuOpen;
    const prev = document.body.style.overflow;
    if (shouldLock) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [contactOpen, menuOpen]);

  // focus trap inside modal
  useEffect(() => {
    if (!contactOpen) return;
    const root = modalRef.current;
    if (!root) return;

    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const getFocusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = getFocusables();
      if (!list.length) return;

      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    root.addEventListener("keydown", handleKeyDown);
    return () => root.removeEventListener("keydown", handleKeyDown);
  }, [contactOpen]);

  /* ===== UI tokens ===== */
  const btnBase =
    "inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition text-center will-change-transform";
  const btnSize = "h-12 sm:h-14 min-w-[200px] sm:min-w-[240px] px-6 sm:px-7";

  return (
    <section
      className="relative w-full min-h-[100dvh] text-white overflow-hidden bg-gradient-to-br from-[#151515] via-[#0f0f0f] to-black"
      aria-label="Приветственный экран OneStack"
    >
      {/* SEO JSON-LD */}
      <Script id="jsonld-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} strategy="afterInteractive" />
      <Script id="jsonld-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} strategy="afterInteractive" />
      <Script id="jsonld-webpage" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} strategy="afterInteractive" />
      <Script id="favicon" strategy="afterInteractive">
        {`
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/png';
          link.sizes = '32x32';
          link.href = '/vercal.png';
          document.head.appendChild(link);
        `}
      </Script>

      {/* Фон — оставляем как есть */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-50 sm:opacity-60 [mask-image:linear-gradient(90deg,transparent_0%,black_12%,black_50%)]">
          <ThreadsBg className="w-full h-full" color={[0.92, 0.94, 0.98]} amplitude={0.65} distance={0.18} enableMouseInteraction={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/10" />
      </div>

      {/* === Шапка: FIXED === */}
      <header
        className="
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          w-[min(100%-1rem,theme(maxWidth.7xl))]
          flex items-center justify-between
          rounded-full border border-white/10 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3
          backdrop-blur-lg shadow-md
        "
      >
        <Link href="/" className="flex items-center gap-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md" aria-label="На главную OneStack">
          <CrownIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">OneStack</span>
        </Link>

        <nav className="hidden lg:flex gap-8 text-white/80 text-[16px] font-medium" aria-label="Основное меню">
          {desktopNav.map((i) => (
            <Link key={i.href} href={i.href} className="hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex gap-2">
          <Link href="/demo" className={`${btnBase} ${btnSize} border border-white/60 text-white hover:border-white active:scale-[0.99]`} onClick={() => track("click_demo_admin", { place: "hero" })}>
            Демо версия
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 min-h-[44px] min-w-[44px]"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* моб. меню */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              role="menu"
              className="absolute top-full left-0 w-full bg-black/92 border-t border-white/10 px-6 py-4 text-white lg:hidden shadow-xl z-50"
              initial={reducedMotion ? false : { opacity: 0, y: -6 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            >
              <div className="flex flex-col gap-4">
                {desktopNav.map((i) => (
                  <Link key={i.href} role="menuitem" onClick={() => setMenuOpen(false)} href={i.href} className="hover:text-white/80 rounded-md px-1 py-2">
                    {i.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 pt-3 mt-2" />
                <Link onClick={() => setMenuOpen(false)} href="/demo" className="hover:text-white/80 rounded-md px-1 py-2">
                  Демо версия
                </Link>
                <button onClick={openContact} className={`${btnBase} ${btnSize} border border-white/20 text-white hover:bg-white/10`}>
                  Связаться с нами
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* === Контент === */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 40 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="
          relative z-10
          flex flex-col items-center justify-center
          w-full min-h-[100dvh]
          px-4 sm:px-6 md:px-12 lg:px-20
          text-center
        "
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-white/80">
            <CrownIcon className="h-4 w-4 sm:h-5 sm:w-5" /> <span>OneStack</span>
          </div>

          <h1 className="mb-2 text-[clamp(3rem,7.6vw,6.6rem)] font-black leading-[0.94] tracking-tight text-white">
            OneStack
          </h1>

          {/* Подзаголовок — вариант B */}
          <p className="mb-8 mx-auto max-w-[46rem] text-[clamp(1.08rem,2.2vw,1.85rem)] font-semibold leading-[1.15] text-white/85">
            Проектируем, делаем и улучшаем: сайт, веб- и мобильное приложение. 
          </p>

          <div className="mx-auto flex w-full max-w-3xl flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/home#details"
              className={`${btnBase} ${btnSize} border border-white/70 text-white hover:border-white hover:bg-white/10 active:scale-[0.99]`}
              onClick={() => track("click_more_details", { place: "hero" })}
              aria-label="Перейти к подробностям на главной"
            >
              Больше деталей <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
            <button
              onClick={openContact}
              className={`${btnBase} ${btnSize} bg-white text-black hover:shadow-white/25 active:scale-[0.99] motion-safe:hover:scale-[1.02]`}
              aria-label="Открыть форму обратной связи"
            >
              Связаться с нами
            </button>
          </div>

          {/* Микроподпись под CTA */}
          <div className="mt-3 text-sm text-white/70">
            Ответим в течение 1&nbsp;рабочего дня
          </div>
        </div>
      </motion.div>

      {/* ===== МОДАЛКА ===== */}
      <AnimatePresence>
        {contactOpen && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-black/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeContact} aria-hidden="true" />
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-title"
              aria-describedby="contact-subtitle"
              className="fixed z-[70] inset-0 sm:inset-x-auto sm:right-8 sm:top-24 sm:bottom-auto sm:w-[760px] sm:rounded-2xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-md shadow-[0_30px_120px_rgba(0,0,0,0.6)] focus:outline-none pt-[max(env(safe-area-inset-top),0.75rem)] isolate"
              tabIndex={-1}
              initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div id="contact-title" className="text-2xl md:text-[28px] font-extrabold text-white">
                  Связаться с нами
                </div>
                <button onClick={closeContact} className="inline-flex h-10 px-4 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                  Закрыть
                </button>
              </div>

              <form onSubmit={submitContact} className="p-6 pb-[max(env(safe-area-inset-bottom),1rem)] overflow-y-auto max-h-[calc(100vh-4rem)] sm:max-h-none">
                <p id="contact-subtitle" className="sr-only">Форма обратной связи OneStack</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field ref={nameRef} label="Как вас зовут" placeholder="Иван Петров" value={form.name} onChange={(v) => setField("name", v)} error={errors.name} />
                  <Field label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={(v) => setField("email", v)} error={errors.email} />
                  <Field label="Телефон (необязательно)" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(v) => setField("phone", v)} />
                  <Field label="Компания (необязательно)" placeholder="ООО «Пример»" value={form.company} onChange={(v) => setField("company", v)} />
                </div>

                <div className="mt-5">
                  <FormLabel>Кратко опишите задачу</FormLabel>
                  <textarea
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/40"
                    placeholder="Цель проекта, сроки, ссылки на референсы…"
                  />
                </div>

                <div className="mt-5">
                  <FormLabel>Бриф / презентация (необязательно)</FormLabel>
                  <label className="mt-2 flex items-center gap-3 cursor-pointer rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">
                      {form.file ? form.file.name : "Прикрепить файл (до 10 МБ)"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.zip,.rar,.7z,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setField("file", f);
                        // обновим ошибки, если уже есть oversize
                        setErrors((prev) => {
                          const next = { ...prev };
                          if (f && f.size > 10 * 1024 * 1024) next.file = "Файл больше 10 МБ";
                          else delete next.file;
                          return next;
                        });
                      }}
                      aria-describedby={errors.file ? "file-error" : undefined}
                    />
                  </label>
                  {errors.file && (
                    <ErrText>
                      <span id="file-error">{errors.file}</span>
                    </ErrText>
                  )}
                </div>

                <div className="mt-5 flex items-start gap-3">
                  <input id="agree" type="checkbox" checked={form.agree} onChange={(e) => setField("agree", e.target.checked)} className="mt-1 h-5 w-5 rounded border-white/20 bg-black/40" />
                  <label htmlFor="agree" className="text-[15px] text-white/85">
                    Согласен(на) на обработку персональных данных и получение ответа
                  </label>
                </div>
                {errors.agree && <ErrText>{errors.agree}</ErrText>}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Badge icon={<Mail className="h-4 w-4" />} text="info@onestack24.ru" href="mailto:info@onestack24.ru" />
                  <Badge icon={<Phone className="h-4 w-4" />} text="+7 (910) 948-61-06" href="tel:+79109486106" />
                  <Badge icon={<Building2 className="h-4 w-4" />} text="Встречи оффлайн" />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button type="submit" disabled={sending} className={`${btnBase} ${btnSize} bg-white text-black hover:shadow-white/25 active:scale-[0.99] disabled:opacity-60`}>
                    {sending ? "Отправляем…" : "Отправить заявку"}
                  </button>
                  <button type="button" onClick={closeContact} className={`${btnBase} ${btnSize} border border-white/20 text-white hover:bg-white/10 active:scale-[0.99]`}>
                    Отмена
                  </button>
                </div>

                {sent && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-emerald-500/10 text-emerald-200 px-5 py-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <div className="text-sm">Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.</div>
                  </div>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ================================= UI helpers ================================= */

const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[13px] sm:text-[14px] uppercase tracking-[0.14em] text-white/75">{children}</div>
);

const Field = forwardRef<HTMLInputElement, {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}>(({ label, placeholder, value, onChange, type = "text", error }, ref) => {
  const id = useId();
  const errId = `${id}-error`;
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none placeholder:text-white/40 ${
          error ? "border-red-500/70 bg-red-500/5" : "border-white/10 bg-black/40"
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        autoComplete={type === "email" ? "email" : "on"}
        inputMode={type === "email" ? "email" : undefined}
      />
      {error && (
        <ErrText>
          <span id={errId}>{error}</span>
        </ErrText>
      )}
    </div>
  );
});
Field.displayName = "Field";

const ErrText = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-1 text-xs text-red-400">{children}</div>
);

function Badge({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const content = (
    <div className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 flex items-center gap-3 text-[15px]">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.12]">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-white/[0.02] rounded-xl">
      {content}
    </a>
  ) : (
    content
  );
}

function CrownIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function ArrowRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}