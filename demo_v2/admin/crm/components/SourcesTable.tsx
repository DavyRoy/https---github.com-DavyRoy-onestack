"use client";
import React from "react";

type Source = {
  id: string;
  name: string;
  slug: string;
  channel: "site" | "call" | "chat" | "ads" | "other";
  active: boolean;
  conv?: number;
};

const STORAGE_KEY = "demo.admin.crm.sources";

const DEFAULT_SOURCES: Source[] = [
  { id: "s1", name: "Сайт (форма)", slug: "site_form", channel: "site", active: true, conv: 12 },
  { id: "s2", name: "Звонок", slug: "call", channel: "call", active: true, conv: 8 },
  { id: "s3", name: "Чат/Мессенджер", slug: "chat", channel: "chat", active: true, conv: 10 },
  { id: "s4", name: "Реклама", slug: "ads", channel: "ads", active: true, conv: 6 },
  { id: "s5", name: "Другое", slug: "other", channel: "other", active: false, conv: 4 },
];

function load(): Source[] {
  if (typeof window === "undefined") return DEFAULT_SOURCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SOURCES;
    const parsed = JSON.parse(raw) as Source[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_SOURCES;
  } catch {
    return DEFAULT_SOURCES;
  }
}
function save(data: Source[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function badgeChannel(ch: Source["channel"]) {
  const map: Record<Source["channel"], string> = {
    site: "bg-emerald-500/20 text-emerald-300",
    call: "bg-amber-500/20 text-amber-300",
    chat: "bg-sky-500/20 text-sky-300",
    ads: "bg-fuchsia-500/20 text-fuchsia-300",
    other: "bg-white/15 text-white/70",
  };
  return map[ch];
}

export default function SourcesTable() {
  const [rows, setRows] = React.useState<Source[]>(load());
  const [q, setQ] = React.useState("");

  React.useEffect(() => setRows(load()), []);

  const toggleActive = (id: string) => {
    setRows(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, active: !r.active } : r));
      save(next);
      return next;
    });
  };
  const addRow = () => {
    const name = prompt("Название источника:");
    if (!name) return;
    const slug = (prompt("Ключ (slug):", name.toLowerCase().replace(/\s+/g, "_").slice(0, 24)) || "").trim();
    const channel = (prompt("Канал (site|call|chat|ads|other):", "site") || "site") as Source["channel"];
    setRows(prev => {
      const next = [
        ...prev,
        {
          id: "s" + Math.random().toString(36).slice(2, 8),
          name,
          slug,
          channel,
          active: true,
          conv: Math.floor(5 + Math.random() * 10),
        },
      ];
      save(next);
      return next;
    });
  };

  const filtered = rows.filter(r => {
    if (!q) return true;
    const x = q.toLowerCase();
    return r.name.toLowerCase().includes(x) || r.slug.toLowerCase().includes(x) || r.channel.toLowerCase().includes(x);
  });

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
      <div className="mb-3 flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию/slug/каналу…"
          className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
        />
        <button onClick={addRow} className="rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white">
          Создать
        </button>
      </div>

      {/* Моб. карточки */}
      <div className="grid gap-2 md:hidden">
        {filtered.map(r => (
          <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-xs text-white/60 break-all">slug: {r.slug}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-md ${badgeChannel(r.channel)}`}>{r.channel}</span>
                  <span className="px-2 py-1 rounded-md bg-white/10 text-white/70">
                    {typeof r.conv === "number" ? `${r.conv}%` : "—"}
                  </span>
                  {r.active ? (
                    <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300">Активен</span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-white/10 text-white/60">Отключён</span>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => toggleActive(r.id)}
                  className="rounded-md border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/[0.06]"
                >
                  {r.active ? "Отключить" : "Включить"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
            Источники не найдены.
          </div>
        )}
      </div>

      {/* Десктоп-таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead className="text-white/60">
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-3 w-[28%]">Название</th>
              <th className="text-left py-2 pr-3 w-[20%]">Slug</th>
              <th className="text-left py-2 pr-3 w-[16%]">Канал</th>
              <th className="text-left py-2 pr-3 w-[16%]">Конверсия</th>
              <th className="text-left py-2 pr-3 w-[12%]">Статус</th>
              <th className="text-right py-2 pl-3 w-[8%]">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="py-2 pr-3">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-white/50">ID: {r.id}</div>
                </td>
                <td className="py-2 pr-3 break-all">{r.slug}</td>
                <td className="py-2 pr-3">
                  <span className={`px-2 py-1 rounded-md text-xs ${badgeChannel(r.channel)}`}>{r.channel}</span>
                </td>
                <td className="py-2 pr-3">{typeof r.conv === "number" ? `${r.conv}%` : "—"}</td>
                <td className="py-2 pr-3">
                  {r.active ? (
                    <span className="px-2 py-1 rounded-md text-xs bg-emerald-500/20 text-emerald-300">Активен</span>
                  ) : (
                    <span className="px-2 py-1 rounded-md text-xs bg-white/10 text-white/60">Отключён</span>
                  )}
                </td>
                <td className="py-2 pl-3 text-right">
                  <button
                    onClick={() => toggleActive(r.id)}
                    className="rounded-md border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/[0.06]"
                  >
                    {r.active ? "Отключить" : "Включить"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/50">
                  Источники не найдены.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}