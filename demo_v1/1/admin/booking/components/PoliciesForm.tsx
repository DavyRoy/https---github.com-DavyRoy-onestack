"use client";

import * as React from "react";
import {
  loadPolicies,
  savePolicies,
  type AdminPolicy,
} from "@/app/demo/(shared)/booking";

type Value = Omit<AdminPolicy, "id" | "updatedAt"> & { id?: string };

export default function PoliciesForm({
  initial,
  onSaved,
}: {
  initial?: Value;
  onSaved: (id: string) => void;
}) {
  const [data, setData] = React.useState<Value>(
    initial ?? {
      id: undefined,
      name: "",
      type: "cancel",
      params: {},
      level: "org",
      active: true,
    }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function set<K extends keyof Value>(k: K, v: Value[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Укажите название";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;

    const rows = loadPolicies();
    const id = data.id ?? `pol-${Date.now()}`;

    // Нормализуем params по типам (camelCase под общий контракт)
    const p = { ...(data.params ?? {}) } as Record<string, any>;
    switch (data.type) {
      case "cancel": {
        const freeUntilHours =
          p.freeUntilHours ?? p.free_until_h ?? 24;
        const penaltyPercent =
          p.penaltyPercent ?? p.fee_percent ?? 0;
        data.params = { freeUntilHours, penaltyPercent };
        break;
      }
      case "deposit": {
        const percent = p.percent ?? 20;
        const refundable =
          typeof p.refundable === "boolean"
            ? p.refundable
            : String(p.refundable ?? "true") === "true";
        data.params = { percent, refundable };
        break;
      }
      case "leadtime": {
        const minHoursBefore = p.minHoursBefore ?? p.min_hours ?? 2;
        const maxDaysAhead = p.maxDaysAhead ?? p.max_days ?? 30;
        data.params = { minHoursBefore, maxDaysAhead };
        break;
      }
      case "buffer": {
        const beforeMin = p.beforeMin ?? p.before_min ?? 10;
        const afterMin = p.afterMin ?? p.after_min ?? 10;
        data.params = { beforeMin, afterMin };
        break;
      }
      case "overbooking": {
        const extraCapacity = p.extraCapacity ?? p.extra_capacity ?? 0;
        const threshold = p.threshold ?? 80;
        data.params = { extraCapacity, threshold };
        break;
      }
    }

    const payload: AdminPolicy = {
      id,
      name: data.name.trim(),
      type: data.type,
      params: data.params ?? {},
      level: data.level,
      appliesTo: data.appliesTo, // если был передан в initial — сохраняем
      active: Boolean(data.active),
      updatedAt: new Date().toISOString(),
    };

    const idx = rows.findIndex((r) => r.id === id);
    const next =
      idx >= 0
        ? [...rows.slice(0, idx), payload, ...rows.slice(idx + 1)]
        : [...rows, payload];

    savePolicies(next);
    onSaved(id);
  }

  /* ---------- Поля params по типу ---------- */
  function ParamsFields() {
    switch (data.type) {
      case "cancel":
        return (
          <div className="grid md:grid-cols-2 gap-3">
            <Num
              label="Бесплатная отмена до (часов)"
              value={(data.params as any).freeUntilHours ?? 24}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  freeUntilHours: v,
                })
              }
              min={0}
            />
            <Num
              label="Штраф после (%)"
              value={(data.params as any).penaltyPercent ?? 0}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  penaltyPercent: v,
                })
              }
              min={0}
              max={100}
            />
          </div>
        );
      case "deposit":
        return (
          <div className="grid md:grid-cols-2 gap-3">
            <Num
              label="Процент предоплаты"
              value={(data.params as any).percent ?? 20}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), percent: v })
              }
              min={0}
              max={100}
            />
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Возвратная</span>
              <select
                value={String((data.params as any).refundable ?? true)}
                onChange={(e) =>
                  set("params", {
                    ...(data.params ?? {}),
                    refundable: e.target.value === "true",
                  })
                }
                className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              >
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            </label>
          </div>
        );
      case "leadtime":
        return (
          <div className="grid md:grid-cols-2 gap-3">
            <Num
              label="Минимум до начала (ч)"
              value={(data.params as any).minHoursBefore ?? 2}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  minHoursBefore: v,
                })
              }
              min={0}
            />
            <Num
              label="Максимум вперёд (дн.)"
              value={(data.params as any).maxDaysAhead ?? 30}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  maxDaysAhead: v,
                })
              }
              min={0}
            />
          </div>
        );
      case "buffer":
        return (
          <div className="grid md:grid-cols-2 gap-3">
            <Num
              label="Буфер ДО (мин)"
              value={(data.params as any).beforeMin ?? 10}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), beforeMin: v })
              }
              min={0}
            />
            <Num
              label="Буфер ПОСЛЕ (мин)"
              value={(data.params as any).afterMin ?? 10}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), afterMin: v })
              }
              min={0}
            />
          </div>
        );
      case "overbooking":
        return (
          <div className="grid md:grid-cols-2 gap-3">
            <Num
              label="Допуск параллельности (мест)"
              value={(data.params as any).extraCapacity ?? 0}
              onChange={(v) =>
                set("params", {
                  ...(data.params ?? {}),
                  extraCapacity: v,
                })
              }
              min={0}
            />
            <Num
              label="Порог срабатывания (%)"
              value={(data.params as any).threshold ?? 80}
              onChange={(v) =>
                set("params", { ...(data.params ?? {}), threshold: v })
              }
              min={0}
              max={100}
            />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="grid gap-3">
      <label className="grid gap-1 text-sm">
        <span className="text-white/70">Название</span>
        <input
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
        />
        {errors.name && (
          <span className="text-red-300 text-xs">{errors.name}</span>
        )}
      </label>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Тип</span>
          <select
            value={data.type}
            onChange={(e) => set("type", e.target.value as AdminPolicy["type"])}
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
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={submit}
          className="rounded-xl px-3 py-2 border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30"
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

/* ---------- Вспомогательный числовой инпут ---------- */

function Num({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
      />
    </label>
  );
}