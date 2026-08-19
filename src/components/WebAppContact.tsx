// src/components/WebAppContact.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import {
  Mail, Phone, Building2, Paperclip, CheckCircle2, X,
  ArrowRight, MessageCircle, Clock3, User, Calendar, FileText, Calculator,
} from "lucide-react";
import { useQuote } from "@/app/context/QuoteContext";
import { useI18n } from "@/i18n/I18nProvider";
import { siteName, siteUrl } from "@/app/seo.config";


const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const BG    = "#07100e";

/* ─── Types & constants ──────────────────────────────────────────────────── */
type Kind     = "mvp" | "saas" | "internal" | "marketplace" | "dashboard" | "portal";
type Budget   = "100-300" | "300-700" | "700-1500" | "1500+";
type Timeline = "2-4" | "4-8" | "8-12" | "12+";

type FormState = {
  name: string; email: string; phone: string; company: string;
  kind: Kind[]; budget: Budget | ""; timeline: Timeline | "";
  message: string; agree: boolean; file: File | null; hp: string;
};

const INITIAL: FormState = {
  name: "", email: "", phone: "", company: "",
  kind: [], budget: "", timeline: "",
  message: "", agree: false, file: null, hp: "",
};

const KIND_OPTIONS_RU: ReadonlyArray<[Kind, string]> = [
  ["mvp",         "MVP и прототип"],
  ["saas",        "SaaS-платформа"],
  ["internal",    "Внутренние инструменты"],
  ["marketplace", "Маркетплейс"],
  ["dashboard",   "Дашборд и аналитика"],
  ["portal",      "Личный кабинет"],
];
const KIND_OPTIONS_EN: ReadonlyArray<[Kind, string]> = [
  ["mvp",         "MVP & prototype"],
  ["saas",        "SaaS platform"],
  ["internal",    "Internal tools"],
  ["marketplace", "Marketplace"],
  ["dashboard",   "Dashboard & analytics"],
  ["portal",      "User portal"],
];

const BUDGET_OPTIONS_RU = [
  { value: "100-300",  label: "100–300 тыс ₽"      },
  { value: "300-700",  label: "300–700 тыс ₽"      },
  { value: "700-1500", label: "700 тыс – 1.5 млн ₽" },
  { value: "1500+",    label: "от 1.5 млн ₽"        },
] as const;
const BUDGET_OPTIONS_EN = [
  { value: "100-300",  label: "₽100–300k"  },
  { value: "300-700",  label: "₽300–700k"  },
  { value: "700-1500", label: "₽700k–1.5M" },
  { value: "1500+",    label: "₽1.5M+"     },
] as const;

const TIMELINE_OPTIONS_RU = [
  { value: "2-4",  label: "2–4 недели"  },
  { value: "4-8",  label: "4–8 недель"  },
  { value: "8-12", label: "8–12 недель" },
  { value: "12+",  label: "12+ недель"  },
] as const;
const TIMELINE_OPTIONS_EN = [
  { value: "2-4",  label: "2–4 weeks"  },
  { value: "4-8",  label: "4–8 weeks"  },
  { value: "8-12", label: "8–12 weeks" },
  { value: "12+",  label: "12+ weeks"  },
] as const;

const STEPS_RU = ["Бриф и консультация", "Архитектура и ТЗ", "Разработка по спринтам", "Тестирование и запуск"];
const STEPS_EN = ["Brief and consultation", "Architecture and spec", "Sprint-based development", "Testing and launch"];

const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.webp,.zip,.rar";
const MAX_FILE_BYTES  = 10 * 1024 * 1024;
const MESSAGE_MAX     = 2000;

const ORG = {
  email:     "info@onestack24.ru",
  phone:     "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
  site:      siteUrl,
};

