import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** CORS preflight */
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    // --- предохранители ---
    const len = Number(req.headers.get("content-length") || 0);
    if (len > 64 * 1024) {
      return json({ ok: false, error: "Payload too large" }, 413);
    }

    const raw = await req.text();
    let data: any = {};
    try {
      data = JSON.parse(raw || "{}");
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400);
    }

    // honeypot
    if (typeof data?.website === "string" && data.website.trim()) {
      return json({ ok: true, skipped: true });
    }

    // referer allow-list (опционально)
    const referer = (req.headers.get("referer") || "").toLowerCase();
    const allow = (process.env.LEADS_REF_ALLOW || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (allow.length && !allow.some((h) => referer.includes(h))) {
      data.__ref_not_allowed = true;
    }

    // серверное обогащение (на случай, если клиент не прислал)
    const enriched = enrichFromRequest(req, data);

    // краткая сводка (экранированная для HTML)
    const summary = buildTextSummarySafe(enriched);

    // 1) кастомный вебхук
    let forwarded = false;
    const webhook = process.env.WEBHOOK_URL;
    if (webhook) {
      try {
        const r = await fetch(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ type: "onestack_quote", data: enriched }),
          signal: timeoutSignal(8000),
        });
        forwarded = r.ok;
        if (!r.ok) {
          const t = await r.text().catch(() => "");
          console.error("[QUOTE] Webhook HTTP", r.status, t.slice(0, 200));
        }
      } catch (e) {
        console.error("[QUOTE] Webhook error:", (e as Error)?.message || e);
      }
    }

    // 1b) SiteCRM / webhook для заявок
    if (process.env.SITECRM_URL) {
      try {
        const resp = await fetch(process.env.SITECRM_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ type: "quote", data: enriched }),
          signal: timeoutSignal(8000),
        });
        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          console.error("[QUOTE] SiteCRM HTTP", resp.status, txt.slice(0, 200));
        }
      } catch (e) {
        console.error("[QUOTE] SiteCRM error:", (e as Error)?.message || e);
      }
    }

    // 2) Telegram
    let telegram = false;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChat = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChat) {
      try {
        const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
        const r = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChat,
            text: summary,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
          signal: timeoutSignal(8000),
        });
        telegram = r.ok;
        if (!r.ok) {
          const t = await r.text().catch(() => "");
          console.error("[QUOTE] Telegram HTTP", r.status, t.slice(0, 200));
        }
      } catch (e) {
        console.error("[QUOTE] Telegram error:", (e as Error)?.message || e);
      }
    }

    return json({ ok: true, forwarded, telegram });
  } catch (e) {
    console.error("[QUOTE] Server error:", (e as Error)?.message || e);
    return json({ ok: false, error: "Server error" }, 500);
  }
}

/* ================= helpers ================= */

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function corsHeaders() {
  const origin = process.env.LEADS_CORS_ORIGIN || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function timeoutSignal(ms: number) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    (req as any).ip ||
    "unknown"
  );
}

function enrichFromRequest(req: NextRequest, data: any) {
  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") ?? "";
  const referer = req.headers.get("referer") ?? "";
  return {
    ...data,
    createdAt: data?.createdAt || new Date().toISOString(),
    ua: data?.ua || ua,
    ip: data?.ip || ip,
    referer: data?.referer || referer,
  };
}

// безопасное экранирование под Telegram parse_mode=HTML
function escHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fmtNum(n?: number) {
  if (!Number.isFinite(n)) return "-";
  return Math.round(n!).toLocaleString("ru-RU");
}

function buildTextSummarySafe(p: any) {
  const types = Array.isArray(p?.estimate?.typesSafe) ? p.estimate.typesSafe.join(", ") : "—";
  const hourly = p?.hourly;
  const low = p?.estimate?.low;
  const high = p?.estimate?.high;
  const hours = p?.estimate?.hours;
  const support = p?.estimate?.support;
  const deploy = p?.deploy;
  const timeline = p?.timeline;

  const mods =
    Object.entries(p?.mods ?? {})
      .filter(([, v]: any) => !!v)
      .map(([k]) => k)
      .join(", ") || "—";

  const createdAt = escHtml(p?.createdAt ?? "");
  const ua = escHtml(p?.ua ?? "");
  const ip = escHtml(p?.ip ?? "");
  const ref = escHtml(p?.referer ?? "");

  const name = p?.contact?.name ? `\nИмя: ${escHtml(p.contact.name)}` : "";
  const email = p?.contact?.email ? `\nEmail: ${escHtml(p.contact.email)}` : "";
  const phone = p?.contact?.phone ? `\nТелефон: ${escHtml(p.contact.phone)}` : "";

  return [
    `<b>Новая заявка (калькулятор)</b>`,
    `Типы: ${escHtml(types)}`,
    `Часы: ${escHtml(hours)}`,
    `Вилка: ${escHtml(fmtNum(low))}—${escHtml(fmtNum(high))} ₽`,
    `Ставка: ${escHtml(fmtNum(hourly))} ₽/ч`,
    `Поддержка: ${support ? escHtml(fmtNum(support)) + " ₽/мес" : "нет"}`,
    `Деплой: ${escHtml(deploy)}`,
    `Сроки: ${timeline === "rush" ? "Срочно ×1.35" : "Обычные"}`,
    `Модули: ${escHtml(mods)}`,
    name + email + phone,
    `IP: ${ip}`,
    ref ? `Referer: ${ref}` : "",
    `Создано: ${createdAt}`,
    `UA: ${ua}`,
  ]
    .filter(Boolean)
    .join("\n");
}
