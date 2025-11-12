"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { DealStage } from "@/app/demo/manager/crm/data/mockDeals";

type ErrMap = Record<string, string>;

export default function DealForm({ onSaved }: { onSaved: (id: string) => void }) {
  const [form, setForm] = useState({
    title: "",
    client: "",
    amount: "", // хранится строкой, форматируем на blur
    stage: "new" as DealStage,
    owner: "Мария",
    note: "",
  });
  const [err, setErr] = useState<ErrMap>({});
  const [saving, setSaving] = useState(false);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Валидация (инкрементальная)
  const validate = (state = form): ErrMap => {
    const e: ErrMap = {};
    if (!state.title.trim()) e.title = "Укажите название сделки";
    if (!state.client.trim()) e.client = "Укажите клиента/компанию";

    const digits = onlyDigits(state.amount);
    if (!digits) e.amount = "Укажите сумму в ₽ (только цифры)";
    return e;
  };

  useEffect(() => {
    setErr((prev) => {
      const next = validate();
      // Обновляем только изменившиеся поля, чтобы не мигали ошибки
      return { ...prev, ...next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, form.client, form.amount]);

  const isValid = useMemo(() => Object.keys(validate()).length === 0, [form]);

  // Сабмит
  const submit = async () => {
    const e = validate();
    setErr(e);
    if (Object.keys(e).length > 0) {
      liveRegionRef.current?.focus();
      return;
    }
    if (saving) return;

    try {
      setSaving(true);
      // Имитируем создание id
      const id = "dl-" + (20000 + Math.floor(Math.random() * 79999));
      toast.success("Сделка сохранена (демо)");
      onSaved(String(id));
    } finally {
      setSaving(false);
    }
  };

  // Шорткаты: Cmd/Ctrl+Enter — отправка
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

  // Обработчики
  const setField =
    <K extends keyof typeof form>(key: K) =>
    (v: string) =>
      setForm((s) => ({ ...s, [key]: v }));

  const onAmountChange = (raw: string) => {
    // Разрешаем только цифры; мягко чистим ввод
    const digits = onlyDigits(raw);
    setForm((s) => ({ ...s, amount: digits }));
  };

  const onAmountBlur = () => {
    // Превращаем "50000" -> "50 000" (узкий пробел)
    const digits = onlyDigits(form.amount);
    setForm((s) => ({ ...s, amount: digits ? formatRub(digits) : "" }));
  };

  const onAmountFocus = () => {
    // Возвращаем чистые цифры для удобного редактирования
    const digits = onlyDigits(form.amount);
    setForm((s) => ({ ...s, amount: digits }));
  };

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      aria-describedby="dealform-helper"
    >
      {/* Live region для ошибок формы */}
      <div
        ref={liveRegionRef}
        tabIndex={-1}
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        {Object.keys(err).length > 0 ? "Исправьте ошибки в форме." : ""}
      </div>

      <Input
        label="Название сделки"
        value={form.title}
        onChange={setField("title")}
        error={err.title}
        placeholder="Оснащение салона «…»"
        maxLength={120}
        required
      />

      <Input
        label="Клиент/компания"
        value={form.client}
        onChange={setField("client")}
        error={err.client}
        placeholder="ООО «Ромашка»"
        maxLength={120}
        required
      />

      <Input
        label="Сумма (₽)"
        value={form.amount}
        onChange={onAmountChange}
        onFocus={onAmountFocus}
        onBlur={onAmountBlur}
        error={err.amount}
        placeholder="50 000"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={12}
        required
        hint="Только цифры; формат применится автоматически"
      />

      <Select
        label="Этап сделки"
        value={form.stage}
        onChange={(v) => setForm((s) => ({ ...s, stage: v as DealStage }))}
        options={[
          { value: "new", label: "Новый" },
          { value: "in_progress", label: "В работе" },
          { value: "proposal", label: "Коммерческое" },
          { value: "won", label: "Успех" },
          { value: "lost", label: "Потеряно" },
        ]}
      />

      <Select
        label="Ответственный"
        value={form.owner}
        onChange={setField("owner")}
        options={[{ value: "Мария", label: "Мария" }, { value: "Иван", label: "Иван" }, { value: "Ольга", label: "Ольга" }]}
      />

      <Textarea
        label="Примечание"
        value={form.note}
        onChange={setField("note")}
        placeholder="Следующий шаг, детали КП и т.д."
        rows={4}
        className="md:col-span-2"
      />

      {/* Подсказка и клавиши */}
      <div id="dealform-helper" className={"text-[11px] " + T.dim + " md:col-span-2"}>
        Совет: используйте <kbd className="rounded bg-white/10 px-1">Ctrl</kbd>/
        <kbd className="rounded bg-white/10 px-1">⌘</kbd>
        +<kbd className="rounded bg-white/10 px-1">Enter</kbd> для быстрого сохранения.
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={!isValid || saving}
          className={[
            // если у вас есть глобальный .btn/.btn-primary — оставляю его
            "btn btn-primary inline-flex items-center gap-2",
            // на случай отсутствия глобальных — даю фолбэк токенами
            "disabled:opacity-60 disabled:pointer-events-none",
          ].join(" ")}
          aria-disabled={!isValid || saving}
        >
          <Save width={16} height={16} />
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

/* ---------------- Подкомпоненты ---------------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  className,
  maxLength,
  required,
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
  className?: string;
  maxLength?: number;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  hint?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const id = useIdCompat(label);
  const hintId = hint ? id + "-hint" : undefined;
  const errId = error ? id + "-err" : undefined;

  return (
    <div className={`grid gap-1 ${className || ""}`}>
      <label htmlFor={id} className="text-xs text-white/70">
        {label} {required && <span className="text-red-300/90">*</span>}
      </label>
      <input
        id={id}
        className={[
          T.input,
          error ? "border-red-400/50 ring-1 ring-red-400/20" : "",
        ].join(" ")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
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

/* ---------------- Утилиты ---------------- */

function onlyDigits(s: string) {
  return (s || "").replace(/[^\d]/g, "");
}

function formatRub(digits: string) {
  // Вставляем узкие пробелы между тысячами для читаемости
  // 1234567 -> 1 234 567
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
}

// Компактный useId без SSR- несовпадений для простого кейса
function useIdCompat(seed?: string) {
  const [id] = useState(() => {
    const base = (seed || "f").replace(/\s+/g, "-").toLowerCase();
    const rand = Math.random().toString(36).slice(2, 7);
    return `${base}-${rand}`;
  });
  return id;
}