function humanSize(bytes: number) {
  const units = ["Б", "КБ", "МБ"];
  let i = 0, v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppContact() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const KIND_OPTIONS     = isEn ? KIND_OPTIONS_EN     : KIND_OPTIONS_RU;
  const BUDGET_OPTIONS   = isEn ? BUDGET_OPTIONS_EN   : BUDGET_OPTIONS_RU;
  const TIMELINE_OPTIONS = isEn ? TIMELINE_OPTIONS_EN : TIMELINE_OPTIONS_RU;
  const STEPS            = isEn ? STEPS_EN            : STEPS_RU;

  const [form,      setForm]      = useState<FormState>(INITIAL);
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [submitErr, setSubmitErr] = useState("");
  const [isMobile,  setIsMobile]  = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const k = (e as CustomEvent<{ kind: Kind }>).detail?.kind;
      if (k) setForm(s => ({ ...s, kind: [k] }));
    };
    window.addEventListener("webapp-contact-prefill", handler);
    return () => window.removeEventListener("webapp-contact-prefill", handler);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nameId    = useId();
  const emailId   = useId();
  const phoneId   = useId();
  const companyId = useId();
  const messageId = useId();
  const statusId  = useId();
  const agreeId   = useId();
  const hpId      = useId();
  const titleId   = useId();

  const reduced = useReducedMotion();
  const { quote, resetQuote } = useQuote();
  const calcRef  = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (calcRef.current) calcRef.current.value = quote ? JSON.stringify(quote) : "";
  }, [quote]);

  const isEmailValid = useMemo(
    () => (form.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) : false),
    [form.email]
  );

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(s => ({ ...s, [key]: value }));
  }, []);

  const toggleKind = useCallback((k: Kind) => {
    setForm(s => ({
      ...s,
      kind: s.kind.includes(k) ? s.kind.filter(x => x !== k) : [...s.kind, k],
    }));
  }, []);

  const normalizePhone = (v: string) => {
    const d = v.replace(/[^\d+]/g, "");
    return d.startsWith("+") ? "+" + d.replace(/[^\d]/g, "") : d.replace(/[^\d]/g, "");
  };

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name     = isEn ? "What should we call you?" : "Как к вам обращаться?";
    if (!isEmailValid)      e.email    = isEn ? "Enter a valid email" : "Введите корректный email";
    if (!form.kind.length)  e.kind     = isEn ? "Select project type" : "Выберите тип проекта";
    if (!form.budget)       e.budget   = isEn ? "Specify your budget" : "Укажите бюджет";
    if (!form.timeline)     e.timeline = isEn ? "Specify the timeline" : "Укажите сроки";
    if (!form.agree)        e.agree    = isEn ? "Please confirm consent" : "Подтвердите согласие";
    if (!form.message.trim() || form.message.length < 10) e.message = isEn ? "Describe the project (min 10 chars)" : "Опишите проект (минимум 10 символов)";
    if (form.file && form.file.size > MAX_FILE_BYTES) e.file = isEn ? "File exceeds 10 MB" : "Файл больше 10 МБ";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, isEmailValid, isEn]);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitErr("");
    if (sending || !validate() || form.hp) return;

    const fd = new FormData();
    fd.append("subject",   "Заявка с WebApp Contact Page");
    fd.append("name",      form.name.trim());
    fd.append("email",     form.email.trim().toLowerCase());
    fd.append("phone",     form.phone.trim());
    fd.append("company",   form.company.trim());
    fd.append("kind",      JSON.stringify(form.kind));
    fd.append("budget",    form.budget);
    fd.append("timeline",  form.timeline);
    fd.append("message",   form.message.trim());
    fd.append("agree",     String(form.agree));
    fd.append("createdAt", new Date().toISOString());
    fd.append("ua",        typeof navigator !== "undefined" ? navigator.userAgent : "");
    fd.append("quote",     quote ? JSON.stringify(quote) : "");
    fd.append("source",    "webapp/contact");
    if (form.file) fd.append("file", form.file);

    try {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setSending(true);
      const res = await fetch("/api/contact", { method: "POST", body: fd, signal: controller.signal });
      if (!res.ok) {
        let reason = "";
        try { const d = await res.json(); reason = d?.error || d?.message || ""; } catch {}
        throw new Error(reason || `Ошибка ${res.status}`);
      }
      setSent(true); resetQuote(); setForm(INITIAL); setErrors({});
      const t = setTimeout(() => setSent(false), 5000);
      return () => clearTimeout(t);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setSubmitErr(err?.message || "Не удалось отправить заявку.");
    } finally {
      setSending(false);
    }
  }, [form, quote, resetQuote, sending, validate]);

  const msgLeft = MESSAGE_MAX - form.message.length;

  const jsonLd = useMemo(() => [
    { "@context": "https://schema.org", "@type": "ContactPage",
      name: "Контакты OneStack — разработка веб-приложений",
      url: `${siteUrl}/webapp#contact` },
    { "@context": "https://schema.org", "@type": "Organization",
      name: siteName, url: siteUrl, email: ORG.email, telephone: ORG.phoneHref.replace("tel:", ""),
      contactPoint: [{ "@type": "ContactPoint", contactType: "sales",
        email: ORG.email, telephone: ORG.phoneHref.replace("tel:", ""),
        areaServed: ["RU", "KZ", "BY"], availableLanguage: ["ru", "en"] }] },
  ], []);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${err ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 10, padding: "11px 14px",
    fontSize: 13, color: WHITE, caretColor: TEAL,
    outline: "none", transition: "border-color 0.2s",
  });

  return (
    <>
      <Script id="ld-webapp-contact" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="contact"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
      >
        {/* Glow */}
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute", bottom: -160, left: 0,
          width: 480, height: 480, borderRadius: "50%",
          background: TEAL, opacity: 0.06, willChange: "transform", transform: "translateZ(0)", filter: "blur(160px)",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <motion.div {...(fadeUp(0) as object)} style={{ padding: isMobile ? "80px 0 60px" : "110px 0 72px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
                {isEn ? "Discuss the project" : "Обсудить проект"}
              </span>
            </div>
            <h2 id={titleId} className={serif.className}
              style={{ margin: "0 0 16px", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}>
              <span style={{ display: "block", fontSize: "clamp(1.9rem, 3vw, 3rem)", overflowWrap: "anywhere", color: TEAL }}>
                {isEn ? "We're in touch" : "Мы на связи"}
              </span>
              <span style={{ display: "block", fontSize: "clamp(1.9rem, 3vw, 3rem)", overflowWrap: "anywhere", color: WHITE }}>
                {isEn ? "tell us about the project" : "расскажите о проекте"}
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 520 }}>
              {isEn
                ? "We'll respond within 2 hours, sign NDA, prepare an estimate and propose the optimal solution."
                : "Ответим в течение 2 часов, подпишем NDA, подготовим смету и предложим оптимальное решение."}
            </p>
          </motion.div>

          {/* ── Two-column layout ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "380px 1fr",
            gap: isMobile ? 0 : 40,
            alignItems: "start",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>

            {/* Left: info */}
            <motion.div
              {...(fadeUp(0.08) as object)}
              style={{
                borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
                paddingRight: isMobile ? 0 : 40,
                paddingBottom: 48,
              }}
            >
              {/* Contacts */}
              <div style={{ paddingTop: 36, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <FigLabel num="INFO" label={isEn ? "Contacts" : "Контакты"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <ContactRow icon={<Mail size={14} />}      label="Email"                         value={ORG.email}      href={`mailto:${ORG.email}`} />
                  <ContactRow icon={<Phone size={14} />}     label={isEn ? "Phone" : "Телефон"}    value={ORG.phone}      href={ORG.phoneHref} />
                  <ContactRow icon={<Building2 size={14} />} label={isEn ? "Website" : "Сайт"}    value="onestack24.ru"  href={ORG.site} />
                </div>
              </div>

              {/* Steps */}
              <div style={{ paddingTop: 32, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <FigLabel num="PROC" label={isEn ? "Work stages" : "Этапы работы"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {STEPS.map((s, i) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                        background: `${TEAL}18`, border: `1px solid ${TEAL}40`,
                        fontSize: 10, fontWeight: 600, color: TEAL,
                      }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: "rgba(244,250,248,0.55)" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div style={{ paddingTop: 32 }}>
                <FigLabel num="SLA" label={isEn ? "Guarantees" : "Гарантии"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(isEn
                    ? ["Fixed estimate", "Demo every sprint", "API documentation", "Post-launch support"]
                    : ["Фиксированная смета", "Демо каждый спринт", "Документация к API", "Поддержка после запуска"]
                  ).map(g => (
                    <div key={g} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: TEAL }} />
                      <span style={{ fontSize: 13, color: "rgba(244,250,248,0.5)" }}>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div {...(fadeUp(0.12) as object)} style={{ paddingTop: 36, paddingBottom: isMobile ? 80 : 110 }}>
              <form
                onSubmit={onSubmit}
                noValidate
                encType="multipart/form-data"
                aria-describedby={statusId}
                aria-busy={sending}
              >
                {/* Hidden calc payload */}
                <textarea ref={calcRef} name="calc" style={{ display: "none" }} readOnly aria-hidden="true" />
                <input type="hidden" name="subject" value="WebApp Contact Form" />

                {/* Honeypot */}
                <div style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                  <label htmlFor={hpId}>Ваш сайт</label>
                  <input id={hpId} name="company_website" autoComplete="off" tabIndex={-1}
                    onChange={e => setField("hp", e.target.value)} value={form.hp} />
                </div>

                {/* Calculator banner */}
                <AnimatePresence>
                  {mounted && quote && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        borderRadius: 10, padding: "10px 14px", marginBottom: 28,
                        background: `${TEAL}10`, border: `1px solid ${TEAL}30`,
                      }}
                    >
                      <Calculator size={14} style={{ color: TEAL, flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: 12, color: "rgba(244,250,248,0.65)" }}>
                        {isEn ? "Calculator data attached to this request" : "Данные из калькулятора прикреплены к заявке"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 01 · Contact details */}
                <FormSection label={isEn ? "Contact details" : "Контактные данные"} num="01">
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                    <FormField id={nameId} label={isEn ? "Your name *" : "Как вас зовут *"}
                      placeholder={isEn ? "John Smith" : "Иван Петров"}
                      value={form.name} onChange={v => setField("name", v)}
                      error={errors.name} icon={<User size={13} />} inputStyle={inputStyle} />
                    <FormField id={emailId} label="Email *"
                      placeholder="you@company.com" type="email"
                      value={form.email} onChange={v => setField("email", v)}
                      error={errors.email} icon={<Mail size={13} />} inputStyle={inputStyle} />
                    <FormField id={phoneId} label={isEn ? "Phone" : "Телефон"}
                      placeholder="+7 (___) ___-__-__"
                      value={form.phone} onChange={v => setField("phone", normalizePhone(v))}
                      icon={<Phone size={13} />} inputStyle={inputStyle} />
                    <FormField id={companyId} label={isEn ? "Company" : "Компания"}
                      placeholder={isEn ? "Acme Corp" : "ООО «Пример»"}
                      value={form.company} onChange={v => setField("company", v)}
                      icon={<Building2 size={13} />} inputStyle={inputStyle} />
                  </div>
                </FormSection>

                {/* 02 · Project type */}
                <FormSection label={isEn ? "Project type *" : "Тип приложения *"} num="02" hint={isEn ? "multiple" : "можно несколько"}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {KIND_OPTIONS.map(([k, l]) => (
                      <ContactChip key={k} active={form.kind.includes(k)} onClick={() => toggleKind(k)} label={l} />
                    ))}
                  </div>
                  {errors.kind && <ErrText>{errors.kind}</ErrText>}
                </FormSection>

                {/* 03 · Budget + Timeline */}
                <FormSection label={isEn ? "Budget & timeline" : "Бюджет и сроки"} num="03">
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
                    <div>
                      <SubLabel label={isEn ? "Budget *" : "Бюджет *"} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
                        {BUDGET_OPTIONS.map(o => (
                          <ContactChip key={o.value} active={form.budget === o.value}
                            onClick={() => setField("budget", o.value as Budget)} label={o.label} />
                        ))}
                      </div>
                      {errors.budget && <ErrText>{errors.budget}</ErrText>}
                    </div>
                    <div>
                      <SubLabel label={isEn ? "Timeline *" : "Сроки *"} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
                        {TIMELINE_OPTIONS.map(o => (
                          <ContactChip key={o.value} active={form.timeline === o.value}
                            onClick={() => setField("timeline", o.value as Timeline)} label={o.label} />
                        ))}
                      </div>
                      {errors.timeline && <ErrText>{errors.timeline}</ErrText>}
                    </div>
                  </div>
                </FormSection>

                {/* 04 · Message */}
                <FormSection label={isEn ? "Project description *" : "Описание проекта *"} num="04">
                  <div style={{ position: "relative" }}>
                    <textarea
                      id={messageId} name="message"
                      value={form.message}
                      onChange={e => setField("message", e.target.value.slice(0, MESSAGE_MAX))}
                      rows={6} maxLength={MESSAGE_MAX}
                      placeholder={isEn
                        ? "Key features, audience, integrations, special requirements..."
                        : "Основные функции, аудитория, интеграции, особые требования..."}
                      style={{
                        ...inputStyle(errors.message),
                        resize: "none", lineHeight: 1.6, paddingBottom: 28,
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = `${TEAL}60`; }}
                      onBlur={e => { e.currentTarget.style.borderColor = errors.message ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)"; }}
                    />
                    <span style={{
                      position: "absolute", bottom: 10, right: 12, fontSize: 10,
                      color: msgLeft < 100 ? "#fbbf24" : "rgba(244,250,248,0.25)",
                    }}>{msgLeft}</span>
                  </div>
                  {errors.message && <ErrText>{errors.message}</ErrText>}
                </FormSection>

                {/* 05 · File */}
                <FormSection label={isEn ? "Additional materials" : "Дополнительные материалы"} num="05" hint={isEn ? "optional" : "необязательно"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label style={{
                      flex: 1, display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                      borderRadius: 10, padding: "11px 14px",
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                      transition: "border-color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${TEAL}40`}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"}
                    >
                      <Paperclip size={14} style={{ color: "rgba(244,250,248,0.3)", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "rgba(244,250,248,0.45)" }}>
                        {form.file ? `${form.file.name} (${humanSize(form.file.size)})` : (isEn ? "Attach file up to 10 MB" : "Прикрепить файл до 10 МБ")}
                      </span>
                      <input type="file" style={{ display: "none" }} accept={ACCEPTED_FILE_TYPES}
                        onChange={e => {
                          const f = e.target.files?.[0] || null;
                          if (f && f.size > MAX_FILE_BYTES) { setErrors(s => ({ ...s, file: isEn ? "File exceeds 10 MB" : "Файл больше 10 МБ" })); return; }
                          setErrors(s => ({ ...s, file: "" })); setField("file", f);
                        }} />
                    </label>
                    {form.file && (
                      <button type="button" onClick={() => setField("file", null)}
                        aria-label={isEn ? "Remove file" : "Удалить файл"}
                        style={{
                          width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(244,250,248,0.4)", cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(244,250,248,0.4)"; }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {errors.file && <ErrText>{errors.file}</ErrText>}
                </FormSection>

                {/* Agreement */}
                <div style={{ marginBottom: 24, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <label htmlFor={agreeId} style={{ display: "flex", cursor: "pointer", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ position: "relative", marginTop: 2, flexShrink: 0 }}>
                      <input id={agreeId} type="checkbox" checked={form.agree}
                        onChange={e => setField("agree", e.target.checked)}
                        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} required />
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                        background: form.agree ? TEAL : "transparent",
                        border: `1.5px solid ${form.agree ? TEAL : "rgba(255,255,255,0.25)"}`,
                        transition: "all 0.2s",
                      }}>
                        {form.agree && (
                          <svg viewBox="0 0 12 10" fill="none" style={{ width: 11, height: 11 }}>
                            <path d="M1 5l3.5 3.5L11 1" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(244,250,248,0.45)" }}>
                      {isEn
                        ? "I consent to the processing of personal data and to receiving a commercial proposal"
                        : "Согласен на обработку персональных данных в соответствии с ФЗ № 152 и получение коммерческого предложения"}
                    </span>
                  </label>
                  {errors.agree && <ErrText>{errors.agree}</ErrText>}
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={sending}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    borderRadius: 99, padding: "14px 24px", border: "none", cursor: sending ? "not-allowed" : "pointer",
                    background: TEAL, color: BG, fontSize: 14, fontWeight: 600,
                    opacity: sending ? 0.6 : 1, transition: "opacity 0.2s",
                  }}
                >
                  {sending
                    ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}><Clock3 size={15} /></motion.span> {isEn ? "Sending..." : "Отправляем..."}</>
                    : <><MessageCircle size={15} /> {isEn ? "Submit request" : "Отправить заявку"} <ArrowRight size={14} /></>
                  }
                </button>

                {/* Status messages */}
                <AnimatePresence>
                  {submitErr && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        marginTop: 12, borderRadius: 10, padding: "12px 14px",
                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                      }}>
                      <X size={14} style={{ color: "#f87171", flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: 13, color: "#f87171" }}>{submitErr}</p>
                    </motion.div>
                  )}
                  {sent && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        marginTop: 12, borderRadius: 10, padding: "12px 14px",
                        background: `${TEAL}10`, border: `1px solid ${TEAL}30`,
                      }}>
                      <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: TEAL }}>{isEn ? "Request sent!" : "Заявка отправлена!"}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "rgba(244,250,248,0.45)" }}>{isEn ? "We'll contact you within 2 hours" : "Свяжемся с вами в течение 2 часов"}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div id={statusId} style={{ position: "absolute", left: -9999 }} aria-live="polite" aria-atomic="true" />
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── UI helpers ──────────────────────────────────────────────────────────── */
function FigLabel({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL, opacity: 0.7 }}>{num}</span>
      <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.3)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function SubLabel({ label }: { label: string }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.3)" }}>
      {label}
    </div>
  );
}

function FormSection({ num, label, hint, children }: { num: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, paddingBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL, opacity: 0.7 }}>{num}</span>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.3)", fontWeight: 500 }}>{label}</span>
        {hint && <span style={{ fontSize: 10, color: "rgba(244,250,248,0.2)" }}>· {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        color: "rgba(244,250,248,0.35)",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,250,248,0.28)", marginBottom: 2 }}>{label}</div>
        <a href={href} style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,250,248,0.7)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = TEAL}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(244,250,248,0.7)"}
        >{value}</a>
      </div>
    </div>
  );
}

