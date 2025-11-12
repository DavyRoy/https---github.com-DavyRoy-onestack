"use client";

import { useEffect, useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import FormRow from "../components/FormRow";
import ToastArea from "../components/ToastArea";
import { toast } from "sonner";
import { defaultPaymentPrefs, LS_KEY_PAY, type PaymentPrefs } from "../data/mockSettingsPayments";

const input = "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none";

export default function PaymentsSettingsPage() {
  const [data, setData] = useState<PaymentPrefs>(defaultPaymentPrefs);

  useEffect(() => {
    try { const raw = localStorage.getItem(LS_KEY_PAY); if (raw) setData(JSON.parse(raw) as PaymentPrefs); } catch {}
  }, []);

  const save = () => {
    try { localStorage.setItem(LS_KEY_PAY, JSON.stringify(data)); toast.success("Сохранено"); }
    catch { toast.error("Не удалось сохранить"); }
  };

  return (
    <>
      <ToastArea />
      <SettingsLayout>
        <SectionHeader title="Оплата" hint="Локальные предпочтения платежей для менеджера" cta={<button onClick={save} className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90">Сохранить</button>} />
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 grid gap-3">
          <FormRow label="Метод по умолчанию при создании счёта">
            <select className={input} value={data.defaultMethod} onChange={(e)=>setData({...data, defaultMethod:e.target.value as any})}>
              <option value="invoice">Счёт</option>
              <option value="card">Карта</option>
              <option value="cash">Наличные</option>
              <option value="bank">Банковский</option>
            </select>
          </FormRow>
          <FormRow label="Автосоздание счёта при подтверждении заказа">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.autoInvoiceOnConfirm} onChange={(e)=>setData({...data, autoInvoiceOnConfirm:e.target.checked})}/>
              Включить
            </label>
          </FormRow>
          <FormRow label="Включать комиссию провайдера в итог (демо)">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.includeFee} onChange={(e)=>setData({...data, includeFee:e.target.checked})}/>
              Да
            </label>
          </FormRow>
          <FormRow label="Шаблон письма со счетом" help="Плейсхолдеры: {{client.name}}, {{invoice.number}}, {{invoice.total}}">
            <textarea rows={6} className={input} value={data.invoiceEmailTpl} onChange={(e)=>setData({...data, invoiceEmailTpl:e.target.value})}/>
          </FormRow>
        </section>
      </SettingsLayout>
    </>
  );
}