"use client";

import { useEffect, useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import FormRow from "../components/FormRow";
import ToastArea from "../components/ToastArea";
import { toast } from "sonner";
import { defaultProfile, LS_KEY_PROFILE, type Profile } from "../data/mockSettingsProfile";

const inputCls = "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none";

export default function ProfileSettingsPage() {
  const [data, setData] = useState<Profile>(defaultProfile);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_PROFILE);
      if (raw) setData(JSON.parse(raw) as Profile);
    } catch {}
  }, []);

  const save = () => {
    if (!data.firstName || !data.lastName) return toast.error("Имя и фамилия обязательны");
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) return toast.error("Некорректный e-mail");
    try {
      localStorage.setItem(LS_KEY_PROFILE, JSON.stringify(data));
      toast.success("Сохранено");
    } catch (e) {
      toast.error("Не удалось сохранить");
    }
  };

  const reset = () => setData(defaultProfile);

  const onAvatar = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      setData((d) => ({ ...d, avatar: url }));
      setPreview(url);
    };
    reader.readAsDataURL(f);
  };

  return (
    <>
      <ToastArea />
      <SettingsLayout>
        <SectionHeader
          title="Профиль менеджера"
          hint="Эти данные используются в CRM и письмах"
          cta={
            <div className="flex gap-2">
              <button onClick={reset} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">Отмена</button>
              <button onClick={save} className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90">Сохранить</button>
            </div>
          }
        />
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 grid gap-3 md:grid-cols-2">
          <FormRow label="Имя">
            <input className={inputCls} value={data.firstName} onChange={(e)=>setData({...data, firstName:e.target.value})}/>
          </FormRow>
          <FormRow label="Фамилия">
            <input className={inputCls} value={data.lastName} onChange={(e)=>setData({...data, lastName:e.target.value})}/>
          </FormRow>
          <FormRow label="Должность">
            <input className={inputCls} value={data.title||""} onChange={(e)=>setData({...data, title:e.target.value})}/>
          </FormRow>
          <FormRow label="Телефон">
            <input className={inputCls} value={data.phone||""} onChange={(e)=>setData({...data, phone:e.target.value})}/>
          </FormRow>
          <FormRow label="E-mail">
            <input className={inputCls} value={data.email} onChange={(e)=>setData({...data, email:e.target.value})}/>
          </FormRow>
          <FormRow label="Часовой пояс">
            <select className={inputCls} value={data.tz} onChange={(e)=>setData({...data, tz:e.target.value})}>
              <option value="Asia/Seoul">Asia/Seoul</option>
              <option value="Europe/Moscow">Europe/Moscow</option>
              <option value="UTC">UTC</option>
            </select>
          </FormRow>
          <FormRow label="Язык интерфейса">
            <select className={inputCls} value={data.locale} onChange={(e)=>setData({...data, locale: e.target.value as any})}>
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="ko">한국어</option>
            </select>
          </FormRow>
          <FormRow label="Аватар" help="Загрузка демо — сохраняется как dataURL в localStorage">
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e)=>onAvatar(e.target.files?.[0]||null)} />
              {(data.avatar || preview) && <img src={data.avatar || preview} alt="avatar" className="h-12 w-12 rounded-full object-cover border border-white/15" />}
            </div>
          </FormRow>
          <FormRow label="Подпись в письмах" help="Используется в отправке счетов/напоминаний (демо)">
            <textarea rows={5} className={inputCls} value={data.signature||""} onChange={(e)=>setData({...data, signature:e.target.value})}/>
          </FormRow>
        </section>
      </SettingsLayout>
    </>
  );
}