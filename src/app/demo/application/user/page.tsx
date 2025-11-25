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
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-gray-900 via-black to-gray-800'
  }
};

// Расширенные демо данные
const todayKPIs: KPI[] = [
  { 
    label: "Заявки", 
    value: 3, 
    change: 1, 
    trend: 'up', 
    description: "активных заявок требуют внимания", 
    icon: "📋", 
    color: COLORS.blue,
    link: ""
  },
  { 
    label: "Документы", 
    value: 8, 
    change: 0, 
    trend: 'stable', 
    description: "документов загружено в систему", 
    icon: "📄", 
    color: COLORS.purple,
    link: ""
  },
  { 
    label: "Услуги", 
    value: 24, 
    change: 3, 
    trend: 'up', 
    description: "услуг получено в этом месяце", 
    icon: "✅", 
    color: COLORS.emerald
  },
  { 
    label: "Льготы", 
    value: 2, 
    trend: 'stable', 
    description: "действующих льгот активны", 
    icon: "🎁", 
    color: COLORS.orange,
    link: ""
  }
];

const alerts: Alert[] = [
  { 
    id: '1', 
    type: 'info', 
    title: 'Новые доступные услуги', 
    message: 'В вашем районе доступны 3 новые социальные услуги по программе поддержки', 
    time: '2 часа назад', 
    priority: 'medium',
    action: 'Посмотреть',
    actionLink: ''
  },
  { 
    id: '2', 
    type: 'success', 
    title: 'Заявка выполнена', 
    message: 'Ваша заявка на доставку продуктов успешно выполнена. Курьер доставил заказ в 14:30', 
    time: '5 часов назад', 
    priority: 'low',
    action: 'Оставить отзыв'
  },
  { 
    id: '3', 
    type: 'warning', 
    title: 'Требуются документы', 
    message: 'Для продления льгот необходимо предоставить справку о доходах за последний квартал', 
    time: '1 день назад', 
    priority: 'high',
    action: 'Загрузить',
    actionLink: ''
  },
  { 
    id: '4', 
    type: 'error', 
    title: 'Отмена визита', 
    message: 'Запланированный визит социального работника перенесен на завтра в связи с погодными условиями', 
    time: '30 мин назад', 
    priority: 'medium',
    action: 'Перенести'
  },
];

