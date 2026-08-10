"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, LogOut, Search, LayoutList, Columns3,
  MessageSquare, Paperclip, Clock, AlertCircle, Flame,
  TrendingUp, CheckCircle2, Circle, Loader2,
} from "lucide-react";

/* ── Palette via CSS vars ── */
const STATUS_COLOR: Record<string, string> = {
  NEW:"var(--status-new)", IN_REVIEW:"var(--status-review)", APPROVED:"var(--status-approved)",
  IN_PROGRESS:"var(--status-progress)", COMPLETED:"var(--status-completed)", CANCELLED:"var(--status-cancelled)",
};
const STATUS_LABEL: Record<string, string> = {
  NEW:"Новая", IN_REVIEW:"На рассмотрении", APPROVED:"Одобрена",
  IN_PROGRESS:"В работе", COMPLETED:"Выполнена", CANCELLED:"Отменена",
};
const PRIORITY_COLOR: Record<string, string> = {
  LOW:"var(--priority-low)", MEDIUM:"var(--priority-medium)",
  HIGH:"var(--priority-high)", URGENT:"var(--priority-urgent)",
};
const PRIORITY_LABEL: Record<string, string> = { LOW:"Низкий", MEDIUM:"Средний", HIGH:"Высокий", URGENT:"Срочно" };
const SVC_LABEL: Record<string, string> = {
  sites:"Сайт", webapp:"Веб-приложение", mobile:"Мобильное приложение",
  complex:"Полный стек", redesign:"Редизайн", support:"Поддержка",
};

function fmtRub(v?: number | null) { return v != null ? `₽ ${(v / 100).toLocaleString("ru")}` : "—"; }
function orderNo(id: string) { return "OS-" + id.replace(/-/g, "").slice(0, 8).toUpperCase(); }
function age(d: string) { const h = Math.floor((Date.now() - new Date(d).getTime()) / 3_600_000); return h < 24 ? `${h}ч` : `${Math.floor(h / 24)}д`; }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("ru-RU", { day:"2-digit", month:"short" }); }

type Req = any;

