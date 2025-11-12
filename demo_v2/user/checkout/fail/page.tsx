import React from "react"
import RetryOptions from "../components/RetryOptions"

export default function FailPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-red-600">Платеж не прошёл</h2>
      <p className="mb-4">К сожалению, оплата не была завершена. Возможные варианты:</p>
      <RetryOptions />
    </div>
  )
}
