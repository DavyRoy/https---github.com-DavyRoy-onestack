"use client";

import React from "react";
import AuditStrip from "./AuditStrip";
import DangerZone from "./DangerZone";

type Role = {
  id: string;
  name: string;
  description?: string;
};

export default function RoleEditor({
  role,
  onSave,
}: {
  role: Role;
  onSave?: (next: Role) => void;
}) {
  // локальная форма
  const [form, setForm] = React.useState<Role>({
    id: role.id,
    name: role.name ?? "",
    description: role.description ?? "",
  });

  // синхронизация при смене роли снаружи
  React.useEffect(() => {
    setForm({
      id: role.id,
      name: role.name ?? "",
      description: role.description ?? "",
    });
  }, [role.id, role.name, role.description]);

  // вычислимые состояния
  const trimmedName = form.name.trim();
  const canSaveName = trimmedName.length > 0;
  const isDirty =
    trimmedName !== (role.name ?? "").trim() ||
    (form.description ?? "") !== (role.description ?? "");

  const canSave = canSaveName && isDirty;

  // действия
  const handleSave = () => {
    if (!canSave) return;
    const payload: Role = {
      id: role.id,
      name: trimmedName,
      description: form.description?.trim() ?? "",
    };
    onSave ? onSave(payload) : alert("Сохранено (демо)");
  };

  const handleReset = () => {
    setForm({
      id: role.id,
      name: role.name ?? "",
      description: role.description ?? "",
    });
  };

  // хоткеи: ⌘/Ctrl+S — сохранить, Esc — откатить изменения
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl/Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      // Esc — сброс если есть изменения
      if (e.key === "Escape" && isDirty) {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDirty, canSave, trimmedName, form.description]); // зависимости безопасны, утечек нет

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="text-sm text-white/70">Роль</div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty}
            className={`rounded-lg px-3 py-2 text-sm border transition ${
              isDirty
                ? "border-white/20 text-white/80 hover:bg-white/10"
                : "border-white/10 text-white/40 cursor-not-allowed"
            }`}
            title={isDirty ? "Отменить несохранённые изменения (Esc)" : "Нет изменений"}
          >
            Отменить
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`rounded-lg px-3 py-2 text-sm transition ${
              canSave
                ? "bg-white/90 text-black hover:bg-white"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
            title={canSave ? "Сохранить (Ctrl/⌘+S)" : "Заполните корректно поля"}
          >
            Сохранить
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        className="grid gap-3 md:grid-cols-2 min-w-0"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        noValidate
      >
        <div className="min-w-0">
          <label htmlFor="role-name" className="block text-xs text-white/60 mb-1">
            Название роли <span className="text-rose-300">*</span>
          </label>
          <input
            id="role-name"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            placeholder="Напр., Manager"
            className={`w-full bg-transparent border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20 ${
              canSaveName ? "border-white/20" : "border-rose-400/40"
            }`}
            aria-invalid={!canSaveName}
            aria-describedby={!canSaveName ? "role-name-error" : undefined}
          />
          {!canSaveName && (
            <div id="role-name-error" className="mt-1 text-xs text-rose-300">
              Укажите название роли.
            </div>
          )}
        </div>

        <div className="min-w-0">
          <label htmlFor="role-desc" className="block text-xs text-white/60 mb-1">
            Описание
          </label>
          <input
            id="role-desc"
            value={form.description ?? ""}
            onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
            placeholder="Краткое описание (необязательно)"
            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </form>

      {/* Meta & Danger */}
      <AuditStrip className="mt-3" />
      <DangerZone className="mt-3" />
    </section>
  );
}