const moduleCardsData: ModuleCard[] = [
  {
    id: 'services',
    title: "🛠️ УСЛУГИ",
    type: "wide",
    mainOverview: {
      label: "Каталог услуг",
      description: "Доступ к государственным и социальным услугам всех категорий",
      value: "28",
      metric: "доступных услуг",
      link: "",
      stats: [
        { label: "Социальные", value: "12", trend: "up" },
        { label: "Медицинские", value: "8", trend: "stable" },
        { label: "Бытовые", value: "8", trend: "up" }
      ],
      serviceTypes: [
        { type: "Социальные услуги", count: 12, percent: 43 },
        { type: "Медицина", count: 8, percent: 29 },
        { type: "Доставка", count: 3, percent: 11 },
        { type: "Автосервис", count: 2, percent: 7 },
        { type: "Транспорт", count: 2, percent: 7 },
        { type: "Сфера услуг", count: 1, percent: 3 }
      ],
      chartData: [
        { name: "Социальные", value: 12 },
        { name: "Медицина", value: 8 },
        { name: "Доставка", value: 3 },
        { name: "Автосервис", value: 2 },
        { name: "Транспорт", value: 2 },
        { name: "Сфера услуг", value: 1 }
      ]
    },
    items: [
      {
        label: "🔵 Социальные услуги",
        value: "12 услуг",
        details: "Государственная поддержка и помощь",
        metric: "4 категории",
        trend: "up",
        icon: "🔵",
        link: "",
        modal: {
          title: "🔵 Социальные услуги",
          content: [
            "📊 Доступно услуг: 12 различных программ",
            "🎯 Категории помощи: 4 основных направления",
            "⭐ Средняя оценка качества: 4.7/5",
            "👥 Охват населения: 95% регионов",
            "",
            "🎯 Основные направления поддержки:",
            "• Материальная помощь и выплаты",
            "• Юридические консультации и защита", 
            "• Медицинская помощь на дому",
            "• Психологическая поддержка",
            "",
            "🔍 Умный поиск по категориям и доступности",
            "📱 Онлайн-запись на услуги 24/7"
          ],
          metrics: [
            { label: "Доступность", value: "94%", trend: "up" },
            { label: "Удовлетворенность", value: "4.7/5", trend: "up" },
            { label: "Время ответа", value: "2 ч", trend: "down" }
          ],
          action: "Открыть каталог услуг"
        }
      },
      {
        label: "🩺 Медицина",
        value: "8 услуг",
        details: "Здравоохранение и медицинское обслуживание",
        metric: "Расписание",
        trend: "stable",
        icon: "🩺",
        link: "",
        modal: {
          title: "🩺 Медицинские услуги",
          content: [
            "📊 Доступно услуг: 8 медицинских программ",
            "🩺 Ваш терапевт: Сидорова Мария Петровна",
            "🏥 Прикрепленная поликлиника: №15 г. Москва",
            "💊 Лекарственное обеспечение: 100%",
            "",
            "📋 Доступные медицинские услуги:",
            "• Расписание врачей и запись онлайн",
            "• Обзор здоровья и анализов", 
            "• Процедуры и обследования",
            "• Медицинская информация и справки",
            "• Вызов врача на дом",
            "",
            "📞 Телефон медсестры: +7 (495) 123-45-67",
            "⏰ Время работы: 8:00-20:00 ежедневно"
          ],
          metrics: [
            { label: "Доступность", value: "95%", trend: "stable" },
            { label: "Запись онлайн", value: "24/7", trend: "stable" },
            { label: "Очередь", value: "5 мин", trend: "down" }
          ],
          action: "Перейти к медицинским услугам"
        }
      },
      {
        label: "🚚 Доставка",
        value: "3 услуги",
        details: "Доставка товаров и продуктов питания",
        metric: "Статус",
        trend: "up",
        icon: "🚚",
        link: "",
        modal: {
          title: "🚚 Услуги доставки",
          content: [
            "📦 Активные доставки: 2 посылки в пути",
            "✅ Завершено в этом месяце: 8 доставок",
            "⏱️ Среднее время доставки: 2 часа",
            "💰 Экономия на доставке: 1,500 ₽",
            "",
            "🎯 Доступные услуги доставки:",
            "• Статус доставки в реальном времени",
            "• Трекинг посылки на карте", 
            "• Различные способы доставки",
            "• Счета и квитанции онлайн",
            "• Уведомления о статусе",
            "",
            "📍 Зона покрытия: весь город и пригород",
            "🚚 Партнеры: 5 проверенных служб"
          ],
          metrics: [
            { label: "Скорость", value: "4.8/5", trend: "up" },
            { label: "Надежность", value: "96%", trend: "stable" },
            { label: "Экономия", value: "1,500₽", trend: "up" }
          ],
          action: "Перейти к доставке"
        }
      },
      {
        label: "🚘 Автосервис",
        value: "2 услуги",
        details: "Обслуживание и ремонт транспорта",
        metric: "История",
        trend: "stable",
        icon: "🚘",
        link: "",
        modal: {
          title: "🚘 Автосервис",
          content: [
            "🔧 Последнее ТО: 15 декабря 2023 года",
            "📅 Следующее ТО: 15 марта 2024 года",
            "🚗 Марка и модель: Toyota Camry 2020",
            "📊 Пробег: 45,250 км",
            "",
            "📋 Доступные сервисные услуги:",
            "• Полная история обслуживания",
            "• Технические данные автомобиля", 
            "• Напоминания о ТО и страховке",
            "• Услуги сервиса и ремонта",
            "• Гарантийное обслуживание",
            "",
            "📞 Контакт сервиса: +7 (495) 123-45-68",
            "🏢 Партнерские СТО: 3 в вашем районе"
          ],
          metrics: [
            { label: "Исправность", value: "100%", trend: "stable" },
            { label: "Следующее ТО", value: "89 дн", trend: "down" },
            { label: "Экономия", value: "3,200₽", trend: "up" }
          ],
          action: "Перейти к автосервису"
        }
      },
      {
        label: "🚌 Транспорт",
        value: "2 услуги",
        details: "Городской и междугородний транспорт",
        metric: "Расписание",
        trend: "up",
        icon: "🚌",
        link: "",
        modal: {
          title: "🚌 Транспортные услуги",
          content: [
            "🎫 Активных билетов: 3 проездных",
            "📊 Поездок в текущем месяце: 24 поездки",
            "💰 Общая экономия: 1,200 ₽",
            "🌍 Маршрутов доступно: 45 направлений",
            "",
            "📋 Доступные транспортные услуги:",
            "• Расписание транспорта онлайн",
            "• Электронные билеты и проездные", 
            "• Онлайн-заказ такси и каршеринг",
            "• Статистика поездок и расходов",
            "• Оптимизация маршрутов",
            "",
            "🎯 Льготный проезд активен до 31.12.2024",
            "📱 Мобильное приложение доступно"
          ],
          metrics: [
            { label: "Пунктуальность", value: "92%", trend: "up" },
            { label: "Экономия", value: "1,200₽", trend: "up" },
            { label: "Удобство", value: "4.9/5", trend: "stable" }
          ],
          action: "Перейти к транспорту"
        }
      }
    ]
  },
  {
    id: 'requests',
    title: "📋 ЗАЯВКИ",
    type: "tall",
    mainOverview: {
      label: "Мои заявки",
      description: "История и статусы ваших обращений и заявок",
      value: "3",
      metric: "активных",
      link: "",
      stats: [
        { label: "Активных", value: "3", trend: "up" },
        { label: "Всего", value: "10", trend: "stable" },
        { label: "Завершённых", value: "7", trend: "up" }
      ],
      requestTypes: [
        { type: "Активные", count: 3, percent: 30 },
        { type: "На рассмотрении", count: 2, percent: 20 },
        { type: "Завершенные", count: 7, percent: 70 }
      ]
    },
    items: [
      {
        label: "📝 Активные заявки",
        value: "3 заявки",
        details: "Требуют вашего внимания",
        metric: "В работе",
        trend: "up",
        icon: "📝",
        link: "",
        modal: {
          title: "📝 Активные заявки",
          content: [
            "🔄 В обработке: 3 текущие заявки",
            "📅 Поданы в период: 10-15 января 2024",
            "👤 Ответственные специалисты назначены",
            "⏰ Приоритет: средний и высокий",
            "",
            "📋 Детали текущих заявок:",
            "• Материальная помощь - на стадии проверки документов",
            "• Социальный работник - ожидает подтверждения визита", 
            "• Юридическая консультация - специалист назначен",
            "",
            "⏱️ Среднее время выполнения: 3-5 рабочих дней",
            "📞 Контакт для уточнений: +7 (495) 123-45-67",
            "🔔 Уведомления при изменении статуса"
          ],
          metrics: [
            { label: "Выполнено", value: "70%", trend: "up" },
            { label: "В работе", value: "30%", trend: "up" },
            { label: "Срок", value: "3 дн", trend: "down" }
          ],
          action: "Посмотреть заявки"
        }
      },
      {
        label: "✨ Подать заявку",
        value: "5 минут",
        details: "Быстрое оформление новой заявки",
        metric: "98% успех",
        trend: "up",
        icon: "✨",
        link: "",
        modal: {
          title: "✨ Подать новую заявку",
          content: [
            "🚀 Быстрое оформление за 5 минут",
            "📱 Доступно онлайн 24/7 с любого устройства",
            "✅ Автозаполнение персональных данных",
            "🔒 Безопасная передача информации",
            "",
            "📋 Основные типы заявок:",
            "• Социальные услуги и поддержка",
            "• Материальная помощь и выплаты", 
            "• Консультации специалистов",
            "• Технические средства реабилитации",
            "• Льготы и субсидии",
            "• Жилищные вопросы",
            "",
            "⏱️ Среднее время рассмотрения: 2 рабочих дня",
            "📊 Статистика одобрения: 98% успешных заявок"
          ],
          metrics: [
            { label: "Успешность", value: "98%", trend: "up" },
            { label: "Скорость", value: "5 мин", trend: "down" },
            { label: "Доступность", value: "24/7", trend: "stable" }
          ],
          action: "Начать оформление"
        }
      },
      {
        label: "📊 Все заявки",
        value: "10 заявок",
        details: "Полная история обращений",
        metric: "2023-2024",
        trend: "up",
        icon: "📊",
        link: "",
        modal: {
          title: "📊 Все заявки",
          content: [
            "📅 Период рассмотрения: с 2023 года по настоящее время",
            "📊 Всего обращений: 10 заявок",
            "✅ Успешно выполнено: 7 заявок",
            "⭐ Средняя оценка качества: 4.8/5",
            "",
            "📈 Детальная статистика по годам:",
            "• 2024 год: 3 обращения (все в работе)",
            "• 2023 год: 7 обращений (все выполнены)", 
            "",
            "🔍 Расширенные возможности фильтрации:",
            "• По статусам выполнения",
            "• По датам подачи",
            "• По типам услуг",
            "• По оценкам качества",
            "",
            "📋 Экспорт данных в PDF и Excel"
          ],
          metrics: [
            { label: "Всего", value: "10", trend: "up" },
            { label: "Выполнено", value: "7", trend: "up" },
            { label: "Оценка", value: "4.8/5", trend: "stable" }
          ],
          action: "Посмотреть историю"
        }
      },
      {
        label: "✅ Завершённые",
        value: "7 заявок",
        details: "Успешно выполненные заявки",
        metric: "4.8/5 оценка",
        trend: "up",
        icon: "✅",
        link: "",
        modal: {
          title: "✅ Завершённые заявки",
          content: [
            "⭐ Общая оценка качества: 4.8/5 баллов",
            "📈 Выполнено в установленные сроки: 100%",
            "🤝 Удовлетворенность клиентов: 96%",
            "🎯 Повторные обращения: 12%",
            "",
            "🎉 Последние успешно выполненные заявки:",
            "• Доставка продуктов - выполнено 5 января",
            "• Юридическая консультация - завершено 3 января", 
            "• Визит социального работника - 28 декабря",
            "• Материальная помощь - 25 декабря",
            "",
            "💬 Отзывы и рекомендации:",
            "• 15 положительных отзывов",
            "• 2 предложения по улучшению",
            "📞 Контакт для отзывов: feedback@social.ru"
          ],
          metrics: [
            { label: "Качество", value: "4.8/5", trend: "up" },
            { label: "Своевременность", value: "100%", trend: "stable" },
            { label: "Отзывы", value: "15", trend: "up" }
          ],
          action: "Посмотреть выполненные"
        }
      }
    ]
  },
  {
    id: 'support',
    title: "🤝 ПОДДЕРЖКА",
    type: "default",
    mainOverview: {
      label: "Служба поддержки",
      description: "Помощь и консультации доступны круглосуточно",
      value: "24/7",
      metric: "Доступность",
      link: "",
      stats: [
        { label: "Онлайн-чат", value: "2 мин", trend: "down" },
        { label: "Горячая линия", value: "3 ном", trend: "stable" },
        { label: "Частые вопросы", value: "50+", trend: "up" }
      ]
    },
    items: [
      {
        label: "💬 Онлайн-чат",
        value: "2 минуты",
        details: "Мгновенная помощь в чате",
        metric: "24/7",
        trend: "down",
        icon: "💬",
        link: "",
        modal: {
          title: "💬 Онлайн-чат поддержки",
          content: [
            "⚡ Мгновенная связь со специалистом поддержки",
            "📱 Удобный интерфейс с мобильного телефона",
            "💾 Полное сохранение истории переписки",
            "🔔 Уведомления о новых сообщениях",
            "",
            "🎯 Основные решаемые вопросы:",
            "• Консультации по социальным услугам",
            "• Помощь в оформлении заявок", 
            "• Техническая поддержка платформы",
            "• Юридические консультации онлайн",
            "• Информация о льготах и выплатах",
            "",
            "👥 Специалисты онлайн сейчас: 3 оператора",
            "⏱️ Среднее время ответа: 2 минуты",
            "🌍 Поддержка на русском языке"
          ],
          metrics: [
            { label: "Время ответа", value: "2 мин", trend: "down" },
            { label: "Удовлетворенность", value: "95%", trend: "up" },
            { label: "Онлайн", value: "3", trend: "stable" }
          ],
          action: "Начать чат"
        }
      },
      {
        label: "📞 Горячая линия",
        value: "3 номера",
        details: "Круглосуточная телефонная поддержка",
        metric: "8:00-20:00",
        trend: "stable",
        icon: "📞",
        link: "",
        modal: {
          title: "📞 Телефоны горячей линии",
          content: [
            "📱 Основной номер: +7 (495) 123-45-67",
            "🕒 Время работы: ежедневно с 8:00 до 20:00",
            "🎯 Бесплатные звонки по России",
            "",
            "📞 Специализированные телефонные линии:",
            "• Социальные услуги: +7 (495) 123-45-68",
            "• Медицинские вопросы: +7 (495) 123-45-69", 
            "• Техническая поддержка: +7 (495) 123-45-70",
            "• Юридические консультации: +7 (495) 123-45-71",
            "",
            "📧 Альтернативные способы связи:",
            "• Электронная почта: support@social.ru",
            "• Мессенджеры: Telegram, WhatsApp",
            "• Форма обратной связи на сайте"
          ],
          metrics: [
            { label: "Доступность", value: "98%", trend: "stable" },
            { label: "Время ответа", value: "1.5 мин", trend: "down" },
            { label: "Линии", value: "4", trend: "stable" }
          ],
          action: "Позвонить"
        }
      },
      {
        label: "❓ Частые вопросы",
        value: "50+ ответов",
        details: "Обширная база знаний",
        metric: "Поиск",
        trend: "up",
        icon: "❓",
        link: "",
        modal: {
          title: "❓ Частые вопросы",
          content: [
            "📚 Обширная база знаний: 50+ подробных статей",
            "🔍 Умный поиск по ключевым словам и фразам",
            "🎯 Актуальные и проверенные ответы",
            "📱 Адаптивный дизайн для всех устройств",
            "",
            "📋 Основные категории вопросов:",
            "• Оформление и подача заявок",
            "• Социальные услуги и поддержка", 
            "• Льготы, выплаты и субсидии",
            "• Технические вопросы платформы",
            "• Документы и справки",
            "• Медицинское обслуживание",
            "",
            "⭐ Статистика полезности: помогло в 85% случаев",
            "🔄 Регулярное обновление базы знаний"
          ],
          metrics: [
            { label: "Статей", value: "50+", trend: "up" },
            { label: "Полезность", value: "85%", trend: "up" },
            { label: "Обновления", value: "2/нед", trend: "stable" }
          ],
          action: "Найти ответ"
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
      description: "8 документов загружено в защищенную систему",
      value: "8",
      metric: "документов",
      link: "",
      stats: [
        { label: "Заявления", value: "5", trend: "stable" },
        { label: "Формы", value: "8", trend: "up" },
        { label: "Справки", value: "3", trend: "up" }
      ]
    },
    items: [
      {
        label: "📝 Заявления",
        value: "5 документов",
        details: "Официальные обращения и заявления",
        metric: "Готовы",
        trend: "stable",
        icon: "📝",
        link: "",
        modal: {
          title: "📝 Заявления",
          content: [
            "✅ Готовы к подаче: 5 заполненных заявлений",
            "📋 Основные типы заявлений:",
            "• На материальную помощь и поддержку",
            "• На предоставление социальных услуг", 
            "• На оформление льгот и выплат",
            "• Жалобы и предложения по улучшению",
            "• Запросы информации и справок",
            "",
            "⚡ Умное автозаполнение персональных данных",
            "📤 Быстрая электронная подача заявлений",
            "🔒 Защищенное хранение в зашифрованном виде",
            "📬 Уведомления о статусе рассмотрения"
          ],
          metrics: [
            { label: "Доступно", value: "5", trend: "stable" },
            { label: "Шаблоны", value: "12", trend: "up" },
            { label: "Безопасность", value: "100%", trend: "stable" }
          ],
          action: "Посмотреть заявления"
        }
      },
      {
        label: "📋 Формы",
        value: "8 шаблонов",
        details: "Готовые формы и шаблоны документов",
        metric: "PDF, Word",
        trend: "up",
        icon: "📋",
        link: "",
        modal: {
          title: "📋 Формы и шаблоны",
          content: [
            "📄 Поддерживаемые форматы: PDF, Word, Excel",
            "🚀 Удобное онлайн-заполнение форм",
            "💾 Автоматическое сохранение черновиков",
            "🔍 Умная проверка заполненных данных",
            "",
            "🎯 Популярные готовые формы:",
            "• Анкета получателя социальных услуг",
            "• Запрос справок и выписок", 
            "• Заявление на оформление льгот",
            "• Отзывы и предложения по услугам",
            "• Заявка на технические средства",
            "• Опросы удовлетворенности",
            "",
            "📱 Кросс-платформенная доступность",
            "🖨️ Печать и экспорт в нужных форматах"
          ],
          metrics: [
            { label: "Шаблоны", value: "8", trend: "up" },
            { label: "Форматы", value: "3", trend: "stable" },
            { label: "Заполнение", value: "85%", trend: "up" }
          ],
          action: "Скачать формы"
        }
      },
      {
        label: "📄 Справки",
        value: "3 документа",
        details: "Официальные справки и выписки",
        metric: "Новые",
        trend: "up",
        icon: "📄",
        link: "",
        modal: {
          title: "📄 Справки и выписки",
          content: [
            "✅ Готовы к выдаче: 3 официальные справки",
            "⏳ На подготовке: 2 документа в работе",
            "📅 Стандартный срок изготовления: 1-3 рабочих дня",
            "🚀 Срочное оформление: за 24 часа",
            "",
            "📋 Основные доступные типы справок:",
            "• О размере пенсии и социальных выплат",
            "• О наличии льгот и их статусе", 
            "• О полученных социальных услугах",
            "• О составе семьи и проживании",
            "• О доходах и материальном положении",
            "",
            "🏢 Способы получения готовых документов:",
            "• Онлайн в личном кабинете",
            "• В ближайшем МФЦ",
            "• Почтой России на домашний адрес",
            "• Курьерской доставкой"
          ],
          metrics: [
            { label: "Готово", value: "3", trend: "up" },
            { label: "В работе", value: "2", trend: "up" },
            { label: "Срок", value: "2 дн", trend: "down" }
          ],
          action: "Заказать справку"
        }
      },
      {
        label: "📊 История обращений",
        value: "27 записей",
        details: "Полный архив обращений и документов",
        metric: "2021-2024",
        trend: "up",
        icon: "📊",
        link: "",
        modal: {
          title: "📊 История обращений",
          content: [
            "📅 Охватываемый период: с 2021 года по настоящее время",
            "📊 Всего зафиксированных обращений: 27",
            "⭐ Средняя оценка качества обслуживания: 4.7/5",
            "🔍 Глубина архива: 4 полных года",
            "",
            "📈 Детальная статистика по годам:",
            "• 2024 год: 3 обращения (средняя оценка 4.8/5)",
            "• 2023 год: 12 обращений (средняя оценка 4.8/5)", 
            "• 2022 год: 7 обращений (средняя оценка 4.6/5)",
            "• 2021 год: 5 обращений (средняя оценка 4.5/5)",
            "",
            "🔧 Расширенные возможности фильтрации:",
            "• По типам предоставленных услуг",
            "• По датам обращения и выполнения",
            "• По оценкам качества обслуживания",
            "• По ответственным специалистам",
            "📋 Экспорт полной истории в PDF формат"
          ],
          metrics: [
            { label: "Всего", value: "27", trend: "up" },
            { label: "Оценка", value: "4.7/5", trend: "up" },
            { label: "Период", value: "4 г", trend: "up" }
          ],
          action: "Посмотреть историю"
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

// Улучшенный Bento Card компонент
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
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'md:row-span-2',
  }[rowSpan];

  const variantClass = {
    default: '',
    wide: 'md:col-span-2',
    tall: 'md:row-span-2',
    grid: 'md:col-span-2 md:row-span-2',
    compact: ''
  }[variant];

  return (
    <motion.div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:shadow-2xl' : ''}
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
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {enableEffects && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: 'var(--glow-intensity)',
            background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), 
                         rgba(var(--glow-color), 0.15) 0%, 
                         rgba(var(--glow-color), 0.08) 30%, 
                         transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
});

BentoCard.displayName = 'BentoCard';

// Компонент Progress Bar
const ProgressBar = ({ percentage, color = COLORS.blue }: { percentage: number; color?: string }) => (
  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
    <motion.div
      className="h-full rounded-full"
      style={{ backgroundColor: `rgb(${color})` }}
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 1, delay: 0.2 }}
    />
  </div>
);

// Улучшенный Modal компонент
function Modal({ show, content, onClose }: { show: boolean; content: any; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [show]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

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
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
              <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl">{content.title}</h3>
              <motion.button
                className="text-white/60 hover:text-white transition-colors text-2xl sm:text-3xl p-1"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {content.content.map((line: string, index: number) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3 text-white/80 text-sm sm:text-base leading-relaxed"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {line === "" ? (
                    <div className="h-4 w-full"></div>
                  ) : (
                    <>
                      <span className="flex-shrink-0 mt-1.5 text-white/60">•</span>
                      <span>{line}</span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {content.metrics && (
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {content.metrics.map((metric: any, index: number) => (
                  <div key={index} className="text-center p-2 sm:p-3">
                    <div className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">{metric.label}</div>
                    <div className="text-white font-bold text-base sm:text-lg md:text-xl">{metric.value}</div>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
              <motion.button
                className="px-4 sm:px-6 py-2 sm:py-3 text-white/70 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 rounded-lg order-2 sm:order-1"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Закрыть
              </motion.button>
              <motion.button
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl order-1 sm:order-2"
                onClick={handleAction}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {content.action} →
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Улучшенный KPI Widget компонент
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
          <motion.div 
            className="text-base sm:text-lg lg:text-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {kpi.icon}
          </motion.div>
          {kpi.change && (
            <motion.div 
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border`}
              style={{ 
                backgroundColor: `rgba(${trendColor}, 0.2)`,
                borderColor: `rgba(${trendColor}, 0.3)`,
                color: `rgb(${trendColor})`
              }}
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
        </div>
        
        <div className="text-white/60 text-xs line-clamp-2 leading-relaxed">
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

// Улучшенный Alert Widget компонент
const AlertWidget = React.memo(({ alert }: { alert: Alert }) => {
  const alertColor = getAlertColor(alert.type);
  
  return (
    <BentoCard 
      className="p-3 sm:p-4 min-h-[100px]"
      glowColor={alertColor}
    >
      <motion.div 
        className="h-full flex flex-col justify-between p-3 rounded-xl border"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          backgroundColor: `rgba(${alertColor}, 0.1)`,
          borderColor: `rgba(${alertColor}, 0.2)`,
        }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="font-medium text-sm line-clamp-2 flex-grow text-white">
            {alert.title}
          </div>
          <motion.span 
            className="px-2 py-1 rounded-full text-xs border flex-shrink-0"
            style={{
              backgroundColor: `rgba(${alertColor}, 0.2)`,
              borderColor: `rgba(${alertColor}, 0.3)`,
              color: `rgb(${alertColor})`
            }}
            whileHover={{ scale: 1.05 }}
          >
            {alert.priority === 'high' ? 'Важно' : alert.priority === 'medium' ? 'Инфо' : 'Уведомление'}
          </motion.span>
        </div>
        <div className="space-y-1">
          <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">{alert.message}</p>
          <div className="flex justify-between items-center">
            <div className="text-white/60 text-xs">{alert.time}</div>
            {alert.action && (
              <Link href={alert.actionLink || '#'}>
                <motion.span 
                  className="text-white/80 text-xs hover:text-white cursor-pointer font-medium"
                  whileHover={{ x: 2 }}
                >
                  {alert.action} →
                </motion.span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </BentoCard>
  );
});

AlertWidget.displayName = 'AlertWidget';

// Улучшенный компонент карточки с подпунктами
function ModuleCard({ module }: { module: ModuleCard }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const handleItemClick = useCallback((item: ModuleItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalContent({
      ...item.modal,
      actionLink: item.link
    });
    setShowModal(true);
  }, []);

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
            <motion.div 
              className="text-2xl sm:text-3xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {module.title.split(' ')[0]}
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {module.title.split(' ').slice(1).join(' ')}
              </h2>
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
                  <motion.div 
                    className="text-white/60 text-xs"
                    whileHover={{ x: 2 }}
                  >
                    Перейти →
                  </motion.div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {module.mainOverview.stats.map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center p-2 bg-white/5 rounded-lg border border-white/5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-white font-bold text-sm">{stat.value}</div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </motion.div>
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
                whileHover={{ x: 4, scale: 1.02 }}
                onClick={(e) => handleItemClick(item, e)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <motion.div 
                    className="text-xl flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.icon}
                  </motion.div>
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

// Улучшенный компонент карточки с графиком (для услуг)
function ServicesCard({ module }: { module: ModuleCard }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const handleItemClick = useCallback((item: ModuleItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalContent({
      ...item.modal,
      actionLink: item.link
    });
    setShowModal(true);
  }, []);

  return (
    <>
      <BentoCard className="p-4 sm:p-6 lg:p-8 h-full min-h-[500px]" variant="wide" glowColor={COLORS.purple}>
        <div className="h-full flex flex-col">
          {/* Шапка услуг */}
          <div className="text-center mb-6">
            <motion.div 
              className="text-4xl mb-2"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              🛠️
            </motion.div>
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
                    <div className="text-white font-bold text-2xl mb-2">28</div>
                    <div className="text-white/80 text-sm">Доступных услуг</div>
                    <motion.div 
                      className="text-white/60 text-xs mt-1"
                      whileHover={{ x: 2 }}
                    >
                      Каталог услуг →
                    </motion.div>
                  </div>
                </motion.div>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                {module.mainOverview.stats.map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center p-3 bg-white/5 rounded-xl border border-white/10"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-white font-bold text-lg">{stat.value}</div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="p-4 bg-white/5 rounded-xl border border-white/10"
                whileHover={{ y: -2 }}
              >
                <div className="text-white font-medium mb-3">Распределение услуг</div>
                <div className="space-y-2">
                  {module.mainOverview.serviceTypes?.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{type.type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/10 rounded-full h-2">
                          <motion.div 
                            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${type.percent}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                        <span className="text-white/60 text-xs w-8">{type.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
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
                  whileHover={{ x: 4, scale: 1.02 }}
                  onClick={(e) => handleItemClick(item, e)}
                >
                  <motion.div 
                    className="text-2xl flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.icon}
                  </motion.div>
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

// Компонент для отображения статуса системы
const SystemStatus = () => (
  <motion.div 
    className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
  >
    <motion.div 
      className="w-2 h-2 rounded-full bg-green-400"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <span className="text-green-400 text-sm font-medium">Система активна</span>
  </motion.div>
);

// Компонент для быстрых действий
const QuickActions = () => {
  const quickActions = [
    { icon: '📝', label: 'Новая заявка', link: '' },
    { icon: '📄', label: 'Загрузить документ', link: '' },
    { icon: '🔍', label: 'Поиск услуг', link: '' },
    { icon: '💬', label: 'Поддержка', link: '' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {quickActions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <Link href={action.link}>
            <BentoCard className="p-3 text-center hover:bg-white/10 transition-colors">
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-white text-xs font-medium">{action.label}</div>
            </BentoCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

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
    <div className={`min-h-screen bg-gradient-to-br ${role.bgGradient}`}>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-3 sm:mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BentoCard className="p-3 sm:p-4 lg:p-6" glowColor={COLORS.blue}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="flex-grow min-w-0">
                <motion.h1 
                  className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Добро пожаловать, Алексей Петров!
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {role.description} Здесь вы можете подавать заявки на социальные услуги, отслеживать льготы и управлять своими обращениями в удобном формате.
                </motion.p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0 mt-2 sm:mt-0"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium">Кабинет активен</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="mb-3 sm:mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <QuickActions />
        </motion.section>

        {/* Alerts Section */}
        <motion.section 
          className="mb-3 sm:mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <AlertWidget alert={alert} />
              </motion.div>
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
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {todayKPIs.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <KPIWidget kpi={kpi} />
              </motion.div>
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

          {/* 3. ПОДДЕРЖКА */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ModuleCard module={moduleCardsData.find(m => m.id === 'support')!} />
          </motion.section>

          {/* 4. ДОКУМЕНТЫ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ModuleCard module={moduleCardsData.find(m => m.id === 'documents')!} />
          </motion.section>
        </div>
      </main>
    </div>
  );
}