"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProviderBadge from "./ProviderBadge";
import { type Webhook } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsWebhooks";

type Props = {
  rows: Webhook[];
  onEdit: (row: Webhook) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const fmtIsoCompact = (iso?: string) =>
  iso ? iso.replace("T", " ").replace("Z", "") : "—";

export default function WebhooksTable({ rows, onEdit, onToggle, onDelete }: Props) {
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").toLowerCase();
  const status = sp.get("status") as Webhook["status"] | null;

  const filtered = useMemo(() => {
    return rows.filter((w) => {
      const hitsQ = q
        ? (w.name + w.url + w.events.join(",")).toLowerCase().includes(q)
        : true;
      const hitsStatus = status ? w.status === status : true;
      return hitsQ && hitsStatus;
    });
  }, [rows, q, status]);

  if (!filtered.length) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-center">
        <div className="text-white/85 font-medium">Вебхуки не найдены</div>
        <div className="text-white/60 text-sm mt-1">Измените фильтры или запрос</div>
      </section>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 supports-[overflow:clip]:overflow-x-clip overflow-x-hidden">
      {/* Мобильные карточки */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((w) => (
          <div key={w.id} className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/demo/admin/integrations/webhooks/${w.id}`}
                  className="font-medium hover:underline break-words"
                >
                  {w.name}
                </Link>
                <div className="text-xs text-white/60 mt-0.5 uppercase">{w.status}</div>
              </div>
              <ProviderBadge status={w.status} />
            </div>

            <div className="mt-2 text-xs text-white/70 break-all">{w.url}</div>

            <div className="mt-2 flex flex-wrap gap-1">
              {w.events.slice(0, 4).map((ev) => (
                <span key={ev} className="px-2 py-0.5 text-[11px] rounded bg-white/10">
                  {ev}
                </span>
              ))}
              {w.events.length > 4 && (
                <span className="px-2 py-0.5 text-[11px] rounded bg-white/10">
                  +{w.events.length - 4}
                </span>
              )}
            </div>

            <div className="mt-2 text-[11px] text-white/50">
              {fmtIsoCompact(w.lastDeliveryAt)}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onToggle(w.id)}
                className="text-xs rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                aria-label={w.status === "paused" ? "Resume webhook" : "Pause webhook"}
              >
                {w.status === "paused" ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={() => onEdit(w)}
                className="text-xs rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                aria-label="Edit webhook"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Удалить вебхук?")) onDelete(w.id);
                }}
                className="text-xs rounded bg-rose-500/20 px-2 py-1 hover:bg-rose-500/30"
                aria-label="Delete webhook"
              >
                Delete
              </button>
              <Link
                href={`/demo/admin/integrations/webhooks/${w.id}`}
                className="ml-auto text-xs underline underline-offset-2"
              >
                Открыть
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Десктоп-таблица */}
      <div className="overflow-x-auto rounded-2xl border border-white/15 hidden md:block">
        <table className="min-w-[820px] w-full text-sm">
          <thead className="text-white/70">
            <tr className="bg-white/[0.04]">
              <th scope="col" className="text-left p-3">Название</th>
              <th scope="col" className="text-left p-3">URL</th>
              <th scope="col" className="text-left p-3">События</th>
              <th scope="col" className="text-left p-3">Статус</th>
              <th scope="col" className="text-left p-3">Последняя доставка</th>
              <th scope="col" className="text-right p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-3 font-medium max-w-[260px]">
                  <Link
                    href={`/demo/admin/integrations/webhooks/${w.id}`}
                    className="hover:underline block truncate"
                    title={w.name}
                  >
                    {w.name}
                  </Link>
                </td>
                <td className="p-3 max-w-[320px] truncate" title={w.url}>
                  {w.url}
                </td>
                <td className="p-3 text-xs">
                  {w.events.slice(0, 3).join(", ")}
                  {w.events.length > 3 ? "…" : ""}
                </td>
                <td className="p-3">
                  <ProviderBadge status={w.status} />
                </td>
                <td className="p-3 text-xs text-white/70 whitespace-nowrap">
                  {fmtIsoCompact(w.lastDeliveryAt)}
                </td>
                <td className="p-3">
                  <div className="flex justify-end flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggle(w.id)}
                      className="text-xs rounded bg-white/10 px-2.5 py-1.5 hover:bg-white/20"
                      aria-label={w.status === "paused" ? "Resume webhook" : "Pause webhook"}
                    >
                      {w.status === "paused" ? "Resume" : "Pause"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(w)}
                      className="text-xs rounded bg-white/10 px-2.5 py-1.5 hover:bg-white/20"
                      aria-label="Edit webhook"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Удалить вебхук?")) onDelete(w.id);
                      }}
                      className="text-xs rounded bg-rose-500/20 px-2.5 py-1.5 hover:bg-rose-500/30"
                      aria-label="Delete webhook"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}