import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const COMPANY = {
  name:    "OneStack",
  inn:     "7700000000",
  ogrn:    "1234567890123",
  address: "г. Москва, Россия",
  bank:    "АО «Тинькофф Банк»",
  bik:     "044525974",
  account: "40702810000000000000",
  phone:   "+7 (800) 000-00-00",
  email:   "info@onestack24.ru",
};

const SVC_NAME: Record<string, string> = {
  crm:        "CRM-система",
  erp:        "ERP-система",
  website:    "Веб-сайт",
  mobile:     "Мобильное приложение",
  bot:        "Telegram-бот",
  design:     "Дизайн",
  support:    "Техническая поддержка",
  consulting: "Консультация",
};

function fmtRub(n: number) {
  return n.toLocaleString("ru-RU") + " руб.";
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function invoiceNo(id: string) {
  const num = parseInt(id.replace(/[^0-9]/g, "").slice(0, 6) || "1", 10) % 100000;
  return `СЧ-${String(num).padStart(5, "0")}`;
}

export async function generateInvoicePdf(
  request: { id: string; service: string; features: unknown; price: number },
  user: {
    email: string; name?: string | null; phone?: string | null;
    payerType?: string | null; inn?: string | null; orgName?: string | null;
    kpp?: string | null; ogrn?: string | null; legalAddress?: string | null;
    bankName?: string | null; bik?: string | null; bankAccount?: string | null;
  }
): Promise<Uint8Array> {
  const invoiceDate = new Date();
  const dueDate     = new Date(invoiceDate.getTime() + 5 * 86400000);

  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const C = {
    dark:   rgb(0.04, 0.06, 0.09),
    mid:    rgb(0.35, 0.38, 0.45),
    light:  rgb(0.85, 0.87, 0.92),
    accent: rgb(0.24, 0.27, 0.93),
    white:  rgb(1, 1, 1),
    green:  rgb(0.06, 0.72, 0.49),
  };

  // Header band
  page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: C.accent });
  page.drawText("СЧЁТ НА ОПЛАТУ", { x: 36, y: height - 30, size: 18, font: fontBold, color: C.white });
  page.drawText(`№ ${invoiceNo(request.id)}  от ${fmtDate(invoiceDate)}`, { x: 36, y: height - 52, size: 10, font: fontReg, color: rgb(0.8, 0.82, 1) });
  page.drawText(COMPANY.name, { x: width - 36 - fontBold.widthOfTextAtSize(COMPANY.name, 18), y: height - 30, size: 18, font: fontBold, color: C.white });
  page.drawText(COMPANY.email, { x: width - 36 - fontReg.widthOfTextAtSize(COMPANY.email, 9), y: height - 50, size: 9, font: fontReg, color: rgb(0.8, 0.82, 1) });

  let y = height - 90;

  function drawSection(label: string, lines: string[], cx: number, cy: number) {
    page.drawText(label, { x: cx, y: cy, size: 8, font: fontBold, color: C.mid });
    let ly = cy - 14;
    for (const line of lines) {
      page.drawText(line, { x: cx, y: ly, size: 9, font: fontReg, color: C.dark });
      ly -= 13;
    }
  }

  const colW = (width - 72) / 2;

  drawSection("ИСПОЛНИТЕЛЬ", [
    COMPANY.name,
    `ИНН ${COMPANY.inn}  ОГРН ${COMPANY.ogrn}`,
    COMPANY.address,
    `Банк: ${COMPANY.bank}`,
    `БИК ${COMPANY.bik}  Р/с ${COMPANY.account}`,
  ], 36, y);

  const clientLines: string[] = [];
  if (user.payerType === "company") {
    clientLines.push(user.orgName || user.name || user.email);
    if (user.inn)          clientLines.push(`ИНН ${user.inn}${user.kpp ? "  КПП " + user.kpp : ""}`);
    if (user.ogrn)         clientLines.push(`ОГРН ${user.ogrn}`);
    if (user.legalAddress) clientLines.push(user.legalAddress);
    if (user.bankName)     clientLines.push(`Банк: ${user.bankName}`);
    if (user.bik && user.bankAccount) clientLines.push(`БИК ${user.bik}  Р/с ${user.bankAccount}`);
  } else {
    clientLines.push(user.name || user.email);
    if (user.inn)   clientLines.push(`ИНН ${user.inn}`);
    if (user.phone) clientLines.push(user.phone);
    clientLines.push(user.email);
  }
  drawSection("ЗАКАЗЧИК", clientLines, 36 + colW + 20, y);

  y -= 14 + Math.max(5, clientLines.length) * 13 + 16;
  page.drawLine({ start: { x: 36, y }, end: { x: width - 36, y }, thickness: 1, color: C.light });
  y -= 20;

  // Table
  const headers   = ["№", "Наименование услуги", "Ед.", "Кол.", "Цена", "Сумма"];
  const colX      = [36, 60, 350, 385, 420, 490];
  const colWidths = [20, 285, 30, 32, 65, 65];

  page.drawRectangle({ x: 36, y: y - 6, width: width - 72, height: 22, color: rgb(0.94, 0.95, 0.98) });
  headers.forEach((h, i) => page.drawText(h, { x: colX[i] + 2, y: y + 2, size: 9, font: fontBold, color: C.mid }));
  y -= 22;

  const svcName  = SVC_NAME[request.service] || request.service;
  const feats    = Array.isArray(request.features)
    ? (request.features as string[]).filter(f => !String(f).startsWith("__")).join(", ")
    : "";
  const rowLabel = feats ? `${svcName}: ${feats}` : svcName;

  const maxW = colWidths[1] - 4;
  const lines2: string[] = [];
  let cur = "";
  for (const w of rowLabel.split(" ")) {
    const test = cur ? cur + " " + w : w;
    if (fontReg.widthOfTextAtSize(test, 9) > maxW) { if (cur) lines2.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines2.push(cur);

  const rowH = Math.max(22, lines2.length * 14 + 8);
  page.drawLine({ start: { x: 36, y }, end: { x: width - 36, y }, thickness: 0.5, color: C.light });
  lines2.forEach((l, li) => page.drawText(l, { x: colX[1] + 2, y: y - 12 - li * 13, size: 9, font: fontReg, color: C.dark }));
  page.drawText("1",                           { x: colX[0] + 2, y: y - 12, size: 9, font: fontReg,  color: C.dark });
  page.drawText("усл.",                        { x: colX[2] + 2, y: y - 12, size: 9, font: fontReg,  color: C.dark });
  page.drawText("1",                           { x: colX[3] + 2, y: y - 12, size: 9, font: fontReg,  color: C.dark });
  page.drawText(fmtRub(request.price),         { x: colX[4] + 2, y: y - 12, size: 9, font: fontReg,  color: C.dark });
  page.drawText(fmtRub(request.price),         { x: colX[5] + 2, y: y - 12, size: 9, font: fontBold, color: C.dark });

  y -= rowH;
  page.drawLine({ start: { x: 36, y }, end: { x: width - 36, y }, thickness: 1, color: C.light });

  y -= 14;
  page.drawText("Итого:",    { x: colX[4], y, size: 9, font: fontBold, color: C.dark });
  page.drawText(fmtRub(request.price), { x: colX[5], y, size: 11, font: fontBold, color: C.accent });
  y -= 14;
  page.drawText("НДС:",      { x: colX[4], y, size: 9, font: fontReg, color: C.mid });
  page.drawText("Без НДС",   { x: colX[5], y, size: 9, font: fontReg, color: C.mid });
  y -= 14;
  page.drawText("К оплате:", { x: colX[4], y, size: 10, font: fontBold, color: C.dark });
  page.drawText(fmtRub(request.price), { x: colX[5], y, size: 12, font: fontBold, color: C.green });

  y -= 30;
  page.drawRectangle({ x: 36, y: y - 14, width: width - 72, height: 50, color: rgb(0.97, 0.98, 1), borderColor: C.light, borderWidth: 1 });
  page.drawText(`Срок оплаты: до ${fmtDate(dueDate)}`, { x: 46, y: y + 22, size: 9, font: fontReg, color: C.mid });
  page.drawText(
    `Назначение: Оплата по счёту ${invoiceNo(request.id)} за разработку (заявка ${request.id.slice(0, 8).toUpperCase()})`,
    { x: 46, y: y + 8, size: 9, font: fontReg, color: C.dark }
  );
  page.drawText(
    `Получатель: ${COMPANY.name}, ИНН ${COMPANY.inn}, р/с ${COMPANY.account}, ${COMPANY.bank}, БИК ${COMPANY.bik}`,
    { x: 46, y: y - 6, size: 8, font: fontReg, color: C.mid }
  );

  page.drawLine({ start: { x: 36, y: 60 }, end: { x: width - 36, y: 60 }, thickness: 0.5, color: C.light });
  page.drawText("Счёт действителен в течение 5 банковских дней.", { x: 36, y: 46, size: 8, font: fontReg, color: C.mid });
  page.drawText(`${COMPANY.name} · ${COMPANY.phone} · ${COMPANY.email} · onestack24.ru`, { x: 36, y: 34, size: 8, font: fontReg, color: C.mid });

  return pdfDoc.save();
}
