// src/app/demo/admin/security/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Panel } from "../../ui/DemoCards";
import { Modal } from "../../ui/Modal";
import { Label, TextInput, Toggle } from "../../ui/inputs";
import {
  KeyRound,
  Plus,
  RefreshCw,
  ShieldCheck,
  Shield,
  AlertCircle,
  Search,
  Copy,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Lock,
  Globe,
  Timer,
  RotateCcw,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

/* ─────────────────────────────── helpers ─────────────────────────────── */
type Classish = string | false | null | undefined;
const cls = (...a: Classish[]) => a.filter(Boolean).join(" ");

function timeAgoOr(ts: string) {
  const t = Date.parse(ts);
  if (Number.isNaN(t)) return ts;
  const diff = Math.max(0, Date.now() - t);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s назад`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}м назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}ч назад`;
  const d = Math.floor(h / 24);
  return `${d}д назад`;
}

/* ─────────────────────────────── types ─────────────────────────────── */

type ApiKey = {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  active: boolean;
};
type AuditRow = { id: string; actor: string; action: string; ts: string };

type SortKey = "name" | "createdAt" | "active";
type SortDir = "asc" | "desc";

/* ─────────────────────── политики (локальный персист) ─────────────────────── */

type PolicyKey =
  | "enforce2fa"
  | "blockAnonIP"
  | "geoFenceEU"
  | "jwt15m"
  | "rotate90d"
  | "secretsInKMS";

const POLICY_LABELS: Record<PolicyKey, string> = {
  enforce2fa: "2FA обязательна",
  blockAnonIP: "Запрет из анонимных IP",
  geoFenceEU: "Geo-fence EU only",
  jwt15m: "JWT TTL: 15 мин",
  rotate90d: "Ротация ключей: 90 дней",
  secretsInKMS: "Секреты в KMS/Vault",
};

const POLICY_ICONS: Record<PolicyKey, JSX.Element> = {
  enforce2fa: <Lock className="h-4 w-4" />,
  blockAnonIP: <WifiOff className="h-4 w-4" />,
  geoFenceEU: <Globe className="h-4 w-4" />,
  jwt15m: <Timer className="h-4 w-4" />,
  rotate90d: <RotateCcw className="h-4 w-4" />,
  secretsInKMS: <KeyRound className="h-4 w-4" />,
};

const DEFAULT_POLICIES: Record<PolicyKey, boolean> = {
  enforce2fa: true,
  blockAnonIP: true,
  geoFenceEU: false,
  jwt15m: true,
  rotate90d: true,
  secretsInKMS: true,
};

function usePolicies() {
  const [pol, setPol] = useState<Record<PolicyKey, boolean>>(DEFAULT_POLICIES);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("__DEMO_POLICIES__");
      if (raw) setPol({ ...DEFAULT_POLICIES, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const set = (k: PolicyKey, v: boolean) =>
    setPol((prev) => {
      const next = { ...prev, [k]: v };
      localStorage.setItem("__DEMO_POLICIES__", JSON.stringify(next));
      return next;
    });
  const reset = () => {
    localStorage.removeItem("__DEMO_POLICIES__");
    setPol(DEFAULT_POLICIES);
  };
  const all = (v: boolean) =>
    setPol(() => {
      const next = Object.fromEntries(
        (Object.keys(POLICY_LABELS) as PolicyKey[]).map((k) => [k, v]),
      ) as Record<PolicyKey, boolean>;
      localStorage.setItem("__DEMO_POLICIES__", JSON.stringify(next));
      return next;
    });
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(pol, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "policies.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importJson = (file: File, onError: (msg: string) => void) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result));
        const keys = Object.keys(POLICY_LABELS) as PolicyKey[];
        const ok = keys.every((k) => typeof parsed[k] === "boolean");
        if (!ok) throw new Error("bad shape");
        setPol(parsed);
        localStorage.setItem("__DEMO_POLICIES__", JSON.stringify(parsed));
      } catch {
        onError("Файл невалиден. Ожидается объект { [policyKey]: boolean }.");
      }
    };
    r.readAsText(file);
  };
  return { pol, set, reset, all, exportJson, importJson };
}

/* ─────────────────────────────── page ─────────────────────────────── */

export default function AdminSecurityPage() {
  // API-ключи/аудит
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // формы/стейты
  const [openNew, setOpenNew] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<ApiKey | null>(null);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // поиск/сортировка/пагинация
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // аудит — поиск по actor/action
  const [auditQ, setAuditQ] = useState("");

  // политики
  const {
    pol,
    set: setPolicy,
    reset: resetPolicies,
    all: setAllPolicies,
    exportJson,
    importJson,
  } = usePolicies();
  const importRef = useRef<HTMLInputElement | null>(null);

  // — загрузка с возможностью отмены
  const load = async (signal?: AbortSignal) => {
    setLoading(true);
    setErr(null);
    try {
      const [k, a] = await Promise.all([
        fetch("/api/demo/apikeys", { cache: "no-store", signal }),
        fetch("/api/demo/audit", { cache: "no-store", signal }),
      ]);
      if (!k.ok || !a.ok) throw new Error("HTTP");
      const kj = await k.json();
      const aj = await a.json();
      setKeys(kj.items || []);
      setAudit(aj.items || []);
    } catch (e: any) {
      if (e?.name !== "AbortError") setErr("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, []);

  const copy = async (text: string, msg = "Скопировано") => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(msg);
    } catch {
      setToast("Не удалось скопировать");
    }
  };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  // создание/операции
  const createKey = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/demo/apikeys", {
        method: "POST",
        body: JSON.stringify({ name, active }),
      });
      if (!r.ok) throw new Error();
      setOpenNew(false);
      setName("");
      setActive(true);
      setToast("Ключ создан");
      await load();
    } catch {
      setToast("Ошибка создания ключа");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: string) => {
    setBusy(true);
    try {
      const r = await fetch("/api/demo/apikeys", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (!r.ok) throw new Error();
      setToast("Ключ отключён");
      await load();
    } catch {
      setToast("Ошибка отключения");
    } finally {
      setBusy(false);
      setConfirmRevoke(null);
    }
  };

  const rotate = async (id: string) => {
    setBusy(true);
    try {
      const r = await fetch("/api/demo/apikeys", {
        method: "PATCH",
        body: JSON.stringify({ id, rotate: true }),
      });
      if (!r.ok) throw new Error();
      setToast("Секрет ротирован");
      await load();
    } catch {
      setToast("Ошибка ротации");
    } finally {
      setBusy(false);
    }
  };

  // фильтрация/сортировка/паджин
  const filteredKeys = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? keys.filter(
          (k) =>
            k.name.toLowerCase().includes(s) ||
            k.id.toLowerCase().includes(s) ||
            k.masked.toLowerCase().includes(s),
        )
      : keys;
  }, [q, keys]);

  const sortedKeys = useMemo(() => {
    const arr = [...filteredKeys];
    arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "active") return (Number(a.active) - Number(b.active)) * dir;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    });
    return arr;
  }, [filteredKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedKeys.length / pageSize));
  const pageKeys = sortedKeys.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const activeCount = useMemo(() => keys.filter((k) => k.active).length, [keys]);

  const filteredAudit = useMemo(() => {
    const s = auditQ.trim().toLowerCase();
    return s
      ? audit.filter(
          (a) =>
            a.actor.toLowerCase().includes(s) ||
            a.action.toLowerCase().includes(s) ||
            a.id.toLowerCase().includes(s),
        )
      : audit;
  }, [auditQ, audit]);

  /* ─────────────────────────────── UI ─────────────────────────────── */

  const toastAnim = {
    initial: { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.18, ease: "easeOut" },
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            {...toastAnim}
            className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/80 px-3 py-2 text-sm text-white/90 shadow-xl"
            role="status"
            aria-live="polite"
          >
            <Shield className="h-4 w-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.3rem,3vw,1.8rem)] font-extrabold leading-tight text-white">
            Безопасность
          </h1>
          <p className="mt-0.5 text-white/70">API-ключи, политики и аудит действий.</p>
        </div>
      </div>

      {/* API-ключи */}
      <Panel
        title={`API-ключи · активных: ${activeCount}`}
        footer={
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs text-white/60">
              <AlertCircle className="h-3.5 w-3.5" />
              Демоданные: секрет показывается только при создании.
            </span>
          </div>
        }
      >
        {/* действия/поиск */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setOpenNew(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black font-semibold hover:shadow-white/20 hover:shadow-md"
            >
              <Plus className="h-4 w-4" /> Новый ключ
            </button>
          </div>

          <div className="relative sm:ml-auto w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Поиск (имя/ID/ключ)…"
              aria-label="Поиск по API-ключам"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Таблица ≥ sm */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-[920px] w-full text-sm" aria-busy={loading}>
            <caption className="sr-only">Список API-ключей</caption>
            <thead className="sticky top-0 bg-black/40 backdrop-blur-md">
              <tr className="text-left text-white/60">
                <Th
                  label="Имя"
                  active={sortKey === "name"}
                  dir={sortDir}
                  onClick={() => {
                    setSortKey("name");
                    setSortDir(sortKey === "name" && sortDir === "asc" ? "desc" : "asc");
                  }}
                />
                <th className="py-2 pr-4" scope="col">
                  Ключ
                </th>
                <Th
                  label="Создан"
                  active={sortKey === "createdAt"}
                  dir={sortDir}
                  onClick={() => {
                    setSortKey("createdAt");
                    setSortDir(sortKey === "createdAt" && sortDir === "asc" ? "desc" : "asc");
                  }}
                />
                <Th
                  label="Статус"
                  active={sortKey === "active"}
                  dir={sortDir}
                  onClick={() => {
                    setSortKey("active");
                    setSortDir(sortKey === "active" && sortDir === "asc" ? "desc" : "asc");
                  }}
                />
                <th className="py-2 pr-0 text-right" scope="col">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`sk-${i}`}>
                    <td colSpan={5} className="py-3">
                      <div className="h-3 w-2/3 bg-white/10 rounded" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                pageKeys.map((k) => (
                  <tr key={k.id} className={k.active ? "" : "opacity-70"}>
                    <td className="py-2.5 pr-4">{k.name}</td>
                    <td className="py-2.5 pr-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{k.masked}</span>
                        <button
                          onClick={() => copy(k.id, "ID скопирован")}
                          title="Копировать ID"
                          className="hidden sm:inline-flex rounded-md border border-white/10 px-2 py-1 hover:bg-white/10"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-white/70" title={new Date(k.createdAt).toLocaleString()}>
                      {timeAgoOr(k.createdAt)}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={cls(
                          "rounded-full border px-2 py-0.5 text-[11px]",
                          k.active
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                            : "border-rose-400/30 bg-rose-400/10 text-rose-200",
                        )}
                      >
                        {k.active ? "Активен" : "Отключён"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-0">
                      <div className="flex justify-end gap-2">
                        {/* На десктопе компактные иконки с тултипами */}
                        <button
                          onClick={() => rotate(k.id)}
                          disabled={busy || !k.active}
                          className="hidden sm:inline-flex rounded-xl border border-white/10 p-2 hover:bg-white/10 disabled:opacity-50"
                          title="Ротировать секрет"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmRevoke(k)}
                          disabled={busy || !k.active}
                          className="hidden sm:inline-flex rounded-xl border border-white/10 p-2 hover:bg-white/10 disabled:opacity-50"
                          title="Отключить ключ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {/* Фолбэк с текстом (если понадобится на >=sm) */}
                        <button
                          onClick={() => setConfirmRevoke(k)}
                          disabled={busy || !k.active}
                          className="sm:hidden inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 hover:bg-white/10 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" /> Отключить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && sortedKeys.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8">
                    <div className="flex flex-col items-center gap-2 text-white/60">
                      <ShieldCheck className="h-5 w-5" />
                      <div className="text-sm">Нет ключей по текущему фильтру</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Мобильные карточки < sm */}
        <div className="grid grid-cols-1 gap-3 sm:hidden" aria-live="polite">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`sk-${i}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 animate-pulse">
                <div className="h-4 w-36 rounded bg-white/10" />
                <div className="mt-2 h-3 w-48 rounded bg-white/10" />
                <div className="mt-3 h-8 w-28 rounded bg-white/10" />
              </div>
            ))}
          {!loading &&
            pageKeys.map((k) => (
              <article key={k.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <header className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate">{k.name}</h3>
                    <p className="mt-1 text-xs text-white/60">
                      <span className="font-mono">{k.masked}</span>
                    </p>
                  </div>
                  <span
                    className={cls(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[11px]",
                      k.active ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200",
                    )}
                  >
                    {k.active ? "Активен" : "Отключён"}
                  </span>
                </header>

                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/70">
                  <div>
                    <dt className="text-white/50">Создан</dt>
                    <dd title={new Date(k.createdAt).toLocaleString()}>{timeAgoOr(k.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-white/50">ID</dt>
                    <dd className="font-mono truncate">{k.id}</dd>
                  </div>
                </dl>

                {/* Actions bar */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => rotate(k.id)}
                    disabled={busy || !k.active}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs hover:bg-white/10 disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Ротировать
                  </button>
                  <button
                    onClick={() => setConfirmRevoke(k)}
                    disabled={busy || !k.active}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs hover:bg-white/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Отключить
                  </button>
                  <button
                    onClick={() => copy(k.id, "ID скопирован")}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4" />
                    ID
                  </button>
                </div>
              </article>
            ))}

          {!loading && sortedKeys.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
              Нет ключей по текущему фильтру
            </div>
          )}
        </div>

        {/* пагинация */}
        <div className="mt-3 flex items-center justify-between text-xs text-white/70">
          <div aria-live="polite">
            Страница {page} из {totalPages} • Всего: {sortedKeys.length}
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-full border border-white/20 px-2 py-1 disabled:opacity-50"
              aria-label="Назад"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-full border border-white/20 px-2 py-1 disabled:opacity-50"
              aria-label="Вперёд"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {err && (
          <div className="mt-3 text-xs text-rose-300 inline-flex items-center gap-2" role="alert">
            <AlertCircle className="h-4 w-4" /> {err}
          </div>
        )}
      </Panel>

      {/* Политики */}
      <Panel
        title="Политики доступа"
        footer={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-white/60 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              В демо политики сохраняются в браузере (localStorage). В проде — Policy Store + аудит.
            </span>

            {/* compact segmented actions */}
            <div className="inline-flex rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur gap-1">
              <button
                onClick={() => setAllPolicies(true)}
                className="rounded-full px-3 py-1.5 text-xs hover:bg-white/10"
                title="Включить все"
              >
                Включить все
              </button>
              <button
                onClick={() => setAllPolicies(false)}
                className="rounded-full px-3 py-1.5 text-xs hover:bg-white/10"
                title="Выключить все"
              >
                Выключить все
              </button>
              <button
                onClick={resetPolicies}
                className="rounded-full px-3 py-1.5 text-xs hover:bg-white/10"
                title="Сбросить к дефолту"
              >
                Сброс
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJson(f, (m) => setToast(m));
                  if (importRef.current) importRef.current.value = "";
                }}
              />
            </div>
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(POLICY_LABELS) as PolicyKey[]).map((k) => {
            const on = pol[k];
            return (
              <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {POLICY_ICONS[k]}
                    <div className="text-sm">{POLICY_LABELS[k]}</div>
                  </div>

                  {/* pretty toggle */}
                  <button
                    type="button"
                    onClick={() => setPolicy(k, !on)}
                    className={cls(
                      "relative h-6 w-11 rounded-full border transition",
                      on
                        ? "bg-emerald-400/25 border-emerald-400/40"
                        : "bg-white/[0.06] border-white/25",
                    )}
                    aria-pressed={on}
                    title={on ? "Включено" : "Выключено"}
                  >
                    <span
                      className={cls(
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        on && "translate-x-5",
                      )}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Аудит */}
      <Panel
        title="Аудит действий"
        footer={
          <Link href="/demo/admin/events" className="text-xs hover:underline">
            Перейти в журнал событий →
          </Link>
        }
      >
        <div className="mb-3 relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={auditQ}
            onChange={(e) => setAuditQ(e.target.value)}
            placeholder="Поиск по actor/action/ID…"
            aria-label="Поиск по событиям аудита"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 outline-none placeholder:text-white/40"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[820px] w-full text-sm">
            <caption className="sr-only">Журнал аудита</caption>
            <thead className="sticky top-0 bg-black/30 backdrop-blur-md">
              <tr className="text-left text-white/60">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Кто</th>
                <th className="py-2 pr-4">Действие</th>
                <th className="py-2 pr-4">Время</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredAudit.map((a) => {
                const isKey = /key|api/i.test(a.action);
                const isPolicy = /policy|role|rule/i.test(a.action);
                return (
                  <tr key={a.id} className="hover:bg-white/[0.04]">
                    <td className="py-2 pr-4">{a.id}</td>
                    <td className="py-2 pr-4">{a.actor}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        {isKey ? <KeyRound className="h-4 w-4" /> : isPolicy ? <Shield className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {a.action}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-white/60" title={new Date(a.ts).toLocaleString()}>
                      {timeAgoOr(a.ts)}
                    </td>
                  </tr>
                );
              })}
              {filteredAudit.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-white/60">
                    Пока нет событий по фильтру
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* модалка создания ключа */}
      <Modal
        open={openNew}
        onClose={() => setOpenNew(false)}
        title="Создать API-ключ"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenNew(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              onClick={createKey}
              disabled={busy || !name.trim()}
              className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold disabled:opacity-60"
            >
              Создать
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Имя ключа</Label>
            <div className="mt-2">
              <TextInput value={name} onChange={setName} placeholder="integration-crm" />
            </div>
          </div>
          <div>
            <Label>Статус</Label>
            <div className="mt-2">
              <Toggle checked={active} onChange={setActive} label={active ? "Активен" : "Отключён"} />
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
          <KeyRound className="h-4 w-4" /> Секрет показывается только при создании (в демо — скрыт).
        </div>
      </Modal>

      {/* модалка подтверждения отключения */}
      <Modal
        open={!!confirmRevoke}
        onClose={() => setConfirmRevoke(null)}
        title="Отключить ключ?"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmRevoke(null)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              onClick={() => confirmRevoke && revoke(confirmRevoke.id)}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-black font-semibold disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              Подтвердить
            </button>
          </div>
        }
      >
        {confirmRevoke && (
          <div className="text-sm text-white/80">
            Вы действительно хотите отключить ключ{" "}
            <span className="font-mono">{confirmRevoke.name}</span>?
            <br />
            <span className="text-white/60">ID:</span> <span className="font-mono">{confirmRevoke.id}</span>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ─────────────────────────────── tiny UI ─────────────────────────────── */

function Th({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  const ariaSort = active ? (dir === "asc" ? "ascending" : "descending") : "none";
  return (
    <th className="py-2.5 pr-4 select-none" scope="col" aria-sort={ariaSort}>
      <button
        onClick={onClick}
        className={cls(
          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
          active ? "border-white text-white" : "border-white/25 text-white/70 hover:bg-white/10",
        )}
        aria-label={`Сортировать по: ${label} ${
          active ? (dir === "asc" ? "(по возрастанию)" : "(по убыванию)") : ""
        }`}
        title={`Сортировать по: ${label}`}
      >
        {label}
        <span className="opacity-70">{active ? (dir === "asc" ? "↑" : "↓") : ""}</span>
      </button>
    </th>
  );
}