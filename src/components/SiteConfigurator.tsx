// src/components/SiteConfigurator.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useId,
  useRef,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

import SiteBusinessCard from "./SiteBusinessCard";
import SiteCorporate from "./SiteCorporate";
import SiteEcommerce from "./SiteEcommerce";
import SiteLanding from "./SiteLanding";
import SiteInfo from "./SiteInfo";
import SitePortfolio from "./SitePortfolio";

/* =========================================================================================
   Типы
========================================================================================= */

type Goal = "start" | "present" | "sell" | "content" | "leads" | "brand";
type Audience = "b2c" | "b2b" | "internal";
type CMS = "none" | "light" | "headless";
type Deploy = "cloud" | "local" | "none";

type Decision =
  | "business-card"
  | "corporate"
  | "ecommerce"
  | "landing"
  | "info"
  | "portfolio";

/* =========================================================================================
   Утилиты
========================================================================================= */

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/* =========================================================================================
   Логика принятия решения
========================================================================================= */

function decideKind(opts: {
  goal: Goal[];
  audience: Audience;
  pages: number;
  ecommerce: boolean;
  blog: boolean;
  auth: boolean;
  multilingual: boolean;
  cms: CMS;
  deploy: Deploy;
  needCases: boolean;
}): Decision {
  const {
    goal,
    pages,
    ecommerce,
    blog,
    auth,
    multilingual,
    cms,
    needCases,
  } = opts;

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

function mapDecisionToTitle(d: Decision) {
  switch (d) {
    case "business-card":
      return "Сайт-визитка";
    case "corporate":
      return "Корпоративный сайт";
    case "ecommerce":
      return "Интернет-магазин";
    case "landing":
      return "Лендинг";
    case "info":
      return "Информационный сайт";
    case "portfolio":
      return "Портфолио / персональный";
    default:
      return "Сайт";
  }
}

/* =========================================================================================
   Компонент
========================================================================================= */

export default function SiteConfigurator() {
  // Состояния формы
  const [goal, setGoal] = useState<Goal[]>(["start"]);
  const [audience, setAudience] = useState<Audience>("b2c");
  const [pages, setPages] = useState<number>(4);
  const [ecommerce, setEcommerce] = useState<boolean>(false);
  const [blog, setBlog] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);
  const [multilingual, setMultilingual] = useState<boolean>(false);
  const [cms, setCms] = useState<CMS>("light");
  const [deploy, setDeploy] = useState<Deploy>("cloud");
  const [needCases, setNeedCases] = useState<boolean>(false);

  const [open, setOpen] = useState<Decision | null>(null);

  // активный пресет (для подсветки)
  const [activePreset, setActivePreset] = useState<
    "start" | "content" | "ecom" | "corp" | null
  >("start");

  // reduced motion
  const reduced = useReducedMotion();

  // Autosave/load
  useEffect(() => {
    try {
      const raw = localStorage.getItem("site_config_v1");
      if (!raw) return;
      const s = JSON.parse(raw);
      setGoal(Array.isArray(s.goal) ? (s.goal as Goal[]) : ["start"]);
      setAudience((s.audience as Audience) ?? "b2c");
      setPages(clamp(Number(s.pages ?? 4), 1, 60));
      setEcommerce(!!s.ecommerce);
      setBlog(!!s.blog);
      setAuth(!!s.auth);
      setMultilingual(!!s.multilingual);
      setCms((s.cms as CMS) ?? "light");
      setDeploy((s.deploy as Deploy) ?? "cloud");
      setNeedCases(!!s.needCases);
      setActivePreset(s.activePreset ?? "start");
    } catch {}
  }, []);

  useEffect(() => {
    const snapshot = {
      goal,
      audience,
      pages,
      ecommerce,
      blog,
      auth,
      multilingual,
      cms,
      deploy,
      needCases,
      activePreset,
    };
    const save = () => {
      try {
        localStorage.setItem("site_config_v1", JSON.stringify(snapshot));
      } catch {}
    };
    const w = typeof window !== "undefined" ? (window as any) : undefined;
    let id: number | ReturnType<typeof setTimeout> | undefined;
    if (w?.requestIdleCallback) {
      id = w.requestIdleCallback(save, { timeout: 800 });
      return () => id && w.cancelIdleCallback?.(id as number);
    } else {
      id = setTimeout(save, 250);
      return () => clearTimeout(id as any);
    }
  }, [
    goal,
    audience,
    pages,
    ecommerce,
    blog,
    auth,
    multilingual,
    cms,
    deploy,
    needCases,
    activePreset,
  ]);

  const decision = useMemo(
    () =>
      decideKind({
        goal,
        audience,
        pages,
        ecommerce,
        blog,
        auth,
        multilingual,
        cms,
        deploy,
        needCases,
      }),
    [
      goal,
      audience,
      pages,
      ecommerce,
      blog,
      auth,
      multilingual,
      cms,
      deploy,
      needCases,
    ]
  );

  // Пресеты
  const applyPreset = (k: "start" | "content" | "ecom" | "corp") => {
    setActivePreset(k);
    if (k === "start") {
      setGoal(["start", "leads"]);
      setAudience("b2c");
      setPages(4);
      setEcommerce(false);
      setBlog(false);
      setAuth(false);
      setMultilingual(false);
      setCms("light");
      setDeploy("cloud");
      setNeedCases(false);
    } else if (k === "content") {
      setGoal(["content", "brand"]);
      setAudience("b2c");
      setPages(12);
      setEcommerce(false);
      setBlog(true);
      setAuth(false);
      setMultilingual(true);
      setCms("headless");
      setDeploy("cloud");
      setNeedCases(false);
    } else if (k === "ecom") {
      setGoal(["sell", "brand"]);
      setAudience("b2c");
      setPages(10);
      setEcommerce(true);
      setBlog(false);
      setAuth(true);
      setMultilingual(true);
      setCms("headless");
      setDeploy("cloud");
      setNeedCases(false);
    } else {
      setGoal(["present", "brand"]);
      setAudience("b2b");
      setPages(14);
      setEcommerce(false);
      setBlog(true);
      setAuth(true);
      setMultilingual(true);
      setCms("headless");
      setDeploy("cloud");
      setNeedCases(false);
    }
  };

  // Блокируем скролл фона, когда открыта модалка
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Закрытие по Esc и возврат фокуса
  const lastActiveRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      lastActiveRef.current =
        (document.activeElement as HTMLElement | null) ?? null;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(null);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    } else {
      lastActiveRef.current?.focus?.();
    }
  }, [open]);

  // Делегирование кликов внутри модалки по якорям: закрыть → плавно скроллить
  const onModalClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const a = target.closest("a") as HTMLAnchorElement | null;
    if (!a) return;
    if (a.getAttribute("href")?.startsWith("#")) {
      e.preventDefault();
      const id = a.getAttribute("href")!.slice(1);
      setOpen(null);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.location.hash = `#${id}`;
      }, 220);
    }
  }, []);

  // a11y ids
  const titleId = useId();
  const descId = useId();

  // анимации
  const a = (d = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.45, delay: d },
        };

  const modalTrans = reduced ? { duration: 0 } : { duration: 0.22, ease: "easeOut" };

  return (
    <section
      id="picker"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby={titleId}
      role="region"
    >
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Заголовок */}
        <motion.div {...a(0)}>
          <span
            className="inline-block text-sm uppercase tracking-[0.25em] text-white/50"
            id={titleId}
          >
            подбор по целям
          </span>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight">
            Какой тип сайта подойдёт под вашу задачу?
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl" id={descId}>
            Отметьте цели, аудиторию и ключевые требования — предложим стартовую конфигурацию.
            Детали и стек финализируем вместе.
          </p>
        </motion.div>

        {/* Быстрые пресеты */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Btn
            size="sm"
            variant="pill"
            active={activePreset === "start"}
            onClick={() => applyPreset("start")}
            aria-pressed={activePreset === "start"}
          >
            Быстрый запуск
          </Btn>
          <Btn
            size="sm"
            variant="pill"
            active={activePreset === "content"}
            onClick={() => applyPreset("content")}
            aria-pressed={activePreset === "content"}
          >
            Контент-проект
          </Btn>
          <Btn
            size="sm"
            variant="pill"
            active={activePreset === "ecom"}
            onClick={() => applyPreset("ecom")}
            aria-pressed={activePreset === "ecom"}
          >
            E-commerce
          </Btn>
          <Btn
            size="sm"
            variant="pill"
            active={activePreset === "corp"}
            onClick={() => applyPreset("corp")}
            aria-pressed={activePreset === "corp"}
          >
            Корпоративный
          </Btn>
        </div>

        {/* Форма + Рекомендация */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
          {/* Форма */}
          <motion.div
            {...a(0.05)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 lg:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            aria-describedby={descId}
          >
            {/* Цели */}
            <div>
              <label className="block text-sm uppercase tracking-[0.2em] text-white/60">
                Цели
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {([
                  ["start", "Быстрый старт/MVP"],
                  ["present", "Представить компанию"],
                  ["sell", "Продавать онлайн"],
                  ["content", "Публиковать контент"],
                  ["leads", "Собирать лиды"],
                  ["brand", "Имидж/бренд"],
                ] as [Goal, string][]).map(([val, label]) => (
                  <Chip
                    key={val}
                    active={goal.includes(val)}
                    onClick={() =>
                      setGoal((g) =>
                        g.includes(val) ? g.filter((x) => x !== val) : [...g, val]
                      )
                    }
                    label={label}
                  />
                ))}
              </div>
            </div>

            {/* Аудитория + Страницы */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-[0.2em] text-white/60">
                  Аудитория
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["b2c", "b2b", "internal"] as Audience[]).map((a) => (
                    <Btn
                      key={a}
                      variant="pill"
                      active={audience === a}
                      size="sm"
                      onClick={() => setAudience(a)}
                      aria-pressed={audience === a}
                    >
                      {a.toUpperCase()}
                    </Btn>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.2em] text-white/60">
                  Количество разделов/страниц
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <IconBtn
                    aria-label="Уменьшить количество страниц"
                    onClick={() => setPages((p) => clamp(p - 1, 1, 60))}
                  >
                    –
                  </IconBtn>

                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={pages}
                    onChange={(e) =>
                      setPages(clamp(parseInt(e.target.value, 10) || 1, 1, 60))
                    }
                    className="w-full accent-white"
                    aria-label="Количество страниц"
                    aria-valuemin={1}
                    aria-valuemax={60}
                    aria-valuenow={pages}
                    aria-valuetext={`${pages} страниц`}
                  />

                  <IconBtn
                    aria-label="Увеличить количество страниц"
                    onClick={() => setPages((p) => clamp(p + 1, 1, 60))}
                  >
                    +
                  </IconBtn>

                  <div className="w-16 text-right tabular-nums text-base font-semibold">
                    {pages}
                  </div>
                </div>
              </div>
            </div>

            {/* Функции */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Toggle label="E-commerce" checked={ecommerce} onChange={setEcommerce} />
              <Toggle label="Блог/новости" checked={blog} onChange={setBlog} />
              <Toggle label="Личный кабинет/доступ" checked={auth} onChange={setAuth} />
              <Toggle label="Мультиязычность" checked={multilingual} onChange={setMultilingual} />
              <Toggle label="Кейсы/портфолио" checked={needCases} onChange={setNeedCases} />
            </div>

            {/* CMS / Развёртывание */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SegmentedRow
                label="CMS"
                value={cms}
                onChange={(v) => setCms(v as CMS)}
                options={[
                  { value: "none", label: "Без CMS" },
                  { value: "light", label: "Лёгкая" },
                  { value: "headless", label: "Headless" },
                ]}
              />
              <SegmentedRow
                label="Развёртывание"
                value={deploy}
                onChange={(v) => setDeploy(v as Deploy)}
                options={[
                  { value: "cloud", label: "Облако" },
                  { value: "local", label: "On-prem(локально)" },
                  { value: "none", label: "Без развертывания" },
                ]}
              />
            </div>
          </motion.div>

          {/* Рекомендация */}
          <motion.div
            {...a(0.08)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 lg:p-7 flex flex-col justify-between shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:sticky lg:top-6"
          >
            <div>
              <h3 className="text-xl font-semibold">Рекомендация</h3>
              <p className="mt-2 text-white/70 text-sm">
                На основе выбранных параметров рекомендуем:
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl font-bold">
                  {mapDecisionToTitle(decision)}
                </div>

                {/* Маленькие бэйджи-подсказки */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {ecommerce && <Badge>E-commerce</Badge>}
                  {blog && <Badge>Контент/блог</Badge>}
                  {auth && <Badge>Доступ/кабинет</Badge>}
                  {multilingual && <Badge>i18n</Badge>}
                  <Badge>Страниц: {pages}</Badge>
                  <Badge>CMS: {cms}</Badge>
                  <Badge>Деплой: {deploy}</Badge>
                </div>

                <div className="mt-4 h-px bg-white/10" />

                <p className="mt-4 text-white/70 text-sm">
                  Нажмите «Подобрать», чтобы открыть подробный просмотр и параметры.
                </p>
              </div>

              {/* Краткие правила */}
              <ul className="mt-4 space-y-2 text-white/60 text-xs leading-relaxed">
                <li>• Включили E-commerce → «Интернет-магазин»</li>
                <li>• Контент/блог → «Информационный сайт»</li>
                <li>• Быстрый запуск с малым объёмом → «Лендинг» или «Визитка»</li>
                <li>• Много разделов/роли/i18n → «Корпоративный сайт»</li>
                <li>• Акцент на кейсы → «Портфолио»</li>
              </ul>
            </div>

            <div className="mt-6">
              <Btn
                variant="primary"
                block
                onClick={() => setOpen(decision)}
                aria-haspopup="dialog"
                aria-controls="site-config-modal"
              >
                Подобрать
                <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </Btn>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Модалка с выбранным видом сайта — фуллскрин мобил/планшет, «почти фулл» десктоп */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="site-config-modal"
          >
            {/* backdrop */}
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              aria-label="Закрыть модальное окно"
            />
            {/* панель */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              className="
                relative z-10 w-screen h-screen rounded-none 
                md:w-[min(1200px,95vw)] md:h-[92vh] md:rounded-3xl 
                border border-white/10 bg-black shadow-[0_30px_120px_rgba(0,0,0,0.6)] overflow-hidden
              "
              initial={{
                opacity: reduced ? 1 : 0,
                scale: reduced ? 1 : 0.98,
                y: reduced ? 0 : 16,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: reduced ? 1 : 0,
                scale: reduced ? 1 : 0.98,
                y: reduced ? 0 : 10,
              }}
              transition={modalTrans}
              onClick={onModalClick}
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="max-h-full md:max-h-[calc(92vh-0px)] overflow-y-auto">
                {/* заголовок для a11y */}
                <h3 id="modal-title" className="sr-only">
                  {open ? mapDecisionToTitle(open) : "Предпросмотр типа сайта"}
                </h3>
                <p id="modal-desc" className="sr-only">
                  Предпросмотр выбранного типа сайта с параметрами.
                </p>

                {open === "business-card" && <SiteBusinessCard />}
                {open === "corporate" && <SiteCorporate />}
                {open === "ecommerce" && <SiteEcommerce />}
                {open === "landing" && <SiteLanding />}
                {open === "info" && <SiteInfo />}
                {open === "portfolio" && <SitePortfolio />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* =========================================================================================
   UI PRIMITIVES — единый стиль для кнопок/чипов/групп
========================================================================================= */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "pill" | "toggle";
  active?: boolean;
  size?: "sm" | "md";
  block?: boolean;
  wrap?: boolean; // разрешить перенос текста
};

function Btn({
  variant = "outline",
  active = false,
  size = "md",
  block = false,
  wrap = false,
  className = "",
  ...props
}: BtnProps) {
  const sz =
    size === "sm"
      ? "min-h-[38px] px-3.5 text-[13px] sm:text-sm leading-tight"
      : "min-h-[42px] px-4 text-[0.95rem] leading-tight";

  const base =
    "inline-flex items-center justify-center rounded-full transition outline-none " +
    "focus-visible:ring-2 focus-visible:ring-white/40 select-none text-center " +
    (wrap ? "whitespace-normal break-words" : "whitespace-nowrap");

  const variants = {
    primary:
      "bg-white text-black hover:shadow-white/20 hover:shadow-lg border border-white",
    outline: "border border-white/30 text-white/90 hover:bg-white/10",
    pill: active
      ? "bg-white text-black border border-white"
      : "border border-white/25 text-white/85 hover:bg-white/10",
    toggle: active
      ? "bg-white text-black border border-white"
      : "border border-white/30 text-white/85 hover:bg-white/10",
  } as const;

  return (
    <button
      {...props}
      className={`${base} ${sz} ${variants[variant]} ${
        block ? "w-full" : ""
      } ${className}`}
    />
  );
}

function Chip({
  active,
  onClick,
  label,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <Btn
      variant="pill"
      active={active}
      size="sm"
      onClick={onClick}
      className={className}
      aria-pressed={active}
      wrap
    >
      {label}
    </Btn>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Btn
      variant="toggle"
      active={checked}
      onClick={() => onChange(!checked)}
      className="w-full justify-between"
      aria-pressed={checked}
      aria-label={label}
      wrap
    >
      <span className="truncate">{label}</span>
      <span
        className={`ml-3 inline-flex h-5 w-9 items-center rounded-full transition ${
          checked ? "bg-black/80" : "bg-white/20"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>
    </Btn>
  );
}

function SegmentedRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm uppercase tracking-[0.2em] text-white/60">
        {label}
      </label>

      {/* auto-fit: сами раскладываются по 140–1fr, текст переносится */}
      <div className="mt-2 grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
        {options.map((o) => (
          <Btn
            key={o.value}
            variant="pill"
            active={value === o.value}
            size="sm"
            wrap
            className="w-full"
            onClick={() => onChange(o.value)}
            title={o.label}
            aria-pressed={value === o.value}
          >
            {o.label}
          </Btn>
        ))}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[11px] leading-none text-white/80">
      {children}
    </span>
  );
}

function IconBtn({
  children,
  ...props
}: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"
      {...props}
    >
      <span className="sr-only">{props["aria-label"]}</span>
      <span aria-hidden>{children}</span>
    </button>
  );
}