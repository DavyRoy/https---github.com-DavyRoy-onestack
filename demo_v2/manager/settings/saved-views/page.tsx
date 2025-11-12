"use client";

import { useEffect, useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import SectionHeader from "../components/SectionHeader";
import SavedViewCard from "../components/SavedViewCard";
import ToastArea from "../components/ToastArea";
import { toast } from "sonner";

type SavedView = { id: string; title: string; where: string; href: string };
const LS = "demo_manager_settings_savedviews_v1";

export default function SavedViewsPage() {
  const [list, setList] = useState<SavedView[]>([
    { id: "sv1", title: "Заказы: оплаченные 7д", where: "Заказы", href: "/demo/manager/orders?status=paid&period=7d" },
    { id: "sv2", title: "Брони: сегодня", where: "Бронирование", href: "/demo/manager/booking?date=today" },
  ]);

  useEffect(() => { try { const raw = localStorage.getItem(LS); if (raw) setList(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(list)); } catch {} }, [list]);

  const add = () => {
    const id = "sv-" + Math.random().toString(36).slice(2,7);
    setList([{ id, title: "Новый вид (демо)", where: "CRM Лиды", href: "/demo/manager/crm/leads?filter=my" }, ...list]);
    toast("Сохранён вид (демо)");
  };

  const rename = (id: string) => {
    const t = prompt("Новое название вида:");
    if (!t) return;
    setList(list.map(v => v.id === id ? { ...v, title: t } : v));
  };

  const del = (id: string) => {
    setList(list.filter(v => v.id !== id));
    toast("Удалено");
  };

  return (
    <>
      <ToastArea/>
      <SettingsLayout>
        <SectionHeader title="Сохранённые виды" hint="Шорткаты для часто используемых фильтров" cta={<button onClick={add} className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90">Создать новый вид</button>} />
        <section className="grid gap-3">
          {list.map(v => (
            <SavedViewCard key={v.id} title={v.title} where={v.where} href={v.href} onRename={()=>rename(v.id)} onDelete={()=>del(v.id)} />
          ))}
        </section>
      </SettingsLayout>
    </>
  );
}