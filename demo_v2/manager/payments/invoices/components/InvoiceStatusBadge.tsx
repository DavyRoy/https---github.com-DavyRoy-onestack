// src/app/demo/manager/payments/invoices/components/InvoiceStatusBadge.tsx
"use client";

export default function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "bg-zinc-500/20 text-zinc-200 border border-zinc-400/40" },
    sent: { label: "Sent", cls: "bg-sky-500/20 text-sky-200 border border-sky-400/40" },
    viewed: { label: "Viewed", cls: "bg-blue-500/20 text-blue-200 border border-blue-400/40" },
    paid: { label: "Paid", cls: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40" },
    void: { label: "Void", cls: "bg-red-500/20 text-red-200 border border-red-400/40" },
  };

  const s = map[status] || { label: status, cls: "bg-white/10 text-white/80 border border-white/20" };

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs ${s.cls}`}
      role="status"
      aria-label={`Статус счета: ${s.label}`}
    >
      {s.label}
    </span>
  );
}