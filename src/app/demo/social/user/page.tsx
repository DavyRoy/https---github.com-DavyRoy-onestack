'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface KPI {
  label: string;
  value: number;
  change?: number;
  suffix?: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  link?: string;
  color?: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLink?: string;
}

interface ModuleItem {
  label: string;
  value: string;
  details: string;
  metric: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  link: string;
  modal: {
    title: string;
    content: string[];
    metrics: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[];
    action: string;
  };
}

interface ModuleCard {
  id: string;
  title: string;
  type: string;
  mainOverview: {
    label: string;
    description: string;
    value: string;
    metric: string;
    link: string;
    stats: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[];
    metrics?: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[];
    chartData?: { name: string; value: number }[];
    serviceTypes?: { type: string; count: number; percent: number }[];
    requestTypes?: { type: string; count: number; percent: number }[];
    benefitTypes?: { type: string; count: number; percent: number }[];
  };
  items: ModuleItem[];
}

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  orange: '249, 115, 22',
  blue: '59, 130, 246',
  cyan: '34, 211, 238',
  gray: '156, 163, 175',
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166',
  amber: '245, 158, 11',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  sky: '14, 165, 233',
  lime: '132, 204, 22',
  pink: '236, 72, 153',
  yellow: '234, 179, 8'
} as const;

// Конфигурация ролей
const ROLES_CONFIG = {
  user: {
    title: 'Личный кабинет гражданина',
    description: 'Получение социальных услуг и управление заявками',
    icon: '👤',
    color: 'from-blue-500 to-cyan-500'
  }
};

// Моки данных для пользователя
const todayKPIs: KPI[] = [
  { 
    label: "Заявки", 
    value: 3, 
    change: 1, 
    trend: 'up', 
    description: "Требуют внимания", 
    icon: "📋", 
    color: COLORS.blue
  },
  { 
    label: "Льготы", 
    value: 5, 
    change: 0, 
    trend: 'stable', 
    description: "Действующие программы", 
    icon: "🎁", 
    color: COLORS.success
  },
  { 
    label: "Услуги", 
    value: 24, 
    change: 3, 
    trend: 'up', 
    description: "За все время", 
    icon: "✅", 
    color: COLORS.emerald
  },
  { 
    label: "Выплаты", 
    value: 12500, 
    suffix: "₽", 
    trend: 'up', 
    description: "В этом месяце", 
    icon: "💰", 
    color: COLORS.warning
  },
  { 
    label: "Рейтинг", 
    value: 4.7, 
    suffix: "/5", 
    change: 2, 
    trend: 'up', 
    description: "На основе отзывов", 
    icon: "⭐",
    color: COLORS.purple
  },
  { 
    label: "Обращения", 
    value: 1, 
    change: -1, 
    trend: 'down', 
    description: "В службу поддержки", 
    icon: "🤝", 
    color: COLORS.orange
  },
];

const alerts: Alert[] = [
  { 
    id: '1', 
    type: 'info', 
    title: 'Новые доступные услуги', 
    message: 'В вашем районе доступны 3 новые социальные услуги', 
    time: '2 часа назад', 
    priority: 'medium',
    action: 'Посмотреть'
  },
  { 
    id: '2', 
    type: 'success', 
    title: 'Заявка выполнена', 
    message: 'Ваша заявка на доставку продуктов успешно выполнена', 
    time: '5 часов назад', 
    priority: 'low',
    action: 'Оставить отзыв'
  },
  { 
    id: '3', 
    type: 'warning', 
    title: 'Требуются документы', 
    message: 'Для продления льгот необходимо предоставить справку о доходах', 
    time: '1 день назад', 
    priority: 'high',
    action: 'Загрузить'
  },
  { 
    id: '4', 
    type: 'error', 
    title: 'Отмена визита', 
    message: 'Запланированный визит социального работника перенесен на завтра', 
    time: '30 мин назад', 
    priority: 'medium',
    action: 'Перенести'
  },
];

