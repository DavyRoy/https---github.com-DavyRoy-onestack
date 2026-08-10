import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const requests = await prisma.request.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          include: {
            stages: {
              orderBy: { order: "asc" },
              include: { subtasks: { orderBy: { order: "asc" } } },
            },
          },
        },
      },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

async function pushLeadToCRM(data: {
  name: string; contact: string; service: string;
  details: string; source: string; price?: number; features?: unknown[];
}) {
  const crmUrl = process.env.CRM_API_URL;
  if (!crmUrl) return;
  try {
    await fetch(`${crmUrl}/api/v1/lead/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.warn("[CRM push failed]", e);
  }
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    ({ userId } = requireAuth(req));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { service, features, price, message } = await req.json();

    if (!service) return NextResponse.json({ error: "service required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true, email: true, phone: true,
        payerType: true, inn: true, orgName: true, kpp: true, ogrn: true,
        legalAddress: true, bik: true, bankName: true, bankAccount: true,
      },
    });

    const request = await prisma.request.create({
      data: { userId, service, features: features ?? [], price, message },
    });

    // Формируем блок реквизитов для CRM
    const reqLines: string[] = [];
    if (user?.payerType === "company" && user?.inn) {
      reqLines.push(`=== Реквизиты юрлица ===`);
      if (user.inn)          reqLines.push(`ИНН: ${user.inn}`);
      if (user.orgName)      reqLines.push(`Организация: ${user.orgName}`);
      if (user.kpp)          reqLines.push(`КПП: ${user.kpp}`);
      if (user.ogrn)         reqLines.push(`ОГРН: ${user.ogrn}`);
      if (user.legalAddress) reqLines.push(`Адрес: ${user.legalAddress}`);
      if (user.bik)          reqLines.push(`БИК: ${user.bik}`);
      if (user.bankName)     reqLines.push(`Банк: ${user.bankName}`);
      if (user.bankAccount)  reqLines.push(`Р/с: ${user.bankAccount}`);
    } else {
      reqLines.push(`Тип: Физическое лицо`);
    }

    const details = [message || "", ...reqLines].filter(Boolean).join("\n");

    // Отправляем лид в CRM (менеджерское приложение)
    // requestId сохраняем в features чтобы потом синхронизировать цену
    pushLeadToCRM({
      name:    user?.name || user?.email || "Без имени",
      contact: user?.phone || user?.email || "",
      service,
      details,
      source:  "mini_app",
      price:   price ?? undefined,
      features: [
        ...(Array.isArray(features) ? features : []),
        `__requestId:${request.id}`,
      ],
    });

    return NextResponse.json(request, { status: 201 });
  } catch (e: any) {
    console.error("[POST /api/requests]", e);
    return NextResponse.json({ error: e.message ?? "Ошибка" }, { status: 500 });
  }
}
