import Image from "next/image";
import type { OrderItem } from "../data/mockUserMyOrders";

export default function OrderItems({ items }: { items: OrderItem[] }) {
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Позиции заказа</h3>
      <ul className="space-y-3 text-sm text-[hsl(var(--muted))]">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <Image src={item.image} alt={item.title} width={56} height={56} className="h-14 w-14 rounded-xl object-cover" unoptimized />
            <div className="flex flex-1 flex-col">
              <span className="font-semibold text-[hsl(var(--fg))]">{item.title}</span>
              <span className="text-xs text-[hsl(var(--muted))]">{item.type === "service" ? "Услуга" : "Товар"}</span>
            </div>
            <div className="text-right text-sm text-[hsl(var(--fg))]">
              <p>{item.quantity} × {item.price.toLocaleString("ru-RU")} ₽</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
