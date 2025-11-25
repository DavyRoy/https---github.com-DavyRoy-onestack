'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface MedicalService {
  id: string;
  name: string;
  category: 'consultation' | 'diagnostic' | 'treatment' | 'surgery' | 'rehabilitation' | 'emergency' | 'preventive';
  description: string;
  status: 'active' | 'development' | 'paused' | 'closed';
  specialization: string[];
  duration: number;
  price: {
    amount: number;
    currency: 'RUB' | 'USD' | 'EUR';
    insuranceCovered: boolean;
    insurancePercentage?: number;
  };
  requirements: string[];
  preparations?: string[];
  risks?: string[];
  successRate: number;
  availability: {
    days: string[];
    hours: string;
    emergency: boolean;
  };
  equipment: string[];
  staffRequired: string[];
  metrics: {
    satisfaction: number;
    effectiveness: number;
    waitingTime: number;
  };
  popularity?: number;
  tags?: string[];
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  contact: {
    phone: string;
    email?: string;
    address: string;
    emergencyContact?: string;
  };
  insurance: {
    provider: string;
    number: string;
    validity: string;
    coverage: number;
  };
  medicalHistory: MedicalRecord[];
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  status: 'active' | 'inpatient' | 'discharged' | 'emergency';
  lastVisit?: string;
  nextAppointment?: string;
  avatar?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface MedicalRecord {
  id: string;
  date: string;
  serviceId: string;
  diagnosis?: string;
  symptoms: string[];
  treatment: string;
  prescribedMedications?: Medication[];
  doctor: string;
  notes?: string;
  followUp?: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string[];
  qualifications: string[];
  experience: number;
  license: string;
  contact: {
    phone: string;
    email: string;
  };
  schedule: {
    days: string[];
    hours: string;
  };
  status: 'active' | 'vacation' | 'sick' | 'off';
  currentPatients: string[];
  maxPatients: number;
  rating: number;
  languages: string[];
  procedures: string[];
  avatar?: string;
  department?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  room?: string;
  priority?: 'routine' | 'urgent' | 'emergency';
}

interface MedicalEquipment {
  id: string;
  name: string;
  type: 'diagnostic' | 'treatment' | 'surgical' | 'monitoring' | 'laboratory';
  manufacturer: string;
  model: string;
  status: 'operational' | 'maintenance' | 'out_of_service' | 'calibration';
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  utilization: number;
  warranty: {
    validUntil: string;
    provider: string;
  };
  specifications?: {
    power?: string;
    weight?: string;
    dimensions?: string;
  };
}

// Расширенные моки данных
const medicalServices: MedicalService[] = [
  {
    id: 'ms-001',
    name: 'Первичная консультация терапевта',
    category: 'consultation',
    description: 'Комплексный медицинский осмотр, сбор анамнеза, постановка предварительного диагноза с разработкой индивидуального плана лечения и рекомендациями по дальнейшему наблюдению',
    status: 'active',
    specialization: ['Терапия', 'Общая медицина'],
    duration: 30,
    price: {
      amount: 2500,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 80
    },
    requirements: ['Паспорт', 'Полис ОМС', 'Медицинская карта при наличии'],
    preparations: ['Не принимать пищу за 2 часа до приема', 'Избегать физических нагрузок'],
    successRate: 95,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '09:00-18:00',
      emergency: false
    },
    equipment: ['Стетоскоп', 'Тонометр', 'Термометр', 'Фонендоскоп'],
    staffRequired: ['Терапевт', 'Медсестра'],
    metrics: {
      satisfaction: 94,
      effectiveness: 92,
      waitingTime: 1
    },
    popularity: 95,
    tags: ['осмотр', 'диагностика', 'консультация']
  },
  {
    id: 'ms-002',
    name: 'УЗИ брюшной полости',
    category: 'diagnostic',
    description: 'Ультразвуковое исследование органов брюшной полости для диагностики заболеваний печени, желчного пузыря, поджелудочной железы, селезенки и почек с возможностью выявления патологий на ранних стадиях',
    status: 'active',
    specialization: ['Ультразвуковая диагностика', 'Гастроэнтерология'],
    duration: 45,
    price: {
      amount: 3500,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 70
    },
    requirements: ['Направление врача', 'Подготовка к исследованию', 'Результаты предыдущих исследований'],
    preparations: ['Голодание 8-12 часов', 'Очистительная клизма', 'Отказ от газообразующих продуктов'],
    risks: ['Ложноположительные результаты', 'Необходимость повторного исследования'],
    successRate: 98,
    availability: {
      days: ['Пн', 'Ср', 'Пт'],
      hours: '08:00-16:00',
      emergency: true
    },
    equipment: ['УЗИ аппарат экспертного класса', 'Датерминальный датчик', 'Система архивирования'],
    staffRequired: ['Врач УЗИ', 'Медсестра', 'Рентген-лаборант'],
    metrics: {
      satisfaction: 96,
      effectiveness: 97,
      waitingTime: 3
    },
    popularity: 88,
    tags: ['ультразвук', 'диагностика', 'брюшная полость']
  },
  {
    id: 'ms-003',
    name: 'Эндоскопия желудка',
    category: 'diagnostic',
    description: 'Эндоскопическое исследование желудка и двенадцатиперстной кишки для выявления патологий слизистой оболочки, взятия биопсии и проведения лечебных манипуляций под седацией',
    status: 'active',
    specialization: ['Гастроэнтерология', 'Эндоскопия'],
    duration: 60,
    price: {
      amount: 8500,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 50
    },
    requirements: ['Направление гастроэнтеролога', 'Анализы крови', 'ЭКГ', 'Консультация анестезиолога'],
    preparations: ['Голодание 12 часов', 'Отказ от курения', 'Отмена некоторых лекарств'],
    risks: ['Кровотечение', 'Перфорация', 'Реакция на анестезию'],
    successRate: 96,
    availability: {
      days: ['Вт', 'Чт'],
      hours: '09:00-14:00',
      emergency: false
    },
    equipment: ['Видеоэндоскоп', 'Монитор высокой четкости', 'Инструменты для биопсии', 'Аппарат для седации'],
    staffRequired: ['Эндоскопист', 'Анестезиолог', 'Медсестра', 'Санитар'],
    metrics: {
      satisfaction: 92,
      effectiveness: 95,
      waitingTime: 7
    },
    popularity: 76,
    tags: ['эндоскопия', 'желудок', 'биопсия']
  },
  {
    id: 'ms-004',
    name: 'Физиотерапия и реабилитация',
    category: 'rehabilitation',
    description: 'Комплекс реабилитационных процедур для восстановления после травм и операций, включающий электрофорез, магнитотерапию, лазерную терапию и индивидуальные занятия ЛФК',
    status: 'active',
    specialization: ['Физиотерапия', 'Реабилитология'],
    duration: 60,
    price: {
      amount: 2000,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 90
    },
    requirements: ['Направление врача', 'Индивидуальная программа реабилитации'],
    preparations: ['Удобная одежда', 'Отсутствие металлических имплантов'],
    successRate: 88,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-20:00',
      emergency: false
    },
    equipment: ['Аппарат УВЧ', 'Лазерный аппарат', 'Электростимулятор', 'Магнитотерапевтический комплекс'],
    staffRequired: ['Физиотерапевт', 'Реабилитолог', 'Инструктор ЛФК'],
    metrics: {
      satisfaction: 91,
      effectiveness: 85,
      waitingTime: 2
    },
    popularity: 82,
    tags: ['реабилитация', 'физиотерапия', 'восстановление']
  },
  {
    id: 'ms-005',
    name: 'Экстренная помощь',
    category: 'emergency',
    description: 'Неотложная медицинская помощь при острых состояниях и травмах, включающая реанимационные мероприятия, диагностику и стабилизацию состояния пациента',
    status: 'active',
    specialization: ['Неотложная помощь', 'Травматология', 'Реаниматология'],
    duration: 0,
    price: {
      amount: 0,
      currency: 'RUB',
      insuranceCovered: true
    },
    requirements: ['Экстренный случай'],
    risks: ['Нестабильное состояние', 'Необходимость срочного вмешательства'],
    successRate: 99,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      hours: '24/7',
      emergency: true
    },
    equipment: ['Дефибриллятор', 'Кислородный аппарат', 'Шприцы', 'Перевязочные материалы', 'ЭКГ аппарат'],
    staffRequired: ['Дежурный врач', 'Медсестра', 'Санитар', 'Реаниматолог'],
    metrics: {
      satisfaction: 95,
      effectiveness: 98,
      waitingTime: 0
    },
    popularity: 65,
    tags: ['экстренная', 'неотложная', 'травмы']
  },
  {
    id: 'ms-006',
    name: 'Кардиологическое обследование',
    category: 'diagnostic',
    description: 'Комплексное обследование сердечно-сосудистой системы с ЭКГ, холтеровским мониторированием, консультацией кардиолога и разработкой индивидуальной программы лечения',
    status: 'development',
    specialization: ['Кардиология', 'Диагностика'],
    duration: 90,
    price: {
      amount: 12000,
      currency: 'RUB',
      insuranceCovered: false
    },
    requirements: ['Направление терапевта', 'Предыдущие ЭКГ при наличии'],
    preparations: ['Отсутствие физических нагрузок за 24 часа', 'Отказ от кофеина'],
    successRate: 0,
    availability: {
      days: ['Пн', 'Ср'],
      hours: '10:00-15:00',
      emergency: false
    },
    equipment: ['ЭКГ аппарат', 'Холтер', 'Велоэргометр', 'Система суточного мониторинга'],
    staffRequired: ['Кардиолог', 'Медсестра функциональной диагностики'],
    metrics: {
      satisfaction: 0,
      effectiveness: 0,
      waitingTime: 14
    },
    popularity: 45,
    tags: ['кардиология', 'ЭКГ', 'холтер']
  },
  {
    id: 'ms-007',
    name: 'Стоматологический осмотр',
    category: 'consultation',
    description: 'Комплексный осмотр полости рта, диагностика кариеса и заболеваний десен, оценка гигиены полости рта и разработка индивидуального плана лечения',
    status: 'active',
    specialization: ['Стоматология', 'Терапевтическая стоматология'],
    duration: 45,
    price: {
      amount: 1500,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 50
    },
    requirements: ['Паспорт', 'Полис ОМС'],
    preparations: ['Гигиена полости рта', 'Отказ от пищи за 1 час'],
    successRate: 98,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '09:00-19:00',
      emergency: true
    },
    equipment: ['Стоматологическое кресло', 'Рентген аппарат', 'Скалер', 'Стоматологический микроскоп'],
    staffRequired: ['Стоматолог', 'Медсестра', 'Ассистент стоматолога'],
    metrics: {
      satisfaction: 96,
      effectiveness: 95,
      waitingTime: 2
    },
    popularity: 91,
    tags: ['стоматология', 'осмотр', 'кариес']
  },
  {
    id: 'ms-008',
    name: 'МРТ головного мозга',
    category: 'diagnostic',
    description: 'Магнитно-резонансная томография для детального исследования структур головного мозга с возможностью контрастного усиления и 3D-реконструкцией изображений',
    status: 'active',
    specialization: ['Неврология', 'Диагностика'],
    duration: 90,
    price: {
      amount: 12000,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 60
    },
    requirements: ['Направление невролога', 'Отсутствие металлических имплантов'],
    preparations: ['Не принимать пищу за 4 часа до исследования', 'Снять все металлические предметы'],
    risks: ['Клаустрофобия', 'Реакция на контраст'],
    successRate: 99,
    availability: {
      days: ['Пн', 'Ср', 'Пт'],
      hours: '08:00-20:00',
      emergency: false
    },
    equipment: ['МРТ аппарат 3Т', 'Мониторы', 'Контрастное вещество', 'Система обработки изображений'],
    staffRequired: ['Врач МРТ', 'Рентген-лаборант', 'Медсестра'],
    metrics: {
      satisfaction: 97,
      effectiveness: 98,
      waitingTime: 14
    },
    popularity: 79,
    tags: ['МРТ', 'головной мозг', 'неврология']
  },
  {
    id: 'ms-009',
    name: 'Дерматологическая консультация',
    category: 'consultation',
    description: 'Осмотр кожных покровов, диагностика заболеваний кожи, волос и ногтей, проведение дерматоскопии и назначение комплексного лечения',
    status: 'active',
    specialization: ['Дерматология', 'Косметология'],
    duration: 40,
    price: {
      amount: 2800,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 70
    },
    requirements: ['Паспорт', 'Полис ОМС'],
    preparations: ['Не наносить косметику на область осмотра'],
    successRate: 94,
    availability: {
      days: ['Вт', 'Чт', 'Сб'],
      hours: '10:00-18:00',
      emergency: false
    },
    equipment: ['Дерматоскоп', 'Лупа', 'Фотоаппарат для документации'],
    staffRequired: ['Дерматолог', 'Медсестра'],
    metrics: {
      satisfaction: 93,
      effectiveness: 90,
      waitingTime: 3
    },
    popularity: 72,
    tags: ['дерматология', 'кожа', 'диагностика']
  },
  {
    id: 'ms-010',
    name: 'Лабораторные исследования',
    category: 'diagnostic',
    description: 'Комплекс лабораторных исследований крови, мочи и других биологических материалов с использованием современного автоматизированного оборудования',
    status: 'active',
    specialization: ['Лабораторная диагностика'],
    duration: 30,
    price: {
      amount: 5000,
      currency: 'RUB',
      insuranceCovered: true,
      insurancePercentage: 85
    },
    requirements: ['Направление врача'],
    preparations: ['Голодание 8-12 часов для биохимии'],
    successRate: 99,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '07:00-12:00',
      emergency: true
    },
    equipment: ['Биохимический анализатор', 'Гематологический анализатор', 'Микроскоп', 'Центрифуга'],
    staffRequired: ['Врач-лаборант', 'Медицинский технолог', 'Лаборант'],
    metrics: {
      satisfaction: 96,
      effectiveness: 99,
      waitingTime: 1
    },
    popularity: 96,
    tags: ['лаборатория', 'анализы', 'диагностика']
  }
];

