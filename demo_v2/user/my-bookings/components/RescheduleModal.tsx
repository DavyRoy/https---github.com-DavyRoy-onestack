"use client";

import { useMemo, useState } from "react";
import type { MyBooking } from "../data/mockUserMyBookings";
import { services } from "../../services/data/mockUserServices";

export default function RescheduleModal({ booking, onClose }: { booking: MyBooking | null; onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(() => booking?.start ?? null);
  const service = useMemo(() => (booking ? services.find((item) => item.id === booking.serviceId) ?? null : null), [booking]);
  const availableSlots = useMemo(() => {
    if (!service) return [];
    const now = new Date();
    return service.slots.filter((slot) => new Date(slot.start) > now).slice(0, 12);
  }, [service]);
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-[hsl(var(--fg))]">Перенести «{booking.serviceTitle}»</h3>
        <p className="text-sm text-[hsl(var(--muted))]">
          Выберите новое время. Запрос отправится менеджеру (демо режим — изменения не сохраняются).
        </p>

        {availableSlots.length ? (
          <div className="space-y-2 text-sm text-[hsl(var(--muted))]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted))]">Свободные слоты</p>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot) => {
                const slotDate = new Date(slot.start);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.start)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      selectedSlot === slot.start
                        ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))] text-white"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/70"
                    }`}
                  >
                    {slotDate.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })} • {slotDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-[hsl(var(--muted))]">Свободных слотов нет. Свяжитесь с менеджером для ручного переноса.</p>
        )}

        <div className="flex justify-end gap-2 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-white"
            disabled={!selectedSlot}
          >
            {selectedSlot ? "Отправить запрос" : "Выберите слот"}
          </button>
        </div>
      </div>
    </div>
  );
}
