// src/app/demo/admin/roles/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Panel } from "../../ui/DemoCards";
import {
  Search,
  ShieldCheck,
  Save,
  AlertTriangle,
  Download,
  Upload,
  RotateCcw,
  Users,
  Package,
  FileBarChart,
  Settings,
  XCircle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- types ---------- */

type Role = "admin" | "manager" | "user";
type Perm =
  | "users.read" | "users.write" | "users.delete"
  | "orders.read" | "orders.write"
  | "reports.view" | "reports.export"
  | "settings.read" | "settings.write";

const ALL_PERMS: Perm[] = [
  "users.read","users.write","users.delete",
  "orders.read","orders.write",
  "reports.view","reports.export",
  "settings.read","settings.write",
];

type Matrix = Record<Role, Record<Perm, boolean>>;

const DEFAULT_MATRIX: Matrix = {
  admin: Object.fromEntries(ALL_PERMS.map((p) => [p, true])) as Matrix["admin"],
  manager: {
    "users.read": true, "users.write": true, "users.delete": false,
    "orders.read": true, "orders.write": true,
    "reports.view": true, "reports.export": true,
    "settings.read": true, "settings.write": false,
  },
  user: {
    "users.read": false, "users.write": false, "users.delete": false,
    "orders.read": true, "orders.write": false,
    "reports.view": true, "reports.export": false,
    "settings.read": false, "settings.write": false,
  },
};

const CATS = ["users","orders","reports","settings"] as const;
type Cat = typeof CATS[number];
const catOf = (p: Perm): Cat => p.split(".")[0] as Cat;

/* ---------- helpers ---------- */

function deepEqual(a: any, b: any) {
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
}
function downloadBlob(filename: string, data: string, mime = "application/json;charset=utf-8") {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ---------- icons ---------- */
const CAT_ICON: Record<Cat, JSX.Element> = {
  users: <Users className="h-4 w-4" />,
  orders: <Package className="h-4 w-4" />,
  reports: <FileBarChart className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

/* ---------- page ---------- */

export default function RolesMatrixPage() {
  const [matrix, setMatrix] = useState<Matrix>(DEFAULT_MATRIX);
  const [serverMatrix, setServerMatrix] = useState<Matrix | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [cat, setCat] = useState<Cat | "all">("all");

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch("/api/demo/roles", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          if (isMounted && j?.matrix) {
            setMatrix(j.matrix as Matrix);
            setServerMatrix(j.matrix as Matrix);
          } else {
            setServerMatrix(DEFAULT_MATRIX);
          }
        } else {
          setServerMatrix(DEFAULT_MATRIX);
        }
      } catch {
        setServerMatrix(DEFAULT_MATRIX);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // debounce
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim().toLowerCase()), 220);
    return () => clearTimeout(id);
  }, [q]);

  const filteredPerms = useMemo(() => {
    const byCat = (p: Perm) => (cat === "all" ? true : catOf(p) === cat);
    const s = debouncedQ;
    return ALL_PERMS.filter((p) => byCat(p) && (!s || p.toLowerCase().includes(s)));
  }, [debouncedQ, cat]);

  const dirty = useMemo(() => !deepEqual(matrix, serverMatrix ?? DEFAULT_MATRIX), [matrix, serverMatrix]);

  // cell ops
  const setCell = (role: Role, perm: Perm, v: boolean) =>
    setMatrix((m) => ({ ...m, [role]: { ...m[role], [perm]: v } }));

  const setRoleColumn = (role: Role, v: boolean) =>
    setMatrix((m) => ({
      ...m,
      [role]: Object.fromEntries(ALL_PERMS.map((p) => [p, v])) as Matrix[Role],
    }));

  const roleState = (role: Role) => {
    const vals = ALL_PERMS.map((p) => matrix[role][p]);
    const all = vals.every(Boolean);
    const none = vals.every((x) => !x);
    return all ? "all" : none ? "none" : "some";
  };

  const setRowAll = (perm: Perm, v: boolean) =>
    setMatrix((m) => ({
      admin: { ...m.admin, [perm]: v },
      manager: { ...m.manager, [perm]: v },
      user: { ...m.user, [perm]: v },
    }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/demo/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrix }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setServerMatrix(matrix);
      setToast("Сохранено");
      setTimeout(() => setToast(null), 1500);
    } catch {
      setError("Не удалось сохранить матрицу");
    } finally {
      setSaving(false);
    }
  };

  const resetDefault = () => {
    setMatrix(DEFAULT_MATRIX);
    setToast("Сброшено к дефолту");
    setTimeout(() => setToast(null), 1500);
  };

  const exportJSON = () => {
    downloadBlob("roles-matrix.json", JSON.stringify(matrix, null, 2));
  };

  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        (["admin","manager","user"] as Role[]).forEach((r) => {
          if (!parsed[r]) throw new Error("bad");
          ALL_PERMS.forEach((p) => {
            if (typeof parsed[r][p] !== "boolean") throw new Error("bad");
          });
        });
        setMatrix(parsed as Matrix);
        setToast("Импортировано");
        setTimeout(() => setToast(null), 1500);
      } catch {
        setError("Файл некорректен");
        setTimeout(() => setError(null), 2500);
      }
    };
    reader.readAsText(file);
  };

  const mark = (text: string) => {
    const s = debouncedQ;
    if (!s) return text;
    const idx = text.toLowerCase().indexOf(s);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + s.length);
    const after = text.slice(idx + s.length);
    return (
      <>
        {before}
        <span className="bg-amber-400/40 text-black rounded px-0.5">{match}</span>
        {after}
      </>
    );
  };

  /* ---------- UI ---------- */
  const rowAnim = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
    transition: { duration: 0.18, ease: "easeOut" },
  };

  return (
    <div className="space-y-6">
      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            {...rowAnim}
            className="fixed right-4 top-4 z-50 rounded-xl border border-white/15 bg-black/80 px-3 py-2 text-sm text-white/90 shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.3rem,3vw,1.8rem)] font-extrabold leading-tight text-white">Роли и права</h1>
          <p className="mt-0.5 text-white/70">Матрица RBAC (демо). В проде — Policy Store и аудит изменений.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
              dirty ? "bg-white text-black" : "bg-white/20 text-white/85"
            } disabled:opacity-60`}
          >
            <Save className="h-4 w-4" />
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
          <button
            onClick={resetDefault}
            className="inline-flex items-center gap-2 rounded-full border border-red-400/30 px-3 py-1.5 text-xs hover:bg-red-500/10 text-red-300"
          >
            <RotateCcw className="h-4 w-4" /> Сброс
          </button>
        </div>
      </div>

      <Panel title="Матрица прав">
        {/* toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative grow min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по правам (например, reports)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 outline-none placeholder:text-white/40"
            />
          </div>

          {/* категории */}
          <div className="flex flex-wrap gap-2">
            {(["all", ...CATS] as const).map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border transition capitalize ${
                    active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"
                  }`}
                >
                  {c !== "all" ? CAT_ICON[c as Cat] : <ShieldCheck className="h-4 w-4" />}
                  {c}
                </button>
              );
            })}
          </div>

          {/* ВЕРХНИЕ КНОПКИ ЭКСПОРТ/ИМПОРТ — скрыты на мобилке */}
          <div className="hidden sm:flex flex-wrap gap-2 ml-auto">
            <button
              onClick={exportJSON}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Экспорт JSON"
            >
              <Download className="h-4 w-4" /> Экспорт
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importJSON(f);
                if (fileRef.current) fileRef.current.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Импорт JSON"
            >
              <Upload className="h-4 w-4" /> Импорт
            </button>
          </div>
        </div>

        {/* ====== MOBILE LIST ====== */}
        <div className="sm:hidden">
          {(["users","orders","reports","settings"] as const)
            .filter((c) => (cat === "all" ? true : c === cat))
            .map((category) => {
              const catPerms = filteredPerms.filter((p) => catOf(p) === category);
              if (catPerms.length === 0) return null;
              return (
                <details key={category} className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] open:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                  <summary className="flex items-center justify-between gap-2 cursor-pointer list-none px-4 py-3">
                    <div className="flex items-center gap-2">
                      {CAT_ICON[category]}
                      <span className="font-semibold capitalize">{category}</span>
                      <span className="text-xs text-white/60">({catPerms.length})</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white/60" />
                  </summary>

                  <div className="px-2 pb-3">
                    {catPerms.map((perm) => (
                      <div key={perm} className="rounded-lg border border-white/10 bg-black/30 p-3 mb-2">
                        <div className="mb-2 font-mono text-[13px]">{mark(perm)}</div>
                        <div className="flex flex-wrap gap-2">
                          {(["admin","manager","user"] as Role[]).map((role) => {
                            const active = matrix[role][perm];
                            return (
                              <button
                                key={role}
                                onClick={() => setCell(role, perm, !active)}
                                aria-pressed={active}
                                className={`flex-1 min-w-[88px] inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm transition capitalize ${
                                  active
                                    ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30"
                                    : "bg-white/10 text-white/80 border-white/25"
                                }`}
                              >
                                {active ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                {role}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRowAll(perm, true)}
                            className="rounded-full border border-emerald-400/30 px-3 py-1.5 text-xs hover:bg-emerald-400/15 text-emerald-200"
                          >
                            всем ✓
                          </button>
                          <button
                            onClick={() => setRowAll(perm, false)}
                            className="rounded-full border border-rose-400/30 px-3 py-1.5 text-xs hover:bg-rose-400/15 text-rose-200"
                          >
                            всем ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}

          {/* ЕДИНСТВЕННЫЙ БЛОК КНОПОК НА МОБИЛКЕ (красиво и без дублей) */}
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={save}
                disabled={saving}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold ${
                  dirty ? "bg-white text-black" : "bg-white/20 text-white/85"
                } disabled:opacity-60`}
              >
                <Save className="h-4 w-4" />
                {saving ? "…" : "Сохранить"}
              </button>

              <button
                onClick={exportJSON}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/30 px-3 py-2 text-xs hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Экспорт
              </button>

              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/30 px-3 py-2 text-xs hover:bg-white/10"
              >
                <Upload className="h-4 w-4" />
                Импорт
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJSON(f);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              />
            </div>
          </div>

          {filteredPerms.length === 0 && (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
              Ничего не найдено
            </div>
          )}
        </div>

        {/* ====== DESKTOP TABLE ====== */}
        <div className="hidden sm:block rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold flex items-center gap-3">
            {loading ? "Загрузка…" : `Прав: ${filteredPerms.length}`}
            {error && (
              <span className="inline-flex items-center gap-1 text-rose-300 text-xs">
                <AlertTriangle className="h-4 w-4" /> {error}
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck className="h-4 w-4" />
              Демо: память dev-сервера; в проде — audit trail.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-sm">
              <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10">
                <tr className="text-left text-white/60">
                  <th className="py-2.5 pr-4 sticky left-0 bg-black/40 backdrop-blur-md z-10">Право</th>
                  {(["admin","manager","user"] as Role[]).map((r)=>(
                    <th key={r} className="py-2.5 pr-4 capitalize">
                      <div className="flex items-center gap-2">
                        <span>{r}</span>
                        <RoleChip state={roleState(r)} onClick={() => setRoleColumn(r, roleState(r) !== "all")} />
                      </div>
                    </th>
                  ))}
                  <th className="py-2.5 pr-4 text-right">Строка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <AnimatePresence initial={false}>
                  {filteredPerms.map((perm) => (
                    <motion.tr key={perm} {...rowAnim} className="hover:bg-white/[0.05]">
                      <td className="py-2.5 pr-4 font-mono sticky left-0 bg-black/20 backdrop-blur-md z-10">
                        {mark(perm)}
                      </td>
                      {(["admin", "manager", "user"] as Role[]).map((role) => {
                        const active = matrix[role][perm];
                        return (
                          <td key={role} className="py-2.5 pr-4">
                            <button
                              onClick={() => setCell(role, perm, !active)}
                              aria-pressed={active}
                              className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 text-xs transition ${
                                active
                                  ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30"
                                  : "bg-white/10 text-white/70 border-white/25 hover:bg-white/20"
                              }`}
                              title={`${perm} • ${role}`}
                            >
                              {active ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-2.5 pr-4 text-right">
                        <button
                          onClick={() => setRowAll(perm, true)}
                          className="rounded-full border border-emerald-400/30 px-2.5 py-1 text-xs hover:bg-emerald-400/15 text-emerald-200 mr-1.5"
                        >
                          всем ✓
                        </button>
                        <button
                          onClick={() => setRowAll(perm, false)}
                          className="rounded-full border border-rose-400/30 px-2.5 py-1 text-xs hover:bg-rose-400/15 text-rose-200"
                        >
                          всем ×
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredPerms.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-white/60">Ничего не найдено</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ---------- tiny UI ---------- */

function RoleChip({ state, onClick }: { state: "all" | "some" | "none"; onClick: () => void }) {
  const label = state === "all" ? "все ✓" : state === "none" ? "все ×" : "часть";
  const cls =
    state === "all"
      ? "bg-emerald-400/15 text-emerald-200 border-emerald-400/30"
      : state === "none"
      ? "bg-white/10 text-white/80 border-white/25"
      : "bg-amber-400/15 text-amber-200 border-amber-400/30";
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-0.5 text-[11px] ${cls}`}
      title="Переключить всю роль"
    >
      {label}
    </button>
  );
}