// src/app/demo/user/settings/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "../../ui/DemoCards";
import { Toggle, Label } from "../../ui/inputs";
import { CheckCircle2, Download, Upload, RotateCcw } from "lucide-react";

type Settings = {
  // Общие
  previewEnvs: boolean;   // предпросмотры (CI/CD)
  autoBackups: boolean;   // авто-бэкапы БД
  logsAndAlerts: boolean; // сбор логов и алертов
  darkByDefault: boolean; // тёмная тема по умолчанию

  // Каналы уведомлений
  emailOn: boolean;
  pushOn: boolean;
  digestOn: boolean;
};

const DEFAULTS: Settings = {
  previewEnvs: true,
  autoBackups: true,
  logsAndAlerts: true,
  darkByDefault: true,
  emailOn: true,
  pushOn: true,
  digestOn: false,
};

const LS_KEY = "__DEMO_USER_SETTINGS__";

export default function UserSettingsPage() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [saved, setSaved] = useState<string | null>(null);
  const toastT = useRef<number | null>(null);

  // загрузка из localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setS({ ...DEFAULTS, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // универсальный сейв + мини-уведомление
  const flash = (msg: string) => {
    setSaved(msg);
    if (toastT.current) window.clearTimeout(toastT.current);
    toastT.current = window.setTimeout(() => setSaved(null), 1400);
  };

  const persist = (next: Settings, msg = "Сохранено") => {
    setS(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    flash(msg);
  };

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    persist({ ...s, [k]: v });

  const reset = () => persist(DEFAULTS, "Сброшено к дефолту");

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        // мягкая валидация: берём только известные boolean-поля
        const next: Settings = {
          previewEnvs: typeof parsed.previewEnvs === "boolean" ? parsed.previewEnvs : DEFAULTS.previewEnvs,
          autoBackups: typeof parsed.autoBackups === "boolean" ? parsed.autoBackups : DEFAULTS.autoBackups,
          logsAndAlerts: typeof parsed.logsAndAlerts === "boolean" ? parsed.logsAndAlerts : DEFAULTS.logsAndAlerts,
          darkByDefault: typeof parsed.darkByDefault === "boolean" ? parsed.darkByDefault : DEFAULTS.darkByDefault,
          emailOn: typeof parsed.emailOn === "boolean" ? parsed.emailOn : DEFAULTS.emailOn,
          pushOn: typeof parsed.pushOn === "boolean" ? parsed.pushOn : DEFAULTS.pushOn,
          digestOn: typeof parsed.digestOn === "boolean" ? parsed.digestOn : DEFAULTS.digestOn,
        };
        persist(next, "Импортировано");
      } catch {
        flash("Ошибка импорта");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-3xl font-extrabold leading-tight">Настройки</div>
          <p className="mt-1 text-white/70">Локальные параметры демо-проекта и каналы уведомлений.</p>
        </div>

        {/* live region */}
        <div aria-live="polite" role="status">
          {saved && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-sm text-white/85">
              <CheckCircle2 className="h-4 w-4" />
              {saved}
            </div>
          )}
        </div>
      </div>

      {/* Общие */}
      <Panel
        title="Общие"
        footer={<span className="text-xs">Переключатели сохраняются в вашем браузере (localStorage).</span>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle
            checked={s.previewEnvs}
            onChange={(v) => set("previewEnvs", v)}
            label="Включить предпросмотры (CI/CD)"
          />
          <Toggle
            checked={s.autoBackups}
            onChange={(v) => set("autoBackups", v)}
            label="Авто-бэкапы БД"
          />
          <Toggle
            checked={s.logsAndAlerts}
            onChange={(v) => set("logsAndAlerts", v)}
            label="Логи и алерты"
          />
          <Toggle
            checked={s.darkByDefault}
            onChange={(v) => set("darkByDefault", v)}
            label="Тёмная тема по умолчанию"
          />
        </div>
      </Panel>

      {/* Каналы уведомлений */}
      <Panel title="Каналы уведомлений">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Email</Label>
            <div className="mt-2">
              <Toggle
                checked={s.emailOn}
                onChange={(v) => set("emailOn", v)}
                label={s.emailOn ? "Включено" : "Выключено"}
              />
            </div>
            <div className="mt-1 text-xs text-white/60">Заказы, безопасность, системные.</div>
          </div>

          <div>
            <Label>Push</Label>
            <div className="mt-2">
              <Toggle
                checked={s.pushOn}
                onChange={(v) => set("pushOn", v)}
                label={s.pushOn ? "Включено" : "Выключено"}
              />
            </div>
            <div className="mt-1 text-xs text-white/60">Быстрые события и алерты.</div>
          </div>

          <div>
            <Label>Дайджест</Label>
            <div className="mt-2">
              <Toggle
                checked={s.digestOn}
                onChange={(v) => set("digestOn", v)}
                label={s.digestOn ? "Ежедневно" : "Выкл"}
              />
            </div>
            <div className="mt-1 text-xs text-white/60">Сводка за сутки на email.</div>
          </div>
        </div>
      </Panel>

      {/* Экспорт / Импорт / Сброс */}
      <Panel title="Управление">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
            title="Сбросить к дефолту"
          >
            <RotateCcw className="h-4 w-4" />
            Сбросить
          </button>

          <button
            onClick={exportJson}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
            title="Экспорт JSON"
          >
            <Download className="h-4 w-4" />
            Экспорт
          </button>

          <label
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 cursor-pointer"
            title="Импорт JSON"
          >
            <Upload className="h-4 w-4" />
            Импорт
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importJson(f);
                e.currentTarget.value = "";
              }}
            />
          </label>

          <span className="text-xs text-white/55">Формат: <code className="font-mono">user-settings.json</code></span>
        </div>
      </Panel>

      {/* Подсказка по биллингу */}
      <Panel title="Оплата и биллинг">
        <div className="text-sm text-white/80">
          Интеграция с платёжной системой демонстрируется в калькуляторе и API-демо.
          Здесь — только пользовательские предпочтения показа.
        </div>
      </Panel>
    </div>
  );
}