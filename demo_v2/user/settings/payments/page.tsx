import React from "react"
import SectionCard from "../components/SectionCard"
import PaymentMethods from "../components/PaymentMethods"

export default function PaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Платёжные методы</h2>
      <SectionCard title="Сохранённые карты" description="Управление способами оплаты"><PaymentMethods /></SectionCard>
    </div>
  )
}
