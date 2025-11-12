import React from "react"
import ReceiptCard from "../components/ReceiptCard"

export default function SuccessPage() {
  const order = { id: 'DEMO-123', total: 1700 }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Оплата успешна</h2>
      <ReceiptCard order={order} />
    </div>
  )
}
