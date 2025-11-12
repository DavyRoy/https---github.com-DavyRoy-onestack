import React, { useMemo, useState } from "react"

export default function HelpSearch({ articles }: any) {
  const [q, setQ] = useState("")
  const results = useMemo(() => {
    if (!q) return []
    return (articles || []).filter((a: any) => a.title.toLowerCase().includes(q.toLowerCase()) || a.body.toLowerCase().includes(q.toLowerCase()))
  }, [q, articles])

  return (
    <div>
      <input className="border p-2 w-full" placeholder="Поиск по статьям и FAQ" value={q} onChange={(e) => setQ(e.target.value)} />
      {q && (
        <div className="mt-2 bg-white border rounded p-2 max-h-40 overflow-auto">
          {results.length ? results.map((r: any) => <div key={r.slug} className="p-2 border-b"><a href={`/demo/user/help/guides/${r.slug}`} className="text-blue-600">{r.title}</a></div>) : <div className="text-sm text-gray-500">Ничего не найдено</div>}
        </div>
      )}
    </div>
  )
}
