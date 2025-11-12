import React from "react"

export default function ArticleTOC({ headings }: any) {
  if (!headings || !headings.length) return null
  return (
    <aside className="p-4 border rounded bg-white">
      <h4 className="font-semibold">Оглавление</h4>
      <ul className="mt-2 text-sm space-y-1">
        {headings.map((h: any) => <li key={h.id}><a href={`#${h.id}`} className="text-blue-600">{h.text}</a></li>)}
      </ul>
    </aside>
  )
}
