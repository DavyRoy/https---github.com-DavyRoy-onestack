// src/app/demo/admin/users/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel } from "../../../ui/DemoCards";
import { Modal } from "../../../ui/Modal";
import { Label, TextInput, Select, Toggle } from "../../../ui/inputs";
import {
  ArrowLeft,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

/* ---------------------------- types ---------------------------- */
type Role = "user" | "manager" | "admin";
type User = { id: string; email: string; name: string; role: Role; active: boolean };

/* ---------------------------- page ----------------------------- */
export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [u, setU] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // edit form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [active, setActive] = useState(true);

  // modals
  const [openReset, setOpenReset] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [flash, setFlash] = useState<{ ok?: string; err?: string } | null>(null);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  /* -------------------------- load user ------------------------- */
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/demo/users/${id}`, { cache: "no-store" });
      if (res.status === 404) {
        setU(null);
      } else {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { item: User };
        const found = data.item ?? null;
        setU(found);
        if (found) {
          setName(found.name);
          setEmail(found.email);
          setRole(found.role);
          setActive(found.active);
        }
      }
    } catch {
      setError("Не удалось загрузить профиль");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1800);
    return () => clearTimeout(t);
  }, [flash]);

  /* -------------------------- actions --------------------------- */
  const save = async () => {
    if (!name.trim()) return setFlash({ err: "Введите имя" });
    if (!emailValid) return setFlash({ err: "Неверный email" });
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch(`/api/demo/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role, active }),
      });
      if (!res.ok) throw new Error();
      await load();
      setFlash({ ok: "Сохранено" });
    } catch {
      setFlash({ err: "Ошибка сохранения" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setRemoving(true);
    setFlash(null);
    try {
      const res = await fetch(`/api/demo/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOpenRemove(false);
      router.push("/demo/admin/users");
    } catch {
      setFlash({ err: "Не удалось удалить пользователя" });
      setOpenRemove(false);
    } finally {
      setRemoving(false);
    }
  };

  /* --------------------------- states --------------------------- */
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded bg-white/10" />
        <div className="h-4 w-72 rounded bg-white/10" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-sm text-red-200 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" /> {error}
      </div>
    );
  }
  if (!u) {
    return (
      <div>
        <Link
          href="/demo/admin/users"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Назад
        </Link>
        <div className="mt-4 text-white/70">Пользователь не найден</div>
      </div>
    );
  }

  /* --------------------------- render --------------------------- */
  return (
    <div className="space-y-6">
      <div aria-live="polite" className="sr-only">
        {flash?.ok || flash?.err || ""}
      </div>

      {/* header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <Link
            href="/demo/admin/users"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Назад
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <Avatar name={u.name} />
            <div className="min-w-0">
              <div className="text-2xl sm:text-3xl font-extrabold leading-tight truncate">
                {u.name}
              </div>
              <div className="text-white/70 truncate">{u.email}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setOpenReset(true)}
            className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            disabled={saving || removing}
          >
            Сбросить пароль
          </button>
          <button
            onClick={() => setOpenRemove(true)}
            className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 px-4 py-2 text-sm hover:bg-rose-500/20"
            disabled={saving || removing}
          >
            <Trash2 className="h-4 w-4" /> Удалить
          </button>
          <button
            onClick={save}
            className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold hover:shadow-white/20 hover:shadow-md disabled:opacity-60"
            disabled={saving || removing}
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </div>

      {flash?.ok && <Toast ok msg={flash.ok} />}
      {flash?.err && <Toast msg={flash.err} />}

      {/* profile */}
      <Panel title="Профиль">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormRow label="Имя">
            <TextInput value={name} onChange={setName} placeholder="Иван Петров" />
          </FormRow>
          <FormRow label="Email">
            <TextInput
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="user@company.com"
              invalid={email.length > 0 && !emailValid}
            />
          </FormRow>
          <FormRow label="Роль">
            <Select
              value={role}
              onChange={(v) => setRole(v as Role)}
              options={[
                { value: "user", label: "user" },
                { value: "manager", label: "manager" },
                { value: "admin", label: "admin" },
              ]}
            />
          </FormRow>
          <FormRow label="Статус">
            <Toggle
              checked={active}
              onChange={setActive}
              label={active ? "Активен" : "Заблокирован"}
            />
          </FormRow>
        </div>
      </Panel>

      {/* sessions */}
      <Panel
        title="Сессии и устройства"
        footer="В продакшне: реальные токены/UA/IP и принудительный выход."
      >
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10">
              <tr className="text-left text-white/60">
                <th className="py-2 pr-4">Устройство</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">Город</th>
                <th className="py-2 pr-4">Активность</th>
                <th className="py-2 pr-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                ["Chrome / macOS", "95.31.**.**", "Москва", "сегодня 12:40"],
                ["Safari / iOS", "95.31.**.**", "Москва", "вчера 22:15"],
              ].map(([d, ip, city, t], i) => (
                <tr key={i}>
                  <td className="py-2 pr-4">{d}</td>
                  <td className="py-2 pr-4">{ip}</td>
                  <td className="py-2 pr-4">{city}</td>
                  <td className="py-2 pr-4">{t}</td>
                  <td className="py-2 pr-4">
                    <button className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 hover:bg-white/10">
                      <LogOut className="h-4 w-4" /> Разлогинить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="sm:hidden grid grid-cols-1 gap-3">
          {[
            ["Chrome / macOS", "95.31.**.**", "Москва", "сегодня 12:40"],
            ["Safari / iOS", "95.31.**.**", "Москва", "вчера 22:15"],
          ].map(([d, ip, city, t], i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm font-semibold">{d}</div>
              <div className="mt-1 text-xs text-white/70">{ip} • {city}</div>
              <div className="mt-1 text-xs text-white/60">Активность: {t}</div>
              <button className="mt-3 inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 hover:bg-white/10 text-xs">
                <LogOut className="h-3.5 w-3.5" /> Разлогинить
              </button>
            </div>
          ))}
        </div>
      </Panel>

      {/* quick badges */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["2FA подключена", "рекомендовано для менеджеров"],
          ["Последняя смена пароля", "14 дней назад"],
          ["Проверка прав", "RBAC/ABAC аудит"],
        ].map(([a, b]) => (
          <div
            key={a}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] px-5 py-4 shadow-inner"
          >
            <div className="flex items-center gap-2 text-white/85">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">{a}</span>
            </div>
            <div className="mt-1 text-sm text-white/65">{b}</div>
          </div>
        ))}
      </div>

      {/* reset password modal */}
      <Modal
        open={openReset}
        onClose={() => setOpenReset(false)}
        title="Сброс пароля"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenReset(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              onClick={() => setOpenReset(false)}
              className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold"
            >
              Отправить ссылку
            </button>
          </div>
        }
      >
        <div className="text-sm text-white/80">
          На <span className="font-mono">{u.email}</span> будет отправлена ссылка для сброса пароля.
        </div>
      </Modal>

      {/* remove user modal */}
      <Modal
        open={openRemove}
        onClose={() => setOpenRemove(false)}
        title="Удалить пользователя?"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenRemove(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              disabled={removing}
            >
              Отмена
            </button>
            <button
              onClick={remove}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm text-white font-semibold hover:bg-rose-600 disabled:opacity-60"
              disabled={removing}
            >
              <Trash2 className={`h-4 w-4 ${removing ? "animate-pulse" : ""}`} />{" "}
              {removing ? "Удаляем…" : "Удалить"}
            </button>
          </div>
        }
      >
        <div className="text-sm text-white/80">
          Действие необратимо. Пользователь будет удалён.
        </div>
      </Modal>
    </div>
  );
}

/* -------------------------- helpers -------------------------- */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] border border-white/10 text-lg font-semibold">
      {initials || "?"}
    </span>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Toast({ ok, msg }: { ok?: boolean; msg?: string }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 rounded-xl px-4 py-3 text-sm flex items-center gap-2 shadow-lg border transition-all animate-fade-in`}
      role="status"
      aria-live="polite"
    >
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-red-300" />
      )}
      <span className={ok ? "text-emerald-200" : "text-red-200"}>{msg}</span>
    </div>
  );
}