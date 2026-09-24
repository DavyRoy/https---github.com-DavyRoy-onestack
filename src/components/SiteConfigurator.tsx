// src/components/SiteConfigurator.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Undo2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";


const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

type Goal     = "start" | "present" | "sell" | "content" | "leads" | "brand";
type Audience = "b2c" | "b2b" | "internal";
type CMS      = "none" | "light" | "headless";
type Deploy   = "cloud" | "local" | "none";
type Decision = "business-card" | "corporate" | "ecommerce" | "landing" | "info" | "portfolio";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function decideKind(opts: {
  goal: Goal[]; audience: Audience; pages: number;
  ecommerce: boolean; blog: boolean; auth: boolean;
  multilingual: boolean; cms: CMS; deploy: Deploy; needCases: boolean;
}): Decision {
  const { goal, pages, ecommerce, blog, auth, multilingual, cms, needCases } = opts;
  if (ecommerce) return "ecommerce";
  if (goal.includes("content") || blog) return "info";
  if (needCases) return "portfolio";
  if (goal.includes("leads") || goal.includes("start")) {
    if (pages <= 6 && !auth && !multilingual) return "landing";
  }
  if (pages > 8 || multilingual || auth || cms === "headless") return "corporate";
  if (pages <= 6) return "business-card";
  return "corporate";
}

function mapDecisionToTitle(d: Decision, isEn: boolean) {
  if (isEn) switch (d) {
    case "business-card": return "Business card site";
    case "corporate":     return "Corporate website";
    case "ecommerce":     return "Online store";
    case "landing":       return "Landing page";
    case "info":          return "Info website";
    case "portfolio":     return "Portfolio";
    default:              return "Website";
  }
  switch (d) {
    case "business-card": return "Сайт-визитка";
    case "corporate":     return "Корпоративный сайт";
    case "ecommerce":     return "Интернет-магазин";
    case "landing":       return "Лендинг";
    case "info":          return "Информационный сайт";
    case "portfolio":     return "Портфолио";
    default:              return "Сайт";
  }
}

const BUDGET: Record<Decision, { ru: string; en: string; time: string; timeEn: string }> = {
  "landing":       { ru: "от 120 000 ₽", en: "from $1,360", time: "1–2 нед", timeEn: "1–2 wks" },
  "business-card": { ru: "от 64 000 ₽",  en: "from $720",   time: "1–2 нед", timeEn: "1–2 wks" },
  "corporate":     { ru: "от 336 000 ₽", en: "from $3,760", time: "3–6 нед", timeEn: "3–6 wks" },
  "ecommerce":     { ru: "от 576 000 ₽", en: "from $6,400", time: "4–8 нед", timeEn: "4–8 wks" },
  "info":          { ru: "от 224 000 ₽", en: "from $2,480", time: "2–4 нед", timeEn: "2–4 wks" },
  "portfolio":     { ru: "от 96 000 ₽",  en: "from $1,040", time: "1–3 нед", timeEn: "1–3 wks" },
};

/* Map configurator Decision → calculator SiteKind + prefill */
function buildCalcState(opts: {
  decision: Decision; pages: number; ecommerce: boolean;
  blog: boolean; auth: boolean; multilingual: boolean; cms: CMS;
}) {
  const kindMap: Record<Decision, string> = {
    "business-card": "business",
    "corporate":     "corporate",
    "ecommerce":     "ecommerce",
    "landing":       "landing",
    "info":          "content",
    "portfolio":     "portfolio",
  };
  return {
    kind:         kindMap[opts.decision],
    pages:        opts.pages,
    design:       opts.ecommerce ? "brand" : opts.multilingual ? "pro" : "pro",
    speed:        "normal",
    blog:         opts.blog,
    auth:         opts.auth,
    forms:        true,
    catalog:      opts.ecommerce,
    payments:     opts.ecommerce,
    delivery:     opts.ecommerce,
    crm:          opts.ecommerce || opts.decision === "corporate",
    search:       true,
    analytics:    true,
    animation:    false,
    integrations: opts.multilingual || opts.decision === "corporate",
    seo:          opts.decision === "ecommerce" || opts.decision === "corporate" ? "pro" : "lite",
    hosting:      "cloud",
    useCI:        true,
    support:      opts.decision === "ecommerce" || opts.decision === "corporate" ? "pro" : "basic",
  };
}

