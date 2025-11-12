import React from "react"

export default function PayButton({ disabled, onClick, amount, loading }: any) {
  return (
    <button className={`w-full p-3 rounded text-white ${disabled ? 'bg-gray-400' : 'bg-green-600'}`} disabled={disabled} onClick={onClick}>
      {loading ? 'Обработка...' : `Оплатить ${amount} ₽`}
      <div className="text-xs text-white/80">Будет списано сегодня</div>
    </button>
  )
}
