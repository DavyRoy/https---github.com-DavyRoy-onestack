import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/manager-auth";
import { prisma } from "@/lib/prisma";

const STATUS_TS: Record<string, string> = {
  IN_REVIEW:   "reviewedAt",
  APPROVED:    "approvedAt",
  IN_PROGRESS: "startedAt",
  COMPLETED:   "completedAt",
  CANCELLED:   "cancelledAt",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(req);
    const { id } = await params;
    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true, phone: true, company: true, balance: true } },
        project: {
          include: {
            stages: {
              orderBy: { order: "asc" },
              include: { subtasks: { orderBy: { order: "asc" } } },
            },
          },
        },
        chatMessages: { orderBy: { createdAt: "asc" } },
        comments:     { orderBy: { createdAt: "asc" } },
        files:        { orderBy: { createdAt: "desc" } },
      },
    });
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(request);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(req);
    const { id } = await params;
    const { status, price, managerNote, priority, type } = await req.json();

    const tsField = status ? STATUS_TS[status] : undefined;
    // Когда менеджер ставит цену — автоматически переводим в PROPOSED
    const priceStatus = price !== undefined ? "PROPOSED" : undefined;

    const request = await prisma.request.update({
      where: { id },
      data: {
        ...(status      !== undefined && { status }),
        ...(price       !== undefined && { price: price ? Number(price) : null }),
        ...(priceStatus !== undefined && { priceStatus }),
        ...(managerNote !== undefined && { managerNote }),
        ...(priority    !== undefined && { priority }),
        ...(type        !== undefined && { type }),
        ...(tsField && { [tsField]: new Date() }),
      },
      include: {
        user: { select: { id: true, email: true, name: true, phone: true, company: true } },
        project: {
          include: {
            stages: {
              orderBy: { order: "asc" },
              include: { subtasks: { orderBy: { order: "asc" } } },
            },
          },
        },
        chatMessages: { orderBy: { createdAt: "asc" } },
        comments:     { orderBy: { createdAt: "asc" } },
        files:        { orderBy: { createdAt: "desc" } },
      },
    });
    return NextResponse.json(request);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
