"use client";

import React, { isValidElement, cloneElement } from "react";
import { mockClients } from "@/app/demo/manager/crm/data/mockClients";

type Format = "csv" | "tsv" | "json";

type RowObject = Record<string, unknown>;

export default function ExportMenu({
  fileName,
  children,
  ariaLabel = `Экспортировать данные в файл ${fileName}`,
  title = `Экспорт (${fileName})`,
  /** Формат выгрузки (по умолчанию CSV) */
  format = "csv",
  /** Явные данные. Если не заданы — используется mockClients */
  data,
  /** Заголовки столбцов (порядок важен). Если не заданы — применим дефолт для клиентов */
  headers,
  /** Маппер строки: объект → массив значений в порядке headers (для CSV/TSV) */
  mapRow,
  /** Кастомный делимитер (для CSV/TSV). По умолчанию: CSV=','; TSV='\t' */
  delimiter,
}: {
  fileName: string;
  children: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  format?: Format;
  data?: RowObject[];
  headers?: string[];
  mapRow?: (row: RowObject) => (string | number | boolean | null | undefined)[];
  delimiter?: string;
}) {
  const onExport = () => {
    // --- Источник данных ---
    const src = Array.isArray(data) ? data : (mockClients as RowObject[]);

    // Дефолтные заголовки и маппер для mockClients
    const defaultHeaders = ["id", "name", "email", "phone", "tags", "createdAt"];
    const defaultMapRow = (c: any) => [
      c.id,
      c.name,
      c.email,
      c.phone,
      (c.tags || []).join("|"),
      c.createdAt,
    ];

    const head = headers && headers.length ? headers : defaultHeaders;
    const toRow = mapRow || defaultMapRow;

    // --- Формирование контента ---
    let blob: Blob;
    let finalName = ensureExt(fileName, format);

    if (format === "json") {
      const json = JSON.stringify(src, null, 2);
      // Без BOM — JSON Excel всё равно не открывает; но и не требуется.
      blob = new Blob([json], { type: "application/json;charset=utf-8" });
    } else {
      const sep = delimiter ?? (format === "tsv" ? "\t" : ",");
      const csvHead = head.map(quoteCell).join(sep);
      const csvRows = src.map((r) => {
        const arr = toRow(r);
        return arr.map((v) => quoteCell(v, sep)).join(sep);
      });
      // BOM для Excel + CRLF для лучшей совместимости
      const BOM = "\uFEFF";
      const body = [csvHead, ...csvRows].join("\r\n");
      blob = new Blob([BOM + body], { type: "text/csv;charset=utf-8" });
    }

    // --- Скачивание (надёжный способ для iOS Safari) ---
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = finalName;
      a.rel = "noopener";
      // Некоторые браузеры требуют элементы в DOM
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      // Небольшая задержка иногда помогает старым WebKit, но здесь не критично
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  };

  // Если children — валидный элемент, просто «вшиваем» onClick внутрь него
  if (isValidElement(children)) {
    const origOnClick = (children.props as any)?.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;

    const handleClick = (e: React.MouseEvent) => {
      origOnClick?.(e);
      if (!e.defaultPrevented) onExport();
    };

    const extraProps: Record<string, any> = {
      onClick: handleClick,
      "aria-label": ariaLabel,
      title,
    };

    // Если это <button>, страхуемся type="button"
    const isNativeButton =
      typeof children.type === "string" &&
      children.type.toLowerCase() === "button";
    if (isNativeButton && (children.props as any).type == null) {
      extraProps.type = "button";
    }

    return cloneElement(children, extraProps);
  }

  // Фолбэк: если передали текст/фрагмент — рисуем наш одиночный <button>
  return (
    <button
      type="button"
      onClick={onExport}
      aria-label={ariaLabel}
      title={title}
      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      {children ?? "Экспорт"}
    </button>
  );
}

/* ---------------- Утилиты ---------------- */

function ensureExt(name: string, format: Format) {
  const lower = name.toLowerCase();
  if (format === "json" && !lower.endsWith(".json")) return `${name}.json`;
  if (format === "tsv" && !lower.endsWith(".tsv")) return `${name}.tsv`;
  if (format === "csv" && !/\.(csv|tsv|json)$/.test(lower)) return `${name}.csv`;
  return name;
}

function quoteCell(
  v: string | number | boolean | null | undefined,
  sep = ","
) {
  // Строка → экранируем двойные кавычки, перевод строки, разделитель
  const s =
    v == null
      ? ""
      : typeof v === "string"
      ? v
      : typeof v === "number" || typeof v === "boolean"
      ? String(v)
      : JSON.stringify(v);

  // Если содержится разделитель/перенос/кавычка — оборачиваем в кавычки и экранируем кавычки
  if (s.includes(sep) || s.includes("\n") || s.includes("\r") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}