"use client";

import { useEffect, useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import FormRow from "../components/FormRow";
import ToastArea from "../components/ToastArea";
import { toast } from "sonner";
import { defaultPreferences, LS_KEY_PREF, type Preferences } from "../data/mockSettingsPreferences";

const input = "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none";

export default function PreferencesSettingsPage() {
  const [data, setData] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_PREF);
      if (raw) setData(JSON.parse(raw) as Preferences);
    } catch {}
  }, []);

  const save = () => {
    try { localStorage.setItem(LS_KEY_PREF, JSON.stringify(data)); toast.success("Сохранено"); }
    catch { toast.error("Не удалось сохранить"); }
  };

  const sampleDate = data.dateFmt === "DD.MM.YY" ? "06.10.25" : "2025-10-06";
  const sampleTime = data.timeFmt === "24h" ? "14:30" : "2:30 PM";
  const sampleAmount = data.thousandSep === "space" ? "1 234 567" : "1,234,567";

  return (
    <>
      <ToastArea />
      <SettingsLayout>
        <SectionHeader title="Предпочтения UI" hint="Форматы и стартовые экраны" cta={<button onClick={save} className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90">Сохранить</button>} />
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 grid gap-3 md:grid-cols-2">
          <FormRow label="Валюта по умолчанию">
            <select className={input} value={data.currency} onChange={(e)=>setData({...data, currency: e.target.value as any})}>
              <option value="RUB">RUB ₽</option>
              <option value="KRW">KRW ₩</option>
              <option value="USD">USD $</option>
            </select>
          </FormRow>
          <FormRow label="Формат даты">
            <select className={input} value={data.dateFmt} onChange={(e)=>setData({...data, dateFmt:e.target.value as any})}>
              <option value="DD.MM.YY">ДД.ММ.ГГ</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </FormRow>
          <FormRow label="Формат времени">
            <select className={input} value={data.timeFmt} onChange={(e)=>setData({...data, timeFmt:e.target.value as any})}>
              <option value="24h">24 часа</option>
              <option value="12h">12 часов</option>
            </select>
          </FormRow>
          <FormRow label="Разделитель разрядов">
            <select className={input} value={data.thousandSep} onChange={(e)=>setData({...data, thousandSep:e.target.value as any})}>
              <option value="space">Пробел</option>
              <option value="comma">Запятая</option>
            </select>
          </FormRow>
          <FormRow label="Язык интерфейса">
            <select className={input} value={data.locale} onChange={(e)=>setData({...data, locale:e.target.value as any})}>
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="ko">한국어</option>
            </select>
          </FormRow>
          <FormRow label="Плотность таблиц">
            <select className={input} value={data.tableDensity} onChange={(e)=>setData({...data, tableDensity:e.target.value as any})}>
              <option value="compact">Компактная</option>
              <option value="normal">Стандарт</option>
              <option value="comfortable">Просторная</option>
            </select>
          </FormRow>
          <FormRow label="Стартовый вид календаря">
            <select className={input} value={data.calendarStartView} onChange={(e)=>setData({...data, calendarStartView:e.target.value as any})}>
              <option value="day">День</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
            </select>
          </FormRow>
          <FormRow label="Домашняя страница по умолчанию">
            <select className={input} value={data.defaultHome} onChange={(e)=>setData({...data, defaultHome:e.target.value as any})}>
              <option value="dashboard">Дашборд</option>
              <option value="orders">Заказы</option>
              <option value="booking">Бронирование</option>
              <option value="calendar">Календарь</option>
            </select>
          </FormRow>
          <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
            <div className="font-medium">Превью форматов</div>
            <div className="mt-1 text-white/80">Дата: {sampleDate} • Время: {sampleTime} • Сумма: {sampleAmount} ₽</div>
          </div>
        </section>
      </SettingsLayout>
    </>
  );
}