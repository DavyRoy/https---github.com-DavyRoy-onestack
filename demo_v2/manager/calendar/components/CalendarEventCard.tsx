"use client";

import StatusBadge from "./StatusBadge";
import { CalEvent, timeLabel } from "./types";

function colorByStatus(s: CalEvent["status"]) {
  switch (s) {
    case "confirmed":
      return "bg-emerald-500/20 border-emerald-400/40";
    case "pending":
      return "bg-yellow-500/20 border-yellow-400/40";
    case "cancelled":
      return "bg-red-500/20 border-red-400/40";
    case "completed":
      return "bg-emerald-500/20 border-emerald-400/40";
    default:
      return "bg-blue-500/20 border-blue-400/40";
  }
}

export default function CalendarEventCard({
  ev,
  onOpen,
  onDragStart,
}: {
  ev: CalEvent;
  onOpen: (e: CalEvent) => void;
  onDragStart?: (e: CalEvent, clientX: number, clientY: number) => void;
}) {
  const s = new Date(ev.start);
  const e = new Date(ev.end);
  const color = colorByStatus(ev.status);

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (pd) => {
    // ЛКМ (mouse button 0) или любой тач/перо — стартуем drag-призрак (демо)
    const isMouseLeft = pd.pointerType === "mouse" ? pd.button === 0 : true;
    if (onDragStart && isMouseLeft) onDragStart(ev, pd.clientX, pd.clientY);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (kd) => {
    if (kd.key === "Enter" || kd.key === " ") {
      kd.preventDefault();
      onOpen(ev);
    }
  };

  const aria = `Событие: ${ev.title}. ${timeLabel(s)}–${timeLabel(e)}. Статус: ${ev.status}`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-roledescription="Событие календаря"
      aria-label={aria}
      title={ev.title}
      className={[
        "w-full text-left rounded-lg border",
        // ↑ базовый блок
        "px-2 py-1.5 sm:py-1",                 // больше вертикальная хит-зона на мобайле
        "min-h-[36px] sm:min-h-[28px]",       // удобнее тапать
        "cursor-grab active:cursor-grabbing select-none touch-none", // корректный drag на тач
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "transition active:scale-[0.99]",     // легкая тактильность
        color,
      ].join(" ")}
      onPointerDown={handlePointerDown}
      onDoubleClick={() => onOpen(ev)}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(ev);
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="truncate text-xs sm:text-[11px]">{ev.title}</div>
        <StatusBadge status={ev.status} />
      </div>
      <div className="mt-0.5 text-[11px] text-white/70">
        {timeLabel(s)}–{timeLabel(e)}
      </div>
    </div>
  );
}