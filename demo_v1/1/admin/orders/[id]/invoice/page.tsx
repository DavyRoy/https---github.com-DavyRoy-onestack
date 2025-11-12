"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import * as Lucide from "lucide-react";
import { ADMIN_ORDERS, AdminOrder } from "@/app/demo/admin/orders/data/mockAdminOrders";

/* -------------------- утилиты -------------------- */

function fmtPrice(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

const LS_VAT_RATE = "invoice.vat.rate";     // number, напр. 20
const LS_VAT_INCL = "invoice.vat.incl";     // "1" | "0" (цены включают НДС)

/** Реквизиты продавца (демо) */
const SELLER = {
  name: "ООО «Демо-Маркет»",
  inn: "7701234567",
  kpp: "770101001",
  ogrn: "1234567890123",
  address: "125009, г. Москва, ул. Демонстрационная, д. 1, оф. 10",
  phone: "+7 (495) 000-00-00",
  email: "sales@demo-market.ru",
  bank: {
    name: "ПАО «Демобанк» г. Москва",
    bik: "044525000",
    ks: "30101810400000000225",
    rs: "40702810900000001234",
  },
};

/** Расчёт итогов с учётом НДС */
function calcTotals(
  order: AdminOrder,
  vatRatePct: number,       // 0 | 10 | 20 | произвольное
  pricesIncludeVat: boolean // true: price = цена с НДС, false: без НДС
) {
  const items = order.items ?? [];
  const rawSum = items.reduce((s, it: any) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  const rate = Math.max(0, vatRatePct) / 100;

  // База (без НДС) из строк
  const subtotalBase = pricesIncludeVat && rate > 0 ? rawSum / (1 + rate) : rawSum;

  // Скидка из заказа (если явная) — относим к базе
  const discountExplicit = (order as any).discountAmount as number | undefined;
  let discountBase = Math.max(0, discountExplicit ?? 0);

  // Если явной скидки нет, но order.amount отличается от «ожидаемого» итога — считаем скидку из разницы
  if (!discountExplicit) {
    const expectedTaxOnRaw =
      pricesIncludeVat && rate > 0 ? rawSum - rawSum / (1 + rate) : rawSum * rate;
    const expectedTotalOnRaw = pricesIncludeVat ? rawSum : rawSum + expectedTaxOnRaw;
    const amount = Number.isFinite(order.amount) ? order.amount : expectedTotalOnRaw;

    const diff = Math.max(0, expectedTotalOnRaw - amount); // «скидка в итоге»
    discountBase = pricesIncludeVat && rate > 0 ? diff / (1 + rate) : diff;
  }

  // Налог на базе после скидки
  const taxableBase = Math.max(0, subtotalBase - discountBase);
  const vat = rate > 0 ? taxableBase * rate : 0;

  const total = taxableBase + vat;

  return {
    items,
    subtotalBase,
    discountBase,
    vat,
    total,
  };
}

/* -------------------- страница -------------------- */

export default function InvoicePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const order = ADMIN_ORDERS.find((o) => o.id === id);

  // Начальные значения из URL или localStorage
  const urlVat = Number(sp.get("vat"));
  const urlIncl = sp.get("incl"); // "1"|"0"|null

  const [vatRate, setVatRate] = useState<number>(() => {
    if (Number.isFinite(urlVat)) return urlVat;
    try {
      const ls = Number(typeof window !== "undefined" ? localStorage.getItem(LS_VAT_RATE) : NaN);
      return Number.isFinite(ls) ? ls : 20;
    } catch {
      return 20;
    }
  });

  const [inclVat, setInclVat] = useState<boolean>(() => {
    if (urlIncl === "1" || urlIncl === "0") return urlIncl === "1";
    try {
      const ls = typeof window !== "undefined" ? localStorage.getItem(LS_VAT_INCL) : null;
      return ls === null ? true : ls === "1";
    } catch {
      return true;
    }
  });

  // Синхронизация URL и localStorage
  useEffect(() => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    next.set("vat", String(vatRate));
    next.set("incl", inclVat ? "1" : "0");
    try {
      localStorage.setItem(LS_VAT_RATE, String(vatRate));
      localStorage.setItem(LS_VAT_INCL, inclVat ? "1" : "0");
    } catch {}
    router.replace(`?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vatRate, inclVat]);

  // Автопечать при ?print=1
  useEffect(() => {
    if (sp.get("print") === "1") {
      // небольшая задержка, чтобы браузер успел применить стили
      setTimeout(() => window.print(), 120);
    }
  }, [sp]);

  if (!order) {
    return (
      <div className="p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Счёт</h1>
          <Link
            href="/demo/admin/orders"
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            К заказам
          </Link>
        </header>
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          Заказ не найден.
        </div>
      </div>
    );
  }

  const { items, subtotalBase, discountBase, vat, total } = useMemo(
    () => calcTotals(order, vatRate, inclVat),
    [order, vatRate, inclVat]
  );

  return (
    <div className="invoice p-4 md:p-6 print:p-0">
      {/* Стиль печати: A4, компактные отступы и шрифт, ч/б, без UI */}
      <style>{`
        @page { size: A4; margin: 10mm; }
        .invoice .paper { max-width: 190mm; margin: 0 auto; }
        .invoice .invoice-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .invoice .invoice-table th,
        .invoice .invoice-table td { padding: 8px; vertical-align: top; word-break: break-word; }
        .invoice .hr { border-color: rgba(255,255,255,0.12); }

        @media print {
          :root { color-scheme: light; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }

          .invoice { padding: 0 !important; }
          .paper { background: #fff !important; color: #000 !important; box-shadow: none !important; border: none !important; }
          .paper * { color: #000 !important; }
          .muted { color: #000 !important; opacity: 0.85; }

          /* Компактный типографический масштаб под A4 */
          .paper .title { font-size: 18px !important; line-height: 1.2; }
          .paper .subtitle { font-size: 12px !important; }
          .paper .note { font-size: 11px !important; }

          /* Таблица */
          .invoice-table { font-size: 11pt !important; }
          .invoice-table th, .invoice-table td { padding: 6px 8px !important; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }

          /* Границы ч/б */
          .invoice-table th, .invoice-table td { border: 1px solid #000; }
          .invoice-table thead tr { background: #fff !important; }
          .invoice .hr { border-color: #000 !important; }

          /* Убираем скругления и цветные подложки */
          .paper .rounded-xl, .paper .rounded-2xl, .paper .rounded-lg { border-radius: 0 !important; }
          .paper [class*="bg-white"] { background: #fff !important; }
          .paper [class*="border-white"] { border-color: #000 !important; }
        }
      `}</style>

      {/* Панель действий (только на экране) */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-white/70">
          <Link href={`/demo/admin/orders/${order.id}`} className="hover:underline">
            ← К карточке заказа
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Настройки НДС */}
          <label className="flex items-center gap-2 text-sm">
            <span className="text-white/70">НДС, %</span>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(Number(e.target.value))}
              className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-sm outline-none"
              title="Ставка НДС"
            >
              {[0, 10, 20].map((v) => (
                <option key={v} value={v}>{v}%</option>
              ))}
              <option value={vatRate}>Другая…</option>
            </select>
            <input
              type="number"
              className="w-20 rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-sm outline-none"
              value={vatRate}
              onChange={(e) => setVatRate(Math.max(0, Number(e.target.value)))}
              step="1"
              min="0"
              title="Произвольная ставка"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inclVat}
              onChange={(e) => setInclVat(e.target.checked)}
            />
            Цены включают НДС
          </label>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-white px-3 py-1.5 text-sm text-black hover:bg-white/90"
            title="Печать счёта"
          >
            Печать
          </button>
        </div>
      </div>

      {/* Лист бумаги */}
      <div className="paper rounded-2xl border border-white/15 bg-white/5 p-4 md:p-6">
        {/* Шапка */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="title text-2xl font-semibold">СЧЁТ № {order.id}</div>
            <div className="subtitle mt-1 text-sm muted">
              от {order.createdAt} • канал: {order.channel}
            </div>
            <div className="note mt-1 text-xs muted">
              Статус заказа: <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">{order.status}</span>
              {order.paymentId && (
                <> • Платёж: <span>#{order.paymentId}</span></>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
              <Lucide.Receipt className="h-5 w-5 opacity-80" />
              <span className="text-sm font-medium">{SELLER.name}</span>
            </div>
            <div className="note mt-2 text-[11px] muted">Документ сформирован автоматически</div>
          </div>
        </div>

        {/* Реквизиты */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm font-medium">Продавец</div>
            <div className="mt-1 text-sm">
              <div>{SELLER.name}</div>
              <div className="muted">{SELLER.address}</div>
              <div className="muted">ИНН {SELLER.inn} • КПП {SELLER.kpp}</div>
              <div className="muted">ОГРН {SELLER.ogrn}</div>
              <div className="muted">Тел.: {SELLER.phone} • Email: {SELLER.email}</div>
            </div>
            <div className="mt-2 text-xs muted">
              Банк: {SELLER.bank.name} • БИК {SELLER.bank.bik}
              <br />
              Р/с {SELLER.bank.rs} • К/с {SELLER.bank.ks}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm font-medium">Покупатель</div>
            <div className="mt-1 text-sm">
              <div>{order.client}</div>
              {order.email && <div className="muted">Email: {order.email}</div>}
              {order.phone && <div className="muted">Тел.: {order.phone}</div>}
              <div className="muted">ID клиента: {order.clientId}</div>
            </div>
          </section>
        </div>

        {/* Таблица */}
        <div className="mt-4 overflow-x-auto">
          <table className="invoice-table text-sm">
            <thead>
              <tr>
                <th className="w-12 p-2 text-left text-white print:text-black">#</th>
                <th className="p-2 text-left text-white print:text-black">Наименование</th>
                <th className="hidden md:table-cell p-2 text-left text-white print:text-black">SKU</th>
                <th className="p-2 text-right text-white print:text-black">Кол-во</th>
                <th className="p-2 text-right text-white print:text-black">
                  {inclVat ? "Цена с НДС" : "Цена без НДС"}
                </th>
                <th className="p-2 text-right text-white print:text-black">
                  Сумма {inclVat ? "с НДС" : "без НДС"}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((it: any, idx) => {
                  const qty = Number(it.qty) || 0;
                  const price = Number(it.price) || 0;
                  if (inclVat) {
                    const sum = price * qty;
                    return (
                      <tr key={idx}>
                        <td className="tabular-nums">{idx + 1}</td>
                        <td>
                          <div className="min-w-0">
                            {it.title}
                            {it.variant && <div className="note text-[11px] muted">{it.variant}</div>}
                          </div>
                        </td>
                        <td className="hidden md:table-cell text-xs font-mono">{it.sku || "—"}</td>
                        <td className="text-right tabular-nums">{qty}</td>
                        <td className="text-right tabular-nums">{fmtPrice(price)}</td>
                        <td className="text-right tabular-nums font-medium">{fmtPrice(sum)}</td>
                      </tr>
                    );
                  } else {
                    const sumBase = price * qty;
                    return (
                      <tr key={idx}>
                        <td className="tabular-nums">{idx + 1}</td>
                        <td>
                          <div className="min-w-0">
                            {it.title}
                            {it.variant && <div className="note text-[11px] muted">{it.variant}</div>}
                          </div>
                        </td>
                        <td className="hidden md:table-cell text-xs font-mono">{it.sku || "—"}</td>
                        <td className="text-right tabular-nums">{qty}</td>
                        <td className="text-right tabular-nums">{fmtPrice(price)}</td>
                        <td className="text-right tabular-nums font-medium">{fmtPrice(sumBase)}</td>
                      </tr>
                    );
                  }
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-sm muted">
                    Пусто
                  </td>
                </tr>
              )}
            </tbody>

            {/* Итоги */}
            {items.length > 0 && (
              <tfoot>
                <tr>
                  <td className="text-right" colSpan={5}>
                    Подитог (без НДС):
                  </td>
                  <td className="text-right font-medium tabular-nums">{fmtPrice(subtotalBase)}</td>
                </tr>

                <tr>
                  <td className="text-right" colSpan={5}>
                    Скидка (без НДС):
                  </td>
                  <td className="text-right tabular-nums">−{fmtPrice(discountBase)}</td>
                </tr>

                <tr>
                  <td className="text-right" colSpan={5}>
                    НДС {vatRate}%:
                  </td>
                  <td className="text-right tabular-nums">{fmtPrice(vat)}</td>
                </tr>

                <tr>
                  <td className="text-right font-semibold" colSpan={5}>
                    Итого к оплате:
                  </td>
                  <td className="text-right text-lg font-semibold tabular-nums">{fmtPrice(total)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Основание / подписи */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm font-medium">Основание и примечания</div>
            <div className="note mt-1 text-xs muted leading-relaxed">
              Оплата по счёту № {order.id} от {order.createdAt}. Поставка осуществляется после поступления средств
              на расчётный счёт продавца. В назначении платежа укажите номер счёта и ИНН/КПП покупателя (при наличии).
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm font-medium">Подписи</div>
            <div className="mt-2 grid gap-2">
              <div className="grid grid-cols-[140px_1fr] items-center gap-2 text-sm">
                <div className="muted">Руководитель</div>
                <div className="h-8 rounded border border-dashed border-white/20 print:border-black/40" />
              </div>
              <div className="grid grid-cols-[140px_1fr] items-center gap-2 text-sm">
                <div className="muted">Гл. бухгалтер</div>
                <div className="h-8 rounded border border-dashed border-white/20 print:border-black/40" />
              </div>
              <div className="mt-2 text-[11px] muted">М.П.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Подвал (только экран) */}
      <div className="no-print mt-3 text-xs text-white/60">
        Для мгновенной печати используйте параметр <code className="bg-white/10 px-1 rounded">?print=1</code>.
        Текущие настройки: НДС {vatRate}%, цены {inclVat ? "с НДС" : "без НДС"}.
      </div>
    </div>
  );
}