import React from "react"
import { articles } from "../../data/userHelpArticles"
import ArticleTOC from "../../components/ArticleTOC"
import ArticleBody from "../../components/ArticleBody"
import FeedbackWidget from "../../components/FeedbackWidget"

export default function ArticlePage({ params }: any) {
  const slug = params.slug
  const article = articles.find(a=>a.slug===slug)
  if (!article) return <div className="p-6">Статья не найдена</div>
  const headings = [{ id: 'intro', text: 'Введение' }, { id: 'steps', text: 'Шаги' }]
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">{article.title}</h1>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><ArticleBody body={article.body} /><div className="mt-6"><FeedbackWidget /></div></div>
        <aside><ArticleTOC headings={headings} /><div className="mt-4">Похожие статьи</div></aside>
      </div>
    </div>
  )
}
