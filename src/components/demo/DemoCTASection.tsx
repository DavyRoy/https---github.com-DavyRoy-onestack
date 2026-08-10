'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Users, Rocket, TrendingUp } from 'lucide-react';

/* ===================== Motion Variants ===================== */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ===================== Dashboard CTA Section ===================== */
export default function DemoCTASection() {
  return (
    <section
      className="relative py-20 sm:py-24 text-white overflow-hidden border-t border-white/10"
      style={{ background: "#07100e" }}
      aria-labelledby="cta-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Soft gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.02]" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 blur-3xl rounded-full" style={{ background: "rgba(45,212,191,0.07)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 blur-3xl rounded-full" style={{ background: "rgba(45,212,191,0.05)" }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '3rem 3rem',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          {/* Heading */}
          <motion.h2
            variants={item}
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent"
          >
            Начните демо прямо сейчас
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={item}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed"
          >
            Оцените интерфейс, функциональность и аналитику каждой отрасли — как будто вы уже
            работаете внутри системы.
          </motion.p>

          {/* KPI Grid */}
          <motion.div
            variants={item}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-3xl mx-auto mb-14"
          >
            {[
              { icon: Zap, value: '6+', label: 'Отраслей', trend: '+2 за месяц' },
              { icon: Users, value: '150+', label: 'Активных ролей', trend: '+15%' },
              { icon: Rocket, value: '99.9%', label: 'Uptime', trend: 'стабильно' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md 
                           hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className="h-6 w-6 text-white/60" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm mb-1">{stat.label}</div>
                <div className="flex items-center justify-center gap-1 text-xs text-green-400/80">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/demo"
              className="group relative inline-flex items-center gap-2 px-8 py-3 sm:px-10 sm:py-4 text-base font-semibold rounded-xl 
                         bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 text-white
                         hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-[1.03]
                         focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Перейти к демо
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="text-white/70 hover:text-white transition-colors duration-200 px-4 py-2"
            >
              Связаться с нами →
            </Link>
          </motion.div>

          {/* Footer note */}
          <motion.div
            variants={item}
            className="mt-12 text-xs sm:text-sm text-white/40"
          >
            Более 50 компаний уже тестируют наши решения в демо-режиме
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}