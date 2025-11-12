import React from "react"

export default function ContactBlock({ value, onChange }: any) {
  return (
    <section className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Контактные данные</h3>
      <div className="grid grid-cols-1 gap-2">
        <input className="border p-2" placeholder="Имя" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        <input className="border p-2" placeholder="E-mail" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
        <input className="border p-2" placeholder="Телефон" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={value.save} onChange={(e) => onChange({ ...value, save: e.target.checked })} /> Сохранить для будущих покупок</label>
      </div>
    </section>
  )
}
