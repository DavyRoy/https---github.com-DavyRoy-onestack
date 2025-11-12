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
  const [form, setForm] = React.useState<Role>({
    id: role.id,
    name: role.name ?? "",
    description: role.description ?? "",
  });

  // если родитель подменит роль — синхронизируемся
  React.useEffect(() => {
    setForm({
      id: role.id,
      name: role.name ?? "",
      description: role.description ?? "",
    });
  }, [role.id, role.name, role.description]);

  const canSave = form.name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (onSave) onSave(form);
    else alert("Сохранено (демо)");
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="text-sm text-white/70">Роль</div>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`rounded-lg px-3 py-2 text-sm transition
            ${canSave
              ? "bg-white/90 text-black hover:bg-white"
              : "bg-white/10 text-white/40 cursor-not-allowed"}`}
        >
          Сохранить
        </button>
      </div>

      {/* Form */}
      <form
        className="grid gap-3 md:grid-cols-2 min-w-0"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="min-w-0">
          <label className="block text-xs text-white/60 mb-1">Название роли</label>
          <input
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            placeholder="Напр., Manager"
            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs text-white/60 mb-1">Описание</label>
          <input
            value={form.description ?? ""}
            onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
            placeholder="Краткое описание"
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