// src/app/demo/ui/inputs.tsx
"use client";

import * as React from "react";

/* ================================ Label ================================= */

export function Label({
  children,
  htmlFor,
  className = "",
  required = false,
  hint,
  hintId,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
  /** Небольшая подсказка под лейблом (например, формат поля). */
  hint?: string;
  /** Передай, если хочешь сам контролировать id для aria-describedby. */
  hintId?: string;
}) {
  const autoId = React.useId();
  const id = hintId ?? `lbl-hint-${autoId}`;
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-xs uppercase tracking-[0.18em] text-white/60"
      >
        {children}
        {required ? <span className="ml-1 text-white/70" aria-hidden="true">*</span> : null}
      </label>
      {hint ? (
        <div id={id} className="mt-1 text-xs text-white/45">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

/* ============================== TextInput =============================== */

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  disabled,
  required,
  autoComplete,
  inputMode,
  invalid, // совместимо с существующим кодом
  hint,
  error,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** Подсветить невалидное состояние */
  invalid?: boolean;
  /** Текст-подсказка под полем */
  hint?: string;
  /** Текст ошибки под полем (приоритетнее hint) */
  error?: string;
}) {
  const autoId = React.useId();
  const inputId = id ?? `ti-${autoId}`;
  const hintId = `ti-hint-${autoId}`;
  const errorId = `ti-err-${autoId}`;
  const showError = Boolean(error);
  const showHint = Boolean(hint) && !showError;

  const describedBy =
    showError ? errorId : showHint ? hintId : undefined;

  const base =
    "w-full rounded-xl border px-4 py-2.5 outline-none placeholder:text-white/40 transition";
  const tone = showError || invalid
    ? "border-rose-400/40 bg-rose-400/[0.06] focus:ring-2 focus:ring-rose-400/25"
    : "border-white/10 bg-white/[0.03] focus:ring-2 focus:ring-white/20";
  const state = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <div className={className}>
      <input
        id={inputId}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoCapitalize="off"
        spellCheck={false}
        aria-required={required || undefined}
        aria-invalid={showError || invalid || undefined}
        aria-describedby={describedBy}
        className={`${base} ${tone} ${state}`}
      />
      {showError ? (
        <div id={errorId} className="mt-1 text-xs text-rose-300">
          {error}
        </div>
      ) : showHint ? (
        <div id={hintId} className="mt-1 text-xs text-white/45">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

/* ================================= Select =============================== */

export function Select({
  id,
  value,
  onChange,
  options,
  className = "",
  disabled,
  required,
  invalid,
  hint,
  error,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  hint?: string;
  error?: string;
}) {
  const autoId = React.useId();
  const selectId = id ?? `sel-${autoId}`;
  const hintId = `sel-hint-${autoId}`;
  const errId = `sel-err-${autoId}`;
  const showError = Boolean(error);
  const showHint = Boolean(hint) && !showError;

  const base =
    "w-full rounded-xl border px-3 py-2.5 outline-none transition";
  const tone = showError || invalid
    ? "border-rose-400/40 bg-rose-400/[0.06] focus:ring-2 focus:ring-rose-400/25"
    : "border-white/10 bg-white/[0.03] focus:ring-2 focus:ring-white/20";
  const state = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <div className={className}>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        aria-required={required || undefined}
        aria-invalid={showError || invalid || undefined}
        aria-describedby={showError ? errId : showHint ? hintId : undefined}
        className={`${base} ${tone} ${state}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-black text-white">
            {o.label}
          </option>
        ))}
      </select>
      {showError ? (
        <div id={errId} className="mt-1 text-xs text-rose-300">
          {error}
        </div>
      ) : showHint ? (
        <div id={hintId} className="mt-1 text-xs text-white/45">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

/* ================================= Toggle =============================== */

export function Toggle({
  id,
  checked,
  onChange,
  label,
  className = "",
  disabled,
  hint,
}: {
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
  disabled?: boolean;
  hint?: string;
}) {
  const autoId = React.useId();
  const switchId = id ?? `tg-${autoId}`;
  const hintId = `tg-hint-${autoId}`;

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!disabled) onChange(!checked);
    }
  };

  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 ${className}`}>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm">{label}</div>
          {hint ? <div id={hintId} className="mt-0.5 text-xs text-white/50">{hint}</div> : null}
        </div>

        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={hint ? hintId : undefined}
          onClick={() => !disabled && onChange(!checked)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            ${checked ? "bg-white border-white" : "bg-white/10 border-white/20"}`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-5 w-5 transform rounded-full bg-black transition duration-300 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
  );
}