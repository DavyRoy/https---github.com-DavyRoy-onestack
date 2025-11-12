"use client";

export default function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; cls: string; tone: string }
  > = {
    authorized: {
      label: "Авторизован",
      cls: "bg-blue-500/20 text-blue-100 border border-blue-400/40",
      tone: "info",
    },
    captured: {
      label: "Захвачен",
      cls: "bg-sky-500/20 text-sky-100 border border-sky-400/40",
      tone: "info",
    },
    paid: {
      label: "Оплачен",
      cls: "bg-emerald-500/20 text-emerald-100 border border-emerald-400/40",
      tone: "success",
    },
    failed: {
      label: "Ошибка",
      cls: "bg-red-500/20 text-red-100 border border-red-400/40",
      tone: "error",
    },
    refunded: {
      label: "Возврат",
      cls: "bg-amber-500/20 text-amber-100 border border-amber-400/40",
      tone: "warning",
    },
    cancelled: {
      label: "Отменён",
      cls: "bg-zinc-500/20 text-zinc-200 border border-zinc-400/40",
      tone: "neutral",
    },
  };

  const s = map[status] || {
    label: status || "Неизвестно",
    cls: "bg-white/10 text-white/80 border border-white/15",
    tone: "neutral",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight ${s.cls}`}
      role="status"
      aria-label={`Статус платежа: ${s.label}`}
      title={s.label}
    >
      {s.label}
    </span>
  );
}