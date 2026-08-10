"use client";

// src/app/tg/page.tsx
// Telegram Mini App — multi-screen SPA
// Screens: home → calc → contact → success

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Telegram WebApp type shim ───────────────────────────────────────────── */
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void;
        expand(): void;
        close(): void;
        initDataUnsafe: {
          user?: { id: number; first_name: string; last_name?: string; username?: string };
        };
        initData: string;
        colorScheme: "light" | "dark";
        themeParams: Record<string, string>;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText(t: string): void;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          onClick(fn: () => void): void;
          offClick(fn: () => void): void;
          showProgress(leaveActive?: boolean): void;
          hideProgress(): void;
        };
        BackButton: {
          isVisible: boolean;
          show(): void;
          hide(): void;
          onClick(fn: () => void): void;
          offClick(fn: () => void): void;
        };
        HapticFeedback: {
          impactOccurred(style: "light" | "medium" | "heavy"): void;
          notificationOccurred(type: "error" | "success" | "warning"): void;
          selectionChanged(): void;
        };
      };
    };
  }
}

/* ─── Palette ─────────────────────────────────────────────────────────────── */
const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const CARD  = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";

/* ─── i18n ────────────────────────────────────────────────────────────────── */
type Lang = "ru" | "en";

const T = {
  ru: {
    tagline: "150+ проектов · 4 года на рынке · 98% в срок",
    heading1: "Разработка",
    heading2: "цифровых продуктов",
    back: "← Назад",
    calcHint: "Выбери нужные функции — получи оценку",
    basePrice: "Базовая стоимость",
    total: "Итого (~оценка)",
    cta: "Оставить заявку →",
    formTitle: "Заявка",
    formHint: "Данные из профиля Telegram подставлены автоматически",
    fieldName: "Имя",
    fieldContact: "Телефон / Telegram",
    fieldNamePh: "Ваше имя",
    fieldContactPh: "@username или +7...",
    fieldMsg: "Опишите задачу (необязательно)",
    fieldMsgPh: "Что нужно сделать, сроки, бюджет...",
    submit: "Отправить заявку",
    submitting: "Отправка...",
    errorFill: "Заполни имя и контакт",
    errorSend: "Не удалось отправить. Попробуй ещё раз.",
    privacy: "Нажимая кнопку, вы соглашаетесь с",
    privacyLink: "политикой конфиденциальности",
    contacts: "Контакты",
    successTitle: "Заявка отправлена!",
    successMsg: (name: string | null) => `${name ? name + ", м" : "М"}ы свяжемся с вами в течение одного рабочего дня.`,
    home: "На главную",
    close: "Закрыть",
    onRequest: "по запросу",
  },
  en: {
    tagline: "150+ projects · 4 years · 98% on time",
    heading1: "Building",
    heading2: "digital products",
    back: "← Back",
    calcHint: "Pick features — get an estimate",
    basePrice: "Base price",
    total: "Total (~estimate)",
    cta: "Request a quote →",
    formTitle: "Request",
    formHint: "Telegram profile data filled in automatically",
    fieldName: "Name",
    fieldContact: "Phone / Telegram",
    fieldNamePh: "Your name",
    fieldContactPh: "@username or +1...",
    fieldMsg: "Describe the project (optional)",
    fieldMsgPh: "What to build, timeline, budget...",
    submit: "Send request",
    submitting: "Sending...",
    errorFill: "Please fill in name and contact",
    errorSend: "Could not send. Please try again.",
    privacy: "By submitting you agree to our",
    privacyLink: "privacy policy",
    contacts: "Contacts",
    successTitle: "Request sent!",
    successMsg: (name: string | null) => `${name ? name + ", we" : "We"}'ll get back to you within one business day.`,
    home: "Home",
    close: "Close",
    onRequest: "on request",
  },
} as const;

/* ─── Data ────────────────────────────────────────────────────────────────── */
type Screen = "home" | "calc" | "contact" | "success";
type ServiceKey = "sites" | "webapp" | "mobile" | "complex";

