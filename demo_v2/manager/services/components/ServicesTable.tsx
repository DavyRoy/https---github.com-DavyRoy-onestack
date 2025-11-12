"use client";

import Link from "next/link";
import PriceBadge from "./PriceBadge";
import DurationBadge from "./DurationBadge";
import { ServiceEntity } from "./ServiceCard";

type Props = {
  services?: (ServiceEntity | undefined | null)[];
  onBook?: (id: string) => void;
  onSchedule?: (id: string) => void;
};

export default function ServicesTable({ services, onBook, onSchedule }: Props) {
  const rows: ServiceEntity[] = (services ?? []).filter(
    (s): s is ServiceEntity => !!s && typeof s.id === "string"
  );

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.05] overflow-x-auto">
      <table className="min-w-[720px] w-full text-sm">
        <thead>
          <tr className="text-white/70 border-b border-white/10">
            <th className="text-left p-3">Услуга</th>
            <th className="text-left p-3">Категория</th>
            <th className="text-left p-3">Длительность</th>
            <th className="text-left p-3">Цена</th>
            <th className="text-left p-3">Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-b border-white/5">
              <td className="p-3">
                <Link href={`/demo/manager/services/${s.id}`} className="hover:underline">
                  {s.title}
                </Link>
              </td>
              <td className="p-3">{s.category || "—"}</td>
              <td className="p-3"><DurationBadge mins={s.duration} /></td>
              <td className="p-3"><PriceBadge value={s.price} /></td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 hover:bg-white/15"
                    onClick={() => onBook?.(s.id)}
                  >
                    Записать
                  </button>
                  <button
                    className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 hover:bg-white/15"
                    onClick={() => onSchedule?.(s.id)}
                  >
                    Расписание
                  </button>
                  <Link
                    className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 hover:bg-white/15"
                    href={`/demo/manager/services/${s.id}`}
                  >
                    Детали
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-3 text-white/70" colSpan={5}>Нет услуг</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}