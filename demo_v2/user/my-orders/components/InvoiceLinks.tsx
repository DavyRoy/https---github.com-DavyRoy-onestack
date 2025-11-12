import type { OrderRecord } from "../data/mockUserMyOrders";

export default function InvoiceLinks({ order }: { order: OrderRecord }) {
  if (!order.invoices.length) return null;
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Документы</h3>
      <div className="flex flex-wrap gap-2 text-sm text-[hsl(var(--muted))]">
        {order.invoices.map((invoice) => (
          <a
            key={invoice.id}
            href={invoice.href}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 hover:bg-[hsl(var(--panel))]/80"
          >
            {invoice.label}
          </a>
        ))}
      </div>
    </section>
  );
}
