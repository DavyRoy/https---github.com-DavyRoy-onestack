"use client";

import * as React from "react";
import { ADMIN_CRM_PIPELINES } from "../data/mockAdminCrmPipelines";
import { Plus, Trash2, ArrowLeft, ArrowRight, Save } from "lucide-react";

type Stage = {
  id: string;
  name: string;
  probability?: number; // 0..100
  slaHours?: number;    // >=0
  color?: string;       // hex
};

type Pipeline = {
  id: string;
  name: string;
  target?: string;
  stages: Stage[];
};

function makeId(prefix = "stg") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
}

export default function PipelineEditor({ id }: { id: string }) {
  const original = ADMIN_CRM_PIPELINES.find((x) => x.id === id) as Pipeline | undefined;
  const [data, setData] = React.useState<Pipeline | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Инициализация локального состояния
  React.useEffect(() => {
    if (!original) {
      setData(null);
      return;
    }
    // глубокая копия для редактирования
    setData(JSON.parse(JSON.stringify(original)));
  }, [id, original]);

  if (!original || !data) {
    return (
      <div className="rounded-2xl border border-white/15 p-4 bg-white/[0.03] text-white/70">
        Воронка не найдена
      </div>
    );
  }

  function set<K extends keyof Pipeline>(k: K, v: Pipeline[K]) {
    setData((d) => (d ? { ...d, [k]: v } : d));
  }

  function setStage(idx: number, patch: Partial<Stage>) {
    setData((d) => {
      if (!d) return d;
      const next = [...d.stages];
      next[idx] = { ...next[idx], ...patch };
      return { ...d, stages: next };
    });
  }

  function moveStage(idx: number, dir: -1 | 1) {
    setData((d) => {
      if (!d) return d;
      const j = idx + dir;
      if (j < 0 || j >= d.stages.length) return d;
      const next = [...d.stages];
      const [row] = next.splice(idx, 1);
      next.splice(j, 0, row);
      return { ...d, stages: next };
    });
  }

  function removeStage(idx: number) {
    setData((d) => {
      if (!d) return d;
      const next = d.stages.filter((_, i) => i !== idx);
      return { ...d, stages: next };
    });
  }

  function addStage() {
    setData((d) => {
      if (!d) return d;
      const colorPalette = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#a78bfa", "#f87171"];
      const next: Stage = {
        id: makeId(),
        name: `Этап ${d.stages.length + 1}`,
        probability: Math.max(0, Math.min(100, (d.stages.length ? (d.stages[d.stages.length - 1].probability ?? 50) : 10) + 10)),
        slaHours: 24,
        color: colorPalette[d.stages.length % colorPalette.length],
      };
      return { ...d, stages: [...d.stages, next] };
    });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Укажите название воронки";
    if (!data.stages.length) e.stages = "Добавьте хотя бы один этап";

    data.stages.forEach((s, i) => {
      if (!s.name?.trim()) e[`stage-${i}-name`] = "Название этапа обязательно";
      if (s.probability !== undefined) {
        if (!Number.isFinite(s.probability) || s.probability < 0 || s.probability > 100) {
          e[`stage-${i}-probability`] = "0–100%";
        }
      }
      if (s.slaHours !== undefined) {
        if (!Number.isFinite(s.slaHours) || s.slaHours < 0) {
          e[`stage-${i}-sla`] = "SLA должен быть ≥ 0 ч";
        }
      }
      if (s.color && !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.color)) {
        e[`stage-${i}-color`] = "Неверный HEX";
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSave() {
    if (!validate()) return;
    // Здесь могла бы быть интеграция с API.
    // В демо просто показываем alert с короткой сводкой.
    const summary = `Сохранено:
— Воронка: ${data.name}${data.target ? ` · ${data.target}` : ""}
— Этапов: ${data.stages.length}`;
    alert(summary);
  }

  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03] grid gap-4">
      {/* Заголовок и мета */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="text-sm text-white/70">
            Воронка: <span className="text-white font-medium">{original.name}</span>
            {original.target ? <span className="opacity-80"> · {original.target}</span> : null}
          </div>
          <div className="text-xs text-white/50">
            Редактирование копии (демо): сохранение не персистится в источник.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30"
            title="Сохранить"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>
      </div>

      {/* Форма настроек воронки */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Название *</span>
          <input
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            className="rounded-lg bg-transparent border border-white/15 px-3 py-2"
            placeholder="Напр. Входящие лиды"
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="text-xs text-rose-300">{errors.name}</span>}
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Цель / Target (опц.)</span>
          <input
            value={data.target ?? ""}
            onChange={(e) => set("target", e.target.value)}
            className="rounded-lg bg-transparent border border-white/15 px-3 py-2"
            placeholder="Напр. Счёт / Договор / Оплата"
          />
        </label>
      </div>

      {/* Этапы */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">Этапы</div>
        <button
          type="button"
          onClick={addStage}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/[0.06] text-sm"
          title="Добавить этап"
        >
          <Plus className="w-4 h-4" />
          Добавить этап
        </button>
      </div>

      {errors.stages && (
        <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {errors.stages}
        </div>
      )}

      <div className="flex flex-wrap items-start gap-2">
        {data.stages.map((s, idx) => {
          const hasNameErr = !!errors[`stage-${idx}-name`];
          const hasProbErr = !!errors[`stage-${idx}-probability`];
          const hasSlaErr = !!errors[`stage-${idx}-sla`];
          const hasColorErr = !!errors[`stage-${idx}-color`];

          return (
            <div
              key={s.id}
              className="w-full sm:w-auto max-w-full sm:max-w-[320px] rounded-xl border border-white/15 p-3 bg-white/[0.02]"
              style={{ background: s.color ? `${s.color}1a` : undefined }}
              title={s.slaHours ? `SLA: ${s.slaHours} ч` : undefined}
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  value={s.name}
                  onChange={(e) => setStage(idx, { name: e.target.value })}
                  className="w-full rounded bg-transparent border border-white/15 px-2 py-1 text-sm"
                  placeholder={`Этап ${idx + 1}`}
                  aria-invalid={hasNameErr}
                />
                <div className="shrink-0 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveStage(idx, -1)}
                    className="rounded border border-white/15 p-1 hover:bg-white/[0.06]"
                    aria-label="Влево"
                    title="Сдвинуть влево"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStage(idx, +1)}
                    className="rounded border border-white/15 p-1 hover:bg-white/[0.06]"
                    aria-label="Вправо"
                    title="Сдвинуть вправо"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStage(idx)}
                    className="rounded border border-rose-400/40 p-1 hover:bg-rose-500/10"
                    aria-label="Удалить этап"
                    title="Удалить этап"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Подполя */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <label className="grid gap-1 text-[11px]">
                  <span className="text-white/60">Вероятн., %</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={s.probability ?? ""}
                    onChange={(e) =>
                      setStage(idx, { probability: e.target.value === "" ? undefined : Math.max(0, Math.min(100, Number(e.target.value))) })
                    }
                    className="rounded bg-transparent border border-white/15 px-2 py-1 text-sm"
                    aria-invalid={hasProbErr}
                  />
                </label>
                <label className="grid gap-1 text-[11px]">
                  <span className="text-white/60">SLA, ч</span>
                  <input
                    type="number"
                    min={0}
                    value={s.slaHours ?? ""}
                    onChange={(e) =>
                      setStage(idx, { slaHours: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)) })
                    }
                    className="rounded bg-transparent border border-white/15 px-2 py-1 text-sm"
                    aria-invalid={hasSlaErr}
                  />
                </label>
                <label className="grid gap-1 text-[11px]">
                  <span className="text-white/60">Цвет</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={s.color ?? "#9ca3af"}
                      onChange={(e) => setStage(idx, { color: e.target.value })}
                      className="h-8 w-10 rounded bg-transparent border border-white/15 p-0"
                      aria-invalid={hasColorErr}
                      title={s.color}
                    />
                    <input
                      value={s.color ?? ""}
                      onChange={(e) => setStage(idx, { color: e.target.value })}
                      placeholder="#60a5fa"
                      className="flex-1 rounded bg-transparent border border-white/15 px-2 py-1 text-sm"
                    />
                  </div>
                </label>
              </div>

              {/* Ошибки для этапа */}
              <div className="mt-1 space-y-1">
                {hasNameErr && <div className="text-[11px] text-rose-300">{errors[`stage-${idx}-name`]}</div>}
                {hasProbErr && <div className="text-[11px] text-rose-300">{errors[`stage-${idx}-probability`]}</div>}
                {hasSlaErr && <div className="text-[11px] text-rose-300">{errors[`stage-${idx}-sla`]}</div>}
                {hasColorErr && <div className="text-[11px] text-rose-300">{errors[`stage-${idx}-color`]}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Нижние кнопки */}
      <div className="pt-1">
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 px-3 py-2 rounded border border-white/20 hover:bg-white/10"
        >
          <Save className="w-4 h-4" />
          Сохранить
        </button>
      </div>
    </section>
  );
}