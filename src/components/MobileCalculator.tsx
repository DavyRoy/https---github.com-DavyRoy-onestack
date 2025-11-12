// src/components/MobileCalculator.tsx
"use client";

import { useEffect, useMemo, useState, useId } from "react";
import Script from "next/script";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  Info, Smartphone, Sparkles, Cpu, Database, ShieldCheck, Wrench, GitBranch,
  Link as LinkIcon, Server, Clock3, Bell, WifiOff, CreditCard, MapPin, MessageCircle,
  Camera, BarChart3, FlaskConical, Link2, Globe, CloudCog, ChevronRight, Percent, Wallet
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuote } from "@/app/context/QuoteContext";

/* ================= types ================= */
type AppKind = "client" | "loyalty" | "field" | "marketplace" | "fintech" | "saasMobile";
type DesignLevel = "basic" | "pro" | "brand";
type Speed = "normal" | "fast";
type Hosting = "none" | "cloud" | "vps";
type Support = "none" | "basic" | "pro";

const fade = (d=0)=>({initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},transition:{duration:0.45,delay:d},viewport:{once:true,amount:0.2}});

/* ================= pricing ================= */
const PRICING = {
  base: {
    client:       480_000,
    loyalty:      520_000,
    field:        650_000,
    marketplace: 1_100_000,
    fintech:    1_300_000,
    saasMobile:   780_000,
  } as Record<AppKind, number>,
  scope: { included: 8, perUnit: 30_000 },
  design: { basic:1.0, pro:1.2, brand:1.4 } as Record<DesignLevel, number>,
  features: {
    auth:70_000, push:45_000, offline:85_000, payments:110_000, subscriptions:90_000,
    maps:65_000, geofencing:55_000, chat:80_000, cameraMedia:50_000,
    analytics:25_000, abtests:35_000, deeplinks:25_000, extIntegr:60_000, i18n:45_000,
  },
  infra: {
    hosting: {
      none:{monthly:0,setup:0},
      cloud:{monthly:10_000,setup:20_000},
      vps:{monthly:8_000,setup:28_000},
    } as Record<Hosting,{monthly:number,setup:number}>,
    notifications:{monthly:2_000,setup:4_000},
    ota:{monthly:1_500,setup:4_000},
    crashlytics:{monthly:1_000,setup:2_000},
    observ:{monthly:2_500,setup:6_000},
    ci:{monthly:3_000,setup:12_000},
    domains:{monthly:500,setup:2_500},
  },
  support: { none:0, basic:30_000, pro:70_000 } as Record<Support, number>,
  speedMultiplier: { normal:1.0, fast:1.22 } as Record<Speed, number>,
  discounts: {
    loyaltyPack: 0.92,
    marketPack:  0.93,
  },
};

