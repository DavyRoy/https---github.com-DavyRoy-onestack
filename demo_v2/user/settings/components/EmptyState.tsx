import React from "react"

export default function EmptyState({ title, subtitle }: any) {
  return (
    <div className="p-6 text-center border rounded bg-white">
      <h3 className="font-semibold">{title}</h3>
      <div className="text-sm text-gray-500 mt-2">{subtitle}</div>
    </div>
  )
}