const patients: Patient[] = [
  {
    id: 'p-001',
    name: 'Иванов Сергей Петрович',
    age: 45,
    gender: 'male',
    bloodType: 'A+',
    contact: {
      phone: '+7 (916) 123-45-67',
      email: 's.ivanov@mail.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      emergencyContact: '+7 (925) 234-56-78 (супруга)'
    },
    insurance: {
      provider: 'СОГАЗ',
      number: 'СГЗ-123456789',
      validity: '2024-12-31',
      coverage: 90
    },
    medicalHistory: [
      {
        id: 'mh-001',
        date: '2024-05-15',
        serviceId: 'ms-001',
        diagnosis: 'Гипертоническая болезнь I стадии',
        symptoms: ['Головная боль', 'Повышенное давление', 'Шум в ушах'],
        treatment: 'Медикаментозная терапия, диета, контроль давления',
        prescribedMedications: [
          {
            name: 'Эналаприл',
            dosage: '5 мг',
            frequency: '2 раза в день',
            duration: '30 дней',
            instructions: 'Принимать утром и вечером до еды'
          },
          {
            name: 'Аспирин Кардио',
            dosage: '100 мг',
            frequency: '1 раз в день',
            duration: 'постоянно',
            instructions: 'Принимать утром после еды'
          }
        ],
        doctor: 'd-001',
        status: 'completed',
        followUp: '2024-07-15',
        notes: 'Пациенту рекомендовано снижение веса и увеличение физической активности'
      }
    ],
    allergies: ['Пенициллин', 'Аспирин'],
    chronicConditions: ['Артериальная гипертензия', 'Ожирение I степени'],
    currentMedications: ['Эналаприл', 'Аспирин Кардио'],
    status: 'active',
    lastVisit: '2024-05-15',
    nextAppointment: '2024-07-15',
    priority: 'medium'
  },
  {
    id: 'p-002',
    name: 'Петрова Анна Владимировна',
    age: 32,
    gender: 'female',
    bloodType: 'O+',
    contact: {
      phone: '+7 (925) 345-67-89',
      email: 'a.petrova@gmail.com',
      address: 'г. Москва, пр. Мира, д. 125, кв. 12',
      emergencyContact: '+7 (916) 456-78-90 (мать)'
    },
    insurance: {
      provider: 'АльфаСтрахование',
      number: 'АС-987654321',
      validity: '2024-10-31',
      coverage: 85
    },
    medicalHistory: [
      {
        id: 'mh-002',
        date: '2024-06-10',
        serviceId: 'ms-002',
        symptoms: ['Боли в животе', 'Тошнота', 'Вздутие'],
        treatment: 'УЗИ диагностика, рекомендации по питанию, ферментные препараты',
        prescribedMedications: [
          {
            name: 'Мезим',
            dosage: '10000 ЕД',
            frequency: '3 раза в день',
            duration: '14 дней',
            instructions: 'Принимать во время еды'
          }
        ],
        doctor: 'd-003',
        status: 'completed',
        notes: 'Патологий не выявлено, рекомендована диета №5'
      },
      {
        id: 'mh-005',
        date: '2024-03-15',
        serviceId: 'ms-007',
        diagnosis: 'Кариес',
        symptoms: ['Боль при приеме сладкого'],
        treatment: 'Пломбирование',
        doctor: 'd-005',
        status: 'completed',
        followUp: '2024-09-15'
      }
    ],
    allergies: ['Йод'],
    chronicConditions: ['Хронический гастрит'],
    currentMedications: ['Мезим'],
    status: 'active',
    lastVisit: '2024-06-10',
    nextAppointment: '2024-09-15',
    priority: 'low'
  },
  {
    id: 'p-003',
    name: 'Сидоров Дмитрий Николаевич',
    age: 68,
    gender: 'male',
    bloodType: 'B-',
    contact: {
      phone: '+7 (916) 456-78-90',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 45',
      emergencyContact: '+7 (925) 567-89-01 (сын)'
    },
    insurance: {
      provider: 'РЕСО-Гарантия',
      number: 'РГ-456789123',
      validity: '2024-09-30',
      coverage: 95
    },
    medicalHistory: [
      {
        id: 'mh-003',
        date: '2024-06-18',
        serviceId: 'ms-004',
        diagnosis: 'Реабилитация после эндопротезирования тазобедренного сустава',
        symptoms: ['Ограничение подвижности', 'Болевой синдром', 'Отечность'],
        treatment: 'Физиотерапия, ЛФК, массаж',
        prescribedMedications: [
          {
            name: 'Лозартан',
            dosage: '50 мг',
            frequency: '1 раз в день',
            duration: 'постоянно',
            instructions: 'Принимать утром'
          },
          {
            name: 'Парацетамол',
            dosage: '500 мг',
            frequency: 'при необходимости',
            duration: '7 дней',
            instructions: 'Принимать при болях, не более 4 раз в сутки'
          }
        ],
        doctor: 'd-004',
        status: 'in_progress',
        followUp: '2024-06-25',
        notes: 'Положительная динамика, увеличивается объем движений'
      }
    ],
    allergies: [],
    chronicConditions: ['Остеоартроз', 'Гипертоническая болезнь', 'Сахарный диабет 2 типа'],
    currentMedications: ['Лозартан', 'Метформин', 'Парацетамол'],
    status: 'inpatient',
    lastVisit: '2024-06-18',
    priority: 'high'
  },
  {
    id: 'p-004',
    name: 'Козлова Елена Викторовна',
    age: 28,
    gender: 'female',
    bloodType: 'A+',
    contact: {
      phone: '+7 (495) 567-89-01',
      email: 'e.kozlova@mail.ru',
      address: 'г. Москва, ул. Гагарина, д. 34, кв. 78',
      emergencyContact: '+7 (916) 678-90-12 (муж)'
    },
    insurance: {
      provider: 'Ингосстрах',
      number: 'ИН-321654987',
      validity: '2024-11-30',
      coverage: 80
    },
    medicalHistory: [],
    allergies: ['Антибиотики тетрациклинового ряда'],
    status: 'active',
    priority: 'low'
  },
  {
    id: 'p-005',
    name: 'Николаева Ольга Сергеевна',
    age: 29,
    gender: 'female',
    bloodType: 'AB+',
    contact: {
      phone: '+7 (916) 789-01-23',
      email: 'o.nikolaeva@gmail.com',
      address: 'г. Москва, ул. Тверская, д. 25, кв. 67',
      emergencyContact: '+7 (925) 890-12-34 (сестра)'
    },
    insurance: {
      provider: 'ВТБ Страхование',
      number: 'ВТБ-555666777',
      validity: '2024-08-31',
      coverage: 85
    },
    medicalHistory: [
      {
        id: 'mh-004',
        date: '2024-06-12',
        serviceId: 'ms-007',
        diagnosis: 'Кариес средней степени',
        symptoms: ['Боль при приеме сладкого', 'Потемнение зуба', 'Чувствительность'],
        treatment: 'Пломбирование композитным материалом, реминерализующая терапия',
        prescribedMedications: [
          {
            name: 'Кальций Д3 Никомед',
            dosage: '1 таблетка',
            frequency: '2 раза в день',
            duration: '30 дней',
            instructions: 'Разжевывать после еды'
          }
        ],
        doctor: 'd-005',
        status: 'completed',
        followUp: '2024-12-12',
        notes: 'Качественное пломбирование, рекомендации по гигиене'
      }
    ],
    allergies: ['Латекс'],
    chronicConditions: [],
    currentMedications: ['Кальций Д3 Никомед'],
    status: 'active',
    lastVisit: '2024-06-12',
    nextAppointment: '2024-12-12',
    priority: 'low'
  },
  {
    id: 'p-006',
    name: 'Волков Андрей Игоревич',
    age: 55,
    gender: 'male',
    bloodType: 'O-',
    contact: {
      phone: '+7 (916) 901-23-45',
      email: 'a.volkov@mail.ru',
      address: 'г. Москва, ул. Чехова, д. 12, кв. 89',
      emergencyContact: '+7 (925) 012-34-56 (жена)'
    },
    insurance: {
      provider: 'СОГАЗ',
      number: 'СГЗ-987654321',
      validity: '2024-12-31',
      coverage: 90
    },
    medicalHistory: [
      {
        id: 'mh-006',
        date: '2024-06-20',
        serviceId: 'ms-008',
        diagnosis: 'Дисциркуляторная энцефалопатия',
        symptoms: ['Головокружение', 'Шум в ушах', 'Нарушение памяти'],
        treatment: 'Сосудистая терапия, ноотропные препараты',
        prescribedMedications: [
          {
            name: 'Винпоцетин',
            dosage: '5 мг',
            frequency: '3 раза в день',
            duration: '60 дней',
            instructions: 'Принимать после еды'
          },
          {
            name: 'Пирацетам',
            dosage: '400 мг',
            frequency: '2 раза в день',
            duration: '60 дней',
            instructions: 'Принимать утром и вечером'
          }
        ],
        doctor: 'd-001',
        status: 'in_progress',
        followUp: '2024-08-20'
      }
    ],
    allergies: [],
    chronicConditions: ['Артериальная гипертензия', 'Атеросклероз'],
    currentMedications: ['Винпоцетин', 'Пирацетам', 'Амлодипин'],
    status: 'active',
    lastVisit: '2024-06-20',
    nextAppointment: '2024-08-20',
    priority: 'medium'
  }
];

