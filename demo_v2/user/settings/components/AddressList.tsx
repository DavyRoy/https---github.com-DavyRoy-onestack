import React from "react"

const addresses = [
  { id: 'a1', name: 'Иван Петров', street: 'ул. Ленина, д.1', city: 'Москва', zip: '101000', phone: '+7 900 000 00 00', primary: true },
]

export default function AddressList() {
  return (
    <div className="space-y-2">
      {addresses.map(a=> (
        <div key={a.id} className="p-3 border rounded bg-white">
          <div className="flex justify-between"><div><div className="font-medium">{a.name}</div><div className="text-sm text-gray-500">{a.street}, {a.city}, {a.zip}</div></div><div>{a.primary && <span className="text-xs bg-gray-100 px-2 py-1 rounded">По умолчанию</span>}</div></div>
          <div className="mt-2"><button className="mr-2">Редактировать</button><button className="text-red-600">Удалить</button></div>
        </div>
      ))}
      <div><button className="bg-blue-600 text-white px-3 py-2 rounded">Добавить адрес</button></div>
    </div>
  )
}
