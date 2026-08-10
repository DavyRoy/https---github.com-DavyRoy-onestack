'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket,
  Settings,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Database,
} from 'lucide-react';

/* ===================== Data ===================== */
const features = [
  {
    icon: Rocket,
    title: 'Мгновенное развертывание',
    description:
      'Запускайте отраслевые демо и готовые решения за считанные минуты — без установки и сложных конфигураций.',
    stats: '⏱ ~2 мин / запуск',
    benefits: ['Готовые шаблоны', 'Контейнеризация', 'Автоматические обновления'],
  },
  {
    icon: Settings,
    title: 'Гибкая настройка',
    description:
      'Настраивайте интерфейсы и процессы под ваш бизнес, без необходимости доработок в коде.',
    stats: '⚙️ Конструктор процессов',
    benefits: ['Drag-and-drop модули', 'API-интеграции', 'Workflow Editor'],
  },
  {
    icon: BarChart3,
    title: 'Аналитика в реальном времени',
    description:
      'Отслеживайте KPI, отчёты и прогнозы в едином окне. Полная прозрачность данных и производительности.',
    stats: '📊 Обновление каждые 15 сек',
    benefits: ['Дашборды', 'AI-прогнозы', 'Экспорт в Excel и PDF'],
  },
  {
    icon: Database,
    title: 'Интеграция данных',
    description:
      'Подключайте CRM, ERP, сторонние API и базы данных для комплексной экосистемы.',
    stats: '🔗 30+ коннекторов',
    benefits: ['REST / GraphQL', 'Webhook события', 'Потоки данных'],
  },
  {
    icon: Cpu,
    title: 'AI-ассистент',
    description:
      'Встроенные алгоритмы подсказывают решения, прогнозируют спрос и оптимизируют рабочие процессы.',
    stats: '🤖 GPT-поддержка',
    benefits: ['Рекомендации', 'Натуральный язык', 'Автоотчёты'],
  },
];

/* ===================== Animation ===================== */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ===================== Component ===================== */
export default function DemoFeatures() {
  return (
    <section
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24"
      aria-labelledby="features-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(45,212,191,0.07)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(45,212,191,0.05)" }} />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '3rem 3rem',
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-14 sm:mb-20">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-4"
          >
            Возможности платформы
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Всё, что нужно для демонстрации и масштабирования бизнес-систем — уже встроено.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="relative group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-md
                         hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 overflow-hidden"
            >
              {/* Glow border */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/0 via-teal-400/8 to-teal-300/0 opacity-0 group-hover:opacity-100 blur-xl transition duration-500"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="mb-5">
                  <feature.icon className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm sm:text-base mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2 flex-1">
                  {feature.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-white/70 text-sm group-hover:text-white/90 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-cyan-400/80" />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Stats line */}
                <div className="mt-5 text-xs text-white/50 border-t border-white/[0.08] pt-3">
                  {feature.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={item}
          className="text-center mt-14 sm:mt-20"
        >
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base
                       hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(45,212,191,0.25)] transition-all duration-300"
            style={{ background: "#2dd4bf", color: "#07100e" }}
          >
            <span>Изучить все возможности</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-xs sm:text-sm text-white/50">
            Подробный обзор модулей и аналитики платформы
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}