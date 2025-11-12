import React from "react"

export default function LocaleCurrencyForm() {
  return (
    <div className="space-y-2">
      <select className="border p-2 w-full"><option>Русский</option><option>English</option></select>
      <select className="border p-2 w-full"><option>RUB</option><option>USD</option><option>KRW</option></select>
      <label className="flex items-center gap-2"><input type="checkbox" /> 24-часовой формат</label>
    </div>
  )
}
