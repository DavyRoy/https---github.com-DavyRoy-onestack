// src/app/components/HomeContact.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuote } from "@/app/context/QuoteContext";

type Status = "idle" | "loading" | "ok" | "error";

const ORG = {
  name: "OneStack",
  email: "info@onestack24.ru",
  phone: "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
  site: "https://onestack24.ru",
  tgName: "OneStack Assistant",
  tgUrl: "https://t.me/onestack_assistant",
};

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

export default function HomeContact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    tel: "",
    company: "",
    projectType: [] as string[], // ["site","webapp","mobile", ...]
    budget: "",
    message: "",
    hp: "", // honeypot
  });

  // Тихо подтягиваем типы из калькулятора (?types=site,webapp,...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    const types = (q.get("types") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (types.length) {
      setForm((f) => ({ ...f, projectType: types }));
    }
  }, []);

  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    [form.email]
  );

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      (isEmailValid || form.tel.trim().length >= 6) &&
      form.message.trim().length >= 10 &&
      status !== "loading"
    );
  }, [form, isEmailValid, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (form.hp) return; // honeypot

    try {
      setStatus("loading");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Bad response");
      setStatus("ok");

      try {
        // GA4
        (window as any).gtag?.("event", "generate_lead", {
          form_id: "home_contact",
          value: 1,
          currency: "RUB",
        });
        // Yandex Metrica
        (window as any).ym?.(103909522, "reachGoal", "contact_submit");
      } catch {}

      setForm({
        name: "",
        email: "",
        tel: "",
        company: "",
        projectType: [],
        budget: "",
        message: "",
        hp: "",
      });
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 3500);
    }
  }

  const toggleType = (t: string) =>
    setForm((f) => {
      const has = f.projectType.includes(t);
      return {
        ...f,
        projectType: has ? f.projectType.filter((x) => x !== t) : [...f.projectType, t],
      };
    });

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: ORG.name,
        url: ORG.site,
        email: ORG.email,
        telephone: ORG.phone,
        sameAs: [ORG.site, ORG.tgUrl],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: ORG.phone,
            email: ORG.email,
            contactType: "customer support",
            areaServed: "RU",
            availableLanguage: ["ru", "en"],
          },
        ],
      },
      {
        "@type": "ContactPage",
        url: `${ORG.site}#contact`,
        name: "Связаться с OneStack",
        description:
          "Форма обратной связи OneStack: оставьте заявку на разработку сайта, веб- или мобильного приложения. Быстрый ответ, NDA по запросу.",
      },
    ],
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="contact-title"
    >
      {/* фоновые свечения */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p {...fadeUp(0)} className="text-sm uppercase tracking-[0.25em] text-white/60 mb-3 text-left">
          контакты
        </motion.p>
        <motion.h2
          id="contact-title"
          {...fadeUp(0.05)}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl"
        >
          Расскажите о проекте — вернёмся с предложением
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mt-4 max-w-3xl text-white/80 text-left">
          Отвечаем в рабочие часы (МСК). Можем подписать NDA, сделать экспресс-оценку и предложить план релизов.
          Удобные каналы связи: почта, телефон и Telegram.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
          {/* Форма */}
          <motion.form
            {...fadeUp(0.14)}
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            aria-labelledby="contact-form-title"
          >
            <div id="contact-form-title" className="sr-only">Форма обратной связи OneStack</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Имя *"
                placeholder="Как к вам обращаться?"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              />
              <Field
                label="Компания"
                placeholder="(необязательно)"
                value={form.company}
                onChange={(v) => setForm((f) => ({ ...f, company: v }))}
              />
              <Field
                label="Email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                hint={form.email && !isEmailValid ? "Проверьте формат email" : ""}
                invalid={!!form.email && !isEmailValid}
              />
              <Field
                label="Телефон"
                placeholder="+7 ___ ___-__-__"
                value={form.tel}
                onChange={(v) => setForm((f) => ({ ...f, tel: v }))}
                hint="Можно оставить только email или только телефон"
              />
            </div>

            {/* Тип проекта (мультиселект) */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-white/80">Что нужно</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { k: "site", t: "Сайт" },
                  { k: "webapp", t: "Веб-приложение" },
                  { k: "mobile", t: "Мобильное приложение" },
                  { k: "support", t: "Поддержка" },
                  { k: "uiux", t: "UI/UX дизайн" },
                  { k: "branding", t: "Брендинг" },
                ].map((x) => {
                  const active = form.projectType.includes(x.k);
                  return (
                    <button
                      key={x.k}
                      type="button"
                      onClick={() => toggleType(x.k)}
                      className={`flex items-center justify-start rounded-full px-4 py-2 text-sm border transition
                      ${active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"}`}
                      aria-pressed={active}
                      aria-label={`Выбрать: ${x.t}`}
                    >
                      {x.t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Бюджет (быстрый выбор) */}
            <div className="mt-6">
              <span className="text-sm font-semibold text-white/80">Бюджет</span>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["до 300k", "300–800k", "800k–1.8m", "1.8m+ "].map((b) => {
                  const active = form.budget === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, budget: active ? "" : b }))}
                      className={`rounded-full px-4 py-2 text-sm border transition
                      ${active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"}`}
                      aria-pressed={active}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Сообщение */}
            <div className="mt-6">
              <label htmlFor="contact-message" className="text-sm font-semibold text-white/80">
                Расскажите о задаче *
              </label>
              <textarea
                id="contact-message"
                className="mt-2 h-40 w-full rounded-2xl bg-white/[0.06] border border-white/15 px-4 py-3 outline-none focus:border-white/30"
                placeholder="Цель, ключевые фичи, сроки… можно дать ссылку на ТЗ/референсы"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                minLength={10}
                required
              />
              <div className="mt-1 text-xs text-white/60">
                Минимум 10 символов. Мы бережно относимся к данным — запросы остаются конфиденциальными.
              </div>
            </div>

            {/* honeypot (скрытое поле) */}
            <input
              className="hidden"
              autoComplete="off"
              tabIndex={-1}
              value={form.hp}
              onChange={(e) => setForm((f) => ({ ...f, hp: e.target.value }))}
              name="company_website"
              aria-hidden="true"
            />

            {/* submit */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full sm:w-auto group inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-center transition
                ${
                  canSubmit
                    ? "bg-white text-black hover:shadow-lg hover:shadow-white/20"
                    : "bg-white/40 text-black/60 cursor-not-allowed"
                }`}
                aria-disabled={!canSubmit}
              >
                {status === "loading" ? "Отправляем…" : "Отправить"}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition">→</span>
              </button>

              <p className="text-[11px] text-white/55">
                Отправляя форму, вы соглашаетесь с{" "}
                <a href="/terms" className="underline underline-offset-4">Условиями</a>{" "}
                и{" "}
                <a href="/privacy" className="underline underline-offset-4">Политикой конфиденциальности</a>.
              </p>
            </div>

            {/* статус */}
            <div className="mt-2 h-5" role="status" aria-live="polite">
              {status === "ok" && (
                <span className="text-emerald-300 text-sm">
                  Готово! Мы свяжемся с вами в ближайшее время.
                </span>
              )}
              {status === "error" && (
                <span className="text-red-300 text-sm">
                  Упс, не получилось. Попробуйте ещё раз.
                </span>
              )}
            </div>
          </motion.form>

          {/* Правая колонка — инфо */}
          <motion.aside
            {...fadeUp(0.18)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 sticky top-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            aria-labelledby="contacts-aside-title"
          >
            <div id="contacts-aside-title" className="text-sm uppercase tracking-[0.18em] text-white/70">
              Контакты
            </div>

            <div className="mt-4 space-y-3 text-white/85">
              <div>
                Почта:{" "}
                <a className="underline underline-offset-4 hover:text-white" href={`mailto:${ORG.email}`}>
                  {ORG.email}
                </a>
              </div>
              <div>
                Телефон:{" "}
                <a className="underline underline-offset-4 hover:text-white" href={ORG.phoneHref}>
                  {ORG.phone}
                </a>
              </div>
              <div>
                Сайт:{" "}
                <a className="underline underline-offset-4 hover:text-white" href={ORG.site} target="_blank" rel="noopener">
                  onestack24.ru
                </a>
              </div>
              <div>
                Telegram:{" "}
                <span className="underline underline-offset-4 opacity-70" title="Скоро подключим бота" aria-disabled="true">
                  {ORG.tgName} — скоро
                </span>
                {/* когда будет готово, замените на ссылку:
                <a className="underline underline-offset-4 hover:text-white" href={ORG.tgUrl} target="_blank" rel="noopener">
                  {ORG.tgName}
                </a>
                */}
              </div>
              <div>Часы: пн–пт, 10:00–19:00 (MSK)</div>
            </div>

            <div className="mt-8">
              <div className="text-sm font-semibold text-white/80">Как работаем</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70" aria-label="Этапы взаимодействия">
                <li>— Короткий бриф и 30-минутный звонок</li>
                <li>— Черновая смета и план релизов</li>
                <li>— Старт спринта (1–2 недели)</li>
                <li>— Демо и релизы каждые 1–2 недели</li>
              </ul>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.08] p-4">
              <div className="text-sm text-white/75">NDA и безопасность</div>
              <div className="mt-1 text-xs text-white/60">
                Подписываем NDA по запросу. Доступы и артефакты — в защищённых контурах.
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

/* ==== подкомпоненты ==== */

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint = "",
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  invalid?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-white/80">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-2xl bg-white/[0.06] border px-4 py-3 outline-none focus:border-white/30 ${
          invalid ? "border-red-500/50" : "border-white/15"
        }`}
        aria-invalid={invalid || undefined}
      />
      {hint ? <div className="mt-1 text-xs text-white/60">{hint}</div> : null}
    </div>
  );
}