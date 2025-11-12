// src/components/SiteContact.tsx
"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Building2, Paperclip, CheckCircle2, X } from "lucide-react";
import Script from "next/script";
import { useQuote } from "@/app/context/QuoteContext";

const GTAG_ID = process.env.NEXT_PUBLIC_GA_ID || "G-04E9LPJ43Y";
const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID || 103909522);

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d },
  viewport: { once: true, amount: 0.2 },
});

type Kind = "landing" | "business" | "corporate" | "ecommerce" | "content" | "portfolio";
type Budget = "100-300" | "300-700" | "700-1500" | "1500+";
type Timeline = "2-4" | "4-8" | "8-12" | "12+";

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  kind: Kind[];
  budget: Budget | "";
  timeline: Timeline | "";
  message: string;
  agree: boolean;
  file: File | null;
  hp: string; // honeypot
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  kind: [],
  budget: "",
  timeline: "",
  message: "",
  agree: false,
  file: null,
  hp: "",
};

const KIND_OPTIONS: ReadonlyArray<[Kind, string]> = [
  ["landing", "Лендинг"],
  ["business", "Сайт-визитка"],
  ["corporate", "Корпоративный"],
  ["ecommerce", "Магазин"],
  ["content", "Информационный"],
  ["portfolio", "Портфолио"],
] as const;

const BUDGET_OPTIONS = [
  { value: "100-300", label: "100–300 тыс ₽" },
  { value: "300-700", label: "300–700 тыс ₽" },
  { value: "700-1500", label: "700 тыс–1.5 млн ₽" },
  { value: "1500+", label: "1.5 млн ₽ +" },
] as const satisfies ReadonlyArray<{ value: Budget; label: string }>;

const TIMELINE_OPTIONS = [
  { value: "2-4", label: "2–4 недели" },
  { value: "4-8", label: "4–8 недель" },
  { value: "8-12", label: "8–12 недель" },
  { value: "12+", label: "12+ недель" },
] as const satisfies ReadonlyArray<{ value: Timeline; label: string }>;

const ACCEPTED_FILE_TYPES =
  ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.webp,.zip,.rar";
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const MESSAGE_MAX = 2000;