// ОБНОВЛЕННЫЙ НАБОР ДАННЫХ ДЛЯ КАРТОЧЕК ПОЛЬЗОВАТЕЛЯ
const moduleCardsData: ModuleCard[] = [
  {
    id: 'services',
    title: "🛠️ УСЛУГИ",
    type: "wide",
    mainOverview: {
      label: "Каталог услуг",
      description: "28 социальных услуг • 6 категорий помощи",
      value: "94%",
      metric: "Доступность услуг",
      link: "",
      stats: [
        { label: "Активных", value: "26", trend: "up" },
        { label: "Популярных", value: "8", trend: "stable" },
        { label: "Оценка", value: "4.7", trend: "up" }
      ],
      serviceTypes: [
        { type: "Материальная помощь", count: 156, percent: 25 },
        { type: "Юридические", count: 89, percent: 15 },
        { type: "Медицинские", count: 134, percent: 22 },
        { type: "Психологические", count: 78, percent: 13 },
        { type: "Бытовые", count: 145, percent: 25 }
      ]
    },
    items: [
      {
        label: "💰 Каталог услуг",
        value: "28 услуг",
        details: "Все доступные социальные услуги",
        metric: "6 категорий",
        trend: "up",
        icon: "📋",
        link: "",
        modal: {
          title: "💰 Каталог услуг",
          content: [
            "📊 Доступно услуг: 28",
            "🎯 Категории: 6 основных направлений",
            "⭐ Средняя оценка: 4.7/5",
            "",
            "🎯 Основные категории:",
            "• Материальная помощь",
            "• Юридическая помощь", 
            "• Медицинская помощь",
            "• Психологическая помощь",
            "• Бытовые услуги",
            "• Социальное сопровождение",
            "",
            "🔍 Поиск и фильтрация по категориям"
          ],
          metrics: [
            { label: "Доступность", value: "94%", trend: "up" },
            { label: "Удовлетворенность", value: "4.7/5", trend: "up" }
          ],
          action: "Посмотреть каталог"
        }
      },
      {
        label: "💸 Материальная помощь",
        value: "156 заявок",
        details: "Финансовая поддержка",
        metric: "12,500 ₽",
        trend: "up",
        icon: "💸",
        link: "",
        modal: {
          title: "💸 Материальная помощь",
          content: [
            "📊 Ваши активные заявки: 3",
            "✅ Одобрено выплат: 12,500 ₽ в этом месяце",
            "⏳ На рассмотрении: 2 заявки",
            "",
            "🎯 Доступные виды помощи:",
            "• Единовременная материальная помощь",
            "• Компенсация расходов на лечение", 
            "• Помощь в трудной жизненной ситуации",
            "• Субсидии на ЖКУ",
            "",
            "📅 Следующая выплата: 25 декабря"
          ],
          metrics: [
            { label: "Одобрено", value: "85%", trend: "up" },
            { label: "Срок рассмотрения", value: "3 дн", trend: "down" }
          ],
          action: "Подать заявку"
        }
      },
      {
        label: "⚖️ Юридическая помощь",
        value: "89 обращений",
        details: "Правовая поддержка",
        metric: "4.8/5 оценка",
        trend: "up",
        icon: "⚖️",
        link: "",
        modal: {
          title: "⚖️ Юридическая помощь",
          content: [
            "👨‍💼 Ваш юрист: Петров И.С.",
            "⭐ Рейтинг специалиста: 4.8/5",
            "📅 Последняя консультация: 15.12.2023",
            "",
            "🎯 Направления помощи:",
            "• Жилищные вопросы",
            "• Семейное право",
            "• Пенсионные дела",
            "• Защита прав потребителей",
            "",
            "⏰ Ближайшая запись: 20 декабря, 14:00"
          ],
          metrics: [
            { label: "Удовлетворенность", value: "94%", trend: "up" },
            { label: "Время ответа", value: "1.2ч", trend: "down" }
          ],
          action: "Записаться на консультацию"
        }
      },
      {
        label: "🏥 Медицинская помощь",
        value: "134 обращения",
        details: "Здоровье и уход",
        metric: "95% доступно",
        trend: "stable",
        icon: "🏥",
        link: "",
        modal: {
          title: "🏥 Медицинская помощь",
          content: [
            "🩺 Ваш терапевт: Сидорова М.П.",
            "💊 Выдано рецептов: 8 в этом месяце",
            "🏥 Прикрепленная поликлиника: №15",
            "",
            "📋 Доступные услуги:",
            "• Вызов врача на дом",
            "• Лекарственное обеспечение",
            "• Медицинские обследования",
            "• Реабилитационные программы",
            "",
            "📞 Телефон медсестры: +7 (495) 123-45-67"
          ],
          metrics: [
            { label: "Доступность", value: "95%", trend: "stable" },
            { label: "Качество", value: "4.7/5", trend: "up" }
          ],
          action: "Вызвать врача"
        }
      },
      {
        label: "🧠 Психологическая помощь",
        value: "78 сессий",
        details: "Поддержка и консультации",
        metric: "4.9/5 оценка",
        trend: "up",
        icon: "🧠",
        link: "",
        modal: {
          title: "🧠 Психологическая помощь",
          content: [
            "👩‍💼 Ваш психолог: Козлова А.М.",
            "⭐ Рейтинг специалиста: 4.9/5",
            "📅 Последняя сессия: 10.12.2023",
            "",
            "🎯 Направления работы:",
            "• Кризисное консультирование",
            "• Семейная терапия",
            "• Стресс-менеджмент",
            "• Поддержка пожилых",
            "",
            "💬 Форматы: очно, онлайн, телефон"
          ],
          metrics: [
            { label: "Эффективность", value: "91%", trend: "up" },
            { label: "Доступность", value: "98%", trend: "stable" }
          ],
          action: "Записаться на консультацию"
        }
      }
    ]
  },
  {
    id: 'requests',
    title: "📋 МОИ ЗАЯВКИ",
    type: "tall",
    mainOverview: {
      label: "Все заявки",
      description: "История и статусы ваших обращений",
      value: "27",
      metric: "Всего заявок",
      link: "",
      stats: [
        { label: "Активных", value: "3", trend: "up" },
        { label: "На проверке", value: "2", trend: "stable" },
        { label: "Выполнено", value: "22", trend: "up" }
      ],
      requestTypes: [
        { type: "В обработке", count: 3, percent: 11 },
        { type: "Одобренные", count: 2, percent: 7 },
        { type: "Выполненные", count: 22, percent: 82 }
      ]
    },
    items: [
      {
        label: "📝 Все заявки",
        value: "27 заявок",
        details: "Полная история обращений",
        metric: "2021-2023",
        trend: "up",
        icon: "📊",
        link: "/demo/social/users/requests/all",
        modal: {
          title: "📝 Все заявки",
          content: [
            "📅 Период: с 2021 года",
            "📊 Всего обращений: 27",
            "⭐ Средняя оценка: 4.7/5",
            "",
            "🎯 Статистика по годам:",
            "• 2023: 12 обращений (4.8/5)",
            "• 2022: 10 обращений (4.6/5)", 
            "• 2021: 5 обращений (4.5/5)",
            "",
            "📋 Фильтры по статусам и датам"
          ],
          metrics: [
            { label: "Всего", value: "27", trend: "up" },
            { label: "Выполнено", value: "22", trend: "up" }
          ],
          action: "Посмотреть все заявки"
        }
      },
      {
        label: "✨ Подать новую заявку",
        value: "5 минут",
        details: "Быстрое оформление",
        metric: "98% успех",
        trend: "up",
        icon: "✨",
        link: "",
        modal: {
          title: "✨ Подать новую заявку",
          content: [
            "🚀 Быстрое оформление за 5 минут",
            "📱 Доступно онлайн 24/7",
            "✅ Автозаполнение данных",
            "",
            "📋 Типы заявок:",
            "• Материальная помощь",
            "• Социальные услуги", 
            "• Консультации специалистов",
            "• Технические средства",
            "• Льготы и выплаты",
            "",
            "⏱️ Среднее время рассмотрения: 2 рабочих дня"
          ],
          metrics: [
            { label: "Успешность", value: "98%", trend: "up" },
            { label: "Скорость", value: "5 мин", trend: "down" }
          ],
          action: "Начать оформление"
        }
      },
      {
        label: "🔄 В обработке",
        value: "3 заявки",
        details: "Текущие обращения",
        metric: "2 дня среднее",
        trend: "down",
        icon: "⏳",
        link: "",
        modal: {
          title: "🔄 Заявки в обработке",
          content: [
            "📦 Доставка продуктов - ожидает волонтера",
            "🩺 Медицинская консультация - назначен специалист",
            "🏠 Социальный работник - запланирован визит",
            "",
            "👥 Ответственные:",
            "• Координатор: Иванова М.П.",
            "• Соцработник: Петров В.И.", 
            "• Волонтер: Сидоров К.Д.",
            "",
            "📞 Контакт для вопросов: +7 (495) 123-45-67"
          ],
          metrics: [
            { label: "Среднее время", value: "2 дн", trend: "down" },
            { label: "Прогресс", value: "65%", trend: "up" }
          ],
          action: "Подробнее о заявках"
        }
      },
      {
        label: "✅ Одобренные",
        value: "2 заявки",
        details: "Ожидают выполнения",
        metric: "На этой неделе",
        trend: "stable",
        icon: "🎯",
        link: "",
        modal: {
          title: "✅ Одобренные заявки",
          content: [
            "💰 Материальная помощь - 15,000 ₽",
            "• Статус: ожидает перевода",
            "• Срок: до 25 декабря",
            "",
            "🏠 Ремонт жилья - скидка 50%",
            "• Статус: подбор подрядчика",
            "• Срок: до 30 декабря",
            "",
            "📞 Контактный телефон: +7 (495) 123-45-67"
          ],
          metrics: [
            { label: "Выполнение", value: "100%", trend: "stable" },
            { label: "Сроки", value: "в норме", trend: "stable" }
          ],
          action: "Уточнить детали"
        }
      },
      {
        label: "📈 Выполненные",
        value: "22 заявки",
        details: "За все время",
        metric: "4.8/5 оценка",
        trend: "up",
        icon: "🏆",
        link: "",
        modal: {
          title: "📈 Выполненные заявки",
          content: [
            "⭐ Общая оценка: 4.8/5",
            "📈 Выполнено в срок: 96%",
            "🤝 Удовлетворенность: 94%",
            "",
            "🎯 Последние выполненные:",
            "• Доставка продуктов - 5 декабря",
            "• Юридическая консультация - 3 декабря", 
            "• Медицинский осмотр - 1 декабря",
            "• Психологическая помощь - 28 ноября",
            "",
            "📋 Всего услуг получено: 24"
          ],
          metrics: [
            { label: "Качество", value: "4.8/5", trend: "up" },
            { label: "Своевременность", value: "96%", trend: "up" }
          ],
          action: "Посмотреть историю"
        }
      }
    ]
  },
  {
    id: 'benefits',
    title: "🎁 ЛЬГОТЫ",
    type: "grid",
    mainOverview: {
      label: "Обзор льгот",
      description: "5 действующих программ поддержки",
      value: "12500",
      metric: "₽ в месяц",
      link: "",
      stats: [
        { label: "Активных", value: "5", trend: "stable" },
        { label: "На рассмотрении", value: "2", trend: "up" },
        { label: "Общая сумма", value: "15K", trend: "up" }
      ],
      benefitTypes: [
        { type: "Пенсионные", count: 1, percent: 20 },
        { type: "Инвалидность", count: 1, percent: 20 },
        { type: "Многодетные", count: 1, percent: 20 },
        { type: "Ветераны", count: 1, percent: 20 },
        { type: "Социальные", count: 1, percent: 20 }
      ]
    },
    items: [
      {
        label: "📊 Обзор льгот",
        value: "5 программ",
        details: "Все доступные льготы",
        metric: "12,500 ₽",
        trend: "up",
        icon: "📊",
        link: "",
        modal: {
          title: "📊 Обзор льгот",
          content: [
            "💰 Общая сумма выплат: 12,500 ₽/мес",
            "🎯 Активных программ: 5",
            "📅 На рассмотрении: 2 заявки",
            "",
            "🎯 Действующие льготы:",
            "• Пенсионные выплаты",
            "• По инвалидности", 
            "• Для многодетных семей",
            "• Ветеранские",
            "• Социальные",
            "",
            "📞 Консультация: +7 (495) 123-45-67"
          ],
          metrics: [
            { label: "Выплаты", value: "12,500 ₽", trend: "up" },
            { label: "Программы", value: "5", trend: "stable" }
          ],
          action: "Посмотреть все льготы"
        }
      },
      {
        label: "👵 Пенсионные льготы",
        value: "18,456 ₽",
        details: "Ежемесячная выплата",
        metric: "25 число",
        trend: "stable",
        icon: "👵",
        link: "",
        modal: {
          title: "👵 Пенсионные льготы",
          content: [
            "💰 Размер пенсии: 18,456 ₽",
            "📅 Следующая выплата: 25 декабря",
            "🏦 Банк: Сбербанк ••• 1234",
            "",
            "🎯 Дополнительные льготы:",
            "• Скидка 50% на ЖКУ",
            "• Бесплатный проезд",
            "• Лекарственное обеспечение",
            "• Санаторно-курортное лечение",
            "",
            "📞 Консультация: +7 (495) 123-45-67"
          ],
          metrics: [
            { label: "Выплаты", value: "100%", trend: "stable" },
            { label: "Льготы", value: "5", trend: "stable" }
          ],
          action: "Уточнить выплаты"
        }
      },
      {
        label: "♿ Инвалидность",
        value: "3,240 ₽",
        details: "Доплаты и компенсации",
        metric: "ЕДВ",
        trend: "up",
        icon: "♿",
        link: "",
        modal: {
          title: "♿ Льготы по инвалидности",
          content: [
            "💰 ЕДВ: 3,240 ₽ в месяц",
            "🏥 ИПРА: действует до 2025 года",
            "💊 Лекарства: бесплатно по рецепту",
            "",
            "🎯 Социальный пакет:",
            "• Санаторно-курортное лечение",
            "• Проезд к месту лечения",
            "• Технические средства реабилитации",
            "• Социальное такси",
            "",
            "📅 Переосвидетельствование: декабрь 2024"
          ],
          metrics: [
            { label: "Выплаты", value: "3,240 ₽", trend: "up" },
            { label: "Льготы", value: "8", trend: "stable" }
          ],
          action: "Оформить доплату"
        }
      },
      {
        label: "👨‍👩‍👧‍👦 Многодетным семьям",
        value: "2,800 ₽",
        details: "На детей",
        metric: "в месяц",
        trend: "stable",
        icon: "👨‍👩‍👧‍👦",
        link: "",
        modal: {
          title: "👨‍👩‍👧‍👦 Льготы многодетным семьям",
          content: [
            "👶 На ребенка до 3 лет: 2,800 ₽",
            "🏫 Школьные пособия: 1,500 ₽",
            "🍽️ Питание в школе: бесплатно",
            "",
            "🎯 Дополнительные льготы:",
            "• Скидка 30% на коммунальные услуги",
            "• Бесплатный проезд для школьников",
            "• Земельные участки",
            "• Налоговые вычеты",
            "",
            "📅 Следующая выплата: 20 декабря"
          ],
          metrics: [
            { label: "Выплаты", value: "2,800 ₽", trend: "stable" },
            { label: "Льготы", value: "6", trend: "stable" }
          ],
          action: "Оформить пособие"
        }
      },
      {
        label: "🎖️ Ветераны",
        value: "4,200 ₽",
        details: "Ветеранские выплаты",
        metric: "ЕДВ",
        trend: "up",
        icon: "🎖️",
        link: "",
        modal: {
          title: "🎖️ Льготы ветеранам",
          content: [
            "💰 ЕДВ ветерана труда: 4,200 ₽",
            "🏠 Компенсация ЖКУ: 50%",
            "🏥 Медицинское обслуживание: вне очереди",
            "",
            "🎯 Социальные гарантии:",
            "• Бесплатный проезд",
            "• Санаторно-курортное лечение",
            "• Протезирование",
            "• Налоговые льготы",
            "",
            "📞 Ветеранская организация: +7 (495) 123-45-67"
          ],
          metrics: [
            { label: "Выплаты", value: "4,200 ₽", trend: "up" },
            { label: "Льготы", value: "7", trend: "stable" }
          ],
          action: "Уточнить льготы"
        }
      },
      {
        label: "📄 Оформление льгот",
        value: "2 заявки",
        details: "На рассмотрении",
        metric: "5-10 дней",
        trend: "up",
        icon: "📋",
        link: "",
        modal: {
          title: "📄 Оформление льгот",
          content: [
            "⏳ На рассмотрении: 2 заявки",
            "📅 Поданы: 5 декабря 2023",
            "👤 Ответственный: Иванова М.П.",
            "",
            "📋 Статусы заявок:",
            "• Компенсация за лекарства - проверка документов",
            "• Субсидия на ЖКУ - одобрена, ожидает выплаты",
            "",
            "📞 Контакт для уточнений: +7 (495) 123-45-67",
            "⏰ Часы работы: Пн-Пт 9:00-18:00"
          ],
          metrics: [
            { label: "Срок", value: "5-10 дн", trend: "stable" },
            { label: "Прогресс", value: "60%", trend: "up" }
          ],
          action: "Проверить статус"
        }
      }
    ]
  },
  {
    id: 'support',
    title: "🤝 ПОДДЕРЖКА",
    type: "default",
    mainOverview: {
      label: "Помощь и консультации",
      description: "Служба поддержки и консультации",
      value: "24/7",
      metric: "Доступность",
      link: "",
      stats: [
        { label: "Обращений", value: "12", trend: "down" },
        { label: "Решено", value: "11", trend: "up" },
        { label: "Оценка", value: "4.8", trend: "up" }
      ]
    },
    items: [
      {
        label: "💬 Помощь и консультация",
        value: "2 мин",
        details: "Среднее время ответа",
        metric: "24/7",
        trend: "down",
        icon: "💬",
        link: "",
        modal: {
          title: "💬 Помощь и консультация",
          content: [
            "⏱️ Среднее время ответа: 2 минуты",
            "🕒 Работает: круглосуточно",
            "👥 Специалисты: 5 человек онлайн",
            "",
            "🎯 Решаемые вопросы:",
            "• Консультации по услугам",
            "• Помощь с заявками", 
            "• Техническая поддержка",
            "• Юридические консультации",
            "",
            "⭐ Рейтинг службы: 4.8/5"
          ],
          metrics: [
            { label: "Скорость", value: "2 мин", trend: "down" },
            { label: "Качество", value: "4.8/5", trend: "up" }
          ],
          action: "Получить консультацию"
        }
      },
      {
        label: "💬 Онлайн-чат",
        value: "Мгновенно",
        details: "Прямое общение",
        metric: "24/7",
        trend: "stable",
        icon: "💭",
        link: "",
        modal: {
          title: "💬 Онлайн-чат поддержки",
          content: [
            "⚡ Мгновенная связь со специалистом",
            "📱 Удобно с мобильного телефона",
            "💾 Сохранение истории переписки",
            "",
            "🎯 Преимущества:",
            "• Быстрые ответы на вопросы",
            "• Прикрепление файлов",
            "• Консультации в реальном времени",
            "• Круглосуточная доступность",
            "",
            "👥 Онлайн сейчас: 3 специалиста"
          ],
          metrics: [
            { label: "Доступность", value: "100%", trend: "stable" },
            { label: "Удовлетворенность", value: "95%", trend: "up" }
          ],
          action: "Начать чат"
        }
      },
      {
        label: "📞 Телефон горячей линии",
        value: "3 номера",
        details: "Разные направления",
        metric: "8:00-20:00",
        trend: "stable",
        icon: "📞",
        link: "",
        modal: {
          title: "📞 Телефоны горячей линии",
          content: [
            "📱 Общие вопросы: +7 (495) 123-45-67",
            "🕒 Время работы: 8:00-20:00",
            "",
            "🎯 Специализированные линии:",
            "• Юридические консультации: +7 (495) 123-45-68",
            "• Медицинские вопросы: +7 (495) 123-45-69", 
            "• Техническая поддержка: +7 (495) 123-45-70",
            "",
            "📧 Электронная почта: support@social.ru",
            "🌐 Веб-сайт: www.social-support.ru"
          ],
          metrics: [
            { label: "Доступность", value: "98%", trend: "stable" },
            { label: "Время ответа", value: "1.5 мин", trend: "down" }
          ],
          action: "Позвонить"
        }
      }
    ]
  },
  {
    id: 'documents',
    title: "📄 ДОКУМЕНТЫ",
    type: "default",
    mainOverview: {
      label: "Личные документы",
      description: "8 документов в системе",
      value: "100%",
      metric: "Проверено",
      link: "",
      stats: [
        { label: "Активных", value: "6", trend: "stable" },
        { label: "На проверке", value: "1", trend: "up" },
        { label: "Истекших", value: "1", trend: "down" }
      ]
    },
    items: [
      {
        label: "📁 Личные документы",
        value: "8 файлов",
        details: "Паспорт, СНИЛС, полис",
        metric: "100% проверено",
        trend: "stable",
        icon: "📁",
        link: "",
        modal: {
          title: "📁 Личные документы",
          content: [
            "✅ Проверено документов: 8",
            "📅 Срок действия: все актуальны",
            "🔒 Безопасное хранение",
            "",
            "📋 Ваши документы:",
            "• Паспорт РФ - проверен",
            "• СНИЛС - проверен", 
            "• Медицинский полис - проверен",
            "• Пенсионное удостоверение - проверено",
            "• Удостоверение инвалида - проверено",
            "",
            "⚡ Быстрый доступ при оформлении заявок"
          ],
          metrics: [
            { label: "Проверено", value: "100%", trend: "stable" },
            { label: "Актуальность", value: "100%", trend: "stable" }
          ],
          action: "Управлять документами"
        }
      },
      {
        label: "📝 Заявления и формы",
        value: "12 шаблонов",
        details: "Готовые формы",
        metric: "PDF, Word",
        trend: "up",
        icon: "📝",
        link: "",
        modal: {
          title: "📝 Заявления и формы",
          content: [
            "📋 Доступные шаблоны: 12",
            "📄 Форматы: PDF, Word, онлайн-заполнение",
            "🚀 Автозаполнение персональных данных",
            "",
            "🎯 Популярные формы:",
            "• Заявление на материальную помощь",
            "• Запрос на социальные услуги", 
            "• Оформление льгот",
            "• Жалобы и предложения",
            "• Запрос справок",
            "",
            "💡 Советы: сохраняйте черновики"
          ],
          metrics: [
            { label: "Шаблоны", value: "12", trend: "up" },
            { label: "Форматы", value: "3", trend: "stable" }
          ],
          action: "Скачать формы"
        }
      },
      {
        label: "📊 Справки и выписки",
        value: "8 документов",
        details: "Готовые к выдаче",
        metric: "3 новых",
        trend: "up",
        icon: "📊",
        link: "",
        modal: {
          title: "📊 Справки и выписки",
          content: [
            "✅ Готовы к выдаче: 5 справок",
            "⏳ На подготовке: 3 документа",
            "📅 Срок изготовления: 1-3 дня",
            "",
            "📋 Доступные справки:",
            "• О размере пенсии",
            "• О наличии льгот", 
            "• О полученных услугах",
            "• О социальном статусе",
            "• О доходах",
            "",
            "🏢 Получить: МФЦ, онлайн, почтой"
          ],
          metrics: [
            { label: "Готово", value: "5", trend: "up" },
            { label: "В работе", value: "3", trend: "up" }
          ],
          action: "Заказать справку"
        }
      },
      {
        label: "📈 История обращений",
        value: "27 записей",
        details: "За все время",
        metric: "2021-2023",
        trend: "up",
        icon: "📈",
        link: "",
        modal: {
          title: "📈 История обращений",
          content: [
            "📅 Период: с 2021 года",
            "📊 Всего обращений: 27",
            "⭐ Средняя оценка: 4.7/5",
            "",
            "🎯 Статистика по годам:",
            "• 2023: 12 обращений (4.8/5)",
            "• 2022: 10 обращений (4.6/5)", 
            "• 2021: 5 обращений (4.5/5)",
            "",
            "📋 Можно фильтровать по: услугам, датам, статусам"
          ],
          metrics: [
            { label: "Всего", value: "27", trend: "up" },
            { label: "Оценка", value: "4.7/5", trend: "up" }
          ],
          action: "Посмотреть историю"
        }
      }
    ]
  },
  {
    id: 'profile',
    title: "👤 ПРОФИЛЬ",
    type: "default",
    mainOverview: {
      label: "Мой профиль",
      description: "Алексей Петров • 65 лет",
      value: "Активен",
      metric: "С нами 2 года",
      link: "",
      stats: [
        { label: "Услуг", value: "24", trend: "up" },
        { label: "Льгот", value: "5", trend: "stable" },
        { label: "Рейтинг", value: "4.7", trend: "up" }
      ]
    },
    items: [
      {
        label: "👤 Мой профиль",
        value: "95% заполнено",
        details: "Основная информация",
        metric: "3 обновления",
        trend: "up",
        icon: "👤",
        link: "",
        modal: {
          title: "👤 Мой профиль",
          content: [
            "👨 Алексей Петров, 65 лет",
            "📧 Email: alexey.petrov@mail.ru",
            "📱 Телефон: +7 (915) 123-45-67",
            "",
            "🏠 Адрес: г. Москва, ул. Ленина, 15, кв. 42",
            "📅 Дата рождения: 15.03.1958",
            "🎂 Пенсионер, ветеран труда",
            "",
            "📋 Дополнительная информация:",
            "• Группа инвалидности: 2",
            "• Социальный статус: нуждающийся"
          ],
          metrics: [
            { label: "Заполнение", value: "95%", trend: "up" },
            { label: "Актуальность", value: "100%", trend: "stable" }
          ],
          action: "Редактировать профиль"
        }
      },
      {
        label: "📋 Личные данные",
        value: "Полные",
        details: "Контактная информация",
        metric: "Актуальны",
        trend: "stable",
        icon: "📋",
        link: "",
        modal: {
          title: "📋 Личные данные",
          content: [
            "✅ Все данные заполнены и проверены",
            "📅 Последнее обновление: 01.12.2023",
            "🔒 Конфиденциальность гарантирована",
            "",
            "📊 Заполненные разделы:",
            "• Паспортные данные - 100%",
            "• Контактная информация - 100%", 
            "• Адрес проживания - 100%",
            "• Социальный статус - 100%",
            "• Медицинская информация - 90%",
            "",
            "⚡ Используются для автоматического заполнения заявок"
          ],
          metrics: [
            { label: "Заполнение", value: "98%", trend: "stable" },
            { label: "Актуальность", value: "100%", trend: "stable" }
          ],
          action: "Проверить данные"
        }
      },
      {
        label: "🔔 Настройка уведомлений",
        value: "8 активных",
        details: "Оповещения и рассылки",
        metric: "SMS, email, push",
        trend: "stable",
        icon: "🔔",
        link: "",
        modal: {
          title: "🔔 Настройка уведомлений",
          content: [
            "✅ Активные каналы: 8",
            "📱 Типы уведомлений: SMS, email, push",
            "🕒 Частота: моментально, ежедневно, еженедельно",
            "",
            "🎯 Настроенные оповещения:",
            "• Статусы заявок - моментально",
            "• Выплаты - за 3 дня", 
            "• Новые услуги - еженедельно",
            "• Консультации - за 1 день",
            "• Сообщения от волонтеров - моментально",
            "",
            "⚙️ Можно настраивать индивидуально"
          ],
          metrics: [
            { label: "Каналы", value: "3", trend: "stable" },
            { label: "Оповещения", value: "8", trend: "stable" }
          ],
          action: "Настроить уведомления"
        }
      }
    ]
  }
];