/* ── Skeleton ── */
function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-lg animate-pulse ${className ?? ""}`} style={{ background:"rgba(255,255,255,0.06)" }} />;
}

/* ── Status dot badge ── */
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? "var(--muted-foreground)";
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background:`color-mix(in oklch,${c} 12%,transparent)`, border:`1px solid color-mix(in oklch,${c} 28%,transparent)`, color:c }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:c }} />
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ── Priority badge ── */
function PriorityBadge({ priority }: { priority: string }) {
  if (!priority || priority === "MEDIUM" || priority === "LOW") return null;
  const c = PRIORITY_COLOR[priority] ?? "var(--muted-foreground)";
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
      style={{ background:`color-mix(in oklch,${c} 12%,transparent)`, border:`1px solid color-mix(in oklch,${c} 25%,transparent)`, color:c }}>
      {priority === "URGENT" && <Flame className="w-2.5 h-2.5" />}
      {priority === "HIGH"   && <AlertCircle className="w-2.5 h-2.5" />}
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

/* ── Avatar initials ── */
function Avatar({ name, email, size = 32 }: { name?: string; email?: string; size?: number }) {
  const letter = (name || email || "?").charAt(0).toUpperCase();
  return (
    <div className="flex-shrink-0 rounded-xl flex items-center justify-center text-xs font-bold"
      style={{ width:size, height:size, background:"rgba(45,212,191,0.1)", border:"1px solid rgba(45,212,191,0.2)", color:"var(--primary)" }}>
      {letter}
    </div>
  );
}

/* ── Progress bar ── */
function Progress({ value, color = "var(--primary)" }: { value: number; color?: string }) {
  return (
    <div className="h-1 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width:`${value}%`, background:color }} />
    </div>
  );
}

/* ══ KANBAN CARD ══ */
function KanbanCard({ req }: { req: Req }) {
  const c      = STATUS_COLOR[req.status] ?? "var(--primary)";
  const stages = req.project?.stages ?? [];
  const allS   = stages.flatMap((s: any) => s.subtasks ?? []);
  const doneS  = stages.filter((s: any) => s.status === "COMPLETED").length;
  const pct    = stages.length ? Math.round(doneS / stages.length * 100) : 0;
  const hasMsg = req.chatMessages?.length > 0 && req.chatMessages[0].role === "client";

  return (
    <Link href={`/crm/requests/${req.id}`} className="block group">
      <div className="rounded-xl p-3.5 transition-all duration-150 cursor-pointer"
        style={{ background:"rgba(255,255,255,0.03)", border:`1px solid var(--border)` }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `color-mix(in oklch,${c} 35%,transparent)`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>

        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-mono font-semibold" style={{ color:"var(--muted-foreground)" }}>
            {orderNo(req.id)}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {hasMsg && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background:"var(--status-new)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background:"var(--status-new)" }} />
              </span>
            )}
            {(req._count?.files > 0) && (
              <span className="flex items-center gap-0.5 text-[10px]" style={{ color:"var(--muted-foreground)" }}>
                <Paperclip className="w-2.5 h-2.5" />{req._count.files}
              </span>
            )}
            <span className="text-[10px]" style={{ color:"var(--muted-foreground)" }}>{age(req.createdAt)}</span>
          </div>
        </div>

        {/* Client */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar name={req.user?.name} email={req.user?.email} size={26} />
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{req.user?.name || req.user?.email?.split("@")[0] || "—"}</div>
            {req.user?.company && <div className="text-[11px] truncate" style={{ color:"var(--muted-foreground)" }}>{req.user.company}</div>}
          </div>
        </div>

        {/* Service + Priority */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <span className="text-[11px]" style={{ color:c }}>{SVC_LABEL[req.service] ?? req.service}</span>
          <PriorityBadge priority={req.priority} />
        </div>

        {/* Progress */}
        {stages.length > 0 && (
          <div className="mb-2.5">
            <Progress value={pct} color={c} />
            <div className="flex justify-between mt-1">
              <span className="text-[10px]" style={{ color:"var(--muted-foreground)" }}>
                {doneS}/{stages.length} эт.{allS.length > 0 ? ` · ${allS.filter((s:any)=>s.isCompleted).length}/${allS.length} задач` : ""}
              </span>
              <span className="text-[10px] font-bold" style={{ color:c }}>{pct}%</span>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-2.5" style={{ borderTop:"1px solid var(--border)" }}>
          <span className="text-xs font-bold" style={{ color:"var(--priority-high)" }}>{fmtRub(req.price)}</span>
          <span className="text-[10px]" style={{ color:"var(--muted-foreground)" }}>{fmtDate(req.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ══ KANBAN COLUMN ══ */
function KanbanColumn({ status, items }: { status: string; items: Req[] }) {
  const c     = STATUS_COLOR[status];
  const total = items.filter(r => r.price).reduce((s: number, r: Req) => s + (r.price ?? 0), 0);
  return (
    <div className="flex flex-col gap-2 min-w-[240px] flex-[0_0_256px]">
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background:c }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.7px]" style={{ color:"rgba(244,250,248,0.6)" }}>
            {STATUS_LABEL[status]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && <span className="text-[10px] font-bold" style={{ color:"var(--priority-high)" }}>{fmtRub(total)}</span>}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background:"rgba(255,255,255,0.06)", color:"var(--muted-foreground)" }}>
            {items.length}
          </span>
        </div>
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-2">
        {items.map(r => <KanbanCard key={r.id} req={r} />)}
        {items.length === 0 && (
          <div className="rounded-xl py-8 text-center text-[12px]"
            style={{ border:`1px dashed var(--border)`, color:"var(--muted-foreground)" }}>
            Пусто
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
const STATUSES = ["NEW","IN_REVIEW","APPROVED","IN_PROGRESS","COMPLETED","CANCELLED"] as const;
const ALL_TABS = ["ALL", ...STATUSES] as const;

export default function CrmDashboard() {
  const router = useRouter();
  const [token,     setToken]     = useState("");
  const [requests,  setRequests]  = useState<Req[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [view,      setView]      = useState<"kanban"|"list">("kanban");
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [priFilter, setPriFilter] = useState<string>("ALL");
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    const t = localStorage.getItem("mgr_token") ?? "";
    if (!t) { router.push("/crm"); return; }
    setToken(t); load(t);
  }, []);

  const load = useCallback(async (t?: string) => {
    const tok = t ?? token;
    if (!tok) return;
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      const res = await fetch(`/api/manager/requests?${p}`, { headers: { Authorization: `Bearer ${tok}` } });
      if (res.status === 401) { router.push("/crm"); return; }
      setRequests(await res.json());
    } finally { setLoading(false); }
  }, [token, search]);

  useEffect(() => { if (token) load(); }, [search, token]);

  function logout() { localStorage.removeItem("mgr_token"); router.push("/crm"); }

  /* derived */
  let visible = requests;
  if (statusTab !== "ALL")  visible = visible.filter(r => r.status === statusTab);
  if (priFilter !== "ALL")  visible = visible.filter(r => r.priority === priFilter);

  const counts: Record<string, number> = {};
  requests.forEach(r => { counts[r.status] = (counts[r.status] ?? 0) + 1; });
  const totalRevenue = requests.filter(r => r.price).reduce((s, r) => s + (r.price ?? 0), 0);
  const urgent       = requests.filter(r => r.priority === "URGENT" || r.priority === "HIGH").length;

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="flex flex-col justify-between w-[200px] flex-shrink-0 py-5 px-3"
        style={{ background:"var(--card)", borderRight:"1px solid var(--border)" }}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background:"rgba(45,212,191,0.12)", border:"1px solid rgba(45,212,191,0.2)", color:"var(--primary)" }}>
              OS
            </div>
            <div>
              <div className="text-sm font-bold leading-none">OneStack</div>
              <div className="text-[10px] mt-0.5" style={{ color:"var(--muted-foreground)" }}>CRM</div>
            </div>
          </div>

          <div className="h-px mb-4" style={{ background:"var(--border)" }} />

          <nav className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold"
              style={{ background:"rgba(45,212,191,0.08)", color:"var(--primary)", borderLeft:"2px solid var(--primary)" }}>
              <LayoutDashboard className="w-4 h-4" />
              Заявки
            </div>
          </nav>
        </div>

        <div>
          <div className="h-px mb-3" style={{ background:"var(--border)" }} />
          <button onClick={logout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
            style={{ color:"var(--muted-foreground)" }}>
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom:"1px solid var(--border)" }}>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Рабочий стол</h1>
            <p className="text-xs mt-0.5" style={{ color:"var(--muted-foreground)" }}>
              {new Date().toLocaleDateString("ru-RU", { weekday:"long", day:"numeric", month:"long" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color:"var(--muted-foreground)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="pl-9 pr-3 py-2 text-xs rounded-lg w-48 transition-colors"
                style={{ background:"var(--input)", border:"1px solid var(--border)", color:"var(--foreground)", outline:"none" }}
                onFocus={e => (e.target.style.borderColor = "rgba(45,212,191,0.4)")}
                onBlur={e  => (e.target.style.borderColor = "var(--border)")} />
            </div>
            {/* View toggle */}
            <div className="flex rounded-lg overflow-hidden" style={{ border:"1px solid var(--border)" }}>
              {([["kanban", <Columns3 key="k" className="w-3.5 h-3.5" />],
                 ["list",   <LayoutList key="l" className="w-3.5 h-3.5" />]] as const).map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className="px-3 py-2 transition-colors"
                  style={{ background: view === v ? "rgba(45,212,191,0.1)" : "transparent", color: view === v ? "var(--primary)" : "var(--muted-foreground)" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* KPI strip */}
        <div className="grid grid-cols-5 gap-3 px-6 py-4 flex-shrink-0" style={{ borderBottom:"1px solid var(--border)" }}>
          {[
            { label:"Всего заявок",  value:requests.length,   icon:<TrendingUp className="w-4 h-4" />,    color:"var(--primary)" },
            { label:"Новых",         value:counts.NEW ?? 0,    icon:<Circle className="w-4 h-4" />,        color:"var(--status-new)" },
            { label:"В работе",      value:(counts.IN_PROGRESS ?? 0) + (counts.APPROVED ?? 0), icon:<Loader2 className="w-4 h-4" />, color:"var(--status-progress)" },
            { label:"Срочных",       value:urgent,             icon:<Flame className="w-4 h-4" />,         color:"var(--priority-urgent)" },
            { label:"Выручка",       value:fmtRub(totalRevenue),icon:<CheckCircle2 className="w-4 h-4" />, color:"var(--priority-high)" },
          ].map((k, i) => (
            <div key={i} className="rounded-xl p-3.5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color:k.color }}>{k.icon}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background:k.color }} />
              </div>
              <div className="text-xl font-black tracking-tight">{k.value}</div>
              <div className="text-[11px] mt-0.5" style={{ color:"var(--muted-foreground)" }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-6 py-3 flex-shrink-0 overflow-x-auto" style={{ borderBottom:"1px solid var(--border)" }}>
          {ALL_TABS.map(s => {
            const c   = s === "ALL" ? "var(--primary)" : STATUS_COLOR[s];
            const cnt = s === "ALL" ? requests.length : (counts[s] ?? 0);
            const act = statusTab === s;
            return (
              <button key={s} onClick={() => setStatusTab(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  background: act ? `color-mix(in oklch,${c} 12%,transparent)` : "transparent",
                  border:     `1px solid ${act ? `color-mix(in oklch,${c} 30%,transparent)` : "transparent"}`,
                  color:      act ? c : "var(--muted-foreground)",
                }}>
                {s === "ALL" ? "Все" : STATUS_LABEL[s]}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background:"rgba(255,255,255,0.07)", color: act ? c : "var(--muted-foreground)" }}>
                  {cnt}
                </span>
              </button>
            );
          })}
          <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background:"var(--border)" }} />
          {/* Priority quick filter */}
          {(["ALL","URGENT","HIGH"] as const).map(p => {
            const c   = p === "ALL" ? "var(--muted-foreground)" : PRIORITY_COLOR[p];
            const act = priFilter === p;
            return (
              <button key={p} onClick={() => setPriFilter(p)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all"
                style={{
                  background: act ? `color-mix(in oklch,${c} 12%,transparent)` : "transparent",
                  border:     `1px solid ${act ? `color-mix(in oklch,${c} 25%,transparent)` : "transparent"}`,
                  color:      act ? c : "var(--muted-foreground)",
                }}>
                {p === "ALL" ? "Все приор." : p === "URGENT" ? <><Flame className="w-3 h-3" /> Срочно</> : <><AlertCircle className="w-3 h-3" /> Высокий</>}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            /* Skeleton */
            view === "kanban" ? (
              <div className="flex gap-3">
                {STATUSES.map(s => (
                  <div key={s} className="flex flex-col gap-2 min-w-[240px] flex-[0_0_256px]">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            )
          ) : view === "kanban" ? (
            /* ── KANBAN ── */
            <div className="flex gap-3 h-full pb-4">
              {STATUSES.map(s => (
                <KanbanColumn key={s} status={s} items={visible.filter(r => r.status === s)} />
              ))}
            </div>
          ) : (
            /* ── LIST ── */
            <div className="flex flex-col gap-1">
              {/* Header */}
              <div className="grid gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                style={{ gridTemplateColumns:"2fr 1.2fr 150px 120px 32px", color:"var(--muted-foreground)" }}>
                <span>Клиент</span><span>Услуга</span><span>Прогресс</span><span>Статус</span><span />
              </div>
              {visible.length === 0 && (
                <div className="py-20 text-center" style={{ color:"var(--muted-foreground)" }}>
                  <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Заявок нет</p>
                </div>
              )}
              {visible.map(r => {
                const c      = STATUS_COLOR[r.status];
                const stages = r.project?.stages ?? [];
                const doneS  = stages.filter((s: any) => s.status === "COMPLETED").length;
                const pct    = stages.length ? Math.round(doneS / stages.length * 100) : 0;
                return (
                  <Link key={r.id} href={`/crm/requests/${r.id}`} className="block group">
                    <div className="grid gap-4 px-4 py-3 rounded-xl items-center transition-colors"
                      style={{ gridTemplateColumns:"2fr 1.2fr 150px 120px 32px", background:"var(--card)", border:"1px solid var(--border)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(45,212,191,0.2)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                      {/* Client */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={r.user?.name} email={r.user?.email} size={34} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold truncate">{r.user?.name || r.user?.email?.split("@")[0] || "—"}</span>
                            <PriorityBadge priority={r.priority} />
                          </div>
                          <div className="text-[11px] truncate" style={{ color:"var(--muted-foreground)" }}>
                            {r.user?.company || r.user?.email} · {orderNo(r.id)}
                            {r._count?.files > 0 && <> · <Paperclip className="w-3 h-3 inline -mt-0.5" />{r._count.files}</>}
                            {r.chatMessages?.length > 0 && r.chatMessages[0].role === "client" && <> · <MessageSquare className="w-3 h-3 inline -mt-0.5 text-blue-400" /></>}
                          </div>
                        </div>
                      </div>
                      {/* Service */}
                      <span className="text-sm truncate" style={{ color:"var(--muted-foreground)" }}>{SVC_LABEL[r.service] ?? r.service}</span>
                      {/* Progress */}
                      <div>
                        {stages.length > 0 ? (
                          <div>
                            <Progress value={pct} color={c} />
                            <span className="text-[10px] mt-1 block font-bold" style={{ color:c }}>{pct}%</span>
                          </div>
                        ) : <span className="text-xs" style={{ color:"var(--muted-foreground)" }}>—</span>}
                      </div>
                      {/* Status */}
                      <StatusBadge status={r.status} />
                      {/* Arrow */}
                      <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:"var(--muted-foreground)" }}>›</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
