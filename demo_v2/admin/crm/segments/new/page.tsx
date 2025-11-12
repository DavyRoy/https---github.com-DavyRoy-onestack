// app/demo/admin/crm/segments/new/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminSegmentNewPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("dynamic");
  const [desc, setDesc] = React.useState("");
  const [active, setActive] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) return "Введите название сегмента.";
    if (!type.trim()) return "Укажите тип сегмента.";
    return null;
  }

  function onSave() {
    const err = validate();
    if (err) return setError(err);

    const id = "seg_" + Math.random().toString(36).slice(2, 8);
    const newSegment = {
      id,
      name: name.trim(),
      type,
      description: desc.trim(),
      active,
      size: Math.floor(100 + Math.random() * 400),
      updatedAt: new Date().toISOString(),
    };

    try {
      const prev = JSON.parse(localStorage.getItem("demo.crm.segments") || "[]");
      localStorage.setItem("demo.crm.segments", JSON.stringify([newSegment, ...prev]));
      alert("Сегмент создан (демо)");
      router.push(`/demo/admin/crm/segments/${id}`);
    } catch {
      alert("Ошибка сохранения (демо)");
    }
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 md:px-5 md:py-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <div className="text-xs text-white/60">CRM • Сегменты</div>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
              Новый сегмент
            </h1>
            <p className="mt-1 text-sm text-white/70 max-w-[60ch]">
              Создайте новый сегмент клиентов с фильтрацией и описанием.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/demo/admin/crm/segments"
              className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
            >
              К списку сегментов
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
            placeholder="Напр. VIP-клиенты / Активные >90д"
            className="rounded-lg bg-transparent border border-white/20 px-3 py-2 text-sm"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-white/70">Тип *</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg bg-transparent border border-white/20 px-3 py-2 text-sm"
          >
            <option value="tag">Тег</option>
            <option value="static">Статический</option>
            <option value="dynamic">Динамический</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-white/70">Описание (необязательно)</span>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Краткое описание сегмента..."
            className="rounded-lg bg-transparent border border-white/20 px-3 py-2 text-sm min-h-[80px]"
          />
        </label>

        <label className="inline-flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          <span className="text-sm">Активен</span>
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
            href="/demo/admin/crm/segments"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/[0.06]"
          >
            Отмена
          </Link>
        </div>
      </section>
    </div>
  );
}