// app/api/metrics/compliance/route.ts
import { NextResponse } from "next/server";
import { mockCompliance } from "@/app/demo/admin/dashboard/data/mockAdminDashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  // Преобразуем текущие мок-данные к ожидаемому формату
  const c = mockCompliance();
  const data = [
    {
      id: "export",
      title: "Экспорт данных",
      description: c.exportNote,
      status: "ok",
      href: "/demo/admin/compliance/exports",
    },
    {
      id: "retention",
      title: "Политики хранения",
      description: c.retentionNote,
      status: "warn",
      href: "/demo/admin/compliance/policies",
    },
    {
      id: "dpa",
      title: "DPA / Соглашения",
      description: c.dpaNote,
      status: "pending",
      href: "/demo/admin/compliance/dpa",
    },
  ];
  return NextResponse.json(data);
}