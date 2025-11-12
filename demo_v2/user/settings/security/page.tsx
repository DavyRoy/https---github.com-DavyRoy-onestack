import React from "react"
import SectionCard from "../components/SectionCard"
import PasswordForm from "../components/PasswordForm"
import TwoFASetup from "../components/TwoFASetup"
import SessionsList from "../components/SessionsList"

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Безопасность</h2>
      <SectionCard title="Пароль" description="Изменить пароль"><PasswordForm /></SectionCard>
      <SectionCard title="Двухфакторная аутентификация" description="Улучшите безопасность"><TwoFASetup /></SectionCard>
      <SectionCard title="Активные сессии" description="Управляйте устройствами"><SessionsList /></SectionCard>
    </div>
  )
}
