// src/components/MobileBenefits.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useState, useMemo, useId, useEffect, useRef } from "react";
import Script from "next/script";
import { motion, useReducedMotion, useInView } from "framer-motion";
import {
  Rocket, Smartphone, WifiOff, Bell,
  Fingerprint, ShieldCheck, ShoppingBag, BarChart3, CloudCog,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";


const BG   = "#07100e";
const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const BENEFITS_RU = [
  { icon: Rocket,      chip: "MVP",        title: "Быстрый MVP",            desc: "Первые релизы за 3–6 недель: дизайн-система, готовые модули и отлаженный пайплайн." },
  { icon: Smartphone,  chip: "UX/Perf",    title: "Нативный UX и скорость", desc: "Жесты, анимации и привычные паттерны iOS/Android. Плавные переходы и отзывчивый интерфейс." },
  { icon: WifiOff,     chip: "Offline",    title: "Offline-first",          desc: "Сценарии работают без сети: локальный кэш и очереди синхронизации." },
  { icon: Bell,        chip: "Engagement", title: "Вовлечённость",          desc: "Пуш-кампании, сегменты и deep-links для персональных сценариев." },
  { icon: Fingerprint, chip: "Auth",       title: "Безопасная авторизация", desc: "OAuth/OIDC, 2FA, Face/Touch ID, secure storage и защита токенов." },
  { icon: ShieldCheck, chip: "MASVS",      title: "Защита данных",          desc: "OWASP MASVS, TLS pinning, anti-tamper, шифрование и журналирование." },
  { icon: ShoppingBag, chip: "IAP",        title: "Монетизация",            desc: "IAP/подписки, промокоды, восстановление покупок, биллинг и чеки." },
  { icon: BarChart3,   chip: "Analytics",  title: "Аналитика и A/B",        desc: "Firebase/Amplitude/AppMetrica, атрибуция, эксперименты и отчётность." },
  { icon: CloudCog,    chip: "Ops",        title: "Релизы и поддержка",     desc: "CI/CD, TestFlight/Play Console, OTA/CodePush, мониторинг и SLA." },
] as const;

const BENEFITS_EN = [
  { icon: Rocket,      chip: "MVP",        title: "Fast MVP",               desc: "First releases in 3–6 weeks: design system, ready modules and polished pipeline." },
  { icon: Smartphone,  chip: "UX/Perf",    title: "Native UX & speed",      desc: "Gestures, animations and familiar iOS/Android patterns. Smooth transitions and responsive UI." },
  { icon: WifiOff,     chip: "Offline",    title: "Offline-first",          desc: "Scenarios work without network: local cache and sync queues." },
  { icon: Bell,        chip: "Engagement", title: "Engagement",             desc: "Push campaigns, segments and deep-links for personalised scenarios." },
  { icon: Fingerprint, chip: "Auth",       title: "Secure auth",            desc: "OAuth/OIDC, 2FA, Face/Touch ID, secure storage and token protection." },
  { icon: ShieldCheck, chip: "MASVS",      title: "Data protection",        desc: "OWASP MASVS, TLS pinning, anti-tamper, encryption and logging." },
  { icon: ShoppingBag, chip: "IAP",        title: "Monetisation",           desc: "IAP/subscriptions, promo codes, purchase restore, billing and receipts." },
  { icon: BarChart3,   chip: "Analytics",  title: "Analytics & A/B",        desc: "Firebase/Amplitude/AppMetrica, attribution, experiments and reporting." },
  { icon: CloudCog,    chip: "Ops",        title: "Releases & support",     desc: "CI/CD, TestFlight/Play Console, OTA/CodePush, monitoring and SLA." },
] as const;

const METRICS_RU = [
  { prefix: "", num: 99.8, suffix: "%",   label: "Crash-free",  note: "", dec: 1 },
  { prefix: "", num: 60,   suffix: "%",   label: "Push opt-in", note: "", dec: 0 },
  { prefix: "", num: 2,    suffix: "нед", label: "Релиз цикл",  note: "", dec: 0 },
  { prefix: "", num: 40,   suffix: "+",   label: "Модулей",     note: "", dec: 0 },
] as const;

const METRICS_EN = [
  { prefix: "", num: 99.8, suffix: "%",    label: "Stability (crash-free)", note: "", dec: 1 },
  { prefix: "", num: 60,   suffix: "%",    label: "Push opt-in rate",       note: "", dec: 0 },
  { prefix: "", num: 2,    suffix: "wks",  label: "Release cadence",        note: "", dec: 0 },
  { prefix: "", num: 40,   suffix: "+",    label: "Ready modules",          note: "", dec: 0 },
] as const;

/* ─── CountUp ─────────────────────────────────────────────────────────────── */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
function useCountUp(target: number, play: boolean, dec = 0) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!play) { setVal(target); return; }
    startRef.current = null;
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / 900);
      setVal(parseFloat((target * easeOut(p)).toFixed(dec)));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, play, dec]);
  return val;
}
function MetricCell({ m, reduced, isMobile }: { m: { prefix: string; num: number; suffix: string; label: string; note: string; dec: number }; reduced: boolean | null; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isRange = m.prefix.includes("–");
  const val = useCountUp(m.num, !isRange && !reduced && inView, m.dec);
  const display = isRange ? `${m.prefix}${m.num}${m.suffix}` : `${m.prefix}${val}${m.suffix}`;
  return (
    <div ref={ref} style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: isMobile ? "20px 8px" : "28px 20px", textAlign: "center",
      background: "rgba(255,255,255,0.02)", flex: 1,
    }}>
      <div className={serif.className} style={{ fontSize: isMobile ? "1.3rem" : "clamp(1.8rem, 3vw, 2.8rem)", color: TEAL, lineHeight: 1, marginBottom: 6 }}>
        {display}
      </div>
      <div style={{ fontSize: isMobile ? 9 : 11, color: "rgba(244,250,248,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{m.label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function MobileBenefits() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const BENEFITS = isEn ? BENEFITS_EN : BENEFITS_RU;
  const METRICS  = isEn ? METRICS_EN  : METRICS_RU;
  const reduced = useReducedMotion();
  const titleId = useId();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "Mobile app development advantages — OneStack" : "Преимущества разработки мобильных приложений OneStack",
    itemListElement: BENEFITS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Thing", name: b.title, description: b.desc },
    })),
  }), []);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <section
      id="benefits"
      aria-labelledby={titleId}
      style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
    >
      <Script id="ld-mobile-benefits" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Ambient glow */}
      <div aria-hidden style={{
        pointerEvents: "none", position: "absolute", top: -160, right: -160,
        width: 520, height: 520, borderRadius: "50%",
        background: TEAL, opacity: 0.04, willChange: "transform", transform: "translateZ(0)", filter: "blur(180px)",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div {...(fadeUp(0) as object)} style={{ padding: isMobile ? "80px 0 60px" : "110px 0 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, fontWeight: 500, color: TEAL }}>
              {isEn ? "Advantages" : "Преимущества"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", gap: 24 }}>
            <h2 id={titleId} className={serif.className} style={{ margin: 0, fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 0.92 }}>
              <span style={{ display: "block", fontSize: "clamp(2.2rem, 5vw, 4.5rem)", color: TEAL }}>
                {isEn ? "Why choose" : "Почему с нами"}
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.2rem, 5vw, 4.5rem)", color: WHITE }}>
                {isEn ? "mobile with us" : "надёжно и быстро"}
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 340, textAlign: isMobile ? "left" : "right" }}>
              {isEn
                ? <>Fixed price, MVP in 3–6 weeks. Offline, push, analytics and secure auth — in every project.</>
                : <>Фиксированная цена, MVP за 3–6 недель. Оффлайн, пуши, аналитика и безопасная авторизация — в каждом проекте.</>}
            </p>
          </div>
        </motion.div>

        {/* ── Metrics ── */}
        <motion.div
          {...(fadeUp(0.08) as object)}
          style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, overflow: "hidden", marginBottom: isMobile ? 48 : 64,
          }}
        >
          {METRICS.map((m, i) => (
            <div key={m.label} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none", display: "flex" }}>
              <MetricCell m={m} reduced={reduced} isMobile={isMobile} />
            </div>
          ))}
        </motion.div>

        {/* ── Benefits rows ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {BENEFITS.map((b, i) => (
            <BenefitRow key={b.title} {...b} index={i} delay={Math.min(0.04 * i, 0.2)} reduced={!!reduced} isMobile={isMobile} />
          ))}
        </div>

        {/* ── Results ── */}
        <MobileResultsBlock reduced={!!reduced} isEn={isEn} isMobile={isMobile} />

        {/* ── Testimonials ── */}
        <MobileTestimonialsCarousel reduced={!!reduced} isEn={isEn} isMobile={isMobile} />

        <div style={{ height: isMobile ? 80 : 110 }} />
      </div>
    </section>
  );
}

