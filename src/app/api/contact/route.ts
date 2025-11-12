import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(req: NextRequest) {
  try {
    // --- Базовые защиты/ограничители ---
    const contentLen = Number(req.headers.get("content-length") || 0);
    if (contentLen > 64 * 1024) {
      return json({ ok: false, error: "Payload too large" }, 413);
    }

    const raw = await req.text();
    let data: any;
    try {
      data = JSON.parse(raw || "{}");
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400);
    }

    // honeypot-поле: если боты заполняют скрытое поле, игнорим
    if (typeof data?.website === "string" && data.website.trim()) {
      return json({ ok: true, skipped: true });
    }

    // allowlist для реферальных доменов (опционально)
    const referer = (req.headers.get("referer") || "").toLowerCase();
    const allowedRefHosts = (process.env.LEADS_REF_ALLOW || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (allowedRefHosts.length) {
      const isAllowed = allowedRefHosts.some((h) => referer.includes(h));
      if (!isAllowed) {
        // Не блокируем жёстко, но помечаем
        data.__ref_not_allowed = true;
      }
    }

    // --- Валидация обязательных полей ---
    const name = String(data?.name ?? "").trim();
    const email = String(data?.email ?? "").trim().toLowerCase();

    if (!name || !isValidEmail(email)) {
      return json({ ok: false, error: "Invalid payload" }, 400);
    }

    // --- Нормализуем и собираем payload ---
    const payload = buildPayload(req, data, name, email);

    console.info("[CONTACT] New lead:", {
      id: payload.leadId,
      source: payload.source,
      email: payload.email,
      referer: payload.referer,
      ip: payload.ip,
    });

    const tasks: Promise<any>[] = [];

    // Telegram
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const text = buildTelegramText(payload);
      tasks.push(
        postJson(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          }
        ).catch((e) => console.error("[CONTACT] Telegram error:", e?.message || e))
      );
    }

    // SuiteCRM (официальная интеграция)
    if (process.env.SUITECRM_URL && process.env.SUITECRM_USER && process.env.SUITECRM_PASSWORD_MD5) {
      tasks.push(
        createSuiteCrmLead(payload).catch((e) =>
          console.error("[CONTACT] SuiteCRM error:", e?.message || e)
        )
      );
    }
    // Fallback: произвольный webhook «SiteCRM»
    else if (process.env.SITECRM_URL) {
      tasks.push(
        postJson(process.env.SITECRM_URL, payload).catch((e) =>
          console.error("[CONTACT] SiteCRM webhook error:", e?.message || e)
        )
      );
    }

    await Promise.allSettled(tasks);

    return json({ ok: true, leadId: payload.leadId });
  } catch (e: any) {
    console.error("[CONTACT] Error:", e?.message || e);
    return json({ ok: false }, 500);
  }
}

/* ========== helpers ========== */

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

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function genLeadId() {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 6);
  return `L-${ts}-${rnd}`.toUpperCase();
}

function buildPayload(req: NextRequest, data: any, name: string, email: string) {
  const now = new Date();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    (req as any).ip ||
    "unknown";

  const ua = req.headers.get("user-agent") ?? "";
  const referer = req.headers.get("referer") ?? "";

  const phone = String(data?.phone || "").trim();
  const company = String(data?.company || "").trim();
  const message = String(data?.message || "").trim();

  return {
    leadId: genLeadId(),
    kind: "contact" as const,
    createdAt: now.toISOString(),
    ip,
    ua,
    referer,
    source: data?.source ?? "site/contact",
    name,
    email,
    phone,
    company,
    message,
    budget: data?.budget ?? "",
    timeline: data?.timeline ?? "",
    chosenKinds: Array.isArray(data?.kind) ? data.kind : [],
    quote: data?.quote ?? null,
  };
}

function postJson(url: string, body: any, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: ctrl.signal,
  }).finally(() => clearTimeout(t));
}

