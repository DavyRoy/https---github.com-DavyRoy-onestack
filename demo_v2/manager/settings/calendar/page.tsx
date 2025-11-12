"use client";

import { useEffect, useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import FormRow from "../components/FormRow";
import DaysOfWeekPicker from "../components/DaysOfWeekPicker";
import TimeRangePicker from "../components/TimeRangePicker";
import NumberWithUnit from "../components/NumberWithUnit";
import ToastArea from "../components/ToastArea";
import { toast } from "sonner";
import { defaultCalendarSettings, LS_KEY_CAL, type CalendarSettings } from "../data/mockSettingsCalendar";
import Link from "next/link";

const input = "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none";

export default function CalendarSettingsPage() {
  const [data, setData] = useState<CalendarSettings>(defaultCalendarSettings);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_CAL);
      if (raw) setData(JSON.parse(raw) as CalendarSettings);
    } catch {}
  }, []);

  const save = () => {
    try {
      localStorage.setItem(LS_KEY_CAL, JSON.stringify(data));
      toast.success("Сохранено");
    } catch { toast.error("Не удалось сохранить"); }
  };

  const reset = () => setData(defaultCalendarSettings);

  return (
    <>
      <ToastArea />
      <SettingsLayout>
        <SectionHeader
          title="Календарь: рабочее время и правила"
          hint="Определите рабочие дни, часы и ограничения бронирований"
          cta={
            <div className="flex gap-2">
              <button onClick={reset} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">Сбросить</button>
              <button onClick={save} className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90">Сохранить</button>
            </div>
          }
        />
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 grid gap-3">
          <FormRow label="Рабочие дни">
            <DaysOfWeekPicker value={data.days} onChange={(v)=>setData({...data, days: v})}/>
          </FormRow>
          <FormRow label="Рабочие часы">
            <TimeRangePicker from={data.hours.from} to={data.hours.to} onChange={(v)=>setData({...data, hours:v})}/>
          </FormRow>
          <div className="grid gap-3 md:grid-cols-2">
            <FormRow label="Буфер между записями">
              <NumberWithUnit value={data.bufferMin} onChange={(v)=>setData({...data, bufferMin: v})}/>
            </FormRow>
            <FormRow label="Максимум записей в день">
              <input className={input} type="number" value={data.maxPerDay} onChange={(e)=>setData({...data, maxPerDay:Number(e.target.value)})}/>
            </FormRow>
          </div>
          <FormRow label="Авто-подтверждение онлайн-записей">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.autoConfirmOnline} onChange={(e)=>setData({...data, autoConfirmOnline:e.target.checked})}/>
              Включить
            </label>
          </FormRow>
          <div className="grid gap-3 md:grid-cols-2">
            <FormRow label="Минимум до начала (часы)">
              <input className={input} type="number" value={data.minAheadHours} onChange={(e)=>setData({...data, minAheadHours:Number(e.target.value)})}/>
            </FormRow>
            <FormRow label="Максимум вперёд (дней)">
              <input className={input} type="number" value={data.maxForwardDays} onChange={(e)=>setData({...data, maxForwardDays:Number(e.target.value)})}/>
            </FormRow>
          </div>
          <FormRow label="Политика no-show">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.requirePrepayForNoShow} onChange={(e)=>setData({...data, requirePrepayForNoShow:e.target.checked})}/>
              Запрашивать предоплату при риске no-show (демо)
            </label>
          </FormRow>
          <div className="mt-2">
            <Link href="/demo/manager/services/schedule" className="text-sm underline opacity-80 hover:opacity-100">Открыть расписание услуг</Link>
          </div>
        </section>
      </SettingsLayout>
    </>
  );
}