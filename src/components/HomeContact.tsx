"use client";
import { serif } from "@/lib/fonts";

import { useCallback, useEffect, useId, useMemo, useRef, useState, memo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import {
  Mail, Phone, Building2, Paperclip, CheckCircle2, X,
  ArrowRight, MessageCircle, Clock3,
} from "lucide-react";
import { siteName, siteUrl } from "@/app/seo.config";
import { useQuote } from "@/app/context/QuoteContext";
import { useI18n } from "@/i18n/I18nProvider";


const BG   = "#07100e";
const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Kind     = "site" | "webapp" | "mobile" | "support" | "uiux" | "branding" | "crm" | "saas";
type Budget   = "100-300" | "300-700" | "700-1500" | "1500+";
type Timeline = "2-4" | "4-8" | "8-12" | "12+";
type FormState = {
  name: string; email: string; phone: string; company: string;
  kind: Kind[]; budget: Budget | ""; timeline: Timeline | "";
  message: string; agree: boolean; file: File | null; hp: string;
};

const INITIAL: FormState = {
  name: "", email: "", phone: "", company: "",
  kind: [], budget: "", timeline: "", message: "",
  agree: false, file: null, hp: "",
};

const KIND_KEYS: Kind[] = ["site", "webapp", "mobile", "crm", "saas", "uiux", "branding", "support"];
const BUDGET_KEYS: Budget[] = ["100-300", "300-700", "700-1500", "1500+"];
const TIMELINE_KEYS: Timeline[] = ["2-4", "4-8", "8-12", "12+"];

/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY = {
  ru: {
    eyebrow: "Обратная связь",
    titleLine1: "Обсудим",
    titleLine2: "проект",
    description: "Отвечаем в течение 2 часов в рабочее время. Подпишем NDA, сделаем экспресс-оценку и предложим оптимальное решение.",
    contactLabels: { email: "Email", phone: "Телефон", site: "Сайт" },
    howWeWork: "Как мы работаем",
    steps: ["Короткий бриф и созвон", "Фиксированная смета и план", "Старт спринта (1–2 недели)", "Демо каждые 1–2 недели"],
    calcBannerBold: "Данные из калькулятора загружены.",
    calcBannerRest: "Проверьте и дополните детали при необходимости.",
    close: "Закрыть",
    step1: "Контактные данные",
    nameLabel: "Как вас зовут *",
    namePh: "Иван Петров",
    emailPh: "you@company.com",
    phoneLabel: "Телефон",
    phonePh: "+7 (___) ___-__-__",
    companyLabel: "Компания",
    companyPh: "ООО «Пример»",
    step2: "Тип проекта *",
    multiHint: "можно несколько",
    kind: {
      site: "Сайт", webapp: "Веб-приложение", mobile: "Мобильное приложение",
      crm: "CRM/ERP система", saas: "SaaS платформа", uiux: "UI/UX дизайн",
      branding: "Брендинг", support: "Поддержка",
    },
    step3: "Бюджет и сроки",
    budgetLabel: "Бюджет *",
    budget: { "100-300": "100–300 тыс ₽", "300-700": "300–700 тыс ₽", "700-1500": "700 тыс – 1.5 млн", "1500+": "1.5 млн ₽ +" },
    timelineLabel: "Сроки *",
    timeline: { "2-4": "2–4 недели", "4-8": "4–8 недель", "8-12": "8–12 недель", "12+": "12+ недель" },
    step4: "Описание проекта *",
    messagePh: "Цели, функции, аудитория, интеграции...",
    attachFile: "Прикрепить файл до 10 МБ (необязательно)",
    agree: "Согласен на обработку персональных данных в соответствии с ФЗ-152",
    sending: "Отправляем...",
    submit: "Отправить заявку",
    sentTitle: "Заявка отправлена!",
    sentSub: "Свяжемся в ближайшее время",
    errName: "Укажите имя",
    errEmail: "Email или телефон обязателен",
    errKind: "Выберите тип проекта",
    errBudget: "Укажите бюджет",
    errTimeline: "Укажите сроки",
    errAgree: "Подтвердите согласие",
    errFile: "Файл больше 10 МБ",
    errMessage: "Минимум 10 символов",
    errGeneric: "Не удалось отправить заявку.",
    errStatus: (n: number) => `Ошибка ${n}`,
  },
  en: {
    eyebrow: "Get in touch",
    titleLine1: "Let's discuss",
    titleLine2: "your project",
    description: "We reply within 2 business hours. We'll sign an NDA, give you a quick estimate and suggest the best approach.",
    contactLabels: { email: "Email", phone: "Phone", site: "Website" },
    howWeWork: "How we work",
    steps: ["Short brief and a call", "Fixed quote and a plan", "Sprint kickoff (1–2 weeks)", "Demo every 1–2 weeks"],
    calcBannerBold: "Calculator data loaded.",
    calcBannerRest: "Review and refine the details if needed.",
    close: "Close",
    step1: "Contact details",
    nameLabel: "Your name *",
    namePh: "John Smith",
    emailPh: "you@company.com",
    phoneLabel: "Phone",
    phonePh: "+1 (___) ___-____",
    companyLabel: "Company",
    companyPh: "Acme Inc.",
    step2: "Project type *",
    multiHint: "multiple allowed",
    kind: {
      site: "Website", webapp: "Web app", mobile: "Mobile app",
      crm: "CRM/ERP system", saas: "SaaS platform", uiux: "UI/UX design",
      branding: "Branding", support: "Support",
    },
    step3: "Budget & timeline",
    budgetLabel: "Budget *",
    budget: { "100-300": "$1K–3K", "300-700": "$3K–7K", "700-1500": "$7K–15K", "1500+": "$15K+" },
    timelineLabel: "Timeline *",
    timeline: { "2-4": "2–4 weeks", "4-8": "4–8 weeks", "8-12": "8–12 weeks", "12+": "12+ weeks" },
    step4: "Project description *",
    messagePh: "Goals, features, audience, integrations...",
    attachFile: "Attach a file up to 10 MB (optional)",
    agree: "I agree to the processing of my personal data",
    sending: "Sending...",
    submit: "Send request",
    sentTitle: "Request sent!",
    sentSub: "We'll be in touch shortly",
    errName: "Please enter your name",
    errEmail: "Email or phone is required",
    errKind: "Select a project type",
    errBudget: "Select a budget",
    errTimeline: "Select a timeline",
    errAgree: "Please confirm consent",
    errFile: "File exceeds 10 MB",
    errMessage: "10 characters minimum",
    errGeneric: "Could not send the request.",
    errStatus: (n: number) => `Error ${n}`,
  },
} as const;

const ACCEPTED = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.webp,.zip,.rar";
const MAX_FILE  = 10 * 1024 * 1024;
const MSG_MAX   = 2000;

const ORG = {
  email:     "info@onestack24.ru",
  phone:     "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
  site:      siteUrl,
};

/* ─── Shared micro-styles ────────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border:     "1px solid rgba(255,255,255,0.1)",
  color:      WHITE,
};
const inputErrBorder = "1px solid rgba(239,68,68,0.5)";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeContact() {
  const { locale } = useI18n();
  const lang = locale === "ru" ? "ru" : "en";
  const c = COPY[lang];
  const [form,      setForm]      = useState<FormState>(INITIAL);
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [submitErr, setSubmitErr] = useState("");
  const reduced                   = useReducedMotion();
  const { quote }                 = useQuote();
  const [isMobile, setIsMobile]   = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const titleId  = useId();
  const hpId     = useId();
  const agreeId  = useId();
  const statusId = useId();

  const [calcBanner, setCalcBanner] = useState(false);

  // Pre-fill from URL params (legacy)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const types = (new URLSearchParams(window.location.search).get("types") || "")
      .split(",").map(s => s.trim()).filter(Boolean) as Kind[];
    if (types.length) setForm(f => ({ ...f, kind: types }));
  }, []);

  // Pre-fill from calculator quote
  useEffect(() => {
    if (!quote || quote.source !== "home-calculator") return;
    const kinds  = (quote._contactKinds as Kind[] | undefined) ?? [];
    const budget = (quote._contactBudget as Budget | undefined) ?? "";
    const tl     = (quote._contactTimeline as Timeline | undefined) ?? "";
    const msg    = (quote._contactMessage as string | undefined) ?? "";
    setForm(f => ({
      ...f,
      kind:     kinds.length ? kinds : f.kind,
      budget:   budget || f.budget,
      timeline: tl || f.timeline,
      message:  f.message ? f.message : msg,
    }));
    setCalcBanner(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote?.source, quote?.createdAt]);

  const isEmailValid = useMemo(
    () => form.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) : false,
    [form.email],
  );

  const set = useCallback(
    (key: keyof FormState, val: FormState[keyof FormState]) =>
      setForm(s => ({ ...s, [key]: val } as FormState)),
    []
  );

  const toggleKind = useCallback((k: Kind) =>
    setForm(s => ({ ...s, kind: s.kind.includes(k) ? s.kind.filter(x => x !== k) : [...s.kind, k] })), []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                          e.name     = c.errName;
    if (!isEmailValid && !form.phone.trim())         e.email    = c.errEmail;
    if (!form.kind.length)                           e.kind     = c.errKind;
    if (!form.budget)                                e.budget   = c.errBudget;
    if (!form.timeline)                              e.timeline = c.errTimeline;
    if (!form.agree)                                 e.agree    = c.errAgree;
    if (form.file && form.file.size > MAX_FILE)      e.file     = c.errFile;
    if (!form.message.trim() || form.message.length < 10) e.message = c.errMessage;
    setErrors(e);
    return !Object.keys(e).length;
  }, [form, isEmailValid, c]);

  const abortRef = useRef<AbortController | null>(null);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitErr("");
    if (sending || !validate() || form.hp) return;
    const fd = new FormData();
    fd.append("subject",   lang === "ru" ? "Заявка с Home Contact Page" : "Lead from Home Contact Page");
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
    fd.append("source",    "home/contact");
    fd.append("quote",     quote ? JSON.stringify(quote) : "");
    if (form.file) fd.append("file", form.file);
    try {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setSending(true);
      const res = await fetch("/api/contact", { method: "POST", body: fd, signal: ctrl.signal });
      if (!res.ok) {
        let msg = "";
        try { const d = await res.json(); msg = d?.error || d?.message || ""; } catch {}
        throw new Error(msg || c.errStatus(res.status));
      }
      setSent(true); setForm(INITIAL); setErrors({});
      try {
        (window as any).gtag?.("event", "generate_lead", { form_id: "home_contact", value: 1, currency: "RUB" });
        (window as any).ym?.(105578590, "reachGoal", "contact_submit");
      } catch {}
      const t = setTimeout(() => setSent(false), 5000);
      return () => clearTimeout(t);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setSubmitErr(err?.message || c.errGeneric);
    } finally {
      setSending(false);
    }
  }, [form, sending, validate, quote, c]);

  const jsonLd = useMemo(() => [
    { "@context": "https://schema.org", "@type": "ContactPage",   name: `${lang === "ru" ? "Контакты" : "Contact"} | ${siteName}`, url: `${ORG.site}#contact` },
    { "@context": "https://schema.org", "@type": "Organization",  name: siteName, url: ORG.site, email: ORG.email, telephone: ORG.phoneHref.replace("tel:", "") },
  ], [lang]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  /* shared chip style */
  const chipStyle = (active: boolean): React.CSSProperties => active
    ? { background: "rgba(45,212,191,0.1)", border: `1px solid ${TEAL}`, color: TEAL }
    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(244,250,248,0.5)" };

  return (
    <>
      <Script id="ld-home-contact" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section id="contact" aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>

        <div aria-hidden style={{ pointerEvents: "none", position: "absolute", inset: 0, opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "180px 180px" }} />
        <div aria-hidden style={{ pointerEvents: "none", position: "absolute", top: "-10%", left: "-10%", width: 700, height: 700, borderRadius: "50%", willChange: "transform", transform: "translateZ(0)", filter: "blur(280px)", background: TEAL, opacity: 0.055 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: isMobile ? "60px 20px 72px" : "80px 40px 110px" }}>

          {/* 2-col layout: info | form */}
          {/* Колонка заголовка фиксирована на 440px, поэтому ниже ~1100px форме
              оставалось слишком мало места (на 768px — около 180px). Складываем
              в одну колонку заранее: правило на CSS, без участия JS, поэтому
              работает и до гидратации. */}
          <div className="contact-split" style={{ display: "grid", gap: isMobile ? 40 : 64, alignItems: "start" }}>

            {/* ── LEFT ── */}
            <div>
              <motion.div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }} {...(fadeUp(0) as object)}>
                <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
                  {c.eyebrow}
                </span>
              </motion.div>

              <div style={{ marginBottom: 28 }}>
                {[c.titleLine1, c.titleLine2].map((text, i) => (
                  <motion.div key={i}
                    className={serif.className}
                    style={i === 0
                      ? { display: "block", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.04em", fontSize: "clamp(2.2rem, 4vw, 4.6rem)", overflowWrap: "anywhere", color: TEAL }
                      : { display: "block", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.04em", fontSize: "clamp(2.2rem, 4vw, 4.6rem)", overflowWrap: "anywhere", color: WHITE }}
                    initial={reduced ? undefined : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.07 }}>
                    {text}
                  </motion.div>
                ))}
              </div>

              <motion.p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 36, color: "rgba(244,250,248,0.45)" }} {...(fadeUp(0.2) as object)}>
                {c.description}
              </motion.p>

              <motion.div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }} {...(fadeUp(0.25) as object)}>
                {[
                  { icon: Mail,      label: c.contactLabels.email, val: ORG.email,       href: `mailto:${ORG.email}` },
                  { icon: Phone,     label: c.contactLabels.phone, val: ORG.phone,       href: ORG.phoneHref          },
                  { icon: Building2, label: c.contactLabels.site,  val: "onestack24.ru", href: ORG.site               },
                ].map(({ icon: Icon, label, val, href }) => (
                  <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.querySelector("p:last-child") as HTMLElement)!.style.opacity = "0.7"}
                    onMouseLeave={e => (e.currentTarget.querySelector("p:last-child") as HTMLElement)!.style.opacity = "1"}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.18)" }}>
                      <Icon size={14} style={{ color: TEAL }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,250,248,0.25)", marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: WHITE, transition: "opacity 0.2s" }}>{val}</p>
                    </div>
                  </a>
                ))}
              </motion.div>

              <motion.div style={{ borderRadius: 14, padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} {...(fadeUp(0.3) as object)}>
                <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, color: "rgba(244,250,248,0.3)" }}>
                  {c.howWeWork}
                </p>
                {c.steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", width: 20, flexShrink: 0, color: TEAL }}>0{i+1}</span>
                    <span style={{ fontSize: 13, color: "rgba(244,250,248,0.55)" }}>{s}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: form ── */}
            <motion.div {...(fadeUp(0.1) as object)}>
              {/* Calculator pre-fill banner */}
              <AnimatePresence>
                {calcBanner && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, borderRadius: 12, padding: "12px 16px", marginBottom: 16, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={{ color: TEAL, flexShrink: 0, fontSize: 16 }}>✓</span>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(244,250,248,0.75)" }}>
                        <span style={{ fontWeight: 600, color: TEAL }}>{c.calcBannerBold}</span>
                        {" "}{c.calcBannerRest}
                      </p>
                    </div>
                    <button type="button" onClick={() => setCalcBanner(false)}
                      style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "rgba(244,250,248,0.3)", padding: 0 }}
                      aria-label={c.close}>
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={onSubmit} noValidate encType="multipart/form-data"
                aria-describedby={statusId} aria-busy={sending} style={{ display: "flex", flexDirection: "column" }}>

                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
                  <input name="company_website" autoComplete="off" tabIndex={-1}
                    onChange={e => set("hp", e.target.value)} value={form.hp} />
                </div>

                {/* 01 · Contact details */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, paddingBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(244,250,248,0.25)" }}>01</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(244,250,248,0.35)" }}>{c.step1}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <Inp label={c.nameLabel} placeholder={c.namePh} value={form.name}
                      onChange={v => set("name", v)} name="name" type="text" error={errors.name} />
                    <Inp label={c.contactLabels.email} placeholder={c.emailPh} value={form.email}
                      onChange={v => set("email", v)} name="email" type="email" error={errors.email} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                    <Inp label={c.phoneLabel} placeholder={c.phonePh} value={form.phone}
                      onChange={v => set("phone", v.replace(/[^\d+]/g, ""))} name="tel" type="tel" />
                    <Inp label={c.companyLabel} placeholder={c.companyPh} value={form.company}
                      onChange={v => set("company", v)} name="organization" type="text" />
                  </div>
                </div>

                {/* 02 · Project type */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, paddingBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(244,250,248,0.25)" }}>02</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(244,250,248,0.35)" }}>{c.step2}</span>
                    <span style={{ fontSize: 10, color: "rgba(244,250,248,0.25)", letterSpacing: 0, textTransform: "none" }}>{c.multiHint}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                    {KIND_KEYS.map(k => (
                      <button key={k} type="button" onClick={() => toggleKind(k)}
                        style={{ ...chipStyle(form.kind.includes(k)), padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s", textAlign: "center", minWidth: 0, overflowWrap: "anywhere" }}>
                        {c.kind[k]}
                      </button>
                    ))}
                  </div>
                  {errors.kind && <Err>{errors.kind}</Err>}
                </div>

                {/* 03 · Budget & timeline */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, paddingBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(244,250,248,0.25)" }}>03</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(244,250,248,0.35)" }}>{c.step3}</span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Label>{c.budgetLabel}</Label>
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                      {BUDGET_KEYS.map(k => (
                        <button key={k} type="button" onClick={() => set("budget", k)}
                          style={{ ...chipStyle(form.budget === k), padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s", textAlign: "center", minWidth: 0, overflowWrap: "anywhere" }}>
                          {c.budget[k]}
                        </button>
                      ))}
                    </div>
                    {errors.budget && <Err>{errors.budget}</Err>}
                  </div>
                  <div>
                    <Label>{c.timelineLabel}</Label>
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                      {TIMELINE_KEYS.map(k => (
                        <button key={k} type="button" onClick={() => set("timeline", k)}
                          style={{ ...chipStyle(form.timeline === k), padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s", textAlign: "center", minWidth: 0, overflowWrap: "anywhere" }}>
                          {c.timeline[k]}
                        </button>
                      ))}
                    </div>
                    {errors.timeline && <Err>{errors.timeline}</Err>}
                  </div>
                </div>

                {/* 04 · Description */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, paddingBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(244,250,248,0.25)" }}>04</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(244,250,248,0.35)" }}>{c.step4}</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <textarea rows={5} value={form.message} maxLength={MSG_MAX}
                      onChange={e => set("message", e.target.value.slice(0, MSG_MAX))}
                      style={{ width: "100%", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", ...inputBase, border: errors.message ? inputErrBorder : inputBase.border }}
                      placeholder={c.messagePh} />
                    <span style={{ position: "absolute", bottom: 12, right: 12, fontSize: 10, color: MSG_MAX - form.message.length < 100 ? "#fbbf24" : "rgba(244,250,248,0.2)" }}>
                      {MSG_MAX - form.message.length}
                    </span>
                  </div>
                  {errors.message && <Err>{errors.message}</Err>}

                  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderRadius: 12, padding: "12px 16px", marginTop: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <Paperclip size={15} style={{ color: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "rgba(244,250,248,0.4)" }}>
                      {form.file ? `${form.file.name} (${humanSize(form.file.size, lang)})` : c.attachFile}
                    </span>
                    {form.file && (
                      <button type="button" onClick={e => { e.preventDefault(); set("file", null); }}
                        style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "rgba(244,250,248,0.3)", padding: 0 }}>
                        <X size={14} />
                      </button>
                    )}
                    <input type="file" style={{ display: "none" }} accept={ACCEPTED}
                      onChange={e => {
                        const f = e.target.files?.[0] || null;
                        if (f && f.size > MAX_FILE) { setErrors(s => ({ ...s, file: c.errFile })); return; }
                        setErrors(s => ({ ...s, file: "" }));
                        set("file", f);
                      }} />
                  </label>
                  {errors.file && <Err>{errors.file}</Err>}

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 12 }}>
                    <input id={agreeId} type="checkbox" checked={form.agree}
                      onChange={e => set("agree", e.target.checked)}
                      style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, cursor: "pointer", accentColor: TEAL }} />
                    <label htmlFor={agreeId} style={{ fontSize: 12, lineHeight: 1.6, cursor: "pointer", color: "rgba(244,250,248,0.4)" }}>
                      {c.agree}
                    </label>
                  </div>
                  {errors.agree && <Err>{errors.agree}</Err>}
                </div>{/* end section 04 */}

                <button type="submit" disabled={sending}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 24px", borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: sending ? "not-allowed" : "pointer", border: "none", opacity: sending ? 0.6 : 1, background: TEAL, color: BG, transition: "opacity 0.2s" }}>
                  {sending
                    ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Clock3 size={15} /></motion.div> {c.sending}</>
                    : <><MessageCircle size={15} /> {c.submit} <ArrowRight size={15} /></>
                  }
                </button>

                <AnimatePresence>
                  {submitErr && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 12, padding: "12px 16px", fontSize: 13, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                      <X size={15} style={{ flexShrink: 0 }} />{submitErr}
                    </motion.div>
                  )}
                  {sent && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 12, padding: "12px 16px", fontSize: 13, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", color: TEAL }}>
                      <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: 2 }}>{c.sentTitle}</p>
                        <p style={{ fontSize: 11, opacity: 0.7 }}>{c.sentSub}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div id={statusId} style={{ position: "absolute", left: "-9999px" }} aria-live="polite" aria-atomic />
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Micro components ───────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, marginBottom: 4, color: "rgba(244,250,248,0.35)" }}>
      {children}
    </p>
  );
}

function Err({ children }: { children: React.ReactNode }) {
  return <p style={{ marginTop: 4, fontSize: 12, color: "#fca5a5" }}>{children}</p>;
}

const Inp = memo(function Inp({ label, placeholder, value, onChange, name, type, error }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; name: string; type: string; error?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input name={name} type={type} value={value} placeholder={placeholder} autoComplete="off"
        onChange={e => onChange(e.target.value)}
        style={{
          marginTop: 6, width: "100%", borderRadius: 10, padding: "12px 16px", fontSize: 13,
          outline: "none", boxSizing: "border-box",
          background: "rgba(255,255,255,0.04)",
          border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
          color: "#f4faf8",
        }} />
      {error && <p style={{ marginTop: 4, fontSize: 12, color: "#fca5a5" }}>{error}</p>}
    </div>
  );
});

function humanSize(bytes: number, lang: "ru" | "en" = "ru") {
  const u = lang === "ru" ? ["Б","КБ","МБ","ГБ"] : ["B","KB","MB","GB"];
  let i = 0, v = bytes;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}