const doctors: Doctor[] = [
  {
    id: 'd-001',
    name: 'Смирнов Алексей Викторович',
    specialization: ['Терапия', 'Кардиология'],
    qualifications: ['Кандидат медицинских наук', 'Врач высшей категории', 'Сертификат по кардиологии'],
    experience: 15,
    license: 'ЛО-77-01-012345',
    contact: {
      phone: '+7 (916) 111-22-33',
      email: 'a.smirnov@clinic.ru'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт'],
      hours: '09:00-17:00'
    },
    status: 'active',
    currentPatients: ['p-001', 'p-005', 'p-006'],
    maxPatients: 25,
    rating: 4.9,
    languages: ['Русский', 'Английский'],
    procedures: ['Консультации', 'Диагностика', 'Назначение лечения', 'ЭКГ'],
    department: 'Терапевтическое отделение'
  },
  {
    id: 'd-002',
    name: 'Петрова Мария Сергеевна',
    specialization: ['Ультразвуковая диагностика', 'Гастроэнтерология'],
    qualifications: ['Врач ультразвуковой диагностики', 'Сертификат по эндоскопии', 'Врач первой категории'],
    experience: 8,
    license: 'ЛО-77-01-012346',
    contact: {
      phone: '+7 (925) 222-33-44',
      email: 'm.petrova@clinic.ru'
    },
    schedule: {
      days: ['Пн', 'Ср', 'Пт'],
      hours: '08:00-16:00'
    },
    status: 'active',
    currentPatients: ['p-002'],
    maxPatients: 15,
    rating: 4.8,
    languages: ['Русский'],
    procedures: ['УЗИ исследования', 'Эндоскопия', 'Биопсия'],
    department: 'Отделение диагностики'
  },
  {
    id: 'd-003',
    name: 'Ковалев Дмитрий Игоревич',
    specialization: ['Хирургия', 'Травматология'],
    qualifications: ['Доктор медицинских наук', 'Хирург высшей категории', 'Член ассоциации хирургов России'],
    experience: 20,
    license: 'ЛО-77-01-012347',
    contact: {
      phone: '+7 (916) 333-44-55',
      email: 'd.kovalev@clinic.ru'
    },
    schedule: {
      days: ['Вт', 'Чт', 'Сб'],
      hours: '10:00-18:00'
    },
    status: 'vacation',
    currentPatients: [],
    maxPatients: 20,
    rating: 4.9,
    languages: ['Русский', 'Немецкий'],
    procedures: ['Оперативные вмешательства', 'Экстренная помощь', 'Артроскопия'],
    department: 'Хирургическое отделение'
  },
  {
    id: 'd-004',
    name: 'Иванова Ольга Дмитриевна',
    specialization: ['Физиотерапия', 'Реабилитология'],
    qualifications: ['Врач-физиотерапевт', 'Реабилитолог', 'Сертификат по мануальной терапии'],
    experience: 12,
    license: 'ЛО-77-01-012348',
    contact: {
      phone: '+7 (925) 444-55-66',
      email: 'o.ivanova@clinic.ru'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-20:00'
    },
    status: 'active',
    currentPatients: ['p-003'],
    maxPatients: 30,
    rating: 4.7,
    languages: ['Русский'],
    procedures: ['Физиотерапия', 'ЛФК', 'Реабилитационные программы', 'Массаж'],
    department: 'Отделение реабилитации'
  },
  {
    id: 'd-005',
    name: 'Семенова Екатерина Владимировна',
    specialization: ['Стоматология', 'Ортодонтия'],
    qualifications: ['Врач-стоматолог высшей категории', 'Сертификат по ортодонтии', 'Сертификат по эстетической стоматологии'],
    experience: 10,
    license: 'ЛО-77-01-012349',
    contact: {
      phone: '+7 (925) 555-66-77',
      email: 'e.semenova@clinic.ru'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Чт', 'Пт'],
      hours: '09:00-18:00'
    },
    status: 'active',
    currentPatients: ['p-005'],
    maxPatients: 20,
    rating: 4.8,
    languages: ['Русский', 'Французский'],
    procedures: ['Лечение кариеса', 'Отбеливание', 'Установка брекетов', 'Протезирование'],
    department: 'Стоматологическое отделение'
  },
  {
    id: 'd-006',
    name: 'Федоров Иван Сергеевич',
    specialization: ['Неврология', 'Реабилитология'],
    qualifications: ['Кандидат медицинских наук', 'Невролог высшей категории', 'Сертификат по иглорефлексотерапии'],
    experience: 18,
    license: 'ЛО-77-01-012350',
    contact: {
      phone: '+7 (916) 666-77-88',
      email: 'i.fedorov@clinic.ru'
    },
    schedule: {
      days: ['Пн', 'Ср', 'Пт'],
      hours: '09:00-16:00'
    },
    status: 'active',
    currentPatients: ['p-006'],
    maxPatients: 22,
    rating: 4.8,
    languages: ['Русский', 'Английский'],
    procedures: ['Неврологический осмотр', 'Блокады', 'Реабилитация', 'Иглорефлексотерапия'],
    department: 'Неврологическое отделение'
  }
];

