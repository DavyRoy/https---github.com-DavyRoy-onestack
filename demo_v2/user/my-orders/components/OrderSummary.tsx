export default function OrderSummary({ subtotal, discount, deliveryFee, tax, total }: { subtotal: number; discount: number; deliveryFee: number; tax: number; total: number }) {
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Итоги заказа</h3>
      <dl className="space-y-2 text-sm text-[hsl(var(--muted))]">
        <div className="flex items-center justify-between">
          <dt>Подытог</dt>
          <dd className="text-[hsl(var(--fg))]">{subtotal.toLocaleString("ru-RU")} ₽</dd>
        </div>
        {discount ? (
          <div className="flex items-center justify-between text-emerald-200">
            <dt>Скидка</dt>
            <dd>-{discount.toLocaleString("ru-RU")} ₽</dd>
          </div>
        ) : null}
        {deliveryFee ? (
          <div className="flex items-center justify-between">
            <dt>Доставка</dt>
            <dd>+{deliveryFee.toLocaleString("ru-RU")} ₽</dd>
          </div>
        ) : null}
        {tax ? (
          <div className="flex items-center justify-between">
            <dt>Налог</dt>
            <dd>+{tax.toLocaleString("ru-RU")} ₽</dd>
          </div>
        ) : null}
      </dl>
      <div className="border-t border-[hsl(var(--border))]/70 pt-3">
        <div className="flex items-center justify-between text-lg font-semibold text-[hsl(var(--fg))]">
          <span>Итого</span>
          <span>{total.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>
    </section>
  );
}
