"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Home, Plus } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { SERVICES } from "@/app/demo/manager/services//data/mockServices";
import { STAFF } from "@/app/demo/manager/services//data/mockStaff";
import { loadSlots, saveSlots, type Slot } from "@/app/demo/manager/services//data/mockAvailability";
import AvailabilityLegend from "@/app/demo/manager/services//components/AvailabilityLegend";
import StaffSelector from "@/app/demo/manager/services//components/StaffSelector";
import AvailabilityGrid from "@/app/demo/manager/services//components/AvailabilityGrid";
import SlotEditorModal, { type SlotDraft } from "@/app/demo/manager/services//components/SlotEditorModal";

function getWeek(startFromISO: string) {
  const d = new Date(startFromISO);
  const w = d.getDay(); // 0..6
  const monday = new Date(d);
  const diff = ((w + 6) % 7);
  monday.setDate(d.getDate() - diff);
  return Array.from({length:7}, (_,i) => {
    const x = new Date(monday); x.setDate(monday.getDate()+i);
    return x.toISOString().slice(0,10);
  });
}

export default function ServicesSchedulePage() {
  const sp = useSearchParams();
  const serviceParam = sp.get("service") || "";
  const staffParam = sp.get("staff") || "";

  const [service, setService] = useState(serviceParam);
  const [staff, setStaff] = useState(staffParam);
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(()=> setSlots(loadSlots()), []);

  const today = new Date().toISOString().slice(0,10);
  const week = useMemo(()=>getWeek(today), [today]);

  const current = useMemo<Slot[]>(() => {
    return slots.filter(s => (!service || s.serviceId===service) && (!staff || s.staffId===staff) && week.includes(s.date));
  }, [service, staff, week, slots]);

  // ——— Modal state ———
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SlotDraft | null>(null);

  const openCreate = (date: string, from: string, to: string) => {
    const fallbackService = service || SERVICES[0]?.id || "";
    const fallbackStaff = staff || STAFF[0]?.id || "";
    setDraft({ date, from, to, serviceId: fallbackService, staffId: fallbackStaff, status: "available" });
    setOpen(true);
  };
  const openEdit = (s: Slot) => {
    setDraft({ id: s.id, date: s.date, from: s.from, to: s.to, serviceId: s.serviceId, staffId: s.staffId, status: s.status });
    setOpen(true);
  };
  const onSaved = (next: Slot[]) => {
    setSlots(next);
    saveSlots(next);
  };

  return (
    <div className="grid gap-6">
      <header className={T.hero}>
        <div className="flex items-start justify-between">
          <div>
            <nav className="flex items-center gap-1 text-xs text-white/70">
              <Link href="/demo/manager/dashboard" className="inline-flex items-center gap-1 hover:underline">
                <Home width={14} height={14}/> Дашборд
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/demo/manager/services" className="hover:underline">Услуги</Link>
              <span className="opacity-40">/</span>
              <span className="text-white/80">Расписание</span>
            </nav>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Расписание</h1>
            <p className="mt-1 text-sm text-white/70">Управляйте доступностью слотов на неделю. Выделяйте мышью, чтобы создать диапазон.</p>
          </div>
          <Link href="/demo/manager/calendar" className="btn">
            <Calendar width={16} height={16}/> Общий календарь
          </Link>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-4 md:items-end">
          <label className="grid gap-1">
            <span className="text-xs text-white/70">Услуга</span>
            <select className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm" value={service} onChange={(e)=>setService(e.target.value)}>
              <option value="">Все услуги</option>
              {SERVICES.filter(s=>s.status==="active").map(s=>(
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-white/70">Сотрудник</span>
            <StaffSelector value={staff} onChange={setStaff}/>
          </label>

          <div className="grid gap-1">
            <span className="text-xs text-white/70">Неделя</span>
            <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm">
              {week[0]} — {week[6]}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn" onClick={()=>openCreate(week[0], "10:00", "10:30")}>
              <Plus width={16} height={16}/> Добавить слот
            </button>
          </div>
        </div>

        <div className="mt-3">
          <AvailabilityLegend />
        </div>
      </header>

      <section className="grid gap-3">
        <AvailabilityGrid
          week={week}
          slots={current}
          onCreateRange={openCreate}
          onEditSlot={openEdit}
        />
      </section>

      {draft && (
        <SlotEditorModal
          open={open}
          onOpenChange={setOpen}
          initial={draft}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}