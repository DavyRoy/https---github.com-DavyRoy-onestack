// app/demo/admin/dashboard/components/CompliancePanel.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
      return "bg-emerald-400/15 text-emerald-300";
    case "warn":
      return "bg-amber-400/15 text-amber-300";
    case "pending":
      return "bg-sky-400/15 text-sky-300";
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

/* ── data loader (API → mock fallback) ─────────────────────────────────── */
async function fetchCompliance(): Promise<ComplianceItem[]> {
  try {
    const res = await fetch("/api/metrics/compliance", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as ComplianceItem[];
    if (!Array.isArray(json)) throw new Error("Invalid JSON shape");
    return json;
  } catch {
    // fallback: преобразуем mockCompliance() в массив карточек
    const c = mockCompliance();
    return [
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
    ];
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

  const [items, setItems] = useState<ComplianceItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    const run = async () => {
      setLoading(true);
      const data = await fetchCompliance();
      if (!alive) return;
      setItems(data);
      setLoading(false);
    };

    run();
    if (pollMs > 0) timer = setInterval(run, pollMs);
    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [pollMs]);

  const list = useMemo(
    () =>
      (items ?? []).map((i) => ({
        ...i,
        href: i.href.startsWith("/demo")
          ? i.href.replace(/^\/demo\/admin/, resolvedBase)
          : i.href,
      })),
    [items, resolvedBase]
  );

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="compliance-title"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <ShieldCheck width={16} height={16} />
          </span>
          <div id="compliance-title" className="text-sm font-medium">
            Compliance / Политики
          </div>
        </div>
        <Link
          href={`${resolvedBase}/compliance`}
          prefetch={false}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Все политики
        </Link>
      </div>

      {/* cards */}
      <div className="mt-3 grid gap-2">
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
            className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80">
                  {iconById(c.id)}
                </span>
                <div className="text-sm font-medium">{c.title}</div>
              </div>
              <span className={cls("text-xs rounded-md px-2 py-0.5 uppercase tracking-wide", badge(c.status))}>
                {c.status === "ok" ? "OK" : c.status === "warn" ? "Внимание" : "Проверяется"}
              </span>
            </div>
            <div className="mt-1 text-xs text-white/70">{c.description}</div>
          </Link>
        ))}
      </div>

      <div className="mt-2 text-xs text-white/60">
        Статусы процедур обновляются автоматически
      </div>
    </section>
  );
}

/* ── skeleton ── */
function SkelCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <span className="h-5 w-36 rounded bg-white/10 animate-pulse" />
        <span className="h-5 w-16 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mt-1 h-4 w-2/3 rounded bg-white/10 animate-pulse" />
    </div>
  );
}