// src/components/WebAppCalculator.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  Info, Sparkles, Layers, Cpu, Database, ShieldCheck,
  Wrench, GitBranch, Link as LinkIcon, Server, Clock3,
  Users2, LockKeyhole, Zap, Workflow, Folder, BarChart3,
  CreditCard, Bell, Radio, HardDrive, Languages,
  Wallet, Activity, KeyRound, ChevronRight, Percent
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuote } from "@/app/context/QuoteContext";

/* ================= types ================= */
type AppKind = "crm" | "portal" | "client" | "analytics" | "b2b" | "saas";
type DesignLevel = "basic" | "pro" | "brand";
type Speed = "normal" | "fast";
type Hosting = "none" | "cloud" | "vps";
type Support = "none" | "basic" | "pro";

const fade = (d=0)=>({initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},transition:{duration:0.45,delay:d},viewport:{once:true,amount:0.2}});

/* ================= pricing ================= */
const PRICING = {
  base: {
    crm:       780_000,
    portal:    590_000,
    client:    520_000,
    analytics: 700_000,
    b2b:       620_000,
    saas:      940_000,
  },
  scope: { included: 10, perUnit: 25_000 },
  design: { basic:1.0, pro:1.22, brand:1.45 },
  features: {
    rbac:95_000, sso:78_000, audit:65_000, notifications:52_000, realtime:88_000,
    queues:75_000, storage:48_000, extIntegr:62_000, payments:90_000, subscriptions:82_000,
    reports:68_000, i18n:52_000,
  },
  infra: {
    hosting: { none:{monthly:0,setup:0}, cloud:{monthly:11_000,setup:22_000}, vps:{monthly:9_000,setup:32_000} },
    db:{monthly:5_000,setup:7_500},
    cache:{monthly:3_000,setup:5_500},
    observ:{monthly:3_500,setup:7_000},
    ci:{monthly:3_500,setup:15_000},
    domains:{monthly:500,setup:2_500},
  },
  support: { none:0, basic:35_000, pro:80_000 },
  speedMultiplier: { normal:1.0, fast:1.25 },
  discounts: { saasBilling:0.90, analyticsPack:0.92 },
} as const;

/* ================= helpers ================= */
function clamp(n:number,min:number,max:number){return Math.max(min,Math.min(max,n));}
function fmt(n:number){return n.toLocaleString("ru-RU")+" ₽";}
function mapKind(k:AppKind){
  switch(k){
    case "crm": return "CRM / ERP";
    case "portal": return "Внутренний портал";
    case "client": return "Кабинет клиента";
    case "analytics": return "Аналитическая панель";
    case "b2b": return "B2B-витрина";
    case "saas": return "SaaS-сервис";
  }
}
function mapDesign(d:DesignLevel){return d==="basic"?"Базовый":d==="pro"?"Pro":"Branded";}

/* ===== анимированные числа ===== */
function useCountUp(value: number) {
  const s = useSpring(value, { stiffness: 120, damping: 20, mass: 0.6 });
  useEffect(()=>{ s.set(value); }, [value, s]);
  const rounded = useTransform(s, (v)=>Math.round(v));
  return rounded;
}
function CountUp({ value }: { value:number }) {
  const a = useCountUp(value);
  const [v, setV] = useState(value);
  useEffect(()=>{ const u = a.on("change", n=>setV(n)); return ()=>u(); }, [a]);
  return <span className="tabular-nums">{v.toLocaleString("ru-RU")}</span>;
}

