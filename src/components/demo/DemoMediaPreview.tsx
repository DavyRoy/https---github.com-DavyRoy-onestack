'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, Monitor, X, ArrowRight, Sparkles, Heart, Users, Truck, Wrench, Bus } from 'lucide-react';

const mediaItems = [
  {
    id: 'medicine',
    type: 'image',
    src: '/demo/images/medicine.png',
    alt: 'Медицинская платформа с системой записи пациентов, телемедициной и управлением медицинскими картами',
    title: 'Медицина',
    description: 'Комплексная медицинская платформа для автоматизации клиник, телемедицины и управления пациентами',
    category: 'Медицинская система',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    features: ['Электронная запись', 'Телемедицина', 'Медкарты', 'Биллинг']
  },
  {
    id: 'social', 
    type: 'image',
    src: '/demo/images/social.png',
    alt: 'Платформа социальных услуг с системой заявок, расписанием встреч и управлением волонтерами',
    title: 'Социальные услуги',
    description: 'Система для организации социальной помощи, управления заявками и координации волонтеров',
    category: 'Социальная платформа',
    technologies: ['Next.js', 'MongoDB', 'WebSocket'],
    features: ['Заявки и обращения', 'Расписание встреч', 'Чат поддержки', 'Аналитика']
  },
  {
    id: 'logistics',
    type: 'image',
    src: '/demo/images/logistics.png',
    alt: 'Логистическая платформа с трекингом доставок, управлением складом и системой накладных',
    title: 'Доставка+Склад',
    description: 'Комплексное решение для логистических компаний с трекингом, складским учетом и API интеграциями',
    category: 'Логистическая система',
    technologies: ['Vue.js', 'Python', 'Redis', 'RabbitMQ'],
    features: ['Трекинг доставок', 'Складской учет', 'Накладные', 'API интеграции']
  },
  {
    id: 'autoservice',
    type: 'image',
    src: '/demo/images/autoservice.png',
    alt: 'Система управления автосервисом с онлайн-записями, расчетом стоимости и фотоотчетами работ',
    title: 'Автосервис',
    description: 'Платформа для автоматизации автосервисов с онлайн-записями, расчетами и управлением клиентами',
    category: 'Автосервис система',
    technologies: ['React', 'Express.js', 'MySQL', 'Stripe'],
    features: ['Онлайн-запись', 'Расчет стоимости', 'Фотоотчеты', 'Онлайн-оплата']
  },
  {
    id: 'transport',
    type: 'image',
    src: '/demo/images/transport.png',
    alt: 'Система управления общественным транспортом с расписанием, GPS-трекингом и продажей билетов',
    title: 'Общественный транспорт',
    description: 'Комплексная система для управления общественным транспортом, пассажиропотоком и билетными операциями',
    category: 'Транспортная система',
    technologies: ['Angular', 'Java', 'PostgreSQL', 'GIS'],
    features: ['Расписание маршрутов', 'GPS трекинг', 'Электронные билеты', 'Отчетность']
  },
  {
    id: 'services',
    type: 'image',
    src: '/demo/images/services.png',
    alt: 'Платформа для сферы услуг с системой бронирования, программой лояльности и аналитикой выручки',
    title: 'Сфера услуг',
    description: 'Универсальная платформа для бизнеса в сфере услуг с бронированием, лояльностью и аналитикой',
    category: 'Сервисная платформа',
    technologies: ['React Native', 'NestJS', 'MongoDB', 'Firebase'],
    features: ['Онлайн-бронирование', 'Программа лояльности', 'Аналитика выручки', 'CRM система']
  }
];

// Правильно определяем иконки для категорий
const categoryIcons = {
  'Медицинская система': Heart,
  'Социальная платформа': Users,
  'Логистическая система': Truck,
  'Автосервис система': Wrench,
  'Транспортная система': Bus,
  'Сервисная платформа': Monitor,
} as const;

