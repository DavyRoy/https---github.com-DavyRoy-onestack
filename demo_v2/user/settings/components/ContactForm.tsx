import React, { useState } from "react"

export default function ContactForm() {
  const [form, setForm] = useState({ firstName: 'Иван', lastName: 'Петров', email: 'ivan@example.com', phone: '+7 900 000 00 00' })
  const save = () => alert('Сохранено (демо)')
  return (
    <form className="space-y-2" onSubmit={(e)=>{e.preventDefault(); save()}}>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2" value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} />
        <input className="border p-2" value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} />
      </div>
      <input className="border p-2 w-full" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
      <div className="flex gap-2 items-center">
        <input className="border p-2" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
        <button className="text-blue-600">Отправить письмо повторно</button>
      </div>
      <div><button className="bg-blue-600 text-white px-3 py-2 rounded" type="submit">Сохранить</button></div>
    </form>
  )
}
