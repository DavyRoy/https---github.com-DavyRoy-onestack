"use client";

import { useEffect, useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import FormRow from "../components/FormRow";
import ChannelToggles from "../components/ChannelToggles";
import MultiSelect from "../components/MultiSelect";
import TimeRangePicker from "../components/TimeRangePicker";
import ToastArea from "../components/ToastArea";
import { toast } from "sonner";
import { defaultNotifications, EVENT_OPTIONS, LS_KEY_NOTIF, type Notifications } from "../data/mockSettingsNotifications";

const input = "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none";

export default function NotificationsSettingsPage() {
  const [data, setData] = useState<Notifications>(defaultNotifications);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_NOTIF);
      if (raw) setData(JSON.parse(raw) as Notifications);
    } catch {}
  }, []);

  const save = () => {
    try {
      localStorage.setItem(LS_KEY_NOTIF, JSON.stringify(data));
      toast.success("Сохранено");
    } catch { toast.error("Не удалось сохранить"); }
  };

  return (
    <>
      <ToastArea />
      <SettingsLayout>
        <SectionHeader
          title="Уведомления"
          hint="Выберите каналы и события для уведомлений"
          cta={<button onClick={save} className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90">Сохранить</button>}
        />
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 grid gap-3">
          <FormRow label="Каналы">
            <ChannelToggles
              email={data.channels.email}
              messenger={data.channels.messenger}
              toast={data.channels.toast}
              onChange={(v)=>setData({...data, channels: v})}
            />
          </FormRow>
          <FormRow label="Типы событий">
            <MultiSelect
              options={EVENT_OPTIONS}
              value={data.events}
              onChange={(v)=>setData({...data, events: v})}
            />
          </FormRow>
          <FormRow label="Не беспокоить">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!data.quietHours}
                  onChange={(e)=>setData({...data, quietHours: e.target.checked ? (data.quietHours || { from:"22:00", to:"08:00" }) : null})}
                />
                Включить
              </label>
            </div>
            {data.quietHours && (
              <div className="mt-2">
                <TimeRangePicker
                  from={data.quietHours.from}
                  to={data.quietHours.to}
                  onChange={(v)=>setData({...data, quietHours: v})}
                />
              </div>
            )}
          </FormRow>
          <FormRow label="Резюме за день">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.dailyDigest}
                onChange={(e)=>setData({...data, dailyDigest: e.target.checked})}
              />
              Присылать сводку на e-mail в 20:00
            </label>
          </FormRow>
        </section>
      </SettingsLayout>
    </>
  );
}