const SERVICES: { key: ServiceKey; emoji: string; title: Record<Lang, string>; sub: Record<Lang, string>; range: Record<Lang, string>; directContact?: boolean }[] = [
  {
    key: "sites",
    emoji: "🌐",
    title: { ru: "Сайт", en: "Website" },
    sub: { ru: "Лендинг, корпоративный, интернет-магазин", en: "Landing, corporate, e-commerce" },
    range: { ru: "от 80 000 ₽", en: "from $880" },
  },
  {
    key: "webapp",
    emoji: "⚡",
    title: { ru: "Веб-приложение", en: "Web App" },
    sub: { ru: "Личный кабинет, CRM, аналитика, SaaS", en: "Dashboard, CRM, analytics, SaaS" },
    range: { ru: "от 300 000 ₽", en: "from $3.3K" },
  },
  {
    key: "mobile",
    emoji: "📱",
    title: { ru: "Мобильное приложение", en: "Mobile App" },
    sub: { ru: "iOS и Android, React Native, пуши, оплаты", en: "iOS & Android, React Native, push, payments" },
    range: { ru: "от 420 000 ₽", en: "from $4.6K" },
  },
  {
    key: "complex",
    emoji: "🚀",
    title: { ru: "Комплексный проект", en: "Full Package" },
    sub: { ru: "Сайт + веб-приложение + мобильное под ключ", en: "Website + web app + mobile, end-to-end" },
    range: { ru: "", en: "" },
    directContact: true,
  },
];

type Feature = { key: string; label: Record<Lang, string>; price: number };

const FEATURES_BY_SERVICE: Record<ServiceKey, Feature[]> = {
  complex: [],
  sites: [
    { key: "seo",     label: { ru: "SEO-оптимизация",   en: "SEO optimisation"   }, price: 25_000 },
    { key: "cms",     label: { ru: "Система управления", en: "CMS"                }, price: 35_000 },
    { key: "ecom",    label: { ru: "Интернет-магазин",   en: "E-commerce shop"    }, price: 80_000 },
    { key: "anim",    label: { ru: "Анимации / 3D",      en: "Animations / 3D"    }, price: 30_000 },
    { key: "i18n",    label: { ru: "Мультиязычность",    en: "Multilingual"       }, price: 20_000 },
    { key: "support", label: { ru: "Поддержка 3 мес",    en: "3-mo support"       }, price: 15_000 },
  ],
  webapp: [
    { key: "auth",      label: { ru: "Авторизация / роли",   en: "Auth & roles"       }, price: 70_000  },
    { key: "payments",  label: { ru: "Платёжная интеграция",  en: "Payment integration"}, price: 110_000 },
    { key: "crm",       label: { ru: "CRM-интеграция",        en: "CRM integration"    }, price: 60_000  },
    { key: "realtime",  label: { ru: "Реалтайм / чат",        en: "Realtime / chat"    }, price: 80_000  },
    { key: "analytics", label: { ru: "Дашборд аналитики",     en: "Analytics dashboard"}, price: 50_000  },
    { key: "support",   label: { ru: "Поддержка 3 мес",       en: "3-mo support"       }, price: 30_000  },
  ],
  mobile: [
    { key: "push",     label: { ru: "Push-уведомления",   en: "Push notifications" }, price: 45_000  },
    { key: "payments", label: { ru: "Оплаты / подписки",  en: "Payments / subs"    }, price: 110_000 },
    { key: "offline",  label: { ru: "Оффлайн-режим",      en: "Offline mode"       }, price: 85_000  },
    { key: "maps",     label: { ru: "Карты / геолокация", en: "Maps / geolocation" }, price: 65_000  },
    { key: "chat",     label: { ru: "Чат с поддержкой",   en: "Support chat"       }, price: 80_000  },
    { key: "support",  label: { ru: "Поддержка 3 мес",    en: "3-mo support"       }, price: 30_000  },
  ],
};

