// app/api/metrics/audit/route.ts
import { NextResponse } from "next/server";

// Небольшой генератор для правдоподобных событий
function seededRand(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeAudit(limit = 50, seed = Date.now()) {
  const rnd = seededRand(seed);
  const users = ["admin@demo.io", "manager@demo.io", "user@demo.io"];
  const actions = [
    "Создан пользователь",
    "Изменена роль",
    "Сброшен пароль",
    "Экспорт данных",
    "Импорт заказов",
    "Подключён вебхук",
    "Отключена интеграция",
  ];
  const items = Array.from({ length: limit }).map((_, i) => {
    const ts = Date.now() - Math.floor(rnd() * 1000 * 60 * 60 * 24 * 7);
    const user = users[Math.floor(rnd() * users.length)];
    const text = actions[Math.floor(rnd() * actions.length)];
    return {
      id: `a_${seed}_${i}`,
      time: new Date(ts).toISOString(),
      user,
      text,
      href: `/demo/admin/audit/a_${seed}_${i}`,
    };
  });
  // Новые сверху
  items.sort((a, b) => (a.time < b.time ? 1 : -1));
  return items;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.max(1, Math.min(200, Number(searchParams.get("limit") ?? 50)));
  const seed = Number(searchParams.get("seed") ?? 0) || Date.now();
  const data = makeAudit(limit, seed);
  return NextResponse.json(data);
}