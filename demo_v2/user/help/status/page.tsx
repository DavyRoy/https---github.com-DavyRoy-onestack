import React from "react"
import StatusSummary from "../components/StatusSummary"
import { statusMock } from "../data/userStatusMock"

export default function StatusPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Статус системы</h2>
      <div className="mt-4"><StatusSummary status={statusMock} /></div>
      <div className="mt-4 p-4 bg-yellow-50 border rounded">Если оплату не удаётся провести — попробуйте другой метод или повторите попытку позже.</div>
    </div>
  )
}