/* ─── BenefitRow ─────────────────────────────────────────────────────────── */
function BenefitRow({
  icon: Icon, title, desc, chip, index, delay, reduced, isMobile,
}: {
  icon: React.ElementType; title: string; desc: string;
  chip: string; index: number; delay: number; reduced: boolean; isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: isMobile ? "48px 1fr auto" : "64px 260px 1fr auto",
        gap: isMobile ? 12 : 32,
        alignItems: "center",
        padding: isMobile ? "20px 0 20px 16px" : "28px 0 28px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        cursor: "default",
      }}
    >
      {/* Left teal accent bar */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", left: 0, top: 0, width: 2, borderRadius: 99, background: TEAL }}
        animate={{ height: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Number + Icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 600, color: hovered ? TEAL : "rgba(255,255,255,0.2)", transition: "color 0.2s", letterSpacing: "0.04em" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.04)", border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.08)"}`, transition: "background 0.2s, border-color 0.2s" }}>
          <Icon size={15} style={{ color: hovered ? TEAL : "rgba(244,250,248,0.45)", transition: "color 0.2s" }} />
        </div>
      </div>

      {/* Title */}
      <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: hovered ? WHITE : "rgba(244,250,248,0.75)", transition: "color 0.2s" }}>
        {title}
      </div>

      {/* Description — desktop column */}
      {!isMobile && (
        <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(244,250,248,0.38)" }}>
          {desc}
        </div>
      )}

      {/* Chip */}
      <div>
        <span style={{ display: "inline-block", fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap", background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.03)", border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.07)"}`, color: hovered ? TEAL : "rgba(244,250,248,0.28)", transition: "all 0.2s" }}>
          {chip}
        </span>
      </div>

      {/* Mobile description row */}
      {isMobile && (
        <div style={{ gridColumn: "1 / -1", fontSize: 12, lineHeight: 1.65, color: "rgba(244,250,248,0.55)" }}>
          {desc}
        </div>
      )}
    </motion.div>
  );
}

