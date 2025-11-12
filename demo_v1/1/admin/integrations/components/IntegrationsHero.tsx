"use client";

import { motion } from "framer-motion";

export default function IntegrationsHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        rounded-2xl border border-white/15 bg-white/[0.05] 
        p-5 sm:p-6 md:p-8
        backdrop-blur-sm 
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
      "
    >
      {/* Левая часть: текст */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
          Интеграции
        </h1>
        <p className="text-sm sm:text-base text-white/70 mt-1 max-w-lg">
          Управляйте каналами коммуникаций, вебхуками и подключениями к внешним
          сервисам. Каталог включает готовые коннекторы для маркетинга, аналитики и автоматизации.
        </p>
      </div>

      {/* Правая часть: иконка или CTA */}
      <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
        <div
          className="
            hidden sm:flex items-center justify-center
            rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-400/10
            border border-white/10 w-16 h-16 md:w-20 md:h-20
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 md:w-8 md:h-8 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v18m9-9H3"
            />
          </svg>
        </div>
      </div>
    </motion.header>
  );
}