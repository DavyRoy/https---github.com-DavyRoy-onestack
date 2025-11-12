// app/demo/admin/payments/fees/new/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Form = {
  name: string;
  active: boolean;
  dateFrom: string; // YYYY-MM-DD
  dateTo: string;   // YYYY-MM-DD
  notes: string;
};

function computeErrors(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (!f.name.trim()) e.name = "Введите название плана.";
  if (f.dateFrom && isNaN(new Date(f.dateFrom).getTime())) e.dateFrom = "Некорректная дата.";
  if (f.dateTo && isNaN(new Date(f.dateTo).getTime())) e.dateTo = "Некорректная дата.";
  if (f.dateFrom && f.dateTo) {
    const from = new Date(f.dateFrom + "T00:00:00");
    const to = new Date(f.dateTo + "T23:59:59");
    if (from.getTime() > to.getTime()) {
      e.dateFrom = "Дата начала должна быть не позже даты окончания.";
      e.dateTo = "Дата окончания должна быть не раньше даты начала.";
    }
  }
  return e;
}

export default function FeePlanNewPage() {
  const router = useRouter();

  const [form, setForm] = React.useState<Form>({
    name: "",
    active: true,
    dateFrom: "",
    dateTo: "",
    notes: "",
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof Form, string>>>({});
  const [clientTime, setClientTime] = React.useState<string>("");

  React.useEffect(() => {
    const iso = new Date().toISOString().replace("T", " ").slice(0, 16);
    setClientTime(iso);
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // «Живые» ошибки для UI без setState → нет перерисовочного цикла
  const liveErrors = React.useMemo(() => computeErrors(form), [form]);
  const isValid = Object.keys(liveErrors).length === 0;

  function validateAndSet() {
    const e = computeErrors(form);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const onCreate = () => {
    if (!validateAndSet()) return;
    alert(`План «${form.name.trim()}» создан (демо).`);
    router.push("/demo/admin/payments/fees");
  };

  const onCancel = () => router.push("/demo/admin/payments/fees");

  // Пресеты дат
  const setPreset = (preset: "today+30" | "qtr") => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (preset === "today+30") {
      const from = new Date(y, m, today.getDate());
      const to = new Date(from);
      to.setDate(to.getDate() + 30);
      set("dateFrom", toISO(from));
      set("dateTo", toISO(to));
    } else {
      const qStartMonth = Math.floor(m / 3) * 3; // 0,3,6,9
      const from = new Date(y, qStartMonth, 1);
      const to = new Date(y, qStartMonth + 3, 0);
      set("dateFrom", toISO(from));
      set("dateTo", toISO(to));
    }
  };

  return (
    <div className="grid gap-6 overflow-x-hidden max-w-full">
      {/* Хедер */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/payments/fees" className="hover:underline">
              ← Тарифы/Комиссии
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
            Новый план комиссий
          </h1>
          <p className="mt-1 text-sm text-white/60 break-words">
            Создайте шаблон правил комиссий. В демо данные не сохраняются.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={onCreate}
            disabled={!isValid}
            className={`w-full sm:w-auto rounded-lg px-3 py-2 text-sm transition ${
              isValid
                ? "bg-white/90 text-black hover:bg-white"
                : "bg-white/20 text-white/60 cursor-not-allowed"
            }`}
            aria-disabled={!isValid}
          >
            Создать план
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Отмена
          </button>
        </div>
      </header>

      {/* Форма */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate();
        }}
        noValidate
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4"
      >
        <div className="grid gap-3 md:grid-cols-2 min-w-0">
          <div className="grid gap-2 min-w-0">
            <label className="text-sm text-white/70">Название плана *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => setErrors(computeErrors(form))}
              placeholder="Напр., «Q4 Promo 2025»"
              className={`w-full min-w-0 rounded-lg bg-white/5 border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20 ${
                (errors.name || liveErrors.name) ? "border-rose-400/60" : "border-white/15"
              }`}
              aria-invalid={!!(errors.name || liveErrors.name)}
            />
            {(errors.name || liveErrors.name) && (
              <div className="text-xs text-rose-300">{errors.name || liveErrors.name}</div>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70">Статус</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
                className="h-4 w-4 accent-white"
              />
              Активен
            </label>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70">Дата начала</label>
            <input
              type="date"
              value={form.dateFrom}
              onChange={(e) => set("dateFrom", e.target.value)}
              onBlur={() => setErrors(computeErrors(form))}
              className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20 ${
                (errors.dateFrom || liveErrors.dateFrom) ? "border-rose-400/60" : "border-white/15"
              }`}
              aria-invalid={!!(errors.dateFrom || liveErrors.dateFrom)}
            />
            {(errors.dateFrom || liveErrors.dateFrom) && (
              <div className="text-xs text-rose-300">{errors.dateFrom || liveErrors.dateFrom}</div>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70">Дата окончания</label>
            <input
              type="date"
              value={form.dateTo}
              onChange={(e) => set("dateTo", e.target.value)}
              onBlur={() => setErrors(computeErrors(form))}
              className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20 ${
                (errors.dateTo || liveErrors.dateTo) ? "border-rose-400/60" : "border-white/15"
              }`}
              aria-invalid={!!(errors.dateTo || liveErrors.dateTo)}
            />
            {(errors.dateTo || liveErrors.dateTo) && (
              <div className="text-xs text-rose-300">{errors.dateTo || liveErrors.dateTo}</div>
            )}
          </div>

          {/* Пресеты дат */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-white/60">Пресеты:</span>
              <button
                type="button"
                onClick={() => setPreset("today+30")}
                className="rounded-md border border-white/20 px-2 py-1 hover:bg-white/10"
              >
                Сегодня → +30 дней
              </button>
              <button
                type="button"
                onClick={() => setPreset("qtr")}
                className="rounded-md border border-white/20 px-2 py-1 hover:bg-white/10"
              >
                Текущий квартал
              </button>
            </div>
          </div>

          <div className="md:col-span-2 grid gap-2 min-w-0">
            <label className="text-sm text-white/70">Заметки</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="w-full min-w-0 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Кратко опишите назначение плана, исключения и пр."
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full sm:w-auto rounded-lg px-3 py-2 text-sm transition ${
              isValid
                ? "bg-white/90 text-black hover:bg-white"
                : "bg-white/20 text-white/60 cursor-not-allowed"
            }`}
          >
            Создать план
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Отмена
          </button>
        </div>
      </form>

      {/* Заглушка редактора правил */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
        <div className="text-sm text-white/70 mb-2">Правила комиссий (демо)</div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70 break-words">
          Конструктор правил не подключён в демо. После «Создать план» вы вернётесь к списку.
        </div>
      </section>

      {/* Полоса аудита (демо) */}
      <div className="text-xs text-white/50 break-words whitespace-normal">
        Будет создано демо-действие: пользователь{" "}
        <span className="break-all">admin@example.com</span> •{" "}
        <span suppressHydrationWarning className="break-words">
          {clientTime || "—"}
        </span>
      </div>
    </div>
  );
}