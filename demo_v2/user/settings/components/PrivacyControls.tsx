import React from "react"

export default function PrivacyControls() {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2"><input type="checkbox" /> Согласен на обработку персональных данных</label>
      <label className="flex items-center gap-2"><input type="checkbox" /> Получать маркетинговые письма</label>
      <div className="mt-2"><button className="bg-gray-200 px-3 py-2 rounded">Экспорт моих данных</button></div>
    </div>
  )
}