/* ── MOBILE: чисто мобильные приложения ──────────────────────────────────── */
const MOBILE_TESTIMONIALS: { ru: { text: string; author: string; role: string }; en: { text: string; author: string; role: string } }[] = [
  {
    ru: { text: "Приложение для курьеров с офлайн-маршрутами и сканером штрихкодов. Работает даже в подвале склада без сигнала. Crash-free rate — 99.9%. Довольны.", author: "Тимур А.", role: "CTO, LastMile" },
    en: { text: "Courier app with offline routes and barcode scanner. Works even in a warehouse basement with no signal. Crash-free rate 99.9%. Happy with the result.", author: "Timur A.", role: "CTO, LastMile" },
  },
  {
    ru: { text: "Фитнес-приложение с тренировками, трекингом питания и push-напоминаниями. 45 000 MAU через три месяца после релиза. Push opt-in — 68%.", author: "Юлия С.", role: "Product Manager, FitPulse" },
    en: { text: "Fitness app with workouts, nutrition tracking and push reminders. 45 000 MAU three months after release. Push opt-in rate 68%.", author: "Yulia S.", role: "Product Manager, FitPulse" },
  },
  {
    ru: { text: "Мобильный кабинет для агентов страховой компании. Оформление полисов, фото повреждений, подпись клиента прямо на экране. Время оформления — минус 40%.", author: "Максим Е.", role: "Head of Sales, AlphaSure" },
    en: { text: "Mobile portal for insurance agents. Policy issuance, damage photos, client signature on screen. Processing time down 40%.", author: "Maxim E.", role: "Head of Sales, AlphaSure" },
  },
  {
    ru: { text: "Приложение для управления умным домом: свет, климат, камеры, сцены. Поддержка Matter и Zigbee. Релиз за 8 недель — быстрее, чем у конкурентов.", author: "Олег П.", role: "CEO, SmartHome+" },
    en: { text: "Smart home control app — lights, climate, cameras, scenes. Matter and Zigbee support. Released in 8 weeks — faster than any competitor.", author: "Oleg P.", role: "CEO, SmartHome+" },
  },
  {
    ru: { text: "B2C-приложение для онлайн-аптеки с рецептами, историей покупок и экспресс-доставкой. Конверсия первого заказа выросла на 28% после редизайна UX.", author: "Алина В.", role: "Digital Director, PharmaGo" },
    en: { text: "B2C app for online pharmacy — prescriptions, purchase history, express delivery. First-order conversion up 28% after UX redesign.", author: "Alina V.", role: "Digital Director, PharmaGo" },
  },
  {
    ru: { text: "Корпоративное приложение для инспекторов на производстве. Чек-листы, фото, QR, синхронизация с 1С. Ошибки при оформлении актов сократились в 4 раза.", author: "Андрей К.", role: "Quality Director, MetalPro" },
    en: { text: "Corporate app for plant inspectors — checklists, photos, QR, 1C sync. Errors in inspection reports cut fourfold.", author: "Andrey K.", role: "Quality Director, MetalPro" },
  },
  {
    ru: { text: "Приложение для детского лагеря: расписание, фото дня, обращения родителей. 1 200 установок за неделю. Никаких вопросов к AppStore-модерации.", author: "Светлана Р.", role: "Director, CampLand" },
    en: { text: "Summer camp app — timetable, daily photos, parent messages. 1 200 installs in one week. Zero App Store review issues.", author: "Svetlana R.", role: "Director, CampLand" },
  },
  {
    ru: { text: "Медицинский дневник для пациентов с хроническими заболеваниями. Напоминания о лекарствах, графики давления, синхронизация с врачом. HIPAA-уровень защиты.", author: "Иван Г.", role: "CTO, HealthLog" },
    en: { text: "Medical diary for chronic-disease patients — medication reminders, blood pressure charts, doctor sync. HIPAA-level protection.", author: "Ivan G.", role: "CTO, HealthLog" },
  },
  {
    ru: { text: "Маркетплейс услуг для домашних мастеров: заявка, геолокация, чат, оплата. iOS + Android за 10 недель. Retention после первого заказа — 61%.", author: "Кристина М.", role: "Founder, HandyPro" },
    en: { text: "Home services marketplace — request, geolocation, chat, payment. iOS + Android in 10 weeks. Post-first-order retention 61%.", author: "Kristina M.", role: "Founder, HandyPro" },
  },
  {
    ru: { text: "Приложение для сети парковок: поиск мест, бесконтактный въезд, подписка и история. Интеграция с шлагбаумами через BLE. Рейтинг в сторах — 4.8.", author: "Роман Д.", role: "Product Owner, ParkCity" },
    en: { text: "Parking network app — space search, contactless entry, subscription and history. BLE barrier integration. App store rating 4.8.", author: "Roman D.", role: "Product Owner, ParkCity" },
  },
];

