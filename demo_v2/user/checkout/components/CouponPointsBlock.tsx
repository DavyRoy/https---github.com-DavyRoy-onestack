import React from "react"

export default function CouponPointsBlock({ coupon, setCoupon, points, setPoints, maxPoints }: any) {
  return (
    <section className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Купон и баллы</h3>
      <div className="grid gap-2">
        <div className="flex gap-2">
          <input className="border p-2 flex-1" placeholder="Код купона" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
          <button className="bg-blue-600 text-white px-3 rounded">Применить</button>
        </div>

        <div>
          <label className="block text-sm">Баллы (макс {maxPoints})</label>
          <input type="range" min={0} max={maxPoints} value={points} onChange={(e) => setPoints(Number(e.target.value))} />
          <div className="text-sm">Списать: {points} ₽</div>
          <div className="text-xs text-gray-500">Купон и баллы применяются до налогов/доставки (демо правило).</div>
        </div>
      </div>
    </section>
  )
}