const BASE_PRICE: Record<ServiceKey, number> = {
  sites:   80_000,
  webapp:  300_000,
  mobile:  420_000,
  complex: 0,
};

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function TgApp() {
  const twa = useRef<Window["Telegram"]>(null);
  // true = running inside real Telegram (initData non-empty)
  const [inTelegram, setInTelegram] = useState(false);
  // true = BackButton / HapticFeedback supported (TG ≥ 6.1)
  const supportsBackButton = useRef(false);
  const [lang, setLang] = useState<Lang>("ru");
  const t = T[lang];
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedService, setSelectedService] = useState<ServiceKey | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [tgUser, setTgUser] = useState<{ first_name: string; username?: string } | null>(null);

  const [name,    setName]    = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState("");

  /* Init Telegram SDK */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const wa = window.Telegram?.WebApp;
    if (!wa) return;
    twa.current = window.Telegram;
    const isRealTelegram = !!wa.initData;
    setInTelegram(isRealTelegram);
    // BackButton / HapticFeedback require TG WebApp ≥ 6.1
    const ver = wa.version ?? "6.0";
    const [major, minor] = ver.split(".").map(Number);
    supportsBackButton.current = major > 6 || (major === 6 && (minor ?? 0) >= 1);
    wa.ready();
    wa.expand();
    const user = wa.initDataUnsafe?.user;
    if (user) {
      setTgUser(user);
      setName(user.first_name + (user.last_name ? " " + user.last_name : ""));
      if (user.username) setContact("@" + user.username);
    }
  }, []);

  /* ── Back button ─────────────────────────────────────────────────────────── */
  const goBack = useCallback(() => {
    if (screen === "calc") setScreen("home");
    if (screen === "contact") setScreen(selectedService === "complex" ? "home" : "calc");
  }, [screen, selectedService]);

  useEffect(() => {
    const wa = twa.current?.WebApp;
    if (!wa || !supportsBackButton.current) return;
    if (screen === "home") {
      wa.BackButton.hide();
    } else {
      wa.BackButton.show();
      wa.BackButton.onClick(goBack);
    }
    return () => { wa.BackButton.offClick(goBack); };
  }, [screen, goBack]);

  /* ── Main button ─────────────────────────────────────────────────────────── */
  const submitForm = useCallback(async () => {
    if (!name.trim() || !contact.trim()) { setError(t.errorFill); return; }
    setError("");
    const wa = twa.current?.WebApp;
    wa?.MainButton.showProgress(true);
    setSending(true);
    try {
      await fetch("/api/telegram/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService,
          features: [...selectedFeatures],
          name: name.trim(),
          contact: contact.trim(),
          message: message.trim(),
          initData: wa?.initData ?? "",
          price: totalPrice,
        }),
      });
      if (supportsBackButton.current) wa?.HapticFeedback.notificationOccurred("success");
      wa?.MainButton.hideProgress();
      wa?.MainButton.hide();
      setScreen("success");
    } catch {
      wa?.MainButton.hideProgress();
      if (supportsBackButton.current) wa?.HapticFeedback.notificationOccurred("error");
      setError(t.errorSend);
    } finally {
      setSending(false);
    }
  }, [name, contact, message, selectedService, selectedFeatures]);

  useEffect(() => {
    const wa = twa.current?.WebApp;
    if (!wa) return;
    if (screen === "contact") {
      wa.MainButton.setText(t.submit);
      wa.MainButton.show();
      wa.MainButton.onClick(submitForm);
    } else {
      wa.MainButton.hide();
      wa.MainButton.offClick(submitForm);
    }
    return () => { wa.MainButton.offClick(submitForm); };
  }, [screen, submitForm]);

  /* ── Calc helpers ────────────────────────────────────────────────────────── */
  const toggleFeature = (key: string) => {
    if (supportsBackButton.current) twa.current?.WebApp.HapticFeedback.selectionChanged();
    setSelectedFeatures(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const features = selectedService ? FEATURES_BY_SERVICE[selectedService] : [];
  const totalPrice = selectedService
    ? BASE_PRICE[selectedService] + features.filter(f => selectedFeatures.has(f.key)).reduce((s, f) => s + f.price, 0)
    : 0;

  /* ═══ RENDER ════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100dvh", background: BG, display: "flex", flexDirection: "column" }}>

      {/* ──────────────── HOME ─────────────────────────────────────────────── */}
      {screen === "home" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 16px 32px" }}>

          {/* Logo + lang toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <svg width="36" height="24" viewBox="0 0 48 32" fill="none" aria-hidden>
              <path d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z" stroke={TEAL} strokeWidth="2.5"/>
            </svg>
            <span style={{ color: WHITE, fontWeight: 700, fontSize: 18 }}>OneStack</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {(["ru", "en"] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    background: lang === l ? TEAL : "transparent",
                    border: `1px solid ${lang === l ? TEAL : BORDER}`,
                    borderRadius: 6,
                    padding: "3px 8px",
                    color: lang === l ? BG : "rgba(244,250,248,0.5)",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <h1 style={{ color: WHITE, fontSize: 28, fontWeight: 700, lineHeight: 1.2, margin: "0 0 8px" }}>
            {t.heading1}<br/>
            <span style={{ color: TEAL }}>{t.heading2}</span>
          </h1>
          <p style={{ color: "rgba(244,250,248,0.5)", fontSize: 14, margin: "0 0 32px", lineHeight: 1.6 }}>
            {t.tagline}
          </p>

          {/* Service cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {SERVICES.map(s => (
              <button
                key={s.key}
                onClick={() => {
                  if (supportsBackButton.current) twa.current?.WebApp.HapticFeedback.impactOccurred("light");
                  setSelectedService(s.key);
                  setSelectedFeatures(new Set());
                  setScreen(s.directContact ? "contact" : "calc");
                }}
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: 28 }}>{s.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: WHITE, fontWeight: 600, fontSize: 15 }}>{s.title[lang]}</div>
                  <div style={{ color: "rgba(244,250,248,0.45)", fontSize: 12, marginTop: 2 }}>{s.sub[lang]}</div>
                </div>
                <div style={{ color: TEAL, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {s.directContact ? t.onRequest : s.range[lang]}
                </div>
              </button>
            ))}
          </div>

          {/* Contacts block */}
          <div style={{
            marginTop: "auto",
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <span style={{ color: "rgba(244,250,248,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.contacts}</span>
            <a href="mailto:info@onestack24.ru" style={{ color: TEAL, fontSize: 14, textDecoration: "none" }}>info@onestack24.ru</a>
            <a href="tel:+79109486106" style={{ color: TEAL, fontSize: 14, textDecoration: "none" }}>+7 (910) 948 61 06</a>
          </div>
        </div>
      )}

      {/* ──────────────── CALCULATOR ───────────────────────────────────────── */}
      {screen === "calc" && selectedService && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 16px 120px" }}>
          <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", color: TEAL, fontSize: 14, padding: "0 0 16px", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
            {t.back}
          </button>
          <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
            {SERVICES.find(s => s.key === selectedService)?.emoji}{" "}
            {SERVICES.find(s => s.key === selectedService)?.title[lang]}
          </h2>
          <p style={{ color: "rgba(244,250,248,0.4)", fontSize: 13, margin: "0 0 20px" }}>
            {t.calcHint}
          </p>

          {/* Base price */}
          <div style={{
            background: `${TEAL}12`,
            border: `1px solid ${TEAL}30`,
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ color: "rgba(244,250,248,0.6)", fontSize: 13 }}>{t.basePrice}</span>
            <span style={{ color: WHITE, fontWeight: 600 }}>{fmt(BASE_PRICE[selectedService])}</span>
          </div>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {FEATURES_BY_SERVICE[selectedService].map(f => {
              const active = selectedFeatures.has(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => toggleFeature(f.key)}
                  style={{
                    background: active ? `${TEAL}15` : CARD,
                    border: `1px solid ${active ? TEAL + "50" : BORDER}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      border: `2px solid ${active ? TEAL : "rgba(255,255,255,0.2)"}`,
                      background: active ? TEAL : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.15s",
                    }}>
                      {active && <span style={{ color: BG, fontSize: 13, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ color: active ? WHITE : "rgba(244,250,248,0.7)", fontSize: 14 }}>{f.label[lang]}</span>
                  </div>
                  <span style={{ color: active ? TEAL : "rgba(244,250,248,0.35)", fontSize: 13, fontWeight: 500 }}>
                    +{fmt(f.price)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Total */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "#0d1f1c",
            borderTop: `1px solid ${TEAL}20`,
            padding: "14px 16px 24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ color: "rgba(244,250,248,0.5)", fontSize: 13 }}>{t.total}</span>
              <span style={{ color: TEAL, fontWeight: 700, fontSize: 20 }}>{fmt(totalPrice)}</span>
            </div>
            <button
              onClick={() => {
                if (supportsBackButton.current) twa.current?.WebApp.HapticFeedback.impactOccurred("medium");
                setScreen("contact");
              }}
              style={{
                width: "100%",
                background: TEAL,
                color: BG,
                border: "none",
                borderRadius: 12,
                padding: "14px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.cta}
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── CONTACT ──────────────────────────────────────────── */}
      {screen === "contact" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 16px 140px" }}>
          <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", color: TEAL, fontSize: 14, padding: "0 0 16px", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
            {t.back}
          </button>
          <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{t.formTitle}</h2>
          <p style={{ color: "rgba(244,250,248,0.4)", fontSize: 13, margin: "0 0 24px" }}>
            {t.formHint}
          </p>

          {/* Summary chip */}
          {selectedService && (
            <div style={{
              background: `${TEAL}12`,
              border: `1px solid ${TEAL}25`,
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
            }}>
              <span style={{ color: "rgba(244,250,248,0.6)" }}>
                {SERVICES.find(s => s.key === selectedService)?.title[lang]}
              </span>
              <span style={{ color: TEAL, fontWeight: 600 }}>
                {selectedService === "complex" ? t.onRequest : fmt(totalPrice)}
              </span>
            </div>
          )}

          {/* Fields */}
          {[
            { label: t.fieldName,    value: name,    set: setName,    placeholder: t.fieldNamePh,    type: "text" },
            { label: t.fieldContact, value: contact, set: setContact, placeholder: t.fieldContactPh, type: "text" },
          ].map(({ label, value, set, placeholder, type }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ color: "rgba(244,250,248,0.45)", fontSize: 12, display: "block", marginBottom: 6 }}>
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: WHITE,
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "rgba(244,250,248,0.45)", fontSize: 12, display: "block", marginBottom: 6 }}>
              {t.fieldMsg}
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t.fieldMsgPh}
              rows={3}
              style={{
                width: "100%",
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "12px 14px",
                color: WHITE,
                fontSize: 15,
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 12px" }}>{error}</p>
          )}

          {/* Fallback submit button (browser / non-Telegram context) */}
          {!inTelegram && (
            <button
              onClick={submitForm}
              disabled={sending}
              style={{
                width: "100%",
                background: sending ? "rgba(45,212,191,0.5)" : TEAL,
                color: BG,
                border: "none",
                borderRadius: 12,
                padding: "14px",
                fontSize: 15,
                fontWeight: 700,
                cursor: sending ? "not-allowed" : "pointer",
              }}
            >
              {sending ? t.submitting : t.submit}
            </button>
          )}

          <p style={{ color: "rgba(244,250,248,0.25)", fontSize: 11, marginTop: 16, textAlign: "center" }}>
            {t.privacy}{" "}
            <a href="https://onestack24.ru/privacy" style={{ color: TEAL }}>{t.privacyLink}</a>
          </p>
        </div>
      )}

      {/* ──────────────── SUCCESS ──────────────────────────────────────────── */}
      {screen === "success" && (
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ color: WHITE, fontSize: 24, fontWeight: 700, margin: "0 0 10px" }}>
            {t.successTitle}
          </h2>
          <p style={{ color: "rgba(244,250,248,0.5)", fontSize: 15, margin: "0 0 32px", lineHeight: 1.6 }}>
            {t.successMsg(tgUser?.first_name ?? null)}
          </p>
          <button
            onClick={() => {
              setScreen("home");
              setSelectedService(null);
              setSelectedFeatures(new Set());
              setMessage("");
            }}
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "12px 28px",
              color: WHITE,
              fontSize: 14,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            {t.home}
          </button>
          <button
            onClick={() => twa.current?.WebApp.close()}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(244,250,248,0.35)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
}
