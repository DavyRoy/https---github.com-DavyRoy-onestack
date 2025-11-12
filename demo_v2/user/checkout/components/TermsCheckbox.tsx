import React from "react"

export default function TermsCheckbox({ checked, onChange }: any) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div>Согласен с <a className="text-blue-600" href="#">условиями оферты</a> и <a className="text-blue-600" href="#">политикой возврата депозитов</a>.</div>
    </label>
  )
}
