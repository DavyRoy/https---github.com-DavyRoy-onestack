'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Monitor,
  Heart,
  Truck,
  Wrench,
  Bus,
  Users,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

/* ===================== Data ===================== */
const industries = [
  {
    id: 'medicine',
    title: 'Медицина',
    description: 'Запись, телемедицина, биллинг, отчёты',
    href: '/demo/medicine',
    icon: Heart,
    image: '/demo/images/medicine.png',
    tags: ['Веб', 'Мобайл', 'Интеграции'],
    kpis: [
      { label: 'Пациенты', value: '2.1K', trend: '+8%' },
      { label: 'Записи', value: '480', trend: '+4%' },
    ],
    gradient: 'from-red-500/10 to-pink-500/10',
  },
  {
    id: 'social',
    title: 'Социальные услуги',
    description: 'Заявки, встречи, чат, волонтёры, аналитика',
    href: '/demo/social',
    icon: Users,
    image: '/demo/images/social.png',
    tags: ['Веб', 'Мобайл', 'CRM'],
    kpis: [
      { label: 'Заявки', value: '860', trend: '+6%' },
      { label: 'Волонтёры', value: '340', trend: '+3%' },
    ],
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    id: 'logistics',
    title: 'Доставка + Склад',
    description: 'Заказы, трекинг, склад, накладные, интеграции',
    href: '/demo/logistics',
    icon: Truck,
    image: '/demo/images/logistics.png',
    tags: ['Веб', 'Мобайл', 'API'],
    kpis: [
      { label: 'Заказы', value: '1.2K', trend: '+12%' },
      { label: 'Склады', value: '12', trend: 'стабильно' },
    ],
    gradient: 'from-orange-500/10 to-amber-500/10',
  },
  {
    id: 'autoservice',
    title: 'Автосервис',
    description: 'Заявки, расчёт, расписание, фотоотчёты, оплата',
    href: '/demo/autoservice',
    icon: Wrench,
    image: '/demo/images/autoservice.png',
    tags: ['Веб', 'Мобайл', 'Платежи'],
    kpis: [
      { label: 'Заезды', value: '230', trend: '+5%' },
      { label: 'Станции', value: '18', trend: 'стабильно' },
    ],
    gradient: 'from-green-500/10 to-emerald-500/10',
  },
  {
    id: 'transport',
    title: 'Общественный транспорт',
    description: 'Расписание, GPS, билеты, водители, экспорт',
    href: '/demo/transport',
    icon: Bus,
    image: '/demo/images/transport.png',
    tags: ['Веб', 'Мобайл', 'Геоданные'],
    kpis: [
      { label: 'Рейсы', value: '760', trend: '+7%' },
      { label: 'Водители', value: '410', trend: '+2%' },
    ],
    gradient: 'from-purple-500/10 to-violet-500/10',
  },
  {
    id: 'services',
    title: 'Сфера услуг',
    description: 'Бронирование, билеты, лояльность, выручка, склад',
    href: '/demo/services',
    icon: Monitor,
    image: '/demo/images/services.png',
    tags: ['Веб', 'Мобайл', 'Аналитика'],
    kpis: [
      { label: 'Клиенты', value: '4.2K', trend: '+9%' },
      { label: 'Продажи', value: '₽2.5M', trend: '+6%' },
    ],
    gradient: 'from-indigo-500/10 to-blue-500/10',
  },
];

/* ===================== Animation ===================== */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/* ===================== Component ===================== */
export default function DemoIndustriesShowcase() {
  return (
    <section
      id="industries"
      className="relative py-20 sm:py-24 text-white"
      style={{ background: "#07100e" }}
      aria-labelledby="industries-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(45,212,191,0.07)" }} />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(45,212,191,0.05)" }} />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '3rem 3rem',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <h2
            id="industries-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent mb-4"
          >
            Отраслевые решения
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Реалистичные демо систем автоматизации под каждую отрасль бизнеса
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7"
        >
          {industries.map((industry) => (
            <motion.div key={industry.id} variants={card}>
              <IndustryCard industry={industry} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ===================== Card ===================== */
function IndustryCard({ industry }: { industry: (typeof industries)[0] }) {
  const Icon = industry.icon;

  return (
    <Link
      href={industry.href}
      className="group relative block rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
      aria-label={`Открыть демо ${industry.title}`}
    >
      {/* Background gradient hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        aria-hidden="true"
      />

      {/* Image preview */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl border-b border-white/[0.08]">
        <Image
          src={industry.image}
          alt={industry.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/[0.15] text-xs text-white/70">
          <Icon className="w-4 h-4 text-white/80" />
          {industry.title}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 sm:p-6 flex flex-col justify-between h-[260px]">
        {/* Description */}
        <div>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4">
            {industry.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {industry.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* KPI mini-dashboard */}
        <div className="flex items-center justify-between mb-4">
          {industry.kpis.map((kpi) => (
            <div key={kpi.label} className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-white">{kpi.value}</div>
              <div className="text-xs text-white/60">{kpi.label}</div>
              <div className="text-[10px] text-green-400/80 flex items-center justify-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> {kpi.trend}
              </div>
            </div>
          ))}
        </div>

        {/* CTA footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
          <span className="text-xs sm:text-sm text-white/60 group-hover:text-white transition-colors">
            Перейти к демо
          </span>
          <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}