const appointments: Appointment[] = [
  {
    id: 'app-001',
    patientId: 'p-001',
    doctorId: 'd-001',
    serviceId: 'ms-001',
    date: '2024-07-15',
    time: '10:00',
    duration: 30,
    status: 'scheduled',
    reason: 'Плановый осмотр, контроль артериального давления, коррекция терапии',
    notes: 'Пациенту принести дневник давления',
    room: 'Кабинет 201',
    priority: 'routine'
  },
  {
    id: 'app-002',
    patientId: 'p-002',
    doctorId: 'd-002',
    serviceId: 'ms-002',
    date: '2024-06-25',
    time: '14:30',
    duration: 45,
    status: 'confirmed',
    reason: 'Повторное УЗИ брюшной полости для контроля динамики',
    notes: 'Подготовка к исследованию соблюдена',
    room: 'Кабинет УЗИ 105',
    priority: 'routine'
  },
  {
    id: 'app-003',
    patientId: 'p-004',
    doctorId: 'd-001',
    serviceId: 'ms-001',
    date: '2024-06-20',
    time: '11:15',
    duration: 30,
    status: 'scheduled',
    reason: 'Первичный прием, общее обследование, оформление медицинской карты',
    room: 'Кабинет 201',
    priority: 'routine'
  },
  {
    id: 'app-004',
    patientId: 'p-005',
    doctorId: 'd-005',
    serviceId: 'ms-007',
    date: '2024-12-12',
    time: '11:00',
    duration: 30,
    status: 'scheduled',
    reason: 'Плановый осмотр после лечения, контроль гигиены полости рта',
    room: 'Кабинет 305',
    priority: 'routine'
  },
  {
    id: 'app-005',
    patientId: 'p-003',
    doctorId: 'd-004',
    serviceId: 'ms-004',
    date: '2024-06-25',
    time: '09:00',
    duration: 60,
    status: 'confirmed',
    reason: 'Очередной сеанс физиотерапии, контроль динамики восстановления',
    notes: 'Принести снимки ЭПТС',
    room: 'Кабинет физиотерапии 401',
    priority: 'urgent'
  },
  {
    id: 'app-006',
    patientId: 'p-006',
    doctorId: 'd-006',
    serviceId: 'ms-001',
    date: '2024-08-20',
    time: '14:00',
    duration: 40,
    status: 'scheduled',
    reason: 'Повторная консультация, оценка эффективности лечения, коррекция терапии',
    room: 'Кабинет 208',
    priority: 'routine'
  }
];

const equipment: MedicalEquipment[] = [
  {
    id: 'eq-001',
    name: 'УЗИ аппарат Mindray DC-70',
    type: 'diagnostic',
    manufacturer: 'Mindray',
    model: 'DC-70',
    status: 'operational',
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-08-15',
    location: 'Кабинет УЗИ 105',
    utilization: 85,
    warranty: {
      validUntil: '2026-05-15',
      provider: 'Mindray Russia'
    },
    specifications: {
      power: '100-240V, 50/60Hz',
      weight: '85 кг',
      dimensions: '110×65×130 см'
    }
  },
  {
    id: 'eq-002',
    name: 'Эндоскопическая система Olympus',
    type: 'diagnostic',
    manufacturer: 'Olympus',
    model: 'EVIS EXERA III',
    status: 'maintenance',
    lastMaintenance: '2024-04-10',
    nextMaintenance: '2024-07-10',
    location: 'Эндоскопический кабинет 203',
    utilization: 75,
    warranty: {
      validUntil: '2025-04-10',
      provider: 'Olympus Europa'
    },
    specifications: {
      power: '100-240V, 50/60Hz',
      weight: '45 кг',
      dimensions: '60×45×120 см'
    }
  },
  {
    id: 'eq-003',
    name: 'Дефибриллятор Philips',
    type: 'emergency',
    manufacturer: 'Philips',
    model: 'HeartStart XL',
    status: 'operational',
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-09-01',
    location: 'Реанимация',
    utilization: 5,
    warranty: {
      validUntil: '2025-12-01',
      provider: 'Philips Healthcare'
    },
    specifications: {
      power: 'Батарея/сеть',
      weight: '8.5 кг',
      dimensions: '35×30×25 см'
    }
  },
  {
    id: 'eq-004',
    name: 'Аппарат УВЧ терапии',
    type: 'treatment',
    manufacturer: 'УЗТ-1',
    model: 'УВЧ-30',
    status: 'operational',
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-08-20',
    location: 'Физиотерапевтический кабинет 301',
    utilization: 65,
    warranty: {
      validUntil: '2025-05-20',
      provider: 'УЗТ-1'
    },
    specifications: {
      power: '220V, 50Hz',
      weight: '25 кг',
      dimensions: '50×40×80 см'
    }
  },
  {
    id: 'eq-005',
    name: 'МРТ аппарат Siemens',
    type: 'diagnostic',
    manufacturer: 'Siemens',
    model: 'Magnetom Spectra 3T',
    status: 'operational',
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-11-20',
    location: 'Кабинет МРТ 401',
    utilization: 78,
    warranty: {
      validUntil: '2027-05-20',
      provider: 'Siemens Healthineers'
    },
    specifications: {
      power: '400V, 50Hz',
      weight: '4500 кг',
      dimensions: '250×200×200 см'
    }
  },
  {
    id: 'eq-006',
    name: 'Анализатор биохимический',
    type: 'laboratory',
    manufacturer: 'Abbott',
    model: 'Architect c8000',
    status: 'operational',
    lastMaintenance: '2024-06-10',
    nextMaintenance: '2024-09-10',
    location: 'Лаборатория 501',
    utilization: 92,
    warranty: {
      validUntil: '2026-06-10',
      provider: 'Abbott Laboratories'
    },
    specifications: {
      power: '100-240V, 50/60Hz',
      weight: '180 кг',
      dimensions: '120×80×120 см'
    }
  }
];

