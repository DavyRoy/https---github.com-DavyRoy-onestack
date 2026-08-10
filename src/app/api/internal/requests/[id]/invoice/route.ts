// Manager-facing invoice download — protected by internal secret, no client JWT needed
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/invoice";

function checkSecret(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  return secret === (process.env.INTERNAL_SECRET ?? "onestack-internal-2024");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const request = await prisma.request.findUnique({ where: { id }, include: { user: true } });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!request.price) return NextResponse.json({ error: "Цена не установлена" }, { status: 400 });

  const pdfBytes = await generateInvoicePdf(request as any, request.user);
  const invNo = `СЧ-${String(parseInt(id.replace(/[^0-9]/g, "").slice(0, 6) || "1", 10) % 100000).padStart(5, "0")}`;
  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invNo}.pdf"`,
      "Cache-Control":       "no-store",
    },
  });
}