function escMd(s: string) {
  return String(s).replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

function buildTelegramText(p: any) {
  const L: string[] = [];
  L.push(`*Новая заявка* • *${escMd(p.source)}*`);
  L.push(`*ID:* \`${escMd(p.leadId)}\``);
  L.push(`*Имя:* ${escMd(p.name)}  |  *Email:* ${escMd(p.email)}`);
  if (p.phone) L.push(`*Телефон:* ${escMd(p.phone)}`);
  if (p.company) L.push(`*Компания:* ${escMd(p.company)}`);
  if (p.message) L.push(`*Сообщение:* ${escMd(p.message)}`);
  if (p.budget) L.push(`*Бюджет:* ${escMd(p.budget)}`);
  if (p.timeline) L.push(`*Сроки:* ${escMd(p.timeline)}`);
  if (Array.isArray(p.chosenKinds) && p.chosenKinds.length) {
    L.push(`*Интересует:* ${escMd(p.chosenKinds.join(", "))}`);
  }
  L.push(`—`);
  L.push(`*IP:* ${escMd(p.ip)} | *UA:* ${escMd(String(p.ua).slice(0, 150))}`);
  if (p.referer) L.push(`*Referer:* ${escMd(p.referer)}`);
  return L.join("\n");
}

/* ========== SuiteCRM (REST v4_1) ========== */
/**
 * Требуются:
 *  - SUITECRM_URL (например, https://crm.onestack24.ru)
 *  - SUITECRM_USER (админ/пользователь API)
 *  - SUITECRM_PASSWORD_MD5 (MD5-хеш пароля пользователя SuiteCRM)
 *
 * Почему MD5? REST v4_1 /login ожидает MD5 от пароля.
 * Возьми md5 локально и положи в env, чтобы не тянуть зависимость в рантайм.
 */
async function createSuiteCrmLead(p: any) {
  const base = String(process.env.SUITECRM_URL).replace(/\/+$/, "");
  const rest = `${base}/service/v4_1/rest.php`;

  // 1) login -> session id
  const loginRes = await suitecrmCall(rest, "login", {
    user_auth: {
      user_name: process.env.SUITECRM_USER,
      password: process.env.SUITECRM_PASSWORD_MD5, // MD5 hash!
      version: "1",
    },
    application_name: "onestack-site",
    name_value_list: [],
  });

  const session = loginRes?.id;
  if (!session) throw new Error("SuiteCRM login failed");

  // 2) set_entry -> Leads
  const [first_name, ...restName] = String(p.name).split(" ");
  const last_name = restName.join(" ") || first_name;

  const descParts = [
    p.message ? `Message: ${p.message}` : "",
    p.phone ? `Phone: ${p.phone}` : "",
    p.company ? `Company: ${p.company}` : "",
    p.budget ? `Budget: ${p.budget}` : "",
    p.timeline ? `Timeline: ${p.timeline}` : "",
    p.referer ? `Referer: ${p.referer}` : "",
    p.ip ? `IP: ${p.ip}` : "",
    p.ua ? `UA: ${String(p.ua).slice(0, 200)}` : "",
  ].filter(Boolean);

  const leadPayload = {
    session,
    module_name: "Leads",
    name_value_list: [
      { name: "first_name", value: first_name },
      { name: "last_name", value: last_name },
      { name: "email1", value: p.email },
      { name: "phone_work", value: p.phone || "" },
      { name: "account_name", value: p.company || "" },
      { name: "lead_source", value: p.source || "Website" },
      { name: "status", value: "New" },
      { name: "description", value: descParts.join("\n") },
    ],
  };

  const setRes = await suitecrmCall(rest, "set_entry", leadPayload);
  return setRes;
}

async function suitecrmCall(restUrl: string, method: string, data: any, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const form = new URLSearchParams();
  form.set("method", method);
  form.set("input_type", "JSON");
  form.set("response_type", "JSON");
  form.set("rest_data", JSON.stringify(data || {}));

  const res = await fetch(restUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    signal: ctrl.signal,
  }).finally(() => clearTimeout(t));

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`SuiteCRM ${method} HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const json = await res.json().catch(async () => {
    const txt = await res.text();
    throw new Error(`SuiteCRM ${method} invalid JSON: ${txt.slice(0, 200)}`);
  });

  if ((json as any)?.name === "Invalid Login") {
    throw new Error("SuiteCRM invalid login");
  }
  return json;
}