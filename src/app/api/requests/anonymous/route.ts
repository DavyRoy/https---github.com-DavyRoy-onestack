import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// System guest account — created once, reused for all anonymous requests
async function getGuestUser() {
  const email = "guest@onestack.system";
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, password: "", name: "Гость" },
    });
  }
  return user;
}

// POST /api/requests/anonymous
// Creates a request without auth, returns claimToken for later attachment
export async function POST(req: NextRequest) {
  try {
    const { service, features, message, name, phone, email } = await req.json();
    if (!service) return NextResponse.json({ error: "service required" }, { status: 400 });

    const guest = await getGuestUser();
    const claimToken = crypto.randomBytes(24).toString("hex");

    const request = await prisma.request.create({
      data: {
        userId:     guest.id,
        service,
        features:   features ?? [],
        message:    [message, name && `Имя: ${name}`, phone && `Телефон: ${phone}`, email && `Email: ${email}`].filter(Boolean).join("\n"),
        claimToken,
      },
    });

    // Send Telegram notification
    const token   = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map(s => s.trim()).filter(Boolean);
    if (token && chatIds.length) {
      const text = [
        "📝 Новая анонимная заявка с сайта",
        `🔧 Услуга: ${service}`,
        name  ? `👤 Имя: ${name}`     : null,
        phone ? `📞 Телефон: ${phone}` : null,
        email ? `📧 Email: ${email}`   : null,
        message ? `💬 ${message}`      : null,
        `🆔 ID: ${request.id.slice(0, 8).toUpperCase()}`,
      ].filter(Boolean).join("\n");
      await Promise.all(chatIds.map(chatId =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text }),
        })
      ));
    }

    return NextResponse.json({ requestId: request.id, claimToken });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
