"use client";

import { useEffect, useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import IntegrationCard from "../components/IntegrationCard";
import ToastArea from "../components/ToastArea";
import { toast } from "sonner";
import { defaultIntegrations, LS_KEY_INT, type Integrations } from "../data/mockSettingsIntegrations";

export default function IntegrationsSettingsPage() {
  const [data, setData] = useState<Integrations>(defaultIntegrations);

  useEffect(() => {
    try { const raw = localStorage.getItem(LS_KEY_INT); if (raw) setData(JSON.parse(raw) as Integrations); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY_INT, JSON.stringify(data)); } catch {}
  }, [data]);

  return (
    <>
      <ToastArea />
      <SettingsLayout>
        <SectionHeader title="Интеграции" hint="Подключите необходимые каналы (демо)" />
        <section className="grid gap-3">
          <IntegrationCard title="E-mail" connected={data.email} onToggle={(n)=>setData({...data, email:n})}>
            Отправка писем со счетами и напоминаниями.
          </IntegrationCard>
          <IntegrationCard title="Мессенджер (демо)" connected={data.messenger} onToggle={(n)=>setData({...data, messenger:n})}>
            Уведомления в WhatsApp/Telegram.
          </IntegrationCard>
          <IntegrationCard title="Вебхуки (демо)" connected={data.webhooks.length>0} onToggle={(n)=>{
            setData({...data, webhooks: n?["https://example.com/webhook-demo"]:[]});
          }}>
            Активные: {data.webhooks.length}
          </IntegrationCard>
          <IntegrationCard title="Синхронизация календаря (демо)" connected={data.calendarSync} onToggle={(n)=>setData({...data, calendarSync:n})}>
            Односторонняя синхронизация со внешним календарём.
          </IntegrationCard>
        </section>
      </SettingsLayout>
    </>
  );
}