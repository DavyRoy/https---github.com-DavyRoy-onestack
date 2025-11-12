// app/demo/admin/booking/schedules/page.tsx
"use client";

import * as React from "react";
import SchedulesHeader, { type SchedulesHeaderValue } from "@/app/demo/admin/booking/components/SchedulesHeader";
import WeekGrid from "@/app/demo/admin/booking/components/WeekGrid";
import Legend from "@/app/demo/admin/booking/components/Legend";
import Skeletons from "@/app/demo/admin/booking/components/Skeletons";
import {
  ADMIN_TEMPLATES,
  ADMIN_EXCEPTIONS,
  ADMIN_RESERVATIONS,
  type AdminTemplate,
  type AdminException,
} from "@/app/demo/(shared)/booking";

/* helpers */
function startOfWeekISO(base?: Date) {
  const d = base ? new Date(base) : new Date();
  const day = (d.getDay() + 6) % 7; // пн=0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export default function AdminSchedulesPage() {
  const [loading, setLoading] = React.useState(true);

  // Состояние для нового SchedulesHeader (единый value)
  const [hdr, setHdr] = React.useState<SchedulesHeaderValue>(() => ({
    weekStart: startOfWeekISO(),
    serviceId: undefined,
    resourceId: undefined,
    locationId: undefined,
    policyId: undefined,
  }));

  // Демо-состояния
  const [templates, setTemplates] = React.useState<AdminTemplate[]>(() => {
    if (typeof window === "undefined") return ADMIN_TEMPLATES;
    try {
      const raw = localStorage.getItem("admin.templates");
      return raw ? (JSON.parse(raw) as AdminTemplate[]) : ADMIN_TEMPLATES;
    } catch {
      return ADMIN_TEMPLATES;
    }
  });
  const [exceptions, setExceptions] = React.useState<AdminException[]>(ADMIN_EXCEPTIONS);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 180);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin.templates", JSON.stringify(templates));
      } catch {}
    }
  }, [templates]);

  return (
    <div className="grid gap-6">
      <SchedulesHeader
        value={hdr}
        onChange={setHdr}
        onCreateTemplate={() => alert("Демо: создать шаблон")}
        onCreateException={() => alert("Демо: добавить исключение")}
        onExport={() => alert("Демо экспорт (CSV/ICS)")}
      />

      {loading ? (
        <Skeletons />
      ) : (
        <>
          <WeekGrid
            weekStart={hdr.weekStart}
            templates={templates}
            exceptions={exceptions}
            reservations={ADMIN_RESERVATIONS}
            onTemplatesChange={setTemplates}
            onExceptionsChange={setExceptions}
            filters={{
              serviceId: hdr.serviceId,
              resourceId: hdr.resourceId,
              locationId: hdr.locationId,
            }}
          />
          <Legend />
        </>
      )}
    </div>
  );
}