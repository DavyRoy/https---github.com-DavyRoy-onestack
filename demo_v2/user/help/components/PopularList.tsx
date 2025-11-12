import React from "react"

export default function PopularList({ articles }: any) {
  const top = (articles || []).slice(0,5)
  return (
    <div className="p-4 bg-white border rounded">
      <h4 className="font-semibold">Популярное</h4>
      <ul className="mt-2 space-y-2">
        {top.map((a: any) => (
          <li key={a.slug}><a href={`/demo/user/help/guides/${a.slug}`} className="text-blue-600">{a.title}</a></li>
        ))}
      </ul>
    </div>
  )
}
