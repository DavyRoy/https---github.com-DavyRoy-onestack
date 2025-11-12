import React from "react"

export default function PaymentMethods() {
  const cards = [{ id: 'c1', brand: 'Visa', pan: '•••• 1234', exp: '12/26', primary: true }]
  return (
    <div>
      {cards.map(c=> <div key={c.id} className="p-3 border rounded bg-white mb-2"><div className="flex justify-between"><div>{c.brand} {c.pan} • {c.exp}</div><div>{c.primary && <span className="text-xs">По умолчанию</span>}</div></div></div>)}
      <div><button className="bg-blue-600 text-white px-3 py-2 rounded">Добавить карту</button></div>
    </div>
  )
}
