"use client";

import Link from "next/link";
import { User, Bell, Calendar as Cal, SlidersHorizontal, CreditCard, PlugZap, Bookmark, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import { managerSurface as M, ManagerSection } from "@/app/demo/manager/ui/managerTheme";

const titleCls = "text-base font-semibold";

const SECTIONS = [
  { href: "/demo/manager/settings/profile", title: "Профиль", desc: "ФИО, контакты, язык и подпись", icon: User },
  { href: "/demo/manager/settings/notifications", title: "Уведомления", desc: "Каналы и типы событий", icon: Bell },
  { href: "/demo/manager/settings/calendar", title: "Календарь", desc: "Рабочие часы, буфер, авто-подтверждение", icon: Cal },
  { href: "/demo/manager/settings/preferences", title: "Предпочтения", desc: "Валюта, формат дат, плотность", icon: SlidersHorizontal },
  { href: "/demo/manager/settings/payments", title: "Оплата", desc: "Методы по умолчанию, автосчета", icon: CreditCard },
  { href: "/demo/manager/settings/integrations", title: "Интеграции", desc: "E-mail, мессенджеры, вебхуки", icon: PlugZap },
  { href: "/demo/manager/settings/saved-views", title: "Сохранённые виды", desc: "Шорткаты к отфильтрованным спискам", icon: Bookmark },
  { href: "/demo/manager/settings/security", title: "Безопасность", desc: "2FA (демо), активные сессии", icon: ShieldCheck },
];

export default function SettingsHubPage() {
  return (
    <div className={`${M.page} max-w-5xl`}>
      <header className={M.hero}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Настройки</h1>
            <p className={"mt-1 text-sm " + M.dim}>Личные и рабочие предпочтения менеджера</p>
          </div>
          <Link
            href="/demo/manager/help"
            className={`${M.btnPrimary} whitespace-nowrap`}
          >
            <HelpCircle size={16}/> Нужна помощь?
          </Link>
        </div>
      </header>

      <ManagerSection title="Секции" subtitle="Перейдите в нужный раздел настроек">
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map(({ href, title, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-white/15 bg-white/[0.05] p-3 hover:bg-white/[0.08] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon size={16}/>
                  <div className="text-sm font-medium">{title}</div>
                </div>
                <ArrowRight size={14} className="opacity-70" />
              </div>
              <div className={"mt-1 text-xs " + M.dim}>{desc}</div>
            </Link>
          ))}
        </div>
      </ManagerSection>

      <ManagerSection title="Быстрые действия" subtitle="Часто используемые переходы">
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/demo/manager/settings/calendar" className={`${M.btnGhost} bg-white/[0.08]`}>Изменить рабочие часы</Link>
          <Link href="/demo/manager/settings/preferences" className={`${M.btnGhost} bg-white/[0.08]`}>Выбрать валюту по умолчанию</Link>
          <Link href="/demo/manager/settings/notifications" className={`${M.btnGhost} bg-white/[0.08]`}>Включить резюме дня</Link>
        </div>
      </ManagerSection>
    </div>
  );
}
