import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const data = raw ? JSON.parse(raw) : {};

    console.info("[SITECRM-MOCK] received", {
      createdAt: new Date().toISOString(),
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-real-ip") ||
        (req as any).ip,
    });

    return json({ ok: true, received: true, echo: data });
  } catch (e: any) {
    return json({ ok: false, error: e?.message || "Invalid JSON" }, 400);
  }
}

export function GET() {
  return json({ ok: true, message: "SiteCRM mock endpoint" });
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
