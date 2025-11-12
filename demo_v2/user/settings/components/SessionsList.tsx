import React from "react"

const sessions = [
  { id: 's1', device: 'Chrome on macOS', ip: '5.6.7.8', time: '2025-10-07 10:00' },
  { id: 's2', device: 'Safari on iPhone', ip: '1.2.3.4', time: '2025-10-06 12:00' },
]

export default function SessionsList() {
  return (
    <div className="space-y-2">
      {sessions.map(s=> (
        <div key={s.id} className="p-2 border rounded bg-white flex justify-between"><div><div className="font-medium">{s.device}</div><div className="text-sm text-gray-500">{s.ip} · {s.time}</div></div><div><button className="text-red-600">Завершить</button></div></div>
      ))}
      <div className="mt-2"><button className="text-blue-600">Завершить все кроме текущей</button></div>
    </div>
  )
}
