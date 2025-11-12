// src/app/demo/admin/settings/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Upload, Download, RotateCcw, Wand2, ShieldCheck, Cpu } from "lucide-react";

/* ---------------------------- типы и константы ---------------------------- */

type Settings = {
  previewEnvs: boolean;
  autoBackups: boolean;
  logsAndAlerts: boolean;
  darkByDefault: boolean;
  billingSandbox: boolean;
  invoicesByEmail: boolean;
};

const DEFAULTS: Settings = {
  previewEnvs: true,
  autoBackups: true,
  logsAndAlerts: true,
  darkByDefault: true,
  billingSandbox: true,
  invoicesByEmail: false,
};

const LS_KEY = "__DEMO_SETTINGS__";

/* -------------------------------- helpers -------------------------------- */

type Classish = string | false | null | undefined;
const cls = (...a: Classish[]) => a.filter(Boolean).join(" ");

function useSavedToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const flash = (m: string) => {
    setMsg(m);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 1400) as unknown as number;
  };
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);
  return { msg, flash };
}

/* ---------------------------------- UI ----------------------------------- */

function Panel({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-white/55">{subtitle}</div>}
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      {footer ? (
        <div className="px-4 sm:px-5 py-3 border-t border-white/10 text-xs text-white/70">{footer}</div>
      ) : null}
    </section>
  );
}

function Toolbar({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>{children}</div>
      <div className="flex flex-wrap items-center gap-2">{right}</div>
    </div>
  );
}

function ActionBtn(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode },
) {
  const { icon, className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={cls(
        "inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10",
        className,
      )}
    >
      {icon}
      {rest.children}
    </button>
  );
}

