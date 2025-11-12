import React from "react"
import { articles } from "../data/userHelpArticles"
import GuideCard from "../components/GuideCard"

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Руководства</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(a=> <GuideCard key={a.slug} guide={a} />)}
      </div>
    </div>
  )
}
