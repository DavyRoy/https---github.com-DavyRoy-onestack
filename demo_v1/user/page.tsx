"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Panel } from "../ui/DemoCards";
import { Modal } from "../ui/Modal";
import {
  Wallet,
  ClipboardList,
  Receipt,
  Store,
  Headset,
  UserCog,
  FileDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

/* -------------------------------- demo data ------------------------------- */

type OrderRow = {
  id: string;
  name: string;
  status: "Отменён" | "Заказан" | "Ждёт действий" | "В работе" | "Готово";
  updated: string;
  owner?: string;
};

const ORDERS: OrderRow[] = [
  { id: "ORD-2031", name: "Подписка PRO · сентябрь", status: "В работе", updated: "сегодня", owner: "Иван" },
  { id: "ORD-2029", name: "Кейс для ноутбука",       status: "Готово",    updated: "вчера",  owner: "Ольга" },
  { id: "ORD-2027", name: "Импорт CSV",              status: "Ждёт действий", updated: "вчера" },
  { id: "ORD-2026", name: "Смена тарифа",            status: "Заказан",   updated: "2 дн. назад" },
  { id: "ORD-2023", name: "Сброс 2FA",               status: "Отменён",   updated: "3 дн. назад" },
  { id: "ORD-2019", name: "Акт сверки",              status: "Готово",    updated: "неделю назад" },
  { id: "ORD-2017", name: "Экспорт отчёта",          status: "В работе",  updated: "неделю назад", owner: "Андрей" },
];

type Payment = {
  id: string;
  title: string;
  amount: string;
  orderDate: string;
  doneDate: string;
  owner: string;
};
const PAYMENTS: Payment[] = [
  { id: "pay_4101", title: "Подписка PRO · сентябрь", amount: "4 990 ₽", orderDate: "сегодня", doneDate: "сегодня", owner: "billing@demo" },
  { id: "pay_4095", title: "Покупка: чехол MacBook",  amount: "2 490 ₽", orderDate: "вчера",   doneDate: "вчера",   owner: "olga@demo" },
  { id: "pay_4082", title: "Автоплатёж · август",     amount: "4 990 ₽", orderDate: "2 дн. назад", doneDate: "2 дн. назад", owner: "system" },
  { id: "pay_4060", title: "Счет за доставку",        amount: "1 190 ₽", orderDate: "3 дн. назад", doneDate: "3 дн. назад", owner: "courier@demo" },
  { id: "pay_4048", title: "Подписка PRO · август",   amount: "4 990 ₽", orderDate: "месяц назад", doneDate: "месяц назад", owner: "billing@demo" },
  { id: "pay_4021", title: "Акт сверки",              amount: "0 ₽",     orderDate: "месяц назад", doneDate: "месяц назад", owner: "fin@demo" },
  { id: "pay_3998", title: "Счет №3998",              amount: "7 300 ₽", orderDate: "2 мес. назад", doneDate: "2 мес. назад", owner: "fin@demo" },
];

// распределение статусов для диаграммы
const STATUS_COLORS: Record<OrderRow["status"], string> = {
  "Отменён": "#EF4444",
  "Заказан": "#60A5FA",
  "Ждёт действий": "#F59E0B",
  "В работе": "#A78BFA",
  "Готово": "#34D399",
};

/* ------------------------------- small pieces ----------------------------- */

function StatBig({
  icon,
  title,
  value,
  hint,
  clickable,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint?: string;
  clickable?: boolean;
  onClick?: () => void;
}) {
  const isClickable = Boolean(clickable && onClick);
  const cls = `relative rounded-2xl border border-white/10 bg-[#0e0f10] p-5 sm:p-6 ${
    isClickable ? "transition hover:bg-white/[0.06] cursor-pointer" : ""
  }`;

  const onKey = (e: React.KeyboardEvent) => {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cls}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={onKey}
      aria-label={isClickable ? title : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/60">{title}</div>
          <div className="mt-2 text-4xl font-extrabold tabular-nums">{value}</div>
          {hint && <div className="mt-1 text-xs text-white/60">{hint}</div>}
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/8 border border-white/10">
          {icon}
        </span>
      </div>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: OrderRow["status"] }) {
  const map: Record<OrderRow["status"], string> = {
    "Отменён": "border-rose-400/30 bg-rose-400/10 text-rose-200",
    "Заказан": "border-sky-400/30 bg-sky-400/10 text-sky-200",
    "Ждёт действий": "border-amber-400/30 bg-amber-400/10 text-amber-200",
    "В работе": "border-violet-400/30 bg-violet-400/10 text-violet-200",
    "Готово": "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${map[tone]}`}>
      {children}
    </span>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function UserDashboardPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [payModal, setPayModal] = useState<Payment | null>(null);
  const [cta, setCta] = useState<null | { title: string; icon: React.ReactNode }>(null);

  const pieData = useMemo(() => {
    const map = new Map<OrderRow["status"], number>();
    ORDERS.forEach((o) => map.set(o.status, (map.get(o.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Кабинет клиента · Демо</h1>
          <p className="mt-1 text-white/70">Пользовательский дашборд: баланс, заявки, платежи и анализ.</p>
        </div>

        {/* верхняя тройка */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatBig icon={<Wallet className="h-6 w-6" />} title="Баланс" value="12 450 ₽" hint="включая бонусы" />
          <StatBig
            icon={<ClipboardList className="h-6 w-6" />}
            title="Активные заявки"
            value={String(ORDERS.filter((o) => o.status === "В работе" || o.status === "Ждёт действий").length)}
            hint="открытые и требующие действий"
            clickable
            onClick={() => router.push("/demo/user/orders?status=open")}
          />
          <StatBig
            icon={<Receipt className="h-6 w-6" />}
            title="Счета к оплате"
            value="1"
            hint="срок — 3 дня"
            clickable
            onClick={() => router.push("/demo/user/orders#billing")}
          />
        </div>

        {/* История заказов */}
        <Panel title="История заказов (последние 7)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">История последних заказов</caption>
              <thead>
                <tr className="text-left text-white/60">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Название</th>
                  <th className="py-2 pr-4">Статус</th>
                  <th className="py-2 pr-4">Ответственный</th>
                  <th className="py-2 pr-4">Обновлено</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {ORDERS.slice(0, 7).map((o) => (
                  <tr key={o.id}>
                    <td className="py-2 pr-4">{o.id}</td>
                    <td className="py-2 pr-4">{o.name}</td>
                    <td className="py-2 pr-4"><Badge tone={o.status}>{o.status}</Badge></td>
                    <td className="py-2 pr-4">{o.owner || "—"}</td>
                    <td className="py-2 pr-4 text-white/60">{o.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* История платежей + Аналитика */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Panel title="История платежей">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">История последних платежей</caption>
                <thead>
                  <tr className="text-left text-white/60">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Описание</th>
                    <th className="py-2 pr-4">Сумма</th>
                    <th className="py-2 pr-4">Когда</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {PAYMENTS.slice(0, 7).map((p) => (
                    <tr
                      key={p.id}
                      className="cursor-pointer hover:bg-white/[0.04] outline-none"
                      onClick={() => setPayModal(p)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Открыть платёж ${p.id}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPayModal(p);
                        }
                      }}
                    >
                      <td className="py-2 pr-4 font-mono text-[12px]">{p.id}</td>
                      <td className="py-2 pr-4">{p.title}</td>
                      <td className="py-2 pr-4">{p.amount}</td>
                      <td className="py-2 pr-4 text-white/60">{p.doneDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Аналитика заказов (по статусам)">
            <div className="relative h-64 flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.9)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 12,
                        color: "white",
                      }}
                      formatter={(v: number, n: string) => [`${v}`, n]}
                    />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={2}
                      stroke="rgba(255,255,255,0.25)"
                    >
                      {pieData.map((s, i) => (
                        <Cell key={i} fill={STATUS_COLORS[s.name as OrderRow["status"]]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] animate-pulse" />
              )}
              <div className="absolute text-center">
                <div className="text-[11px] uppercase tracking-widest text-white/60">Всего</div>
                <div className="text-2xl font-extrabold">{ORDERS.length}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {pieData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ background: STATUS_COLORS[s.name as OrderRow["status"]] }} />
                  <span className="truncate">{s.name}</span>
                  <span className="ml-auto tabular-nums">{s.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Быстрые действия как было */}
        <Panel title="Быстрые действия">
          {/* ...без изменений... */}
        </Panel>
      </div>

      {/* модалки (#5, #7) как было */}
      <Modal open={!!payModal} title={payModal ? `Платёж • ${payModal.id}` : ""} onClose={() => setPayModal(null)} footer={<div className="text-xs text-white/70">Демо-платежи не проводят списания. Полный биллинг — в проде.</div>}>
        {payModal && (
          <div className="space-y-2 text-sm">
            <Row k="ID" v={payModal.id} mono />
            <Row k="Описание" v={payModal.title} />
            <Row k="Сумма" v={payModal.amount} />
            <Row k="Дата заказа" v={payModal.orderDate} />
            <Row k="Дата выполнения" v={payModal.doneDate} />
            <Row k="Ответственный" v={payModal.owner} />
            <div className="mt-3 text-xs text-white/60">Посмотреть все платежи можно в разделе «Профиль → Биллинг».</div>
          </div>
        )}
      </Modal>

      <Modal open={!!cta} title={cta ? cta.title : ""} onClose={() => setCta(null)} footer={<div className="text-xs text-white/70">Это демонстрационный экран. Больше функций — в веб-приложении и мобильных клиентах.</div>}>
        {/* ...контент как был... */}
      </Modal>
    </>
  );
}

/* --------------------------------- helpers -------------------------------- */

function Row({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-white/60">{k}</div>
      <div className={mono ? "font-mono text-[13px]" : ""}>{v}</div>
    </div>
  );
}