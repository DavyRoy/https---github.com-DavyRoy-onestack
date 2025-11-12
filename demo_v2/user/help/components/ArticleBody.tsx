import React from "react"

export default function ArticleBody({ body }: any) {
  return (
    <div className="prose max-w-none">
      {/* Деморендер простого markdown-like */}
      {body.split('\n\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
    </div>
  )
}
