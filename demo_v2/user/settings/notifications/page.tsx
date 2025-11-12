import React from "react"
import SectionCard from "../components/SectionCard"
import NotificationsForm from "../components/NotificationsForm"

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Уведомления</h2>
      <SectionCard title="Каналы и категории" description="Настройте, как вы хотите получать уведомления"><NotificationsForm /></SectionCard>
    </div>
  )
}
