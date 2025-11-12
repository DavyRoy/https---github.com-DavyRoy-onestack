"use client"
import React from "react"
import SettingsTabs from "./components/SettingsTabs"
import SectionCard from "./components/SectionCard"

export default function SettingsHub() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <p className="text-sm text-gray-600">Управляйте аккаунтом, уведомлениями и безопасностью.</p>
      <div className="mt-4"><SettingsTabs /></div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
  <SectionCard title="Обновить телефон" description="Обновите контактный номер для уведомлений" ctaLink="/demo/user/settings/profile" />
  <SectionCard title="Включить 2FA" description="Повысить безопасность аккаунта" ctaLink="/demo/user/settings/security" />
  <SectionCard title="Уведомления о записях" description="Настройте уведомления" ctaLink="/demo/user/settings/notifications" />
      </div>
    </div>
  )
}