/* ================= component ================= */
export default function WebAppCalculator(){
  const router = useRouter();
  const { setQuote } = useQuote();

  const [kind,setKind]=useState<AppKind>("client");
  const [scope,setScope]=useState(10);
  const [design,setDesign]=useState<DesignLevel>("pro");
  const [speed,setSpeed]=useState<Speed>("normal");

  // modules
  const [rbac,setRbac]=useState(true);
  const [sso,setSso]=useState(false);
  const [audit,setAudit]=useState(true);
  const [notifications,setNotifications]=useState(true);
  const [realtime,setRealtime]=useState(false);
  const [queues,setQueues]=useState(true);
  const [storage,setStorage]=useState(true);
  const [extIntegr,setExtIntegr]=useState(false);
  const [payments,setPayments]=useState(false);
  const [subscriptions,setSubscriptions]=useState(false);
  const [reports,setReports]=useState(false);
  const [i18n,setI18n]=useState(false);

  // infra
  const [hosting,setHosting]=useState<Hosting>("cloud");
  const [useDB,setUseDB]=useState(true);
  const [useCache,setUseCache]=useState(true);
  const [useObserv,setUseObserv]=useState(true);
  const [useCI,setUseCI]=useState(true);
  const [support,setSupport]=useState<Support>("basic");

  /* ===== autosave/load ===== */
  useEffect(()=>{
    try{
      const raw = localStorage.getItem("webapp_calc_v1");
      if(!raw) return;
      const s = JSON.parse(raw);
      setKind(s.kind ?? "client");
      setScope(s.scope ?? 10);
      setDesign(s.design ?? "pro");
      setSpeed(s.speed ?? "normal");

      setRbac(!!s.rbac); setSso(!!s.sso); setAudit(!!s.audit);
      setNotifications(!!s.notifications); setRealtime(!!s.realtime);
      setQueues(!!s.queues); setStorage(!!s.storage); setExtIntegr(!!s.extIntegr);
      setPayments(!!s.payments); setSubscriptions(!!s.subscriptions);
      setReports(!!s.reports); setI18n(!!s.i18n);

      setHosting(s.hosting ?? "cloud"); setUseDB(s.useDB ?? true);
      setUseCache(s.useCache ?? true); setUseObserv(s.useObserv ?? true);
      setUseCI(s.useCI ?? true); setSupport(s.support ?? "basic");
    }catch{}
  },[]);
  useEffect(()=>{
    const s = {
      kind, scope, design, speed,
      rbac,sso,audit,notifications,realtime,queues,storage,extIntegr,payments,subscriptions,reports,i18n,
      hosting,useDB,useCache,useObserv,useCI, support
    };
    try{ localStorage.setItem("webapp_calc_v1", JSON.stringify(s)); }catch{}
  },[
    kind,scope,design,speed,
    rbac,sso,audit,notifications,realtime,queues,storage,extIntegr,payments,subscriptions,reports,i18n,
    hosting,useDB,useCache,useObserv,useCI, support
  ]);

  /* ===== calculation ===== */
  const result = useMemo(()=>{
    const base = PRICING.base[kind];

    const extraUnits = clamp(scope - PRICING.scope.included, 0, 500);
    const scopeCost  = extraUnits * PRICING.scope.perUnit;

    const designK = PRICING.design[design];

    let features = 0;
    features += rbac ? PRICING.features.rbac : 0;
    features += sso ? PRICING.features.sso : 0;
    features += audit ? PRICING.features.audit : 0;
    features += notifications ? PRICING.features.notifications : 0;
    features += realtime ? PRICING.features.realtime : 0;
    features += queues ? PRICING.features.queues : 0;
    features += storage ? PRICING.features.storage : 0;
    features += extIntegr ? PRICING.features.extIntegr : 0;
    features += payments ? PRICING.features.payments : 0;
    features += subscriptions ? PRICING.features.subscriptions : 0;
    features += reports ? PRICING.features.reports : 0;
    features += i18n ? PRICING.features.i18n : 0;

    const infraSetup =
      PRICING.infra.hosting[hosting].setup +
      (useDB ? PRICING.infra.db.setup : 0) +
      (useCache ? PRICING.infra.cache.setup : 0) +
      (useObserv ? PRICING.infra.observ.setup : 0) +
      (useCI ? PRICING.infra.ci.setup : 0) +
      PRICING.infra.domains.setup;

    const infraMonthly =
      PRICING.infra.hosting[hosting].monthly +
      (useDB ? PRICING.infra.db.monthly : 0) +
      (useCache ? PRICING.infra.cache.monthly : 0) +
      (useObserv ? PRICING.infra.observ.monthly : 0) +
      (useCI ? PRICING.infra.ci.monthly : 0) +
      PRICING.infra.domains.monthly +
      PRICING.support[support];

    let discountK = 1;
    if (kind==="saas" && payments && subscriptions) discountK *= PRICING.discounts.saasBilling;
    if (kind==="analytics" && reports && realtime)  discountK *= PRICING.discounts.analyticsPack;

    const speedK = PRICING.speedMultiplier[speed];

    const oneOffRaw = (base + scopeCost) * designK + features + infraSetup;
    const oneOff = Math.round(oneOffRaw * speedK * discountK);

    return {
      breakdown: { base, scopeCost, designK, features, infraSetup, discountK, speedK },
      oneOff,
      monthly: infraMonthly,
      discountApplied: discountK !== 1,
    };
  },[
    kind, scope, design, speed,
    rbac,sso,audit,notifications,realtime,queues,storage,extIntegr,payments,subscriptions,reports,i18n,
    hosting,useDB,useCache,useObserv,useCI,support
  ]);

  /* ===== JSON-LD ===== */
  const jsonLd = useMemo(()=>({
    "@context":"https://schema.org",
    "@type":"Service",
    name:`Разработка веб-приложения — ${mapKind(kind)}`,
    serviceType:"Web application development",
    areaServed:"RU",
    provider:{ "@type":"Organization", name:"OneStack", url:"https://onestack.dev" },
    offers:{
      "@type":"AggregateOffer",
      priceCurrency:"RUB",
      highPrice: result.oneOff,
      lowPrice: Math.max(1, Math.round(result.oneOff*0.8)),
      offerCount: 1,
      offers: [
        { "@type":"Offer", priceCurrency:"RUB", price: result.oneOff, category:"One-time setup" },
        { "@type":"Offer", priceCurrency:"RUB", price: result.monthly, category:"Monthly infrastructure & support" },
      ],
    },
    additionalType:"http://www.productontology.org/id/Web_application",
  }),[kind,result.oneOff,result.monthly]);

  // chips list
  const selectedModules = [
    rbac&&"RBAC/ABAC", sso&&"SSO", audit&&"Аудит", notifications&&"Уведомления",
    realtime&&"Realtime", queues&&"Очереди", storage&&"Файлы", extIntegr&&"Интеграции",
    payments&&"Платежи", subscriptions&&"Подписки", reports&&"Отчёты", i18n&&"i18n",
  ].filter(Boolean) as string[];

  // save and go
  const goToContactWithQuote = () => {
    setQuote?.({
      source: "webapp-calculator",
      createdAt: new Date().toISOString(),
      kind, scope, design, speed, hosting, support,
      oneOff: result.oneOff,
      monthly: result.monthly,
      modules: { rbac,sso,audit,notifications,realtime,queues,storage,extIntegr,payments,subscriptions,reports,i18n },
      infra: { useDB,useCache,useObserv,useCI },
      breakdown: {
        base: result.breakdown.base,
        scopeCost: result.breakdown.scopeCost,
        designK: `x${result.breakdown.designK}`,
        features: result.breakdown.features,
        infraSetup: result.breakdown.infraSetup,
        discountK: `x${result.breakdown.discountK}`,
        speedK: `x${result.breakdown.speedK}`,
      },
    });
    router.push("#contact");
  };

  return (
    <section
      id="calculator"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="calc-title"
    >
      {/* soft glows */}
      <div aria-hidden className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl"/>
      <div aria-hidden className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl"/>

      {/* container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p {...fade(0)} className="text-sm uppercase tracking-[0.25em] text-white/60 mb-3 text-left">
          калькулятор
        </motion.p>
        <motion.h2 id="calc-title" {...fade(0.05)} className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl">
          Калькулятор стоимости — веб-приложения
        </motion.h2>
        <motion.p {...fade(0.1)} className="mt-4 text-white/80 max-w-3xl text-left">
          Выберите параметры. Под каждым пунктом — короткое объяснение, чтобы быстрее понять, что включать. Финальную смету утвердим после короткого брифа.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
          {/* LEFT: controls */}
          <motion.div {...fade(0.12)} className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            {/* Тип */}
            <SectionTitle icon={<Layers className="h-4 w-4" />} title="Тип приложения" />
            <p className="mt-1.5 text-xs text-white/65">Влияет на базовую стоимость и ожидаемый набор модулей.</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                ["client","Кабинет","Кабинет клиента"],
                ["crm","CRM/ERP","CRM / ERP"],
                ["portal","Портал","Внутренний портал"],
                ["analytics","Аналитика","Аналитика"],
                ["b2b","B2B","B2B-витрина"],
                ["saas","SaaS","SaaS-сервис"],
              ] as [AppKind,string,string][]).map(([key,mobile,desktop])=>(
                <Chip key={key} active={kind===key} onClick={()=>setKind(key)} mobile={mobile} desktop={desktop}/>
              ))}
            </div>

            {/* Объём и дизайн */}
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div>
                <SectionTitle icon={<Cpu className="h-4 w-4" />} title="Объём функционала" />
                <p className="mt-1.5 text-xs text-white/65">Сколько модулей сверх ядра. База включает 10.</p>
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" className="rounded-full border border-white/25 px-2.5 py-1.5 hover:bg-white/10" aria-label="Меньше фич" onClick={()=>setScope(s=>Math.max(1,s-1))}>–</button>
                  <input type="range" min={1} max={60} value={scope} onChange={e=>setScope(parseInt(e.target.value))} className="w-full accent-white" aria-label="Объём фич"/>
                  <button type="button" className="rounded-full border border-white/25 px-2.5 py-1.5 hover:bg-white/10" aria-label="Больше фич" onClick={()=>setScope(s=>Math.min(60,s+1))}>+</button>
                  <div className="w-16 text-right font-semibold"><CountUp value={scope} /></div>
                </div>
              </div>
              <div>
                <SectionTitle icon={<Sparkles className="h-4 w-4" />} title="Уровень дизайна" />
                <p className="mt-1.5 text-xs text-white/65"><b>Базовый</b> — быстрее; <b>Pro</b> — больше состояний; <b>Branded</b> — фирменный стиль.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([["basic","База","Базовый"],["pro","Pro","Pro"],["brand","Brand","Branded"]] as [DesignLevel,string,string][])
                    .map(([k,m,desk])=>(
                      <Chip key={k} active={design===k} onClick={()=>setDesign(k)} mobile={m} desktop={desk}/>
                  ))}
                </div>
              </div>
            </div>

            {/* Функциональность */}
            <div className="mt-4">
              <SectionTitle icon={<LockKeyhole className="h-4 w-4" />} title="Безопасность и доступ" />
              <p className="mt-1.5 text-xs text-white/65">Базовые требования к доступу, журналам и ролям.</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <Toggle label="Роли/права" value={rbac} onChange={setRbac} icon={<Users2 className="h-4 w-4 mr-2" />}/>
                <Toggle label="SSO" value={sso} onChange={setSso} icon={<KeyRound className="h-4 w-4 mr-2" />}/>
                <Toggle label="Аудит" value={audit} onChange={setAudit} icon={<ShieldCheck className="h-4 w-4 mr-2" />}/>
              </div>

              <div className="mt-6">
                <SectionTitle icon={<Zap className="h-4 w-4" />} title="Коммуникации и realtime" />
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Toggle label="Push" value={notifications} onChange={setNotifications} icon={<Bell className="h-4 w-4 mr-2" />}/>
                  <Toggle label="Live-update" value={realtime} onChange={setRealtime} icon={<Radio className="h-4 w-4 mr-2" />}/>
                  <Toggle label="Очереди" value={queues} onChange={setQueues} icon={<Workflow className="h-4 w-4 mr-2" />}/>
                </div>
              </div>

              <div className="mt-6">
                <SectionTitle icon={<Folder className="h-4 w-4" />} title="Данные и интеграции" />
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Toggle label="Хранилище" value={storage} onChange={setStorage} icon={<HardDrive className="h-4 w-4 mr-2" />}/>
                  <Toggle label="Интеграции" value={extIntegr} onChange={setExtIntegr} icon={<LinkIcon className="h-4 w-4 mr-2" />}/>
                  <Toggle label="Отчёты" value={reports} onChange={setReports} icon={<BarChart3 className="h-4 w-4 mr-2" />}/>
                  <Toggle label="Платежи" value={payments} onChange={setPayments} icon={<Wallet className="h-4 w-4 mr-2" />}/>
                  <Toggle label="Подписки" value={subscriptions} onChange={setSubscriptions} icon={<CreditCard className="h-4 w-4 mr-2" />}/>
                  <Toggle label="RU/EN" value={i18n} onChange={setI18n} icon={<Languages className="h-4 w-4 mr-2" />}/>
                </div>
              </div>
            </div>

            {/* Инфраструктура / поддержка / срочность */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div>
                <SectionTitle icon={<Server className="h-4 w-4" />} title="Развёртывание/хостинг" />
                <p className="mt-1.5 text-xs text-white/65">Облако — быстрый старт; VPS — больше контроля; «Без» — если инфраструктура уже есть.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([["cloud","Облако","Облако"],["vps","VPS","VPS/сервер"],["none","Без","Без развёртывания"]] as [Hosting,string,string][])
                    .map(([v,m,desk])=>(
                      <Chip key={v} active={hosting===v} onClick={()=>setHosting(v)} mobile={m} desktop={desk}/>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <Toggle label="БД" value={useDB} onChange={setUseDB} icon={<Database className="h-4 w-4 mr-2" />}/>
                  <Toggle label="Кэш" value={useCache} onChange={setUseCache} icon={<Database className="h-4 w-4 mr-2 rotate-90" />}/>
                  <Toggle label="Алерты" value={useObserv} onChange={setUseObserv} icon={<Activity className="h-4 w-4 mr-2" />}/>
                  <Toggle label="CI/CD" value={useCI} onChange={setUseCI} icon={<GitBranch className="h-4 w-4 mr-2" />}/>
                </div>
              </div>
              <div>
                <SectionTitle icon={<Wrench className="h-4 w-4" />} title="Поддержка после релиза" />
                <p className="mt-1.5 text-xs text-white/65">Инциденты и мелкие улучшения; Pro SLA — ускоренная реакция.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([["none","Нет","Без поддержки"],["basic","Base","Базовая"],["pro","Pro","Pro SLA"]] as [Support,string,string][])
                    .map(([v,m,desk])=>(
                      <Chip key={v} active={support===v} onClick={()=>setSupport(v)} mobile={m} desktop={desk}/>
                  ))}
                </div>
              </div>
              <div>
                <SectionTitle icon={<Clock3 className="h-4 w-4" />} title="Срочность" />
                <p className="mt-1.5 text-xs text-white/65">Ускоренная дорожает ~25% из-за параллельной работы и резерва ресурсов.</p>
                <div className="mt-3 flex gap-2">
                  {([["normal","Basic","Basic"],["fast","Basic+","Basic+"]] as [Speed,string,string][])
                    .map(([v,m,desk])=>(
                      <Chip key={v} active={speed===v} onClick={()=>setSpeed(v)} mobile={m} desktop={desk}/>
                  ))}
                </div>
              </div>
            </div>

            {/* Подсказки */}
            <Hints />
          </motion.div>

          {/* RIGHT: summary */}
          <motion.aside
            {...fade(0.16)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 sticky top-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5"/>
              <h3 className="text-xl font-semibold">Предварительная смета</h3>
              {result.discountApplied && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200" title="Активна комбо-скидка">
                  <Percent className="h-3.5 w-3.5" /> скидка комбо
                </span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat label="Тип" value={mapKind(kind)} />
              <Stat label="Фич сверх базы" value={<CountUp value={scope} />} />
              <Stat label="Дизайн" value={mapDesign(design)} />
              <Stat label="Хостинг" value={hosting==="cloud"?"облако":hosting==="vps"?"VPS":"нет"} />
              <Stat label="CI/CD" value={useCI?"включено":"не нужно"} />
              <Stat label="Поддержка" value={support==="none"?"нет":support==="basic"?"базовая":"Pro SLA"} />
            </div>

            {selectedModules.length>0 && (
              <div className="mt-3">
                <div className="text-xs text-white/70 mb-1">Модули</div>
                <div className="flex flex-wrap gap-2">
                  {selectedModules.slice(0,6).map(t=>(
                    <span key={t} className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[11px] text-white/85">
                      {t}
                    </span>
                  ))}
                  {selectedModules.length>6 && <span className="text-xs text-white/60">+{selectedModules.length-6}</span>}
                </div>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <h4 className="font-semibold mb-3">Разбивка</h4>
              <Row label="База по типу" value={fmt(result.breakdown.base)} />
              <Row label="Доп. объём" value={fmt(result.breakdown.scopeCost)} />
              <Row label="Дизайн-коэфф." value={`×${result.breakdown.designK.toFixed(2)}`} />
              <Row label="Модули/функции" value={fmt(result.breakdown.features)} />
              <Row label="Инфра (setup)" value={fmt(result.breakdown.infraSetup)} />
              {result.breakdown.discountK!==1 && <Row label="Скидка (комбо)" value={`${Math.round((1-result.breakdown.discountK)*100)}%`} />}
              {result.breakdown.speedK!==1 && <Row label="Срочность" value={`×${result.breakdown.speedK.toFixed(2)}`} />}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white text-black p-5">
                <div className="text-sm text-black/70">Единовременно</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums"><CountUp value={result.oneOff} /> ₽</div>
                <div className="mt-2 text-xs text-black/70 flex items-center gap-1">
                  <Info className="h-4.5 w-4.5" /> Дизайн, разработка, интеграции, настройка инфраструктуры.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm text-white/70">Ежемесячно</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums"><CountUp value={result.monthly} /> ₽</div>
                <div className="mt-2 text-xs text-white/60 flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" /> Хостинг/инфра/домены + выбранная поддержка.
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={goToContactWithQuote}
                className="group w-full inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-black hover:shadow-lg hover:shadow-white/20 transition"
              >
                Оставить заявку
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <p className="mt-4 text-[12px] text-white/45">
              * Оценка ориентировочная. Точная смета зависит от UX, интеграций, требований к безопасности и сроков. Этапируем: MVP → релиз → развитие.
            </p>
          </motion.aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

/* --- UI helpers (как в SiteCalculator) --- */
function SectionTitle({icon,title}:{icon:React.ReactNode,title:string}){
  return (
    <div className="flex items-center gap-2 text-white/80">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.07]">{icon}</span>
      <span className="text-sm font-semibold uppercase tracking-[0.18em]">{title}</span>
    </div>
  );
}
function Chip({
  active,onClick,mobile,desktop,ariaLabel,
}:{active:boolean;onClick:()=>void;mobile:string;desktop:string;ariaLabel?:string;}){
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel ?? desktop}
      className={`flex w-full items-center justify-start text-left rounded-full px-4 py-2 text-sm border transition
      ${active?"bg-white text-black border-white":"border-white/30 text-white/85 hover:bg-white/10"}`}
    >
      <span className="block sm:hidden">{mobile}</span>
      <span className="hidden sm:block">{desktop}</span>
    </button>
  );
}
function Toggle({label,value,onChange,icon}:{label:string;value:boolean;onChange:(v:boolean)=>void;icon?:React.ReactNode;}){
  return (
    <button
      type="button"
      onClick={()=>onChange(!value)}
      aria-pressed={value}
      className={`group flex w-full items-center justify-between rounded-xl border p-3 transition
        ${value?"bg-white text-black border-white":"border-white/25 bg-white/[0.03] text-white"}`}
    >
      <span className="text-sm flex items-center">{icon}{label}</span>
      <span className={`inline-flex h-6 w-10 items-center rounded-full ${value?"bg-black/80":"bg-white/15"}`}>
        <span className={`h-5 w-5 rounded-full bg-white transition-transform ${value?"translate-x-4":"translate-x-1"}`}/>
      </span>
    </button>
  );
}
function Row({label,value}:{label:string,value:React.ReactNode}){
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0 text-sm">
      <span className="text-white/60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function Stat({label, value}:{label:string; value:React.ReactNode}){
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.06] p-3">
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  );
}
function Hints(){
  return (
    <div className="mt-8 grid md:grid-cols-3 gap-4">
      <Hint icon={<Cpu className="h-4 w-4" />} title="Что считается «фичей»?" text="1 юнит — небольшой сценарий/модуль: экран, форма, отчёт, интеграция. В базе 10; сверх — по прайсу за юнит."/>
      <Hint icon={<Server className="h-4 w-4" />} title="Хостинг: что выбрать?" text="Облако — SLA и скорость; VPS — контроль и изоляция; «Без» — если используете существующую инфраструктуру."/>
      <Hint icon={<Percent className="h-4 w-4" />} title="Комбо-скидки" text="SaaS с платежами и подписками — скидка на биллинг. Для аналитики — пакет с realtime."/>
    </div>
  );
}
function Hint({icon,title,text}:{icon:React.ReactNode;title:string;text:string;}){
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-white/85">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.08]">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-xs text-white/65 leading-relaxed">{text}</p>
    </div>
  );
}