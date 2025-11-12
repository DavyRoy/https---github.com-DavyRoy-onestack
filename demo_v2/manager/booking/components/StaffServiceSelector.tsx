// src/app/demo/manager/booking/components/StaffServiceSelector.tsx
"use client";

import { useId, useMemo } from "react";
import { Users, Scissors } from "lucide-react";
import { toast } from "sonner";

type Service = { id: string; title: string; category?: string; duration?: number };
type Staff = { id: string; name: string };

let SERVICES_FALLBACK: Service[] = [
  { id: "srv-hair-1", title: "Стрижка женская", category: "hair", duration: 60 },
  { id: "srv-hair-2", title: "Укладка", category: "hair", duration: 60 },
  { id: "srv-nails-1", title: "Покрытие гель-лак", category: "nails", duration: 60 },
  { id: "srv-nails-2", title: "Маникюр классический", category: "nails", duration: 60 },
  { id: "srv-spa-1", title: "Массаж спины", category: "spa", duration: 60 },
];
let STAFF_FALLBACK: Staff[] = [
  { id: "st-1", name: "Мария" },
  { id: "st-2", name: "Ирина" },
  { id: "st-3", name: "Сергей" },
];

// Пытаемся подтянуть реальные справочники, если они есть
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const svc = require("@/app/demo/manager/services/data/mockServices");
  if (Array.isArray(svc.SERVICES)) SERVICES_FALLBACK = svc.SERVICES as Service[];
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const st = require("@/app/demo/manager/services/data/mockStaff");
  if (Array.isArray(st.STAFF)) STAFF_FALLBACK = st.STAFF as Staff[];
} catch {
  // фоллбек остаётся
}

const T = {
  box: "grid gap-2 rounded-2xl border border-white/15 bg-white/[0.05] p-3",
  input:
    "w-full rounded-xl border border-white/15 bg-white/10 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30",
  label: "text-xs text-white/70",
  chip:
    "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.07] px-2 py-0.5 text-[11px] text-white/80",
};

export default function StaffServiceSelector({
  value,
  onChange,
}: {
  value: { serviceId?: string; staffId?: string };
  onChange: (v: { serviceId?: string; staffId?: string }) => void;
}) {
  const services = useMemo<Service[]>(() => SERVICES_FALLBACK, []);
  const staff = useMemo<Staff[]>(() => STAFF_FALLBACK, []);

  const serviceId = value.serviceId || "";
  const staffId = value.staffId || "";

  const serviceSelectId = useId();
  const staffSelectId = useId();

  const serviceTitle =
    services.find((s) => s.id === value.serviceId)?.title || value.serviceId;
  const serviceDuration = services.find((s) => s.id === value.serviceId)?.duration;
  const staffName = staff.find((s) => s.id === value.staffId)?.name || value.staffId;

  return (
    <div className={T.box}>
      <div className="grid gap-3 md:grid-cols-2">
        {/* Услуга */}
        <label className="grid gap-1" htmlFor={serviceSelectId}>
          <span className={T.label}>Услуга</span>
          <div className="relative">
            <Scissors
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
              width={16}
              height={16}
              aria-hidden
            />
            <select
              id={serviceSelectId}
              className={T.input}
              value={serviceId}
              onChange={(e) =>
                onChange({ ...value, serviceId: e.target.value || undefined })
              }
              aria-label="Выбор услуги"
              disabled={services.length === 0}
            >
              <option value="">{services.length ? "Выберите услугу…" : "Нет услуг"}</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                  {s.duration ? ` • ${s.duration} мин` : ""}
                </option>
              ))}
            </select>
          </div>
        </label>

        {/* Сотрудник */}
        <label className="grid gap-1" htmlFor={staffSelectId}>
          <span className={T.label}>Сотрудник/ресурс</span>
          <div className="relative">
            <Users
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
              width={16}
              height={16}
              aria-hidden
            />
            <select
              id={staffSelectId}
              className={T.input}
              value={staffId}
              onChange={(e) => onChange({ ...value, staffId: e.target.value || undefined })}
              aria-label="Выбор сотрудника"
              disabled={staff.length === 0}
            >
              <option value="">{staff.length ? "Любой" : "Нет сотрудников"}</option>
              {staff.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        {value.serviceId && (
          <span className={T.chip} title={serviceTitle || ""}>
            Услуга: <b>{serviceTitle}</b>
            {serviceDuration ? <span> • {serviceDuration} мин</span> : null}
          </span>
        )}
        {value.staffId && (
          <span className={T.chip} title={staffName || ""}>
            Сотрудник: <b>{staffName}</b>
          </span>
        )}
        <button
          type="button"
          className={T.chip + " hover:bg-white/10"}
          onClick={() => {
            onChange({ serviceId: undefined, staffId: undefined });
            toast.message("Сброшены выборы услуги и сотрудника");
          }}
          aria-label="Сбросить выбор услуги и сотрудника"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}