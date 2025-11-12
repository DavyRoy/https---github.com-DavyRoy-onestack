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
  onCancel?: () => void;
  className?: string;
  submitLabel?: string;
  resetLabel?: string;
  showCompany?: boolean; // можно скрыть поле компании при необходимости
};

const EMPTY: ClientProfile = { name: "", email: "", phone: "", company: "" };

export default function ClientProfileForm({
  initial,
  onSubmit,
  onCancel,
  className = "",
  submitLabel = "Сохранить",
  resetLabel = "Сбросить",
  showCompany = true,
}: Props) {
  const [form, setForm] = React.useState<ClientProfile>(normalize(initial) ?? EMPTY);
  const [errors, setErrors] = React.useState<Record<keyof ClientProfile | string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    // если initial меняется — мягко подменяем форму
    setForm(normalize(initial) ?? EMPTY);
    setErrors({});
    setTouched({});
  }, [initial]);

  function set<K extends keyof ClientProfile>(k: K, v: ClientProfile[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function markTouched(name: string) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function validate(data: ClientProfile = form): boolean {
    const e: Record<string, string> = {};

    if (!data.name?.trim()) e.name = "Укажите имя / компанию";

    // Простая, но устойчиво-практичная проверка email
    if (data.email) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
      if (!emailOk) e.email = "Некорректный e-mail";
    }

    // Допускаем +, пробелы, скобки, дефисы; не короче 6 символов
    if (data.phone) {
      const phoneOk = /^[\d+()\-\s]{6,}$/.test(data.phone.trim());
      if (!phoneOk) e.phone = "Некорректный телефон";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // Тримминг перед валидацией/сабмитом
    const payload: ClientProfile = {
      name: form.name?.trim() || "",
      email: form.email?.trim() || "",
      phone: form.phone?.trim() || "",
      company: form.company?.trim() || "",
    };

    if (!validate(payload)) {
      // отмечаем все поля как touched, чтобы подсветить ошибки
      setTouched({ name: true, email: !!payload.email, phone: !!payload.phone, company: !!payload.company });
      return;
    }

    setSubmitting(true);
    try {
      onSubmit?.(payload);
      if (!onSubmit) alert("Сохранено (демо)");
    } finally {
      // небольшая задержка не нужна — сразу снимаем флаг
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm(normalize(initial) ?? EMPTY);
    setErrors({});
    setTouched({});
  }

  const hasAnyError = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-2xl border border-white/15 bg-white/[0.02] p-4 grid gap-3 ${className}`}
      aria-describedby={hasAnyError ? "client-form-error" : undefined}
    >
      {/* Имя / Компания */}
      <FormField
        label="Имя / Компания *"
        error={touched.name ? errors.name : undefined}
      >
        <input
          className="bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="Иван Иванов / ООО «Ромашка»"
          value={form.name ?? ""}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => markTouched("name")}
          aria-invalid={!!errors.name}
          autoComplete="name organization"
          required
        />
      </FormField>

      {/* Email + Телефон */}
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="E-mail" error={touched.email ? errors.email : undefined}>
          <input
            type="email"
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="client@example.com"
            value={form.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => markTouched("email")}
            aria-invalid={!!errors.email}
            autoComplete="email"
            inputMode="email"
          />
        </FormField>

        <FormField label="Телефон" error={touched.phone ? errors.phone : undefined}>
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="+7 900 000-00-00"
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => markTouched("phone")}
            aria-invalid={!!errors.phone}
            autoComplete="tel"
            inputMode="tel"
          />
        </FormField>
      </div>

      {/* Компания (опционально скрываем) */}
      {showCompany && (
        <FormField label="Компания">
          <input
            className="bg-transparent border border-white/20 rounded px-3 py-2"
            placeholder="ООО «Ромашка»"
            value={form.company ?? ""}
            onChange={(e) => set("company", e.target.value)}
            onBlur={() => markTouched("company")}
            autoComplete="organization"
          />
        </FormField>
      )}

      {/* Общая ошибка (если нужна) */}
      {hasAnyError && (
        <div id="client-form-error" className="text-xs text-rose-300">
          Проверьте правильность заполнения полей.
        </div>
      )}

      {/* Действия */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="px-3 py-2 rounded border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-60"
        >
          {submitLabel}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2 rounded border border-white/20 hover:bg-white/10"
        >
          {resetLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded border border-white/20 hover:bg-white/10"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}

/* ——— Вспомогательные кусочки ——— */

function normalize(x?: ClientProfile | null): ClientProfile | null {
  if (!x) return null;
  return {
    name: x.name ?? "",
    email: x.email ?? "",
    phone: x.phone ?? "",
    company: x.company ?? "",
  };
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      {children}
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </label>
  );
}