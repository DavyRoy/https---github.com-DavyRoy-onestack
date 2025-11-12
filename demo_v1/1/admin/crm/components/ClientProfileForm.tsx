"use client";

import * as React from "react";

export type ClientProfile = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
};

type Props = {
  initial?: ClientProfile;
  onSubmit?: (data: ClientProfile) => void;
};

export default function ClientProfileForm({ initial, onSubmit }: Props) {
  const [form, setForm] = React.useState<ClientProfile>(
    initial ?? { name: "", email: "", phone: "", company: "" }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function set<K extends keyof ClientProfile>(k: K, v: ClientProfile[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Укажите имя / компанию";
    if (form.email && !/.+@.+\..+/.test(form.email)) e.email = "Некорректный e-mail";
    if (form.phone && !/^[\d+()\-\s]{6,}$/.test(form.phone)) e.phone = "Некорректный телефон";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
    if (!onSubmit) alert("Сохранено (демо)");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/15 bg-white/[0.02] p-4 grid gap-3"
    >
      <label className="grid gap-1 text-sm">
        <span className="text-white/70">Имя / Компания *</span>
        <input
          className="bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="Иван Иванов / ООО «Ромашка»"
          value={form.name ?? ""}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="text-xs text-rose-300">{errors.name}</span>}
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">E-mail</span>
          <input
            type="email"
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="client@example.com"
            value={form.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="text-xs text-rose-300">{errors.email}</span>}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Телефон</span>
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="+7 900 000-00-00"
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <span className="text-xs text-rose-300">{errors.phone}</span>}
        </label>
      </div>

      <label className="grid gap-1 text-sm">
        <span className="text-white/70">Компания</span>
        <input
          className="bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="ООО «Ромашка»"
          value={form.company ?? ""}
          onChange={(e) => set("company", e.target.value)}
        />
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="px-3 py-2 rounded border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={() => setForm(initial ?? { name: "", email: "", phone: "", company: "" })}
          className="px-3 py-2 rounded border border-white/20 hover:bg-white/10"
        >
          Сбросить
        </button>
      </div>
    </form>
  );
}