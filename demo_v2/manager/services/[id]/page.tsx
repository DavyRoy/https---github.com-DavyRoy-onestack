"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Home } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { SERVICES } from "@/app/demo/manager/services/data/mockServices";
import { SLOTS } from "@/app/demo/manager/services/data/mockAvailability";
import { STAFF } from "@/app/demo/manager/services/data/mockStaff";
import ServiceDetailHeader from "@/app/demo/manager/services/components/ServiceDetailHeader";

export default function ServiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES.find((s) => s.id === id);

  const upcoming = useMemo(
    () => SLOTS.filter((s) => s.serviceId === id && s.status === "available").slice(0, 6),
    [id]
  );

  if (!service) {
    return <div className="text-sm text-white/70">Услуга не найдена.</div>;
  }

  return (
    <div className="grid gap-6">
      <header className={T.hero} aria-label="Хлебные крошки">
        <nav className="flex items-center gap-1 text-xs text-white/70">
          <Link
            href="/demo/manager/dashboard"
            className="inline-flex items-center gap-1 hover:underline"
            aria-label="Перейти в дашборд"
          >
            <Home width={14} height={14} /> Дашборд
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/demo/manager/services" className="hover:underline">
            Услуги
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-white/80 truncate">{service.title}</span>
        </nav>
      </header>

      {/* ✅ раньше было durationMin */}
      <ServiceDetailHeader
        id={service.id}
        title={service.title}
        category={service.category}
        status={service.status}
        price={service.price}
        duration={service.duration}
      />

      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        {/* Описание и связанные услуги */}
        <section className={T.card + " grid gap-3"}>
          <div className="text-base font-semibold">Описание</div>
          <p className="text-sm text-white/80">{service.description || "—"}</p>

          {!!service.tags?.length && (
            <div className="flex flex-wrap gap-2" aria-label="Теги услуги">
              {service.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-xl border border-white/15 bg-white/10 px-2 py-1 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 text-sm text-white/70">Часто записываются с:</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICES
              .filter((s) => s.id !== service.id && s.category === service.category)
              .slice(0, 3)
              .map((s) => (
                <Link
                  key={s.id}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.07]"
                  href={`/demo/manager/services/${s.id}`}
                >
                  {s.title}
                </Link>
              ))}
          </div>
        </section>

        {/* Сайдбар: слоты и сотрудники */}
        <aside className="grid gap-4">
          <section className={T.card} aria-label="Ближайшие слоты">
            <div className="text-base font-semibold">Ближайшие слоты</div>
            <div className="mt-2 grid gap-2">
              {upcoming.length === 0 ? (
                <div className="text-sm text-white/70">
                  Нет слотов. Откройте расписание и добавьте доступность.
                </div>
              ) : (
                upcoming.map((sl) => {
                  const st = STAFF.find((s) => s.id === sl.staffId);
                  return (
                    <div
                      key={sl.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div className="text-sm tabular-nums">
                        {sl.date} • {sl.from}–{sl.to}
                      </div>
                      <div className="text-xs text-white/70 truncate">{st?.name}</div>
                      {/* ✅ раньше было "btn" */}
                      <Link
                        className={T.btn}
                        href={`/demo/manager/booking/new?service=${service.id}&slot=${sl.id}`}
                        aria-label={`Записать на слот ${sl.date} ${sl.from}–${sl.to}`}
                      >
                        Записать
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className={T.card} aria-label="Сотрудники услуги">
            <div className="text-base font-semibold">Кто оказывает</div>
            <div className="mt-2 grid gap-2">
              {service.staffIds?.length ? (
                service.staffIds.map((sid) => {
                  const s = STAFF.find((x) => x.id === sid);
                  return (
                    <div
                      key={sid}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm">{s?.name || "Сотрудник"}</div>
                        <div className="text-xs text-white/70 truncate">{s?.role || "—"}</div>
                      </div>
                      {/* ✅ раньше было "btn" */}
                      <Link
                        className={T.btn}
                        href={`/demo/manager/services/schedule?service=${service.id}&staff=${sid}`}
                        aria-label={`Открыть расписание для ${s?.name || "сотрудника"}`}
                      >
                        Расписание
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-white/70">
                  Никто не назначен. Добавьте сотрудников в настройках услуги.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}