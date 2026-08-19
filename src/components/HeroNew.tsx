"use client";
import { serif } from "@/lib/fonts";

import Link from "next/link";
import React, {
  useState, useCallback, useEffect, useRef, FormEvent, forwardRef, useId,
} from "react";
import {
  motion, AnimatePresence, useReducedMotion,
  useMotionValue, useSpring,
} from "framer-motion";
import { Mail, Paperclip, CheckCircle2, ArrowUpRight } from "lucide-react";
import { siteName, siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";


/* ─── Palette ─────────────────────────────────────────────────────────────── */
const BG     = "#07100e";
const TEAL   = "#2dd4bf";
const WHITE  = "#f4faf8";

/* ─── Constants ──────────────────────────────────────────────────────────── */
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_NAME = siteName;
const SITE_URL  = siteUrl;
type Lang = "ru" | "en";
type ServiceId = "sites" | "webapp" | "mobile";
type ContactForm = { name: string; email: string; message: string; agree: boolean; file: File | null };

/* ─── Service data ────────────────────────────────────────────────────────── */
const SVC = {
  sites: {
    ru: "Сайты", en: "Websites",
    num: 48,
    statRu: "сайтов\nзапущено", statEn: "websites\nlaunched",
    copyRu: "От лендинга до ecom‑платформы — с нуля до продакшна",
    copyEn: "From landing page to ecommerce — zero to production",
    href: "/sites",
  },
  webapp: {
    ru: "Веб-приложения", en: "Web apps",
    num: 23,
    statRu: "веб-сервиса\nсделано", statEn: "web services\ndelivered",
    copyRu: "SaaS, дашборды, CRM — любой сложности и масштаба",
    copyEn: "SaaS, dashboards, CRM — any complexity and scale",
    href: "/webapp",
  },
  mobile: {
    ru: "Мобильные", en: "Mobile",
    num: 19,
    statRu: "мобильных\nв App Store", statEn: "mobile apps\nin App Store",
    copyRu: "iOS & Android из одного кодбаза на React Native",
    copyEn: "iOS & Android from one React Native codebase",
    href: "/mobile",
  },
} as const;

const SVC_IDS: ServiceId[] = ["sites", "webapp", "mobile"];

/* ─── Tech ticker items ──────────────────────────────────────────────────── */
const TICKER = [
  "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL",
  "Tailwind CSS", "Framer Motion", "Vercel", "React Native", "Expo",
  "tRPC", "Prisma", "Supabase", "Figma", "Docker",
];

/* ─── Count-up hook ──────────────────────────────────────────────────────── */
function useCountUp(target: number) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0);
    const dur = 900;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      setVal(Math.round(ease * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

/* ─── Cursor glow ────────────────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 80, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    const fn = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[1] hidden lg:block"
      style={{
        left: 0, top: 0, width: 520, height: 520,
        x: sx, y: sy,
        marginLeft: -260, marginTop: -260,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${TEAL}14 0%, ${TEAL}06 40%, transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
}

/* ─── Grain overlay ──────────────────────────────────────────────────────── */
function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] opacity-[0.028]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }}
      aria-hidden="true"
    />
  );
}

