// app/demo/admin/crm/pipelines/new/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_CRM_PIPELINES } from "@/app/demo/(shared)/crm/data/pipelines.demo";

export default function AdminPipelineNewPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [target, setTarget] = React.useState("b2c");
  const [active, setActive] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) return "Введите название воронки.";
    if (!target.trim()) return "Укажите назначение.";
    return null;
  }

  function onSave() {
    const err = validate();
    if (err) return setError(err);

    const id = "p" + Math.random().toString(36).slice(2, 8);
    const newPipeline = {
      id,
      name: name.trim(),
      target: target.trim(),
      active,
      stages: [
        { id: "st1", name: "Новая заявка", probability: 10, color: "#4ade80" },
        { id: "st2", name: "В работе", probability: 50, color: "#facc15" },
        { id: "st3", name: "Успешно", probability: 100, color: "#22d3ee" },
      ],
    };

    try {
      const prev = JSON.parse(localStorage.getItem("demo.crm.pipelines") || "[]");
      localStorage.setItem("demo.crm.pipelines", JSON.stringify([newPipeline, ...prev]));
      alert("Воронка создана (демо)");
    } catch {
      alert("Ошибка сохранения (демо)");
    }

    router.push(`/demo/admin/crm/pipelines/${id}`);
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 md:px-5 md:py-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <div className="text-xs text-white/60">CRM • Воронки</div>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
              Новая воронка продаж
            </h1>
            <p className="mt-1 text-sm text-white/70 max-w-[60ch]">
              Создайте новую воронку продаж с назначением и начальными этапами.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/demo/admin/crm/pipelines"
              className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
            >
              К списку воронок
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 md:p-5 grid gap-4 max-w-screen-md">
        <label className="grid gap-1">
          <span className="text-sm text-white/70">Название *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Напр. B2B Продажи"
            className="rounded-lg bg-transparent border border-white/20 px-3 py-2 text-sm"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-white/70">Назначение *</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="rounded-lg bg-transparent border border-white/20 px-3 py-2 text-sm"
          >
            <option value="b2c">B2C (частные клиенты)</option>
            <option value="b2b">B2B (корпоративные клиенты)</option>
            <option value="partners">Партнёры / агенты</option>
            <option value="other">Другое</option>
          </select>
        </label>

        <label className="inline-flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          <span className="text-sm">Активна</span>
        </label>

        {error && (
          <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-end pt-2">
          <button
            onClick={onSave}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm hover:bg-emerald-500/30"
          >
            Сохранить
          </button>
          <Link
            href="/demo/admin/crm/pipelines"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/[0.06]"
          >
            Отмена
          </Link>
        </div>
      </section>
    </div>
  );
}