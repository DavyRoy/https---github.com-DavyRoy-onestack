// src/app/demo/ui/DemoShell.tsx
"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { DemoSidebar } from "./DemoSidebar";
import { DemoTopbar } from "./DemoTopbar";
import type { ReactNode } from "react";

type Role = "admin" | "user";

/** Определяем роль по URL; если не /demo/admin* или /demo/user* — возвращаем null */
function resolveRole(path?: string): Role | null {
  if (!path) return null;
  if (path.startsWith("/demo/admin")) return "admin";
  if (path.startsWith("/demo/user")) return "user";
  return null;
}

export default function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const role = resolveRole(pathname);
  const reduceMotion = useReducedMotion();

  const Background = () => (
    <>
      {/* мягкие свечения; на мобилках выключаем ради FPS */}
      <div className="pointer-events-none fixed -top-40 -left-40 hidden sm:block h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 hidden sm:block h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
    </>
  );

  const mainMotionProps = reduceMotion
    ? { initial: false, animate: false }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  // На /demo (или других страницах без роли) — рендерим без шела
  if (!role) {
    return (
      <section className="min-h-[100dvh] w-full bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
        <a
          href="#demo-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black"
        >
          Перейти к основному содержимому
        </a>
        <Background />
        <motion.main
          key={pathname}
          {...mainMotionProps}
          className="relative z-10 p-4 sm:p-6 md:p-8"
          role="main"
          id="demo-main"
        >
          {children}
        </motion.main>
      </section>
    );
  }

  // Роль определена — показываем shell
  return (
    <section className="min-h-[100dvh] w-full bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
      <a
        href="#demo-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        Перейти к основному содержимому
      </a>

      <Background />

      {/* сетка: на десктопе 260px + контент, на мобиле сайдбар скрыт */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Статичный сайдбар только на ≥lg, чтобы не дублировался с мобильным меню */}
        <nav
          aria-label="Боковая навигация"
          className="hidden lg:block lg:border-r lg:border-white/10"
        >
          <DemoSidebar role={role} />
        </nav>

        <div className="min-h-screen">
          {/* Верхняя панель (включая триггер мобильного меню) */}
          <header role="banner" className="border-b border-white/10 lg:border-b-0">
            <DemoTopbar role={role} />
          </header>

          <motion.main
            key={pathname}
            {...mainMotionProps}
            className="p-4 sm:p-6 md:p-8"
            role="main"
            id="demo-main"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </section>
  );
}
