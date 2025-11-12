"use client";

import * as React from "react";

type Props = {
  /** Текущие теги (источник истины снаружи) */
  tags: string[];
  /** Колбэк для изменения — если не передан, карточка работает в read-only режиме */
  onChange?: (next: string[]) => void;

  /** Макс. длина одного тега (по умолчанию 32) */
  maxTagLength?: number;
  /** Разделители при вводе (по умолчанию запятая/точка с запятой/новая строка) */
  separators?: string[];
  /** Не учитывать регистр при проверке дублей (по умолчанию true) */
  caseInsensitive?: boolean;
};

export default function ClientTagsCard({
  tags,
  onChange,
  maxTagLength = 32,
  separators = [",", ";", "\n"],
  caseInsensitive = true,
}: Props) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const readOnly = !onChange;
  const norm = (s: string) => s.replace(/\s+/g, " ").trim();
  const canon = (s: string) => (caseInsensitive ? s.toLowerCase() : s);

  const canonSet = React.useMemo(() => new Set((tags || []).map((t) => canon(t))), [tags, caseInsensitive]);

  function push(nextValues: string[]) {
    if (readOnly) {
      alert("Демо: изменение тегов недоступно (read-only)");
      return;
    }
    onChange?.(nextValues);
  }

  function tryAdd(raw: string) {
    const t = norm(raw);
    if (!t) return;

    if (t.length > maxTagLength) {
      setError(`Тег слишком длинный (>${maxTagLength} симв.)`);
      return;
    }

    if (canonSet.has(canon(t))) {
      setError("Такой тег уже есть");
      return;
    }

    setError(null);
    push([...(tags || []), t]);
    setValue("");
  }

  function tryRemove(t: string) {
    setError(null);
    const next = (tags || []).filter((x) => x !== t);
    push(next);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      tryAdd(value);
      return;
    }
    if (separators.includes(e.key)) {
      e.preventDefault();
      tryAdd(value);
      return;
    }
    if (e.key === "Backspace" && !value && tags.length && !readOnly) {
      // UX: backspace на пустом инпуте — удалить последний тег
      tryRemove(tags[tags.length - 1]);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text") || "";
    const hasSep = separators.some((s) => text.includes(s));
    if (!hasSep) return;
    e.preventDefault();
    const parts = text
      .split(new RegExp(`[${separators.map(escapeReg).join("")}]`, "g"))
      .map(norm)
      .filter(Boolean);

    const unique = parts.filter((p) => !canonSet.has(canon(p)) && p.length <= maxTagLength);
    if (!unique.length) {
      setError("Нет новых тегов для добавления");
      return;
    }
    setError(null);
    push([...(tags || []), ...unique]);
  }

  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03]">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-white/70">Метки</div>
        <div className="text-xs text-white/50">
          {tags?.length ?? 0} шт.
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {tags && tags.length ? (
          tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-xs"
            >
              {t}
              {!readOnly && (
                <button
                  type="button"
                  className="opacity-70 hover:opacity-100"
                  aria-label={`Удалить тег ${t}`}
                  onClick={() => tryRemove(t)}
                >
                  ×
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="text-sm opacity-70">—</span>
        )}
      </div>

      {/* Редактор */}
      <div className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(e) => {
            setError(null);
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={readOnly ? "Теги доступны только для просмотра" : "Добавить тег…"}
          className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm flex-1 min-w-[160px]"
          disabled={readOnly}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => tryAdd(value)}
          className="rounded border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50"
          disabled={readOnly || !norm(value)}
          title={readOnly ? "Read-only" : "Добавить тег"}
        >
          Добавить
        </button>
      </div>

      {/* Хелперы/ошибки */}
      <div className="mt-2 text-xs">
        {error ? (
          <div className="text-rose-300">{error}</div>
        ) : (
          <div className="text-white/40">
            Enter, запятая или паста списком • до {maxTagLength} символов
          </div>
        )}
      </div>
    </section>
  );
}

/* ——— helpers ——— */
function escapeReg(s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}