function FormField({ id, label, placeholder, value, onChange, type = "text", error, icon, inputStyle }: {
  id: string; label: string; placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; error?: string; icon?: React.ReactNode; inputStyle: (e?: string) => React.CSSProperties;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.3)", marginBottom: 8 }}>{label}</div>
      <div style={{ position: "relative" }}>
        {icon && (
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(244,250,248,0.25)" }}>
            {icon}
          </div>
        )}
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} autoComplete="off"
          style={{ ...inputStyle(error), paddingLeft: icon ? 34 : 14 }}
          onFocus={e => { e.currentTarget.style.borderColor = `${TEAL}60`; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)"; }}
        />
      </div>
      {error && <ErrText>{error}</ErrText>}
    </div>
  );
}

function ContactChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      style={{
        textAlign: "left", borderRadius: 8, padding: "8px 10px", cursor: "pointer",
        border: "none", transition: "all 0.15s", fontSize: 11, fontWeight: 500,
        background: active ? `${TEAL}15` : "rgba(255,255,255,0.02)",
        outline: active ? `1px solid ${TEAL}` : "1px solid rgba(255,255,255,0.07)",
        color: active ? WHITE : "rgba(244,250,248,0.5)",
      }}
    >{label}</button>
  );
}

function ErrText({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 11, color: "#f87171" }}>
      <X size={12} style={{ flexShrink: 0 }} />
      {children}
    </motion.div>
  );
}
