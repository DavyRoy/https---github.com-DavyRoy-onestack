// src/app/demo/manager/booking/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Home, CheckCheck, X, CalendarPlus, ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";
import { managerSurface as M, ManagerSection } from "@/app/demo/manager/ui/managerTheme";
import { Booking, mockBookings } from "../data/mockBookings";
import StatusBadge from "../components/StatusBadge";
import BookingTimeline, { TimelineItem } from "../components/BookingTimeline";

// попытка импортировать реальных сотрудников, иначе — фоллбек
let STAFF: { id: string; name: string }[] = [
  { id: "st-1", name: "Мария" },
  { id: "st-2", name: "Ирина" },
  { id: "st-3", name: "Сергей" },
];
try {
  // @ts-ignore
  const mod = require("@/app/demo/manager/services/data/mockStaff");
  if (Array.isArray(mod.STAFF)) STAFF = mod.STAFF;
} catch {}

function loadLocal(): Booking[] {
  try {
    const raw = localStorage.getItem("mgr_new_bookings_v1");
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}
function saveLocal(update: Booking) {
  try {
    const raw = localStorage.getItem("mgr_new_bookings_v1");
    const arr = raw ? (JSON.parse(raw) as Booking[]) : [];
    const idx = arr.findIndex((x) => x.id === update.id);
    if (idx >= 0) {
      arr[idx] = update;
      localStorage.setItem("mgr_new_bookings_v1", JSON.stringify(arr));
    }
  } catch {}
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rec, setRec] = useState<Booking | null>(null);

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
  }, [rec]);

  const pushTimeline = (text: string, kind: TimelineItem["kind"] = "status") => {
    const item: TimelineItem = {
      id: Math.random().toString(36).slice(2, 8),
      ts: new Date().toISOString(),
      kind,
      text,
    };
    window.dispatchEvent(new CustomEvent("mgr-booking-timeline", { detail: { bookingId: id, item } }));
  };

  const setStatus = (next: Booking["status"]) => {
    if (!rec) return;
    const upd = { ...rec, status: next };
    setRec(upd);
    saveLocal(upd);
    pushTimeline(`Статус: ${statusRu(rec.status)} → ${statusRu(next)}`);
    toast.success("Статус обновлён");
  };

  const assignStaff = (staffId: string) => {
    if (!rec) return;
    const staff = STAFF.find((s) => s.id === staffId);
    const upd = { ...rec, staffId, staffName: staff?.name || staffId };
    setRec(upd);
    saveLocal(upd);
    pushTimeline(`Назначен сотрудник: ${upd.staffName}`);
    toast.success("Сотрудник назначен");
  };

  // --- Пустое состояние (фикс: использует стили из M, вместо несуществующего T) ---
  if (!rec) {
    return (
      <div className="grid gap-6">
        <header className={M.hero}>
          <Link href="/demo/manager/booking" className={M.btn + " !px-2 !py-1.5"}>
            <ArrowLeft width={16} height={16} /> Назад
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Запись не найдена</h1>
          <p className={"text-sm " + M.dim}>Проверьте адрес или вернитесь к списку.</p>
        </header>
      </div>
    );
  }

  const staffKnown = STAFF.some((s) => s.id === rec.staffId);

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
              <Link href="/demo/manager/booking" className="hover:underline">
                Бронирование
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-white/80">{rec.id}</span>
            </nav>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Запись {rec.id}</h1>
              <StatusBadge status={rec.status} />
            </div>
            <p className={"mt-1 text-sm " + M.dim}>{when} • {rec.staffName}</p>
          </div>
          <div className="hidden md:flex flex-col gap-2">
            {(rec.status === "new" || rec.status === "pending") && (
              <button className={M.btnPrimary} onClick={() => setStatus("confirmed")}>
                <CheckCheck width={16} height={16} /> Подтвердить
              </button>
            )}
            <Link href={`/demo/manager/booking/reschedule/${rec.id}`} className={M.btn}>
              <CalendarPlus width={16} height={16} /> Перенести
            </Link>
            {rec.status === "confirmed" && (
              <>
                <button className={M.btn} onClick={() => setStatus("completed")}>
                  Состоялась
                </button>
                <button className={M.btn} onClick={() => setStatus("noshow")}>
                  <X width={16} height={16} /> Не явился
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <ManagerSection
            title="Клиент и услуга"
            subtitle="Информация о посетителе, выбранной услуге и назначенном специалисте"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">Клиент</div>
                <div className="text-sm">{rec.clientName}</div>
                <div className={M.dim + " text-xs"}>{rec.clientPhone || rec.clientEmail || "—"}</div>
                <div className="mt-2 text-xs">
                  <Link href={`/demo/manager/crm/clients/${rec.clientId || "C-NEW"}`} className="underline">
                    Открыть в CRM
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">Услуга и сотрудник</div>
                <div className="text-sm">{rec.serviceTitle || rec.serviceId}</div>
                <label className="mt-2 grid gap-1">
                  <span className="text-xs text-white/70 inline-flex items-center gap-1">
                    <Users width={14} height={14} /> Назначить сотрудника
                  </span>
                  <select
                    className={M.input}
                    value={rec.staffId}
                    onChange={(e) => assignStaff(e.target.value)}
                    aria-label="Назначить сотрудника"
                  >
                    {/* если текущего нет в справочнике, покажем как «(вне списка)» */}
                    {!staffKnown && rec.staffId ? (
                      <option value={rec.staffId}>{rec.staffName || rec.staffId} (вне списка)</option>
                    ) : null}
                    {STAFF.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {rec.note ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                Комментарий: {rec.note}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                className={M.btn}
                onClick={() => {
                  pushTimeline("Отправлено напоминание клиенту", "system");
                  toast.message("Напоминание отправлено (демо)");
                }}
              >
                Отправить напоминание
              </button>
              <button className={M.btn} onClick={() => setStatus("cancelled")}>
                Отменить
              </button>
            </div>
          </ManagerSection>

          <ManagerSection title="Лента изменений" subtitle="Записывает статусы и действия менеджера">
            <BookingTimeline
              bookingId={rec.id}
              initial={[
                { id: "t1", ts: rec.createdAt, kind: "system", text: "Создана запись" },
                { id: "t2", ts: rec.createdAt, kind: "status", text: `Статус: ${statusRu("new")}` },
              ]}
            />
          </ManagerSection>
        </div>

        <div className="grid gap-4">
          <ManagerSection title="Даты" subtitle="Текущие временные параметры записи">
            <div className="text-sm">{when}</div>
            <div className={M.dim + " text-xs"}>
              Создано: {new Date(rec.createdAt).toLocaleString("ru-RU")}
            </div>
          </ManagerSection>

          <ManagerSection title="Быстрые ссылки">
            <div className="grid gap-2 text-sm">
              <Link
                className="underline"
                href={`/demo/manager/services/schedule?service=${rec.serviceId}&staff=${rec.staffId}`}
              >
                Открыть слоты услуги
              </Link>
              <Link className="underline" href={`/demo/manager/booking/reschedule/${rec.id}`}>
                Перенести запись
              </Link>
            </div>
          </ManagerSection>
        </div>
      </div>
    </div>
  );
}

function statusRu(s: Booking["status"]) {
  switch (s) {
    case "new":
      return "Новый";
    case "pending":
      return "В ожидании";
    case "confirmed":
      return "Подтверждён";
    case "completed":
      return "Состоялся";
    case "cancelled":
      return "Отменён";
    case "noshow":
      return "Не явился";
    case "rescheduled":
      return "Перенесён";
    default:
      return s;
  }
}