"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import BookingActionsMenu from "./BookingActionsMenu";
import { Booking } from "../data/mockBookings";

export default function BookingRow({
  b,
  selected,
  onToggle,
  onInlineAction,
}: {
  b: Booking;
  selected: boolean;
  onToggle: (id: string, checked: boolean) => void;
  onInlineAction: (id: string, nextStatus: string) => void;
}) {
  const start = new Date(b.startAt);
  const dateStr = start.toLocaleDateString("ru-RU");
  const timeStr = start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const startStr = `${dateStr} • ${timeStr}`;

  const clientLine2 = b.clientPhone || b.clientEmail || "—";

  return (
    <tr className="border-b border-white/10 hover:bg-white/[0.04]">
      {/* чекбокс */}
      <td className="p-2 align-middle">
        <input
          type="checkbox"
          className="accent-white"
          checked={selected}
          onChange={(e) => onToggle(b.id, e.target.checked)}
          aria-label={`Выбрать запись ${b.id}`}
        />
      </td>

      {/* дата/время */}
      <td className="p-2 align-middle whitespace-nowrap">
        <Link
          href={`/demo/manager/booking/${b.id}`}
          prefetch={false}
          className="underline decoration-white/40 hover:decoration-white tabular-nums"
          aria-label={`Открыть запись ${b.id} от ${dateStr} в ${timeStr}`}
          title={`${dateStr} • ${timeStr}`}
        >
          {/* На мобиле — в две строки; на md+ — как раньше */}
          <span className="md:hidden block leading-tight">
            {dateStr}
            <br />
            {timeStr}
          </span>
          <span className="hidden md:inline">{startStr}</span>
        </Link>
      </td>

      {/* клиент */}
      <td className="p-2 align-middle max-w-[140px] md:max-w-none">
        <div className="truncate" title={b.clientName}>
          {b.clientName}
        </div>
        <div className="text-xs text-white/60 truncate" title={clientLine2}>
          {clientLine2}
        </div>
      </td>

      {/* услуга / сотрудник */}
      <td className="p-2 align-middle max-w-[160px] md:max-w-none">
        <div className="truncate" title={b.serviceTitle}>
          {b.serviceTitle}
        </div>
        <div
          className="text-xs text-white/60 truncate"
          title={b.staffName ? `Сотр.: ${b.staffName}` : "Сотр.: —"}
        >
          Сотр.: {b.staffName || "—"}
        </div>
      </td>

      {/* статус */}
      <td className="p-2 align-middle">
        <StatusBadge status={b.status} />
      </td>

      {/* источник */}
      <td className="p-2 align-middle text-xs text-white/70 whitespace-nowrap">
        {b.source}
      </td>

      {/* действия */}
      <td className="p-2 align-middle text-right">
        <BookingActionsMenu
          id={b.id}
          status={b.status}
          onAction={(next) => onInlineAction(b.id, next)}
        />
      </td>
    </tr>
  );
}