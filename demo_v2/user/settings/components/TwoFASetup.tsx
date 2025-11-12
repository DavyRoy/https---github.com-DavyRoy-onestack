import React, { useState } from "react"

export default function TwoFASetup() {
  const [enabled, setEnabled] = useState(false)
  const toggle = () => setEnabled(!enabled)
  return (
    <div>
      <div className="text-sm mb-2">Двухфакторная аутентификация</div>
      <div className="flex gap-2"><button onClick={toggle} className="px-3 py-2 border rounded">{enabled ? 'Выключить' : 'Включить'}</button></div>
      {enabled && <div className="mt-2 text-sm text-green-600">Включено (демо)</div>}
    </div>
  )
}
