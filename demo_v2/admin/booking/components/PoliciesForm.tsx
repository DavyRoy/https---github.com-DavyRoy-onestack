"use client";

import * as React from "react";
import {
  loadPolicies,
  savePolicies,
  type AdminPolicy,
} from "@/app/demo/(shared)/booking";

type Value = Omit<AdminPolicy, "id" | "updatedAt"> & { id?: string };

/* ===================== helpers ===================== */

const DEFAULT_BY_TYPE: Record<AdminPolicy["type"], Record<string, any>> = {
  cancel: { freeUntilHours: 24, penaltyPercent: 0 },
  deposit: { percent: 20, refundable: true },
  leadtime: { minHoursBefore: 2, maxDaysAhead: 30 },
  buffer: { beforeMin: 10, afterMin: 10 },
  overbooking: { extraCapacity: 0, threshold: 80 },
};

function getDefaultsFor(type: AdminPolicy["type"]) {
  return { ...DEFAULT_BY_TYPE[type] };
}

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/** Приводим разный кейс ключей к camelCase, плюс значения по умолчанию */
function normalizeParams(type: AdminPolicy["type"], params: Record<string, any>) {
  const p = { ...(params ?? {}) };
  switch (type) {
    case "cancel": {
      const freeUntilHours = Number(
        p.freeUntilHours ?? p.free_until_h ?? p.free_until_hours ?? 24
      );
      const penaltyPercent = Number(p.penaltyPercent ?? p.fee_percent ?? 0);
      return { freeUntilHours, penaltyPercent };
    }
    case "deposit": {
      const percent = Number(p.percent ?? 20);
      const refundable =
        typeof p.refundable === "boolean"
          ? p.refundable
          : String(p.refundable ?? "true") === "true";
      return { percent, refundable };
    }
    case "leadtime": {
      const minHoursBefore = Number(p.minHoursBefore ?? p.min_hours ?? 2);
      const maxDaysAhead = Number(p.maxDaysAhead ?? p.max_days ?? 30);
      return { minHoursBefore, maxDaysAhead };
    }
    case "buffer": {
      const beforeMin = Number(p.beforeMin ?? p.before_min ?? 10);
      const afterMin = Number(p.afterMin ?? p.after_min ?? 10);
      return { beforeMin, afterMin };
    }
    case "overbooking": {
      const extraCapacity = Number(p.extraCapacity ?? p.extra_capacity ?? 0);
      const threshold = Number(p.threshold ?? 80);
      return { extraCapacity, threshold };
    }
  }
}

/** Валидация значений params по типу, возвращает map ошибок по полям */
function validateParams(type: AdminPolicy["type"], params: Record<string, any>) {
  const errors: Record<string, string> = {};
  switch (type) {
    case "cancel": {
      const { freeUntilHours, penaltyPercent } = params;
      if (!Number.isFinite(freeUntilHours) || freeUntilHours < 0) {
        errors.freeUntilHours = "Некорректное значение (≥ 0)";
      }
      if (!Number.isFinite(penaltyPercent) || penaltyPercent < 0 || penaltyPercent > 100) {
        errors.penaltyPercent = "Процент 0–100";
      }
      break;
    }
    case "deposit": {
      const { percent, refundable } = params;
      if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
        errors.percent = "Процент 0–100";
      }
      if (typeof refundable !== "boolean") {
        errors.refundable = "Выберите Да/Нет";
      }
      break;
    }
    case "leadtime": {
      const { minHoursBefore, maxDaysAhead } = params;
      if (!Number.isFinite(minHoursBefore) || minHoursBefore < 0) {
        errors.minHoursBefore = "Значение ≥ 0";
      }
      if (!Number.isFinite(maxDaysAhead) || maxDaysAhead < 0) {
        errors.maxDaysAhead = "Значение ≥ 0";
      }
      break;
    }
    case "buffer": {
      const { beforeMin, afterMin } = params;
      if (!Number.isFinite(beforeMin) || beforeMin < 0) {
        errors.beforeMin = "Значение ≥ 0";
      }
      if (!Number.isFinite(afterMin) || afterMin < 0) {
        errors.afterMin = "Значение ≥ 0";
      }
      break;
    }
    case "overbooking": {
      const { extraCapacity, threshold } = params;
      if (!Number.isFinite(extraCapacity) || extraCapacity < 0) {
        errors.extraCapacity = "Значение ≥ 0";
      }
      if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
        errors.threshold = "Процент 0–100";
      }
      break;
    }
  }
  return errors;
}

