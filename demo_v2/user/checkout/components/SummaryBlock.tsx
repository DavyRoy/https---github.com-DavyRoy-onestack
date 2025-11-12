import React from "react"

export default function SummaryBlock({ items, subtotal, coupon, points, delivery, total, currency }: any) {
  return (
    <aside className="p-4 border rounded bg-white">
      <h4 className="font-semibold">Состав заказа</h4>
      <div className="mt-2 space-y-2">
        {items.map((it: any) => (
          <div key={it.id} className="flex justify-between text-sm">
            <div>{it.name} ×{it.qty}</div>
            <div>{it.price * it.qty} {currency}</div>
          </div>
        ))}
      </div>
      <hr className="my-2" />
      <div className="text-sm flex justify-between"><div>Подытог</div><div>{subtotal} {currency}</div></div>
      <div className="text-sm flex justify-between"><div>Скидка (купон)</div><div>{coupon ? 300 : 0} {currency}</div></div>
      <div className="text-sm flex justify-between"><div>Баллы</div><div>-{points} {currency}</div></div>
      <div className="text-sm flex justify-between"><div>Доставка</div><div>{delivery} {currency}</div></div>
      <div className="font-semibold text-lg flex justify-between mt-2"><div>Итого</div><div>{total} {currency}</div></div>
      <div className="mt-2 text-xs text-gray-500">Валюта: {currency}</div>
    </aside>
  )
}
