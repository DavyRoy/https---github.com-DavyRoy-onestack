// src/app/demo/manager/payments/new-invoice/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Save } from "lucide-react";
import type { Invoice } from "../data/mockPayments";
import { upsertInvoice } from "../data/storage";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm",
  input:
    "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40",
  btn: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
  btnPrimary:
    "rounded-xl bg-white px-3 py-2 text-sm text-black hover:bg-white/90",
};

type Currency = "RUB" | "USD" | "KRW";
type Line = { id: string; title: string; qty: number; price: number };

const fmt = (n: number) => n.toLocaleString("ru-RU");
const clampPos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const todayStr = () => new Date().toISOString().slice(0, 10);
const genId = () =>
  `INV-${todayStr().replaceAll("-", "")}-${Math.floor(Math.random() * 900 + 100)}`;

export default function NewInvoicePage() {
  const router = useRouter();

  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState<Currency>("RUB");
  const [lines, setLines] = useState<Line[]>([
    { id: "l1", title: "", qty: 1, price: 0 },
  ]);

  // Сумма с защитой от NaN/отрицательных значений
  const total = useMemo(
    () =>
      lines.reduce((s, it) => {
        const qty = clampPos(Number(it.qty));
        const price = clampPos(Number(it.price));
        return s + qty * price;
      }, 0),
    [lines]
  );

  const addLine = useCallback(
    () =>
      setLines((xs) => [
        ...xs,
        { id: "l" + (xs.length + 1), title: "", qty: 1, price: 0 },
      ]),
    []
  );

  const setLine = useCallback((id: string, patch: Partial<Line>) => {
    setLines((xs) => xs.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((xs) => xs.filter((l) => l.id !== id));
  }, []);

  const canCreate = client.trim().length > 0 && total > 0;

  const create = (markSent = false) => {
    if (!canCreate) {
      toast.error("Заполните клиента и добавьте позиции с суммой > 0");
      return;
    }
    const id = genId();
    const createdAt = new Date();
    const dueAt = new Date(createdAt);
    dueAt.setDate(dueAt.getDate() + 7);

    const inv: Invoice = {
      id,
      createdAt: createdAt.toISOString(),
      dueAt: dueAt.toISOString(),
      client: client.trim(),
      currency,
      items: lines.map((l, i) => ({
        id: `i${i + 1}`,
        title: (l.title || `Позиция ${i + 1}`).trim(),
        qty: clampPos(Number(l.qty)) || 1,
        price: clampPos(Number(l.price)) || 0,
      })),
      status: markSent ? "sent" : "draft",
      email: email.trim() || undefined,
      total,
    };

    upsertInvoice(inv);
    toast.success(markSent ? "Счёт создан и отправлен (демо)" : "Счёт создан (демо)");
    router.push(`/demo/manager/payments/invoices/${id}`);
  };

  // Enter на странице не должен случайно сабмитить — контролируем кнопкой
  useEffect(() => {
    const onEnter = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === "NumpadEnter") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        create(false);
      }
    };
    window.addEventListener("keydown", onEnter);
    return () => window.removeEventListener("keydown", onEnter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canCreate, client, lines, currency, email]);

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/demo/manager/payments/invoices"
              className={T.btn}
              aria-label="Назад к счетам"
            >
              <ArrowLeft width={16} height={16} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold">Новый счёт</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={T.btn}
              onClick={() => create(true)}
              disabled={!canCreate}
              aria-disabled={!canCreate}
              title="Создать и отправить (демо)"
            >
              <Save width={16} height={16} /> Создать и отправить
            </button>
            <button
              className={T.btnPrimary}
              onClick={() => create(false)}
              disabled={!canCreate}
              aria-disabled={!canCreate}
              title="Создать (демо)"
            >
              <Save width={16} height={16} /> Создать
            </button>
          </div>
        </div>
      </header>

      <section className={T.card}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs text-white/70">Клиент</span>
            <input
              className={T.input}
              placeholder="Название компании / Имя"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              aria-label="Клиент"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-white/70">Email (опционально)</span>
            <input
              className={T.input}
              type="email"
              inputMode="email"
              placeholder="billing@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email получателя"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-white/70">Валюта</span>
            <select
              className={T.input}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Валюта счёта"
            >
              <option value="RUB">RUB</option>
              <option value="USD">USD</option>
              <option value="KRW">KRW</option>
            </select>
          </label>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium">Позиции</div>
          <div className="mt-2 grid gap-2">
            {lines.map((l) => (
              <div
                key={l.id}
                className="grid gap-2 md:grid-cols-[1fr_120px_140px_auto]"
              >
                <input
                  className={T.input}
                  placeholder="Наименование"
                  value={l.title}
                  onChange={(e) => setLine(l.id, { title: e.target.value })}
                  aria-label="Наименование позиции"
                />
                <input
                  className={T.input}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  placeholder="Кол-во"
                  value={l.qty}
                  onChange={(e) =>
                    setLine(l.id, { qty: clampPos(Number(e.target.value)) })
                  }
                  aria-label="Количество"
                />
                <input
                  className={T.input}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="Цена"
                  value={l.price}
                  onChange={(e) =>
                    setLine(l.id, { price: clampPos(Number(e.target.value)) })
                  }
                  aria-label="Цена"
                />
                <div className="flex items-center gap-2">
                  <div className="tabular-nums text-sm">
                    {fmt(clampPos(l.qty) * clampPos(l.price))} {currency}
                  </div>
                  <button
                    className={T.btn}
                    onClick={() => removeLine(l.id)}
                    aria-label="Удалить позицию"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}

            <button
              className={T.btn + " w-fit"}
              onClick={addLine}
              aria-label="Добавить строку"
            >
              <Plus width={16} height={16} /> Добавить строку
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-white/70">Итого</div>
          <div className="text-lg font-semibold tabular-nums">
            {fmt(total)} {currency}
          </div>
        </div>
      </section>
    </div>
  );
}