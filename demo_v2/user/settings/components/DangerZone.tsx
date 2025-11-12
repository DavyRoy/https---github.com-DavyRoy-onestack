import React, { useState } from "react"

export default function DangerZone() {
  const [confirm, setConfirm] = useState('')
  const [checked, setChecked] = useState(false)
  const remove = () => alert('Аккаунт удалён (демо)')
  return (
    <div className="p-4 border rounded bg-white">
      <h4 className="font-semibold text-red-600">Danger Zone</h4>
      <div className="text-sm text-gray-500 mt-2">Удаление аккаунта необратимо.</div>
      <input className="border p-2 mt-2 w-full" placeholder='Введите "удалить мой аккаунт"' value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
      <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={checked} onChange={(e)=>setChecked(e.target.checked)} /> Я понимаю последствия</label>
      <div className="mt-2"><button className="bg-red-600 text-white px-3 py-2 rounded" disabled={!(checked && confirm==='удалить мой аккаунт')} onClick={remove}>Удалить аккаунт</button></div>
    </div>
  )
}
