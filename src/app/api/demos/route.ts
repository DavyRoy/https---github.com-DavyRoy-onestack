import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const demos = await prisma.demo.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(demos);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