type Category = keyof typeof categoryIcons;

// Анимационные варианты
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export default function DemoMediaPreview() {
  const [selectedMedia, setSelectedMedia] = useState<typeof mediaItems[0] | null>(null);

  const getCategoryIcon = (category: Category) => {
    return categoryIcons[category] || Monitor;
  };

  return (
    <section 
      className="relative py-16 sm:py-20 md:py-24 bg-black text-white overflow-hidden"
      aria-labelledby="media-preview-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10 sm:opacity-15"
          style={{
            backgroundImage: 
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '3rem 3rem',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs sm:text-sm text-white/80 mb-4 sm:mb-6"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Примеры интерфейсов
          </motion.div>

          <h2 
            id="media-preview-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
          >
            Реальные проекты
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto px-4">
            Изучите полноразмерные превью наших лучших работ. Каждый проект — это 
            современный дизайн, продуманный UX и передовые технологии.
          </p>
        </motion.div>

        {/* Media Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12"
        >
          {mediaItems.map((item, index) => {
            const IconComponent = getCategoryIcon(item.category as Category);
            
            return (
              <motion.article
                key={item.id}
                variants={cardVariants}
                className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black rounded-2xl sm:rounded-3xl"
                onClick={() => setSelectedMedia(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMedia(item);
                  }
                }}
                tabIndex={0}
                aria-label={`Открыть детали проекта: ${item.title}`}
              >
                <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 overflow-hidden">
                  {/* Header */}
                  <div className="relative z-10 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 rounded-lg sm:rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors duration-300 flex-shrink-0">
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 sm:px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs sm:text-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/60 group-hover:text-white/80 transition-colors duration-300 text-xs sm:text-sm">
                      <span>Открыть детали</span>
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Media Container */}
                  <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 mb-4 sm:mb-6">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 90vw"
                      quality={90}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white ml-0.5" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                      <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                        {item.technologies.slice(0, 3).map(tech => (
                          <span 
                            key={tech}
                            className="px-2 sm:px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs text-white/90 border border-white/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className="px-2 sm:px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs text-white/60 border border-white/20">
                            +{item.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                      {item.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {item.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs sm:text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40" aria-hidden="true" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
            Хотите увидеть больше проектов и узнать о процессе разработки?
          </p>
          <Link
            href="/cases"
            className="group inline-flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white text-black px-6 sm:px-8 py-3 sm:py-4 font-semibold hover:bg-white/95 hover:shadow-lg sm:hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 border border-white hover:scale-105 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            Смотреть все кейсы
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedMedia(null)}
            aria-label="Закрыть модальное окно"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-4xl lg:max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-white/5 border border-white/20 backdrop-blur-xl">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/10 bg-black/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 rounded-lg sm:rounded-xl bg-white/10">
                        {(() => {
                          const IconComponent = getCategoryIcon(selectedMedia.category as Category);
                          return <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />;
                        })()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white truncate">
                          {selectedMedia.title}
                        </h3>
                        <p className="text-white/70 text-sm sm:text-base">{selectedMedia.category}</p>
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                      onClick={() => setSelectedMedia(null)}
                      aria-label="Закрыть модальное окно"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="relative aspect-video bg-black">
                  <Image
                    src={selectedMedia.src}
                    alt={selectedMedia.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 90vw, 80vw"
                    quality={95}
                  />
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/10 bg-black/50">
                  <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4">
                    {selectedMedia.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-1">
                      <h4 className="text-white/60 text-sm mb-2">Технологии:</h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedMedia.technologies.map(tech => (
                          <span 
                            key={tech}
                            className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm text-white/80 border border-white/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-white/60 text-sm mb-2">Основные функции:</h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedMedia.features.map((feature, index) => (
                          <span 
                            key={index}
                            className="px-2 sm:px-3 py-1 bg-white/5 rounded-lg text-xs sm:text-sm text-white/70 border border-white/10"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}