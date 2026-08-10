import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateActPdf, actNo } from "@/lib/act";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = requireAuth(req);
    const { id } = await params;
    const request = await prisma.request.findFirst({ where: { id, userId }, include: { user: true } });
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!request.price) return NextResponse.json({ error: "Цена не установлена" }, { status: 400 });
    if (request.status !== "COMPLETED") return NextResponse.json({ error: "Работы ещё не завершены" }, { status: 400 });

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
    const status = e.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