/* ── UI primitives ──────────────────────────────────────────────────────── */

function FigLabel({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, color: TEAL, letterSpacing: "0.08em", opacity: 0.7 }}>{num}</span>
      <span style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.4)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      borderRadius: 10, padding: "10px 12px", fontSize: 14, fontWeight: 500,
      cursor: "pointer", border: "none", transition: "all 0.15s ease",
      background: active ? `${TEAL}18` : "rgba(255,255,255,0.03)",
      color: active ? TEAL : "rgba(244,250,248,0.45)",
      outline: active ? `1px solid ${TEAL}` : "1px solid rgba(255,255,255,0.08)",
    }}>
      {label}
    </button>
  );
}

function PresetCard({ title, desc, active, onClick }: { title: string; desc: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      borderRadius: 12, padding: "14px 16px", textAlign: "left", cursor: "pointer",
      border: "none", transition: "all 0.15s ease",
      background: active ? `${TEAL}12` : "rgba(255,255,255,0.02)",
      outline: active ? `1px solid ${TEAL}` : "1px solid rgba(255,255,255,0.07)",
      color: active ? WHITE : "rgba(244,250,248,0.5)",
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.4 }}>{desc}</div>
    </button>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderRadius: 10, padding: "11px 14px", fontSize: 14, fontWeight: 500,
      cursor: "pointer", border: "none", transition: "all 0.15s ease",
      background: checked ? `${TEAL}12` : "rgba(255,255,255,0.02)",
      color: checked ? TEAL : "rgba(244,250,248,0.45)",
      outline: checked ? `1px solid ${TEAL}45` : "1px solid rgba(255,255,255,0.07)",
    }}>
      <span>{label}</span>
      <span style={{
        display: "inline-flex", alignItems: "center",
        width: 32, height: 18, borderRadius: 9, marginLeft: 8, flexShrink: 0,
        background: checked ? TEAL : "rgba(255,255,255,0.1)", transition: "background 0.2s",
      }}>
        <span style={{
          width: 12, height: 12, borderRadius: "50%", background: WHITE,
          marginLeft: 3, transition: "transform 0.2s",
          transform: checked ? "translateX(14px)" : "translateX(0)",
        }}/>
      </span>
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      borderRadius: 99, padding: "3px 10px", fontSize: 13,
      background: `${TEAL}12`, border: `1px solid ${TEAL}20`, color: TEAL,
    }}>
      {children}
    </span>
  );
}

