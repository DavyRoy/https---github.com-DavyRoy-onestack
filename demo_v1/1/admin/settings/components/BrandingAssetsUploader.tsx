"use client";

import React from "react";

type Assets = {
  logoLight?: string;
  logoDark?: string;
  favicon?: string;
};

export default function BrandingAssetsUploader({
  value,
  onChange,
}: {
  value: Assets;
  onChange: (v: Assets) => void;
}) {
  const v = value || { logoLight: "", logoDark: "", favicon: "" };

  const set = (k: keyof Assets, val: string) => {
    onChange({ ...v, [k]: val });
  };

  const readAsDataURL = async (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handleFile = async (
    k: keyof Assets,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readAsDataURL(file);
      set(k, dataUrl);
    } catch {
      alert("Не удалось прочитать файл");
    } finally {
      // чтобы повторно выбрать тот же файл
      e.target.value = "";
    }
  };

  const fields: Array<{
    key: keyof Assets;
    label: string;
    hint?: string;
    bg?: "light" | "dark" | "transparent";
  }> = [
    {
      key: "logoLight",
      label: "Логотип (светлый фон)",
      hint: "PNG/SVG, желательно с прозрачностью",
      bg: "light",
    },
    {
      key: "logoDark",
      label: "Логотип (тёмный фон)",
      hint: "PNG/SVG, желательно с прозрачностью",
      bg: "dark",
    },
    { key: "favicon", label: "Favicon", hint: "16–64px, PNG/ICO", bg: "transparent" },
  ];

  return (
    <section className="grid gap-3 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Активы</div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        {fields.map((f) => {
          const val = v[f.key] || "";
          const id = `asset-${f.key}`;
          const bgCls =
            f.bg === "light"
              ? "bg-white text-neutral-900"
              : f.bg === "dark"
              ? "bg-neutral-900 text-white"
              : "bg-transparent";

          return (
            <div
              key={String(f.key)}
              className="rounded-2xl border border-white/15 bg-white/[0.04] p-3 min-w-0"
            >
              <label htmlFor={id} className="block text-sm font-medium">
                {f.label}
              </label>
              {f.hint && (
                <div className="text-[11px] text-white/50 mt-0.5">{f.hint}</div>
              )}

              {/* Превью */}
              <div
                className={`mt-2 rounded-xl border border-white/10 ${bgCls} grid place-items-center overflow-hidden`}
                style={{ height: 96 }}
                aria-label={`Превью: ${f.label}`}
              >
                {val ? (
                  <img
                    src={val}
                    alt={f.label}
                    className="max-h-20 max-w-[85%] object-contain"
                    draggable={false}
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
                  className="w-full min-w-0 rounded-lg bg-white/5 px-3 py-2 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={val}
                  onChange={(e) => set(f.key, e.target.value)}
                  aria-describedby={`${id}-hint`}
                />

                {/* Кнопки: Загрузить файл / Очистить */}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(f.key, e)}
                    />
                    <span className="cursor-pointer rounded-lg border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 text-sm">
                      Загрузить файл
                    </span>
                  </label>

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
        Советы: используйте SVG, если возможно; для favicon подойдут PNG 32×32
        или ICO. При загрузке файла он конвертируется в data URL (демо).
      </div>
    </section>
  );
}