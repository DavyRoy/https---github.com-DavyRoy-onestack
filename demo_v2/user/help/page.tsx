"use client"
import React from "react"
import HelpHero from "./components/HelpHero"
import QuickTiles from "./components/QuickTiles"
import PopularList from "./components/PopularList"
import HelpSearch from "./components/HelpSearch"
import { articles } from "./data/userHelpArticles"

export default function HelpHome() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <HelpHero />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HelpSearch articles={articles} />
          <div className="mt-6"><QuickTiles /></div>
        </div>
        <aside>
          <PopularList articles={articles} />
        </aside>
      </div>
    </div>
  )
}
