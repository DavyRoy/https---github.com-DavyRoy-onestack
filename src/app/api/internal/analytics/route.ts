import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkSecret(req: NextRequest) {
  return req.headers.get("x-internal-secret") === (process.env.INTERNAL_SECRET ?? "onestack-internal-2024");
}

export async function GET(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);       // start of current month
  const prev  = new Date(now.getFullYear(), now.getMonth() - 1, 1);   // start of prev month
  const prevE = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59); // end of prev month

  const [
    totalRequests,
    thisMonthRequests,
    prevMonthRequests,
    doneRequests,
    inWorkRequests,
    revenueThis,
    revenuePrev,
    revenueTotal,
    newToday,
  ] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { createdAt: { gte: start } } }),
    prisma.request.count({ where: { createdAt: { gte: prev, lte: prevE } } }),
    prisma.request.count({ where: { status: "COMPLETED" } }),
    prisma.request.count({ where: { status: "IN_PROGRESS" } }),
    prisma.request.aggregate({ where: { status: "COMPLETED", updatedAt: { gte: start } }, _sum: { price: true } }),
    prisma.request.aggregate({ where: { status: "COMPLETED", updatedAt: { gte: prev, lte: prevE } }, _sum: { price: true } }),
    prisma.request.aggregate({ where: { status: "COMPLETED" }, _sum: { price: true } }),
    prisma.request.count({ where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } } }),
  ]);

  // Last 6 months breakdown
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const monthlyStats = await Promise.all(
    months.map(async ({ year, month }) => {
      const s = new Date(year, month, 1);
      const e = new Date(year, month + 1, 0, 23, 59, 59);
      const [count, revenue] = await Promise.all([
        prisma.request.count({ where: { createdAt: { gte: s, lte: e } } }),
        prisma.request.aggregate({ where: { status: "COMPLETED", updatedAt: { gte: s, lte: e } }, _sum: { price: true } }),
      ]);
      return {
        label: s.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" }),
        count,
        revenue: revenue._sum.price ?? 0,
      };
    })
  );

  // Service breakdown
  const byService = await prisma.request.groupBy({
    by: ["service"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 8,
  });

  // Status breakdown
  const byStatus = await prisma.request.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const conversionRate = totalRequests > 0 ? Math.round((doneRequests / totalRequests) * 100) : 0;

  return NextResponse.json({
    summary: {
      totalRequests,
      thisMonthRequests,
      prevMonthRequests,
      doneRequests,
      inWorkRequests,
      newToday,
      conversionRate,
      revenueTotal:  revenueTotal._sum.price ?? 0,
      revenueThis:   revenueThis._sum.price ?? 0,
      revenuePrev:   revenuePrev._sum.price ?? 0,
    },
    monthlyStats,
    byService: byService.map(s => ({ service: s.service, count: s._count.id })),
    byStatus:  byStatus.map(s => ({ status: s.status, count: s._count.id })),
  });
}
