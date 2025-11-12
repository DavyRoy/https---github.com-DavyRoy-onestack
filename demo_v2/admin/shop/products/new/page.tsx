// app/demo/admin/shop/products/new/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
// Используем общий справочник категорий из shared-данных, чтобы всё было единообразно
import { CATEGORIES } from "@/app/demo/(shared)/data/catalog/categories.food";

type Step = 1 | 2 | 3;

type FormState = {
  name: string;
  description: string;
  categoryId: string;
  visible: boolean;
  hasVariants: boolean;
  options: string[]; // имена опций (Размер, Цвет…)
  price: number;
  stock: number;
};

const initialForm: FormState = {
  name: "",
  description: "",
  categoryId: "",
  visible: true,
  hasVariants: false,
  options: [],
  price: 0,
  stock: 0,
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminProductNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [dirty, setDirty] = useState(false);
  const [optionsInput, setOptionsInput] = useState(""); // строка для шага 2
  const stepperRef = useRef<HTMLOListElement | null>(null);

  // защита от закрытия вкладки/перезагрузки при несохранённых изменениях
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // хоткеи: Enter = Далее (кроме textarea), Esc = Назад, Ctrl/Cmd+S на шаге 3 = Создать
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.body.getAttribute("aria-busy") === "true") return;

      // Сохранить/Создать
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (step === 3 && errorsStep3.length === 0) {
          create();
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === "Enter" && !e.isComposing) {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag !== "textarea") {
          e.preventDefault();
          next();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, form, optionsInput]);

  // Валидация по шагам
  const errorsStep1 = useMemo(() => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Укажите название товара");
    if (form.name.trim().length > 120) errs.push("Название слишком длинное");
    return errs;
  }, [form.name]);

  const errorsStep2 = useMemo(() => {
    const errs: string[] = [];
    if (form.hasVariants && form.options.length === 0) {
      errs.push("Добавьте хотя бы одну опцию или отключите варианты");
    }
    return errs;
  }, [form.hasVariants, form.options]);

  const errorsStep3 = useMemo(() => {
    const errs: string[] = [];
    if (!Number.isFinite(form.price) || form.price < 0) errs.push("Цена должна быть ≥ 0");
    if (!Number.isFinite(form.stock) || form.stock < 0) errs.push("Остаток должен быть ≥ 0");
    return errs;
  }, [form.price, form.stock]);

  const canNext = useMemo(() => {
    if (step === 1) return errorsStep1.length === 0;
    if (step === 2) return errorsStep2.length === 0;
    return true;
  }, [step, errorsStep1, errorsStep2]);

  const scrollActiveStepIntoView = (ns: Step) => {
    const el = stepperRef.current?.querySelector<HTMLElement>(`[data-step="${ns}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const next = useCallback(() => {
    setStep((s) => {
      if (s < 3 && canNext) {
        const ns = (s + 1) as Step;
        scrollActiveStepIntoView(ns);
        return ns;
      }
      return s;
    });
  }, [canNext]);

  const prev = () =>
    setStep((s) => {
      const ns = (s > 1 ? (s - 1) : s) as Step;
      scrollActiveStepIntoView(ns);
      return ns;
    });

  const cancel = () => {
    if (dirty && !confirm("Есть несохранённые изменения. Выйти без сохранения?")) return;
    router.push(`${base}/shop/products`);
  };

  const normalizeOptions = (raw: string) =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 10); // разумный лимит

  const commitOptions = () => {
    if (!form.hasVariants) return;
    const opts = normalizeOptions(optionsInput);
    setForm((f) => ({ ...f, options: opts }));
    setDirty(true);
  };

  // Синхронизируем поле ввода с массивом опций при включении вариантов
  useEffect(() => {
    if (form.hasVariants) {
      setOptionsInput(form.options.join(", "));
    } else {
      setOptionsInput("");
    }
  }, [form.hasVariants]); // не тянем form.options, чтобы не задирать курсор

  const create = () => {
    // демо: генерируем ID и редиректим на карточку
    const generatedId = "p-new-" + String(Math.random()).slice(2, 8);
    alert("Товар создан (демо). Откроем карточку.");
    setDirty(false);
    router.push(`${base}/shop/products/${generatedId}`);
  };

  return (
    <div className="grid gap-6 overflow-x-hidden">
      {/* хлебные крошки */}
      <nav className="text-xs text-white/70 flex flex-wrap items-center gap-x-1 gap-y-1" aria-label="Хлебные крошки">
        <Link href={`${base}/dashboard`} prefetch={false} className="hover:underline">Админ</Link>
        <span className="mx-1 opacity-50">/</span>
        <Link href={`${base}/shop`} prefetch={false} className="hover:underline">Магазин</Link>
        <span className="mx-1 opacity-50">/</span>
        <Link href={`${base}/shop/products`} prefetch={false} className="hover:underline">Товары</Link>
        <span className="mx-1 opacity-50">/</span>
        <span className="text-white/85" aria-current="page">Новый товар</span>
      </nav>

      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Новый товар</h1>
          <p className="mt-1 text-sm text-white/70">Мастер создания (3 шага)</p>
        </div>
        <button
          type="button"
          onClick={cancel}
          className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Отмена
        </button>
      </header>

      {/* Степпер */}
      <ol
        ref={stepperRef}
        className="flex items-center gap-2 text-xs overflow-x-auto snap-x snap-mandatory"
        aria-label="Шаги мастера создания товара"
      >
        {[
          { n: 1, label: "Основное" },
          { n: 2, label: "Варианты" },
          { n: 3, label: "Цена и остаток" },
        ].map((s) => (
          <li
            key={s.n}
            data-step={s.n}
            className={cls(
              "rounded-full px-3 py-1 border snap-start whitespace-nowrap",
              step === (s.n as Step)
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-white/5"
            )}
          >
            Шаг {s.n}: {s.label}
          </li>
        ))}
      </ol>

      {/* Шаг 1 */}
      {step === 1 && (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3" aria-labelledby="step-1-title">
          <div id="step-1-title" className="sr-only">Шаг 1 — Основные поля</div>

          <div className="grid gap-1">
            <label className="text-xs opacity-70" htmlFor="p-name">Название *</label>
            <input
              id="p-name"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setDirty(true);
              }}
              placeholder="Напр. Шампунь Nutrition 250мл"
              maxLength={120}
              required
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs opacity-70" htmlFor="p-desc">Описание</label>
            <textarea
              id="p-desc"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm min-h-[110px] outline-none focus:ring-2 focus:ring-white/30"
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setDirty(true);
              }}
              placeholder="Короткое описание для карточки и чек-аута"
            />
            <div className="text-[11px] text-white/60">
              Поддерживается простой текст; расширенный редактор можно подключить позже
            </div>
          </div>

          <div className="grid gap-1">
            <label className="text-xs opacity-70" htmlFor="p-cat">Категория</label>
            <select
              id="p-cat"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={form.categoryId}
              onChange={(e) => {
                setForm({ ...form, categoryId: e.target.value });
                setDirty(true);
              }}
            >
              <option value="">— Без категории —</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-white/60">
              Справочник категорий общий для ролей и используется в фильтрах
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => {
                setForm({ ...form, visible: e.target.checked });
                setDirty(true);
              }}
            />
            Показывать в витрине
          </label>

          {errorsStep1.length > 0 && (
            <ul className="mt-1 text-xs text-red-300 list-disc pl-4" role="alert" aria-live="assertive">
              {errorsStep1.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Шаг 2 */}
      {step === 2 && (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3" aria-labelledby="step-2-title">
          <div id="step-2-title" className="sr-only">Шаг 2 — Варианты</div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hasVariants}
              onChange={(e) => {
                const on = e.target.checked;
                setForm((f) => ({ ...f, hasVariants: on, options: on ? f.options : [] }));
                setDirty(true);
              }}
            />
            Включить варианты (размер, цвет…)
          </label>

          {form.hasVariants && (
            <>
              <div className="grid gap-1">
                <label className="text-xs opacity-70" htmlFor="p-opts">Опции (через запятую)</label>
                <input
                  id="p-opts"
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Напр.: Размер, Цвет"
                  value={optionsInput}
                  onChange={(e) => setOptionsInput(e.target.value)}
                  onBlur={commitOptions}
                />
                <div className="text-[11px] text-white/60">
                  Примеры: «Размер, Цвет» или «Объём», максимум 10 опций
                </div>
              </div>

              {form.options.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/70">Добавленные опции</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {form.options.map((o) => (
                      <span
                        key={o}
                        className="text-xs rounded-lg border border-white/10 bg-white/10 px-2 py-0.5"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {errorsStep2.length > 0 && (
            <ul className="mt-1 text-xs text-red-300 list-disc pl-4" role="alert" aria-live="assertive">
              {errorsStep2.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Шаг 3 */}
      {step === 3 && (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3" aria-labelledby="step-3-title">
          <div id="step-3-title" className="sr-only">Шаг 3 — Цена и остаток</div>

          <div className="grid gap-1">
            <label className="text-xs opacity-70" htmlFor="p-price">Цена (₽)</label>
            <input
              id="p-price"
              type="number"
              min={0}
              step="1"
              inputMode="numeric"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={Number.isFinite(form.price) ? form.price : 0}
              onChange={(e) => {
                const n = e.target.value === "" ? 0 : Number(e.target.value);
                setForm({ ...form, price: Number.isFinite(n) && n >= 0 ? n : 0 });
                setDirty(true);
              }}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-xs opacity-70" htmlFor="p-stock">Остаток</label>
            <input
              id="p-stock"
              type="number"
              min={0}
              step="1"
              inputMode="numeric"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={Number.isFinite(form.stock) ? form.stock : 0}
              onChange={(e) => {
                const n = e.target.value === "" ? 0 : Number(e.target.value);
                setForm({ ...form, stock: Number.isFinite(n) && n >= 0 ? n : 0 });
                setDirty(true);
              }}
            />
          </div>

          <div className="text-[11px] text-white/60">
            Медиа не обязательны: в списках используются иконки вместо картинок
          </div>

          {errorsStep3.length > 0 && (
            <ul className="mt-1 text-xs text-red-300 list-disc pl-4" role="alert" aria-live="assertive">
              {errorsStep3.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Навигация мастера */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
        <button
          onClick={prev}
          disabled={step === 1}
          className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm disabled:opacity-50 hover:bg-white/15"
          aria-disabled={step === 1 || undefined}
        >
          Назад
        </button>

        {step < 3 ? (
          <button
            onClick={next}
            disabled={!canNext}
            className="w-full sm:w-auto rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
            aria-disabled={!canNext || undefined}
            title={!canNext ? "Исправьте ошибки, чтобы продолжить" : "Далее"}
          >
            Далее
          </button>
        ) : (
          <button
            onClick={() => {
              if (errorsStep3.length > 0) return;
              create();
            }}
            className="w-full sm:w-auto rounded-xl bg-white px-4 py-2 text-sm text-black"
            title="Создать товар (Ctrl/Cmd+S)"
          >
            Создать
          </button>
        )}
      </div>
    </div>
  );
}