function Segmented({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { label: string; value: string; icon?: React.ReactNode }[];
  ariaLabel?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur"
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cls(
              "px-3.5 py-1.5 text-xs rounded-full transition whitespace-nowrap inline-flex items-center gap-1.5",
              active
                ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.18)]"
                : "text-white/85 hover:bg-white/[0.08]",
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-white/60 mt-0.5">{hint}</div>}
      </div>

      {/* тумблер — аккуратный и читабельный */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cls(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition",
          checked ? "bg-emerald-400/25 border-emerald-400/40" : "bg-white/[0.06] border-white/20",
        )}
        aria-label={label}
        title={checked ? "Включено" : "Выключено"}
      >
        <span
          aria-hidden="true"
          className={cls(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

/* --------------------------------- страница -------------------------------- */

export default function AdminSettingsPage() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [preset, setPreset] = useState<"custom" | "demo" | "prod" | "minimal">("custom");
  const importRef = useRef<HTMLInputElement | null>(null);
  const { msg, flash } = useSavedToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // вычисляем пресет из текущих значений (для индикации)
  useEffect(() => {
    const isDemo =
      s.previewEnvs &&
      s.autoBackups &&
      s.logsAndAlerts &&
      s.darkByDefault &&
      s.billingSandbox &&
      !s.invoicesByEmail;
    const isProd =
      s.previewEnvs &&
      s.autoBackups &&
      s.logsAndAlerts &&
      s.darkByDefault &&
      !s.billingSandbox &&
      s.invoicesByEmail;
    const isMinimal =
      !s.previewEnvs &&
      !s.autoBackups &&
      !s.logsAndAlerts &&
      s.darkByDefault &&
      s.billingSandbox &&
      !s.invoicesByEmail;

    setPreset(isDemo ? "demo" : isProd ? "prod" : isMinimal ? "minimal" : "custom");
  }, [s]);

  const saveAll = (next: Settings, toast = "Сохранено") => {
    setS(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
    flash(toast);
  };
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => saveAll({ ...s, [k]: v });

  const applyPreset = (kind: "demo" | "prod" | "minimal") => {
    if (kind === "demo")
      return saveAll(
        {
          previewEnvs: true,
          autoBackups: true,
          logsAndAlerts: true,
          darkByDefault: true,
          billingSandbox: true,
          invoicesByEmail: false,
        },
        "Пресет: Демо",
      );
    if (kind === "prod")
      return saveAll(
        {
          previewEnvs: true,
          autoBackups: true,
          logsAndAlerts: true,
          darkByDefault: true,
          billingSandbox: false,
          invoicesByEmail: true,
        },
        "Пресет: Прод",
      );
    return saveAll(
      {
        previewEnvs: false,
        autoBackups: false,
        logsAndAlerts: false,
        darkByDefault: true,
        billingSandbox: true,
        invoicesByEmail: false,
      },
      "Пресет: Минимум",
    );
  };

  const reset = () => {
    if (confirm("Сбросить настройки к дефолту?")) {
      saveAll(DEFAULTS, "Сброшено к дефолту");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "demo-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("Экспортировано");
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        const next: Settings = {
          previewEnvs: typeof parsed.previewEnvs === "boolean" ? parsed.previewEnvs : DEFAULTS.previewEnvs,
          autoBackups: typeof parsed.autoBackups === "boolean" ? parsed.autoBackups : DEFAULTS.autoBackups,
          logsAndAlerts: typeof parsed.logsAndAlerts === "boolean" ? parsed.logsAndAlerts : DEFAULTS.logsAndAlerts,
          darkByDefault: typeof parsed.darkByDefault === "boolean" ? parsed.darkByDefault : DEFAULTS.darkByDefault,
          billingSandbox: typeof parsed.billingSandbox === "boolean" ? parsed.billingSandbox : DEFAULTS.billingSandbox,
          invoicesByEmail:
            typeof parsed.invoicesByEmail === "boolean" ? parsed.invoicesByEmail : DEFAULTS.invoicesByEmail,
        };
        saveAll(next, "Импортировано");
      } catch {
        flash("Ошибка импорта");
      }
    };
    reader.readAsText(file);
  };

  const totalEnabled = useMemo(
    () =>
      Number(s.previewEnvs) +
      Number(s.autoBackups) +
      Number(s.logsAndAlerts) +
      Number(s.darkByDefault) +
      Number(s.billingSandbox) +
      Number(s.invoicesByEmail),
    [s],
  );

  return (
    <div className="space-y-8">
      {/* Toast */}
      {msg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/80 px-3 py-2 text-sm text-white/90 shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4" />
          {msg}
        </div>
      )}

      {/* Шапка */}
      <Toolbar
        right={
          <>
            <Segmented
              ariaLabel="Пресеты настроек"
              value={preset}
              onChange={(v) => {
                if (v === "demo" || v === "prod" || v === "minimal") applyPreset(v);
              }}
              options={[
                { label: "Демо", value: "demo", icon: <Wand2 className="h-3.5 w-3.5" /> },
                { label: "Прод", value: "prod", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                { label: "Минимум", value: "minimal", icon: <Cpu className="h-3.5 w-3.5" /> },
              ]}
            />

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Сбросить к дефолту"
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить
            </button>
            <button
              onClick={exportJson}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Экспорт JSON"
            >
              <Download className="h-4 w-4" />
              Экспорт
            </button>
            <button
              onClick={() => importRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Импорт JSON"
            >
              <Upload className="h-4 w-4" />
              Импорт
            </button>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importJson(f);
                if (importRef.current) importRef.current.value = "";
              }}
            />
          </>
        }
      >
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">Настройки</h1>
          <p className="mt-1 text-white/70">
            Базовые параметры демо-проекта. Включено опций: <span className="tabular-nums">{totalEnabled}</span>/6.
          </p>
        </div>
      </Toolbar>

      {/* Общие */}
      <Panel title="Общие" subtitle="Переключатели сохраняются в браузере (localStorage)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Toggle
            label="Включить предпросмотры (CI/CD)"
            hint="Ветки → превью-окружения для QA"
            checked={s.previewEnvs}
            onChange={(v) => set("previewEnvs", v)}
          />
          <Toggle
            label="Авто-бэкапы БД"
            hint="Ночные инкрементальные бэкапы"
            checked={s.autoBackups}
            onChange={(v) => set("autoBackups", v)}
          />
          <Toggle
            label="Логи и алерты"
            hint="Сбор логов, алерты в Slack/Email"
            checked={s.logsAndAlerts}
            onChange={(v) => set("logsAndAlerts", v)}
          />
          <Toggle
            label="Тёмная тема по умолчанию"
            hint="Применяется для новых пользователей"
            checked={s.darkByDefault}
            onChange={(v) => set("darkByDefault", v)}
          />
        </div>
      </Panel>

      {/* Оплата и биллинг */}
      <Panel title="Оплата и биллинг" subtitle="Кейсы показаны в калькуляторе и API-демо">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Toggle
            label="Платёжная «песочница»"
            hint="Не списывает реальные средства"
            checked={s.billingSandbox}
            onChange={(v) => set("billingSandbox", v)}
          />
          <Toggle
            label="Высылать счета на email"
            hint="PDF-счёт по завершении расчёта"
            checked={s.invoicesByEmail}
            onChange={(v) => set("invoicesByEmail", v)}
          />
        </div>
      </Panel>
    </div>
  );
}