// Константы
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-purple-900 via-slate-950 to-blue-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  blue: '59, 130, 246',
  emerald: '16, 185, 129',
  orange: '249, 115, 22',
  teal: '20, 184, 166',
  indigo: '99, 102, 241',
  rose: '244, 63, 94',
  cyan: '34, 211, 238',
  amber: '245, 158, 11',
  slate: '100, 116, 139'
} as const;

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

// Modal Component
const Modal = ({ isOpen, onClose, children, title, size = 'md' }: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="border-b border-slate-700/50 p-6 bg-slate-800/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компоненты
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue, 
  onClick,
  hoverable = true,
  padding = 'p-6'
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
}) => (
  <motion.div
    className={`
      relative overflow-hidden 
      rounded-3xl border border-slate-700/50
      bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl
      transition-all duration-500
      w-full max-w-full
      group
      ${hoverable ? 'hover:border-slate-600/70 hover:shadow-2xl' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${padding}
      ${className}
    `}
    style={{
      backgroundImage: `
        radial-gradient(280px circle at 50% 50%, rgba(${glowColor},0.15), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
      `
    }}
    whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
  >
    {/* Enhanced glow effect */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: `radial-gradient(500px circle at 50% 50%, rgba(${glowColor},0.12), transparent 50%)`
      }}
    />
    
    <div className="relative z-10 h-full">
      {children}
    </div>

    {/* Improved shine effect */}
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
      <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
    </div>
  </motion.div>
);

