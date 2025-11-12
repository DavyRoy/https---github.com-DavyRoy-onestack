// src/app/demo/manager/booking/reschedule/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { toast } from "sonner";
import { managerSurface as M, ManagerSection } from "@/app/demo/manager/ui/managerTheme";
import SlotPicker from "../../components/SlotPicker";
import { Booking, mockBookings } from "../../data/mockBookings";
import { Slot } from "../../data/mockSlotSearch";

function loadLocal(): Booking[] {
  try {
    const raw = localStorage.getItem("mgr_new_bookings_v1");
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export default function BookingReschedulePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rec, setRec] = useState<Booking | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const local = loadLocal();
    const found = [...local, ...mockBookings].find((b) => b.id === id) || null;
    setRec(found);
  }, [id]);

  const when = useMemo(() => {
    if (!rec) return "";
    const s = new Date(rec.startAt);
    const e = new Date(rec.endAt);
    const d = s.toLocaleDateString("ru-RU", { weekday: "short", day: "2-digit", month: "2-digit" });
    const ts = s.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    const te = e.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    return `${d} • ${ts}–${te}`;
  }, [rec?.startAt, rec?.endAt]); // точечные зависимости

  const doReschedule = (slot: Slot) => {
    if (!rec || pending) return;
    setPending(true);

    // оптимистично обновим локально
    const optimistic: Booking = {
      ...rec,
      startAt: slot.startAt,
      endAt: slot.endAt,
      staffId: slot.staffId,
      staffName: slot.staffName,
      status: "confirmed",
    };
    setRec(optimistic);

    // обновим localStorage, если запись была создана в демо-мастере
    try {
      const raw = localStorage.getItem("mgr_new_bookings_v1");
      const arr = raw ? (JSON.parse(raw) as Booking[]) : [];
      const idx = arr.findIndex((x) => x.id === rec.id);
      if (idx >= 0) {
        arr[idx] = optimistic;
        localStorage.setItem("mgr_new_bookings_v1", JSON.stringify(arr));
      }
    } catch {
      // no-op
    }

    toast.success(
      `Перенесено на ${new Date(slot.startAt).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
    router.push(`/demo/manager/booking/${rec.id}`);
  };

  if (!rec) {
    return (
      <div className={M.page}>
        <header className={M.hero}>
          <Link href="/demo/manager/booking" className={M.btn + " !px-2 !py-1.5"}>
            <ArrowLeft width={16} height={16} /> Назад
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Запись не найдена</h1>
        </header>
      </div>
    );
  }

  return (
    <div className={M.page}>
      <header className={M.hero}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-xs text-white/70" aria-label="Хлебные крошки">
              <Link href="/demo/manager/dashboard" className="hover:underline">
                <Home width={14} height={14} className="inline mr-1" />
                Дашборд
              </Link>
              <span className="opacity-40">/</span>
              <Link href={`/demo/manager/booking/${rec.id}`} className="hover:underline">
                Запись {rec.id}
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-white/80">Перенести</span>
            </nav>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Перенести {rec.id}</h1>
            <p className={"mt-1 text-sm " + M.dim}>
              Текущие: {when} • {rec.staffName}
            </p>
          </div>
        </div>
      </header>

      <ManagerSection
        title="Выбор нового слота"
        subtitle="Выберите время, подходящее клиенту. После подтверждения запись обновится автоматически"
      >
        <SlotPicker serviceId={rec.serviceId} staffId={rec.staffId} onPick={doReschedule} />
        <div className="flex gap-2">
          <Link href={`/demo/manager/booking/${rec.id}`} className={M.btn} aria-disabled={pending}>
            <ArrowLeft width={16} height={16} /> Отмена
          </Link>
        </div>
      </ManagerSection>
    </div>
  );
}