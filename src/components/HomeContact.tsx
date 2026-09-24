"use client";
import { serif } from "@/lib/fonts";

import { useCallback, useEffect, useId, useMemo, useRef, useState, memo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ArrowUpRight } from "lucide-react";
import { siteName, siteUrl } from "@/app/seo.config";
import { useQuote } from "@/app/context/QuoteContext";
import { useI18n } from "@/i18n/I18nProvider";


const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";

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


/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY = {
  ru: {
    eyebrow: "04 / Обратная связь",
    titleLine1: "Обсудим",
    titleLine2: "проект",
    description: "Отвечаем в течение 2 часов в рабочее время. Подпишем NDA, сделаем экспресс-оценку и предложим оптимальное решение.",
    contactLabels: { email: "Email", phone: "Телефон", site: "Сайт" },
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
    budget: { "100-300": "100–300\u00a0тыс\u00a0₽", "300-700": "300–700\u00a0тыс\u00a0₽", "700-1500": "700\u00a0тыс\u00a0– 1.5\u00a0млн", "1500+": "1.5\u00a0млн\u00a0₽\u00a0+" },
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
    eyebrow: "04 / Get in touch",
    titleLine1: "Let's discuss",
    titleLine2: "your project",
    description: "We reply within 2 business hours. We'll sign an NDA, give you a quick estimate and suggest the best approach.",
    contactLabels: { email: "Email", phone: "Phone", site: "Website" },
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

const MSG_MAX   = 2000;

const ORG = {
  email:     "info@onestack24.ru",
  phone:     "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
  site:      siteUrl,
};

/* ─── Shared micro-styles ────────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  background: "#ffffff04",
  border:     "1px solid #ffffff24",
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

  const titleId  = useId();
  const agreeId  = useId();
  const messageId = useId();
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


  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                          e.name     = c.errName;
    if (!isEmailValid && !form.phone.trim())         e.email    = c.errEmail;
    if (!form.agree)                                 e.agree    = c.errAgree;
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


  return (
    <>
      <script id="ld-home-contact" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section id="contact" aria-labelledby={titleId}
        style={{ background: "transparent", position: "relative", overflow: "hidden" }}>

        <div className="px-5 md:px-10" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>

          <div className="contact-split pb-[72px] md:pb-[110px]" style={{ display: "grid", gap: "clamp(40px, 8vw, 120px)", alignItems: "start", paddingTop: "clamp(72px,10svh,110px)" }}>

            {/* ── LEFT — same treatment as the service pages' contact block ── */}
            <motion.div {...(fadeUp(0) as object)}>
              <p className="service-eyebrow">{c.eyebrow}</p>
              <h2 id={titleId} className={`${serif.className} service-contact__title`}>
                {c.titleLine1} {c.titleLine2}
              </h2>
              <p className="service-contact__description">{c.description}</p>
              <div className="service-contact__links">
                <a href={`mailto:${ORG.email}`}>{ORG.email}<ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href={ORG.phoneHref}>{ORG.phone}<ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="https://t.me/onestack_assistant_bot" target="_blank" rel="noreferrer">Telegram<ArrowUpRight size={18} aria-hidden="true" /></a>
              </div>
            </motion.div>

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
                      <span style={{ color: TEAL, flexShrink: 0, fontSize: 20 }}>✓</span>
                      <p style={{ fontSize: 16, lineHeight: 1.5, color: "rgba(244,250,248,0.75)" }}>
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

                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
                  <Inp label={c.nameLabel} placeholder={c.namePh} value={form.name}
                    onChange={v => set("name", v)} name="name" type="text" autoComplete="name" error={errors.name} />
                  <Inp label={c.contactLabels.email} placeholder={c.emailPh} value={form.email}
                    onChange={v => set("email", v)} name="email" type="email" autoComplete="email" error={errors.email} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <Inp label={c.phoneLabel} placeholder={c.phonePh} value={form.phone}
                    onChange={v => set("phone", v.replace(/[^\d+]/g, ""))} name="tel" type="tel" autoComplete="tel" />
                </div>

                <div style={{ marginTop: 16 }}>
                  <label htmlFor={messageId} style={{ display: "block", fontSize: 15, marginBottom: 8, color: "#c7d6d1" }}>{c.step4}</label>
                  <textarea id={messageId} rows={4} value={form.message} maxLength={MSG_MAX}
                    onChange={e => set("message", e.target.value.slice(0, MSG_MAX))}
                    style={{ width: "100%", borderRadius: 12, padding: "14px 16px", fontSize: 16, outline: "none", resize: "vertical", boxSizing: "border-box", ...inputBase, border: errors.message ? inputErrBorder : inputBase.border }}
                    placeholder={c.messagePh} />
                  {errors.message && <Err>{errors.message}</Err>}
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 20 }}>
                  <input id={agreeId} type="checkbox" checked={form.agree}
                    onChange={e => set("agree", e.target.checked)}
                    style={{ marginTop: 4, width: 18, height: 18, flexShrink: 0, cursor: "pointer", accentColor: TEAL }} />
                  <label htmlFor={agreeId} style={{ fontSize: 15, lineHeight: 1.7, cursor: "pointer", color: "#b7c9c3" }}>
                    {c.agree}
                  </label>
                </div>
                {errors.agree && <Err>{errors.agree}</Err>}

                <button type="submit" disabled={sending} className="service-button service-button--primary" style={{ width: "100%", marginTop: 8 }}>
                  {sending ? c.sending : c.submit}
                  {!sending && <ArrowUpRight size={18} aria-hidden="true" />}
                </button>

                <AnimatePresence>
                  {submitErr && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 12, padding: "12px 16px", fontSize: 17, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                      <X size={15} style={{ flexShrink: 0 }} />{submitErr}
                    </motion.div>
                  )}
                  {sent && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 12, padding: "12px 16px", fontSize: 17, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", color: TEAL }}>
                      <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: 2 }}>{c.sentTitle}</p>
                        <p style={{ fontSize: 14, opacity: 0.7 }}>{c.sentSub}</p>
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

function Err({ children }: { children: React.ReactNode }) {
  return <p style={{ marginTop: 4, fontSize: 16, color: "#fca5a5" }}>{children}</p>;
}

const Inp = memo(function Inp({ label, placeholder, value, onChange, name, type, error, autoComplete }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; name: string; type: string; error?: string; autoComplete?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: 15, marginBottom: 8, color: "#c7d6d1" }}>{label}</label>
      <input id={id} name={name} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete ?? "off"}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!error}
        style={{
          width: "100%", borderRadius: 12, padding: "14px 16px", fontSize: 16,
          outline: "none", boxSizing: "border-box",
          background: "#ffffff04",
          border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid #ffffff24",
          color: "#f4faf8",
        }} />
      {error && <p style={{ marginTop: 4, fontSize: 16, color: "#fca5a5" }}>{error}</p>}
    </div>
  );
});