const StatusBadge = ({ status, type = 'default', animated = false }: { 
  status: string; 
  type?: 'default' | 'service' | 'patient' | 'doctor' | 'appointment' | 'equipment';
  animated?: boolean;
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'development':
        return { color: COLORS.blue, label: 'В разработке', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'paused':
        return { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'closed':
        return { color: COLORS.error, label: 'Закрыт', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'inpatient':
        return { color: COLORS.orange, label: 'Стационар', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'discharged':
        return { color: COLORS.success, label: 'Выписан', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'emergency':
        return { color: COLORS.rose, label: 'Экстренный', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'vacation':
        return { color: COLORS.purple, label: 'Отпуск', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'sick':
        return { color: COLORS.rose, label: 'Больничный', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'off':
        return { color: COLORS.slate, label: 'Не на смене', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'scheduled':
        return { color: COLORS.blue, label: 'Запланирован', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'confirmed':
        return { color: COLORS.teal, label: 'Подтвержден', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'in_progress':
        return { color: COLORS.orange, label: 'В процессе', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'completed':
        return { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'cancelled':
        return { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'no_show':
        return { color: COLORS.warning, label: 'Не явился', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'operational':
        return { color: COLORS.success, label: 'Рабочее', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'maintenance':
        return { color: COLORS.warning, label: 'Обслуживание', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'out_of_service':
        return { color: COLORS.error, label: 'Не работает', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'calibration':
        return { color: COLORS.blue, label: 'Калибровка', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'consultation':
        return { color: COLORS.blue, label: 'Консультация', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'diagnostic':
        return { color: COLORS.purple, label: 'Диагностика', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'treatment':
        return { color: COLORS.emerald, label: 'Лечение', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'surgery':
        return { color: COLORS.rose, label: 'Хирургия', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'rehabilitation':
        return { color: COLORS.teal, label: 'Реабилитация', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'preventive':
        return { color: COLORS.cyan, label: 'Профилактика', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'low':
        return { color: COLORS.success, label: 'Низкий', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'medium':
        return { color: COLORS.warning, label: 'Средний', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'high':
        return { color: COLORS.orange, label: 'Высокий', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'critical':
        return { color: COLORS.rose, label: 'Критический', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'routine':
        return { color: COLORS.success, label: 'Плановый', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'urgent':
        return { color: COLORS.orange, label: 'Срочный', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      default:
        return { color: COLORS.slate, label: status, bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.span 
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${config.bg} ${config.border}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {animated && (
        <motion.div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {!animated && (
        <div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
        />
      )}
      {config.label}
    </motion.span>
  );
};

const ProgressBar = ({ value, max = 100, color = COLORS.blue, label, showValue = true, size = 'md' }: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span>{label}</span>
          {showValue && <span className="font-semibold">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, color = COLORS.blue, subtitle, onClick, trend }: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  return (
    <BentoCard 
      className="p-6" 
      glowColor={color} 
      onClick={onClick}
      padding="p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl p-3 rounded-2xl bg-white/5 backdrop-blur-sm">{icon}</div>
        {trendConfig !== 'neutral' && (
          <div 
            className={`text-sm font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </div>
        )}
      </div>
      <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

const ServiceCard = ({ service, onClick }: { service: MedicalService; onClick?: () => void }) => {
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'consultation': return COLORS.blue;
      case 'diagnostic': return COLORS.purple;
      case 'treatment': return COLORS.emerald;
      case 'surgery': return COLORS.rose;
      case 'rehabilitation': return COLORS.teal;
      case 'emergency': return COLORS.orange;
      case 'preventive': return COLORS.cyan;
      default: return COLORS.slate;
    }
  };

  const getPriceDisplay = (price: MedicalService['price']) => {
    if (price.amount === 0) return 'Бесплатно (по ОМС)';
    return price.insuranceCovered 
      ? `${formatCurrency(price.amount)} (ОМС: ${price.insurancePercentage}%)`
      : formatCurrency(price.amount);
  };

  return (
    <BentoCard className="p-5" glowColor={getServiceColor(service.category)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{service.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">{service.specialization.join(', ')}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={service.category} />
          <StatusBadge status={service.status} animated={service.status === 'active'} />
        </div>
      </div>
      
      <div className="space-y-4 mb-5">
        <div className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {service.description}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Длительность</span>
            <p className="text-white font-medium">{service.duration} мин</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Успешность</span>
            <p className="text-white font-medium">{service.successRate}%</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Стоимость</span>
            <p className="text-white font-medium text-xs leading-tight">{getPriceDisplay(service.price)}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Ожидание</span>
            <p className="text-white font-medium">{service.metrics.waitingTime} дн.</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Доступность:</span>
          <span className="text-white font-medium text-right text-xs">
            {service.availability.days.join(', ')}<br/>{service.availability.hours}
          </span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Записаться
        </button>
      </div>
    </BentoCard>
  );
};

const PatientCard = ({ patient, onClick }: { patient: Patient; onClick?: () => void }) => {
  const getPatientColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'inpatient': return COLORS.orange;
      case 'discharged': return COLORS.teal;
      case 'emergency': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getPatientColor(patient.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{patient.name}</h4>
          <p className="text-slate-400 text-sm">
            {patient.age} лет • {patient.gender === 'male' ? 'Мужчина' : 'Женщина'}
            {patient.bloodType && ` • ${patient.bloodType}`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={patient.status} type="patient" animated={patient.status === 'active'} />
          {patient.priority && <StatusBadge status={patient.priority} />}
        </div>
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Телефон:</span>
          <span className="text-white font-medium">{patient.contact.phone}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Страховка:</span>
          <span className="text-white font-medium text-right text-xs">{patient.insurance.provider}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Покрытие:</span>
          <span className="text-white font-medium">{patient.insurance.coverage}%</span>
        </div>

        {patient.lastVisit && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Последний визит:</span>
            <span className="text-white font-medium text-xs">
              {new Date(patient.lastVisit).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Карта
        </button>
        <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Запись
        </button>
      </div>
    </BentoCard>
  );
};

const DoctorCard = ({ doctor, onClick }: { doctor: Doctor; onClick?: () => void }) => {
  const utilization = (doctor.currentPatients.length / doctor.maxPatients) * 100;
  
  const getDoctorColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'vacation': return COLORS.purple;
      case 'sick': return COLORS.rose;
      case 'off': return COLORS.slate;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getDoctorColor(doctor.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{doctor.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">{doctor.specialization.join(', ')}</p>
        </div>
        <StatusBadge status={doctor.status} type="doctor" animated={doctor.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Опыт:</span>
          <span className="text-white font-medium">{doctor.experience} лет</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <span className="text-white font-medium">{doctor.rating}/5.0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Пациенты:</span>
          <span className="text-white font-medium">{doctor.currentPatients.length}/{doctor.maxPatients}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-slate-400">Расписание:</span>
          <span className="text-white font-medium text-right text-xs">
            {doctor.schedule.days.join(', ')}<br/>{doctor.schedule.hours}
          </span>
        </div>
      </div>
      
      <ProgressBar 
        value={utilization} 
        label={`Загрузка врача`}
        color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
        showValue={false}
      />
    </BentoCard>
  );
};

const EquipmentCard = ({ equipment, onClick }: { equipment: MedicalEquipment; onClick?: () => void }) => {
  const getEquipmentColor = (type: string) => {
    switch (type) {
      case 'diagnostic': return COLORS.purple;
      case 'treatment': return COLORS.emerald;
      case 'surgical': return COLORS.rose;
      case 'monitoring': return COLORS.blue;
      case 'laboratory': return COLORS.orange;
      default: return COLORS.slate;
    }
  };

  const isMaintenanceDue = new Date(equipment.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <BentoCard className="p-5" glowColor={getEquipmentColor(equipment.type)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{equipment.name}</h4>
          <p className="text-slate-400 text-sm">{equipment.manufacturer} {equipment.model}</p>
        </div>
        <StatusBadge status={equipment.status} type="equipment" animated={equipment.status === 'operational'} />
      </div>
      
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Тип</span>
            <p className="text-white font-medium">
              {equipment.type === 'diagnostic' && 'Диагностическое'}
              {equipment.type === 'treatment' && 'Лечебное'}
              {equipment.type === 'surgical' && 'Хирургическое'}
              {equipment.type === 'monitoring' && 'Мониторинг'}
              {equipment.type === 'laboratory' && 'Лабораторное'}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Использование</span>
            <p className="text-white font-medium">{equipment.utilization}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Местоположение</span>
            <p className="text-white font-medium text-xs">{equipment.location}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">След. ТО</span>
            <p className="text-white font-medium text-xs">{new Date(equipment.nextMaintenance).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <ProgressBar 
          value={equipment.utilization} 
          label={`Использование оборудования`}
          color={equipment.utilization > 90 ? COLORS.rose : equipment.utilization > 75 ? COLORS.orange : COLORS.success}
          showValue={false}
        />
      </div>
      
      {isMaintenanceDue && equipment.status === 'operational' && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-yellow-300 text-xs text-center font-medium">Требуется плановое ТО</p>
        </div>
      )}
    </BentoCard>
  );
};

const AppointmentCard = ({ appointment, onClick }: { appointment: Appointment; onClick?: () => void }) => {
  const patient = patients.find(p => p.id === appointment.patientId);
  const doctor = doctors.find(d => d.id === appointment.doctorId);
  const service = medicalServices.find(s => s.id === appointment.serviceId);

  const getAppointmentColor = (status: string) => {
    switch (status) {
      case 'scheduled': return COLORS.blue;
      case 'confirmed': return COLORS.teal;
      case 'in_progress': return COLORS.orange;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      case 'no_show': return COLORS.warning;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getAppointmentColor(appointment.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">
            {service?.name || 'Услуга'}
          </h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {patient?.name} • {doctor?.name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={appointment.status} type="appointment" animated={appointment.status === 'scheduled'} />
          {appointment.priority && <StatusBadge status={appointment.priority} />}
        </div>
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Дата и время:</span>
          <span className="text-white font-medium">
            {new Date(appointment.date).toLocaleDateString('ru-RU')} {appointment.time}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Длительность:</span>
          <span className="text-white font-medium">{appointment.duration} мин</span>
        </div>
        
        {appointment.room && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Кабинет:</span>
            <span className="text-white font-medium">{appointment.room}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/50">
          <span className="text-slate-400 text-xs">Причина:</span>
          <p className="text-white font-medium text-xs mt-1">{appointment.reason}</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Изменить
        </button>
      </div>
    </BentoCard>
  );
};

// Основной компонент
export default function MedicalServicesOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'patients' | 'doctors' | 'equipment' | 'analytics' | 'appointments'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const openModal = (title: string, content: React.ReactNode, size: 'sm' | 'md' | 'lg' | 'xl' = 'lg') => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  // Фильтрация данных по поисковому запросу и фильтрам
  const filteredServices = useMemo(() => {
    let filtered = medicalServices;
    
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(service => service.status === selectedStatus);
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, selectedStatus]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients;
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contact.phone.includes(searchQuery) ||
      patient.insurance.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredDoctors = useMemo(() => {
    if (!searchQuery) return doctors;
    return doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doctor.contact.phone.includes(searchQuery)
    );
  }, [searchQuery]);

  const filteredEquipment = useMemo(() => {
    if (!searchQuery) return equipment;
    return equipment.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredAppointments = useMemo(() => {
    if (!searchQuery) return appointments;
    return appointments.filter(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      const service = medicalServices.find(s => s.id === appointment.serviceId);
      
      return (
        patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Статистика
  const medicalStats = useMemo(() => {
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.status === 'active').length;
    const inpatientPatients = patients.filter(p => p.status === 'inpatient').length;
    const totalServices = medicalServices.length;
    const activeServices = medicalServices.filter(s => s.status === 'active').length;
    const totalDoctors = doctors.length;
    const availableDoctors = doctors.filter(d => d.status === 'active').length;
    const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
    const totalEquipment = equipment.length;
    const operationalEquipment = equipment.filter(e => e.status === 'operational').length;

    return {
      totalPatients,
      activePatients,
      inpatientPatients,
      totalServices,
      activeServices,
      totalDoctors,
      availableDoctors,
      todayAppointments,
      totalEquipment,
      operationalEquipment
    };
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', count: null },
    { id: 'services' as const, label: 'Услуги', icon: '🩺', count: medicalStats.totalServices },
    { id: 'patients' as const, label: 'Пациенты', icon: '👥', count: medicalStats.totalPatients },
    { id: 'doctors' as const, label: 'Врачи', icon: '👨‍⚕️', count: medicalStats.totalDoctors },
    { id: 'equipment' as const, label: 'Оборудование', icon: '⚙️', count: medicalStats.totalEquipment },
    { id: 'appointments' as const, label: 'Записи', icon: '📅', count: appointments.length },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', count: null }
  ];

  const categories = [
    { id: 'all', label: 'Все категории' },
    { id: 'consultation', label: 'Консультации' },
    { id: 'diagnostic', label: 'Диагностика' },
    { id: 'treatment', label: 'Лечение' },
    { id: 'surgery', label: 'Хирургия' },
    { id: 'rehabilitation', label: 'Реабилитация' },
    { id: 'emergency', label: 'Экстренная' },
    { id: 'preventive', label: 'Профилактика' }
  ];

  const statuses = [
    { id: 'all', label: 'Все статусы' },
    { id: 'active', label: 'Активные' },
    { id: 'development', label: 'В разработке' },
    { id: 'paused', label: 'Приостановлены' },
    { id: 'closed', label: 'Закрыты' }
  ];

  // Модальные окна контент
  const renderServiceModal = (service: MedicalService) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-400 text-sm font-medium">Услуга</label>
          <p className="text-white font-semibold text-lg mt-1">{service.name}</p>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Категория</label>
          <div className="mt-2">
            <StatusBadge status={service.category} />
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Статус</label>
          <div className="mt-2">
            <StatusBadge status={service.status} animated={service.status === 'active'} />
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Специализация</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {service.specialization.map((spec, index) => (
              <span key={index} className="px-3 py-1 bg-slate-700/50 rounded-lg text-slate-300 text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-sm font-medium">Описание</label>
        <p className="text-white font-medium mt-2 leading-relaxed">{service.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
          <p className="text-white font-bold text-xl">{service.duration}</p>
          <p className="text-slate-400 text-xs mt-1">минут</p>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
          <p className="text-white font-bold text-xl">{service.successRate}%</p>
          <p className="text-slate-400 text-xs mt-1">успешность</p>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
          <p className="text-white font-bold text-xl">{service.metrics.satisfaction}%</p>
          <p className="text-slate-400 text-xs mt-1">удовлетворенность</p>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
          <p className="text-white font-bold text-xl">{service.metrics.waitingTime}</p>
          <p className="text-slate-400 text-xs mt-1">дней ожидания</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-400 text-sm font-medium">Стоимость</label>
          <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-lg">
              {service.price.amount === 0 
                ? 'Бесплатно (по ОМС)'
                : service.price.insuranceCovered
                  ? `${formatCurrency(service.price.amount)} (ОМС покрывает ${service.price.insurancePercentage}%)`
                  : formatCurrency(service.price.amount)
              }
            </p>
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Доступность</label>
          <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-medium">
              {service.availability.days.join(', ')} {service.availability.hours}
            </p>
            {service.availability.emergency && (
              <p className="text-orange-400 text-sm mt-1">✓ Доступна экстренная помощь</p>
            )}
          </div>
        </div>
      </div>

      {service.requirements && service.requirements.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Требования</label>
          <div className="space-y-2">
            {service.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/20 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                <p className="text-white text-sm">{req}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {service.preparations && service.preparations.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Подготовка к процедуре</label>
          <div className="space-y-2">
            {service.preparations.map((prep, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/20 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />
                <p className="text-white text-sm">{prep}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {service.risks && service.risks.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Возможные риски</label>
          <div className="space-y-2">
            {service.risks.map((risk, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/20 rounded-xl">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0" />
                <p className="text-white text-sm">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Необходимое оборудование</label>
          <div className="space-y-2">
            {service.equipment.map((eq, index) => (
              <div key={index} className="p-3 bg-slate-800/20 rounded-xl">
                <p className="text-white text-sm">{eq}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Требуемый персонал</label>
          <div className="space-y-2">
            {service.staffRequired.map((staff, index) => (
              <div key={index} className="p-3 bg-slate-800/20 rounded-xl">
                <p className="text-white text-sm">{staff}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {service.tags && service.tags.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Теги</label>
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPatientModal = (patient: Patient) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Пациент</label>
            <p className="text-white font-semibold text-lg mt-1">{patient.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Возраст</label>
              <p className="text-white font-medium">{patient.age} лет</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Пол</label>
              <p className="text-white font-medium">
                {patient.gender === 'male' ? 'Мужской' : 'Женский'}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Статус</label>
            <div className="mt-2">
              <StatusBadge status={patient.status} type="patient" animated />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm">Группа крови</label>
            <p className="text-white font-medium">{patient.bloodType || 'Не указана'}</p>
          </div>
          {patient.priority && (
            <div>
              <label className="text-slate-400 text-sm">Приоритет</label>
              <div className="mt-2">
                <StatusBadge status={patient.priority} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
          <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
            <div>
              <span className="text-slate-400 text-sm">Телефон:</span>
              <p className="text-white font-medium">{patient.contact.phone}</p>
            </div>
            {patient.contact.email && (
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{patient.contact.email}</p>
              </div>
            )}
            <div>
              <span className="text-slate-400 text-sm">Адрес:</span>
              <p className="text-white font-medium text-sm">{patient.contact.address}</p>
            </div>
            {patient.contact.emergencyContact && (
              <div>
                <span className="text-slate-400 text-sm">Экстренный контакт:</span>
                <p className="text-white font-medium text-sm">{patient.contact.emergencyContact}</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Страховая информация</label>
          <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
            <div>
              <span className="text-slate-400 text-sm">Компания:</span>
              <p className="text-white font-medium">{patient.insurance.provider}</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Номер полиса:</span>
              <p className="text-white font-medium">{patient.insurance.number}</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Действителен до:</span>
              <p className="text-white font-medium">{new Date(patient.insurance.validity).toLocaleDateString('ru-RU')}</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Покрытие:</span>
              <p className="text-white font-bold text-lg">{patient.insurance.coverage}%</p>
            </div>
          </div>
        </div>
      </div>

      {patient.allergies && patient.allergies.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Аллергии</label>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((allergy, index) => (
              <span key={index} className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {patient.chronicConditions && patient.chronicConditions.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Хронические заболевания</label>
          <div className="flex flex-wrap gap-2">
            {patient.chronicConditions.map((condition, index) => (
              <span key={index} className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-xl text-orange-300 text-sm">
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {patient.currentMedications && patient.currentMedications.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие лекарства</label>
          <div className="flex flex-wrap gap-2">
            {patient.currentMedications.map((medication, index) => (
              <span key={index} className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm">
                {medication}
              </span>
            ))}
          </div>
        </div>
      )}

      {patient.medicalHistory.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">История обращений</label>
          <div className="space-y-3">
            {patient.medicalHistory.map((record) => (
              <div key={record.id} className="p-4 bg-slate-800/30 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-medium">
                    {new Date(record.date).toLocaleDateString('ru-RU')}
                  </span>
                  <StatusBadge status={record.status} />
                </div>
                {record.diagnosis && (
                  <p className="text-white text-sm mb-2"><strong>Диагноз:</strong> {record.diagnosis}</p>
                )}
                <p className="text-slate-300 text-sm"><strong>Лечение:</strong> {record.treatment}</p>
                {record.doctor && (
                  <p className="text-slate-400 text-xs mt-2">Врач: {doctors.find(d => d.id === record.doctor)?.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDoctorModal = (doctor: Doctor) => {
    const utilization = (doctor.currentPatients.length / doctor.maxPatients) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Врач</label>
              <p className="text-white font-semibold text-lg mt-1">{doctor.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Опыт работы</label>
                <p className="text-white font-medium">{doctor.experience} лет</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Рейтинг</label>
                <p className="text-white font-medium">{doctor.rating}/5.0</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Статус</label>
              <div className="mt-2">
                <StatusBadge status={doctor.status} type="doctor" animated={doctor.status === 'active'} />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Лицензия</label>
              <p className="text-white font-medium text-sm">{doctor.license}</p>
            </div>
            {doctor.department && (
              <div>
                <label className="text-slate-400 text-sm">Отделение</label>
                <p className="text-white font-medium">{doctor.department}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Телефон:</span>
                <p className="text-white font-medium">{doctor.contact.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{doctor.contact.email}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Расписание</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Дни приема:</span>
                <p className="text-white font-medium">{doctor.schedule.days.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Часы работы:</span>
                <p className="text-white font-medium">{doctor.schedule.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Загрузка врача</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Пациенты</span>
                <span className="text-white font-bold">{doctor.currentPatients.length}/{doctor.maxPatients}</span>
              </div>
              <ProgressBar 
                value={utilization} 
                color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
                showValue={true}
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Языки</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {doctor.languages.map((lang, index) => (
                <span key={index} className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Специализация</label>
          <div className="flex flex-wrap gap-2">
            {doctor.specialization.map((spec, index) => (
              <span key={index} className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Квалификация</label>
          <div className="space-y-2">
            {doctor.qualifications.map((qual, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/20 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0" />
                <p className="text-white text-sm">{qual}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Процедуры</label>
          <div className="flex flex-wrap gap-2">
            {doctor.procedures.map((procedure, index) => (
              <span key={index} className="px-3 py-2 bg-slate-700/50 rounded-xl text-slate-300 text-sm">
                {procedure}
              </span>
            ))}
          </div>
        </div>

        {doctor.currentPatients.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие пациенты</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctor.currentPatients.map((patientId) => {
                const patient = patients.find(p => p.id === patientId);
                return patient ? (
                  <div key={patientId} className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-white font-medium text-sm">{patient.name}</p>
                    <p className="text-slate-400 text-xs">{patient.age} лет</p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary} relative`}>
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 393px) {
          .mobile-grid {
            grid-template-columns: 1fr;
          }
          .mobile-padding {
            padding: 1rem;
          }
          .mobile-text {
            font-size: 0.875rem;
          }
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mobile-padding">
        {/* Search and Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Медицинский центр <span className="text-blue-400">"Здоровье+"</span>
              </h1>
              <p className="text-slate-400 text-lg">Современная медицина с заботой о каждом пациенте</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск услуг, пациентов, врачей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <svg className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold flex items-center gap-2 justify-center"
                onClick={() => openModal('Добавить услугу', (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-center">Функционал добавления услуги в разработке...</p>
                  </div>
                ), 'md')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить услугу
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mobile-grid">
            <StatCard
              title="Всего пациентов"
              value={medicalStats.totalPatients}
              change={12}
              icon="👥"
              color={COLORS.blue}
              subtitle={`${medicalStats.activePatients} активных`}
              trend="up"
            />
            <StatCard
              title="Медицинских услуг"
              value={medicalStats.totalServices}
              change={8}
              icon="🩺"
              color={COLORS.purple}
              subtitle={`${medicalStats.activeServices} активных`}
              trend="up"
            />
            <StatCard
              title="Врачей в штате"
              value={medicalStats.totalDoctors}
              change={5}
              icon="👨‍⚕️"
              color={COLORS.emerald}
              subtitle={`${medicalStats.availableDoctors} доступно`}
              trend="up"
            />
            <StatCard
              title="Записей сегодня"
              value={medicalStats.todayAppointments}
              change={15}
              icon="📅"
              color={COLORS.orange}
              subtitle="приемов"
              trend="up"
            />
          </div>
        </motion.section>

        {/* Tabs Navigation */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 bg-slate-800/30 rounded-2xl p-1.5 border border-slate-700/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'bg-slate-700/50 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-600 text-slate-300'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tab Content */}
        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Popular Services */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Популярные услуги</h2>
                    <button 
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                      onClick={() => setActiveTab('services')}
                    >
                      Все услуги
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
                    {medicalServices
                      .filter(service => service.status === 'active')
                      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                      .slice(0, 6)
                      .map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ServiceCard 
                          service={service} 
                          onClick={() => openModal(service.name, renderServiceModal(service), 'xl')}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Patients & Doctors */}
                <div className="grid lg:grid-cols-2 gap-8 mobile-grid">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Недавние пациенты</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('patients')}
                      >
                        Все пациенты →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {patients
                        .sort((a, b) => {
                          const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
                          const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
                          return dateB - dateA;
                        })
                        .slice(0, 4)
                        .map((patient, index) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <PatientCard 
                            patient={patient}
                            onClick={() => openModal(patient.name, renderPatientModal(patient), 'xl')}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Доступные врачи</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('doctors')}
                      >
                        Все врачи →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {doctors
                        .filter(doctor => doctor.status === 'active')
                        .slice(0, 4)
                        .map((doctor, index) => (
                        <motion.div
                          key={doctor.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <DoctorCard 
                            doctor={doctor}
                            onClick={() => openModal(doctor.name, renderDoctorModal(doctor), 'xl')}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Ближайшие записи</h3>
                    <button 
                      className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                      onClick={() => setActiveTab('appointments')}
                    >
                      Все записи →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
                    {appointments
                      .filter(apt => new Date(apt.date) >= new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 3)
                      .map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AppointmentCard 
                          appointment={appointment}
                          onClick={() => openModal('Детали записи', (
                            <div className="space-y-4">
                              <p className="text-slate-400">Детальная информация о записи...</p>
                            </div>
                          ), 'md')}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">Медицинские услуги</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex gap-2">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-800/50 border border-slate-600/50 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.label}</option>
                        ))}
                      </select>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-800/50 border border-slate-600/50 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                      >
                        {statuses.map(status => (
                          <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-200 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                        Фильтры
                      </button>
                      <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                        + Новая услуга
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ServiceCard 
                        service={service}
                        onClick={() => openModal(service.name, renderServiceModal(service), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'patients' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Пациенты</h2>
                  <button className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm self-start">
                    + Новый пациент
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
                  {filteredPatients.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PatientCard 
                        patient={patient}
                        onClick={() => openModal(patient.name, renderPatientModal(patient), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'doctors' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Врачи</h2>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm self-start">
                    + Новый врач
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
                  {filteredDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DoctorCard 
                        doctor={doctor}
                        onClick={() => openModal(doctor.name, renderDoctorModal(doctor), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'equipment' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Медицинское оборудование</h2>
                  <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm self-start">
                    + Новое оборудование
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
                  {filteredEquipment.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <EquipmentCard 
                        equipment={item}
                        onClick={() => openModal(item.name, (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-slate-400 text-sm">Оборудование</label>
                                <p className="text-white font-medium">{item.name}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Статус</label>
                                <div className="mt-1">
                                  <StatusBadge status={item.status} type="equipment" animated={item.status === 'operational'} />
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Производитель</label>
                                <p className="text-white font-medium">{item.manufacturer}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Модель</label>
                                <p className="text-white font-medium">{item.model}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Тип</label>
                                <p className="text-white font-medium">
                                  {item.type === 'diagnostic' && 'Диагностическое'}
                                  {item.type === 'treatment' && 'Лечебное'}
                                  {item.type === 'surgical' && 'Хирургическое'}
                                  {item.type === 'monitoring' && 'Мониторинг'}
                                  {item.type === 'laboratory' && 'Лабораторное'}
                                </p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Местоположение</label>
                                <p className="text-white font-medium">{item.location}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Использование</label>
                                <p className="text-white font-medium">{item.utilization}%</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">След. ТО</label>
                                <p className="text-white font-medium">{new Date(item.nextMaintenance).toLocaleDateString('ru-RU')}</p>
                              </div>
                            </div>
                            {item.specifications && (
                              <div>
                                <label className="text-slate-400 text-sm font-medium mb-3 block">Технические характеристики</label>
                                <div className="grid grid-cols-2 gap-4">
                                  {item.specifications.power && (
                                    <div>
                                      <span className="text-slate-400 text-sm">Питание:</span>
                                      <p className="text-white font-medium">{item.specifications.power}</p>
                                    </div>
                                  )}
                                  {item.specifications.weight && (
                                    <div>
                                      <span className="text-slate-400 text-sm">Вес:</span>
                                      <p className="text-white font-medium">{item.specifications.weight}</p>
                                    </div>
                                  )}
                                  {item.specifications.dimensions && (
                                    <div>
                                      <span className="text-slate-400 text-sm">Габариты:</span>
                                      <p className="text-white font-medium">{item.specifications.dimensions}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div>
                              <label className="text-slate-400 text-sm font-medium mb-3 block">Гарантия</label>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-slate-400 text-sm">Действует до:</span>
                                  <p className="text-white font-medium">{new Date(item.warranty.validUntil).toLocaleDateString('ru-RU')}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-sm">Поставщик:</span>
                                  <p className="text-white font-medium">{item.warranty.provider}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ), 'lg')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'appointments' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Записи на прием</h2>
                  <button className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm self-start">
                    + Новая запись
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
                  {filteredAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AppointmentCard 
                        appointment={appointment}
                        onClick={() => openModal('Детали записи', (
                          <div className="space-y-4">
                            <p className="text-slate-400">Детальная информация о записи...</p>
                          </div>
                        ), 'md')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Analytics Overview */}
                <div className="grid lg:grid-cols-3 gap-6 mobile-grid">
                  <BentoCard className="p-6" glowColor={COLORS.blue}>
                    <h3 className="text-white font-semibold mb-4">Эффективность лечения</h3>
                    <div className="text-3xl font-bold text-white mb-2">91.5%</div>
                    <ProgressBar value={91.5} color={COLORS.blue} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-300">
                      <div>
                        <p>Средняя удовлетворенность</p>
                        <p className="text-white font-medium">94.2%</p>
                      </div>
                      <div>
                        <p>Успешность процедур</p>
                        <p className="text-white font-medium">92.8%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.emerald}>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Месячная выручка</span>
                        <span className="text-white font-medium">{formatCurrency(2850000)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Расходы на оборудование</span>
                        <span className="text-white font-medium">{formatCurrency(850000)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Чистая прибыль</span>
                        <span className="text-emerald-300 font-medium">{formatCurrency(1250000)}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.orange}>
                    <h3 className="text-white font-semibold mb-4">Распределение услуг</h3>
                    <div className="space-y-3">
                      {[
                        { service: 'Консультации', percentage: 35, revenue: formatCurrency(997500) },
                        { service: 'Диагностика', percentage: 28, revenue: formatCurrency(798000) },
                        { service: 'Лечение', percentage: 22, revenue: formatCurrency(627000) },
                        { service: 'Реабилитация', percentage: 12, revenue: formatCurrency(342000) },
                        { service: 'Экстренная помощь', percentage: 3, revenue: formatCurrency(85500) }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{item.service}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 text-sm">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Medical Analytics */}
                <BentoCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Медицинская аналитика</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Ключевые показатели здоровья</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Среднее время ожидания</span>
                          <span className="text-white font-medium">2.3 дня</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Повторные обращения</span>
                          <span className="text-white font-medium">18%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Эффективность диагностики</span>
                          <span className="text-white font-medium">96.2%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Оснащенность оборудованием</span>
                          <span className="text-white font-medium">88.5%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Эффективность по специализациям</h4>
                      <div className="space-y-3">
                        {[
                          { specialty: 'Терапия', effectiveness: 94, patients: 45 },
                          { specialty: 'Диагностика', effectiveness: 97, patients: 38 },
                          { specialty: 'Хирургия', effectiveness: 92, patients: 22 },
                          { specialty: 'Реабилитация', effectiveness: 88, patients: 28 }
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-slate-800/30 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm">{item.specialty}</span>
                              <span className="text-slate-300 text-sm">{item.effectiveness}%</span>
                            </div>
                            <ProgressBar value={item.effectiveness} color={COLORS.teal} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        title={modalTitle}
        size="xl"
      >
        {modalContent}
      </Modal>
    </div>
  );
}