// app/demo/admin/dashboard/components/CompliancePanel.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";
import { usePathname } from "next/navigation";
import { mockCompliance } from "../data/mockAdminDashboard";
import { ShieldCheck, FileOutput, Archive, FileSignature } from "lucide-react";

type ComplianceItem = {
  id: string;
  title: string;
  description: string;
  status: "ok" | "warn" | "pending";
  href: string;
};

export type CompliancePanelProps = {
  className?: string;
  /** базовый путь для ссылок (автоопределяется по pathname, можно переопределить) */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** интервал обновления, мс */
  pollMs?: number;
};

/* ── utils ─────────────────────────────────────────────────────────────── */
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getBase(prefix: string | undefined, pathname: string | null) {
  if (prefix) return prefix.replace(/\/$/, "");
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}
function badge(status: "ok" | "warn" | "pending") {
  switch (status) {
    case "ok":
      return "bg-emerald-400/15 text-emerald-200";
    case "warn":
      return "bg-amber-400/15 text-amber-200";
    case "pending":
      return "bg-sky-400/15 text-sky-200";
    default:
      return "bg-white/10 text-white/70";
  }
}
function iconById(id: string) {
  switch (id) {
    case "export":
      return <FileOutput width={16} height={16} />;
    case "retention":
      return <Archive width={16} height={16} />;
    case "dpa":
      return <FileSignature width={16} height={16} />;
    default:
      return <ShieldCheck width={16} height={16} />;
  }
}
function remapHref(href: string, base: string) {
  return href.startsWith("/demo")
    ? href.replace(/^\/demo\/(admin|manager|user)/, base)
    : href;
}
const STATUS_WEIGHT: Record<ComplianceItem["status"], number> = {
  warn: 0,
  pending: 1,
  ok: 2,
};

/* ── data loader (API → mock fallback) ─────────────────────────────────── */
async function fetchCompliance(signal?: AbortSignal): Promise<{ data: ComplianceItem[]; source: "api" | "mock" }> {
  try {
    const res = await fetch("/api/metrics/compliance", { cache: "no-store", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as ComplianceItem[];
    if (!Array.isArray(json)) throw new Error("Invalid JSON shape");
    return { data: json, source: "api" };
  } catch {
    const c = mockCompliance();
    return {
      data: [
        {
          id: "export",
          title: "Экспорт данных",
          description: c.exportNote,
          status: "ok",
          href: "/demo/admin/compliance/exports",
        },
        {
          id: "retention",
          title: "Политики хранения",
          description: c.retentionNote,
          status: "warn",
          href: "/demo/admin/compliance/policies",
        },
        {
          id: "dpa",
          title: "DPA / Соглашения",
          description: c.dpaNote,
          status: "pending",
          href: "/demo/admin/compliance/dpa",
        },
      ],
      source: "mock",
    };
  }
}

/* ── component ─────────────────────────────────────────────────────────── */
export default function CompliancePanel({
  className = "",
  baseHref,
  pollMs = 120_000,
}: CompliancePanelProps) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);
  const uid = useId();
  const titleId = `compliance-title-${uid}`;

  const [items, setItems] = useState<ComplianceItem[] | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);

  // защита от гонок
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    try {
      const { data, source } = await fetchCompliance(ctrl.signal);
      if (ctrl.signal.aborted) return;

      // дедуп по id + сортировка по приоритету статуса и алфавиту
      const dedup = Array.from(new Map(data.map((d) => [d.id, d])).values());
      dedup.sort((a, b) => {
        const w = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
        return w !== 0 ? w : a.title.localeCompare(b.title, "ru");
      });

      setItems(dedup);
      setSource(source);
    } finally {
      if (!inFlightCtrl.current?.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    run();
    if (pollMs > 0) {
      intervalRef.current = window.setInterval(() => {
        if (document.visibilityState === "hidden") return;
        run();
      }, pollMs);
    }
    const onVis = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (intervalRef.current) clearInterval(intervalRef.current);
      inFlightCtrl.current?.abort();
    };
  }, [pollMs]);

  const list = useMemo(
    () =>
      (items ?? []).map((i) => ({
        ...i,
        href: remapHref(i.href, resolvedBase),
      })),
    [items, resolvedBase]
  );

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        "min-w-0",
        className
      )}
      aria-labelledby={titleId}
      role="region"
      aria-busy={loading}
      data-loading={loading ? "true" : "false"}
    >
      {/* header */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex min-w-0 items-center gap-2">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10"
            aria-hidden
          >
            <ShieldCheck width={16} height={16} />
          </span>
          <h3 id={titleId} className="truncate text-sm font-medium">
            Compliance / Политики
          </h3>
          {!loading && source === "mock" && (
            <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
              демо-данные
            </span>
          )}
        </div>
        <Link
          href={`${resolvedBase}/compliance`}
          prefetch={false}
          className="rounded-xl border border-white/15 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Открыть все политики и процедуры"
        >
          Все политики
        </Link>
      </div>

      {/* cards */}
      <div className="mt-3 grid gap-2" role="list" aria-live="polite">
        {loading && (
          <>
            <SkelCard />
            <SkelCard />
            <SkelCard />
          </>
        )}

        {!loading && list.length === 0 && (
          <div className="text-sm text-white/70">Нет данных по политикам</div>
        )}

        {list.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            prefetch={false}
            role="listitem"
            className="group rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label={`${c.title}. Статус: ${
              c.status === "ok" ? "соответствует" : c.status === "warn" ? "требуется внимание" : "проверяется"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex min-w-0 items-center gap-2">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80">
                  {iconById(c.id)}
                </span>
                <div className="truncate text-sm font-medium">{c.title}</div>
              </div>
              <span
                className={cls("rounded-md px-2 py-0.5 text-xs uppercase tracking-wide", badge(c.status))}
                title={
                  c.status === "ok"
                    ? "Соответствует"
                    : c.status === "warn"
                    ? "Требуется внимание"
                    : "Проверяется"
                }
              >
                {c.status === "ok" ? "OK" : c.status === "warn" ? "Внимание" : "Проверяется"}
              </span>
            </div>
            <div className="mt-1 text-xs text-white/70">{c.description}</div>
          </Link>
        ))}
      </div>

      <div className="mt-2 text-xs text-white/60">Статусы процедур обновляются автоматически</div>
    </section>
  );
}

/* ── skeleton ── */
function SkelCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="h-5 w-36 animate-pulse rounded bg-white/10" />
        <span className="h-5 w-16 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-white/10" />
    </div>
  );
}