const MOBILE_RESULTS = [
  { num: 50, suffix: "+",   label: { ru: "мобильных проектов", en: "mobile projects" } },
  { num: 4,  suffix: " нед",label: { ru: "средний MVP", en: "avg MVP" } },
  { num: 99, suffix: "%",   label: { ru: "crash-free rate", en: "crash-free rate" } },
  { num: 61, suffix: "%",   label: { ru: "удержание пользователей", en: "user retention" } },
];

function MobileResultCell({ num, suffix, label, reduced, isEn, isMobile }: {
  num: number; suffix: string; label: { ru: string; en: string }; reduced: boolean; isEn: boolean; isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const raf2 = useRef<number | null>(null);
  useEffect(() => {
    if (reduced || !inView) return;
    startRef.current = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / 1400);
      setVal(Math.round(num * ease(p)));
      if (p < 1) raf2.current = requestAnimationFrame(step);
    };
    raf2.current = requestAnimationFrame(step);
    return () => { if (raf2.current) cancelAnimationFrame(raf2.current); };
  }, [inView, reduced, num]);
  const display = reduced || !inView ? num : val;
  return (
    <div ref={ref} style={{ background: BG, padding: isMobile ? "28px 20px" : "36px 28px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: isMobile ? "1.8rem" : "2.6rem", lineHeight: 1, color: TEAL, display: "flex", alignItems: "baseline", gap: 4 }}>
        <span className={serif.className} style={{ fontWeight: 400, letterSpacing: "-0.03em" }}>{display}</span>
        <span style={{ fontWeight: 500, fontSize: isMobile ? "1.2rem" : "1.8rem" }}>{suffix}</span>
      </div>
      <p style={{ margin: 0, fontSize: isMobile ? 12 : 13, fontWeight: 600, color: WHITE }}>{isEn ? label.en : label.ru}</p>
    </div>
  );
}

function MobileResultsBlock({ reduced, isEn, isMobile }: { reduced: boolean; isEn: boolean; isMobile: boolean }) {
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 56 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2 }} />
        <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
          {isEn ? "Results in numbers" : "Результаты в цифрах"}
        </span>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: 1,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {MOBILE_RESULTS.map((r) => (
          <MobileResultCell key={r.label.ru} num={r.num} suffix={r.suffix} label={r.label} reduced={reduced} isEn={isEn} isMobile={isMobile} />
        ))}
      </div>
    </motion.div>
  );
}

