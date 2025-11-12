export type SlotStatus = "available" | "busy" | "break";
export type Slot = {
  id: string;
  serviceId: string;
  staffId: string;
  date: string;   // YYYY-MM-DD
  from: string;   // HH:mm
  to: string;     // HH:mm
  status: SlotStatus;
};

const LS_KEY = "mgr_services_slots_v1";
const todayISO = () => new Date().toISOString().slice(0, 10);

// базовый сид, если хранилище пустое
const seed: Slot[] = [
  { id: "sl-1", serviceId: "srv-cut-basic", staffId: "st-alex",  date: todayISO(), from: "11:00", to: "11:45", status: "available" },
  { id: "sl-2", serviceId: "srv-manicure",  staffId: "st-daria", date: todayISO(), from: "12:30", to: "13:30", status: "available" },
  { id: "sl-3", serviceId: "srv-color",     staffId: "st-olga",  date: todayISO(), from: "14:00", to: "16:00", status: "busy" },
  { id: "sl-4", serviceId: "srv-brows",     staffId: "st-daria", date: todayISO(), from: "17:00", to: "17:30", status: "available" },
];

// ——— API ———
export function loadSlots(): Slot[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(seed));
      return [...seed];
    }
    const arr = JSON.parse(raw) as Slot[];
    return Array.isArray(arr) ? arr : [...seed];
  } catch {
    return [...seed];
  }
}

export function saveSlots(next: Slot[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {}
}

export function upsertSlot(s: Slot) {
  const all = loadSlots();
  const i = all.findIndex(x => x.id === s.id);
  const next = i >= 0 ? (all[i] = s, all) : [s, ...all];
  saveSlots(next);
  return next;
}

export function deleteSlot(id: string) {
  const all = loadSlots().filter(s => s.id !== id);
  saveSlots(all);
  return all;
}