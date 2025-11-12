// src/app/demo/ui/DemoCards.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useId } from "react";

/* =============================== Constants =============================== */

type Tone = "emerald" | "sky" | "violet" | "amber" | "neutral";
type Size = "sm" | "md";

const TONES: Record<Tone, string> = {
  neutral: "from-white/10 to-transparent",
  emerald: "from-emerald-400/20 to-transparent",
  sky: "from-sky-400/20 to-transparent",
  violet: "from-violet-400/20 to-transparent",
  amber: "from-amber-400/20 to-transparent",
};

/* ============================ Small Stat card ============================ */

export function StatCard({
  label,
  value,
  hint,
  delta,
  direction = "up",
  tone = "neutral",
  size = "md",
  loading = false,
  className = "",
}: {
  label: string;
  value: string;
  hint?: string;
  /** «+2.1% WoW» */
  delta?: string;
  direction?: "up" | "down";
  tone?: Tone;
  size?: Size;
  loading?: boolean;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const labelId = useId();

  const valueClass = size === "sm" ? "text-xl" : "text-2xl";
  const labelClass = size === "sm" ? "text-xs" : "text-sm";
  const hintClass = "text-xs text-white/50";

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 12 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={prefersReduced ? undefined : { duration: 0.35 }}
      className={`relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 ${className}`}
      role="group"
      aria-labelledby={labelId}
      aria-busy={loading}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-br ${TONES[tone]} blur-2xl`}
      />
      <div className="relative z-10">
        <div className={`font-extrabold tabular-nums ${valueClass}`} aria-live="polite">
          {loading ? (
            <Skeleton w="7rem" h={size === "sm" ? "1.4rem" : "1.8rem"} reduced={prefersReduced} />
          ) : (
            value
          )}
        </div>
        <div className={`${labelClass} text-white/70`} id={labelId}>
          {label}
        </div>

        {hint ? <div className={`mt-1 ${hintClass}`}>{hint}</div> : null}

        {delta && !loading ? (
          <div
            className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-5
            ${direction === "up" ? "border-emerald-400/40 text-emerald-200" : "border-rose-400/40 text-rose-200"}`}
            aria-label={`Δ ${delta} ${direction === "up" ? "рост" : "снижение"}`}
            title={`Δ ${delta}`}
          >
            {direction === "up" ? (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 7l10 10M7 7v8m0-8h8" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
            {delta}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

/* ================================ Panel ================================= */

export function Panel({
  title,
  description,
  children,
  footer,
  actions,
  padded = true,
  subdued = false,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode; // кнопки/тэги в шапке
  padded?: boolean; // отключить внутренние паддинги (под графики на весь блок)
  subdued?: boolean; // более «приглушённый» фон
  className?: string;
}) {
  const headingId = useId();

  return (
    <section
      className={`rounded-2xl border border-white/10 ${subdued ? "bg-white/[0.02]" : "bg-white/[0.03]"} ${className}`}
      aria-labelledby={headingId}
    >
      <div className="flex items-start justify-between gap-3 px-5 py-3 border-b border-white/10">
        <div className="min-w-0">
          <h2 id={headingId} className="text-sm font-semibold">
            {title}
          </h2>
          {description ? <div className="text-xs text-white/60">{description}</div> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className={padded ? "p-5" : ""}>{children}</div>

      {footer ? (
        <div className="px-5 py-3 border-t border-white/10 text-xs text-white/60">{footer}</div>
      ) : null}
    </section>
  );
}

/* ============================== DemoCards ================================ */

type DemoCardItem = {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
  chips?: string[];
  cta?: string;
  external?: boolean; // показывать «в новом окне»
  tone?: Tone; // лёгкое подсвечивание
};

export default function DemoCards({ items }: { items: DemoCardItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6">
      {items.map((it) => {
        const Inner = (
          <>
            {/* мягкая подсветка при ховере */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-2xl transition group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(60% 50% at 20% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-3">
                {it.icon ? (
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-white"
                    aria-hidden="true"
                  >
                    {it.icon}
                  </span>
                ) : null}

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{it.description}</p>

                  {it.chips?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {it.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85"
                          aria-label={`тег ${c}`}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                    <span className="group-hover:underline">{it.cta ?? "Открыть"}</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    {it.external ? <span className="sr-only">(откроется в новой вкладке)</span> : null}
                  </div>
                </div>
              </div>

              {/* нижняя световая линия */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-6 right-6 -bottom-[1px] h-[2px] bg-gradient-to-r from-white/0 via-white/35 to-white/0"
              />
            </div>
          </>
        );

        const cardTone =
          it.tone === "emerald"
            ? "focus-visible:ring-emerald-400/60"
            : it.tone === "sky"
            ? "focus-visible:ring-sky-400/60"
            : it.tone === "violet"
            ? "focus-visible:ring-violet-400/60"
            : it.tone === "amber"
            ? "focus-visible:ring-amber-400/60"
            : "focus-visible:ring-white/60";

        const baseClass =
          "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
          cardTone;

        return it.external ? (
          <a
            key={it.href}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClass}
            data-analytics="demo-card"
          >
            {Inner}
          </a>
        ) : (
          <Link
            key={it.href}
            href={it.href}
            className={baseClass}
            data-analytics="demo-card"
            prefetch={false} // демо: не спешим префетчить
          >
            {Inner}
          </Link>
        );
      })}
    </div>
  );
}

/* =============================== Utilities =============================== */

function Skeleton({
  w = "100%",
  h = "1rem",
  reduced,
}: {
  w?: string;
  h?: string;
  reduced?: boolean;
}) {
  return (
    <span
      style={{ width: w, height: h }}
      className={`inline-block rounded bg-white/10 ${reduced ? "" : "animate-pulse"}`}
      aria-hidden="true"
    />
  );
}