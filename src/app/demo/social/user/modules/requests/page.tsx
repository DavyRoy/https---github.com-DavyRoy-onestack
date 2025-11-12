'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166',
  amber: '245, 158, 11',
} as const;

// Типы данных
interface Request {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'approved' | 'completed' | 'rejected';
  date: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  serviceType: string;
  amount?: string;
  assignedTo?: string;
  progress: number;
  documents: string[];
  timeline: TimelineEvent[];
  notes: string[];
  nextStep?: string;
  estimatedCompletion?: string;
}

interface TimelineEvent {
  date: string;
  time: string;
  action: string;
  description: string;
  user: string;
}

// Моки данных для заявок
const mockRequests: Request[] = [
  {
    id: 'REQ-2024-001',
    title: 'Материальная помощь на лечение',
    category: 'Материальная помощь',
    status: 'in_progress',
    date: '15.12.2024',
    priority: 'high',
    description: 'Необходима финансовая поддержка для оплаты курса реабилитации после операции на позвоночнике. Врач назначил комплекс процедур стоимостью 45,000 рублей.',
    serviceType: 'Единовременная выплата',
    amount: '45,000 ₽',
    assignedTo: 'Иванова Мария Петровна',
    progress: 65,
    documents: ['Направление врача', 'Чеки на лекарства', 'Выписка из истории болезни', 'Справка о доходах'],
    timeline: [
      {
        date: '15.12.2024',
        time: '10:30',
        action: 'Подача заявки',
        description: 'Заявка успешно подана через личный кабинет',
        user: 'Алексей Петров'
      },
      {
        date: '16.12.2024',
        time: '09:15',
        action: 'Проверка документов',
        description: 'Документы приняты к рассмотрению',
        user: 'Иванова М.П.'
      },
      {
        date: '18.12.2024',
        time: '14:20',
        action: 'Запрос дополнительных документов',
        description: 'Запрошены дополнительные медицинские заключения',
        user: 'Иванова М.П.'
      },
      {
        date: '20.12.2024',
        time: '11:45',
        action: 'Документы предоставлены',
        description: 'Все запрошенные документы получены',
        user: 'Алексей Петров'
      }
    ],
    notes: [
      'Необходимо предоставить заключение главного врача',
      'Рассматривается комиссией 25.12.2024',
      'Рекомендовано одобрение 80% суммы'
    ],
    nextStep: 'Рассмотрение комиссией',
    estimatedCompletion: '28.12.2024'
  },
  {
    id: 'REQ-2024-002',
    title: 'Юридическая консультация по жилищному вопросу',
    category: 'Юридическая помощь',
    status: 'approved',
    date: '10.12.2024',
    priority: 'medium',
    description: 'Конфликт с управляющей компанией по вопросу неправомерного начисления коммунальных платежей. Требуется правовая оценка ситуации и подготовка претензии.',
    serviceType: 'Юридическая консультация',
    assignedTo: 'Петров Иван Сидорович',
    progress: 100,
    documents: ['Договор с УК', 'Квитанции ЖКУ', 'Фото счетчиков'],
    timeline: [
      {
        date: '10.12.2024',
        time: '14:20',
        action: 'Подача заявки',
        description: 'Заявка на юридическую консультацию подана',
        user: 'Алексей Петров'
      },
      {
        date: '11.12.2024',
        time: '10:00',
        action: 'Назначен юрист',
        description: 'Заявка назначена специалисту Петрову И.С.',
        user: 'Система'
      },
      {
        date: '12.12.2024',
        time: '15:30',
        action: 'Консультация проведена',
        description: 'Онлайн-консультация с юристом состоялась',
        user: 'Петров И.С.'
      },
      {
        date: '13.12.2024',
        time: '11:15',
        action: 'Документы подготовлены',
        description: 'Подготовлена претензия в управляющую компанию',
        user: 'Петров И.С.'
      }
    ],
    notes: [
      'Претензия отправлена в УК 14.12.2024',
      'Ожидается ответ до 28.12.2024',
      'Юрист продолжает сопровождение дела'
    ],
    nextStep: 'Ожидание ответа от УК',
    estimatedCompletion: '28.12.2024'
  },
  {
    id: 'REQ-2024-003',
    title: 'Вызов терапевта на дом',
    category: 'Медицинская помощь',
    status: 'completed',
    date: '05.12.2024',
    priority: 'high',
    description: 'Острое респираторное заболевание с температурой 38.5. Требуется осмотр терапевта и назначение лечения.',
    serviceType: 'Выезд врача на дом',
    assignedTo: 'Сидорова Анна Михайловна',
    progress: 100,
    documents: ['Заявление', 'Полис ОМС'],
    timeline: [
      {
        date: '05.12.2024',
        time: '08:45',
        action: 'Подача заявки',
        description: 'Заявка на вызов врача подана',
        user: 'Алексей Петров'
      },
      {
        date: '05.12.2024',
        time: '09:30',
        action: 'Заявка подтверждена',
        description: 'Врач назначен на визит',
        user: 'Система'
      },
      {
        date: '05.12.2024',
        time: '12:15',
        action: 'Врач прибыл',
        description: 'Терапевт Сидорова А.М. провела осмотр',
        user: 'Сидорова А.М.'
      },
      {
        date: '05.12.2024',
        time: '13:00',
        action: 'Лечение назначено',
        description: 'Выписаны рецепты и рекомендации',
        user: 'Сидорова А.М.'
      }
    ],
    notes: [
      'Состояние пациента улучшилось',
      'Рекомендовано наблюдение участкового врача',
      'Больничный лист оформлен'
    ]
  },
  {
    id: 'REQ-2024-004',
    title: 'Субсидия на оплату ЖКУ',
    category: 'Материальная помощь',
    status: 'submitted',
    date: '22.12.2024',
    priority: 'medium',
    description: 'Заявка на получение субсидии по коммунальным платежам в связи с низким уровнем дохода. Расходы на ЖКУ составляют 45% от общего дохода семьи.',
    serviceType: 'Субсидия ЖКУ',
    amount: '7,200 ₽/мес',
    progress: 25,
    documents: ['Справка о доходах', 'Квитанции ЖКУ', 'Документы на квартиру', 'Свидетельства о рождении детей'],
    timeline: [
      {
        date: '22.12.2024',
        time: '16:40',
        action: 'Подача заявки',
        description: 'Заявка на субсидию подана',
        user: 'Алексей Петров'
      },
      {
        date: '23.12.2024',
        time: '10:15',
        action: 'Документы проверены',
        description: 'Предварительная проверка документов пройдена',
        user: 'Система'
      }
    ],
    notes: [
      'Ожидается проверка жилищных условий',
      'Рассмотрение займет до 10 рабочих дней'
    ],
    nextStep: 'Проверка жилищных условий',
    estimatedCompletion: '15.01.2024'
  },
  {
    id: 'REQ-2024-005',
    title: 'Психологическая консультация',
    category: 'Психологическая помощь',
    status: 'completed',
    date: '01.12.2024',
    priority: 'low',
    description: 'Цикл консультаций по преодолению стрессовых ситуаций. Пройдено 5 сеансов с психологом.',
    serviceType: 'Психологическая помощь',
    assignedTo: 'Козлова Анна Михайловна',
    progress: 100,
    documents: ['Анкета клиента'],
    timeline: [
      {
        date: '01.12.2024',
        time: '11:00',
        action: 'Первая консультация',
        description: 'Знакомство, оценка состояния',
        user: 'Козлова А.М.'
      },
      {
        date: '08.12.2024',
        time: '11:00',
        action: 'Вторая консультация',
        description: 'Работа с тревожностью',
        user: 'Козлова А.М.'
      },
      {
        date: '15.12.2024',
        time: '11:00',
        action: 'Третья консультация',
        description: 'Техники релаксации',
        user: 'Козлова А.М.'
      },
      {
        date: '22.12.2024',
        time: '11:00',
        action: 'Завершающая консультация',
        description: 'Подведение итогов, рекомендации',
        user: 'Козлова А.М.'
      }
    ],
    notes: [
      'Клиент показал значительное улучшение состояния',
      'Рекомендованы поддерживающие практики',
      'Открыта возможность для последующих консультаций'
    ]
  },
  {
    id: 'REQ-2024-006',
    title: 'Лекарственное обеспечение',
    category: 'Медицинская помощь',
    status: 'in_progress',
    date: '18.12.2024',
    priority: 'high',
    description: 'Получение бесплатных лекарственных препаратов по рецепту врача для лечения гипертонической болезни.',
    serviceType: 'Лекарственное обеспечение',
    assignedTo: 'Фармацевтический отдел',
    progress: 40,
    documents: ['Рецепт врача', 'Выписка из медицинской карты'],
    timeline: [
      {
        date: '18.12.2024',
        time: '09:20',
        action: 'Подача заявки',
        description: 'Заявка на получение лекарств подана',
        user: 'Алексей Петров'
      },
      {
        date: '19.12.2024',
        time: '14:30',
        action: 'Рецепт подтвержден',
        description: 'Рецепт прошел проверку',
        user: 'Фармацевт'
      }
    ],
    notes: [
      'Лекарства ожидаются на складе 26.12.2024',
      'Будет доступен самовывоз из аптеки №15'
    ],
    nextStep: 'Поступление лекарств на склад',
    estimatedCompletion: '27.12.2024'
  },
  {
    id: 'REQ-2024-007',
    title: 'Технические средства реабилитации',
    category: 'Медицинская помощь',
    status: 'draft',
    date: '24.12.2024',
    priority: 'medium',
    description: 'Заявка на получение ходунков для улучшения мобильности. Рекомендовано врачом-реабилитологом.',
    serviceType: 'ТСР',
    progress: 0,
    documents: ['Заключение врача', 'Документы об инвалидности'],
    timeline: [],
    notes: [
      'Необходимо предоставить дополнительные медицинские документы',
      'Рекомендована модель с колесами и сиденьем'
    ],
    nextStep: 'Заполнение заявления'
  },
  {
    id: 'REQ-2024-008',
    title: 'Помощь социального работника',
    category: 'Социальное обслуживание',
    status: 'completed',
    date: '10.11.2024',
    priority: 'medium',
    description: 'Регулярные визиты социального работника для помощи по хозяйству и сопровождения в поликлинику.',
    serviceType: 'Социальное сопровождение',
    assignedTo: 'Васильева Ольга Ивановна',
    progress: 100,
    documents: ['Заявление', 'Медицинские показания'],
    timeline: [
      {
        date: '10.11.2024',
        time: '10:00',
        action: 'Начало обслуживания',
        description: 'Социальный работник приступил к обязанностям',
        user: 'Васильева О.И.'
      },
      {
        date: '15.12.2024',
        time: '16:00',
        action: 'Завершение обслуживания',
        description: 'Курс социального сопровождения завершен',
        user: 'Васильева О.И.'
      }
    ],
    notes: [
      'Проведено 12 визитов',
      'Состояние клиента стабилизировалось',
      'Рекомендовано продолжение при необходимости'
    ]
  }
];

