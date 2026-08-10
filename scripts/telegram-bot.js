/**
 * OneStack Telegram Bot
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEXT_PUBLIC_SITE_URL, CRM_API_URL
 */

const TelegramBot = require("node-telegram-bot-api");

const CRM_API_URL   = (process.env.CRM_API_URL || "http://crm_proxy_api:8000").replace(/\/+$/, "");
const CRM_API_TOKEN = process.env.CRM_API_TOKEN || "";
const SITE_URL      = (process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru").replace(/\/+$/, "");
const MINI_APP_URL  = `${SITE_URL}/tg`;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TARGET_CHAT_IDS = (process.env.TELEGRAM_CHAT_ID || "").split(",").map(s => s.trim()).filter(Boolean);

if (!BOT_TOKEN)              { console.error("TELEGRAM_BOT_TOKEN not set"); process.exit(1); }
if (!TARGET_CHAT_IDS.length) { console.error("TELEGRAM_CHAT_ID not set");  process.exit(1); }

/* ── CRM ─────────────────────────────────────────────────────────────────── */
async function postLeadToCRM(payload) {
  try {
    const resp = await fetch(`${CRM_API_URL}/api/v1/lead/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(CRM_API_TOKEN ? { Authorization: `Token ${CRM_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        name:             payload.name,
        contact:          payload.contact,
        service:          payload.serviceTitle || "",
        details:          payload.details || "",
        source:           "telegram",
        status:           "new",
        telegram_chat_id: String(payload.telegramChatId || ""),
      }),
    });
    if (!resp.ok) console.error("[CRM] failed:", resp.status, await resp.text());
    else console.log("[CRM] lead created:", payload.name);
  } catch (e) {
    console.error("[CRM] error:", e?.message);
  }
}

/* ── Services ────────────────────────────────────────────────────────────── */
const SERVICES = [
  { key: "sites",   icon: "🌐", title: "Сайт",                sub: "лендинг, корпоративный, интернет-магазин" },
  { key: "webapp",  icon: "⚡", title: "Веб-приложение",       sub: "CRM, личный кабинет, SaaS, аналитика"    },
  { key: "mobile",  icon: "📱", title: "Мобильное приложение", sub: "iOS и Android, React Native"              },
  { key: "complex", icon: "🚀", title: "Комплексный проект",   sub: "сайт + веб + мобильное под ключ"          },
];

/* ── Sessions ────────────────────────────────────────────────────────────── */
const sessions = new Map();
const fresh    = () => ({ step: "idle", service: null, name: null, contact: null, details: null });
const reset    = id => sessions.set(id, fresh());
const get      = id => { if (!sessions.has(id)) reset(id); return sessions.get(id); };

/* ── Bot ─────────────────────────────────────────────────────────────────── */
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const HTML = { parse_mode: "HTML" };

function serviceKeyboard() {
  return {
    inline_keyboard: [
      ...SERVICES.map(s => [{ text: `${s.icon}  ${s.title} — ${s.sub}`, callback_data: `svc:${s.key}` }]),
      [{ text: "🔗  Открыть мини-приложение", url: MINI_APP_URL }],
    ],
  };
}

function welcome(firstName) {
  const name = firstName ? `<b>${firstName}</b>, привет!` : "Привет!";
  return (
    `👋 ${name}\n\n` +
    `Я бот студии <b>OneStack</b> — разрабатываем сайты, веб-приложения и мобильные.\n\n` +
    `📱 <b>Нажмите кнопку ниже</b> — откроется приложение с калькулятором стоимости.\n` +
    `Там выберите услугу, нужные функции и оставьте заявку.\n\n` +
    `Или выберите направление прямо здесь:`
  );
}

/* ── Уведомление менеджерам ──────────────────────────────────────────────── */
async function notifyManagers(payload) {
  const lines = [
    `📥 <b>Новая заявка с Telegram-бота</b>`,
    ``,
    `👤 <b>Имя:</b> ${payload.name}`,
    `📞 <b>Контакт:</b> ${payload.contact}`,
    payload.serviceTitle ? `🔧 <b>Услуга:</b> ${payload.serviceTitle}` : null,
    payload.details      ? `💬 <b>Описание:</b> ${payload.details}`    : null,
    ``,
    `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} МСК`,
  ].filter(l => l !== null).join("\n");

  for (const id of TARGET_CHAT_IDS) {
    try { await bot.sendMessage(id, lines, HTML); }
    catch (e) { console.error("notify error:", e?.message); }
  }
}

/* ── Показать меню ───────────────────────────────────────────────────────── */
function showMenu(chatId, firstName) {
  reset(chatId);
  get(chatId).step = "service";
  return bot.sendMessage(chatId, welcome(firstName), {
    ...HTML,
    reply_markup: serviceKeyboard(),
  });
}

/* ── Установить Menu Button для пользователя ─────────────────────────────── */
async function setMenuButton(chatId) {
  try {
    await bot.setChatMenuButton(chatId, {
      type: "web_app",
      text: "Открыть приложение",
      web_app: { url: MINI_APP_URL },
    });
  } catch (e) {
    console.error("[MenuButton] failed:", e?.message);
  }
}

