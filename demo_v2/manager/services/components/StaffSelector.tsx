"use client";

import { STAFF } from "@/app/demo/manager/services/data/mockStaff";

export default function StaffSelector({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <select className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm" value={value} onChange={(e)=>onChange(e.target.value)}>
      <option value="">Все сотрудники</option>
      {STAFF.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
  );
}