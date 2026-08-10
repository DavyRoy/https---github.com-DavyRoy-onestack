// src/app/api/telegram/lead/route.ts
// Receives lead from Telegram Mini App and forwards to admin chat(s)

import { NextRequest, NextResponse } from "next/server";

const SERVICE_LABELS: Record<string, string> = {
  sites:  "Сайт",
  webapp: "Веб-приложение",
  mobile: "Мобильное приложение",
};

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, features, name, contact, message, price } = body as {
      service: string;
      features: string[];
      name: string;
      contact: string;
      message: string;
      price: number;
      initData: string;
    };

    /* ── Basic validation ──────────────────────────────────────── */
    if (!name?.trim() || !contact?.trim()) {
      return NextResponse.json({ error: "name and contact required" }, { status: 400 });
    }

    /* ── Build notification text ───────────────────────────────── */
    const serviceLabel = SERVICE_LABELS[service] ?? service;
    const featureList  = Array.isArray(features) && features.length
      ? features.map(f => `  • ${f}`).join("\n")
      : "  Без дополнительных функций";

    const text = [
      "📱 Новая заявка из Telegram Mini App",
      "",
      `🔧 Услуга: ${serviceLabel}`,
      `💰 Оценка: ${price ? fmt(price) : "не указана"}`,
      `📋 Функции:\n${featureList}`,
      "",
      `👤 Имя: ${name.trim()}`,
      `📞 Контакт: ${contact.trim()}`,
      message?.trim() ? `💬 Описание: ${message.trim()}` : null,
      "",
      `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} МСК`,
    ]
      .filter(l => l !== null)
      .join("\n");

    /* ── Send to Telegram ──────────────────────────────────────── */
    const token    = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds  = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map(s => s.trim()).filter(Boolean);

    if (token && chatIds.length) {
      await Promise.all(
        chatIds.map(chatId =>
          fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          })
        )
      );
    } else {
      // fallback: log to console in dev
      console.info("[tg-lead]", text);
    }

    /* ── Post to CRM ───────────────────────────────────────── */
    const crmUrl   = process.env.CRM_API_URL?.replace(/\/+$/, "") ?? "";
    const crmToken = process.env.CRM_API_TOKEN ?? "";
    if (crmUrl) {
      try {
        await fetch(`${crmUrl}/api/v1/lead/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(crmToken ? { Authorization: `Token ${crmToken}` } : {}),
          },
          body: JSON.stringify({
            name:    name.trim(),
            contact: contact.trim(),
            service: serviceLabel,
            details: message?.trim() ?? "",
            price:   price ?? null,
            features: Array.isArray(features) ? features : [],
            source:  "mini_app",
            status:  "new",
          }),
        });
      } catch (crmErr) {
        console.error("[tg-lead] CRM post failed", crmErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[tg-lead] error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
