import React from "react"

export default function SettingsTabs() {
  const tabs = [
    { id: 'profile', label: 'Профиль', href: '/demo/user/settings/profile' },
    { id: 'security', label: 'Безопасность', href: '/demo/user/settings/security' },
    { id: 'notifications', label: 'Уведомления', href: '/demo/user/settings/notifications' },
    { id: 'addresses', label: 'Адреса', href: '/demo/user/settings/addresses' },
    { id: 'payments', label: 'Платёжные методы', href: '/demo/user/settings/payments' },
    { id: 'privacy', label: 'Конфиденциальность', href: '/demo/user/settings/privacy' },
  ]
  return (
    <nav className="flex gap-2 flex-wrap">
      {tabs.map(t => <a key={t.id} href={t.href} className="px-3 py-2 border rounded bg-white">{t.label}</a>)}
    </nav>
  )
}