export default function SiteContact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitErr, setSubmitErr] = useState("");

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const companyId = useId();
  const messageId = useId();
  const statusId = useId();

  // из калькулятора
  const { quote, resetQuote } = useQuote();
  const calcRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (calcRef.current) calcRef.current.value = quote ? JSON.stringify(quote) : "";
  }, [quote]);

  // Валидация email
  const isEmailValid = useMemo(
    () => (form.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) : false),
    [form.email]
  );

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((s) => ({ ...s, [key]: value }));
  }, []);

  const toggleKind = useCallback((k: Kind) => {
    setForm((s) => ({
      ...s,
      kind: s.kind.includes(k) ? s.kind.filter((x) => x !== k) : [...s.kind, k],
    }));
  }, []);

  // мягкая нормализация телефона (только цифры + плюс впереди)
  const normalizePhone = (v: string) => {
    const digits = v.replace(/[^\d+]/g, "");
    return digits.startsWith("+") ? "+" + digits.replace(/[^\d]/g, "") : digits.replace(/[^\d]/g, "");
  };

  // Лёгкая валидация
  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Как к вам обращаться?";
    if (!isEmailValid) e.email = "Введите корректный email";
    if (!form.kind.length) e.kind = "Выберите интересующие типы";
    if (!form.budget) e.budget = "Укажите ориентир бюджета";
    if (!form.timeline) e.timeline = "Укажите срок";
    if (!form.agree) e.agree = "Подтвердите согласие на обработку";
    if (form.file && form.file.size > MAX_FILE_BYTES) e.file = "Файл больше 10 МБ";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, isEmailValid]);

  // Управление отправкой (с отменой предыдущей)
  const abortRef = useRef<AbortController | null>(null);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitErr("");
    if (sending) return;
    if (!validate()) return;
    if (form.hp) return; // honeypot

    // Сборка FormData
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("email", form.email.trim().toLowerCase());
    fd.append("phone", form.phone.trim());
    fd.append("company", form.company.trim());
    fd.append("kind", JSON.stringify(form.kind));
    fd.append("budget", form.budget);
    fd.append("timeline", form.timeline);
    fd.append("message", form.message.trim());
    fd.append("agree", String(form.agree));
    fd.append("createdAt", new Date().toISOString());
    fd.append("ua", typeof navigator !== "undefined" ? navigator.userAgent : "");
    fd.append("quote", quote ? JSON.stringify(quote) : "");
    if (form.file) fd.append("file", form.file);

    try {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setSending(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });

      if (!res.ok) {
        let reason = "";
        try {
          const data = await res.json();
          reason = data?.error || data?.message || "";
        } catch {}
        throw new Error(reason || `Ошибка ${res.status}`);
      }

      // Аналитика: GA4 + Yandex.Metrika
      try {
        // @ts-ignore
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          // @ts-ignore
          window.gtag("event", "generate_lead", {
            event_category: "contact",
            event_label: "site_form",
            value: 1,
          });
        }
        // @ts-ignore
        if (typeof window !== "undefined" && typeof window.ym === "function") {
          // @ts-ignore
          window.ym(YM_ID, "reachGoal", "lead_contact_form");
        }
      } catch {}

      setSent(true);
      resetQuote();
      setForm(INITIAL);
      setErrors({});

      // Автоскрытие уведомления
      const t = setTimeout(() => setSent(false), 5000);
      return () => clearTimeout(t);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setSubmitErr(err?.message || "Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  }, [form, quote, resetQuote, sending, validate]);

  // a11y ids
  const agreeId = useId();
  const hpId = useId();

  const messageLeft = MESSAGE_MAX - form.message.length;

  /* ====== SEO JSON-LD ====== */
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const orgJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "OneStack",
      url: baseUrl,
      email: "info@onestack24.ru",
      telephone: "+7-910-948-61-06",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "info@onestack24.ru",
          telephone: "+7-910-948-61-06",
          areaServed: ["RU", "KZ", "BY", "AM"],
          availableLanguage: ["ru", "en"],
        },
      ],
    }),
    [baseUrl]
  );

  const contactPageJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Связаться с OneStack",
      url: `${baseUrl}/sites#contact`,
      description:
        "Форма обратной связи: расскажите о задаче, выберите тип сайта и получите смету.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Домашняя", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: "Сайты", item: `${baseUrl}/sites` },
          { "@type": "ListItem", position: 3, name: "Контакты", item: `${baseUrl}/sites#contact` },
        ],
      },
      publisher: { "@type": "Organization", name: "OneStack", url: baseUrl },
    }),
    [baseUrl]
  );

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-24"
      aria-labelledby="contact-title"
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* ===== Analytics (GA4 + Yandex.Metrika) ===== */}
      {GTAG_ID && (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GTAG_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {YM_ID && (
        <Script id="ym-init" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${YM_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false });
          `}
        </Script>
      )}

      {/* ===== JSON-LD для SEO ===== */}
      <Script
        id="schema-org-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Script
        id="schema-contactpage"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />

      {/* мягкие свечения */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* заголовок */}
        <motion.div {...fade(0)}>
          <span className="inline-block text-xs tracking-widest text-white/60 uppercase">
            оставить заявку
          </span>
          <h2 id="contact-title" className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Расскажите о задаче — подберём решение и смету
          </h2>
          <p className="mt-4 text-white/70 max-w-3xl">
            Ответим в рабочие часы в течение дня. Если удобно — приложите бриф или презентацию.
          </p>
        </motion.div>

        {/* контент */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* левая колонка — контакты/бейджи */}
          <motion.div {...fade(0.05)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold">
              Как связаться <span className="sr-only">OneStack</span>
            </h3>
            <meta itemProp="name" content="OneStack" />
            <link itemProp="url" href={baseUrl} />
            <div className="mt-4 space-y-3 text-white/80">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]">
                  <Mail className="h-4 w-4" />
                </span>
                <a href="mailto:info@onestack24.ru" className="hover:underline" itemProp="email">
                  info@onestack24.ru
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]">
                  <Phone className="h-4 w-4" />
                </span>
                <a href="tel:+79109486106" className="hover:underline" itemProp="telephone">
                  +7 (910) 948 61 06
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]">
                  <Building2 className="h-4 w-4" />
                </span>
                <a href={baseUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  onestack24.ru
                </a>
              </div>
            </div>

            {/* бейджи-плюсы */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["Фикс-смета", "прозрачно"],
                ["Спринты", "1–2 недели"],
                ["Документация", "после релиза"],
                ["Поддержка", "SLA опционально"],
              ].map(([a, b]) => (
                <div key={a} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="text-sm font-semibold">{a}</div>
                  <div className="text-xs text-white/65">{b}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* правая колонка — форма */}
          <motion.form
            {...fade(0.08)}
            onSubmit={onSubmit}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            noValidate
            encType="multipart/form-data"
            aria-describedby={statusId}
            aria-busy={sending}
          >
            {/* скрытое поле для расчёта */}
            <textarea ref={calcRef} name="calc" className="hidden" readOnly aria-hidden="true" />

            {/* honeypot для ботов */}
            <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor={hpId}>Ваш сайт</label>
              <input
                id={hpId}
                name="company_website"
                autoComplete="off"
                tabIndex={-1}
                onChange={(e) => setField("hp", e.target.value)}
                value={form.hp}
              />
            </div>

            {/* верхний ряд */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id={nameId}
                label="Как вас зовут"
                placeholder="Иван Петров"
                value={form.name}
                onChange={(v) => setField("name", v)}
                error={errors.name}
                name="name"
                autoComplete="name"
                required
              />
              <Field
                id={emailId}
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(v) => setField("email", v)}
                error={errors.email}
                name="email"
                autoComplete="email"
                inputMode="email"
                required
              />
              <Field
                id={phoneId}
                label="Телефон"
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={(v) => setField("phone", normalizePhone(v))}
                name="tel"
                autoComplete="tel"
                inputMode="tel"
              />
              <Field
                id={companyId}
                label="Компания (необязательно)"
                placeholder="ООО «Пример»"
                value={form.company}
                onChange={(v) => setField("company", v)}
                name="organization"
                autoComplete="organization"
              />
            </div>

            {/* типы сайтов */}
            <div className="mt-6">
              <RowTitle title="Что интересно" hint="Можно выбрать несколько" />
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Типы сайтов">
                {KIND_OPTIONS.map(([k, l]) => (
                  <Chip key={k} active={form.kind.includes(k)} onClick={() => toggleKind(k)}>
                    {l}
                  </Chip>
                ))}
              </div>
              {errors.kind && <ErrText id="err-kind">{errors.kind}</ErrText>}
            </div>

            {/* бюджет/сроки */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Ориентир бюджета"
                value={form.budget}
                onChange={(v) => setField("budget", v as Budget)}
                options={BUDGET_OPTIONS}
                error={errors.budget}
              />
              <Select
                label="Желаемые сроки"
                value={form.timeline}
                onChange={(v) => setField("timeline", v as Timeline)}
                options={TIMELINE_OPTIONS}
                error={errors.timeline}
              />
            </div>

            {/* сообщение */}
            <div className="mt-6">
              <Label>Опишите задачу / ссылки / пожелания</Label>
              <textarea
                id={messageId}
                name="message"
                value={form.message}
                onChange={(e) => setField("message", e.target.value.slice(0, MESSAGE_MAX))}
                rows={5}
                maxLength={MESSAGE_MAX}
                className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ring-0 placeholder:text-white/40 ${
                  errors.message ? "border-red-500/70 bg-red-500/5" : "border-white/10 bg-black/30"
                }`}
                placeholder="Какая цель проекта? Есть ли референсы, контент, ТЗ?"
                aria-invalid={!!errors.message || undefined}
                aria-describedby={errors.message ? "err-message" : undefined}
              />
              <div className="mt-1 text-xs text-white/45">{messageLeft} / {MESSAGE_MAX}</div>
              {errors.message && <ErrText id="err-message">{errors.message}</ErrText>}
            </div>

            {/* файл */}
            <div className="mt-4">
              <Label>Бриф / презентация (необязательно)</Label>
              <div className="mt-2 flex items-center gap-3">
                <label className="flex-1 flex items-center gap-3 cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm truncate">
                    {form.file ? `${form.file.name} (${humanSize(form.file.size)})` : "Прикрепить файл (до 10 МБ)"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept={ACCEPTED_FILE_TYPES}
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f && f.size > MAX_FILE_BYTES) {
                        setErrors((s) => ({ ...s, file: "Файл больше 10 МБ" }));
                        return;
                      }
                      setErrors((s) => ({ ...s, file: "" }));
                      setField("file", f);
                    }}
                  />
                </label>
                {form.file && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                    onClick={() => setField("file", null)}
                    aria-label="Убрать прикрепленный файл"
                    title="Убрать файл"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {errors.file && <ErrText>{errors.file}</ErrText>}
            </div>

            {/* согласие */}
            <div className="mt-6 flex items-start gap-3">
              <input
                id={agreeId}
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setField("agree", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30"
                aria-invalid={!!errors.agree || undefined}
                aria-describedby={errors.agree ? "err-agree" : undefined}
              />
              <label htmlFor={agreeId} className="text-sm text-white/80">
                Согласен(на) на обработку персональных данных и получение ответа
              </label>
            </div>
            {errors.agree && <ErrText id="err-agree">{errors.agree}</ErrText>}

            {/* submit / back */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
              <button
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto !h-12 min-w-[220px] inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-6 font-semibold text-black hover:shadow-white/20 hover:shadow-lg transition disabled:opacity-60 text-center"
              >
                {sending ? "Отправляем…" : "Отправить заявку"}
              </button>
              <a
                href="#calculator"
                className="w-full sm:w-auto !h-12 min-w-[220px] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/20 px-6 font-semibold hover:bg-white/10 transition text-center"
              >
                Вернуться к калькулятору
              </a>
            </div>

            {/* submit error */}
            {submitErr && (
              <div
                className="mt-4 rounded-2xl border border-white/10 bg-rose-500/10 text-rose-200 px-5 py-4 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {submitErr}
              </div>
            )}

            {/* success */}
            {sent && (
              <div
                className="mt-6 rounded-2xl border border-white/10 bg-emerald-500/10 text-emerald-200 px-5 py-4 flex items-center gap-3"
                role="status"
                aria-live="polite"
                aria-atomic
              >
                <CheckCircle2 className="h-5 w-5" />
                <div className="text-sm">Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.</div>
              </div>
            )}

            {/* живой статус для скринридеров */}
            <div id={statusId} className="sr-only" aria-live="polite" aria-atomic />
          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* ==== UI helpers ==== */

const Label = memo(function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm uppercase tracking-[0.18em] text-white/60">{children}</div>;
});

const Field = memo(function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  name,
  autoComplete,
  inputMode,
  required,
}: {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  name?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "search" | "url" | "none";
  required?: boolean;
}) {
  const errId = error ? `${id}-error` : undefined;
  return (
    <div>
      <Label>{label}</Label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={errId}
        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ring-0 placeholder:text-white/40 ${
          error ? "border-red-500/70 bg-red-500/5" : "border-white/10 bg-black/30"
        }`}
      />
      {error && <ErrText id={errId}>{error}</ErrText>}
    </div>
  );
});

const Select = memo(function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: T | "";
  onChange: (v: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  error?: string;
}) {
  const groupId = useId();
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-labelledby={groupId}>
        <span id={groupId} className="sr-only">{label}</span>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`rounded-full px-4 py-2 text-sm border transition ${
              value === o.value
                ? "bg-white text-black border-white"
                : "border-white/30 text-white/85 hover:bg-white/10"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {error && <ErrText>{error}</ErrText>}
    </div>
  );
});

const RowTitle = memo(function RowTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-sm uppercase tracking-[0.18em] text-white/60">{title}</div>
      {hint && <div className="text-xs text-white/45">{hint}</div>}
    </div>
  );
});

const Chip = memo(function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm border transition ${
        active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
});

function ErrText({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="mt-1 text-xs text-red-400">
      {children}
    </div>
  );
}

function humanSize(bytes: number) {
  const units = ["Б", "КБ", "МБ", "ГБ"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}