// Утилиты
const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.gray;
};

const getAlertColor = (type: Alert['type']) => {
  return {
    warning: COLORS.warning,
    info: COLORS.info,
    success: COLORS.success,
    error: COLORS.error
  }[type];
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Bento Card компонент
const BentoCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
  glowColor?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
  variant?: 'default' | 'wide' | 'tall' | 'grid' | 'compact';
}>(({ children, className = '', enableEffects = true, glowColor = COLORS.blue, onClick, colSpan = 1, rowSpan = 1, variant = 'default' }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!enableEffects || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const relativeX = (x / rect.width) * 100;
      const relativeY = (y / rect.height) * 100;

      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      card.style.setProperty('--glow-intensity', '1');
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--glow-intensity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableEffects]);

  const colSpanClass = {
    1: '',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'lg:row-span-2',
  }[rowSpan];

  const variantClass = {
    default: '',
    wide: 'lg:col-span-2',
    tall: 'lg:row-span-2',
    grid: 'lg:col-span-2 lg:row-span-2',
    compact: ''
  }[variant];

  return (
    <div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        bg-white/5 backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${colSpanClass}
        ${rowSpanClass}
        ${variantClass}
        ${className}
      `}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {enableEffects && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: 'var(--glow-intensity)',
            background: `radial-gradient(300px circle at var(--glow-x) var(--glow-y), 
                         rgba(var(--glow-color), 0.1) 0%, 
                         rgba(var(--glow-color), 0.05) 30%, 
                         transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
});

