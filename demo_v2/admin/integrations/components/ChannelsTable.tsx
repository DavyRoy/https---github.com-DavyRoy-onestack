"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProviderBadge from "./ProviderBadge";
import { type Channel } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsChannels";

type Props = {
  rows: Channel[];
  onEdit: (row: Channel) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ChannelsTable({ rows, onEdit, onToggle, onDelete }: Props) {
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").toLowerCase();
  const type = sp.get("type") as Channel["type"] | null;
  const status = sp.get("status") as Channel["status"] | null;

  const filtered = React.useMemo(() => {
    const match = (txt: string) => (q ? txt.toLowerCase().includes(q) : true);
    return rows.filter(
      (c) =>
        match(c.name + c.provider) &&
        (type ? c.type === type : true) &&
        (status ? c.status === status : true)
    );
  }, [rows, q, type, status]);

  if (!filtered.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-white/70">
        Каналы не найдены.
      </div>
    );
  }

  // SSR-safe ISO trimming
  const fmtIsoCompact = (iso?: string) =>
    iso ? iso.replace("T", " ").replace("Z", "") : "—";

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 w-full max-w-full overflow-x-hidden">
      {/* Мобильные карточки */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/demo/admin/integrations/channels/${c.id}`}
                  className="font-medium hover:underline break-words"
                >
                  {c.name}
                </Link>
                <div className="text-xs text-white/60 mt-0.5 break-words">
                  {c.provider} • <span className="uppercase">{c.type}</span>
                </div>
              </div>
              <div className="shrink-0">
                <ProviderBadge status={c.status} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/[0.04] p-2">
                <div className="text-white/50">Проверка</div>
                <div className="text-white/80 mt-0.5">{fmtIsoCompact(c.lastCheckAt)}</div>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-2 text-right">
                <div className="text-white/50">24ч / Ош.</div>
                <div className="text-white/80 mt-0.5" aria-label={`За 24 часа: ${c.sent24h}, ошибки: ${c.errors24h}`}>
                  {c.sent24h} / {c.errors24h}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onToggle(c.id)}
                className="text-xs rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
              >
                Enable/Disable
              </button>
              <button
                type="button"
                onClick={() => onEdit(c)}
                className="text-xs rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Удалить канал?")) onDelete(c.id);
                }}
                className="text-xs rounded bg-rose-500/20 px-3 py-1.5 hover:bg-rose-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Десктопная таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[780px] w-full text-sm">
          <thead className="text-white/70">
            <tr className="bg-white/[0.04]">
              <th scope="col" className="text-left p-3">Название</th>
              <th scope="col" className="text-left p-3">Тип</th>
              <th scope="col" className="text-left p-3">Провайдер</th>
              <th scope="col" className="text-left p-3">Статус</th>
              <th scope="col" className="text-left p-3">Проверка</th>
              <th scope="col" className="text-right p-3">24ч / Ош.</th>
              <th scope="col" className="text-right p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-3 font-medium max-w-[280px]">
                  <Link
                    href={`/demo/admin/integrations/channels/${c.id}`}
                    className="hover:underline block truncate"
                    title={c.name}
                    aria-label={`Открыть канал ${c.name}`}
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="p-3 uppercase text-xs">{c.type}</td>
                <td className="p-3 max-w-[220px] truncate" title={c.provider}>
                  {c.provider}
                </td>
                <td className="p-3">
                  <ProviderBadge status={c.status} />
                </td>
                <td className="p-3 text-xs text-white/70 whitespace-nowrap">
                  {fmtIsoCompact(c.lastCheckAt)}
                </td>
                <td className="p-3 text-right whitespace-nowrap" aria-label={`За 24 часа: ${c.sent24h}, ошибки: ${c.errors24h}`}>
                  {c.sent24h} / {c.errors24h}
                </td>
                <td className="p-3">
                  <div className="flex justify-end flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggle(c.id)}
                      className="text-xs rounded bg-white/10 px-2.5 py-1.5 hover:bg-white/20"
                    >
                      Enable/Disable
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(c)}
                      className="text-xs rounded bg-white/10 px-2.5 py-1.5 hover:bg-white/20"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Удалить канал?")) onDelete(c.id);
                      }}
                      className="text-xs rounded bg-rose-500/20 px-2.5 py-1.5 hover:bg-rose-500/30"
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
    </section>
  );
}