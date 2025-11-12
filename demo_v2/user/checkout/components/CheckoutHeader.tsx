import React from "react"

export default function CheckoutHeader({ step = 1 }: { step?: number }) {
  const steps = ["Данные", "Оплата", "Готово"]
  return (
    <div className="flex items-center gap-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i+1 <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{i+1}</div>
          <div className="ml-2 text-sm">{s}</div>
          {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200 mx-3" />}
        </div>
      ))}
    </div>
  )
}
