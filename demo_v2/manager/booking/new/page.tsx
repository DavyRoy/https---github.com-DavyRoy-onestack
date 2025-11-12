// src/app/demo/manager/booking/new/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, UserPlus, Check, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { managerSurface as M, ManagerSection } from "@/app/demo/manager/ui/managerTheme";
import StaffServiceSelector from "../components/StaffServiceSelector";
import SlotPicker from "../components/SlotPicker";
import type { Slot } from "../data/mockSlotSearch";

function genId() {
  try {
    return "BKG-" + crypto.randomUUID().slice(0, 6).toUpperCase();
  } catch {
    return "BKG-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  }
}

export default function NewBookingWizardPage() {
  const router = useRouter();

  // Шаг 1 — Клиент
  const [client, setClient] = useState({ name: "", phone: "", email: "" });

  // Шаг 2 — Услуга/Сотрудник
  const [ss, setSS] = useState<{ serviceId?: string; staffId?: string }>({});

  // Шаг 3 — Слот
  const [picked, setPicked] = useState<Slot | null>(null);
  const [note, setNote] = useState("");
  const [sendReminder, setSendReminder] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    const nameOk = client.name.trim().length > 0;
    return nameOk && !!ss.serviceId && !!picked && !submitting;
  }, [client.name, ss.serviceId, picked, submitting]);

  const createBooking = () => {
    if (!picked || !ss.serviceId) return;
    const name = client.name.trim();
    if (!name) {
      toast.error("Укажите имя клиента");
      return;
    }
    setSubmitting(true);

    const id = genId();
    const rec = {
      id,
      clientId: "C-NEW",
      clientName: name,
      clientPhone: client.phone.trim(),
      clientEmail: client.email.trim(),
      serviceId: picked.serviceId,
      // В демо нет справочника названий здесь — оставляем плейсхолдер.
      serviceTitle: "Услуга",
      staffId: picked.staffId,
      staffName: picked.staffName,
      source: "manager" as const,
      startAt: picked.startAt,
      endAt: picked.endAt,
      createdAt: new Date().toISOString(),
      status: "new" as const,
      note: note.trim() || undefined,
      price: undefined,
    };

    try {
      const raw = localStorage.getItem("mgr_new_bookings_v1");
      const arr = raw ? (JSON.parse(raw) as any[]) : [];
      arr.unshift(rec);
      localStorage.setItem("mgr_new_bookings_v1", JSON.stringify(arr));
      toast.success("Запись создана (демо): Новая");
      if (sendReminder) toast.message("Отправлено напоминание клиенту (демо)");
      router.push(`/demo/manager/booking/${id}`);
    } catch {
      toast.error("Не удалось сохранить запись в демо-хранилище");
      setSubmitting(false);
    }
  };

  return (
    <div className={M.page}>
      <header className={M.hero}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link href="/demo/manager/booking" className={M.btn + " !px-2 !py-1.5"} aria-label="Назад к списку">
                <ArrowLeft width={16} height={16} /> Назад
              </Link>
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Новая запись</h1>
            <p className={"mt-1 text-sm " + M.dim} aria-live="polite">
              3 шага: клиент → услуга/сотрудник → слот
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className={M.chip + " text-white/80"}>
              <CalendarPlus width={12} height={12} /> Wizard (демо)
            </div>
          </div>
        </div>
      </header>

      <ManagerSection title="1) Клиент" subtitle="Введите данные нового клиента или подставьте демо">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs text-white/70">Имя</span>
            <input
              className={M.input}
              placeholder="Иван Петров"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              aria-required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-white/70">Телефон</span>
            <input
              className={M.input}
              placeholder="+7 900 ..."
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              inputMode="tel"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-white/70">E-mail</span>
            <input
              className={M.input}
              placeholder="client@example.com"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
              inputMode="email"
            />
          </label>
        </div>
        <div className="mt-1 text-xs text-white/70">
          Или выберите существующего клиента в CRM (демо).
          <button
            className={M.btn + " ml-2"}
            onClick={() =>
              setClient({
                name: "Анна Петрова",
                phone: "+7 900 111-22-33",
                email: "anna@example.com",
              })
            }
          >
            <UserPlus width={14} height={14} /> Подставить демо
          </button>
        </div>
      </ManagerSection>

      <ManagerSection title="2) Услуга и сотрудник" subtitle="Выберите комбинацию для бронирования">
        <StaffServiceSelector value={ss} onChange={setSS} />
      </ManagerSection>

      <ManagerSection
        title="3) Выбор слота"
        subtitle="Подтвердите дату, время и при необходимости оставьте комментарий"
      >
        <SlotPicker
          serviceId={ss.serviceId}
          staffId={ss.staffId}
          onPick={(s) => {
            setPicked(s);
            toast.message(
              `Выбран слот: ${new Date(s.startAt).toLocaleString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })} • ${s.staffName}`
            );
          }}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs text-white/70">Комментарий (опц.)</span>
            <input
              className={M.input}
              placeholder="Пожелания клиента…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <label className="mt-1 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-white"
              checked={sendReminder}
              onChange={(e) => setSendReminder(e.target.checked)}
            />
            Отправить напоминание (демо)
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={M.btnPrimary}
            disabled={!canSubmit}
            onClick={createBooking}
            aria-disabled={!canSubmit}
          >
            <Check width={16} height={16} /> Создать запись
          </button>
          <Link href="/demo/manager/booking" className={M.btn}>
            Отмена
          </Link>
        </div>
      </ManagerSection>
    </div>
  );
}