// src/components/SiteConfigurator.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, Undo2, Settings2, Zap, BarChart3, Sparkles, Calculator } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import SiteBusinessCard from "./SiteBusinessCard";
import SiteCorporate from "./SiteCorporate";
import SiteEcommerce from "./SiteEcommerce";
import SiteLanding from "./SiteLanding";
import SiteInfo from "./SiteInfo";
import SitePortfolio from "./SitePortfolio";


const BG    = "#07100e";
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
      <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL, letterSpacing: "0.08em", opacity: 0.7 }}>{num}</span>
      <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.35)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      borderRadius: 8, padding: "7px 10px", fontSize: 11, fontWeight: 500,
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
      borderRadius: 10, padding: "10px 12px", textAlign: "left", cursor: "pointer",
      border: "none", transition: "all 0.15s ease",
      background: active ? `${TEAL}12` : "rgba(255,255,255,0.02)",
      outline: active ? `1px solid ${TEAL}` : "1px solid rgba(255,255,255,0.07)",
      color: active ? WHITE : "rgba(244,250,248,0.5)",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 10, opacity: 0.5, lineHeight: 1.4 }}>{desc}</div>
    </button>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderRadius: 8, padding: "9px 11px", fontSize: 11, fontWeight: 500,
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
      borderRadius: 99, padding: "2px 8px", fontSize: 10,
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
          flex: 1, padding: "7px 6px", fontSize: 10, fontWeight: 500, cursor: "pointer",
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
  const [open,         setOpen]         = useState<Decision | null>(null);
  const [activePreset, setActivePreset] = useState<"start" | "content" | "ecom" | "corp" | null>("start");
  const [isMobile,     setIsMobile]     = useState(false);

  const { locale } = useI18n();
  const isEn = locale === "en";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
      setActivePreset(s.activePreset ?? "start");
    } catch {}
  }, []);

  useEffect(() => {
    const snapshot = { goal, audience, pages, ecommerce, blog, auth, multilingual, cms, deploy, needCases, activePreset };
    const id = setTimeout(() => { try { localStorage.setItem("site_config_v1", JSON.stringify(snapshot)); } catch {} }, 250);
    return () => clearTimeout(id);
  }, [goal, audience, pages, ecommerce, blog, auth, multilingual, cms, deploy, needCases, activePreset]);

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
    setCms("light"); setDeploy("cloud"); setNeedCases(false); setActivePreset("start");
  };

  const goToCalculator = () => {
    const calcState = buildCalcState({ decision, pages, ecommerce, blog, auth, multilingual, cms });
    try { localStorage.setItem("site_calc_v1", JSON.stringify(calcState)); } catch {}
    window.dispatchEvent(new CustomEvent("calc-prefill", { detail: calcState }));
    setTimeout(() => {
      document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  /* scroll lock */
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onModalClick = useCallback((e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
    if (!a?.getAttribute("href")?.startsWith("#")) return;
    e.preventDefault();
    const id = a.getAttribute("href")!.slice(1);
    setOpen(null);
    setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }, 250);
  }, []);

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
    <section id="configurator" style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: isMobile ? "80px 0 60px" : "110px 0 80px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }}/>
            <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
              {isEn ? "Configurator" : "Конфигуратор"}
            </span>
          </div>
          <h2 className={serif.className} style={{ margin: "0 0 16px", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}>
            <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: TEAL }}>
              {isEn ? "Find" : "Подберите"}
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
              {isEn ? "your ideal site" : "идеальный сайт"}
            </span>
          </h2>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 520 }}>
            {isEn
              ? "Mark your goals, audience and requirements — we'll suggest a starting configuration."
              : "Отметьте цели, аудиторию и требования — предложим стартовую конфигурацию."}
          </p>
        </motion.div>

        {/* ── 2-column grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
          gap: isMobile ? 0 : 40,
          alignItems: "start",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>

          {/* Left: controls */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            style={{ borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)", paddingRight: isMobile ? 0 : 40 }}
          >

            {/* Presets */}
            <div style={firstSectionRow}>
              <FigLabel num="01" label={isEn ? "Quick presets" : "Быстрые пресеты"}/>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 8 }}>
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
                <div style={{ fontSize: 10, color: "rgba(244,250,248,0.3)", marginBottom: 8, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {isEn ? "Main goals" : "Основные цели"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
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

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(244,250,248,0.3)", marginBottom: 8, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {isEn ? "Audience" : "Аудитория"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {(["b2c", "b2b", "internal"] as Audience[]).map(a => (
                      <Chip key={a} active={audience === a} label={a.toUpperCase()} onClick={() => setAudience(a)} />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: "rgba(244,250,248,0.3)", marginBottom: 8, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 8, marginBottom: 24 }}>
                <Toggle label="E-commerce"                                      checked={ecommerce}    onChange={setEcommerce}/>
                <Toggle label={isEn ? "Blog/news" : "Блог/новости"}            checked={blog}         onChange={setBlog}/>
                <Toggle label={isEn ? "User portal" : "Личный кабинет"}        checked={auth}         onChange={setAuth}/>
                <Toggle label={isEn ? "Multilang" : "Мультиязык"}              checked={multilingual} onChange={setMultilingual}/>
                <Toggle label={isEn ? "Cases" : "Кейсы"}                       checked={needCases}    onChange={setNeedCases}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(244,250,248,0.3)", marginBottom: 8, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>CMS</div>
                  <SegmentedControl
                    value={cms}
                    onChange={v => setCms(v as CMS)}
                    options={isEn
                      ? [["none","No CMS"],["light","Light"],["headless","Headless"]]
                      : [["none","Без CMS"],["light","Лёгкая"],["headless","Headless"]]}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(244,250,248,0.3)", marginBottom: 8, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
            style={{ position: isMobile ? "static" : "sticky", top: 88, paddingTop: isMobile ? 24 : 28, paddingBottom: 28 }}
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
                <div className={serif.className} style={{ fontSize: 26, color: WHITE, marginBottom: 4, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  {mapDecisionToTitle(decision, isEn)}
                </div>
                <div style={{ fontSize: 10, color: "rgba(244,250,248,0.35)", letterSpacing: "0.06em" }}>
                  {isEn ? "Recommended type" : "Рекомендуемый тип"}
                </div>
              </div>

              {/* Badges */}
              <div style={{ padding: "14px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {ecommerce    && <Badge>E-commerce</Badge>}
                  {blog         && <Badge>{isEn ? "Blog" : "Блог"}</Badge>}
                  {auth         && <Badge>{isEn ? "Portal" : "Кабинет"}</Badge>}
                  {multilingual && <Badge>{isEn ? "Multilang" : "Мультиязык"}</Badge>}
                  <Badge>{pages} {isEn ? "pages" : "стр"}</Badge>
                  <Badge>CMS: {cms}</Badge>
                </div>
              </div>

              {/* Logic hints */}
              <div style={{ padding: "14px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                  {(isEn ? [
                    "E-commerce → «Online store»",
                    "Content/blog → «Info website»",
                    "Quick launch → «Landing» or «Card»",
                  ] : [
                    "E-commerce → «Интернет-магазин»",
                    "Контент/блог → «Информационный»",
                    "Быстрый запуск → «Лендинг»",
                  ]).map((r, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, color: "rgba(244,250,248,0.38)" }}>
                      <CheckCircle size={11} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }}/>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={goToCalculator} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  borderRadius: 99, padding: "11px 18px", border: "none", cursor: "pointer",
                  background: TEAL, color: BG, fontSize: 13, fontWeight: 600, transition: "opacity 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.88"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                >
                  <Calculator size={14}/>
                  {isEn ? "Calculate cost" : "Рассчитать стоимость"}
                  <ArrowRight size={13}/>
                </button>
                <button onClick={resetAll} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  borderRadius: 99, padding: "9px 18px", cursor: "pointer",
                  background: "transparent", fontSize: 11, fontWeight: 500,
                  border: "none", color: "rgba(244,250,248,0.25)",
                }}>
                  <Undo2 size={12}/>
                  {isEn ? "Reset" : "Сбросить"}
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom padding */}
        <div style={{ height: isMobile ? 80 : 110 }} />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24,
              background: "rgba(7,16,14,0.88)", backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              onClick={e => { e.stopPropagation(); onModalClick(e); }}
              role="dialog" aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%", maxWidth: 960, maxHeight: "90vh",
                borderRadius: 16, overflow: "hidden",
                background: "#0d1f1c",
                border: `1px solid ${TEAL}30`,
                boxShadow: `0 0 60px ${TEAL}18`,
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL, opacity: 0.7 }}>ДЕТАЛИ</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: WHITE }}>
                    {mapDecisionToTitle(open, isEn)}
                  </h3>
                </div>
                <button onClick={() => setOpen(null)} style={{
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: "rgba(255,255,255,0.06)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(244,250,248,0.5)",
                }}>
                  <X size={14}/>
                </button>
              </div>
              <div style={{ maxHeight: "calc(90vh - 60px)", overflowY: "auto" }}>
                {open === "business-card" && <SiteBusinessCard />}
                {open === "corporate"     && <SiteCorporate />}
                {open === "ecommerce"     && <SiteEcommerce />}
                {open === "landing"       && <SiteLanding />}
                {open === "info"          && <SiteInfo />}
                {open === "portfolio"     && <SitePortfolio />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
