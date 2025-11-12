import React from "react"

export default function StatusSummary({ status }: any) {
  return (
    <div className="p-4 border rounded bg-white">
      <h4 className="font-semibold">Статус системы</h4>
      <div className="mt-2">{status.overall === 'ok' ? 'Все работает' : 'Есть проблемы'}</div>
      <div className="mt-2 text-sm text-gray-500">Аптайм (24/7): {status.uptimePercent}%</div>
    </div>
  )
}
