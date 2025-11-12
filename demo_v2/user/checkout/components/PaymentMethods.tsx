import React from "react"

function maskCard(value: string) {
  return value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim()
}

export default function PaymentMethods({ value, onChange }: any) {
  return (
    <section className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Способ оплаты</h3>
      <div className="grid gap-2">
        <label className="flex items-center gap-2"><input type="radio" name="pm" checked={value.method === 'card'} onChange={() => onChange({ ...value, method: 'card' })} /> Банковская карта</label>
        {value.method === 'card' && (
          <div className="grid gap-2">
            <input className="border p-2" placeholder="Номер карты" value={maskCard(value.cardNumber)} onChange={(e) => onChange({ ...value, cardNumber: e.target.value.replace(/\s/g, '') })} />
            <div className="flex gap-2">
              <input className="border p-2 flex-1" placeholder="MM/YY" value={value.expiry} onChange={(e) => onChange({ ...value, expiry: e.target.value })} />
              <input className="border p-2 w-24" placeholder="CVV" value={value.cvv} onChange={(e) => onChange({ ...value, cvv: e.target.value })} />
            </div>
            <div className="text-xs text-gray-500">Демо-карты: 4000... — успех, 4001... — отказ, другое — 3DS</div>
          </div>
        )}

        <label className="flex items-center gap-2"><input type="radio" name="pm" checked={value.method === 'apple'} onChange={() => onChange({ ...value, method: 'apple' })} /> Apple Pay / Google Pay (демо)</label>
        <label className="flex items-center gap-2"><input type="radio" name="pm" checked={value.method === 'sbp'} onChange={() => onChange({ ...value, method: 'sbp' })} /> СБП / Банковский перевод</label>
        <label className="flex items-center gap-2"><input type="radio" name="pm" checked={value.method === 'cash'} onChange={() => onChange({ ...value, method: 'cash' })} /> Наличные при получении</label>
      </div>
    </section>
  )
}
