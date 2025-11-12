export default function BookingInfo({
  price,
  deposit,
  paymentStatus,
  addons,
}: {
  price: number;
  deposit?: number;
  paymentStatus: string;
  addons?: Array<{ id: string; title: string; price: number; duration: number }>;
}) {
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Оплата и дополнительные услуги</h3>
      <div className="space-y-2 text-sm text-[hsl(var(--muted))]">
        <p>Стоимость услуги: {price.toLocaleString("ru-RU")} ₽</p>
        {deposit ? <p>Депозит: {deposit.toLocaleString("ru-RU")} ₽ ({paymentStatus === "deposit_paid" ? "оплачен" : "к оплате"})</p> : <p>Депозит не требуется</p>}
        {addons?.length ? (
          <div>
            <p className="font-semibold text-[hsl(var(--fg))]">Допы:</p>
            <ul className="list-disc space-y-1 pl-5">
              {addons.map((addon) => (
                <li key={addon.id}>
                  {addon.title} • +{addon.price.toLocaleString("ru-RU")} ₽ (+{addon.duration} мин)
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
