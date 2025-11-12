import React from "react"

const tiles = [
  { title: 'Оплата', tag: 'payments' },
  { title: 'Бронирование', tag: 'booking' },
  { title: 'Заказы', tag: 'orders' },
  { title: 'Аккаунт', tag: 'account' },
]

export default function QuickTiles() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map(t => (
        <a key={t.tag} href={`/demo/user/help/guides?q=&tag=${t.tag}`} className="p-4 border rounded bg-white text-center">{t.title}</a>
      ))}
    </div>
  )
}
