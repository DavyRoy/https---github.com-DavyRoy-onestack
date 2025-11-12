"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { SERVICES } from "@/app/demo/manager/services/data/mockServices";
import { STAFF } from "@/app/demo/manager/services/data/mockStaff";
import { Slot, upsertSlot, deleteSlot } from "@/app/demo/manager/services/data/mockAvailability";

const T = {
  card: "rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-sm",
  input: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30",
  btn:   "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
  primary: "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-black hover:bg-white",
};

export type SlotDraft = {
  id?: string;
  date: string;
  from: string;
  to: string;
  serviceId: string;
  staffId: string;
  status: "available" | "busy" | "break";
};

export default function SlotEditorModal({
  open, onOpenChange, initial, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: SlotDraft;
  onSaved: (slots: Slot[]) => void;
}) {
  const [form, setForm] = useState<SlotDraft>(initial);

  useEffect(() => setForm(initial), [initial]);

  const save = () => {
    const id = form.id || ("sl-" + Math.random().toString(36).slice(2, 8));
    const slot: Slot = { id, ...form };
    const next = upsertSlot(slot);
    onSaved(next);
    onOpenChange(false);
  };
  const remove = () => {
    if (!form.id) return;
    const next = deleteSlot(form.id);
    onSaved(next);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/50 animate-in fade-in" />
        <Dialog.Content className={`fixed inset-x-3 top-[8svh] z-[91] mx-auto max-w-lg ${T.card}`}>
          <Dialog.Title className="text-base font-semibold">{form.id ? "Редактировать слот" : "Новый слот"}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-white/70">
            Задайте время, услугу, сотрудника и тип слота.
          </Dialog.Description>

          <div className="mt-3 grid gap-3">
            <div className="grid gap-1">
              <span className="text-xs text-white/70">Дата</span>
              <input className={T.input} type="date" value={form.date}
                     onChange={(e)=>setForm(f=>({...f, date: e.target.value}))}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-white/70">С</span>
                <input className={T.input} value={form.from} onChange={(e)=>setForm(f=>({...f, from: e.target.value}))} placeholder="HH:MM"/>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-white/70">До</span>
                <input className={T.input} value={form.to} onChange={(e)=>setForm(f=>({...f, to: e.target.value}))} placeholder="HH:MM"/>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-white/70">Услуга</span>
                <select className={T.input} value={form.serviceId} onChange={(e)=>setForm(f=>({...f, serviceId: e.target.value}))}>
                  {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-white/70">Сотрудник</span>
                <select className={T.input} value={form.staffId} onChange={(e)=>setForm(f=>({...f, staffId: e.target.value}))}>
                  {STAFF.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-1">
              <span className="text-xs text-white/70">Тип</span>
              <div className="flex gap-2">
                {(["available","busy","break"] as const).map(t => (
                  <button key={t} className={`${T.btn} ${form.status===t?"!bg-white !text-black":""}`}
                          onClick={()=>setForm(f=>({...f, status: t}))}>
                    {t==="available"?"Доступен":t==="busy"?"Занят":"Перерыв"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Dialog.Close className={T.btn}>Отмена</Dialog.Close>
            <div className="flex gap-2">
              {form.id && <button className={T.btn} onClick={remove}>Удалить</button>}
              <button className={T.primary} onClick={save}>Сохранить</button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}