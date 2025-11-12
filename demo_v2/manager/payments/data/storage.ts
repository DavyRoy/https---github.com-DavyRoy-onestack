// src/app/demo/manager/payments/data/storage.ts
"use client";

import {
  Invoice,
  Payment,
  SEED_INVOICES,
  SEED_PAYMENTS,
} from "./mockPayments";

const LS_PAYMENTS = "demo_manager_payments_v1";
const LS_INVOICES = "demo_manager_invoices_v1";

/** INIT */
function ensureInit() {
  try {
    if (typeof localStorage === "undefined") return;
    if (!localStorage.getItem(LS_PAYMENTS)) {
      localStorage.setItem(LS_PAYMENTS, JSON.stringify(SEED_PAYMENTS));
    }
    if (!localStorage.getItem(LS_INVOICES)) {
      localStorage.setItem(LS_INVOICES, JSON.stringify(SEED_INVOICES));
    }
  } catch {
    /* no-op */
  }
}

/** PAYMENTS */
export function loadPayments(): Payment[] {
  ensureInit();
  try {
    return JSON.parse(localStorage.getItem(LS_PAYMENTS) || "[]") as Payment[];
  } catch {
    return [];
  }
}

export function savePayments(rows: Payment[]) {
  try {
    localStorage.setItem(LS_PAYMENTS, JSON.stringify(rows));
  } catch {
    /* no-op */
  }
}

export function upsertPayment(p: Payment) {
  const rows = loadPayments();
  const i = rows.findIndex((x) => x.id === p.id);
  if (i >= 0) rows[i] = p;
  else rows.unshift(p);
  savePayments(rows);
}

export function findPaymentByLinkedInvoiceId(
  invoiceId: string
): Payment | undefined {
  return loadPayments().find((p) => p.linkedInvoiceId === invoiceId);
}

/** INVOICES */
export function loadInvoices(): Invoice[] {
  ensureInit();
  try {
    return JSON.parse(localStorage.getItem(LS_INVOICES) || "[]") as Invoice[];
  } catch {
    return [];
  }
}

export function saveInvoices(rows: Invoice[]) {
  try {
    localStorage.setItem(LS_INVOICES, JSON.stringify(rows));
  } catch {
    /* no-op */
  }
}

export function upsertInvoice(inv: Invoice) {
  const rows = loadInvoices();
  const i = rows.findIndex((x) => x.id === inv.id);
  if (i >= 0) rows[i] = inv;
  else rows.unshift(inv);
  saveInvoices(rows);
}

/** Helpers */
function genPaymentId(now = new Date()) {
  // P-YYYYMMDD-XYZ (XYZ = псевдослучайные 3 цифры)
  const d = now.toISOString().slice(0, 10).replaceAll("-", "");
  const rnd = Math.floor(Math.random() * 900 + 100);
  return `P-${d}-${rnd}`;
}

/**
 * Создать платёж из счёта (по умолчанию статус paid, метод invoice, канал manager)
 * Возвращает созданный/существующий Payment.
 */
export function createPaymentFromInvoice(
  inv: Invoice,
  opts?: Partial<Pick<Payment, "status" | "channel">>
): Payment {
  // если уже связан — вернём существующий
  const existing = findPaymentByLinkedInvoiceId(inv.id);
  if (existing) return existing;

  const now = new Date();
  const p: Payment = {
    id: genPaymentId(now),
    createdAt: now.toISOString(),
    orderId: inv.orderId,
    client: inv.client,
    email: inv.email,
    amount: inv.total,
    currency: inv.currency,
    method: "invoice",
    status: opts?.status ?? "paid",
    channel: opts?.channel ?? "manager",
    fee: 0,
    linkedInvoiceId: inv.id,
  };

  upsertPayment(p);
  return p;
}

/** CSV export */
export function downloadCSV(
  filename: string,
  rows: any[],
  headers?: string[]
) {
  if (!rows || rows.length === 0) {
    // пустой CSV с заголовками (если передали)
    const head = (headers ?? []).join(";");
    const blob = new Blob(["\uFEFF" + head], {
      type: "text/csv;charset=utf-8",
    });
    triggerDownload(blob, filename);
    return;
  }
  const cols = headers ?? Object.keys(rows[0] || {});
  const escape = (v: any) => {
    const s = String(v ?? "");
    if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const body =
    cols.join(";") +
    "\n" +
    rows.map((r) => cols.map((c) => escape(r[c])).join(";")).join("\n");
  // Добавляем BOM для Excel
  const blob = new Blob(["\uFEFF" + body], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

/** ICS export (для счетов: дедлайны оплаты) */
export function downloadInvoicesICS(filename: string, invoices: Invoice[]) {
  // Форматируем в UTC YYYYMMDDTHHMMSSZ
  const toUTC = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      d.getUTCFullYear().toString() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  };
  // Экранирование текста в ICS: \ , ; и переводы строк
  const icsEscape = (s: string) =>
    String(s ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\r?\n/g, "\\n");

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Demo//Manager//RU",
  ];

  invoices.forEach((inv) => {
    const uid = `${inv.id}@demo-manager`;
    const due = toUTC(inv.dueAt);
    const created = toUTC(inv.createdAt);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTART:${due}`,
      `DTEND:${due}`,
      `DTSTAMP:${created}`,
      `SUMMARY:${icsEscape(inv.id)} — Срок оплаты`,
      `DESCRIPTION:${icsEscape(
        `Клиент: ${inv.client} | Сумма: ${inv.total} ${inv.currency}`
      )}`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  triggerDownload(blob, filename);
}

/** Универсальный helper для скачивания Blob */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  // Некоторые браузеры ожидают, что ссылка будет в DOM
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}