/* ================= helpers ================= */
function clamp(n:number,min:number,max:number){return Math.max(min,Math.min(max,n));}
function fmt(n:number){return n.toLocaleString("ru-RU")+" ₽";}
function mapKind(k:AppKind){
  switch(k){
    case "client": return "Клиентское";
    case "loyalty": return "Лояльность/карта";
    case "field": return "Курьер/полевые";
    case "marketplace": return "Маркетплейс";
    case "fintech": return "Финтех/банк";
    case "saasMobile": return "SaaS-клиент";
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
export default function MobileCalculator(){
  const router = useRouter();
  const { setQuote } = useQuote();

  // базовые параметры
  const [kind,setKind]=useState<AppKind>("client");
  const [scope,setScope]=useState(8);
  const [design,setDesign]=useState<DesignLevel>("pro");
  const [speed,setSpeed]=useState<Speed>("normal");

  // модули
  const [auth,setAuth]=useState(true);
  const [push,setPush]=useState(true);
  const [offline,setOffline]=useState(false);
  const [payments,setPayments]=useState(false);
  const [subscriptions,setSubscriptions]=useState(false);
  const [maps,setMaps]=useState(false);
  const [geofencing,setGeofencing]=useState(false);
  const [chat,setChat]=useState(false);
  const [cameraMedia,setCameraMedia]=useState(true);
  const [analytics,setAnalytics]=useState(true);
  const [abtests,setAbtests]=useState(false);
  const [deeplinks,setDeeplinks]=useState(true);
  const [extIntegr,setExtIntegr]=useState(false);
  const [i18n,setI18n]=useState(false);

  // инфра/поддержка
  const [hosting,setHosting]=useState<Hosting>("cloud");
  const [useNotif,setUseNotif]=useState(true);
  const [useOTA,setUseOTA]=useState(true);
  const [useCrashlytics,setUseCrashlytics]=useState(true);
  const [useObserv,setUseObserv]=useState(true);
  const [useCI,setUseCI]=useState(true);
  const [support,setSupport]=useState<Support>("basic");

  /* ===== autosave/load ===== */
  useEffect(()=>{
    try{
      const rawOld = localStorage.getItem("mobile_calc_v1");
      const rawNew = localStorage.getItem("onestack_mobile_calc");
      const raw = rawNew ?? rawOld;
      if(!raw) return;
      const s = JSON.parse(raw);
      setKind(s.kind ?? "client");
      setScope(s.scope ?? 8);
      setDesign(s.design ?? "pro");
      setSpeed(s.speed ?? "normal");

      setAuth(!!s.auth); setPush(!!s.push); setOffline(!!s.offline);
      setPayments(!!s.payments); setSubscriptions(!!s.subscriptions);
      setMaps(!!s.maps); setGeofencing(!!s.geofencing); setChat(!!s.chat);
      setCameraMedia(!!s.cameraMedia); setAnalytics(s.analytics ?? true);
      setAbtests(!!s.abtests); setDeeplinks(s.deeplinks ?? true); setExtIntegr(!!s.extIntegr); setI18n(!!s.i18n);

      setHosting(s.hosting ?? "cloud");
      setUseNotif(s.useNotif ?? true);
      setUseOTA(s.useOTA ?? true);
      setUseCrashlytics(s.useCrashlytics ?? true);
      setUseObserv(s.useObserv ?? true);
      setUseCI(s.useCI ?? true);
      setSupport(s.support ?? "basic");
    }catch{}
  },[]);
  useEffect(()=>{
    const s = {
      kind, scope, design, speed,
      auth,push,offline,payments,subscriptions,maps,geofencing,chat,cameraMedia,analytics,abtests,deeplinks,extIntegr,i18n,
      hosting,useNotif,useOTA,useCrashlytics,useObserv,useCI,support
    };
    try{ localStorage.setItem("onestack_mobile_calc", JSON.stringify(s)); }catch{}
  },[
    kind, scope, design, speed,
    auth,push,offline,payments,subscriptions,maps,geofencing,chat,cameraMedia,analytics,abtests,deeplinks,extIntegr,i18n,
    hosting,useNotif,useOTA,useCrashlytics,useObserv,useCI,support
  ]);

  /* ===== calculation ===== */
  const result = useMemo(()=>{
    const base = PRICING.base[kind];

    const extraUnits = clamp(scope - PRICING.scope.included, 0, 500);
    const scopeCost  = extraUnits * PRICING.scope.perUnit;

    const designK = PRICING.design[design];

    let features = 0;
    features += auth ? PRICING.features.auth : 0;
    features += push ? PRICING.features.push : 0;
    features += offline ? PRICING.features.offline : 0;
    features += payments ? PRICING.features.payments : 0;
    features += subscriptions ? PRICING.features.subscriptions : 0;
    features += maps ? PRICING.features.maps : 0;
    features += geofencing ? PRICING.features.geofencing : 0;
    features += chat ? PRICING.features.chat : 0;
    features += cameraMedia ? PRICING.features.cameraMedia : 0;
    features += analytics ? PRICING.features.analytics : 0;
    features += abtests ? PRICING.features.abtests : 0;
    features += deeplinks ? PRICING.features.deeplinks : 0;
    features += extIntegr ? PRICING.features.extIntegr : 0;
    features += i18n ? PRICING.features.i18n : 0;

    const infraSetup =
      PRICING.infra.hosting[hosting].setup +
      (useNotif ? PRICING.infra.notifications.setup : 0) +
      (useOTA ? PRICING.infra.ota.setup : 0) +
      (useCrashlytics ? PRICING.infra.crashlytics.setup : 0) +
      (useObserv ? PRICING.infra.observ.setup : 0) +
      (useCI ? PRICING.infra.ci.setup : 0) +
      PRICING.infra.domains.setup;

    const infraMonthly =
      PRICING.infra.hosting[hosting].monthly +
      (useNotif ? PRICING.infra.notifications.monthly : 0) +
      (useOTA ? PRICING.infra.ota.monthly : 0) +
      (useCrashlytics ? PRICING.infra.crashlytics.monthly : 0) +
      (useObserv ? PRICING.infra.observ.monthly : 0) +
      (useCI ? PRICING.infra.ci.monthly : 0) +
      PRICING.infra.domains.monthly +
      PRICING.support[support];

    let discountK = 1;
    if (kind==="loyalty" && push && payments) discountK *= PRICING.discounts.loyaltyPack;
    if (kind==="marketplace" && payments && chat && maps) discountK *= PRICING.discounts.marketPack;

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
    auth,push,offline,payments,subscriptions,maps,geofencing,chat,cameraMedia,analytics,abtests,deeplinks,extIntegr,i18n,
    hosting,useNotif,useOTA,useCrashlytics,useObserv,useCI,support
  ]);

  const goToContactWithQuote = () => {
    setQuote({
      source: "mobile-calculator",
      createdAt: new Date().toISOString(),
      kind, scope, design, speed, hosting, support,
      oneOff: result.oneOff,
      monthly: result.monthly,
      breakdown: {
        base: result.breakdown.base,
        scopeCost: result.breakdown.scopeCost,
        designK: `x${result.breakdown.designK}`,
        features: result.breakdown.features,
        infraSetup: result.breakdown.infraSetup,
        discountK: `x${result.breakdown.discountK}`,
        speedK: `x${result.breakdown.speedK}`,
      },
      modules: {
        auth,push,offline,payments,subscriptions,maps,geofencing,chat,cameraMedia,analytics,abtests,deeplinks,extIntegr,i18n
      },
      infra: { useNotif,useOTA,useCrashlytics,useObserv,useCI },
    });

    // мягкий скролл к #contact + добавим hash без лишнего релоада
    const el = document.querySelector<HTMLElement>("#contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#contact");
    } else {
      router.push("#contact");
    }
  };

  /* ===== selected modules for chips ===== */
  const selectedModules = [
    auth && "Auth/биометрия",
    push && "Push",
    offline && "Offline",
    payments && "Платежи",
    subscriptions && "Подписки",
    maps && "Карты",
    geofencing && "Geofencing",
    chat && "Чат",
    cameraMedia && "Камера",
    analytics && "Аналитика",
    abtests && "A/B-тесты",
    deeplinks && "Deep-links",
    extIntegr && "Интеграции (API)",
    i18n && "i18n",
  ].filter(Boolean) as string[];

  // ===== JSON-LD (через next/script, чтобы избежать расхождений гидрации) =====
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка мобильного приложения — калькулятор стоимости",
    provider: { "@type": "Organization", name: "OneStack", url: "https://onestack24.ru" },
    serviceType: "Mobile app development",
    areaServed: "RU",
    description:
      "Онлайн-калькулятор стоимости разработки мобильного приложения под iOS и Android. Учитываем дизайн, функциональность, интеграции и поддержку.",
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      priceSpecification: { "@type": "PriceSpecification", price: Math.max(480000, result.oneOff).toString() },
      url: "https://onestack24.ru/mobile#calculator",
      availability: "https://schema.org/InStock",
    },
  }), [result.oneOff]);

  // ids для а11y слайдера
  const scopeLabelId = useId();
  const scopeRangeId = useId();

  return (
    <section
      id="calculator"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="mobile-calc-title"
    >
      {/* JSON-LD */}
      <Script
        id="ld-mobile-calculator"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* мягкие свечения */}
      <div aria-hidden className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      {/* контейнер */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p {...fade(0)} className="text-sm uppercase tracking-[0.25em] text-white/60 mb-3 text-left">
          калькулятор
        </motion.p>
        <motion.h2 id="mobile-calc-title" {...fade(0.05)} className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl">
          Калькулятор стоимости — мобильные приложения
        </motion.h2>
        <motion.p {...fade(0.1)} className="mt-4 text-white/80 max-w-3xl text-left">
          Выберите параметры. Под каждым пунктом короткое описание — чтобы быстрее понять, нужно ли это именно вам.
          Финальную стоимость подтвердим после короткого брифа.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
          {/* ПАНЕЛИ ВЫБОРА */}
          <motion.div {...fade(0.12)} className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            {/* Тип приложения */}
            <SectionTitle icon={<Smartphone className="h-4 w-4" />} title="Тип приложения" />
            <p className="mt-1.5 text-xs text-white/65">Влияет на базовую стоимость и состав модулей.</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Тип приложения">
              {([
                ["client","Клиент.","Клиентское",<Smartphone className="h-4 w-4" key="i" />],
                ["loyalty","Карта","Лояльность",<Percent className="h-4 w-4" key="i" />],
                ["field","Полевые","Курьер",<MapPin className="h-4 w-4" key="i" />],
                ["marketplace","Маркет.","Маркетплейс",<CreditCard className="h-4 w-4" key="i" />],
                ["fintech","Финтех","Финтех/банк",<Wallet className="h-4 w-4" key="i" />],
                ["saasMobile","SaaS","SaaS-клиент",<CloudCog className="h-4 w-4" key="i" />],
              ] as [AppKind,string,string,React.ReactNode][]).map(([key,mobile,desktop,icon])=>(
                <Chip key={key} active={kind===key} onClick={()=>setKind(key)} mobile={mobile} desktop={desktop} ariaLabel={`Тип: ${desktop}${kind===key?". Выбрано":""}`}>
                  <span className="mr-2">{icon}</span>{desktop}
                </Chip>
              ))}
            </div>

            {/* Объём и дизайн */}
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div>
                <SectionTitle icon={<Cpu className="h-4 w-4" />} title="Объём функционала" />
                <p id={scopeLabelId} className="mt-1.5 text-xs text-white/65">
                  Примерное число фич/экранов сверх базового набора (в базе 8).
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" className="rounded-full border border-white/25 px-2.5 py-1.5 hover:bg-white/10" aria-label="Уменьшить" onClick={()=>setScope(s=>Math.max(1,s-1))}>–</button>
                  <input
                    id={scopeRangeId}
                    aria-labelledby={scopeLabelId}
                    type="range" min={1} max={60} value={scope}
                    onChange={e=>setScope(parseInt(e.target.value))}
                    className="w-full accent-white"
                  />
                  <button type="button" className="rounded-full border border-white/25 px-2.5 py-1.5 hover:bg-white/10" aria-label="Увеличить" onClick={()=>setScope(s=>Math.min(60,s+1))}>+</button>
                  <div className="w-16 text-right tabular-nums font-semibold"><CountUp value={scope} /></div>
                </div>
              </div>
              <div>
                <SectionTitle icon={<Sparkles className="h-4 w-4" />} title="Уровень дизайна" />
                <p className="mt-1.5 text-xs text-white/65">
                  <strong>Базовый</strong> — быстрее; <strong>Pro</strong> — больше состояний; <strong>Branded</strong> — фирменный стиль и анимации.
                </p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Уровень дизайна">
                  {([["basic","Базовый","Базовый"],["pro","Pro","Pro"],["brand","Branded","Branded"]] as [DesignLevel,string,string][])
                    .map(([k,m,desk])=>(
                      <Chip key={k} active={design===k} onClick={()=>setDesign(k)} mobile={m} desktop={desk} ariaLabel={`Дизайн: ${desk}${design===k?". Выбрано":""}`}/>
                  ))}
                </div>
              </div>
            </div>

            {/* Функциональность */}
            <div className="mt-4">
              <SectionTitle icon={<ShieldCheck className="h-4 w-4" />} title="Доступ и безопасность" />
              <p className="mt-1.5 text-xs text-white/65">Авторизация, ссылки, мультиязычность.</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <Toggle label="Auth" value={auth} onChange={setAuth} icon={<ShieldCheck className="h-4 w-4 mr-2" />} />
                <Toggle label="Deep-links" value={deeplinks} onChange={setDeeplinks} icon={<Link2 className="h-4 w-4 mr-2" />} />
                <Toggle label="RU/EN" value={i18n} onChange={setI18n} icon={<Globe className="h-4 w-4 mr-2" />} />
              </div>

              <div className="mt-6">
                <SectionTitle icon={<Bell className="h-4 w-4" />} title="Коммуникации и оффлайн" />
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Toggle label="Push" value={push} onChange={setPush} icon={<Bell className="h-4 w-4 mr-2" />} />
                  <Toggle label="Оффлайн" value={offline} onChange={setOffline} icon={<WifiOff className="h-4 w-4 mr-2" />} />
                  <Toggle label="Чат/саппорт" value={chat} onChange={setChat} icon={<MessageCircle className="h-4 w-4 mr-2" />} />
                </div>
              </div>

              <div className="mt-6">
                <SectionTitle icon={<CreditCard className="h-4 w-4" />} title="Платежи и монетизация" />
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Toggle label="Платежи" value={payments} onChange={setPayments} icon={<CreditCard className="h-4 w-4 mr-2" />} />
                  <Toggle label="Подписки" value={subscriptions} onChange={setSubscriptions} />
                </div>
              </div>

              <div className="mt-6">
                <SectionTitle icon={<MapPin className="h-4 w-4" />} title="Гео и медиа" />
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Toggle label="Маршруты" value={maps} onChange={setMaps} icon={<MapPin className="h-4 w-4 mr-2" />} />
                  <Toggle label="Geofencing" value={geofencing} onChange={setGeofencing} />
                  <Toggle label="Сканер" value={cameraMedia} onChange={setCameraMedia} icon={<Camera className="h-4 w-4 mr-2" />} />
                </div>
              </div>

              <div className="mt-6">
                <SectionTitle icon={<BarChart3 className="h-4 w-4" />} title="Аналитика и эксперименты" />
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Toggle label="События" value={analytics} onChange={setAnalytics} icon={<BarChart3 className="h-4 w-4 mr-2" />} />
                  <Toggle label="A/B" value={abtests} onChange={setAbtests} icon={<FlaskConical className="h-4 w-4 mr-2" />} />
                  <Toggle label="Интеграции" value={extIntegr} onChange={setExtIntegr} icon={<LinkIcon className="h-4 w-4 mr-2" />} />
                </div>
              </div>
            </div>

            {/* Инфраструктура / поддержка / срочность */}
            <div className="mt-7 grid md:grid-cols-3 gap-2">
              <div>
                <SectionTitle icon={<Server className="h-4 w-4" />} title="Бэкенд" />
                <p className="mt-1.5 text-xs text-white/65">Облако — быстрый старт; VPS — больше контроля; «Без» — если уже есть инфраструктура.</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Бэкенд/инфра">
                  {([["cloud","Cloud","Облако"],["vps","VPS","VPS/сервер"],["none","Без","Без развёртывания"]] as [Hosting,string,string][])
                    .map(([v,m,desk])=>(
                      <Chip key={v} active={hosting===v} onClick={()=>setHosting(v)} mobile={m} desktop={desk}/>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <Toggle label="Пуш-сервис" value={useNotif} onChange={setUseNotif} icon={<Bell className="h-4 w-4 mr-2" />} />
                  <Toggle label="Observability" value={useObserv} onChange={setUseObserv} icon={<CloudCog className="h-4 w-4 mr-2" />} />
                  <Toggle label="CI/CD" value={useCI} onChange={setUseCI} icon={<GitBranch className="h-4 w-4 mr-2" />} />
                </div>
              </div>
              <div>
                <SectionTitle icon={<Wrench className="h-4 w-4" />} title="Поддержка" />
                <p className="mt-1.5 text-xs text-white/65">Базовая — плановые обновления; Pro SLA — ускоренная реакция.</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Поддержка после релиза">
                  {([["none","Нет","Без поддержки"],["basic","Base","Базовая"],["pro","Pro","Pro SLA"]] as [Support,string,string][])
                    .map(([v,m,desk])=>(
                      <Chip key={v} active={support===v} onClick={()=>setSupport(v)} mobile={m} desktop={desk}/>
                  ))}
                </div>
              </div>
              <div>
                <SectionTitle icon={<Clock3 className="h-4 w-4" />} title="Срочность" />
                <p className="mt-1.5 text-xs text-white/65">Ускоренный запуск ~+22% из-за параллельной работы и резерва ресурсов.</p>
                <div className="mt-3 flex gap-2" role="group" aria-label="Срочность">
                  {([["normal","Обычная","Обычная"],["fast","Ускоренная","Ускоренная"]] as [Speed,string,string][])
                    .map(([v,m,desk])=>(
                      <Chip key={v} active={speed===v} onClick={()=>setSpeed(v)} mobile={m} desktop={desk}/>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* РЕЗЮМЕ / СМЕТА */}
          <motion.aside
            {...fade(0.16)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 sticky top-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
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

            {selectedModules.length > 0 && (
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
              {result.breakdown.discountK !== 1 && (<Row label="Скидка (комбо)" value={`${Math.round((1-result.breakdown.discountK)*100)}%`} />)}
              {result.breakdown.speedK !== 1 && (<Row label="Срочность" value={`×${result.breakdown.speedK.toFixed(2)}`} />)}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white text-black p-5">
                <div className="text-sm text-black/70">Единовременно</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums"><CountUp value={result.oneOff} /> ₽</div>
                <div className="mt-2 text-xs text-black/70 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> Дизайн, разработка, интеграции, настройка инфраструктуры.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm text-white/70">Ежемесячно</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums"><CountUp value={result.monthly} /> ₽</div>
                <div className="mt-2 text-xs text-white/60 flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" /> Хостинг/пуш/OTA/наблюдаемость + выбранная поддержка.
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
              * Итог зависит от UX, интеграций, оффлайна, безопасности и сроков. После брифинга сформируем фикс-смету и таймлайн; возможны этапы (MVP → релиз в сторах → развитие).
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* --- UI helpers --- */
function SectionTitle({icon,title}:{icon:React.ReactNode,title:string}){
  return (
    <div className="flex items-center gap-2 text-white/80">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.07]">{icon}</span>
      <span className="text-sm font-semibold uppercase tracking-[0.18em]">{title}</span>
    </div>
  );
}
function Chip({
  active, onClick, mobile, desktop, ariaLabel, children,
}:{
  active:boolean; onClick:()=>void; mobile:string; desktop:string; ariaLabel?:string; children?:React.ReactNode;
}){
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-start text-left rounded-full px-4 py-2 text-sm border transition
      ${active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"}`}
      type="button"
      aria-pressed={active}
      aria-label={ariaLabel ?? `${desktop}${active ? ". Выбрано" : ""}`}
    >
      <span className="block sm:hidden">{mobile}</span>
      <span className="hidden sm:flex items-center">{children ?? desktop}</span>
    </button>
  );
}
function Toggle({label,value,onChange,icon}:{label:string,value:boolean,onChange:(v:boolean)=>void,icon?:React.ReactNode}){
  return (
    <button
      type="button"
      onClick={()=>onChange(!value)}
      className={`group flex w-full items-center justify-between rounded-xl border p-3 transition
        ${value?"bg-white text-black border-white":"border-white/25 bg-white/[0.03] text-white"}`}
      aria-pressed={value}
      aria-label={`${label}${value ? ". Включено" : ". Выключено"}`}
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