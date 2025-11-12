import type { OrderRecord } from "../data/mockUserMyOrders";

export default function AddressBlock({ order }: { order: OrderRecord }) {
  if (!order.address) return null;
  const { name, phone, line1, line2, city, postalCode } = order.address;
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Адрес доставки</h3>
      <div className="text-sm text-[hsl(var(--muted))]">
        <p className="font-semibold text-[hsl(var(--fg))]">{name}</p>
        <p>{phone}</p>
        <p>{line1}</p>
        {line2 ? <p>{line2}</p> : null}
        <p>
          {city}, {postalCode}
        </p>
      </div>
    </section>
  );
}
