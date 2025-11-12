import React, { useState } from "react"

export default function PasswordForm() {
  const [form, setForm] = useState({ oldPass: '', newPass: '', confirm: '' })
  const save = () => alert('Пароль изменён (демо)')
  return (
    <form onSubmit={(e)=>{e.preventDefault(); save()}} className="space-y-2">
      <input type="password" className="border p-2 w-full" placeholder="Старый пароль" value={form.oldPass} onChange={(e)=>setForm({...form, oldPass: e.target.value})} />
      <input type="password" className="border p-2 w-full" placeholder="Новый пароль" value={form.newPass} onChange={(e)=>setForm({...form, newPass: e.target.value})} />
      <input type="password" className="border p-2 w-full" placeholder="Подтвердите" value={form.confirm} onChange={(e)=>setForm({...form, confirm: e.target.value})} />
      <div><button className="bg-blue-600 text-white px-3 py-2 rounded" type="submit">Сохранить</button></div>
    </form>
  )
}
