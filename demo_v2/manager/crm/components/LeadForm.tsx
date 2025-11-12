"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";

/**
 * LeadForm — усиленная форма лида.
 * — Живая валидация (имя/контакт/бюджет), aria-live.
 * — Контакт: распознаёт телефон ИЛИ email.
 * — Бюджет: только цифры, автоформат ₽ на blur.
 * — Хоткей Ctrl/⌘ + Enter, защита от двойной отправки.
 * — Единый визуал, фокусы, адаптив 393×852+.
 */

export default function LeadForm({ onSaved }: { onSaved: (id: string) => void }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    source: "site",
    budget: "",
    comment: "",
  });
  const [err, setErr] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  /* ---------- Валидация ---------- */

  const validate = (state = form) => {
    const e: Record<string, string> = {};
    if (!state.name.trim()) e.name = "Введите имя или компанию";

    const c = state.contact.trim();
    if (!c) {
      e.contact = "Укажите телефон или e-mail";
    } else if (!(isPhone(c) || isEmail(c))) {
      e.contact = "Неверный формат (телефон или e-mail)";
    }

    if (state.budget) {
      const digits = onlyDigits(state.budget);
      if (!digits) e.budget = "Допустимы только цифры";
    }
    return e;
  };

  // Инкрементальная валидация
  useEffect(() => {
    setErr((prev) => {
      const next = validate();
      return { ...prev, ...next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.contact, form.budget]);

  const isValid = useMemo(() => Object.keys(validate()).length === 0, [form]);

  /* ---------- Сабмит ---------- */

  const submit = async () => {
    const e = validate();
    setErr(e);
    if (Object.keys(e).length) {
      // сообщаем скринридеру
      liveRef.current?.focus();
      return;
    }
    if (saving) return;

    try {
      setSaving(true);
      const id = "ld-" + (10000 + Math.floor(Math.random() * 89999));
      toast.success(`Лид «${form.name || "без названия"}» сохранён (демо)`);
      onSaved(String(id));
    } finally {
      setSaving(false);
    }
  };

  // Хоткей Ctrl/⌘ + Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, saving]);

  /* ---------- Обработчики ---------- */

  const setField =
    <K extends keyof typeof form>(key: K) =>
    (v: string) =>
      setForm((s) => ({ ...s, [key]: v }));

  const onBudgetChange = (raw: string) => {
    setForm((s) => ({ ...s, budget: onlyDigits(raw) }));
  };
  const onBudgetBlur = () => {
    const digits = onlyDigits(form.budget);
    setForm((s) => ({ ...s, budget: digits ? formatRub(digits) : "" }));
  };
  const onBudgetFocus = () => {
    setForm((s) => ({ ...s, budget: onlyDigits(s.budget) }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="grid gap-3 md:grid-cols-2"
      aria-labelledby="lead-form-title"
    >
      {/* Live region для озвучивания ошибок */}
      <div
        ref={liveRef}
        tabIndex={-1}
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        {Object.keys(err).length ? "Исправьте ошибки в форме." : ""}
      </div>

      <h2 id="lead-form-title" className="sr-only">
        Форма создания лида
      </h2>

      <Input
        label="Имя / Компания"
        value={form.name}
        onChange={setField("name")}
        placeholder="ООО «Пример»"
        error={err.name}
        required
        maxLength={120}
      />

      <Input
        label="Контакт (телефон / e-mail)"
        value={form.contact}
        onChange={setField("contact")}
        placeholder="+7 900 ... или you@example.com"
        error={err.contact}
        required
        maxLength={120}
        hint="Можно ввести телефон или e-mail — формат распознается автоматически"
      />

      <Select
        label="Источник"
        value={form.source}
        onChange={setField("source")}
        options={[
          { value: "site", label: "Сайт" },
          { value: "call", label: "Звонок" },
          { value: "messenger", label: "Мессенджер" },
          { value: "ref", label: "Реферал" },
        ]}
      />

      <Input
        label="Бюджет (₽, демо)"
        value={form.budget}
        onChange={onBudgetChange}
        onFocus={onBudgetFocus}
        onBlur={onBudgetBlur}
        placeholder="15 000"
        error={err.budget}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={12}
        hint="Только цифры; формат применится автоматически"
      />

      <Textarea
        className="md:col-span-2"
        label="Комментарий"
        value={form.comment}
        onChange={setField("comment")}
        placeholder="Коротко о потребности клиента или следующем шаге"
        rows={4}
      />

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={!isValid || saving}
          className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
          aria-disabled={!isValid || saving}
        >
          <Save width={16} height={16} />
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

/* ---------- Подкомпоненты ---------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  maxLength,
  inputMode,
  pattern,
  hint,
  onFocus,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  hint?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const id = useIdCompat(label);
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-xs text-white/70">
        {label} {required && <span className="text-red-300/90">*</span>}
      </label>
      <input
        id={id}
        className={[T.input, error ? "border-red-400/60 ring-1 ring-red-400/20" : ""].join(" ")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        pattern={pattern}
        aria-invalid={Boolean(error)}
        aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {hint && (
        <div id={hintId} className={"text-[11px] " + T.dim}>
          {hint}
        </div>
      )}
      {error && (
        <div id={errId} className="text-[11px] text-red-300/90">
          {error}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}) {
  const id = useIdCompat(label);
  return (
    <div className={`grid gap-1 ${className || ""}`}>
      <label htmlFor={id} className="text-xs text-white/70">
        {label}
      </label>
      <select
        id={id}
        className={T.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const id = useIdCompat(label);
  return (
    <div className={`grid gap-1 ${className || ""}`}>
      <label htmlFor={id} className="text-xs text-white/70">
        {label}
      </label>
      <textarea
        id={id}
        className={T.input}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ---------- Утилиты ---------- */

function onlyDigits(s: string) {
  return (s || "").replace(/[^\d]/g, "");
}

function formatRub(digits: string) {
  // 1234567 -> 1 234 567 (узкий неразрывный пробел)
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
}

function isEmail(s: string) {
  // Лёгкая, но практичная проверка
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function isPhone(s: string) {
  // Разрешим +, пробелы, дефисы, скобки; проверим, что цифр >= 10
  const digits = (s || "").replace(/\D/g, "");
  return digits.length >= 10;
}

// Простая генерация id без SSR рассинхронизации
function useIdCompat(seed?: string) {
  const [id] = useState(() => {
    const base = (seed || "f").replace(/\s+/g, "-").toLowerCase();
    const rand = Math.random().toString(36).slice(2, 7);
    return `${base}-${rand}`;
  });
  return id;
}