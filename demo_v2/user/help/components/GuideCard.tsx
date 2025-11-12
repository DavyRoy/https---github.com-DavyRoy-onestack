import React from "react"

export default function GuideCard({ guide }: any) {
  return (
    <a href={`/demo/user/help/guides/${guide.slug}`} className="block p-4 border rounded bg-white">
      <h3 className="font-semibold">{guide.title}</h3>
      <div className="text-sm text-gray-500">{guide.summary}</div>
      <div className="mt-2 text-xs text-gray-500">{guide.readTime} • {guide.updated}</div>
      <div className="mt-2 text-xs">{guide.tags?.map((t: string)=> <span key={t} className="text-xs mr-2 bg-gray-100 px-2 py-1 rounded">{t}</span>)}</div>
    </a>
  )
}
