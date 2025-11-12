"use client";

import React from "react";

type SimpleColumn = string;
type ColumnAlign = "left" | "right" | "center";

type RichColumn<Row = any> = {
  /** Ключ поля в строке (обязателен) */
  key: string;
  /** Заголовок столбца (по умолчанию = key) */
  title?: string;
  /** Выравнивание ячеек */
  align?: ColumnAlign;
  /** CSS-ширина колонки (например, "20%", "160px") */
  width?: string;
  /** Кастомный рендер содержимого ячейки */
  render?: (value: any, row: Row, rowIndex: number) => React.ReactNode;
};

type Column<Row = any> = SimpleColumn | RichColumn<Row>;

export default function TableBasic<Row extends Record<string, any>>({
  columns,
  rows,
  caption,
  emptyTitle = "Нет данных",
  emptyHint = "Измените фильтры или диапазон — и попробуйте снова.",
  stickyHeader = false,
  zebra = true,
  className = "",
  getKey,
  onRowClick,
}: {
  /** Набор колонок: либо простые строки, либо расширенные описатели */
  columns: Column<Row>[];
  /** Строки таблицы */
  rows: Row[];
  /** Подпись таблицы для доступности (aria) */
  caption?: string;
  /** Текст пустого состояния */
  emptyTitle?: string;
  emptyHint?: string;
  /** Липкая шапка (при горизонтальном скролле удобнее читать) */
  stickyHeader?: boolean;
  /** Зебра-строки */
  zebra?: boolean;
  /** Доп. классы секции-обёртки */
  className?: string;
  /** Функция для стабильного ключа строки */
  getKey?: (row: Row, index: number) => string;
  /** Клик по строке */
  onRowClick?: (row: Row, index: number) => void;
}) {
  // Нормализуем колонки в единый формат
  const cols = React.useMemo<RichColumn<Row>[]>(() => {
    return columns.map((c) =>
      typeof c === "string" ? { key: c, title: c, align: "left" } : { align: "left", ...c }
    );
  }, [columns]);

  // Классы для выравнивания
  const alignCls = (a?: ColumnAlign) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  // Пустое состояние
  if (!rows || rows.length === 0) {
    return (
      <section className={`rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-center ${className}`}>
        <div className="text-base font-semibold text-white mb-1">{emptyTitle}</div>
        <div className="text-sm text-white/60">{emptyHint}</div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 min-w-0 ${className}`}
    >
      {/* Локальный горизонтальный скролл только для таблицы */}
      <div className="-mx-2 md:mx-0">
        <div className="overflow-x-auto px-2 md:px-0">
          <table className="min-w-[640px] w-full text-sm border-separate border-spacing-0">
            {caption && <caption className="sr-only">{caption}</caption>}

            <colgroup>
              {cols.map((c, i) => (
                <col key={i} style={c.width ? { width: c.width } : undefined} />
              ))}
            </colgroup>

            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                {cols.map((c, i) => (
                  <th
                    key={i}
                    className={`${alignCls(c.align)} py-2 pr-3 sticky ${
                      stickyHeader ? "top-0 bg-[#0b0b12]" : ""
                    }`}
                    scope="col"
                  >
                    {c.title ?? c.key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => {
                const trKey = getKey?.(row, i) ?? (row.id ? String(row.id) : String(i));
                const baseTr =
                  "align-top border-b border-white/5 " +
                  (zebra && i % 2 ? "bg-white/[0.02]" : "") +
                  " " +
                  (onRowClick ? "cursor-pointer hover:bg-white/[0.06] transition" : "");
                return (
                  <tr
                    key={trKey}
                    className={baseTr}
                    onClick={() => onRowClick?.(row, i)}
                    tabIndex={onRowClick ? 0 : -1}
                    onKeyDown={(e) => {
                      if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onRowClick(row, i);
                      }
                    }}
                    aria-label={onRowClick ? "Открыть строку" : undefined}
                  >
                    {cols.map((c, idx) => {
                      const raw = row?.[c.key];
                      const content =
                        c.render ? c.render(raw, row, i) : raw ?? "—";
                      return (
                        <td
                          key={`${trKey}-${c.key}-${idx}`}
                          className={`${alignCls(c.align)} py-2 pr-3 min-w-0 break-words whitespace-normal`}
                        >
                          {typeof content === "string" ? <span className="break-words">{content}</span> : content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}