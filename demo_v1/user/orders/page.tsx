"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Panel } from "../../ui/DemoCards";
import { Modal } from "../../ui/Modal";
import {
  Search,
  Filter,
  Receipt,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

/* ---------------------------------- data ---------------------------------- */

type OrderStatus = "Новый" | "Ждёт действий" | "В работе" | "Готово" | "Отменён";

type Order = {
  id: string;
  title: string;
  status: OrderStatus;
  created: string;
  updated: string;
  owner?: string;
  total?: string;
  notes?: string;
};

type Invoice = {
  id: string;
  orderId?: string;
  title: string;
  amount: string;
  due: string;
  status: "к оплате" | "оплачен" | "просрочен";
};

const ORDERS: Order[] = [
  { id: "ORD-2031", title: "Подписка PRO · сентябрь", status: "В работе", updated: "сегодня", created: "3 дн. назад", owner: "Иван", total: "4 990 ₽" },
  { id: "ORD-2030", title: "Экспорт отчёта", status: "Ждёт действий", updated: "сегодня", created: "вчера", notes: "Нужна авторизация SSO" },
  { id: "ORD-2029", title: "Кейс для ноутбука", status: "Готово", updated: "вчера", created: "вчера", total: "2 490 ₽", owner: "Ольга" },
  { id: "ORD-2028", title: "Смена тарифа", status: "Новый", updated: "вчера", created: "вчера" },
  { id: "ORD-2026", title: "Сброс 2FA", status: "Отменён", updated: "3 дн. назад", created: "4 дн. назад" },
];

const INVOICES: Invoice[] = [
  { id: "inv_5011", orderId: "ORD-2031", title: "Подписка PRO · сентябрь", amount: "4 990 ₽", due: "3 дня", status: "к оплате" },
  { id: "inv_4994", orderId: "ORD-2029", title: "Кейс для ноутбука", amount: "2 490 ₽", due: "—", status: "оплачен" },
  { id: "inv_4988", title: "Доставка №4988", amount: "1 190 ₽", due: "просрочен 2 дн.", status: "просрочен" },
];

/* --------------------------------- helpers -------------------------------- */

const STATUS_BADGE: Record<OrderStatus, string> = {
  "Новый": "border-sky-400/30 bg-sky-400/10 text-sky-200",
  "Ждёт действий": "border-amber-400/30 bg-amber-400/10 text-amber-200",
  "В работе": "border-violet-400/30 bg-violet-400/10 text-violet-200",
  "Готово": "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  "Отменён": "border-rose-400/30 bg-rose-400/10 text-rose-200",
};

function StatusPill({ s }: { s: OrderStatus }) {
  const Icon =
    s === "Готово" ? CheckCircle2 :
    s === "Отменён" ? XCircle :
    s === "Ждёт действий" ? Clock : ClipboardList;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${STATUS_BADGE[s]}`}>
      <Icon className="h-3.5 w-3.5" />
      {s}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="py-2 pr-4">
          <div className="h-4 w-24 rounded bg-white/10" />
        </td>
      ))}
    </tr>
  );
}

/* ---------- Suspense wrapper to satisfy useSearchParams requirement -------- */

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white/70">Загрузка…</div>}>
      <UserOrdersPage />
    </Suspense>
  );
}

/* ---------------------------------- page ---------------------------------- */

function UserOrdersPage() {
  const router = useRouter();
  const search = useSearchParams();
  const pathname = usePathname();

  const initialTab: "orders" | "billing" =
    typeof window !== "undefined" && window.location.hash === "#billing" ? "billing" : "orders";
  const [tab, setTab] = useState<"orders" | "billing">(initialTab);

  const initialStatus = (search.get("status") as string) || "all";
  const [status, setStatus] = useState<"all" | "open" | OrderStatus>(initialStatus as any);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [openedOrder, setOpenedOrder] = useState<Order | null>(null);
  const [openedInv, setOpenedInv] = useState<Invoice | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    const params = new URLSearchParams(search.toString());
    if (status === "all") params.delete("status");
    else params.set("status", String(status));
    const hash = tab === "billing" ? "#billing" : "";
    router.replace(`${pathname}?${params.toString()}${hash}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tab]);

  const filteredOrders = useMemo(() => {
    setLoading(true);
    const arr = ORDERS.filter((o) => {
      const okStatus =
        status === "all"
          ? true
          : status === "open"
          ? o.status === "В работе" || o.status === "Ждёт действий"
          : o.status === status;
      const okQ =
        !debouncedQ ||
        o.id.toLowerCase().includes(debouncedQ) ||
        o.title.toLowerCase().includes(debouncedQ);
      return okStatus && okQ;
    });
    setTimeout(() => setLoading(false), 500); // имитация задержки
    return arr;
  }, [status, debouncedQ]);

  const onRowKey = (e: React.KeyboardEvent, open: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-white/70" />
          <div>
            <div className="text-3xl font-extrabold leading-tight">Заказы</div>
            <p className="mt-1 text-white/70">Заявки и счета. Фильтрация и поиск.</p>
          </div>
        </div>
        <div role="tablist" aria-label="Разделы" className="inline-flex rounded-full border border-white/10 p-1 bg-white/[0.03]">
          {["orders", "billing"].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                tab === t ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.2)]" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {t === "orders" ? "Заявки" : "Счета"}
            </button>
          ))}
        </div>
      </div>

      {tab === "orders" ? (
        <>
          <Panel title="Фильтры">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Поиск по ID или названию…"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 outline-none placeholder:text-white/40"
                />
              </div>
              <div className="flex flex-wrap gap-2 overflow-x-auto">
                {(["all", "open", "Новый", "Ждёт действий", "В работе", "Готово", "Отменён"] as const).map((s) => {
                  const active = status === s;
                  const label = s === "all" ? "Все" : s === "open" ? "Открытые" : s;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatus(s as any)}
                      className={`rounded-full px-4 py-2 text-sm border transition ${
                        active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"
                      }`}
                      aria-pressed={active}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>

          {/* table / cards */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" /> Найдено: {filteredOrders.length}
            </div>
            <div className="overflow-x-auto hidden sm:block">
              <table className="min-w-[860px] w-full text-sm">
                <thead className="sticky top-0 bg-black/30 backdrop-blur-md">
                  <tr className="text-left text-white/60">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Название</th>
                    <th className="py-2 pr-4">Статус</th>
                    <th className="py-2 pr-4">Ответственный</th>
                    <th className="py-2 pr-4">Создан</th>
                    <th className="py-2 pr-4">Обновлено</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                  {!loading &&
                    filteredOrders.map((o) => (
                      <tr
                        key={o.id}
                        className="hover:bg-white/[0.04] transition cursor-pointer"
                        onClick={() => setOpenedOrder(o)}
                        onKeyDown={(e) => onRowKey(e, () => setOpenedOrder(o))}
                        tabIndex={0}
                      >
                        <td className="py-2 pr-4 font-mono text-[12px]">{o.id}</td>
                        <td className="py-2 pr-4">{o.title}</td>
                        <td className="py-2 pr-4"><StatusPill s={o.status} /></td>
                        <td className="py-2 pr-4">{o.owner || "—"}</td>
                        <td className="py-2 pr-4 text-white/60">{o.created}</td>
                        <td className="py-2 pr-4 text-white/60">{o.updated}</td>
                      </tr>
                    ))}
                  {!loading && filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-white/60">Ничего не найдено</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <div className="sm:hidden divide-y divide-white/10">
              {filteredOrders.map((o) => (
                <div key={o.id} className="p-4 space-y-2 hover:bg-white/[0.04] transition" onClick={() => setOpenedOrder(o)}>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs">{o.id}</span>
                    <StatusPill s={o.status} />
                  </div>
                  <div className="font-semibold">{o.title}</div>
                  <div className="text-xs text-white/60">Создан: {o.created} • Обновлено: {o.updated}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Panel title="Счета">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="sticky top-0 bg-black/30 backdrop-blur-md">
                <tr className="text-left text-white/60">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Заказ</th>
                  <th className="py-2 pr-4">Описание</th>
                  <th className="py-2 pr-4">Сумма</th>
                  <th className="py-2 pr-4">Статус</th>
                  <th className="py-2 pr-4">Срок</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {INVOICES.map((i) => (
                  <tr
                    key={i.id}
                    className="hover:bg-white/[0.04] transition cursor-pointer"
                    onClick={() => setOpenedInv(i)}
                  >
                    <td className="py-2 pr-4 font-mono text-[12px]">{i.id}</td>
                    <td className="py-2 pr-4">{i.orderId || "—"}</td>
                    <td className="py-2 pr-4">{i.title}</td>
                    <td className="py-2 pr-4">{i.amount}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
                        i.status === "оплачен"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                          : i.status === "просрочен"
                          ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
                          : "border-amber-400/30 bg-amber-400/10 text-amber-200"
                      }`}>
                        <Receipt className="h-3.5 w-3.5" />
                        {i.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-white/60">{i.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Order modal */}
      <Modal
        open={!!openedOrder}
        onClose={() => setOpenedOrder(null)}
        title={openedOrder ? `Заявка • ${openedOrder.id}` : ""}
        footer={
          <div className="flex justify-between w-full text-xs text-white/70">
            <div>Демо: действия отключены</div>
            <div className="flex gap-2">
              <button disabled className="rounded-full bg-white/20 px-3 py-1.5 text-xs">Изменить</button>
              <button disabled className="rounded-full bg-white/20 px-3 py-1.5 text-xs">Отменить</button>
            </div>
          </div>
        }
      >
        {openedOrder && (
          <div className="space-y-2 text-sm">
            <KV k="Название" v={openedOrder.title} />
            <KV k="Статус" v={<StatusPill s={openedOrder.status} />} />
            <KV k="Ответственный" v={openedOrder.owner || "—"} />
            <KV k="Сумма" v={openedOrder.total || "—"} />
            <KV k="Создан" v={openedOrder.created} />
            <KV k="Обновлено" v={openedOrder.updated} />
            {openedOrder.notes && <KV k="Примечание" v={openedOrder.notes} />}
          </div>
        )}
      </Modal>

      {/* Invoice modal */}
      <Modal
        open={!!openedInv}
        onClose={() => setOpenedInv(null)}
        title={openedInv ? `Счёт • ${openedInv.id}` : ""}
        footer={<div className="text-xs text-white/70">Это демо. Оплата недоступна.</div>}
      >
        {openedInv && (
          <div className="space-y-2 text-sm">
            <KV k="Заказ" v={openedInv.orderId || "—"} />
            <KV k="Описание" v={openedInv.title} />
            <KV k="Сумма" v={openedInv.amount} />
            <KV k="Статус" v={
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
                  openedInv.status === "оплачен"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : openedInv.status === "просрочен"
                    ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
                    : "border-amber-400/30 bg-amber-400/10 text-amber-200"
                }`}
              >
                <Receipt className="h-3.5 w-3.5" />
                {openedInv.status}
              </span>
            } />
            <KV k="Срок" v={openedInv.due} />
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ------------------------------- small KV row ------------------------------ */

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-white/60">{k}</div>
      <div>{v}</div>
    </div>
  );
}