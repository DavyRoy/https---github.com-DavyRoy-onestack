import React from "react"
import SectionCard from "../components/SectionCard"
import PrivacyControls from "../components/PrivacyControls"
import DangerZone from "../components/DangerZone"

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Конфиденциальность</h2>
      <SectionCard title="Согласия" description="Управление согласиями"><PrivacyControls /></SectionCard>
      <SectionCard title="Опции" description="Экспорт и удаление"><DangerZone /></SectionCard>
    </div>
  )
}
