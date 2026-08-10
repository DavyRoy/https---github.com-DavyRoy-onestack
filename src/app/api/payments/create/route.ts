import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const SHOP_ID     = process.env.YOOKASSA_SHOP_ID;
const SECRET_KEY  = process.env.YOOKASSA_SECRET_KEY;
const RETURN_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onestack24.ru";

async function createYookassaPayment(amount: number, description: string, idempotenceKey: string) {
  if (!SHOP_ID || !SECRET_KEY) return null;

  const res = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
      Authorization: "Basic " + Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64"),
    },
    body: JSON.stringify({
      amount:       { value: (amount / 100).toFixed(2), currency: "RUB" },
      capture:      true,
      description,
      confirmation: { type: "redirect", return_url: `${RETURN_URL}/cabinet?payment=success` },
      metadata:     { idempotenceKey },
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const { amount } = await req.json(); // amount in kopecks (rub * 100)

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Минимальная сумма — ₽1" }, { status: 400 });
    }

    const idempotenceKey = randomUUID();

    // If Yookassa not configured — stub for dev/testing
    if (!SHOP_ID || !SECRET_KEY) {
      const payment = await prisma.payment.create({
        data: {
          userId,
          amount,
          status:      "PENDING",
          provider:    "stub",
          providerId:  idempotenceKey,
          description: `Пополнение счёта ₽${(amount / 100).toLocaleString("ru")}`,
        },
      });
      return NextResponse.json({
        paymentId:       payment.id,
        confirmationUrl: null,
        stub:            true,
      });
    }

    const yp = await createYookassaPayment(
      amount,
      `Пополнение счёта OneStack — ₽${(amount / 100).toLocaleString("ru")}`,
      idempotenceKey,
    );

    if (!yp) {
      return NextResponse.json({ error: "Ошибка платёжной системы" }, { status: 502 });
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        status:      "PENDING",
        provider:    "yookassa",
        providerId:  yp.id,
        description: `Пополнение счёта ₽${(amount / 100).toLocaleString("ru")}`,
        meta:        yp,
      },
    });

    return NextResponse.json({
      paymentId:       payment.id,
      confirmationUrl: yp.confirmation?.confirmation_url ?? null,
    });
  } catch (err) {
    console.error("[payments/create]", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
