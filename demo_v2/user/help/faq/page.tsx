import React from "react"
import FaqAccordion from "../components/FaqAccordion"
import { faqs } from "../data/userFaq"

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">FAQ</h2>
      <div className="mt-4"><FaqAccordion faqs={faqs} /></div>
    </div>
  )
}
