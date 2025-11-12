// src/app/demo/admin/users/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Trash2,
  ShieldCheck,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Rows2,
} from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Label, TextInput, Select, Toggle } from "../../ui/inputs";
import { Panel } from "../../ui/DemoCards";

type Role = "user" | "manager" | "admin";
type User = { id: string; email: string; name: string; role: Role; active: boolean };

type SortKey = "name" | "email" | "role" | "status";
type SortDir = "asc" | "desc";
type Density = "cozy" | "compact";

const DENSITY_LS_KEY = "__USERS_TABLE_DENSITY__";
const PAGESIZE_LS_KEY = "__USERS_TABLE_PAGESIZE__";
const SORT_LS_KEY = "__USERS_TABLE_SORT__";
const FILTERS_LS_KEY = "__USERS_FILTERS__";

export default function AdminUsersPage() {
  /* ------------------------------ state & form ------------------------------ */
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");

  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null);
  const [flash, setFlash] = useState<{ ok?: string; err?: string } | null>(null);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [active, setActive] = useState(true);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);

  /* ----------------------------- ux preferences ---------------------------- */
  const [density, setDensity] = useState<Density>("cozy");
  useEffect(() => {
    try {
      const d = localStorage.getItem(DENSITY_LS_KEY) as Density | null;
      if (d === "cozy" || d === "compact") setDensity(d);
      const ps = Number(localStorage.getItem(PAGESIZE_LS_KEY) || 10);
      if ([10, 20, 50].includes(ps)) setPageSize(ps);
      const s = JSON.parse(localStorage.getItem(SORT_LS_KEY) || "null");
      if (s?.key && s?.dir) {
        setSortKey(s.key);
        setSortDir(s.dir);
      }
      const f = JSON.parse(localStorage.getItem(FILTERS_LS_KEY) || "null");
      if (f) {
        if (["all", "user", "manager", "admin"].includes(f.roleFilter)) setRoleFilter(f.roleFilter);
        if (["all", "active", "blocked"].includes(f.statusFilter)) setStatusFilter(f.statusFilter);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(DENSITY_LS_KEY, density);
    } catch {}
  }, [density]);

  const [pageSize, setPageSize] = useState<number>(10);
  useEffect(() => {
    try {
      localStorage.setItem(PAGESIZE_LS_KEY, String(pageSize));
    } catch {}
  }, [pageSize]);

  useEffect(() => {
    try {
      localStorage.setItem(SORT_LS_KEY, JSON.stringify({ key: sortKey, dir: sortDir }));
    } catch {}
  }, [sortKey, sortDir]);

  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_LS_KEY, JSON.stringify({ roleFilter, statusFilter }));
    } catch {}
  }, [roleFilter, statusFilter]);

  /* -------------------------------- effects -------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim().toLowerCase()), 220);
    return () => clearTimeout(t);
  }, [q]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/demo/users", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(data.items || []);
    } catch {
      setError("Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1600);
    return () => clearTimeout(t);
  }, [flash]);

  // быстрый фокус на поле поиска по '/'
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* --------------------------------- derive -------------------------------- */
  const filtered = useMemo(() => {
    let out = rows;

    if (debouncedQ) {
      out = out.filter(
        (r) =>
          r.name.toLowerCase().includes(debouncedQ) ||
          r.email.toLowerCase().includes(debouncedQ) ||
          r.role.toLowerCase().includes(debouncedQ)
      );
    }
    if (roleFilter !== "all") out = out.filter((r) => r.role === roleFilter);
    if (statusFilter !== "all")
      out = out.filter((r) => (statusFilter === "active" ? r.active : !r.active));

    const dir = sortDir === "asc" ? 1 : -1;
    out = [...out].sort((a, b) => {
      const va =
        sortKey === "status"
          ? (a.active ? "active" : "blocked")
          : (a as any)[sortKey];
      const vb =
        sortKey === "status"
          ? (b.active ? "active" : "blocked")
          : (b as any)[sortKey];
      return String(va).localeCompare(String(vb), "ru", { sensitivity: "base" }) * dir;
    });

    return out;
  }, [rows, debouncedQ, roleFilter, statusFilter, sortKey, sortDir]);

  // счётчики для чипов
  const counters = useMemo(() => {
    const base = {
      role: { all: rows.length, user: 0, manager: 0, admin: 0 } as Record<"all" | Role, number>,
      status: { all: rows.length, active: 0, blocked: 0 } as Record<"all" | "active" | "blocked", number>,
    };
    rows.forEach((r) => {
      base.role[r.role] += 1;
      base.status[r.active ? "active" : "blocked"] += 1;
    });
    return base;
  }, [rows]);

  /* -------------------------------- paginate -------------------------------- */
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    // сбрасываем страницу при изменении фильтров/размера страницы/поиска
    setPage(1);
  }, [debouncedQ, roleFilter, statusFilter, pageSize]);

  const pageRows = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  /* --------------------------------- actions -------------------------------- */
  const addUser = async () => {
    if (!name.trim()) return setFlash({ err: "Введите имя" });
    if (!emailValid) return setFlash({ err: "Неверный email" });
    setSaving(true);
    setFlash(null);
    try {
      const r = await fetch("/api/demo/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          active,
        }),
      });
      if (!r.ok) throw new Error();
      setOpen(false);
      setName("");
      setEmail("");
      setRole("user");
      setActive(true);
      await load();
      setFlash({ ok: "Пользователь создан" });
    } catch {
      setFlash({ err: "Ошибка создания пользователя" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, title: string) => {
    setConfirm({ id, title });
  };

  const confirmRemove = async () => {
    if (!confirm) return;
    const { id } = confirm;
    setRemovingId(id);
    setFlash(null);
    try {
      const res = await fetch(`/api/demo/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      await load();
      setFlash({ ok: "Пользователь удалён" });
    } catch {
      setFlash({ err: "Не удалось удалить" });
    } finally {
      setRemovingId(null);
      setConfirm(null);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ---------------------------------- ui ---------------------------------- */
  const padY = density === "compact" ? "py-1.5" : "py-2";
  const cellPad = ` ${padY} pr-4`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-3xl font-extrabold leading-tight">Пользователи</div>
          <p className="mt-1 text-white/70">Создание аккаунтов, роли и статус активности.</p>
        </div>

        {/* переключатель плотности */}
        <div className="inline-flex items-center gap-2 self-center">
          <button
            onClick={() => setDensity(density === "cozy" ? "compact" : "cozy")}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
            title={density === "compact" ? "Стандартная высота строк" : "Компактные строки"}
            aria-pressed={density === "compact"}
          >
            <Rows2 className="h-4 w-4" />
            {density === "compact" ? "Компактно" : "Стандарт"}
          </button>
        </div>
      </div>

      {/* live region for flash */}
      <div aria-live="polite" className="sr-only">
        {flash?.ok || flash?.err || ""}
      </div>

      {/* flash */}
      {flash?.ok && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2" role="status">
          <CheckCircle2 className="h-4 w-4" /> {flash.ok}
        </div>
      )}
      {flash?.err && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-center gap-2" role="status">
          <AlertTriangle className="h-4 w-4" /> {flash.err}
        </div>
      )}

      <Panel
        title="Поиск и фильтры"
        actions={
          <div className="hidden sm:flex items-center gap-2">
            {/* счётчики */}
            <span className="text-xs text-white/60">Всего: {rows.length}</span>
            <span className="text-xs text-white/60">• Активных: {counters.status.active}</span>
            <span className="text-xs text-white/60">• Заблокированных: {counters.status.blocked}</span>

            {/* page size */}
            <div className="ml-3 inline-flex items-center gap-1">
              {[10, 20, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setPageSize(n)}
                  className={`rounded-full px-3 py-1.5 text-xs border transition ${pageSize === n ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"}`}
                  aria-pressed={pageSize === n}
                  title={`Показывать по ${n}`}
                >
                  {n}/стр.
                </button>
              ))}
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* поиск */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по имени/email/роли…  (нажмите «/»)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-4 py-2.5 outline-none placeholder:text-white/40"
              aria-label="Поиск пользователей"
            />
          </div>

          {/* фильтры */}
          <div className="flex flex-wrap gap-2">
            {(["all", "user", "manager", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r as any)}
                aria-pressed={roleFilter === r}
                className={`rounded-full px-3 py-1.5 text-xs border transition capitalize ${
                  roleFilter === r ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"
                }`}
                title={`Фильтр по роли: ${r}`}
              >
                роль: {r}
                {r !== "all" && (
                  <span className="ml-1 rounded-full border border-white/20 px-1.5 text-[10px]">
                    {counters.role[r]}
                  </span>
                )}
              </button>
            ))}
            {(["all", "active", "blocked"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                aria-pressed={statusFilter === s}
                className={`rounded-full px-3 py-1.5 text-xs border transition ${
                  statusFilter === s ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"
                }`}
                title={`Фильтр по статусу: ${s}`}
              >
                статус: {s}
                {s !== "all" && (
                  <span className="ml-1 rounded-full border border-white/20 px-1.5 text-[10px]">
                    {counters.status[s]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:ml-auto inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-black font-semibold hover:shadow-white/20 hover:shadow-lg disabled:opacity-60"
            disabled={saving}
          >
            <UserPlus className="h-4 w-4" /> Новый пользователь
          </button>
        </div>

        {/* page size на мобилке */}
        <div className="mt-3 sm:hidden flex items-center gap-2">
          <span className="text-xs text-white/60">На странице:</span>
          {[10, 20, 50].map((n) => (
            <button
              key={n}
              onClick={() => setPageSize(n)}
              className={`rounded-full px-3 py-1.5 text-xs border transition ${pageSize === n ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"}`}
              aria-pressed={pageSize === n}
            >
              {n}
            </button>
          ))}
        </div>
      </Panel>

      {/* Desktop table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hidden sm:block">
        <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold" aria-live="polite">
          {loading ? "Загрузка…" : error ? "Ошибка загрузки" : `Найдено: ${filtered.length}`}
        </div>

        {error ? (
          <div className="px-5 py-6 text-red-200 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              <table className="min-w-[860px] w-full text-sm">
                <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10">
                  <tr className="text-left text-white/60">
                    <ThSort currentKey={sortKey} dir={sortDir} setKey={toggleSort} k="name">
                      Имя
                    </ThSort>
                    <ThSort currentKey={sortKey} dir={sortDir} setKey={toggleSort} k="email">
                      Email
                    </ThSort>
                    <ThSort currentKey={sortKey} dir={sortDir} setKey={toggleSort} k="role">
                      Роль
                    </ThSort>
                    <ThSort currentKey={sortKey} dir={sortDir} setKey={toggleSort} k="status">
                      Статус
                    </ThSort>
                    <th className={`pr-4 ${padY}`}>Действия</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {loading &&
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className={cellPad}><div className="h-4 w-40 rounded bg-white/10" /></td>
                        <td className={cellPad}><div className="h-4 w-56 rounded bg-white/10" /></td>
                        <td className={cellPad}><div className="h-4 w-16 rounded bg-white/10" /></td>
                        <td className={cellPad}><div className="h-4 w-24 rounded bg-white/10" /></td>
                        <td className={cellPad}><div className="h-8 w-24 rounded bg-white/10" /></td>
                      </tr>
                    ))}

                  {!loading &&
                    pageRows.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.03] transition">
                        <td className={cellPad}>
                          <div className="flex items-center gap-3">
                            <Avatar name={r.name} />
                            <span className="truncate">{r.name}</span>
                          </div>
                        </td>
                        <td className={`${cellPad} text-white/85`}>
                          <span className="truncate block max-w-[320px]">{r.email}</span>
                        </td>
                        <td className={cellPad}>
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] ${roleClass(r.role)}`}>
                            {r.role}
                          </span>
                        </td>
                        <td className={cellPad}>
                          {r.active ? (
                            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 px-2 py-0.5 text-[11px]">
                              Активен
                            </span>
                          ) : (
                            <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px]">
                              Заблокирован
                            </span>
                          )}
                        </td>
                        <td className={cellPad}>
                          <button
                            onClick={() => remove(r.id, r.name)}
                            disabled={removingId === r.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 hover:bg-white/10 disabled:opacity-60"
                            aria-label={`Удалить ${r.name}`}
                            title="Удалить пользователя"
                          >
                            {removingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}

                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10">
                        <div className="flex flex-col items-center gap-2 text-white/60">
                          <ShieldCheck className="h-5 w-5" />
                          <div className="text-sm">Ничего не найдено по фильтрам</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* пагинация */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/10 flex flex-wrap gap-2 items-center justify-between text-xs text-white/70">
            <div className="flex items-center gap-3">
              <span>Стр. {page} из {totalPages}</span>
              <span className="hidden sm:inline">• Показано {pageRows.length} из {filtered.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 hover:bg-white/10 disabled:opacity-50"
                disabled={page === 1}
                title="Назад"
                aria-label="Назад"
              >
                <ChevronLeft className="h-4 w-4" />
                Назад
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 hover:bg-white/10 disabled:opacity-50"
                disabled={page === totalPages}
                title="Вперёд"
                aria-label="Вперёд"
              >
                Вперёд
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile list (cards) */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {/* статус / счётчики */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/70">
          Найдено: {filtered.length} • Активных: {counters.status.active} • Заблок.: {counters.status.blocked}
        </div>

        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`sk-${i}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 animate-pulse">
              <div className="h-4 w-36 rounded bg-white/10" />
              <div className="mt-2 h-3 w-48 rounded bg-white/10" />
              <div className="mt-3 h-8 w-28 rounded bg-white/10" />
            </div>
          ))}

        {!loading &&
          pageRows.map((r) => (
            <article key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <header className="flex items-center gap-3">
                <Avatar name={r.name} />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">{r.name}</h3>
                  <p className="mt-0.5 text-xs text-white/70 truncate">{r.email}</p>
                </div>
                <span className={`ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${roleClass(r.role)}`}>
                  {r.role}
                </span>
              </header>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={r.active ? "text-emerald-300" : "text-white/70"}>
                  {r.active ? "Активен" : "Заблокирован"}
                </span>
                <button
                  onClick={() => remove(r.id, r.name)}
                  disabled={removingId === r.id}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 hover:bg-white/10 disabled:opacity-60"
                  aria-label={`Удалить ${r.name}`}
                >
                  {removingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Удалить
                </button>
              </div>
            </article>
          ))}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
            Ничего не найдено по фильтрам
          </div>
        )}

        {/* пагинация (моб) */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Стр. {page} из {totalPages}</span>
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-white/20 px-2 py-1 disabled:opacity-50"
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border border-white/20 px-2 py-1 disabled:opacity-50"
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* пояснения */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["Роли: admin/manager/user", "минимум для демо"],
          ["Пароли/SSO", "в проде — SSO/OIDC/SAML"],
          ["Права", "RBAC/ABAC, аудит"],
        ].map(([a, b]) => (
          <div key={a} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <div className="flex items-center gap-2 text-white/85">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">{a}</span>
            </div>
            <div className="mt-1 text-sm text-white/65">{b}</div>
          </div>
        ))}
      </div>

      {/* modal: create */}
      <Modal
        open={open}
        onClose={() => (saving ? null : setOpen(false))}
        title="Новый пользователь"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
              disabled={saving}
            >
              Отмена
            </button>
            <button
              onClick={addUser}
              className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Создаём…" : "Создать"}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Имя</Label>
            <div className="mt-2">
              <TextInput value={name} onChange={setName} placeholder="Иван Петров" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <div className="mt-2">
              <TextInput
                value={email}
                onChange={setEmail}
                placeholder="user@company.com"
                type="email"
                invalid={email.length > 0 && !emailValid}
              />
            </div>
          </div>
          <div>
            <Label>Роль</Label>
            <div className="mt-2">
              <Select
                value={role}
                onChange={(v) => setRole(v as Role)}
                options={[
                  { value: "user", label: "user" },
                  { value: "manager", label: "manager" },
                  { value: "admin", label: "admin" },
                ]}
              />
            </div>
          </div>
          <div>
            <Label>Статус</Label>
            <div className="mt-2">
              <Toggle checked={active} onChange={setActive} label={active ? "Активен" : "Заблокирован"} />
            </div>
          </div>
        </div>
      </Modal>

      {/* modal: confirm delete */}
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Удалить пользователя?"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirm(null)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              onClick={confirmRemove}
              className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold"
            >
              Удалить
            </button>
          </div>
        }
      >
        {confirm && (
          <div className="text-sm text-white/80">
            Действие необратимо. Пользователь «{confirm.title}» будет удалён.
          </div>
        )}
      </Modal>
    </div>
  );
}

/* -------------------------------- helpers -------------------------------- */

function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] border border-white/10 text-[11px]">
      {initials || "?"}
    </span>
  );
}

function roleClass(role: Role) {
  switch (role) {
    case "admin":
      return "border-rose-400/30 bg-rose-400/10 text-rose-200";
    case "manager":
      return "border-sky-400/30 bg-sky-400/10 text-sky-200";
    default:
      return "border-white/15 bg-white/[0.06]";
  }
}

function ThSort({
  children,
  k,
  currentKey,
  dir,
  setKey,
}: {
  children: React.ReactNode;
  k: SortKey;
  currentKey: SortKey;
  dir: SortDir;
  setKey: (k: SortKey) => void;
}) {
  const active = currentKey === k;
  return (
    <th className="pr-4 select-none">
      <button
        onClick={() => setKey(k)}
        className={`inline-flex items-center gap-1 text-left hover:text-white ${active ? "text-white" : "text-white/60"}`}
        title="Сортировать"
        aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      >
        <span className="py-2">{children}</span>
        <span className="text-xs opacity-70">{active ? (dir === "asc" ? "▲" : "▼") : " "}</span>
      </button>
    </th>
  );
}