function MobileTestimonialsCarousel({ reduced, isEn, isMobile }: { reduced: boolean; isEn: boolean; isMobile: boolean }) {
  const [active, setActive] = useState(0);
  const total = MOBILE_TESTIMONIALS.length;
  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);
  const cols = isMobile ? 1 : 3;
  const visible = Array.from({ length: cols }, (_, k) => MOBILE_TESTIMONIALS[(active + k) % total]);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 56 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2 }} />
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, fontWeight: 500, color: TEAL }}>
            {isEn ? "Client reviews" : "Отзывы клиентов"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[prev, next].map((fn, i) => (
            <button key={i} onClick={fn} aria-label={i === 0 ? "Назад" : "Вперёд"}
              style={{ width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(244,250,248,0.6)", fontSize: 16, transition: "all 0.2s" }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.background = `${TEAL}18`; b.style.borderColor = `${TEAL}40`; b.style.color = TEAL; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = "rgba(255,255,255,0.04)"; b.style.borderColor = "rgba(255,255,255,0.1)"; b.style.color = "rgba(244,250,248,0.6)"; }}
            >
              {i === 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, height: isMobile ? 280 : 240 }}>
        {visible.map((t, i) => {
          const q = isEn ? t.en : t.ru;
          return (
            <div key={`${active}-${i}`} style={{ position: "relative", overflow: "hidden", padding: isMobile ? "32px 24px" : "40px 32px", borderRadius: 16, border: `1px solid ${i === 0 ? TEAL + "25" : "rgba(255,255,255,0.07)"}`, background: i === 0 ? `linear-gradient(135deg, ${TEAL}0a 0%, transparent 60%)` : "rgba(255,255,255,0.02)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className={serif.className} aria-hidden style={{ position: "absolute", top: 4, left: 20, fontSize: "5rem", lineHeight: 1, pointerEvents: "none", userSelect: "none" as const, color: i === 0 ? `${TEAL}18` : "rgba(255,255,255,0.05)" }}>"</div>
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <p className={serif.className} style={{ margin: "0 0 24px", fontSize: isMobile ? 16 : 15, fontWeight: 400, lineHeight: 1.55, letterSpacing: "-0.01em", color: i === 0 ? "rgba(244,250,248,0.9)" : "rgba(244,250,248,0.65)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                  {q.text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 20, height: 2, background: i === 0 ? TEAL : "rgba(255,255,255,0.2)", borderRadius: 2 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: i === 0 ? WHITE : "rgba(244,250,248,0.55)" }}>{q.author}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "rgba(244,250,248,0.3)" }}>{q.role}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
        {MOBILE_TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Отзыв ${i + 1}`}
            style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 99, border: "none", cursor: "pointer", background: i === active ? TEAL : "rgba(255,255,255,0.15)", transition: "all 0.3s", padding: 0 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
