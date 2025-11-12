// src/app/components/MobileAppContact.tsx
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
import Script from "next/script";
import { motion } from "framer-motion";
import { Mail, Phone, Building2, Paperclip, CheckCircle2 } from "lucide-react";
import { useQuote } from "@/app/context/QuoteContext";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d },
  viewport: { once: true, amount: 0.2 },
});

type Kind = "mvp" | "consumer" | "b2b" | "marketplace" | "utility" | "superapp";
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
  ["mvp", "MVP / прототип"],
  ["consumer", "Consumer (B2C)"],
  ["b2b", "B2B / бизнес-продукт"],
  ["marketplace", "Маркетплейс"],
  ["utility", "Utility / сервисное"],
  ["superapp", "Суперапп / экосистема"],
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

export default function MobileAppContact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitErr, setSubmitErr] = useState("");
  const [liveStatus, setLiveStatus] = useState("");

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const companyId = useId();
  const messageId = useId();
  const statusId = useId();

  // данные из калькулятора мобильных приложений
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

  // лёгкая валидация
  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Как к вам обращаться?";
    if (!isEmailValid) e.email = "Введите корректный email";
    if (!form.kind.length) e.kind = "Выберите интересующие типы";
    if (!form.budget) e.budget = "Укажите ориентир бюджета";
    if (!form.timeline) e.timeline = "Укажите срок";
    if (!form.agree) e.agree = "Подтвердите согласие на обработку";
    if (form.file && form.file.size > 10 * 1024 * 1024) e.file = "Файл больше 10 МБ";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, isEmailValid]);

  // отправка
  const abortRef = useRef<AbortController | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);
  const successTimerRef = useRef<number | null>(null);

  // cleanup при размонтировании
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitErr("");
    setLiveStatus("");
    if (sending) return;
    if (!validate()) {
      setLiveStatus("Проверьте поля формы: есть ошибки.");
      return;
    }
    if (form.hp) return; // honeypot

    // сборка FormData
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
      setLiveStatus("Отправляем заявку…");
      const res = await fetch("/api/contact-mobile", {
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

      // Аналитика
      try {
        (window as any).gtag?.("event", "generate_lead", {
          form_id: "mobile_contact",
          value: 1,
          currency: "RUB",
        });
        (window as any).ym?.(103909522, "reachGoal", "contact_submit");
      } catch {}

      setSent(true);
      setLiveStatus("Заявка отправлена. Спасибо!");
      resetQuote();
      setForm(INITIAL);
      setErrors({});

      // авто-скрытие баннера + фокус на него
      successRef.current?.focus();
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => setSent(false), 5000);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      const msg = err?.message || "Не удалось отправить заявку. Попробуйте позже.";
      setSubmitErr(msg);
      setLiveStatus("Ошибка отправки. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  }, [form, quote, resetQuote, sending, validate]);

  // a11y ids
  const agreeId = useId();
  const hpId = useId();

  // JSON-LD: ContactPoint
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "OneStack",
      url: SITE_URL,
      logo: `${SITE_URL}/vercal.png`,
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
    }),
    [SITE_URL]
  );

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="contact-title"
    >
      {/* JSON-LD */}
      <Script
        id="ld-contact-mobile"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* мягкие свечения */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* заголовок */}
        <motion.div {...fade(0)}>
          <span className="inline-block text-xs tracking-widest text-white/60 uppercase">
            оставить заявку
          </span>
          <h2 id="contact-title" className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Мобильное приложение — расскажите о задаче, подготовим решение и смету
          </h2>
          <p className="mt-4 text-white/70 max-w-3xl">
            Ответим в рабочие часы в течение дня. Приложите, если есть, пользовательские сценарии, прототипы или презентацию.
          </p>
        </motion.div>

        {/* контент */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* левая колонка — контакты/бейджи */}
          <motion.div {...fade(0.05)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold">Как связаться</h3>
            <div className="mt-4 space-y-3 text-white/80">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]">
                  <Mail className="h-4 w-4" />
                </span>
                <a href="mailto:info@onestack24.ru" className="hover:underline">
                  info@onestack24.ru
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]">
                  <Phone className="h-4 w-4" />
                </span>
                <a href="tel:+79109486106" className="hover:underline">
                  +7 (910) 948-61-06
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]">
                  <Building2 className="h-4 w-4" />
                </span>
                <span>Remote-first · встречи онлайн</span>
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
            aria-describedby={statusId}
            aria-busy={sending}
            encType="multipart/form-data"
          >
            {/* скрытое поле для расчёта (из калькулятора мобильного приложения) */}
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
                onChange={(v) => setField("phone", v)}
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

            {/* типы мобильных приложений */}
            <div className="mt-6">
              <RowTitle title="Что интересно" hint="Можно выбрать несколько" />
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Типы мобильных приложений">
                {KIND_OPTIONS.map(([k, l]) => (
                  <Chip key={k} active={form.kind.includes(k)} onClick={() => toggleKind(k)}>
                    {l}
                  </Chip>
                ))}
              </div>
              {errors.kind && <ErrText>{errors.kind}</ErrText>}
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
              <Label>Опишите задачу / платформы / интеграции</Label>
              <textarea
                id={messageId}
                name="message"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none ring-0 placeholder:text-white/40"
                placeholder="iOS/Android? Нужны ли пуши, оффлайн, карты, платежи, авторизация через Apple/Google?"
              />
            </div>

            {/* файл */}
            <div className="mt-4">
              <Label>Бриф / прототип / презентация (необязательно)</Label>
              <label className="mt-2 flex items-center gap-3 cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm">{form.file ? form.file.name : "Прикрепить файл (до 10 МБ)"}</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.webp,.zip,.rar"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    if (f && f.size > 10 * 1024 * 1024) {
                      setErrors((s) => ({ ...s, file: "Файл больше 10 МБ" }));
                      return;
                    }
                    setErrors((s) => ({ ...s, file: "" }));
                    setField("file", f);
                  }}
                />
              </label>
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
                aria-invalid={!!errors.agree}
                aria-describedby={errors.agree ? `${agreeId}-err` : undefined}
              />
              <label htmlFor={agreeId} className="text-sm text-white/80">
                Согласен(на) на обработку персональных данных и получение ответа
              </label>
            </div>
            {errors.agree && <ErrText><span id={`${agreeId}-err`}>{errors.agree}</span></ErrText>}

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
              <div className="mt-4 rounded-2xl border border-white/10 bg-rose-500/10 text-rose-200 px-5 py-4 text-sm" role="alert">
                {submitErr}
              </div>
            )}

            {/* success */}
            {sent && (
              <div
                ref={successRef}
                tabIndex={-1}
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
            <div id={statusId} className="sr-only" aria-live="polite" aria-atomic>
              {liveStatus}
            </div>
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
  const describedBy = error ? `${id}-err` : undefined;
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
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ring-0 placeholder:text-white/40 ${
          error ? "border-red-500/70 bg-red-500/5" : "border-white/10 bg-black/30"
        }`}
      />
      {error && <ErrText><span id={`${id}-err`}>{error}</span></ErrText>}
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
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label={label}>
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

function ErrText({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-red-400">{children}</div>;
}