/* ── /start и любое первое сообщение ────────────────────────────────────── */
bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;
  await setMenuButton(chatId);
  showMenu(chatId, msg.from?.first_name);
});
bot.onText(/\/cancel/, msg => {
  reset(msg.chat.id);
  bot.sendMessage(msg.chat.id, "↩️ Сброшено.", { reply_markup: serviceKeyboard() });
});
bot.onText(/\/help/, msg => {
  bot.sendMessage(
    msg.chat.id,
    `❓ <b>Как оставить заявку:</b>\n\n` +
    `1. Выберите услугу из списка\n` +
    `2. Напишите имя\n` +
    `3. Укажите контакт (телефон или @username)\n` +
    `4. Опишите задачу\n\n` +
    `Или откройте мини-приложение с калькулятором стоимости 👇`,
    { ...HTML, reply_markup: { inline_keyboard: [[{ text: "🔗  Открыть приложение", url: MINI_APP_URL }]] } },
  );
});

/* ── Callback (выбор услуги) ─────────────────────────────────────────────── */
bot.on("callback_query", async query => {
  const chatId = query.message.chat.id;
  const data   = query.data || "";
  await bot.answerCallbackQuery(query.id);

  if (data === "restart") {
    return showMenu(chatId, query.from?.first_name);
  }

  if (data.startsWith("svc:")) {
    const service = SERVICES.find(s => s.key === data.split(":")[1]);
    if (!service) return;
    const s      = get(chatId);
    s.service    = service;
    s.step       = "name";
    return bot.sendMessage(
      chatId,
      `${service.icon} <b>${service.title}</b>\n\n` +
      `Как вас зовут?`,
      {
        ...HTML,
        reply_markup: {
          inline_keyboard: [[{ text: "← Выбрать другое", callback_data: "restart" }]],
        },
      },
    );
  }
});

/* ── Текстовые сообщения ─────────────────────────────────────────────────── */
bot.on("message", async msg => {
  if (msg.text?.startsWith("/")) return;

  const chatId  = msg.chat.id;
  const session = get(chatId);

  /* Поделился контактом */
  if (msg.contact) {
    if (session.step !== "contact") return;
    session.contact = msg.contact.phone_number;
    session.step    = "details";
    return bot.sendMessage(
      chatId,
      `✅ Контакт получен!\n\n💬 <b>Опишите задачу</b> — что нужно сделать, сроки, пожелания.\n\n<i>Можно написать «-» если пока ничего нет.</i>`,
      { ...HTML, reply_markup: { remove_keyboard: true } },
    );
  }

  const text = (msg.text || "").trim();

  /* Если сессия "idle" — любое сообщение показывает меню */
  if (session.step === "idle" || session.step === "service") {
    return showMenu(chatId, msg.from?.first_name);
  }

  switch (session.step) {

    case "name":
      session.name = text || "Без имени";
      session.step = "contact";
      return bot.sendMessage(
        chatId,
        `Приятно познакомиться, <b>${session.name}</b>! 👋\n\n` +
        `📞 <b>Укажите контакт:</b> номер телефона или @username в Telegram.`,
        {
          ...HTML,
          reply_markup: {
            keyboard:          [[{ text: "📱 Поделиться номером", request_contact: true }]],
            resize_keyboard:   true,
            one_time_keyboard: true,
          },
        },
      );

    case "contact":
      session.contact = text || "Не указан";
      session.step    = "details";
      return bot.sendMessage(
        chatId,
        `💬 <b>Опишите задачу</b> — что нужно сделать, сроки, пожелания.\n\n<i>Можно написать «-» если пока ничего нет.</i>`,
        { ...HTML, reply_markup: { remove_keyboard: true } },
      );

    case "details": {
      session.details = text === "-" ? "" : text;
      const payload = {
        serviceTitle:   session.service?.title || "",
        name:           session.name    || "Без имени",
        contact:        session.contact || "Не указан",
        details:        session.details,
        telegramChatId: chatId,
      };

      await Promise.all([notifyManagers(payload), postLeadToCRM(payload)]);
      reset(chatId);

      return bot.sendMessage(
        chatId,
        `✅ <b>Заявка принята!</b>\n\n` +
        `Мы свяжемся с вами в течение <b>одного рабочего дня</b>.\n\n` +
        `Если хотите — можете посмотреть портфолио и калькулятор в приложении 👇`,
        {
          ...HTML,
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔗  Открыть приложение", url: MINI_APP_URL }],
              [{ text: "📋  Оставить ещё заявку", callback_data: "restart" }],
            ],
          },
        },
      );
    }

    default:
      return showMenu(chatId, msg.from?.first_name);
  }
});

console.log(`✅ OneStack bot started`);
console.log(`   Mini App: ${MINI_APP_URL}`);
console.log(`   CRM API:  ${CRM_API_URL}`);
