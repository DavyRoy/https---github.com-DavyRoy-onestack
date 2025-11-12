"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  NotebookPen,
  CalendarClock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { Client } from "@/app/demo/manager/crm/data/mockClients";

type SortKey = "name" | "createdAt" | "email" | "phone";
type SortDir = "asc" | "desc";

export default function ClientsTable({ rows }: { rows: Client[] }) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const onMsg = (c: Client) => toast.success(`Сообщение отправлено: ${c.name}`);

  const safeRows = Array.isArray(rows) ? rows : [];

  const filtered = useMemo(() => {
    if (!q.trim()) return safeRows;
    const qq = norm(q);
    return safeRows.filter((r) =>
      [r.name, r.email, r.phone, (r.tags || []).join(" "), r.createdAt]
        .filter(Boolean)
        .map(norm)
        .some((s) => s.includes(qq))
    );
  }, [q, safeRows]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const av = (getCell(a, sortKey) ?? "").toString().toLowerCase();
      const bv = (getCell(b, sortKey) ?? "").toString().toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Пустое состояние
  if (!safeRows || safeRows.length === 0) {
    return (
      <div className={T.card + " text-center py-10"}>
        <div className="text-base font-semibold">Клиентов пока нет</div>
        <div className={"mt-1 text-sm " + T.dim}>
          Импортируйте базу или создайте клиента вручную.
        </div>
        <div className="mt-3">
          <Link href="/demo/manager/crm/clients/new" className={T.btn}>
            Создать клиента
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0">
      {/* Панель управления: поиск + сортировка */}
      <div className={T.card + " p-3 sm:p-4"}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по имени, email, телефону, тегам…"
              className="w-full rounded-lg border border-white/12 bg-white/[0.06] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Поиск клиентов"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <SortBtn
              label="Имя"
              active={sortKey === "name"}
              dir={sortDir}
              onClick={() => toggleSort("name")}
            />
            <SortBtn
              label="Создан"
              active={sortKey === "createdAt"}
              dir={sortDir}
              onClick={() => toggleSort("createdAt")}
            />
            <SortBtn
              label="Email"
              active={sortKey === "email"}
              dir={sortDir}
              onClick={() => toggleSort("email")}
            />
            <SortBtn
              label="Телефон"
              active={sortKey === "phone"}
              dir={sortDir}
              onClick={() => toggleSort("phone")}
            />
          </div>
        </div>
      </div>

      {/* 📱 Мобильный вид — карточки */}
      <div className="grid gap-2 md:hidden mt-2">
        {sorted.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-white/12 bg-white/6 p-3"
            aria-label={`Клиент ${c.name}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/demo/manager/crm/clients/${c.id}`}
                  className="block truncate font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                >
                  {c.name}
                </Link>
                <div className={"text-xs " + T.dim}>
                  Создан: {c.createdAt || "—"}
                </div>
              </div>
              <Link
                href={`/demo/manager/crm/clients/${c.id}`}
                className="text-xs underline whitespace-nowrap underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
              >
                Открыть
              </Link>
            </div>

            <div className="mt-2 grid gap-1 text-xs">
              <div className="truncate">{c.email || "—"}</div>
              <div className={T.dim + " truncate"}>{c.phone || "—"}</div>
              <div className="mt-1">
                <TagsRow tags={c.tags} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                className={T.btn + " text-xs"}
                onClick={() => onMsg(c)}
                aria-label={`Написать клиенту ${c.name}`}
              >
                <Mail width={14} height={14} /> Написать
              </button>
              <Link
                className={T.btn + " text-xs"}
                href={`/demo/manager/orders/new?client=${c.id}`}
              >
                <NotebookPen width={14} height={14} /> Создать заказ
              </Link>
              <Link
                className={T.btn + " text-xs"}
                href={`/demo/manager/booking/new?client=${c.id}`}
              >
                <CalendarClock width={14} height={14} /> Записать
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Десктоп — таблица с безопасным горизонтальным скроллом */}
      <div className="hidden md:block relative -mx-2 sm:mx-0 mt-2">
        <div className="overflow-x-auto rounded-xl border border-white/10 px-2 sm:px-0">
          <table
            className="min-w-[720px] sm:min-w-[860px] w-full text-sm"
            aria-label="Таблица клиентов"
          >
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[28%]" />
              <col className="w-[22%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="bg-white/[0.04] text-white/80 sticky top-0 z-10">
              <tr>
                <Th
                  label="Клиент"
                  active={sortKey === "name"}
                  dir={sortDir}
                  onClick={() => toggleSort("name")}
                />
                <Th
                  label="Контакты"
                  active={sortKey === "email"}
                  dir={sortDir}
                  onClick={() => toggleSort("email")}
                />
                <th className="text-left py-2 px-3">Теги</th>
                <th className="text-left py-2 px-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-white/10 hover:bg-white/[0.03]"
                >
                  <td className="py-2 px-3 align-top">
                    <Link
                      href={`/demo/manager/crm/clients/${c.id}`}
                      className="block truncate font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                    >
                      {c.name}
                    </Link>
                    <div className={"text-xs " + T.dim}>
                      Создан: {c.createdAt || "—"}
                    </div>
                  </td>
                  <td className="py-2 px-3 align-top">
                    <div className="text-xs truncate max-w-[240px]">
                      {c.email || "—"}
                    </div>
                    <div
                      className={"text-xs " + T.dim + " truncate max-w-[240px]"}
                    >
                      {c.phone || "—"}
                    </div>
                  </td>
                  <td className="py-2 px-3 align-top">
                    <TagsRow tags={c.tags} compact />
                  </td>
                  <td className="py-2 px-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        className={T.btn + " text-xs"}
                        onClick={() => onMsg(c)}
                        aria-label={`Написать клиенту ${c.name}`}
                      >
                        <Mail width={14} height={14} /> Написать
                      </button>
                      <Link
                        className={T.btn + " text-xs"}
                        href={`/demo/manager/orders/new?client=${c.id}`}
                      >
                        <NotebookPen width={14} height={14} /> Создать заказ
                      </Link>
                      <Link
                        className={T.btn + " text-xs"}
                        href={`/demo/manager/booking/new?client=${c.id}`}
                      >
                        <CalendarClock width={14} height={14} /> Записать
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">Ничего не найдено</div>
                      <div className={"mt-1 text-xs " + T.dim}>
                        Измените запрос поиска или сбросьте фильтры.
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            setQ("");
                            setSortKey("name");
                            setSortDir("asc");
                          }}
                          className="rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                          Сбросить
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ====== Вспомогательные компоненты и утилиты ====== */

function Th({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active?: boolean;
  dir?: SortDir;
  onClick?: () => void;
}) {
  return (
    <th className="text-left py-2 px-3">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        aria-sort={
          active ? (dir === "asc" ? "ascending" : "descending") : "none"
        }
        aria-label={
          active
            ? `${label}, сортировка ${dir === "asc" ? "по возрастанию" : "по убыванию"}`
            : `${label}, включить сортировку`
        }
      >
        <span className="text-sm font-medium">{label}</span>
        {active ? (
          dir === "asc" ? (
            <ArrowUp width={14} height={14} />
          ) : (
            <ArrowDown width={14} height={14} />
          )
        ) : (
          <ArrowUpDown width={14} height={14} className="opacity-70" />
        )}
      </button>
    </th>
  );
}

function SortBtn({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active?: boolean;
  dir?: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 " +
        (active
          ? "border-white/20 bg-white/10 text-white"
          : "border-white/12 bg-white/5 text-white/85 hover:bg-white/8")
      }
      aria-pressed={active}
      aria-label={
        active
          ? `${label}: сортировка ${dir === "asc" ? "по возрастанию" : "по убыванию"}`
          : `${label}: включить сортировку`
      }
    >
      <span>{label}</span>
      {active ? (
        dir === "asc" ? (
          <ArrowUp width={14} height={14} />
        ) : (
          <ArrowDown width={14} height={14} />
        )
      ) : (
        <ArrowUpDown width={14} height={14} className="opacity-80" />
      )}
    </button>
  );
}

function TagsRow({
  tags,
  compact = false,
  max = 3,
}: {
  tags?: string[];
  compact?: boolean;
  max?: number;
}) {
  const list = Array.isArray(tags) ? tags : [];
  if (list.length === 0) {
    return <span className={T.dim + " text-xs"}>Тегов нет</span>;
  }
  const shown = list.slice(0, max);
  const rest = list.length - shown.length;

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((t) => (
        <span
          key={t}
          className={
            "inline-block rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 " +
            (compact ? "text-xs" : "text-[11px]")
          }
          title={t}
        >
          {t}
        </span>
      ))}
      {rest > 0 && (
        <span
          className={
            "inline-block rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 " +
            (compact ? "text-xs" : "text-[11px]")
          }
          title={list.slice(max).join(", ")}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}

function getCell(c: Client, key: SortKey) {
  switch (key) {
    case "name":
      return c.name ?? "";
    case "createdAt":
      return c.createdAt ?? "";
    case "email":
      return c.email ?? "";
    case "phone":
      return c.phone ?? "";
    default:
      return "";
  }
}

function norm(s?: string) {
  return (s || "").toString().trim().toLowerCase();
}