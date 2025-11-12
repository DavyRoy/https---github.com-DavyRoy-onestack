// src/app/demo/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users2, ShieldCheck, LineChart, Bell, KeyRound } from "lucide-react";
import DemoCards from "./ui/DemoCards";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

export default function DemoIndexPage() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white px-4 sm:px-6 lg:px-10 py-10">
      {/* мягкие свечения */}
      <div className="pointer-events-none absolute -top-44 -left-44 h-[460px] w-[460px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 -right-44 h-[460px] w-[460px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* заголовок */}
        <motion.p {...fade(0)} className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3">
          демо
        </motion.p>
        <motion.h1 {...fade(0.05)} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
          Интерактивные демо-страницы
        </motion.h1>
        <motion.p {...fade(0.1)} className="mt-4 max-w-3xl text-white/70">
          Посмотрите, как может выглядеть рабочий интерфейс для клиента и администратора:
          навигация, таблицы, фильтры, модальные окна, уведомления — всё кликабельно и в одном стиле.
        </motion.p>

        {/* быстрые факты */}
        <motion.div {...fade(0.15)} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Fact icon={<Users2 className="h-4 w-4" />} title="Роли" text="Клиент и администратор" />
          <Fact icon={<Bell className="h-4 w-4" />} title="UX-паттерны" text="Таблицы, фильтры, модалки" />
          <Fact icon={<KeyRound className="h-4 w-4" />} title="Доступы" text="Имитация RBAC сценариев" />
        </motion.div>

        {/* карточки выбора */}
        <motion.div {...fade(0.2)} className="mt-6">
          <DemoCards
            items={[
              {
                title: "Для пользователя",
                description: "Дашборд, профиль, заказы, уведомления. Удобная навигация и быстрые действия.",
                href: "/demo/user",
                icon: <Users2 className="h-5 w-5" />,
                chips: ["Профиль", "Заказы", "Уведомления"],
                cta: "Открыть демо",
              },
              {
                title: "Для администратора",
                description: "Панель управления: пользователи, роли/права, события, безопасность, аналитика.",
                href: "/demo/admin",
                icon: <ShieldCheck className="h-5 w-5" />,
                chips: ["Пользователи", "Роли", "Аудит", "Графики"],
                cta: "Открыть демо",
              },
            ]}
          />
        </motion.div>

        {/* дополнительный блок-пояснение */}
        <motion.div {...fade(0.28)} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center gap-3 text-white/85">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08]">
              <LineChart className="h-4 w-4" />
            </span>
            <div className="text-lg font-semibold">Что показано в демо</div>
          </div>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
              Навигация и shell (topbar + sidebar), активные состояния
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
              Таблицы, сортировки, фильтры, пагинация
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
              Формы, валидации, модальные окна, тосты
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
              Разделы «Профиль», «Роли», «События», «Безопасность», «Аналитика»
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/demo/user"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-black font-semibold hover:shadow-white/20 hover:shadow-lg transition"
            >
              К демо для пользователя
            </Link>
            <Link
              href="/demo/admin"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 font-semibold hover:bg-white/10 transition"
            >
              К демо для администратора
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------- small component ---------------------------- */
function Fact({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
      <div className="flex items-center gap-2 text-white/85">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.07]">
          {icon}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-1 text-sm text-white/65">{text}</div>
    </div>
  );
}
