import React from "react"

export default function ThreeDSCard({ onSubmit }: any) {
  return (
    <div className="p-6 border rounded bg-white max-w-md mx-auto">
      <h3 className="font-semibold mb-2">3DS / Подтверждение платежа</h3>
      <p className="text-sm mb-4">В демо требуется ввести код: 123456</p>
      <input className="border p-2 w-full mb-3" placeholder="Код из банка" />
      <div className="flex gap-2"><button className="bg-blue-600 text-white p-2 rounded" onClick={onSubmit}>Подтвердить</button></div>
    </div>
  )
}
