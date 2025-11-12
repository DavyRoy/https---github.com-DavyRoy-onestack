import React from "react"

export default function NotificationsForm() {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2"><input type="checkbox" /> E-mail</label>
      <label className="flex items-center gap-2"><input type="checkbox" /> SMS</label>
      <label className="flex items-center gap-2"><input type="checkbox" /> Пуш</label>
      <div className="mt-2 text-sm">Категории: <div className="mt-1"><label className="mr-2"><input type="checkbox" /> Записи</label><label className="mr-2"><input type="checkbox" /> Заказы</label><label><input type="checkbox" /> Оплаты</label></div></div>
      <div className="mt-2"><button className="bg-blue-600 text-white px-3 py-2 rounded">Сохранить</button></div>
    </div>
  )
}
