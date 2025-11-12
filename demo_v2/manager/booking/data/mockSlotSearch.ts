// src/app/demo/manager/booking/data/mockSlotSearch.ts
export type Slot = {
  id: string;
  serviceId: string;
  staffId: string;
  staffName: string;
  startAt: string; // ISO
  endAt: string;   // ISO
};

// ===== helpers =====
const addMin = (d: Date, m: number) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() + m);
  return x;
};

const iso = (d: Date) => d.toISOString();

// ===== mock data =====
const STAFF: Record<string, string> = {
  "st-1": "Мария",
  "st-2": "Ирина",
  "st-3": "Сергей",
};

const DURATIONS: Record<string, number> = {
  "srv-hair-1": 60,
  "srv-hair-2": 60,
  "srv-nails-1": 60,
  "srv-nails-2": 60,
  "srv-spa-1": 60,
};

/**
 * Генерация доступных слотов на 7 дней вперёд.
 * Если указаны serviceId или staffId — фильтрует только по ним.
 */
export function genSlotsForWeek(serviceId?: string, staffId?: string): Slot[] {
  const res: Slot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const serviceIds = serviceId ? [serviceId] : Object.keys(DURATIONS);
  const staffIds = staffId ? [staffId] : Object.keys(STAFF);

  for (let d = 0; d < 7; d++) {
    const day = new Date(today.getTime() + d * 86400000); // каждый день недели
    for (const sId of serviceIds) {
      const dur = DURATIONS[sId] ?? 60;
      for (const stId of staffIds) {
        // 5 слотов в день: 10:00, 12:00, 14:00, 16:00, 18:00
        [10, 12, 14, 16, 18].forEach((h) => {
          const start = new Date(day);
          start.setHours(h, 0, 0, 0);
          const end = addMin(start, dur);

          // простая логика "занятости": убираем часть слотов
          const busySeed = (h + (sId.length % 3) + (stId.length % 2)) % 4 === 0;
          if (!busySeed) {
            res.push({
              id: `${sId}-${stId}-${day.toISOString().slice(0, 10)}-${h}`,
              serviceId: sId,
              staffId: stId,
              staffName: STAFF[stId] || "Сотрудник",
              startAt: iso(start),
              endAt: iso(end),
            });
          }
        });
      }
    }
  }

  return res;
}

/**
 * Интерфейсный метод, который используют UI-компоненты.
 * Возвращает сгенерированные слоты на неделю.
 */
export function searchSlots(params: { serviceId?: string; staffId?: string }) {
  return genSlotsForWeek(params.serviceId, params.staffId);
}