import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateActPdf, actNo } from "@/lib/act";

function checkSecret(req: NextRequest) {
  return req.headers.get("x-internal-secret") === (process.env.INTERNAL_SECRET ?? "onestack-internal-2024");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const request = await prisma.request.findFirst({ where: { id }, include: { user: true } });
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!request.price) return NextResponse.json({ error: "Цена не установлена" }, { status: 400 });

    const pdfBytes = await generateActPdf(request as any, request.user);
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${actNo(id)}.pdf"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
