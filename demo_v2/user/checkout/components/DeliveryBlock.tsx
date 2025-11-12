import React from "react"

export default function DeliveryBlock({ value, onChange }: any) {
  return (
    <section className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Доставка</h3>
      <div className="grid gap-2">
        <select className="border p-2" value={value.method} onChange={(e) => onChange({ ...value, method: e.target.value })}>
          <option value="pickup">Самовывоз</option>
          <option value="courier">Курьер</option>
          <option value="post">Почта</option>
        </select>
        {value.method !== "pickup" && (
          <>
            <input className="border p-2" placeholder="Адрес / Пункт выдачи" value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} />
            <textarea className="border p-2" placeholder="Комментарий курьеру" />
          </>
        )}
      </div>
    </section>
  )
}
