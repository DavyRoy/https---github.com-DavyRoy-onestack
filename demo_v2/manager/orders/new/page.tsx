"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { Order, OrderItem } from "@/app/demo/manager/orders/data/mockOrders";

export default function NewOrderWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // 1) Клиент (демо)
  const [client, setClient] = useState({
    id: "cl-7001",
    name: "Иван Петров",
    email: "ivan@example.com",
  });

  // 2) Позиции
  const [items, setItems] = useState<OrderItem[]>([
    { id: "p-1", title: "Шампунь Pro", qty: 1, price: 990 },
  ]);
  const addItem = () =>
    setItems((s) => [
      ...s,
      {
        id: "x" + (s.length + 1),
        title: "Новая позиция",
        qty: 1,
        price: 1000,
      },
    ]);
  const total = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.price, 0),
    [items]
  );

  // 3) Получение
  const [delivery, setDelivery] = useState<"pickup" | "courier">("pickup");

  // 4) Оплата (демо)
  const [payMethod, setPayMethod] = useState<"card" | "invoice">("card");
  const [simulateOk, setSimulateOk] = useState(true);

  const createOrder = () => {
    const id = "O-" + String(Math.floor(Date.now() / 1000)).slice(-4); // детерминированно для демо
    const row: Order = {
      id,
      createdAt: new Date().toISOString(),
      customer: { id: client.id, name: client.name, email: client.email },
      items: items.map((i) => ({ ...i })),
      amount: total,
      status: simulateOk && payMethod === "card" ? "paid" : "confirmed",
      channel: "manager",
      owner: "Мария",
      shipping: {
        type: delivery,
        address: delivery === "courier" ? "Москва, Тверская, 1" : undefined,
        slot: "завтра 12:00",
      },
    };
    toast.success("Заказ создан");
    if (row.status === "paid") toast.success("Оплата принята (демо)");
    router.replace(`/demo/manager/orders/${row.id}`);
  };

  return (
    <div className="grid gap-6">
      <header className={T.hero} aria-labelledby="order-new-title">
        <nav
          className="flex items-center gap-1 text-xs text-white/70"
          aria-label="Хлебные крошки"
        >
          <Link
            href="/demo/manager/dashboard"
            prefetch={false}
            className="inline-flex items-center gap-1 hover:underline"
          >
            <Home width={14} height={14} /> Дашборд
          </Link>
          <span className="opacity-40" aria-hidden>
            /
          </span>
          <Link href="/demo/manager/orders" prefetch={false} className="hover:underline">
            Заказы
          </Link>
          <span className="opacity-40" aria-hidden>
            /
          </span>
          <span className="text-white/80" aria-current="page">
            Новый заказ
          </span>
        </nav>
        <h1
          id="order-new-title"
          className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight"
        >
          Новый заказ
        </h1>
        <p className={"mt-1 text-sm " + T.dim}>Демо-мастер из 4 шагов</p>
      </header>

      <section className={T.card + " grid gap-4"}>
        <Steps step={step} setStep={setStep} />

        {/* Шаг 1: Клиент */}
        {step === 1 && (
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="Клиент (демо)"
              value={client.name}
              onChange={(v) => setClient((c) => ({ ...c, name: v }))}
              autoComplete="name"
            />
            <Field
              label="Email"
              type="email"
              value={client.email}
              onChange={(v) => setClient((c) => ({ ...c, email: v }))}
              autoComplete="email"
            />
          </div>
        )}

        {/* Шаг 2: Позиции */}
        {step === 2 && (
          <div className="grid gap-3">
            <div className="grid gap-2">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="grid gap-2
                             sm:grid-cols-2
                             md:grid-cols-[1fr_110px_130px_auto]"
                >
                  <input
                    className={T.input}
                    value={it.title}
                    onChange={(e) =>
                      setItems((s) =>
                        s.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x))
                      )
                    }
                    placeholder="Название позиции"
                    aria-label={`Позиция ${idx + 1}: название`}
                  />
                  <input
                    className={T.input}
                    value={it.qty}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    onChange={(e) =>
                      setItems((s) =>
                        s.map((x, i) =>
                          i === idx ? { ...x, qty: Math.max(1, Number(e.target.value || 1)) } : x
                        )
                      )
                    }
                    placeholder="Кол-во"
                    aria-label={`Позиция ${idx + 1}: количество`}
                  />
                  <input
                    className={T.input}
                    value={it.price}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    onChange={(e) =>
                      setItems((s) =>
                        s.map((x, i) =>
                          i === idx ? { ...x, price: Math.max(0, Number(e.target.value || 0)) } : x
                        )
                      )
                    }
                    placeholder="Цена"
                    aria-label={`Позиция ${idx + 1}: цена`}
                  />
                  <div
                    className="self-center text-sm tabular-nums text-right md:text-left"
                    aria-label={`Итого по позиции ${idx + 1}`}
                  >
                    {(it.qty * it.price).toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button className="btn w-full sm:w-auto" onClick={addItem}>
                Добавить позицию
              </button>
              <div className="text-right sm:text-left text-lg font-semibold">
                Итого:{" "}
                <span className="tabular-nums">{total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3: Получение */}
        {step === 3 && (
          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label="Получение"
              value={delivery}
              onChange={(v) => setDelivery(v as any)}
              options={[
                { id: "pickup", label: "Самовывоз" },
                { id: "courier", label: "Курьер" },
              ]}
            />
            <Field
              label="Адрес (для курьера)"
              value={delivery === "courier" ? "Москва, Тверская, 1" : ""}
              onChange={() => {}}
              disabled={delivery !== "courier"}
              placeholder="Город, улица, дом"
            />
            <Field
              label="Слот"
              value={"завтра 12:00"}
              onChange={() => {}}
              placeholder="Когда забрать/доставить"
            />
          </div>
        )}

        {/* Шаг 4: Оплата */}
        {step === 4 && (
          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label="Оплата (демо)"
              value={payMethod}
              onChange={(v) => setPayMethod(v as any)}
              options={[
                { id: "card", label: "Карта (демо)" },
                { id: "invoice", label: "Счёт (демо)" },
              ]}
            />
            <label className="grid gap-1">
              <span className="text-xs text-white/70">Смоделировать</span>
              <select
                className={T.input}
                value={simulateOk ? "ok" : "err"}
                onChange={(e) => setSimulateOk(e.target.value === "ok")}
                aria-label="Симуляция результата оплаты"
              >
                <option value="ok">Успех</option>
                <option value="err">Ошибка</option>
              </select>
            </label>
            <div className="self-end text-right md:text-left">
              <div className="text-sm text-white/70">К оплате</div>
              <div className="text-lg font-semibold tabular-nums">
                {total.toLocaleString("ru-RU")} ₽
              </div>
            </div>
          </div>
        )}

        {/* Навигация по шагам: на мобиле кнопки на всю ширину */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="btn w-full sm:w-auto"
            disabled={step === 1}
            onClick={() => setStep((s) => (s - 1) as any)}
          >
            Назад
          </button>

          {step < 4 ? (
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => setStep((s) => (s + 1) as any)}
            >
              Далее
            </button>
          ) : (
            <button className="btn btn-primary w-full sm:w-auto" onClick={createOrder}>
              Создать заказ
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function Steps({
  step,
  setStep,
}: {
  step: 1 | 2 | 3 | 4;
  setStep: (s: 1 | 2 | 3 | 4) => void;
}) {
  const items = ["Клиент", "Позиции", "Получение", "Оплата"];
  return (
    <div
      className="flex gap-2 overflow-x-auto"
      role="tablist"
      aria-label="Шаги создания заказа"
    >
      {items.map((t, i) => {
        const active = step === (i + 1);
        return (
          <button
            key={t}
            role="tab"
            aria-selected={active}
            onClick={() => setStep((i + 1) as any)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
              active
                ? "border-white bg-white text-black"
                : "border-white/15 bg-white/10 hover:bg-white/15",
            ].join(" ")}
          >
            <span className="tabular-nums">{i + 1}</span> <span>{t}</span>
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "email";
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      <input
        className={T.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      <select
        className={T.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}