BentoCard.displayName = 'BentoCard';

// Компонент для круговой диаграммы
const PieChart = ({ data, className = '' }: { data: { name: string; value: number }[]; className?: string }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;
  
  return (
    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -accumulated;
          accumulated += percentage;
          
          return (
            <circle
              key={item.name}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`rgba(${Object.values(COLORS)[index]}, 0.8)`}
              strokeWidth="20"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white font-bold text-xs sm:text-sm">{total}%</div>
          <div className="text-white/60 text-xs">Всего</div>
        </div>
      </div>
    </div>
  );
};

// Общий компонент Modal
function Modal({ show, content, onClose }: { show: boolean; content: any; onClose: () => void }) {
  if (!show || !content) return null;

  const handleAction = () => {
    if (content.actionLink) {
      window.location.href = content.actionLink;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-2xl border border-white/10 max-h-[85vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
              <h3 className="text-white font-bold text-lg sm:text-xl">{content.title}</h3>
              <button
                className="text-white/60 hover:text-white transition-colors text-2xl"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {content.content.map((line: string, index: number) => (
                <div key={index} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
                  {line === "" ? (
                    <div className="h-4 w-full"></div>
                  ) : (
                    <>
                      <span className="flex-shrink-0 mt-1.5 text-white/60">•</span>
                      <span>{line}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {content.metrics && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
                {content.metrics.map((metric: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-white/60 text-xs mb-1">{metric.label}</div>
                    <div className="text-white font-bold text-base sm:text-lg">{metric.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
              <button
                className="px-4 sm:px-6 py-2 sm:py-3 text-white/70 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 rounded-lg order-2 sm:order-1"
                onClick={onClose}
              >
                Закрыть
              </button>
              <button
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl order-1 sm:order-2"
                onClick={handleAction}
              >
                {content.action} →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// KPI Widget компонент
const KPIWidget = React.memo(({ kpi }: { kpi: KPI }) => {
  const trendColor = kpi.color || getTrendColor(kpi.trend);
  
  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-3 sm:p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
          {kpi.value}{kpi.suffix}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-base sm:text-lg lg:text-xl">{kpi.icon}</div>
          {kpi.change && (
            <motion.div 
              className={`flex items-center gap-1 text-xs`}
              style={{ color: `rgb(${trendColor})` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'}
              {Math.abs(kpi.change)}%
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-xs sm:text-sm font-medium line-clamp-1">{kpi.label}</span>
          {kpi.change && (
            <span 
              className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full border flex-shrink-0 ml-1 sm:ml-2"
              style={{
                backgroundColor: `rgba(${trendColor}, 0.2)`,
                color: `rgb(${trendColor})`,
                borderColor: `rgba(${trendColor}, 0.3)`
              }}
            >
              {kpi.trend === 'up' ? 'Рост' : kpi.trend === 'down' ? 'Снижение' : 'Стабильно'}
            </span>
          )}
        </div>
        
        <div className="text-white/60 text-xs line-clamp-2">
          {kpi.description}
        </div>
      </div>
    </motion.div>
  );

  const card = (
    <BentoCard 
      className="h-full min-h-[120px]"
      enableEffects={true}
      glowColor={trendColor}
    >
      {content}
    </BentoCard>
  );

  return kpi.link ? (
    <Link href={kpi.link} className="block h-full">
      {card}
    </Link>
  ) : card;
});

KPIWidget.displayName = 'KPIWidget';

// Alert Widget компонент
const AlertWidget = React.memo(({ alert }: { alert: Alert }) => {
  const alertColor = getAlertColor(alert.type);
  
  return (
    <BentoCard 
      className="p-3 sm:p-4 min-h-[100px]"
      glowColor={alertColor}
    >
      <motion.div 
        className="h-full flex flex-col justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          backgroundColor: `rgba(${alertColor}, 0.1)`,
          borderColor: `rgba(${alertColor}, 0.2)`,
          color: `rgb(${alertColor})`
        }}
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="font-medium text-sm line-clamp-2 flex-grow">{alert.title}</div>
          <span 
            className="px-2 py-1 rounded-full text-xs border flex-shrink-0"
            style={{
              backgroundColor: `rgba(${alertColor}, 0.2)`,
              borderColor: `rgba(${alertColor}, 0.3)`
            }}
          >
            {alert.priority === 'high' ? 'Важно' : alert.priority === 'medium' ? 'Инфо' : 'Уведомление'}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-white/80 text-xs line-clamp-2">{alert.message}</p>
          <div className="flex justify-between items-center">
            <div className="text-white/60 text-xs">{alert.time}</div>
            {alert.action && (
              <Link href={alert.actionLink || '#'}>
                <span className="text-white/80 text-xs hover:text-white cursor-pointer">
                  {alert.action} →
                </span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </BentoCard>
  );
});

AlertWidget.displayName = 'AlertWidget';

// Компонент карточки с подпунктами
function ModuleCard({ module }: { module: ModuleCard }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const handleItemClick = (item: ModuleItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalContent({
      ...item.modal,
      actionLink: item.link
    });
    setShowModal(true);
  };

  const getCardVariant = (type: string) => {
    switch (type) {
      case 'wide': return 'wide';
      case 'tall': return 'tall';
      case 'grid': return 'grid';
      default: return 'default';
    }
  };

  return (
    <>
      <BentoCard 
        className="p-4 sm:p-6 h-full min-h-[400px]" 
        variant={getCardVariant(module.type) as any}
        glowColor={COLORS.blue}
      >
        <div className="h-full flex flex-col">
          {/* Заголовок карточки */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl">{module.title.split(' ')[0]}</div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{module.title.split(' ').slice(1).join(' ')}</h2>
              <p className="text-white/60 text-sm">{module.mainOverview.description}</p>
            </div>
          </div>

          {/* Основной обзор */}
          <Link href={module.mainOverview.link}>
            <motion.div 
              className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 hover:to-white/5 transition-all duration-300 cursor-pointer border border-white/10 mb-4"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-bold text-xl">{module.mainOverview.value}</div>
                  <div className="text-white/60 text-sm">{module.mainOverview.label}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/80 text-sm">{module.mainOverview.metric}</div>
                  <div className="text-white/60 text-xs">Перейти →</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {module.mainOverview.stats.map((stat, index) => (
                  <div key={index} className="text-center p-2 bg-white/5 rounded-lg">
                    <div className="text-white font-bold text-sm">{stat.value}</div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </Link>

          {/* Подпункты */}
          <div className="space-y-3 flex-grow">
            {module.items.map((item, index) => (
              <motion.div 
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer border border-white/5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                onClick={(e) => handleItemClick(item, e)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-xl flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{item.label}</div>
                    <div className="text-white/60 text-xs truncate">{item.details}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-white font-bold text-sm">{item.value}</div>
                  <div className="text-white/60 text-xs">{item.metric}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </BentoCard>

      <Modal show={showModal} content={modalContent} onClose={() => setShowModal(false)} />
    </>
  );
}

// Компонент карточки с графиком (для услуг)
function ServicesCard({ module }: { module: ModuleCard }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const handleItemClick = (item: ModuleItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalContent({
      ...item.modal,
      actionLink: item.link
    });
    setShowModal(true);
  };

  return (
    <>
      <BentoCard className="p-4 sm:p-6 lg:p-8 h-full min-h-[500px]" variant="wide" glowColor={COLORS.purple}>
        <div className="h-full flex flex-col">
          {/* Шапка услуг */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🛠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">УСЛУГИ</h2>
            <p className="text-white/60">28 социальных услуг • 6 категорий помощи</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
            {/* Левая колонка - Основная информация */}
            <div className="space-y-4">
              <Link href={module.mainOverview.link}>
                <motion.div 
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/15 hover:to-pink-500/15 transition-all duration-300 cursor-pointer border border-white/10"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="text-center">
                    <div className="text-white font-bold text-2xl mb-2">94%</div>
                    <div className="text-white/80 text-sm">Доступность услуг</div>
                    <div className="text-white/60 text-xs mt-1">Каталог услуг →</div>
                  </div>
                </motion.div>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                {module.mainOverview.stats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white font-bold text-lg">{stat.value}</div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white font-medium mb-3">Распределение услуг</div>
                <div className="space-y-2">
                  {module.mainOverview.serviceTypes?.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{type.type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${type.percent}%` }}
                          />
                        </div>
                        <span className="text-white/60 text-xs w-8">{type.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Правая колонка - Подпункты */}
            <div className="space-y-3">
              {module.items.map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer border border-white/5"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  onClick={(e) => handleItemClick(item, e)}
                >
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm mb-1">{item.label}</div>
                    <div className="text-white/60 text-xs">{item.details}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-bold text-sm">{item.value}</div>
                    <div className="text-white/60 text-xs">{item.metric}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </BentoCard>

      <Modal show={showModal} content={modalContent} onClose={() => setShowModal(false)} />
    </>
  );
}

// Основной компонент дашборда пользователя
export default function UserDashboard() {
  const role = ROLES_CONFIG.user;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-white/60 text-xs sm:text-sm text-right">
                <div className="hidden xs:block">{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-3 sm:mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BentoCard className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="flex-grow min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                  Добро пожаловать, Алексей Петров!
                </h1>
                <p className="text-white/60 text-xs sm:text-sm lg:text-base max-w-2xl">
                  {role.description} Здесь вы можете подавать заявки на социальные услуги, отслеживать льготы и управлять своими обращениями.
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0 mt-2 sm:mt-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium">Кабинет активен</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Alerts Section */}
        <motion.section 
          className="mb-3 sm:mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {alerts.map((alert) => (
              <AlertWidget key={alert.id} alert={alert} />
            ))}
          </div>
        </motion.section>

        {/* Основные KPI */}
        <motion.section 
          className="mb-3 sm:mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3 lg:mb-4">Моя активность</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3">
            {todayKPIs.map((kpi, index) => (
              <KPIWidget key={index} kpi={kpi} />
            ))}
          </div>
        </motion.section>

        {/* Основная сетка дашборда */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* 1. УСЛУГИ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2"
          >
            <ServicesCard module={moduleCardsData.find(m => m.id === 'services')!} />
          </motion.section>

          {/* 2. МОИ ЗАЯВКИ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ModuleCard module={moduleCardsData.find(m => m.id === 'requests')!} />
          </motion.section>

          {/* 3. ЛЬГОТЫ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ModuleCard module={moduleCardsData.find(m => m.id === 'benefits')!} />
          </motion.section>

          {/* 4. ПОДДЕРЖКА */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ModuleCard module={moduleCardsData.find(m => m.id === 'support')!} />
          </motion.section>

          {/* 5. ДОКУМЕНТЫ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ModuleCard module={moduleCardsData.find(m => m.id === 'documents')!} />
          </motion.section>

          {/* 6. ПРОФИЛЬ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <ModuleCard module={moduleCardsData.find(m => m.id === 'profile')!} />
          </motion.section>
        </div>
      </main>
    </div>
  );
}