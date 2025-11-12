import React from "react"
import HelpSearch from "./HelpSearch"

export default function HelpHero() {
  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold">Центр помощи</h1>
      <p className="text-sm text-gray-600 mt-1">Поиск в статьях и FAQ, быстрые ссылки на популярные разделы</p>
      <div className="mt-4"><HelpSearch articles={[]} /></div>
      <div className="mt-4 flex gap-3">
        <a className="text-blue-600" href="/demo/user/help/faq">FAQ</a>
        <a className="text-blue-600" href="/demo/user/help/guides">Руководства</a>
        <a className="text-blue-600" href="/demo/user/help/contact">Контакты</a>
        <a className="text-blue-600" href="/demo/user/help/status">Статус</a>
      </div>
    </div>
  )
}
