// src/app/demo/user/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel } from "../../ui/DemoCards";
import { Label, TextInput, Toggle, Select } from "../../ui/inputs";
import { Modal } from "../../ui/Modal";
import {
  KeyRound,
  ShieldCheck,
  Copy,
  CheckCircle2,
  CircleAlert,
  Smartphone,
  MonitorSmartphone,
  RefreshCw,
  Bell,
  Mail,
} from "lucide-react";

type Role = "user" | "manager" | "admin";
type DemoUser = { id: string; name: string; email: string; role: Role; active: boolean };

type Profile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  lang: "ru" | "en";
};
type Prefs = {
  news: boolean;
  alerts: boolean;
  twofa: boolean;
};

const LS_PROFILE = "__DEMO_USER_PROFILE__";
const LS_PREFS = "__DEMO_USER_PREFS__";

const DEFAULT_PROFILE: Profile = {
  name: "Иван Петров",
  email: "user@company.com",
  phone: "+7 (999) 000-00-00",
  city: "Москва",
  lang: "ru",
};

const DEFAULT_PREFS: Prefs = {
  news: true,
  alerts: true,
  twofa: true,
};

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);

  // профиль
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);
  // валидность
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()), [p.email]);
  const phoneValid = useMemo(() => p.phone.replace(/\D/g, "").length >= 10, [p.phone]);

  // предпочтения
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  // вспышки «сохранено»
  const [savedProfile, setSavedProfile] = useState<string | null>(null);
  const [savedPrefs, setSavedPrefs] = useState<string | null>(null);

  // смена пароля
  const [openPwd, setOpenPwd] = useState(false);
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pwdErr, setPwdErr] = useState<string | null>(null);

  // 2FA
  const [open2fa, setOpen2fa] = useState(false);

  // копирование email
  const [copied, setCopied] = useState(false);

  // сеансы
  const [sessions, setSessions] = useState([
    { id: "s1", dev: "iPhone 14", loc: "Москва", last: "сегодня 10:22", icon: <Smartphone className="h-4 w-4" /> },
    { id: "s2", dev: "MacBook Pro", loc: "Москва", last: "вчера 21:05", icon: <MonitorSmartphone className="h-4 w-4" /> },
  ]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // загрузка «текущего» пользователя + локальные сохранения
  useEffect(() => {
    const load = async () => {
      try {
        const rawP = localStorage.getItem(LS_PROFILE);
        const rawPref = localStorage.getItem(LS_PREFS);
        if (rawP) setP({ ...DEFAULT_PROFILE, ...JSON.parse(rawP) });
        if (rawPref) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(rawPref) });

        const r = await fetch("/api/demo/users", { cache: "no-store" });
        const data = await r.json();
        const list = (data.items as DemoUser[]) || [];
        const me = list.find((u) => u.role === "user") || list[0];
        if (me) setP((old) => ({ ...old, name: me.name, email: me.email }));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const initials = useMemo(
    () => p.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase(),
    [p.name]
  );

  const setProfile = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setP((old) => ({ ...old, [k]: v }));

  const setPref = <K extends keyof Prefs>(k: K, v: Prefs[K]) =>
    setPrefs((old) => ({ ...old, [k]: v }));

  const dirtyProfile = useMemo(() => {
    const base = DEFAULT_PROFILE;
    const current = p;
    return (
      base.name !== current.name ||
      base.email !== current.email ||
      base.phone !== current.phone ||
      base.city !== current.city ||
      base.lang !== current.lang
    );
  }, [p]);

  const dirtyPrefs = useMemo(() => {
    const base = DEFAULT_PREFS;
    return base.news !== prefs.news || base.alerts !== prefs.alerts || base.twofa !== prefs.twofa;
  }, [prefs]);

  const saveProfile = async () => {
    if (!emailValid || !phoneValid) return;
    await new Promise((r) => setTimeout(r, 400));
    try {
      localStorage.setItem(LS_PROFILE, JSON.stringify(p));
    } catch {}
    setSavedProfile("Профиль сохранён");
    setTimeout(() => setSavedProfile(null), 1500);
  };

  const savePrefs = async () => {
    await new Promise((r) => setTimeout(r, 300));
    try {
      localStorage.setItem(LS_PREFS, JSON.stringify(prefs));
    } catch {}
    setSavedPrefs("Настройки сохранены");
    setTimeout(() => setSavedPrefs(null), 1500);
  };

  const pwdStrength = useMemo(() => {
    let s = 0;
    if (pwd1.length >= 8) s++;
    if (/[A-ZА-Я]/.test(pwd1)) s++;
    if (/[0-9]/.test(pwd1)) s++;
    if (/[^A-Za-z0-9А-Яа-я]/.test(pwd1)) s++;
    return s; // 0..4
  }, [pwd1]);

  const changePassword = async () => {
    if (pwd1.length < 8) return setPwdErr("Минимум 8 символов");
    if (pwd1 !== pwd2) return setPwdErr("Пароли не совпадают");
    setPwdErr(null);
    await new Promise((r) => setTimeout(r, 500));
    setOpenPwd(false);
    setPwd1("");
    setPwd2("");
    setSavedProfile("Пароль обновлён");
    setTimeout(() => setSavedProfile(null), 1500);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(p.email);
      setCopied(true);
      setSavedProfile("Email скопирован");
      setTimeout(() => {
        setSavedProfile(null);
        setCopied(false);
      }, 1200);
    } catch {}
  };

  const refreshSessions = async () => {
    setSessionsLoading(true);
    // демо-обновление
    await new Promise((r) => setTimeout(r, 600));
    setSessions((xs) => [...xs]);
    setSessionsLoading(false);
  };

  if (loading) return <div className="text-white/70">Загрузка…</div>;

  // ids для aria-describedby
  const emailHintId = !emailValid ? "pf-email-hint" : undefined;
  const phoneHintId = !phoneValid ? "pf-phone-hint" : undefined;

  return (
    <div className="space-y-6">
      {/* Hero / banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.10] via-white/[0.04] to-transparent" />
        <div
          className="relative px-4 sm:px-5 py-6 sm:py-8 bg-[radial-gradient(80%_120%_at_0%_0%,rgba(255,255,255,0.10),transparent_60%)]"
          role="banner"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center text-2xl font-semibold"
              title={p.name}
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-2xl sm:text-3xl font-extrabold leading-tight truncate">{p.name}</div>
              <div className="mt-1 flex items-center gap-2 text-white/70">
                <span className="truncate">{p.email}</span>
                <button
                  onClick={copyEmail}
                  className={`rounded-full border border-white/20 px-2 py-1 text-xs hover:bg-white/10 inline-flex items-center gap-1 transition ${
                    copied ? "bg-white text-black border-white" : ""
                  }`}
                  title="Скопировать email"
                  aria-live="polite"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "скопировано" : "копировать"}
                </button>
              </div>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-sm text-white/85">
                <ShieldCheck className="h-4 w-4" /> Демо-профиль
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Профиль */}
      <Panel title="Профиль">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Имя" htmlFor="pf-name">
            <TextInput id="pf-name" value={p.name} onChange={(v) => setProfile("name", v)} placeholder="Иван Петров" />
          </Field>

          <Field
            label="Email"
            htmlFor="pf-email"
            hint={!emailValid ? "Неверный формат" : undefined}
            error={!emailValid}
          >
            <TextInput
              id="pf-email"
              value={p.email}
              onChange={(v) => setProfile("email", v)}
              type="email"
              placeholder="user@company.com"
              className={!emailValid ? "border-rose-400/40 focus:ring-rose-400/30" : ""}
              aria-invalid={!emailValid}
              aria-describedby={emailHintId}
            />
            {!emailValid && (
              <div id="pf-email-hint" className="mt-1 text-xs text-amber-300">
                Укажите корректный email
              </div>
            )}
          </Field>

          <Field
            label="Телефон"
            htmlFor="pf-phone"
            hint={!phoneValid ? "Укажите телефон полностью" : undefined}
            error={!phoneValid}
          >
            <TextInput
              id="pf-phone"
              value={p.phone}
              onChange={(v) => setProfile("phone", v)}
              placeholder="+7 (___) ___-__-__"
              className={!phoneValid ? "border-rose-400/40 focus:ring-rose-400/30" : ""}
              aria-invalid={!phoneValid}
              aria-describedby={phoneHintId}
            />
            {!phoneValid && (
              <div id="pf-phone-hint" className="mt-1 text-xs text-amber-300">
                Введите номер не короче 10 цифр
              </div>
            )}
          </Field>

          <Field label="Город" htmlFor="pf-city">
            <TextInput id="pf-city" value={p.city} onChange={(v) => setProfile("city", v)} placeholder="Москва" />
          </Field>

          <div>
            <Label htmlFor="pf-lang">Язык интерфейса</Label>
            <div className="mt-2">
              <Select
                id="pf-lang"
                value={p.lang}
                onChange={(v) => setProfile("lang", v as Profile["lang"])}
                options={[
                  { value: "ru", label: "Русский" },
                  { value: "en", label: "English" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={saveProfile}
            disabled={!emailValid || !phoneValid || !dirtyProfile}
            aria-disabled={!emailValid || !phoneValid || !dirtyProfile}
            className={`rounded-full px-5 py-2.5 font-semibold hover:shadow-white/20 hover:shadow-lg ${
              !emailValid || !phoneValid || !dirtyProfile
                ? "bg-white/40 text-black/60 cursor-not-allowed"
                : "bg-white text-black"
            }`}
          >
            Сохранить профиль
          </button>
          {(!emailValid || !phoneValid) && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-300">
              <CircleAlert className="h-4 w-4" /> Проверьте корректность полей
            </span>
          )}
          {/* live status */}
          <span aria-live="polite" role="status" className="text-sm">
            {savedProfile && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-white/85">
                <CheckCircle2 className="h-4 w-4" /> {savedProfile}
              </span>
            )}
          </span>
        </div>
      </Panel>

      {/* Безопасность */}
      <Panel title="Безопасность">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <SecurityCard
              title="Двухфакторная аутентификация"
              desc={prefs.twofa ? "2FA включена" : "2FA выключена — рекомендуем включить"}
              badge={prefs.twofa ? "Включена" : "Выключена"}
              positive={prefs.twofa}
              actions={
                <>
                  <button
                    onClick={() => setOpen2fa(true)}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    Настроить
                  </button>
                  <Toggle checked={prefs.twofa} onChange={(v) => setPref("twofa", v)} label={prefs.twofa ? "Вкл" : "Выкл"} />
                </>
              }
            />
            <SecurityCard
              title="Пароль"
              desc="Рекомендуем сложный пароль и менеджер паролей"
              badge="Рекомендация"
              positive
              actions={
                <button
                  onClick={() => setOpenPwd(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                >
                  <KeyRound className="h-4 w-4" /> Сменить пароль
                </button>
              }
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-white/85">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">Советы</span>
            </div>
            <ul className="mt-2 text-sm text-white/65 list-disc pl-5 space-y-1">
              <li>Включите 2FA и храните резервные коды отдельно</li>
              <li>Используйте разные пароли для разных сервисов</li>
              <li>Проверяйте активные сеансы и выходите с чужих устройств</li>
            </ul>
          </div>
        </div>
      </Panel>

      {/* Предпочтения */}
      <Panel
        title="Предпочтения"
        footer={
          <span className="inline-flex items-center gap-1 text-white/80" aria-live="polite" role="status">
            {savedPrefs ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> {savedPrefs}
              </>
            ) : (
              <span className="text-xs text-white/60">
                Демо-переключатели — сохраняются локально в вашем браузере.
              </span>
            )}
          </span>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <PrefCard
            icon={<Mail className="h-4 w-4" />}
            title="Новости по email"
            desc="Обновления продукта, релизы"
            checked={prefs.news}
            onChange={(v) => setPref("news", v)}
          />
          <PrefCard
            icon={<Bell className="h-4 w-4" />}
            title="Системные уведомления"
            desc="События аккаунта и биллинг"
            checked={prefs.alerts}
            onChange={(v) => setPref("alerts", v)}
          />
          <PrefCard
            icon={<ShieldCheck className="h-4 w-4" />}
            title="2FA напоминания"
            desc="Оповещения о входах и безопасности"
            checked={prefs.twofa}
            onChange={(v) => setPref("twofa", v)}
          />
        </div>

        <div className="mt-4">
          <button
            onClick={savePrefs}
            disabled={!dirtyPrefs}
            aria-disabled={!dirtyPrefs}
            className={`rounded-full border px-4 py-2 text-sm ${
              !dirtyPrefs ? "border-white/10 text-white/40 cursor-not-allowed" : "border-white/20 hover:bg-white/10"
            }`}
          >
            Сохранить настройки
          </button>
        </div>
      </Panel>

      {/* Активные сеансы (демо) */}
      <Panel title="Активные сеансы">
        <div className="mb-3">
          <button
            onClick={refreshSessions}
            disabled={sessionsLoading}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${sessionsLoading ? "animate-spin" : ""}`} />
            {sessionsLoading ? "Обновляем…" : "Обновить"}
          </button>
        </div>
        <div className="space-y-2 text-sm">
          {sessions.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                i === 1 ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/[0.03]"
              }`}
              title={i === 1 ? "Текущее устройство" : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.06]">
                  {s.icon}
                </span>
                <div>
                  <div className="font-medium">{s.dev}{i === 1 ? " • текущее" : ""}</div>
                  <div className="text-xs text-white/60">
                    {s.loc} · {s.last}
                  </div>
                </div>
              </div>
              <button className="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
                Завершить
              </button>
            </div>
          ))}
          <div className="text-xs text-white/60">В демо действия условные.</div>
        </div>
      </Panel>

      {/* Модалка смены пароля */}
      <Modal
        open={openPwd}
        onClose={() => setOpenPwd(false)}
        title="Смена пароля"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenPwd(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              onClick={changePassword}
              className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold"
            >
              Обновить
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pwd1">Новый пароль</Label>
            <div className="mt-2">
              <TextInput id="pwd1" value={pwd1} onChange={setPwd1} type="password" placeholder="••••••••" />
            </div>
            {/* strength */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden" aria-hidden>
              <div
                className={`h-full ${pwdStrength >= 3 ? "bg-emerald-400" : pwdStrength === 2 ? "bg-amber-300" : "bg-rose-400"}`}
                style={{ width: `${(pwdStrength / 4) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-white/60" aria-live="polite">
              Надёжность: {["оч. слабый", "слабый", "средний", "хороший", "отличный"][pwdStrength]}
            </div>
          </div>
          <div>
            <Label htmlFor="pwd2">Повтор пароля</Label>
            <div className="mt-2">
              <TextInput id="pwd2" value={pwd2} onChange={setPwd2} type="password" placeholder="••••••••" />
            </div>
          </div>
        </div>
        {pwdErr && <div className="mt-3 text-xs text-red-400">{pwdErr}</div>}
        <div className="mt-4 text-xs text-white/60">
          Пароль хранится хэшировано (демо: имитация). Рекомендуем менеджер паролей.
        </div>
      </Modal>

      {/* Модалка 2FA */}
      <Modal
        open={open2fa}
        onClose={() => setOpen2fa(false)}
        title="Двухфакторная аутентификация"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen2fa(false)} className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
              Закрыть
            </button>
          </div>
        }
      >
        <div className="space-y-2 text-sm">
          <div className="text-white/80">
            В продакшене здесь будет QR-код для приложения-аутентификатора и резервные коды.
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white/70">
            Демо-подсказка: включите 2FA в «Безопасности» или «Предпочтениях», чтобы видеть зелёный бейдж в статусе.
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* --------------------------------- helpers -------------------------------- */

function Field({
  label,
  children,
  hint,
  error,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: boolean;
  htmlFor?: string;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-2">{children}</div>
      {hint && (
        <div className={`mt-1 text-xs ${error ? "text-amber-300" : "text-white/60"}`}>
          {hint}
        </div>
      )}
    </div>
  );
}

function SecurityCard({
  title,
  desc,
  badge,
  positive,
  actions,
}: {
  title: string;
  desc: string;
  badge: string;
  positive?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-white/65">{desc}</div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${
            positive ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/15 bg-white/[0.06]"
          }`}
        >
          {badge}
        </span>
      </div>
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

function PrefCard({
  icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
            {icon}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-white/60">{desc}</div>
          </div>
        </div>
        <Toggle checked={checked} onChange={onChange} label={checked ? "Вкл" : "Выкл"} />
      </div>
    </div>
  );
}