/* ─── Marquee ticker ─────────────────────────────────────────────────────── */
function Ticker() {
  const items = [...TICKER, ...TICKER, ...TICKER];
  return (
    <div className="relative w-full overflow-hidden border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${BG}, transparent)` }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${BG}, transparent)` }} />

      <div className="flex">
        <motion.div
          className="flex items-center gap-0 shrink-0 py-4"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <span className="text-xs tracking-[0.12em] uppercase font-medium whitespace-nowrap px-6"
                style={{ color: "rgba(255,255,255,0.2)" }}>
                {item}
              </span>
              <span className="shrink-0 w-1 h-1 rounded-full" style={{ background: TEAL + "50" }} />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Headline with stagger ──────────────────────────────────────────────── */
function Headline({ lines, reduced }: { lines: string[]; reduced: boolean | null }) {
  return (
    <h1
      className={`${serif.className} font-normal leading-[0.9] tracking-[-0.03em]`}
      style={{ color: WHITE, fontSize: "clamp(3.8rem, 9vw, 9.5rem)" }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
          <motion.span
            className="block"
            initial={reduced ? undefined : { y: "108%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + li * 0.1, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* ─── Service selector ───────────────────────────────────────────────────── */
function ServiceSelector({
  active, onSelect, lang,
}: {
  active: ServiceId; onSelect: (id: ServiceId) => void; lang: Lang;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {SVC_IDS.map((id, i) => {
        const isActive = id === active;
        const num = String(i + 1).padStart(2, "0");
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="group flex items-center gap-4 text-left py-2.5 relative"
          >
            {/* Active bar */}
            {isActive && (
              <motion.div
                layoutId="svc-bar"
                className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                style={{ background: TEAL }}
                transition={{ type: "spring", stiffness: 600, damping: 40 }}
              />
            )}

            {/* Index number */}
            <span
              className="text-[11px] font-mono tabular-nums w-6 shrink-0 transition-colors duration-200 pl-4"
              style={{ color: isActive ? TEAL : "rgba(255,255,255,0.18)" }}
            >
              {num}
            </span>

            {/* Label */}
            <motion.span
              className="font-medium leading-none"
              animate={{
                color: isActive ? WHITE : "rgba(255,255,255,0.3)",
                x: isActive ? 2 : 0,
              }}
              transition={{ duration: 0.22 }}
              style={{ fontSize: isActive ? "1.05rem" : "0.9rem" }}
            >
              {SVC[id][lang]}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Stat panel ─────────────────────────────────────────────────────────── */
function StatPanel({ active, lang, onContact, localizePath }: {
  active: ServiceId; lang: Lang; onContact: () => void; localizePath: (p: string) => string;
}) {
  const svc = SVC[active];
  const num = useCountUp(svc.num);
  const stat = lang === "ru" ? svc.statRu : svc.statEn;
  const copy = lang === "ru" ? svc.copyRu : svc.copyEn;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5"
      >
        {/* Big number */}
        <div>
          <div
            className={`${serif.className} leading-none font-normal`}
            style={{ fontSize: "clamp(5rem, 10vw, 8rem)", color: TEAL }}
          >
            {num}
          </div>
          <p className="text-sm font-medium mt-1 whitespace-pre-line leading-snug"
            style={{ color: "rgba(255,255,255,0.38)" }}>
            {stat}
          </p>
        </div>

        {/* Copy */}
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          {copy}
        </p>

        {/* CTA */}
        <Link
          href={localizePath(svc.href)}
          className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors w-fit"
          style={{ color: TEAL }}
        >
          <span className="border-b border-current border-opacity-0 group-hover:border-opacity-100 transition-all pb-px">
            {lang === "ru" ? "Подробнее" : "Learn more"}
          </span>
          <motion.span
            className="inline-block"
            whileHover={{ x: 2, y: -2 }}
            transition={{ duration: 0.15 }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
export default function HeroNew() {
  const { messages: m, localizePath } = useI18n();
  const h = m.hero;
  const n = m.nav;
  const lang: Lang = m.nav.home === "Домашняя" ? "ru" : "en";
  const reduced = useReducedMotion();

  const [active,      setActive]      = useState<ServiceId>("sites");
  const [contactOpen, setContactOpen] = useState(false);
  const [sending,     setSending]     = useState(false);
  const [sent,        setSent]        = useState(false);
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const nameRef  = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ContactForm>({
    name: "", email: "", message: "", agree: false, file: null,
  });

  const setField = useCallback(
    <K extends keyof ContactForm>(k: K, v: ContactForm[K]) =>
      setForm(s => ({ ...s, [k]: v })), []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim())           e.name  = h.errors.nameRequired;
    if (!EMAIL_RE.test(form.email))  e.email = h.errors.emailInvalid;
    if (!form.agree)                 e.agree = h.errors.agreeRequired;
    if (form.file && form.file.size > 10 * 1024 * 1024) e.file = h.errors.fileTooLarge;
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, h.errors]);

  const submitContact = useCallback(async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 700));
    setSending(false); setSent(true);
  }, [validate]);

  const openContact  = useCallback(() => setContactOpen(true),  []);
  const closeContact = useCallback(() => { setContactOpen(false); setSent(false); setErrors({}); }, []);

  useEffect(() => { if (contactOpen) setTimeout(() => nameRef.current?.focus(), 120); }, [contactOpen]);
  useEffect(() => {
    if (!contactOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") closeContact(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [contactOpen, closeContact]);
  useEffect(() => {
    if (!contactOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [contactOpen]);
  useEffect(() => {
    if (!contactOpen) return;
    const root = modalRef.current; if (!root) return;
    const sel = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>(sel))
        .filter(el => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusables(); if (!list.length) return;
      const [first, last] = [list[0], list[list.length - 1]];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) { if (active === first || !root.contains(active)) { e.preventDefault(); last.focus(); } }
      else            { if (active === last)  { e.preventDefault(); first.focus(); } }
    };
    root.addEventListener("keydown", trap);
    return () => root.removeEventListener("keydown", trap);
  }, [contactOpen]);

  const headlineRu = ["Создаём", "цифровые", "продукты"];
  const headlineEn = ["Building", "digital", "products"];
  const headline   = lang === "ru" ? headlineRu : headlineEn;

  return (
    <section
      className="relative w-full min-h-[100dvh] flex flex-col"
      style={{ background: BG }}
    >
      <script id="schema-hero-new" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context":"https://schema.org","@type":"Organization",name:SITE_NAME,url:SITE_URL }) }} />

      <CursorGlow />
      <Grain />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.header
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-6 sm:px-10 py-5"
      >
        <Link href={localizePath("/")} aria-label={n.brandAria}
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 rounded">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="7" fill={TEAL} fillOpacity="0.1"/>
            <rect x=".5" y=".5" width="27" height="27" rx="6.5" stroke={TEAL} strokeOpacity="0.35"/>
            <path d="M8 14h4.5m0 0V9.5m0 4.5v4.5m5 0v-9m0 0-2.5 2.5m2.5-2.5 2.5 2.5"
              stroke={TEAL} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: WHITE }}>OneStack</span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher compact />
        </div>
      </motion.header>

      {/* ── Main two-column ───────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-stretch px-6 sm:px-10 pb-0 gap-0">

        {/* LEFT ── Headline + meta */}
        <div className="flex flex-col justify-center flex-1 py-10 lg:py-0 lg:pr-12">

          {/* Year tag */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8" style={{ background: TEAL + "80" }} />
            <span className="text-[11px] tracking-[0.18em] uppercase font-medium"
              style={{ color: TEAL + "cc" }}>
              {lang === "ru" ? "Веб-студия · с 2021" : "Web studio · since 2021"}
            </span>
          </motion.div>

          {/* Big headline */}
          <div className="mb-10">
            <Headline lines={headline} reduced={reduced} />
          </div>

          {/* Stats strip */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-6 mb-10 flex-wrap"
          >
            {[
              { val: "120+", label: lang === "ru" ? "проектов" : "projects" },
              { val: "4.9★", label: lang === "ru" ? "рейтинг"  : "rating"   },
              { val:  "3+",  label: lang === "ru" ? "года"      : "years"    },
            ].map(({ val, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div className="h-3 w-px shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-semibold" style={{ color: WHITE }}>{val}</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>{label}</span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.button
              onClick={openContact}
              whileHover={{ scale: 1.02, boxShadow: `0 0 32px ${TEAL}40` }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full px-6 h-11 text-sm font-semibold"
              style={{ background: TEAL, color: BG }}
            >
              {lang === "ru" ? "Обсудить проект" : "Start a project"}
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
            <Link href={localizePath("/")}
              className="inline-flex items-center gap-2 rounded-full border px-6 h-11 text-sm font-medium transition-colors hover:border-white/25 hover:text-white/70"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}>
              {h.detailsCta}
            </Link>
          </motion.div>
        </div>

        {/* Vertical divider — desktop only */}
        <motion.div
          className="hidden lg:block w-px self-stretch my-10"
          style={{ background: "rgba(255,255,255,0.06)" }}
          initial={reduced ? undefined : { scaleY: 0, originY: "center" }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* RIGHT ── Service selector + stat */}
        <motion.div
          className="flex flex-col justify-center lg:pl-12 pb-10 lg:pb-0 lg:w-[340px] xl:w-[380px] gap-8"
          initial={reduced ? undefined : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Service selector */}
          <ServiceSelector active={active} onSelect={setActive} lang={lang} />

          {/* Thin separator */}
          <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

          {/* Stat panel */}
          <StatPanel
            active={active}
            lang={lang}
            onContact={openContact}
            localizePath={localizePath}
          />
        </motion.div>
      </div>

      {/* ── Ticker ────────────────────────────────────────────────── */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10"
      >
        <Ticker />
      </motion.div>

      {/* ── Contact drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {contactOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeContact}
              aria-hidden="true"
            />

            {/* Drawer — slides from bottom on mobile, from right on sm+ */}
            <DrawerShell modalRef={modalRef} reduced={reduced}>
              <DrawerContent

                reduced={reduced}
                lang={lang}
                h={h}
                form={form}
                errors={errors}
                sending={sending}
                sent={sent}
                nameRef={nameRef}
                onClose={closeContact}
                onSubmit={submitContact}
                setField={setField}
                setErrors={setErrors}
                serif={serif.className}
              />
            </DrawerShell>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── Floating label input ───────────────────────────────────────────────── */
const FloatField = forwardRef<
  HTMLInputElement,
  { label: string; value: string; onChange: (v: string) => void; type?: string; error?: string }
>(({ label, value, onChange, type = "text", error }, ref) => {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const elevated = focused || value.length > 0;
  const lineColor = error ? "#f87171" : focused ? TEAL : "rgba(255,255,255,0.1)";

  return (
    <div className="relative pt-5">
      <motion.label
        htmlFor={id}
        className="absolute left-0 pointer-events-none font-medium"
        animate={{
          top: elevated ? 0 : "1.25rem",
          fontSize: elevated ? "10px" : "14px",
          letterSpacing: elevated ? "0.12em" : "0",
          color: elevated ? (error ? "#f87171" : TEAL) : "rgba(255,255,255,0.28)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ textTransform: elevated ? "uppercase" : "none" }}
      >
        {label}
      </motion.label>
      <input
        ref={ref} id={id} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={Boolean(error)}
        className="w-full bg-transparent border-0 border-b pb-2.5 pt-1 text-sm outline-none"
        style={{ borderBottomColor: lineColor, color: WHITE, transition: "border-color 0.2s" }}
      />
      {/* Animated teal underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px]"
        style={{ background: TEAL, originX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      {error && <p className="mt-1 text-[11px] text-red-400/80">{error}</p>}
    </div>
  );
});
FloatField.displayName = "FloatField";

/* ─── Floating label textarea ────────────────────────────────────────────── */
function FloatTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const elevated = focused || value.length > 0;

  return (
    <div className="relative pt-5">
      <motion.label
        htmlFor={id}
        className="absolute left-0 pointer-events-none font-medium"
        animate={{
          top: elevated ? 0 : "1.25rem",
          fontSize: elevated ? "10px" : "14px",
          letterSpacing: elevated ? "0.12em" : "0",
          color: elevated ? TEAL : "rgba(255,255,255,0.28)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ textTransform: elevated ? "uppercase" : "none" }}
      >
        {label}
      </motion.label>
      <textarea
        id={id} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={3}
        className="w-full bg-transparent border-0 border-b pb-2.5 pt-1 text-sm outline-none resize-none"
        style={{
          borderBottomColor: focused ? TEAL : "rgba(255,255,255,0.1)",
          color: WHITE,
          transition: "border-color 0.2s",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px]"
        style={{ background: TEAL, originX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}

/* ─── Project type chip ──────────────────────────────────────────────────── */
function ProjectChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-1.5 rounded-full text-xs font-medium border transition-colors"
      style={{
        borderColor: active ? TEAL : "rgba(255,255,255,0.12)",
        background: active ? TEAL + "18" : "transparent",
        color: active ? TEAL : "rgba(255,255,255,0.35)",
      }}
    >
      {label}
    </motion.button>
  );
}

/* ─── Drawer shell — handles responsive slide direction ─────────────────── */
function DrawerShell({
  modalRef, reduced, children,
}: {
  modalRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean | null;
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const fn = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <motion.div
      ref={modalRef}
      role="dialog" aria-modal="true"
      aria-labelledby="ct-title"
      tabIndex={-1}
      className="fixed z-[70] focus:outline-none
        bottom-0 left-0 right-0 max-h-[92dvh] rounded-t-2xl
        sm:bottom-auto sm:top-0 sm:right-0 sm:left-auto sm:max-h-none sm:rounded-none sm:rounded-l-3xl
        sm:w-[460px] sm:h-full
        flex flex-col overflow-hidden"
      style={{ background: "#050e0c", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
      initial={reduced ? undefined : (isMobile ? { y: "100%" } : { x: "100%" })}
      animate={isMobile ? { y: 0 } : { x: 0 }}
      exit={isMobile ? { y: "100%" } : { x: "100%" }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Drawer content ─────────────────────────────────────────────────────── */
function DrawerContent({
  reduced, lang, h, form, errors, sending, sent,
  nameRef, onClose, onSubmit, setField, setErrors, serif: serifClass,
}: {
  reduced: boolean | null;
  lang: Lang;
  h: any;
  form: ContactForm;
  errors: Record<string, string>;
  sending: boolean;
  sent: boolean;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  setField: <K extends keyof ContactForm>(k: K, v: ContactForm[K]) => void;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  serif: string;
}) {
  const PROJECT_TYPES = lang === "ru"
    ? ["Сайт", "Веб-приложение", "Мобильное", "Другое"]
    : ["Website", "Web app", "Mobile", "Other"];

  const [projectType, setProjectType] = useState("");

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between px-8 pt-8 pb-6 shrink-0">
        <div>
          <motion.h2
            id="ct-title"
            className={`${serifClass} font-normal leading-[0.92] tracking-[-0.02em]`}
            style={{ fontSize: "clamp(2.4rem,6vw,3.2rem)", color: WHITE }}
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {lang === "ru" ? "Давайте\nпоговорим" : "Let's\ntalk"}
          </motion.h2>
          <motion.p
            className="mt-3 text-xs"
            style={{ color: "rgba(255,255,255,0.28)" }}
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            {lang === "ru" ? "Ответим в течение рабочего дня" : "We'll reply within one business day"}
          </motion.p>
        </div>

        <button
          onClick={onClose}
          className="shrink-0 mt-1 w-8 h-8 flex items-center justify-center rounded-full transition"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}
          aria-label={h.close}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px mx-8 shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Form — scrollable */}
      <form
        onSubmit={onSubmit}
        className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-7"
      >
        {/* Project type chips */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
        >
          <p className="text-[10px] uppercase tracking-[0.14em] font-medium mb-3"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            {lang === "ru" ? "Тип проекта" : "Project type"}
          </p>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map(type => (
              <ProjectChip
                key={type}
                label={type}
                active={projectType === type}
                onClick={() => setProjectType(t => t === type ? "" : type)}
              />
            ))}
          </div>
        </motion.div>

        {/* Fields */}
        <motion.div
          className="flex flex-col gap-6"
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <FloatField
            ref={nameRef}
            label={h.nameLabel}
            value={form.name}
            onChange={v => setField("name", v)}
            error={errors.name}
          />
          <FloatField
            label={h.emailLabel}
            type="email"
            value={form.email}
            onChange={v => setField("email", v)}
            error={errors.email}
          />
          <FloatTextarea
            label={h.messageLabel}
            value={form.message}
            onChange={v => setField("message", v)}
          />
        </motion.div>

        {/* File attach — minimal */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.4 }}
        >
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Paperclip className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>
            <span className="text-xs transition"
              style={{ color: form.file ? TEAL : "rgba(255,255,255,0.25)" }}>
              {form.file ? form.file.name : (lang === "ru" ? "Прикрепить файл · до 10 МБ" : "Attach file · up to 10 MB")}
            </span>
            <input type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0] || null; setField("file", f);
                setErrors(prev => {
                  const n = { ...prev };
                  if (f && f.size > 10 * 1024 * 1024) n.file = h.errors.fileTooLarge;
                  else delete n.file;
                  return n;
                });
              }} />
          </label>
          {errors.file && <p className="mt-1.5 text-[11px] text-red-400/80">{errors.file}</p>}
        </motion.div>

        {/* Agree */}
        <motion.div
          className="flex items-start gap-3"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36, duration: 0.4 }}
        >
          <div
            onClick={() => setField("agree", !form.agree)}
            className="mt-0.5 w-4 h-4 shrink-0 rounded flex items-center justify-center cursor-pointer transition-colors"
            style={{
              background: form.agree ? TEAL : "transparent",
              border: `1.5px solid ${form.agree ? TEAL : "rgba(255,255,255,0.2)"}`,
            }}
          >
            {form.agree && (
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3l2 2 4-4" stroke={BG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <label
            onClick={() => setField("agree", !form.agree)}
            className="text-[11px] leading-relaxed cursor-pointer"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {h.agreeLabel}
          </label>
        </motion.div>
        {errors.agree && <p className="text-[11px] text-red-400/80 -mt-4">{errors.agree}</p>}

        {/* Submit */}
        <motion.div
          className="flex flex-col gap-3 pt-2"
          initial={reduced ? undefined : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: TEAL + "20" }}
              >
                <CheckCircle2 className="w-6 h-6" style={{ color: TEAL }} />
              </motion.div>
              <p className="text-sm font-medium" style={{ color: WHITE }}>{h.success}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {lang === "ru" ? "Свяжемся в ближайшее время" : "We'll be in touch soon"}
              </p>
            </motion.div>
          ) : (
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity relative overflow-hidden"
              style={{ background: TEAL, color: BG }}
            >
              {sending ? (
                <motion.div
                  className="w-4 h-4 rounded-full border-2"
                  style={{ borderColor: `${BG}40`, borderTopColor: BG }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <span>{h.submit}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </form>

      {/* Footer */}
      <div className="shrink-0 px-8 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <a
          href="mailto:info@onestack24.ru"
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: TEAL + "15" }}>
            <Mail className="w-3.5 h-3.5" style={{ color: TEAL }} />
          </div>
          <span className="text-xs transition-colors group-hover:text-white/60"
            style={{ color: "rgba(255,255,255,0.28)" }}>
            info@onestack24.ru
          </span>
        </a>
      </div>
    </>
  );
}
