import React from "react"
import ContactForm from "../components/ContactForm"
import ChatButton from "../components/ChatButton"

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Контакты поддержки</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContactForm />
        <div className="p-4 border rounded bg-white">
          <h4 className="font-semibold">Чат</h4>
          <div className="mt-2">Часы работы: 9:00–18:00</div>
          <div className="mt-4"><ChatButton /></div>
          <div className="mt-4 text-sm text-gray-500">Укажите номер заказа и скриншоты для ускорения ответа.</div>
        </div>
      </div>
    </div>
  )
}