function SegmentedControl({
  options, value, onChange,
}: { options: [string, string][]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      display: "flex", borderRadius: 8, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)",
    }}>
      {options.map(([val, lbl]) => (
        <button key={val} onClick={() => onChange(val)} style={{
          flex: 1, padding: "10px 8px", fontSize: 13, fontWeight: 500, cursor: "pointer",
          border: "none", borderRight: "1px solid rgba(255,255,255,0.08)",
          background: value === val ? `${TEAL}18` : "transparent",
          color: value === val ? TEAL : "rgba(244,250,248,0.4)",
          transition: "all 0.15s ease",
        }}>{lbl}</button>
      ))}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function SiteConfigurator() {
  const [goal,         setGoal]         = useState<Goal[]>(["start"]);
  const [audience,     setAudience]     = useState<Audience>("b2c");
  const [pages,        setPages]        = useState<number>(4);
  const [ecommerce,    setEcommerce]    = useState(false);
  const [blog,         setBlog]         = useState(false);
  const [auth,         setAuth]         = useState(false);
  const [multilingual, setMultilingual] = useState(false);
  const [cms,          setCms]          = useState<CMS>("light");
  const [deploy,       setDeploy]       = useState<Deploy>("cloud");
  const [needCases,    setNeedCases]    = useState(false);
  const [ai,           setAi]           = useState(false);
  const [activePreset, setActivePreset] = useState<"start" | "content" | "ecom" | "corp" | null>("start");

  const { locale } = useI18n();
  const isEn = locale === "en";


  /* Autosave / load */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("site_config_v1");
      if (!raw) return;
      const s = JSON.parse(raw);
      setGoal(Array.isArray(s.goal) ? s.goal : ["start"]);
      setAudience(s.audience ?? "b2c");
      setPages(clamp(Number(s.pages ?? 4), 1, 60));
      setEcommerce(!!s.ecommerce);
      setBlog(!!s.blog);
      setAuth(!!s.auth);
      setMultilingual(!!s.multilingual);
      setCms(s.cms ?? "light");
      setDeploy(s.deploy ?? "cloud");
      setNeedCases(!!s.needCases);
      setAi(!!s.ai);
      setActivePreset(s.activePreset ?? "start");
    } catch {}
  }, []);

  useEffect(() => {
    const snapshot = { goal, audience, pages, ecommerce, blog, auth, multilingual, cms, deploy, needCases, ai, activePreset };
    const id = setTimeout(() => { try { localStorage.setItem("site_config_v1", JSON.stringify(snapshot)); } catch {} }, 250);
    return () => clearTimeout(id);
  }, [goal, audience, pages, ecommerce, blog, auth, multilingual, cms, deploy, needCases, ai, activePreset]);

  const decision = useMemo(() =>
    decideKind({ goal, audience, pages, ecommerce, blog, auth, multilingual, cms, deploy, needCases }),
    [goal, audience, pages, ecommerce, blog, auth, multilingual, cms, deploy, needCases]
  );

  const applyPreset = (k: "start" | "content" | "ecom" | "corp") => {
    setActivePreset(k);
    if (k === "start") {
      setGoal(["start", "leads"]); setAudience("b2c"); setPages(4);
      setEcommerce(false); setBlog(false); setAuth(false); setMultilingual(false);
      setCms("light"); setDeploy("cloud"); setNeedCases(false);
    } else if (k === "content") {
      setGoal(["content", "brand"]); setAudience("b2c"); setPages(12);
      setEcommerce(false); setBlog(true); setAuth(false); setMultilingual(true);
      setCms("headless"); setDeploy("cloud"); setNeedCases(false);
    } else if (k === "ecom") {
      setGoal(["sell", "brand"]); setAudience("b2c"); setPages(10);
      setEcommerce(true); setBlog(false); setAuth(true); setMultilingual(true);
      setCms("headless"); setDeploy("cloud"); setNeedCases(false);
    } else {
      setGoal(["present", "brand"]); setAudience("b2b"); setPages(14);
      setEcommerce(false); setBlog(true); setAuth(true); setMultilingual(true);
      setCms("headless"); setDeploy("cloud"); setNeedCases(false);
    }
  };

  const resetAll = () => {
    setGoal(["start"]); setAudience("b2c"); setPages(4);
    setEcommerce(false); setBlog(false); setAuth(false); setMultilingual(false);
    setCms("light"); setDeploy("cloud"); setNeedCases(false); setAi(false); setActivePreset("start");
  };

  const goToCalculator = () => {
    const calcState = { ...buildCalcState({ decision, pages, ecommerce, blog, auth, multilingual, cms }), ai };
    try { localStorage.setItem("site_calc_v1", JSON.stringify(calcState)); } catch {}
    window.dispatchEvent(new CustomEvent("calc-prefill", { detail: calcState }));
  };

  /* Section row style */
  const sectionRow: React.CSSProperties = {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: 36,
    paddingBottom: 36,
  };

  const firstSectionRow: React.CSSProperties = {
    paddingTop: 36,
    paddingBottom: 36,
  };

  return (
    <section id="configurator" className="site-types" aria-labelledby="configurator-title">
      <div className="site-types__inner">

        <div className="site-types__head">
          <div>
            <p className="service-eyebrow">{isEn ? "03 / Configurator" : "03 / Конфигуратор"}</p>
            <h2 id="configurator-title" className={`${serif.className} site-types__title`}>
              {isEn ? <>Find<br />your ideal site</> : <>Подберите<br />идеальный сайт</>}
            </h2>
          </div>
          <p className="site-types__sub">
            {isEn
              ? "Mark your goals and requirements — we'll suggest a format and budget."
              : "Отметьте цели и требования — предложим формат и бюджет."}
          </p>
        </div>

        {/* ── 2-column grid ── */}
        <div className="calc-grid" style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>

          {/* Left: controls */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="calc-controls"
          >

            {/* Presets */}
            <div style={firstSectionRow}>
              <FigLabel num="01" label={isEn ? "Quick presets" : "Быстрые пресеты"}/>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
                {(isEn ? [
                  ["start",   "Quick launch",    "Great for a start"],
                  ["content", "Content project", "Blogs and media"],
                  ["ecom",    "E-commerce",      "Online stores"],
                  ["corp",    "Corporate",       "For companies"],
                ] : [
                  ["start",   "Быстрый запуск",  "Идеально для старта"],
                  ["content", "Контент-проект",  "Блоги и медиа"],
                  ["ecom",    "E-commerce",      "Интернет-магазины"],
                  ["corp",    "Корпоративный",   "Для компаний"],
                ] as const).map(([key, title, desc]) => (
                  <PresetCard key={key} title={title} desc={desc} active={activePreset === key}
                    onClick={() => applyPreset(key as "start"|"content"|"ecom"|"corp")} />
                ))}
              </div>
            </div>

            {/* Goals & audience */}
            <div style={sectionRow}>
              <FigLabel num="02" label={isEn ? "Goals & audience" : "Цели и аудитория"}/>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: "rgba(244,250,248,0.4)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {isEn ? "Main goals" : "Основные цели"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                  {((isEn ? [
                    ["start",   "Quick start/MVP"],
                    ["present", "Present company"],
                    ["sell",    "Sell online"],
                    ["content", "Publish content"],
                    ["leads",   "Generate leads"],
                    ["brand",   "Brand/image"],
                  ] : [
                    ["start",   "Быстрый старт"],
                    ["present", "Представить компанию"],
                    ["sell",    "Продавать онлайн"],
                    ["content", "Публиковать контент"],
                    ["leads",   "Собирать лиды"],
                    ["brand",   "Имидж/бренд"],
                  ]) as [Goal, string][]).map(([val, lbl]) => (
                    <Chip key={val} active={goal.includes(val)} label={lbl}
                      onClick={() => setGoal(g => g.includes(val) ? g.filter(x => x !== val) : [...g, val])} />
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(244,250,248,0.4)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {isEn ? "Audience" : "Аудитория"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
                    {(["b2c", "b2b", "internal"] as Audience[]).map(a => (
                      <Chip key={a} active={audience === a} label={a.toUpperCase()} onClick={() => setAudience(a)} />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "rgba(244,250,248,0.4)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {isEn ? "Pages:" : "Страниц:"} <span style={{ color: TEAL }}>{pages}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => setPages(p => clamp(p - 1, 1, 60))} style={{
                      width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
                      background: "transparent", color: "rgba(244,250,248,0.5)", cursor: "pointer",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>–</button>
                    <input type="range" min={1} max={60} value={pages}
                      onChange={e => setPages(clamp(parseInt(e.target.value) || 1, 1, 60))}
                      style={{
                        flex: 1, height: 3, accentColor: TEAL, cursor: "pointer",
                        background: `linear-gradient(to right, ${TEAL} ${(pages/60)*100}%, rgba(255,255,255,0.1) 0%)`,
                        borderRadius: 4, appearance: "none" as const, WebkitAppearance: "none" as const,
                      }}
                    />
                    <button onClick={() => setPages(p => clamp(p + 1, 1, 60))} style={{
                      width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
                      background: "transparent", color: "rgba(244,250,248,0.5)", cursor: "pointer",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{ ...sectionRow, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <FigLabel num="03" label={isEn ? "Features & settings" : "Функции и настройки"}/>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 24 }}>
                <Toggle label="E-commerce"                                      checked={ecommerce}    onChange={setEcommerce}/>
                <Toggle label={isEn ? "Blog/news" : "Блог/новости"}            checked={blog}         onChange={setBlog}/>
                <Toggle label={isEn ? "User portal" : "Личный кабинет"}        checked={auth}         onChange={setAuth}/>
                <Toggle label={isEn ? "Multilang" : "Мультиязык"}              checked={multilingual} onChange={setMultilingual}/>
                <Toggle label={isEn ? "Cases" : "Кейсы"}                       checked={needCases}    onChange={setNeedCases}/>
                <Toggle label={isEn ? "AI assistant" : "AI-ассистент"}          checked={ai}           onChange={setAi}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(244,250,248,0.4)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>CMS</div>
                  <SegmentedControl
                    value={cms}
                    onChange={v => setCms(v as CMS)}
                    options={isEn
                      ? [["none","No CMS"],["light","Light"],["headless","Headless"]]
                      : [["none","Без CMS"],["light","Лёгкая"],["headless","Headless"]]}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(244,250,248,0.4)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {isEn ? "Deploy" : "Развёртывание"}
                  </div>
                  <SegmentedControl
                    value={deploy}
                    onChange={v => setDeploy(v as Deploy)}
                    options={isEn
                      ? [["cloud","Cloud"],["local","On-prem"],["none","None"]]
                      : [["cloud","Облако"],["local","On-prem"],["none","Без деплоя"]]}
                  />
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right: recommendation panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="calc-panel"
          >
            {/* Panel top label */}
            <FigLabel num="REC" label={isEn ? "Recommendation" : "Рекомендация"}/>

            {/* Recommendation card */}
            <div style={{
              background: `${TEAL}06`,
              border: `1px solid ${TEAL}20`,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              {/* Result header */}
              <div style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div className={serif.className} style={{ fontSize: 30, fontWeight: 700, color: WHITE, marginBottom: 6, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {mapDecisionToTitle(decision, isEn)}
                </div>
                <div style={{ fontSize: 13, color: "rgba(244,250,248,0.45)" }}>
                  {isEn ? "Recommended type" : "Рекомендуемый тип"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                  <span className="site-type__price">{isEn ? BUDGET[decision].en : BUDGET[decision].ru}</span>
                  <span className="site-type__time">{isEn ? BUDGET[decision].timeEn : BUDGET[decision].time}</span>
                </div>
                {ai && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 14, fontSize: 14, lineHeight: 1.5, color: "rgba(244,250,248,0.6)" }}>
                    <Sparkles size={15} style={{ color: TEAL, flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
                    {isEn
                      ? "+ AI assistant: chatbot, smart search or lead scoring — priced on request"
                      : "+ AI-ассистент: чат-бот, умный поиск или скоринг заявок — стоимость по запросу"}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div style={{ padding: "14px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {ecommerce    && <Badge>E-commerce</Badge>}
                  {blog         && <Badge>{isEn ? "Blog" : "Блог"}</Badge>}
                  {auth         && <Badge>{isEn ? "Portal" : "Кабинет"}</Badge>}
                  {multilingual && <Badge>{isEn ? "Multilang" : "Мультиязык"}</Badge>}
                  {ai           && <Badge>AI</Badge>}
                  <Badge>{pages} {isEn ? "pages" : "стр"}</Badge>
                  <Badge>CMS: {cms}</Badge>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                <button type="button" onClick={goToCalculator} className="service-button service-button--primary">
                  {isEn ? "Calculate cost" : "Рассчитать стоимость"}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </button>
                <button onClick={resetAll} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  borderRadius: 99, padding: "9px 18px", cursor: "pointer",
                  background: "transparent", fontSize: 14, fontWeight: 500,
                  border: "none", color: "rgba(244,250,248,0.4)",
                }}>
                  <Undo2 size={12}/>
                  {isEn ? "Reset" : "Сбросить"}
                </button>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

    </section>
  );
}