/* ===================== component ===================== */

export default function PoliciesForm({
  initial,
  onSaved,
}: {
  initial?: Value;
  onSaved: (id: string) => void;
}) {
  const [data, setData] = React.useState<Value>(() => {
    const base: Value =
      initial ?? {
        id: undefined,
        name: "",
        type: "cancel",
        params: getDefaultsFor("cancel"),
        level: "org",
        active: true,
      };
    return {
      ...base,
      params: normalizeParams(base.type, base.params ?? getDefaultsFor(base.type)),
    };
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [paramErrors, setParamErrors] = React.useState<Record<string, string>>({});
  const formRef = React.useRef<HTMLDivElement>(null);

  // если initial обновится снаружи — синхронизируем форму
  React.useEffect(() => {
    if (!initial) return;
    setData((prev) => {
      const next = {
        ...prev,
        ...initial,
        params: normalizeParams(initial.type, initial.params ?? getDefaultsFor(initial.type)),
      };
      return next;
    });
  }, [initial]);

  // Шорткаты: Ctrl/⌘ + Enter — сохранить
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function set<K extends keyof Value>(k: K, v: Value[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function validateMain(): boolean {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Укажите название";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateAll(): boolean {
    const okMain = validateMain();
    const pe = validateParams(data.type, data.params ?? {});
    setParamErrors(pe);
    return okMain && Object.keys(pe).length === 0;
  }

  function submit() {
    if (!validateAll()) {
      // прокрутка к форме ошибок
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const rows = loadPolicies();
    const id = data.id ?? `pol-${Date.now()}`;

    // финальная нормализация
    const normalizedParams = normalizeParams(data.type, data.params ?? getDefaultsFor(data.type));

    const payload: AdminPolicy = {
      id,
      name: data.name.trim(),
      type: data.type,
      params: normalizedParams,
      level: data.level,
      appliesTo: data.appliesTo, // если был передан — сохраняем
      active: Boolean(data.active),
      updatedAt: new Date().toISOString(),
    };

    const idx = rows.findIndex((r) => r.id === id);
    const next = idx >= 0 ? [...rows.slice(0, idx), payload, ...rows.slice(idx + 1)] : [...rows, payload];

    savePolicies(next);
    onSaved(id);
  }

  // При смене типа — подставляем дефолтные параметры для нового типа
  function handleTypeChange(nextType: AdminPolicy["type"]) {
    setData((d) => ({
      ...d,
      type: nextType,
      params: getDefaultsFor(nextType),
    }));
    setParamErrors({});
  }

  /* ---------- Параметры по типу ---------- */

  function ParamsFields() {
    switch (data.type) {
      case "cancel":
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <Num
              label="Бесплатная отмена до (часов)"
              value={(data.params as any)?.freeUntilHours ?? 24}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), freeUntilHours: Math.max(0, v) })
              }
              min={0}
              error={paramErrors.freeUntilHours}
            />
            <Num
              label="Штраф после (%)"
              value={(data.params as any)?.penaltyPercent ?? 0}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  penaltyPercent: Math.min(100, Math.max(0, v)),
                })
              }
              min={0}
              max={100}
              error={paramErrors.penaltyPercent}
            />
          </div>
        );

      case "deposit":
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <Num
              label="Процент предоплаты (%)"
              value={(data.params as any)?.percent ?? 20}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  percent: Math.min(100, Math.max(0, v)),
                })
              }
              min={0}
              max={100}
              error={paramErrors.percent}
            />
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Возвратная</span>
              <select
                value={String((data.params as any)?.refundable ?? true)}
                onChange={(e) =>
                  set("params", {
                    ...(data.params ?? {}),
                    refundable: e.target.value === "true",
                  })
                }
                className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
                aria-invalid={!!paramErrors.refundable}
              >
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
              {paramErrors.refundable && (
                <span className="text-rose-300 text-xs">{paramErrors.refundable}</span>
              )}
            </label>
          </div>
        );

      case "leadtime":
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <Num
              label="Минимум до начала (ч)"
              value={(data.params as any)?.minHoursBefore ?? 2}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), minHoursBefore: Math.max(0, v) })
              }
              min={0}
              error={paramErrors.minHoursBefore}
            />
            <Num
              label="Максимум вперёд (дн.)"
              value={(data.params as any)?.maxDaysAhead ?? 30}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), maxDaysAhead: Math.max(0, v) })
              }
              min={0}
              error={paramErrors.maxDaysAhead}
            />
          </div>
        );

      case "buffer":
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <Num
              label="Буфер ДО (мин)"
              value={(data.params as any)?.beforeMin ?? 10}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), beforeMin: Math.max(0, v) })
              }
              min={0}
              error={paramErrors.beforeMin}
            />
            <Num
              label="Буфер ПОСЛЕ (мин)"
              value={(data.params as any)?.afterMin ?? 10}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), afterMin: Math.max(0, v) })
              }
              min={0}
              error={paramErrors.afterMin}
            />
          </div>
        );

      case "overbooking":
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <Num
              label="Допуск параллельности (мест)"
              value={(data.params as any)?.extraCapacity ?? 0}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), extraCapacity: Math.max(0, v) })
              }
              min={0}
              error={paramErrors.extraCapacity}
            />
            <Num
              label="Порог срабатывания (%)"
              value={(data.params as any)?.threshold ?? 80}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  threshold: Math.min(100, Math.max(0, v)),
                })
              }
              min={0}
              max={100}
              error={paramErrors.threshold}
            />
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div ref={formRef} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        <span className="text-white/70">Название</span>
        <input
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          className={cls(
            "rounded-lg bg-transparent border px-2 py-2",
            errors.name ? "border-rose-400/60" : "border-white/15"
          )}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "policy-name-err" : undefined}
        />
        {errors.name && (
          <span id="policy-name-err" className="text-rose-300 text-xs">
            {errors.name}
          </span>
        )}
      </label>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Тип</span>
          <select
            value={data.type}
            onChange={(e) => handleTypeChange(e.target.value as AdminPolicy["type"])}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          >
            <option value="cancel">Отмена</option>
            <option value="deposit">Предоплата</option>
            <option value="leadtime">Lead-time</option>
            <option value="buffer">Буферы</option>
            <option value="overbooking">Овербукинг</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Уровень применения</span>
          <select
            value={data.level}
            onChange={(e) => set("level", e.target.value as AdminPolicy["level"])}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          >
            <option value="org">Организация</option>
            <option value="location">Локация</option>
            <option value="category">Категория услуги</option>
            <option value="service">Услуга</option>
            <option value="resource">Ресурс</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Активна</span>
          <select
            value={String(data.active)}
            onChange={(e) => set("active", e.target.value === "true")}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </label>
      </div>

      <div className="mt-2">
        <div className="text-sm font-medium mb-1">Параметры</div>
        <ParamsFields />
        {Object.keys(paramErrors).length > 0 && (
          <div className="mt-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-2 text-xs text-rose-200">
            Проверьте значения параметров — некоторые поля заполнены некорректно.
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={submit}
          className="rounded-xl px-3 py-2 border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30"
          title="Сохранить (Ctrl/⌘ + Enter)"
        >
          Сохранить
        </button>
        <button
          onClick={() => history.back()}
          className="rounded-xl px-3 py-2 border border-white/15 hover:bg-white/[0.06]"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

/* ===================== Numeric input ===================== */

function Num({
  label,
  value,
  onChange,
  min,
  max,
  error,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  error?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isNaN(n)) onChange(0);
          else onChange(n);
        }}
        min={min}
        max={max}
        className={cls(
          "rounded-lg bg-transparent border px-2 py-2",
          error ? "border-rose-400/60" : "border-white/15"
        )}
        aria-invalid={!!error}
      />
      {error && <span className="text-rose-300 text-xs">{error}</span>}
    </label>
  );
}