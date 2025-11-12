import React from "react"

export default function SectionCard({ title, description, children, ctaLink }: any) {
  return (
    <div className="p-4 border rounded bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{title}</h4>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        {ctaLink && <a href={ctaLink} className="text-blue-600">Изменить</a>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

