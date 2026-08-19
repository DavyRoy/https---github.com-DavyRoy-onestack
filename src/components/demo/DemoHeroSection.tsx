'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { useState, useEffect, useMemo, useId } from 'react';
import { CheckCircle2, Play, ArrowRight, Sparkles } from 'lucide-react';

/* ===================== Motion helpers ===================== */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  },
});

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

/* ===================== Component ===================== */
export default function DemoHeroSection() {
  const [reduced, setReduced] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(q.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    q.addEventListener?.('change', listener);
    return () => q.removeEventListener?.('change', listener);
  }, []);

  /* ===================== JSON-LD for SEO ===================== */
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://onestack24.ru';
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'DemoPage',
      name: 'OneStack Demo - Цифровые решения для бизнеса',
      description:
        'Интерактивные демо-версии отраслевых решений: медицина, логистика, автосервис, транспорт и другие сферы',
      url: `${SITE_URL}/demo`,
    }),
    [SITE_URL]
  );

  return (
    <section
      id="demo-hero"
      aria-labelledby={titleId}
      className="relative flex items-center justify-center overflow-hidden min-h-[100dvh] text-white"
      style={{ background: "#07100e" }}
    >
      {/* SEO structured data */}
      <script
        id="ld-demo-hero"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Layers */}
      <div className="absolute inset-0 -z-10">
        {/* Soft gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.02]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 blur-3xl rounded-full" style={{ background: "rgba(45,212,191,0.07)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 blur-3xl rounded-full" style={{ background: "rgba(45,212,191,0.05)" }} />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '3rem 3rem',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
        >
          {/* Left Content */}
          <div className="lg:col-span-7 xl:col-span-6 text-center lg:text-left">
            <motion.div
              variants={fadeUp(0)}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-6 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur text-xs sm:text-sm text-white/80"
            >
              <Sparkles className="h-3 w-3" />
              Интерактивные демо-версии
            </motion.div>

            <motion.h1
              id={titleId}
              variants={fadeUp(0.1)}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6"
            >
              <span className="block text-white">Цифровые решения</span>
              <span className="block text-white/90">для отраслевого роста</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                вашего бизнеса
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp(0.2)}
              className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8"
            >
              Универсальная платформа для демонстрации, анализа и настройки отраслевых
              решений. Всё готово для старта за считанные минуты.
            </motion.p>

            <motion.ul
              variants={container}
              className="space-y-2 sm:space-y-3 text-left max-w-md mx-auto lg:mx-0 mb-8 text-sm sm:text-base text-white/75"
            >
              {[
                '6 отраслевых направлений: медицина, логистика, транспорт и др.',
                'Реалистичные демо с интерактивными KPI и аналитикой',
                'Единый стек технологий: React, Next.js, Tailwind, shadcn/ui',
                'Премиальный UI/UX-уровень, адаптированный под бизнес-сценарии',
              ].map((t, i) => (
                <motion.li key={i} variants={fadeUp(0.3 + i * 0.1)} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {t}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeUp(0.7)}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link
                href="#industries"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                           bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 text-white
                           hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]
                           transition-all duration-300"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Посмотреть демо
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right side (image / preview) */}
          <div className="lg:col-span-5 xl:col-span-6 relative hidden lg:flex justify-center">
            <div className="relative w-[90%] max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_0_40px_rgba(255,255,255,0.05)] bg-white/[0.03] backdrop-blur-md">
              <Image
                src="/demo/images/service-requests.png"
                alt="Интерфейс демо-платформы OneStack"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-700 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImgLoaded(true)}
              />
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 animate-pulse" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-white/50"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Листайте вниз
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="w-5 h-8 border border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-0.5 h-2 bg-white/60 rounded-full mt-1"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}