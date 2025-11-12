import React from "react"
import SectionCard from "../components/SectionCard"
import AvatarUploader from "../components/AvatarUploader"
import ContactForm from "../components/ContactForm"
import LocaleCurrencyForm from "../components/LocaleCurrencyForm"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Профиль</h2>
      <SectionCard title="Профиль" description="Контактные данные"> 
        <AvatarUploader />
        <div className="mt-3"><ContactForm /></div>
      </SectionCard>

      <SectionCard title="Язык и регион" description="Настройки языка и валюты">
        <LocaleCurrencyForm />
      </SectionCard>

      <SectionCard title="Предпочтения" description="Тема и отображение цен">
        <div className="space-y-2"><label className="flex items-center gap-2"><input type="radio" name="theme"/> Системная</label><label className="flex items-center gap-2"><input type="radio" name="theme"/> Светлая</label><label className="flex items-center gap-2"><input type="radio" name="theme"/> Тёмная</label></div>
      </SectionCard>
    </div>
  )
}
