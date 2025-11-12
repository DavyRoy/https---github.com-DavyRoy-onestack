// app/demo/admin/shop/products/new/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/app/demo/admin/shop/data/mockAdminCategories";

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

export default function AdminProductNewPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [dirty, setDirty] = useState(false);
  const [optionsInput, setOptionsInput] = useState(""); // строка для шага 2

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

  // хоткеи: Enter = Далее, Esc = Назад
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Enter" && !e.isComposing) {
        // не ломаем ввод в textarea
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag !== "textarea") {
          e.preventDefault();
          next();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, form]);

  // Валидация по шагам
  const errorsStep1 = useMemo(() => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Укажите название товара");
    if (form.name.trim().length > 120) errs.push("Название слишком длинное");
    // категория опциональна — можно создать без неё
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

  const next = useCallback(() => {
    setStep((s) => (s < 3 && canNext ? ((s + 1) as Step) : s));
  }, [canNext]);

  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const cancel = () => {
    if (dirty && !confirm("Есть несохранённые изменения. Выйти без сохранения?")) return;
    router.push("/demo/admin/shop/products");
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

  const create = () => {
    // демо: генерируем ID и редиректим на карточку (изображений нет — работаем с иконками в списке)
    const generatedId = "p-new-" + String(Math.random()).slice(2, 8);
    alert("Товар создан (демо). Откроем карточку.");
    setDirty(false);
    router.push(`/demo/admin/shop/products/${generatedId}`);
  };

  return (
    <div className="grid gap-6">
      {/* хлебные крошки */}
      <nav className="text-xs text-white/70">
        <Link href="/demo/admin/dashboard" className="hover:underline">Админ</Link>
        <span className="mx-1 opacity-50">/</span>
        <Link href="/demo/admin/shop" className="hover:underline">Магазин</Link>
        <span className="mx-1 opacity-50">/</span>
        <Link href="/demo/admin/shop/products" className="hover:underline">Товары</Link>
        <span className="mx-1 opacity-50">/</span>
        <span className="text-white/85">Новый товар</span>
      </nav>

      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Новый товар</h1>
          <p className="mt-1 text-sm text-white/70">Мастер создания (3 шага)</p>
        </div>
        <button
          type="button"
          onClick={cancel}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Отмена
        </button>
      </header>

      {/* Степпер */}
      <ol className="flex items-center gap-2 text-xs">
        {[
          { n: 1, label: "Основное" },
          { n: 2, label: "Варианты" },
          { n: 3, label: "Цена и остаток" },
        ].map((s) => (
          <li
            key={s.n}
            className={cls(
              "rounded-full px-3 py-1 border",
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
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3">
          <div className="grid gap-1">
            <label className="text-xs opacity-70">Название *</label>
            <input
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
            <label className="text-xs opacity-70">Описание</label>
            <textarea
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
            <label className="text-xs opacity-70">Категория</label>
            <select
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
            <ul className="mt-1 text-xs text-red-300 list-disc pl-4">
              {errorsStep1.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Шаг 2 */}
      {step === 2 && (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hasVariants}
              onChange={(e) => {
                const on = e.target.checked;
                setForm((f) => ({ ...f, hasVariants: on }));
                setDirty(true);
              }}
            />
            Включить варианты (размер, цвет…)
          </label>

          {form.hasVariants && (
            <>
              <div className="grid gap-1">
                <label className="text-xs opacity-70">Опции (через запятую)</label>
                <input
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
            <ul className="mt-1 text-xs text-red-300 list-disc pl-4">
              {errorsStep2.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Шаг 3 */}
      {step === 3 && (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3">
          <div className="grid gap-1">
            <label className="text-xs opacity-70">Цена (₽)</label>
            <input
              type="number"
              min={0}
              step="1"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={form.price}
              onChange={(e) => {
                setForm({ ...form, price: Number(e.target.value) });
                setDirty(true);
              }}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-xs opacity-70">Остаток</label>
            <input
              type="number"
              min={0}
              step="1"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={form.stock}
              onChange={(e) => {
                setForm({ ...form, stock: Number(e.target.value) });
                setDirty(true);
              }}
            />
          </div>

          {/* Мы отказались от изображений: никаких upload — иконки отрисуются в списке автоматически */}
          <div className="text-[11px] text-white/60">
            Медиа не обязательны: в списках используются иконки вместо картинок
          </div>

          {errorsStep3.length > 0 && (
            <ul className="mt-1 text-xs text-red-300 list-disc pl-4">
              {errorsStep3.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Навигация мастера */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={step === 1}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm disabled:opacity-50 hover:bg-white/15"
        >
          Назад
        </button>

        {step < 3 ? (
          <button
            onClick={next}
            disabled={!canNext}
            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
          >
            Далее
          </button>
        ) : (
          <button
            onClick={() => {
              if (errorsStep3.length > 0) return;
              create();
            }}
            className="rounded-xl bg-white px-4 py-2 text-sm text-black"
          >
            Создать
          </button>
        )}
      </div>
    </div>
  );
}