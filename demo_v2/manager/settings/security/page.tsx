"use client";

import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import DangerZone from "../components/DangerZone";
import { toast } from "sonner";
import ToastArea from "../components/ToastArea";

export default function SecuritySettingsPage() {
  return (
    <>
      <ToastArea/>
      <SettingsLayout>
        <SectionHeader title="Безопасность" hint="2FA и активные сессии (демо)" />
        <section className="grid gap-3">
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
            <div className="text-sm font-medium">Двухфакторная аутентификация (демо)</div>
            <div className="mt-1 text-sm text-white/80">Подключите приложение-аутентификатор.</div>
            <button onClick={()=>toast("QR-код (демо)")} className="mt-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">Показать QR</button>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
            <div className="text-sm font-medium">Активные сессии (демо)</div>
            <ul className="mt-2 text-sm text-white/80 list-disc pl-5">
              <li>Chrome • macOS • 2 часа назад <button onClick={()=>toast("Сессия завершена (демо)")} className="ml-2 text-xs underline opacity-80 hover:opacity-100">Завершить</button></li>
              <li>Safari • iOS • 1 день назад <button onClick={()=>toast("Сессия завершена (демо)")} className="ml-2 text-xs underline opacity-80 hover:opacity-100">Завершить</button></li>
            </ul>
          </div>
          <DangerZone />
        </section>
      </SettingsLayout>
    </>
  );
}