// Bento Card компонент
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue,
  onClick 
}: { 
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        bg-white/5 backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

// Request Card компонент
const RequestCard = ({ request, onSelect }: { request: Request; onSelect: () => void }) => {
  const statusConfig = {
    draft: { label: 'Черновик', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: '📝' },
    submitted: { label: 'Подана', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: '📤' },
    in_progress: { label: 'В обработке', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: '🔄' },
    approved: { label: 'Одобрена', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: '✅' },
    completed: { label: 'Выполнена', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: '🏆' },
    rejected: { label: 'Отклонена', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: '❌' }
  };

  const priorityConfig = {
    low: { label: 'Низкий', color: 'text-green-400' },
    medium: { label: 'Средний', color: 'text-yellow-400' },
    high: { label: 'Высокий', color: 'text-red-400' }
  };

  const status = statusConfig[request.status];
  const priority = priorityConfig[request.priority];

  return (
    <BentoCard
      className="p-4 sm:p-6 h-full"
      glowColor={status.color.split(' ')[0].replace('text-', '')}
      onClick={onSelect}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                {request.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${status.color}`}>
                {status.icon} {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
              <span>#{request.id}</span>
              <span>📅 {request.date}</span>
              <span className={priority.color}>🚨 {priority.label}</span>
            </div>
            <p className="text-white/60 text-xs sm:text-sm line-clamp-2">
              {request.description}
            </p>
          </div>
        </div>

        {/* Category and Service */}
        <div className="flex items-center justify-between mb-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span>📁 {request.category}</span>
            <span>•</span>
            <span>🎯 {request.serviceType}</span>
          </div>
          {request.amount && (
            <span className="text-white font-semibold">{request.amount}</span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Прогресс обработки</span>
            <span>{request.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${request.progress}%`,
                backgroundColor: `rgb(${status.color.split(' ')[0].replace('text-', '') === 'yellow-400' ? COLORS.warning : 
                                 status.color.split(' ')[0].replace('text-', '') === 'green-400' ? COLORS.success :
                                 status.color.split(' ')[0].replace('text-', '') === 'blue-400' ? COLORS.blue :
                                 status.color.split(' ')[0].replace('text-', '') === 'emerald-400' ? COLORS.emerald :
                                 status.color.split(' ')[0].replace('text-', '') === 'red-400' ? COLORS.error : COLORS.gray})`
              }}
            />
          </div>
        </div>

        {/* Assigned To and Next Step */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1">
            {request.assignedTo ? (
              <>
                <span>👤</span>
                <span className="truncate max-w-[120px]">{request.assignedTo}</span>
              </>
            ) : (
              <span>⏳ Ожидает назначения</span>
            )}
          </div>
          {request.nextStep && (
            <span className="text-white/80 truncate max-w-[140px]">→ {request.nextStep}</span>
          )}
        </div>
      </div>
    </BentoCard>
  );
};

// Request Modal компонент
const RequestModal = ({ request, isOpen, onClose }: { request: Request; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  const statusConfig = {
    draft: { label: 'Черновик', color: 'text-gray-400' },
    submitted: { label: 'Подана', color: 'text-blue-400' },
    in_progress: { label: 'В обработке', color: 'text-yellow-400' },
    approved: { label: 'Одобрена', color: 'text-green-400' },
    completed: { label: 'Выполнена', color: 'text-emerald-400' },
    rejected: { label: 'Отклонена', color: 'text-red-400' }
  };

  const status = statusConfig[request.status];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-4xl border border-white/10 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-white font-bold text-xl mb-2">{request.title}</h2>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>#{request.id}</span>
                  <span className={status.color}>• {status.label}</span>
                  <span>• 📅 {request.date}</span>
                </div>
              </div>
              <button
                className="text-white/60 hover:text-white transition-colors text-2xl"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Основная информация */}
              <div className="lg:col-span-2 space-y-6">
                {/* Описание */}
                <div>
                  <h3 className="text-white font-semibold mb-3">📋 Описание заявки</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{request.description}</p>
                </div>

                {/* Хронология */}
                <div>
                  <h3 className="text-white font-semibold mb-3">🕒 Хронология обработки</h3>
                  <div className="space-y-3">
                    {request.timeline.map((event, index) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                          {index < request.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-white/10 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="text-white font-medium">{event.action}</div>
                          <div className="text-white/60 text-xs">{event.date} {event.time}</div>
                          <div className="text-white/70 text-xs mt-1">{event.description}</div>
                          <div className="text-white/50 text-xs mt-1">— {event.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Боковая панель */}
              <div className="space-y-6">
                {/* Детали */}
                <BentoCard className="p-4">
                  <h3 className="text-white font-semibold mb-3">📊 Детали заявки</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Категория:</span>
                      <span className="text-white">{request.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Тип услуги:</span>
                      <span className="text-white">{request.serviceType}</span>
                    </div>
                    {request.amount && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Сумма:</span>
                        <span className="text-white font-semibold">{request.amount}</span>
                      </div>
                    )}
                    {request.assignedTo && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Ответственный:</span>
                        <span className="text-white">{request.assignedTo}</span>
                      </div>
                    )}
                    {request.estimatedCompletion && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Завершение:</span>
                        <span className="text-white">{request.estimatedCompletion}</span>
                      </div>
                    )}
                  </div>
                </BentoCard>

                {/* Документы */}
                <BentoCard className="p-4">
                  <h3 className="text-white font-semibold mb-3">📄 Прикрепленные документы</h3>
                  <div className="space-y-2">
                    {request.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                        <span>📎</span>
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </BentoCard>

                {/* Заметки */}
                {request.notes.length > 0 && (
                  <BentoCard className="p-4">
                    <h3 className="text-white font-semibold mb-3">💡 Заметки</h3>
                    <div className="space-y-2">
                      {request.notes.map((note, index) => (
                        <div key={index} className="text-sm text-white/70 border-l-2 border-white/20 pl-2">
                          {note}
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Общий прогресс обработки</span>
                <span>{request.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${request.progress}%`,
                    backgroundColor: `rgb(${status.color === 'text-yellow-400' ? COLORS.warning : 
                                     status.color === 'text-green-400' ? COLORS.success :
                                     status.color === 'text-blue-400' ? COLORS.blue :
                                     status.color === 'text-emerald-400' ? COLORS.emerald :
                                     status.color === 'text-red-400' ? COLORS.error : COLORS.gray})`
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Quick Stats компонент
const QuickStats = () => {
  const stats = {
    total: mockRequests.length,
    inProgress: mockRequests.filter(r => r.status === 'in_progress').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    completed: mockRequests.filter(r => r.status === 'completed').length,
    draft: mockRequests.filter(r => r.status === 'draft').length
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <BentoCard className="p-4 text-center">
        <div className="text-2xl mb-2">📊</div>
        <div className="text-white font-bold text-xl mb-1">{stats.total}</div>
        <div className="text-white/60 text-sm">Всего заявок</div>
      </BentoCard>
      <BentoCard className="p-4 text-center">
        <div className="text-2xl mb-2">🔄</div>
        <div className="text-white font-bold text-xl mb-1">{stats.inProgress}</div>
        <div className="text-white/60 text-sm">В обработке</div>
      </BentoCard>
      <BentoCard className="p-4 text-center">
        <div className="text-2xl mb-2">✅</div>
        <div className="text-white font-bold text-xl mb-1">{stats.approved}</div>
        <div className="text-white/60 text-sm">Одобренные</div>
      </BentoCard>
      <BentoCard className="p-4 text-center">
        <div className="text-2xl mb-2">🏆</div>
        <div className="text-white font-bold text-xl mb-1">{stats.completed}</div>
        <div className="text-white/60 text-sm">Выполненные</div>
      </BentoCard>
      <BentoCard className="p-4 text-center">
        <div className="text-2xl mb-2">📝</div>
        <div className="text-white font-bold text-xl mb-1">{stats.draft}</div>
        <div className="text-white/60 text-sm">Черновики</div>
      </BentoCard>
    </div>
  );
};

// Filter Tabs компонент
const FilterTabs = ({ activeFilter, onFilterChange }: { 
  activeFilter: string; 
  onFilterChange: (filter: string) => void;
}) => {
  const filters = [
    { id: 'all', label: 'Все заявки', icon: '📊', count: mockRequests.length },
    { id: 'draft', label: 'Черновики', icon: '📝', count: mockRequests.filter(r => r.status === 'draft').length },
    { id: 'submitted', label: 'Подать новую', icon: '✨', count: 0 },
    { id: 'in_progress', label: 'В обработке', icon: '🔄', count: mockRequests.filter(r => r.status === 'in_progress').length },
    { id: 'approved', label: 'Одобренные', icon: '✅', count: mockRequests.filter(r => r.status === 'approved').length },
    { id: 'completed', label: 'Выполненные', icon: '🏆', count: mockRequests.filter(r => r.status === 'completed').length }
  ];

  return (
    <BentoCard className="p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{filter.icon}</span>
            <span className="text-sm font-medium">{filter.label}</span>
            {filter.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === filter.id ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </BentoCard>
  );
};

// New Request Form компонент
const NewRequestForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: 'medium',
    serviceType: '',
    amount: ''
  });

  if (!isOpen) return null;

  const categories = [
    'Материальная помощь',
    'Юридическая помощь',
    'Медицинская помощь',
    'Психологическая помощь',
    'Социальное обслуживание'
  ];

  const serviceTypes = {
    'Материальная помощь': ['Единовременная выплата', 'Субсидия ЖКУ', 'Компенсация расходов', 'Пособие на детей'],
    'Юридическая помощь': ['Консультация', 'Подготовка документов', 'Сопровождение в суде', 'Жилищные вопросы'],
    'Медицинская помощь': ['Выезд врача', 'Лекарственное обеспечение', 'Реабилитация', 'ТСР'],
    'Психологическая помощь': ['Консультация', 'Кризисная поддержка', 'Семейная терапия', 'Групповая терапия'],
    'Социальное обслуживание': ['Социальный работник', 'Доставка продуктов', 'Уборка помещения', 'Сопровождение']
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-xl">📝 Подать новую заявку</h2>
              <button
                className="text-white/60 hover:text-white transition-colors text-2xl"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Категория услуги</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value, serviceType: ''})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 transition-colors"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Тип услуги</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 transition-colors"
                  >
                    <option value="">Выберите тип услуги</option>
                    {serviceTypes[formData.category as keyof typeof serviceTypes]?.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Название заявки</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Краткое описание того, что вам нужно"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Подробное описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Опишите вашу ситуацию подробно, укажите важные детали..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Приоритет</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 transition-colors"
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Сумма (если применимо)</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Например: 15,000 ₽"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-medium"
                onClick={onClose}
              >
                Отмена
              </button>
              <button
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium"
                onClick={() => {
                  // Здесь будет логика сохранения заявки
                  alert('Заявка успешно создана!');
                  onClose();
                }}
              >
                📤 Подать заявку
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Основной компонент страницы заявок
export default function RequestsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);

  const filteredRequests = mockRequests.filter(request => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'submitted') return false; // Для кнопки "Подать новую"
    return request.status === activeFilter;
  });

  const handleFilterChange = (filter: string) => {
    if (filter === 'submitted') {
      setShowNewRequestForm(true);
    } else {
      setActiveFilter(filter);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      {/* Header как в дашборде */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/demo/social/users"
                className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                ← Назад к дашборду
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">Система активна</span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section как в дашборде */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BentoCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-grow min-w-0">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 leading-tight">
                  Мои заявки
                </h1>
                <p className="text-white/60 text-base lg:text-lg max-w-2xl">
                  {mockRequests.length} заявок • {mockRequests.filter(r => r.status === 'completed').length} выполнено • Отслеживание статусов
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">Все системы работают</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
        {/* Quick Stats */}
        <QuickStats />

        {/* Filter Tabs */}
        <FilterTabs activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Requests Grid */}
        {activeFilter !== 'submitted' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onSelect={() => setSelectedRequest(request)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {activeFilter !== 'submitted' && filteredRequests.length === 0 && (
          <BentoCard className="p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-white font-bold text-xl mb-3">
              {activeFilter === 'all' ? 'Заявок пока нет' : 'Заявки не найдены'}
            </h3>
            <p className="text-white/60 text-sm mb-4">
              {activeFilter === 'all' 
                ? 'Создайте свою первую заявку на получение социальных услуг'
                : `В категории "${activeFilter}" пока нет заявок`
              }
            </p>
            <button 
              onClick={() => setShowNewRequestForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium"
            >
              📝 Создать первую заявку
            </button>
          </BentoCard>
        )}

        {/* Selected Request Modal */}
        {selectedRequest && (
          <RequestModal
            request={selectedRequest}
            isOpen={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}

        {/* New Request Form Modal */}
        <NewRequestForm
          isOpen={showNewRequestForm}
          onClose={() => setShowNewRequestForm(false)}
        />
      </main>
    </div>
  );
}