import React from "react"

export default function ReceiptCard({ order }: any) {
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-semibold">Квитанция</h3>
      <div className="text-sm mt-2">Номер заказа: {order?.id || 'DEMO-123'}</div>
      <div className="text-sm">Сумма: {order?.total || '—'} ₽</div>
    </div>
  )
}
