"use client";

import React from "react";

type Assets = {
  logoLight?: string;
  logoDark?: string;
  favicon?: string;
};

type Field = {
  key: keyof Assets;
  label: string;
  hint?: string;
  bg?: "light" | "dark" | "transparent";
  accept?: string;
};

const FIELDS: Field[] = [
  {
    key: "logoLight",
    label: "Логотип (светлый фон)",
    hint: "PNG/SVG, желательно с прозрачностью",
    bg: "light",
    accept: "image/*",
  },
  {
    key: "logoDark",
    label: "Логотип (тёмный фон)",
    hint: "PNG/SVG, желательно с прозрачностью",
    bg: "dark",
    accept: "image/*",
  },
  {
    key: "favicon",
    label: "Favicon",
    hint: "16–64px, PNG/ICO",
    bg: "transparent",
    accept: "image/*,.ico",
  },
];

const MAX_FILE_BYTES = 1_000_000; // 1MB лимит для демо (можно изменить)

const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
const isDataUrl = (s: string) => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(s);

export default function BrandingAssetsUploader({
  value,
  onChange,
}: {
  value: Assets;
  onChange: (v: Assets) => void;
}) {
  const v = value || { logoLight: "", logoDark: "", favicon: "" };
  const [errors, setErrors] = React.useState<Partial<Record<keyof Assets, string>>>({});

  const set = (k: keyof Assets, val: string) => {
    // валидация: разрешаем пусто, http(s) или data:image/*
    if (val && !(isHttpUrl(val) || isDataUrl(val))) {
      setErrors((e) => ({ ...e, [k]: "Укажите корректный URL (http/https) или data URL изображения" }));
    } else {
      setErrors((e) => ({ ...e, [k]: undefined }));
      onChange({ ...v, [k]: val });
    }
  };

  const readAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handleFile = async (k: keyof Assets, file: File) => {
    // простая проверка размера для демо
    if (file.size > MAX_FILE_BYTES) {
      setErrors((e) => ({
        ...e,
        [k]: `Файл слишком большой (${Math.ceil(file.size / 1024)} KB). Лимит ${Math.ceil(
          MAX_FILE_BYTES / 1024
        )} KB`,
      }));
      return;
    }
    try {
      const dataUrl = await readAsDataURL(file);
      set(k, dataUrl);
    } catch {
      setErrors((e) => ({ ...e, [k]: "Не удалось прочитать файл" }));
    }
  };

  return (
    <section className="grid gap-3 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Активы</div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        {FIELDS.map((f) => {
          const val = v[f.key] || "";
          const id = `asset-${f.key}`;
          const bgCls =
            f.bg === "light"
              ? "bg-white text-neutral-900"
              : f.bg === "dark"
              ? "bg-neutral-900 text-white"
              : "bg-transparent";
          const fileInputRef = React.createRef<HTMLInputElement>();
          const error = errors[f.key];

          return (
            <div
              key={String(f.key)}
              className="rounded-2xl border border-white/15 bg-white/[0.04] p-3 min-w-0"
            >
              <label htmlFor={id} className="block text-sm font-medium">
                {f.label}
              </label>
              {f.hint && <div className="text-[11px] text-white/50 mt-0.5">{f.hint}</div>}

              {/* Превью */}
              <div
                className={`mt-2 rounded-xl border border-white/10 ${bgCls} grid place-items-center overflow-hidden`}
                style={{ height: 96 }}
                aria-label={`Превью: ${f.label}`}
              >
                {val ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={val}
                    alt={f.label}
                    className="max-h-20 max-w-[85%] object-contain"
                    draggable={false}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setErrors((e) => ({
                        ...e,
                        [f.key]: "Не удалось отобразить изображение (проверьте URL/формат)",
                      }))
                    }
                  />
                ) : (
                  <div className="text-xs opacity-60">Нет изображения</div>
                )}
              </div>

              {/* URL / Data URL */}
              <div className="mt-2 grid gap-2 min-w-0">
                <input
                  id={id}
                  inputMode="url"
                  placeholder="URL или data URL (data:image/…)"
                  className={`w-full min-w-0 rounded-lg bg-white/5 px-3 py-2 border text-sm outline-none focus:ring-2 ${
                    error
                      ? "border-rose-400/40 focus:ring-rose-400/25"
                      : "border-white/10 focus:ring-white/20"
                  }`}
                  value={val}
                  onChange={(e) => set(f.key, e.target.value)}
                  aria-describedby={error ? `${id}-err` : undefined}
                />

                {error && (
                  <div id={`${id}-err`} className="text-[11px] text-rose-300">
                    {error}
                  </div>
                )}

                {/* Кнопки: Загрузить файл / Очистить */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={f.accept ?? "image/*"}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      void handleFile(f.key, file);
                      // очищаем значение, чтобы можно было выбрать тот же файл повторно
                      e.currentTarget.value = "";
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-lg border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 text-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Загрузить файл
                  </button>

                  {val && (
                    <button
                      type="button"
                      onClick={() => set(f.key, "")}
                      className="rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 text-sm"
                    >
                      Очистить
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Подсказка по размерам и форматам */}
      <div className="text-[11px] text-white/50">
        Советы: используйте SVG, если возможно; для favicon подойдут PNG&nbsp;32×32 или ICO.
        При загрузке файл конвертируется в data URL (демо). Максимальный размер файла:{" "}
        {Math.ceil(MAX_FILE_BYTES / 1024)} KB.
      </div>
    </section>
  );
}