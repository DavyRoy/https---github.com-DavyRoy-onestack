'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook для времени с улучшенной производительностью
const useClientTime = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

// Расширенные типы данных
interface Patient {
  id: string;
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: 'male' | 'female';
    phone: string;
    email?: string;
    address: string;
    passport: string;
    snils: string;
    insurancePolicy: string;
    photo?: string;
  };
  medicalInfo: {
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    allergies: string[];
    chronicDiseases: string[];
    currentMedications: string[];
    disability: boolean;
    disabilityGroup?: 1 | 2 | 3;
    height?: number;
    weight?: number;
    bmi?: number;
  };
  treatment: {
    diagnosis: string;
    attendingDoctor: string;
    department: 'therapy' | 'surgery' | 'cardiology' | 'neurology' | 'pediatrics' | 'oncology' | 'traumatology' | 'other';
    status: 'inpatient' | 'outpatient' | 'emergency' | 'rehabilitation' | 'discharged';
    admissionDate: string;
    dischargeDate?: string;
    roomNumber?: string;
    bedNumber?: string;
    wardType?: 'standard' | 'vip' | 'icu' | 'isolation';
  };
  appointments: {
    upcoming: MedicalAppointment[];
    completed: MedicalAppointment[];
  };
  status: 'active' | 'transferred' | 'discharged' | 'deceased';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    email?: string;
  };
  notes?: string;
  lastUpdated: string;
}

interface MedicalAppointment {
  id: string;
  type: 'consultation' | 'examination' | 'procedure' | 'surgery' | 'therapy' | 'diagnostic';
  doctor: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  description: string;
  results?: string;
  recommendations?: string;
  location?: string;
  priority: 'low' | 'medium' | 'high';
}

interface MedicalStaff {
  id: string;
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    position: 'doctor' | 'nurse' | 'specialist' | 'administrator' | 'technician';
    specialization: string;
    qualification: string;
    experience: number;
    photo?: string;
  };
  department: string;
  assignedPatients: string[];
  schedule: {
    days: string[];
    hours: string;
    shifts?: 'day' | 'night' | 'rotating';
  };
  status: 'active' | 'busy' | 'vacation' | 'sick_leave' | 'training';
  metrics: {
    patientSatisfaction: number;
    onTimeAppointments: number;
    completedProcedures: number;
    successRate: number;
  };
  contacts: {
    internal: string;
    emergency?: string;
  };
}

interface MedicalRequest {
  id: string;
  patientId: string;
  requestType: 'consultation' | 'examination' | 'procedure' | 'tests' | 'medication' | 'equipment' | 'transfer';
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'reviewed' | 'approved' | 'scheduled' | 'in_progress' | 'completed' | 'rejected';
  timeline: {
    submitted: string;
    reviewed?: string;
    approved?: string;
    scheduled?: string;
    started?: string;
    completed?: string;
  };
  assignedStaff?: string;
  notes?: string;
  requiredResources?: string[];
  estimatedDuration?: number;
}

// Расширенные моки данных
const patients: Patient[] = [
  {
    id: 'pt-001',
    personalInfo: {
      fullName: 'Иванова Мария Сергеевна',
      birthDate: '1978-05-15',
      gender: 'female',
      phone: '+7 (916) 123-45-67',
      email: 'm.ivanova@example.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      passport: '4510 123456',
      snils: '123-456-789-00',
      insurancePolicy: '123456789012',
      photo: '/avatars/female-1.jpg'
    },
    medicalInfo: {
      bloodType: 'A+',
      allergies: ['Пенициллин', 'Пыльца', 'Морепродукты'],
      chronicDiseases: ['Гипертония 2 степени', 'Бронхиальная астма'],
      currentMedications: ['Эналаприл 10мг', 'Сальбутамол ингалятор', 'Аспирин кардио'],
      disability: false,
      height: 168,
      weight: 65,
      bmi: 23.0
    },
    treatment: {
      diagnosis: 'Острый бронхит с астматическим компонентом',
      attendingDoctor: 'ms-001',
      department: 'therapy',
      status: 'inpatient',
      admissionDate: '2024-06-15',
      roomNumber: '205',
      bedNumber: '3',
      wardType: 'standard'
    },
    appointments: {
      upcoming: [
        {
          id: 'ma-001',
          type: 'consultation',
          doctor: 'ms-001',
          department: 'therapy',
          date: '2024-06-20',
          time: '10:00',
          duration: 30,
          status: 'scheduled',
          description: 'Повторная консультация терапевта для оценки динамики лечения',
          priority: 'medium',
          location: 'Кабинет 304'
        },
        {
          id: 'ma-007',
          type: 'therapy',
          doctor: 'ms-008',
          department: 'therapy',
          date: '2024-06-21',
          time: '11:30',
          duration: 45,
          status: 'scheduled',
          description: 'Ингаляционная терапия с бронхолитиками',
          priority: 'high',
          location: 'Процедурный кабинет 205'
        }
      ],
      completed: [
        {
          id: 'ma-002',
          type: 'examination',
          doctor: 'ms-002',
          department: 'diagnostic',
          date: '2024-06-16',
          time: '09:00',
          duration: 20,
          status: 'completed',
          description: 'Рентгенография органов грудной клетки в двух проекциях',
          results: 'Легочные поля прозрачные, корни структурны, синусы свободны. Очаговых и инфильтративных изменений не выявлено.',
          recommendations: 'Контроль через 7 дней',
          priority: 'medium',
          location: 'Рентген кабинет 101'
        }
      ]
    },
    status: 'active',
    emergencyContact: {
      name: 'Иванов Сергей Петрович',
      phone: '+7 (916) 765-43-21',
      relationship: 'Муж',
      email: 's.ivanov@example.ru'
    },
    notes: 'Пациентка требует особого внимания из-за астмы в анамнезе. Отмечает улучшение состояния после ингаляционной терапии.',
    lastUpdated: '2024-06-19T14:30:00Z'
  },
  {
    id: 'pt-002',
    personalInfo: {
      fullName: 'Петров Иван Дмитриевич',
      birthDate: '1965-12-20',
      gender: 'male',
      phone: '+7 (925) 234-56-78',
      address: 'г. Москва, пр. Мира, д. 125, кв. 89',
      passport: '4510 234567',
      snils: '234-567-890-11',
      insurancePolicy: '234567890123',
      photo: '/avatars/male-1.jpg'
    },
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Новокаин'],
      chronicDiseases: ['Сахарный диабет 2 типа', 'Диабетическая нейропатия'],
      currentMedications: ['Метформин 850мг', 'Инсулин гларгин', 'Габапентин'],
      disability: true,
      disabilityGroup: 2,
      height: 178,
      weight: 85,
      bmi: 26.8
    },
    treatment: {
      diagnosis: 'Диабетическая гангрена стопы 2 пальца левой стопы',
      attendingDoctor: 'ms-003',
      department: 'surgery',
      status: 'inpatient',
      admissionDate: '2024-06-10',
      roomNumber: '301',
      bedNumber: '1',
      wardType: 'standard'
    },
    appointments: {
      upcoming: [
        {
          id: 'ma-003',
          type: 'surgery',
          doctor: 'ms-003',
          department: 'surgery',
          date: '2024-06-22',
          time: '08:00',
          duration: 120,
          status: 'scheduled',
          description: 'Ампутация 2 пальца левой стопы по поводу гангрены',
          priority: 'high',
          location: 'Операционная 2'
        },
        {
          id: 'ma-008',
          type: 'consultation',
          doctor: 'ms-007',
          department: 'therapy',
          date: '2024-06-23',
          time: '14:00',
          duration: 40,
          status: 'scheduled',
          description: 'Консультация эндокринолога для коррекции сахароснижающей терапии',
          priority: 'medium',
          location: 'Кабинет 415'
        }
      ],
      completed: [
        {
          id: 'ma-009',
          type: 'diagnostic',
          doctor: 'ms-002',
          department: 'diagnostic',
          date: '2024-06-11',
          time: '10:30',
          duration: 30,
          status: 'completed',
          description: 'УЗДГ артерий нижних конечностей',
          results: 'Снижение кровотока по тыльной артерии стопы слева. Магистральный кровоток сохранен.',
          recommendations: 'Контроль после операции',
          priority: 'medium',
          location: 'УЗИ кабинет 203'
        }
      ]
    },
    status: 'active',
    emergencyContact: {
      name: 'Петрова Ольга Ивановна',
      phone: '+7 (925) 876-54-32',
      relationship: 'Жена',
      email: 'o.petrova@example.ru'
    },
    notes: 'Требуется постоянный контроль уровня глюкозы крови. Назначен мониторинг гликемии 4 раза в сутки.',
    lastUpdated: '2024-06-19T16:45:00Z'
  },
  {
    id: 'pt-003',
    personalInfo: {
      fullName: 'Сидорова Анна Владимировна',
      birthDate: '1988-08-30',
      gender: 'female',
      phone: '+7 (916) 345-67-89',
      email: 'a.sidorova@example.ru',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 12',
      passport: '4510 345678',
      snils: '345-678-901-22',
      insurancePolicy: '345678901234',
      photo: '/avatars/female-2.jpg'
    },
    medicalInfo: {
      bloodType: 'B+',
      allergies: ['Анестетики местные', 'Антибиотики цефалоспоринового ряда'],
      chronicDiseases: [],
      currentMedications: ['Фолиевая кислота', 'Йодомарин'],
      disability: false,
      height: 172,
      weight: 68,
      bmi: 23.0
    },
    treatment: {
      diagnosis: 'Беременность 32 недели. Угроза преждевременных родов.',
      attendingDoctor: 'ms-004',
      department: 'therapy',
      status: 'outpatient',
      admissionDate: '2024-06-01'
    },
    appointments: {
      upcoming: [
        {
          id: 'ma-004',
          type: 'examination',
          doctor: 'ms-004',
          department: 'therapy',
          date: '2024-06-25',
          time: '14:00',
          duration: 40,
          status: 'scheduled',
          description: 'Плановый осмотр гинеколога, КТГ, УЗИ плода',
          priority: 'medium',
          location: 'Женская консультация, каб. 205'
        },
        {
          id: 'ma-010',
          type: 'diagnostic',
          doctor: 'ms-005',
          department: 'diagnostic',
          date: '2024-06-25',
          time: '15:30',
          duration: 30,
          status: 'scheduled',
          description: 'УЗИ плода с допплерометрией',
          priority: 'medium',
          location: 'УЗИ кабинет 205'
        }
      ],
      completed: [
        {
          id: 'ma-005',
          type: 'diagnostic',
          doctor: 'ms-005',
          department: 'diagnostic',
          date: '2024-06-10',
          time: '11:00',
          duration: 25,
          status: 'completed',
          description: 'УЗИ скрининг III триместра',
          results: 'Один плод в головном предлежании. Развитие соответствует 31-32 неделям. Плацента по задней стенке, 1 степени зрелости. Воды чистые.',
          recommendations: 'Повторить УЗИ через 4 недели. Ограничить физические нагрузки.',
          priority: 'medium',
          location: 'УЗИ кабинет 205'
        }
      ]
    },
    status: 'active',
    emergencyContact: {
      name: 'Сидоров Дмитрий Александрович',
      phone: '+7 (916) 987-65-43',
      relationship: 'Муж',
      email: 'd.sidorov@example.ru'
    },
    lastUpdated: '2024-06-18T11:20:00Z'
  },
  {
    id: 'pt-004',
    personalInfo: {
      fullName: 'Козлов Олег Николаевич',
      birthDate: '1952-03-10',
      gender: 'male',
      phone: '+7 (925) 456-78-90',
      address: 'г. Москва, ул. Гагарина, д. 34, кв. 56',
      passport: '4510 456789',
      snils: '456-789-012-33',
      insurancePolicy: '456789012345',
      photo: '/avatars/male-2.jpg'
    },
    medicalInfo: {
      bloodType: 'AB+',
      allergies: ['Йод', 'Аспирин'],
      chronicDiseases: ['ИБС: стенокардия напряжения ФК II', 'Постоянная форма фибрилляции предсердий', 'Артериальная гипертензия 3 степени'],
      currentMedications: ['Аспирин кардио', 'Бисопролол 5мг', 'Аторвастатин 20мг', 'Апиксабан 5мг'],
      disability: true,
      disabilityGroup: 3,
      height: 175,
      weight: 82,
      bmi: 26.8
    },
    treatment: {
      diagnosis: 'Острый трансмуральный инфаркт миокарда передней стенки левого желудочка',
      attendingDoctor: 'ms-006',
      department: 'cardiology',
      status: 'inpatient',
      admissionDate: '2024-06-18',
      roomNumber: '108',
      bedNumber: '2',
      wardType: 'icu'
    },
    appointments: {
      upcoming: [
        {
          id: 'ma-011',
          type: 'consultation',
          doctor: 'ms-009',
          department: 'cardiology',
          date: '2024-06-20',
          time: '09:00',
          duration: 45,
          status: 'scheduled',
          description: 'Консультация кардиохирурга для решения вопроса о реваскуляризации',
          priority: 'high',
          location: 'Кардиоотделение, каб. 108'
        }
      ],
      completed: [
        {
          id: 'ma-006',
          type: 'procedure',
          doctor: 'ms-006',
          department: 'cardiology',
          date: '2024-06-18',
          time: '15:30',
          duration: 90,
          status: 'completed',
          description: 'Экстренная коронарография с ангиопластикой ПКА',
          results: 'Выявлена окклюзия проксимального сегмента ПКА. Успешно выполнена баллонная ангиопластика со стентированием. Восстановлен кровоток TIMI 3.',
          recommendations: 'Продолжить двойную антиагрегантную терапию. Мониторинг ЭКГ и маркеров некроза миокарда.',
          priority: 'emergency',
          location: 'Рентген-операционная 1'
        }
      ]
    },
    status: 'active',
    emergencyContact: {
      name: 'Козлова Галина Семеновна',
      phone: '+7 (916) 987-65-43',
      relationship: 'Дочь',
      email: 'g.kozlova@example.ru'
    },
    notes: 'Состояние тяжелое, стабильное. Находится в кардиореанимации. Требуется мониторинг гемодинамики и ритма.',
    lastUpdated: '2024-06-19T18:15:00Z'
  },
  {
    id: 'pt-005',
    personalInfo: {
      fullName: 'Николаева Екатерина Викторовна',
      birthDate: '1995-07-22',
      gender: 'female',
      phone: '+7 (916) 567-89-01',
      email: 'e.nikolaeva@example.ru',
      address: 'г. Москва, ул. Тверская, д. 25, кв. 14',
      passport: '4510 567890',
      snils: '567-890-123-44',
      insurancePolicy: '567890123456',
      photo: '/avatars/female-3.jpg'
    },
    medicalInfo: {
      bloodType: 'O-',
      allergies: ['Пенициллин', 'Яйцо'],
      chronicDiseases: ['Мигрень'],
      currentMedications: ['Суматриптан'],
      disability: false,
      height: 165,
      weight: 58,
      bmi: 21.3
    },
    treatment: {
      diagnosis: 'Острый аппендицит. Состояние после аппендэктомии.',
      attendingDoctor: 'ms-003',
      department: 'surgery',
      status: 'inpatient',
      admissionDate: '2024-06-19',
      roomNumber: '305',
      bedNumber: '2',
      wardType: 'standard'
    },
    appointments: {
      upcoming: [
        {
          id: 'ma-012',
          type: 'procedure',
          doctor: 'ms-010',
          department: 'surgery',
          date: '2024-06-20',
          time: '08:30',
          duration: 15,
          status: 'scheduled',
          description: 'Перевязка послеоперационной раны',
          priority: 'medium',
          location: 'Перевязочная 305'
        }
      ],
      completed: [
        {
          id: 'ma-013',
          type: 'surgery',
          doctor: 'ms-003',
          department: 'surgery',
          date: '2024-06-19',
          time: '16:00',
          duration: 45,
          status: 'completed',
          description: 'Лапароскопическая аппендэктомия',
          results: 'Операция выполнена лапароскопически. Удален катарально измененный червеобразный отросток. Перитонеальная жидкость прозрачная.',
          recommendations: 'Антибактериальная терапия, перевязки, активизация на следующие сутки.',
          priority: 'high',
          location: 'Операционная 3'
        }
      ]
    },
    status: 'active',
    emergencyContact: {
      name: 'Николаев Виктор Сергеевич',
      phone: '+7 (916) 123-45-67',
      relationship: 'Отец',
      email: 'v.nikolaev@example.ru'
    },
    notes: 'Послеоперационный период протекает гладко. Жалоб нет.',
    lastUpdated: '2024-06-19T20:30:00Z'
  }
];

const medicalStaff: MedicalStaff[] = [
  {
    id: 'ms-001',
    personalInfo: {
      fullName: 'Александрова Елена Викторовна',
      phone: '+7 (916) 111-22-33',
      email: 'e.alexandrova@hospital.ru',
      position: 'doctor',
      specialization: 'Терапевт',
      qualification: 'Врач высшей категории, к.м.н.',
      experience: 15,
      photo: '/staff/doctor-1.jpg'
    },
    department: 'therapy',
    assignedPatients: ['pt-001', 'pt-003'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-17:00',
      shifts: 'day'
    },
    status: 'active',
    metrics: {
      patientSatisfaction: 95,
      onTimeAppointments: 98,
      completedProcedures: 245,
      successRate: 96
    },
    contacts: {
      internal: '1011',
      emergency: '+7 (916) 111-22-34'
    }
  },
  {
    id: 'ms-002',
    personalInfo: {
      fullName: 'Николаев Дмитрий Сергеевич',
      phone: '+7 (925) 222-33-44',
      email: 'd.nikolaev@hospital.ru',
      position: 'doctor',
      specialization: 'Рентгенолог',
      qualification: 'Кандидат медицинских наук',
      experience: 12,
      photo: '/staff/doctor-2.jpg'
    },
    department: 'diagnostic',
    assignedPatients: [],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '09:00-18:00',
      shifts: 'day'
    },
    status: 'busy',
    metrics: {
      patientSatisfaction: 92,
      onTimeAppointments: 95,
      completedProcedures: 189,
      successRate: 98
    },
    contacts: {
      internal: '1012'
    }
  },
  {
    id: 'ms-003',
    personalInfo: {
      fullName: 'Орлова Светлана Петровна',
      phone: '+7 (916) 333-44-55',
      email: 's.orlova@hospital.ru',
      position: 'doctor',
      specialization: 'Хирург',
      qualification: 'Доктор медицинских наук, профессор',
      experience: 25,
      photo: '/staff/doctor-3.jpg'
    },
    department: 'surgery',
    assignedPatients: ['pt-002', 'pt-005'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-16:00',
      shifts: 'day'
    },
    status: 'active',
    metrics: {
      patientSatisfaction: 96,
      onTimeAppointments: 97,
      completedProcedures: 156,
      successRate: 99
    },
    contacts: {
      internal: '1013',
      emergency: '+7 (916) 333-44-56'
    }
  },
  {
    id: 'ms-004',
    personalInfo: {
      fullName: 'Волкова Ирина Александровна',
      phone: '+7 (916) 444-55-66',
      email: 'i.volkova@hospital.ru',
      position: 'doctor',
      specialization: 'Гинеколог',
      qualification: 'Врач первой категории',
      experience: 8,
      photo: '/staff/doctor-4.jpg'
    },
    department: 'therapy',
    assignedPatients: ['pt-003'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт'],
      hours: '10:00-19:00',
      shifts: 'day'
    },
    status: 'active',
    metrics: {
      patientSatisfaction: 94,
      onTimeAppointments: 96,
      completedProcedures: 178,
      successRate: 97
    },
    contacts: {
      internal: '1014'
    }
  },
  {
    id: 'ms-005',
    personalInfo: {
      fullName: 'Семенов Алексей Игоревич',
      phone: '+7 (916) 555-66-77',
      email: 'a.semenov@hospital.ru',
      position: 'doctor',
      specialization: 'УЗИ-диагност',
      qualification: 'Врач высшей категории',
      experience: 10,
      photo: '/staff/doctor-5.jpg'
    },
    department: 'diagnostic',
    assignedPatients: [],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-15:00',
      shifts: 'day'
    },
    status: 'active',
    metrics: {
      patientSatisfaction: 93,
      onTimeAppointments: 94,
      completedProcedures: 215,
      successRate: 99
    },
    contacts: {
      internal: '1015'
    }
  }
];

const medicalRequests: MedicalRequest[] = [
  {
    id: 'mr-001',
    patientId: 'pt-001',
    requestType: 'tests',
    description: 'Общий анализ крови с лейкоцитарной формулой, биохимический анализ крови (глюкоза, креатинин, АЛТ, АСТ), общий анализ мочи',
    urgency: 'medium',
    status: 'submitted',
    timeline: {
      submitted: '2024-06-18T10:00:00Z'
    },
    requiredResources: ['лаборант', 'анализатор биохимический', 'реактивы'],
    estimatedDuration: 120
  },
  {
    id: 'mr-002',
    patientId: 'pt-004',
    requestType: 'consultation',
    description: 'Срочная консультация кардиохирурга для решения вопроса о необходимости АКШ',
    urgency: 'high',
    status: 'reviewed',
    timeline: {
      submitted: '2024-06-17T14:00:00Z',
      reviewed: '2024-06-18T09:00:00Z'
    },
    assignedStaff: 'ms-009',
    requiredResources: ['кардиохирург', 'ЭКГ аппарат', 'анализы крови'],
    estimatedDuration: 60
  },
  {
    id: 'mr-003',
    patientId: 'pt-002',
    requestType: 'medication',
    description: 'Инсулин гларгин 100 ЕД/мл, шприц-ручки 5 шт',
    urgency: 'high',
    status: 'approved',
    timeline: {
      submitted: '2024-06-16T11:00:00Z',
      reviewed: '2024-06-16T14:00:00Z',
      approved: '2024-06-17T09:00:00Z'
    },
    requiredResources: ['инсулин гларгин', 'шприц-ручки'],
    estimatedDuration: 15
  },
  {
    id: 'mr-004',
    patientId: 'pt-005',
    requestType: 'procedure',
    description: 'Физиотерапия: УВЧ на послеоперационную рану для ускорения заживления',
    urgency: 'low',
    status: 'scheduled',
    timeline: {
      submitted: '2024-06-19T16:00:00Z',
      reviewed: '2024-06-19T17:00:00Z',
      approved: '2024-06-19T17:30:00Z',
      scheduled: '2024-06-20T10:00:00Z'
    },
    assignedStaff: 'ms-011',
    requiredResources: ['аппарат УВЧ', 'физиотерапевт'],
    estimatedDuration: 20
  }
];

// Константы с расширенной палитрой
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-teal-900 via-slate-950 to-emerald-900',
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
  slate: '100, 116, 139',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  lime: '132, 204, 22',
  sky: '14, 165, 233'
} as const;

// Утилиты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU');
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const getInitials = (fullName: string) => {
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Улучшенный Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  closeOnOverlayClick = true 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  closeOnOverlayClick?: boolean;
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
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeOnOverlayClick ? onClose : undefined}
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
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Улучшенный BentoCard с анимациями
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  delay?: number;
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
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

// Улучшенный StatusBadge с дополнительными типами
const StatusBadge = ({ status, type = 'default', animated = false, size = 'md' }: { 
  status: string; 
  type?: 'default' | 'patient' | 'appointment' | 'staff' | 'request' | 'treatment' | 'department' | 'urgency';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const getStatusConfig = () => {
    const baseConfig = {
      active: { color: COLORS.success, label: 'Активен' },
      transferred: { color: COLORS.blue, label: 'Переведен' },
      discharged: { color: COLORS.teal, label: 'Выписан' },
      deceased: { color: COLORS.error, label: 'Умер' },
      inpatient: { color: COLORS.purple, label: 'Стационар' },
      outpatient: { color: COLORS.cyan, label: 'Амбулаторно' },
      emergency: { color: COLORS.rose, label: 'Экстренно' },
      rehabilitation: { color: COLORS.orange, label: 'Реабилитация' },
      scheduled: { color: COLORS.blue, label: 'Запланирован' },
      in_progress: { color: COLORS.orange, label: 'В процессе' },
      completed: { color: COLORS.success, label: 'Завершен' },
      cancelled: { color: COLORS.error, label: 'Отменен' },
      rescheduled: { color: COLORS.warning, label: 'Перенесен' },
      busy: { color: COLORS.orange, label: 'Занят' },
      vacation: { color: COLORS.cyan, label: 'Отпуск' },
      sick_leave: { color: COLORS.purple, label: 'Больничный' },
      training: { color: COLORS.indigo, label: 'Обучение' },
      submitted: { color: COLORS.blue, label: 'Подана' },
      reviewed: { color: COLORS.teal, label: 'Рассмотрена' },
      approved: { color: COLORS.success, label: 'Одобрена' },
      rejected: { color: COLORS.rose, label: 'Отклонена' },
      therapy: { color: COLORS.blue, label: 'Терапия' },
      surgery: { color: COLORS.purple, label: 'Хирургия' },
      cardiology: { color: COLORS.rose, label: 'Кардиология' },
      neurology: { color: COLORS.indigo, label: 'Неврология' },
      pediatrics: { color: COLORS.cyan, label: 'Педиатрия' },
      oncology: { color: COLORS.orange, label: 'Онкология' },
      traumatology: { color: COLORS.amber, label: 'Травматология' },
      diagnostic: { color: COLORS.violet, label: 'Диагностика' },
      consultation: { color: COLORS.blue, label: 'Консультация' },
      examination: { color: COLORS.teal, label: 'Обследование' },
      procedure: { color: COLORS.purple, label: 'Процедура' },
      tests: { color: COLORS.cyan, label: 'Анализы' },
      medication: { color: COLORS.emerald, label: 'Лекарства' },
      equipment: { color: COLORS.amber, label: 'Оборудование' },
      transfer: { color: COLORS.indigo, label: 'Перевод' },
      low: { color: COLORS.success, label: 'Низкий' },
      medium: { color: COLORS.warning, label: 'Средний' },
      high: { color: COLORS.orange, label: 'Высокий' },
      emergency: { color: COLORS.rose, label: 'Экстренный' },
      standard: { color: COLORS.slate, label: 'Стандарт' },
      vip: { color: COLORS.amber, label: 'VIP' },
      icu: { color: COLORS.rose, label: 'Реанимация' },
      isolation: { color: COLORS.purple, label: 'Изолятор' },
      doctor: { color: COLORS.blue, label: 'Врач' },
      nurse: { color: COLORS.teal, label: 'Медсестра' },
      specialist: { color: COLORS.purple, label: 'Специалист' },
      administrator: { color: COLORS.slate, label: 'Администратор' },
      technician: { color: COLORS.cyan, label: 'Техник' }
    };

    const config = baseConfig[status as keyof typeof baseConfig] || { color: COLORS.slate, label: status };
    
    return {
      ...config,
      bg: `bg-[rgb(${config.color})]/15`,
      border: `border-[rgb(${config.color})]/30`,
      text: `text-[rgb(${config.color})]`
    };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
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

// Улучшенный ProgressBar с дополнительными функциями
const ProgressBar = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md',
  showAnimation = true 
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
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
          initial={showAnimation ? { width: 0 } : false}
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

// Улучшенный StatCard
const StatCard = ({ title, value, change, icon, color = COLORS.teal, subtitle, onClick, trend, delay = 0 }: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  return (
    <BentoCard 
      className="p-6" 
      glowColor={color} 
      onClick={onClick}
      padding="p-6"
      delay={delay}
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

// Улучшенный PatientCard
const PatientCard = ({ patient, onClick, delay = 0 }: { patient: Patient; onClick?: () => void; delay?: number }) => {
  const age = calculateAge(patient.personalInfo.birthDate);
  const upcomingAppointments = patient.appointments.upcoming.length;
  const completedAppointments = patient.appointments.completed.length;
  
  const getPatientColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'transferred': return COLORS.blue;
      case 'discharged': return COLORS.teal;
      case 'deceased': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getPatientColor(patient.status)} onClick={onClick} delay={delay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(patient.personalInfo.fullName)}
            </div>
            {patient.status === 'active' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{patient.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm">
              {age} лет • {patient.personalInfo.gender === 'male' ? 'Муж' : 'Жен'}
            </p>
          </div>
        </div>
        <StatusBadge status={patient.status} type="patient" animated={patient.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Диагноз:</span>
          <span className="text-white font-medium text-right line-clamp-1 max-w-[60%]">{patient.treatment.diagnosis}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Статус:</span>
          <StatusBadge status={patient.treatment.status} type="treatment" size="sm" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Назначения:</span>
          <span className="text-white font-medium">
            {upcomingAppointments} запланировано
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            patient.medicalInfo.bloodType.includes('+') ? 'bg-rose-500' : 'bg-blue-500'
          }`} />
          <span className="text-xs text-slate-400">
            {patient.medicalInfo.bloodType}
          </span>
        </div>
        <div className="text-xs text-slate-400">
          {patient.treatment.roomNumber ? `Палата ${patient.treatment.roomNumber}` : 'Амбулаторно'}
        </div>
      </div>
    </BentoCard>
  );
};

// Улучшенный StaffCard
const StaffCard = ({ staff, onClick, delay = 0 }: { staff: MedicalStaff; onClick?: () => void; delay?: number }) => {
  const activePatients = staff.assignedPatients.length;
  
  return (
    <BentoCard className="p-5" glowColor={COLORS.blue} onClick={onClick} delay={delay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(staff.personalInfo.fullName)}
            </div>
            <StatusBadge status={staff.status} type="staff" size="sm" animated={staff.status === 'active'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{staff.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm line-clamp-1">{staff.personalInfo.specialization}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Отдел:</span>
          <StatusBadge status={staff.department} type="department" size="sm" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Пациенты:</span>
          <span className="text-white font-medium">{activePatients} человек</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Опыт:</span>
          <span className="text-white font-medium">{staff.personalInfo.experience} лет</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <ProgressBar 
          value={staff.metrics.patientSatisfaction} 
          label="Удовлетворенность" 
          color={COLORS.emerald}
          size="sm"
        />
        <ProgressBar 
          value={staff.metrics.onTimeAppointments} 
          label="Пунктуальность" 
          color={COLORS.blue}
          size="sm"
        />
      </div>
    </BentoCard>
  );
};

// Улучшенный AppointmentCard
const AppointmentCard = ({ appointment, onClick, delay = 0 }: { appointment: MedicalAppointment; onClick?: () => void; delay?: number }) => {
  const getAppointmentColor = (type: string) => {
    switch (type) {
      case 'consultation': return COLORS.blue;
      case 'examination': return COLORS.teal;
      case 'procedure': return COLORS.purple;
      case 'surgery': return COLORS.rose;
      case 'therapy': return COLORS.emerald;
      case 'diagnostic': return COLORS.cyan;
      default: return COLORS.slate;
    }
  };

  const isUrgent = appointment.priority === 'high' || appointment.priority === 'emergency';

  return (
    <BentoCard className="p-4" glowColor={getAppointmentColor(appointment.type)} onClick={onClick} delay={delay}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center space-x-2 mb-1">
            {isUrgent && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
              </motion.div>
            )}
            <h5 className="text-white font-semibold text-sm line-clamp-2">{appointment.description}</h5>
          </div>
          <p className="text-slate-400 text-xs">
            {medicalStaff.find(s => s.id === appointment.doctor)?.personalInfo.fullName}
          </p>
        </div>
        <StatusBadge status={appointment.status} type="appointment" animated={appointment.status === 'scheduled'} />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип:</span>
          <StatusBadge status={appointment.type} size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Дата:</span>
          <span className="text-white">{formatDate(appointment.date)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Время:</span>
          <span className="text-white">{appointment.time} ({appointment.duration} мин)</span>
        </div>

        {appointment.location && (
          <div className="flex justify-between">
            <span className="text-slate-400">Место:</span>
            <span className="text-white text-right max-w-[60%] line-clamp-1">{appointment.location}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <span className="text-xs text-slate-400">Приоритет:</span>
        <StatusBadge status={appointment.priority} type="urgency" size="sm" />
      </div>
    </BentoCard>
  );
};

// Улучшенный RequestCard
const RequestCard = ({ request, onClick, delay = 0 }: { request: MedicalRequest; onClick?: () => void; delay?: number }) => {
  const patient = patients.find(p => p.id === request.patientId);
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'high': return COLORS.orange;
      case 'emergency': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-4" glowColor={getUrgencyColor(request.urgency)} onClick={onClick} delay={delay}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{request.description}</h5>
          <p className="text-slate-400 text-xs">{patient?.personalInfo.fullName}</p>
        </div>
        <StatusBadge status={request.status} type="request" animated={request.status === 'submitted'} />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип запроса:</span>
          <StatusBadge status={request.requestType} size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Срочность:</span>
          <StatusBadge status={request.urgency} type="urgency" size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Подана:</span>
          <span className="text-white">{new Date(request.timeline.submitted).toLocaleDateString('ru-RU')}</span>
        </div>

        {request.estimatedDuration && (
          <div className="flex justify-between">
            <span className="text-slate-400">Длительность:</span>
            <span className="text-white">{request.estimatedDuration} мин</span>
          </div>
        )}
      </div>
      
      {request.assignedStaff && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">Назначен:</span>
          <span className="text-xs text-white font-medium line-clamp-1 max-w-[60%] text-right">
            {medicalStaff.find(s => s.id === request.assignedStaff)?.personalInfo.fullName}
          </span>
        </div>
      )}
    </BentoCard>
  );
};

// Новый компонент для поиска и фильтрации
const SearchAndFilter = ({ 
  onSearch, 
  onFilterChange,
  activeFilters,
  searchPlaceholder = "Поиск..."
}: {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  activeFilters: any;
  searchPlaceholder?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    onSearch(value);
  }, [onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 pl-11 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl transition-all duration-300"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <select 
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl transition-all duration-300"
          value={activeFilters.department || ''}
          onChange={(e) => onFilterChange({ ...activeFilters, department: e.target.value })}
        >
          <option value="">Все отделения</option>
          <option value="therapy">Терапия</option>
          <option value="surgery">Хирургия</option>
          <option value="cardiology">Кардиология</option>
          <option value="neurology">Неврология</option>
          <option value="diagnostic">Диагностика</option>
        </select>
        
        <select 
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl transition-all duration-300"
          value={activeFilters.status || ''}
          onChange={(e) => onFilterChange({ ...activeFilters, status: e.target.value })}
        >
          <option value="">Все статусы</option>
          <option value="active">Активен</option>
          <option value="discharged">Выписан</option>
          <option value="transferred">Переведен</option>
        </select>
      </div>
    </div>
  );
};

// Основной компонент дашборда
const PatientDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<MedicalStaff | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<MedicalAppointment | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MedicalRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'staff' | 'appointments' | 'requests'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '' });
  
  const currentTime = useClientTime();
  
  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.status === 'active').length;
    const inpatientCount = patients.filter(p => p.treatment.status === 'inpatient').length;
    const totalStaff = medicalStaff.length;
    const activeStaff = medicalStaff.filter(s => s.status === 'active').length;
    const pendingRequests = medicalRequests.filter(r => r.status === 'submitted' || r.status === 'reviewed').length;
    const todayAppointments = patients.flatMap(p => p.appointments.upcoming)
      .filter(a => a.date === new Date().toISOString().split('T')[0]).length;
    
    return {
      totalPatients,
      activePatients,
      inpatientCount,
      totalStaff,
      activeStaff,
      pendingRequests,
      todayAppointments
    };
  }, []);

  // Фильтрация данных с поиском
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = searchQuery === '' || 
        patient.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.treatment.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !filters.department || patient.treatment.department === filters.department;
      const matchesStatus = !filters.status || patient.status === filters.status;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchQuery, filters]);

  const filteredStaff = useMemo(() => {
    return medicalStaff.filter(staff => {
      const matchesSearch = searchQuery === '' || 
        staff.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.personalInfo.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !filters.department || staff.department === filters.department;
      
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, filters]);

  const activePatients = useMemo(() => 
    patients.filter(patient => patient.status === 'active'), 
  []);
  
  const upcomingAppointments = useMemo(() => 
    patients.flatMap(patient => 
      patient.appointments.upcoming.filter(appointment => 
        appointment.status === 'scheduled' || appointment.status === 'rescheduled'
      )
    ), 
  []);
  
  const pendingRequests = useMemo(() => 
    medicalRequests.filter(request => request.status === 'submitted' || request.status === 'reviewed'), 
  []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 lg:p-6">
      {/* Хедер */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Медицинский портал
            </h1>
            <p className="text-slate-400 text-lg">Управление пациентами и медицинскими услугами</p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <div className="text-2xl lg:text-3xl font-mono font-bold text-white mb-1">
              {currentTime}
            </div>
            <div className="text-slate-400 text-sm">
              {new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 overflow-x-auto">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊', count: stats.todayAppointments },
            { id: 'patients', label: 'Пациенты', icon: '👥', count: stats.totalPatients },
            { id: 'staff', label: 'Персонал', icon: '👨‍⚕️', count: stats.totalStaff },
            { id: 'appointments', label: 'Назначения', icon: '📅', count: upcomingAppointments.length },
            { id: 'requests', label: 'Запросы', icon: '📋', count: pendingRequests.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative min-w-max ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900' 
                    : 'bg-slate-600 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </motion.header>

      {/* Основной контент */}
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Всего пациентов"
                  value={stats.totalPatients}
                  change={2.5}
                  icon="👥"
                  color={COLORS.blue}
                  subtitle={`${stats.activePatients} активных`}
                  trend="up"
                  delay={0}
                />
                <StatCard
                  title="В стационаре"
                  value={stats.inpatientCount}
                  change={1.2}
                  icon="🏥"
                  color={COLORS.purple}
                  subtitle="на лечении"
                  trend="up"
                  delay={1}
                />
                <StatCard
                  title="Медперсонал"
                  value={stats.totalStaff}
                  change={0}
                  icon="👨‍⚕️"
                  color={COLORS.teal}
                  subtitle={`${stats.activeStaff} на смене`}
                  trend="neutral"
                  delay={2}
                />
                <StatCard
                  title="Ожидающие запросы"
                  value={stats.pendingRequests}
                  change={-1.8}
                  icon="📋"
                  color={COLORS.orange}
                  subtitle="требуют внимания"
                  trend="down"
                  delay={3}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Последние пациенты */}
                <BentoCard className="p-6" glowColor={COLORS.purple}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные пациенты</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                      onClick={() => setActiveTab('patients')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activePatients.slice(0, 4).map((patient, index) => (
                      <motion.div 
                        key={patient.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedPatient(patient)}
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(patient.personalInfo.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{patient.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">
                            {calculateAge(patient.personalInfo.birthDate)} лет • {patient.treatment.diagnosis}
                          </p>
                        </div>
                        <StatusBadge status={patient.status} type="patient" size="sm" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Ближайшие назначения */}
                <BentoCard className="p-6" glowColor={COLORS.orange}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Ближайшие назначения</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                      onClick={() => setActiveTab('appointments')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 4).map((appointment, index) => (
                      <motion.div 
                        key={appointment.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedAppointment(appointment)}
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm ${
                          appointment.type === 'surgery' ? 'bg-gradient-to-br from-rose-500 to-pink-500' :
                          appointment.type === 'consultation' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                          appointment.type === 'procedure' ? 'bg-gradient-to-br from-purple-500 to-violet-500' :
                          'bg-gradient-to-br from-slate-500 to-slate-600'
                        }`}>
                          {appointment.type[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{appointment.description}</h4>
                          <p className="text-slate-400 text-xs">
                            {appointment.date} в {appointment.time}
                          </p>
                        </div>
                        <StatusBadge status={appointment.status} type="appointment" size="sm" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              {/* Карты персонала */}
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Медицинский персонал</h3>
                  <button 
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                    onClick={() => setActiveTab('staff')}
                  >
                    Все →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medicalStaff.slice(0, 3).map((staff, index) => (
                    <StaffCard 
                      key={staff.id} 
                      staff={staff} 
                      onClick={() => setSelectedStaff(staff)}
                      delay={index}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.div>
          )}

          {activeTab === 'patients' && (
            <motion.div
              key="patients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Пациенты</h2>
                <p className="text-slate-400">Управление медицинскими картами пациентов</p>
              </div>
              
              <SearchAndFilter 
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                activeFilters={filters}
                searchPlaceholder="Поиск пациентов по имени или диагнозу..."
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPatients.map((patient, index) => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onClick={() => setSelectedPatient(patient)}
                    delay={index}
                  />
                ))}
              </div>

              {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-slate-400 text-lg">Пациенты не найдены</div>
                  <div className="text-slate-500 text-sm mt-2">Попробуйте изменить параметры поиска</div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Медицинский персонал</h2>
                <p className="text-slate-400">Команда врачей и медицинских специалистов</p>
              </div>
              
              <SearchAndFilter 
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                activeFilters={filters}
                searchPlaceholder="Поиск персонала по имени или специализации..."
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStaff.map((staff, index) => (
                  <StaffCard 
                    key={staff.id} 
                    staff={staff} 
                    onClick={() => setSelectedStaff(staff)}
                    delay={index}
                  />
                ))}
              </div>

              {filteredStaff.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-slate-400 text-lg">Персонал не найден</div>
                  <div className="text-slate-500 text-sm mt-2">Попробуйте изменить параметры поиска</div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Медицинские назначения</h2>
                <p className="text-slate-400">Управление консультациями, процедурами и операциями</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingAppointments.map((appointment, index) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onClick={() => setSelectedAppointment(appointment)}
                    delay={index}
                  />
                ))}
              </div>

              {upcomingAppointments.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-slate-400 text-lg">Нет предстоящих назначений</div>
                  <div className="text-slate-500 text-sm mt-2">Все назначения завершены или отменены</div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Медицинские запросы</h2>
                <p className="text-slate-400">Управление запросами на обследования и процедуры</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicalRequests.map((request, index) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onClick={() => setSelectedRequest(request)}
                    delay={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <Modal 
        isOpen={!!selectedPatient} 
        onClose={() => setSelectedPatient(null)}
        title={selectedPatient?.personalInfo.fullName}
        size="xl"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white">{formatDate(selectedPatient.personalInfo.birthDate)} ({calculateAge(selectedPatient.personalInfo.birthDate)} лет)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedPatient.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedPatient.personalInfo.email || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedPatient.personalInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Паспорт:</span>
                    <span className="text-white">{selectedPatient.personalInfo.passport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">СНИЛС:</span>
                    <span className="text-white">{selectedPatient.personalInfo.snils}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Полис:</span>
                    <span className="text-white">{selectedPatient.personalInfo.insurancePolicy}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Медицинская информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Группа крови:</span>
                    <span className="text-white">{selectedPatient.medicalInfo.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Инвалидность:</span>
                    <span className="text-white">{selectedPatient.medicalInfo.disability ? `Да (${selectedPatient.medicalInfo.disabilityGroup} гр.)` : 'Нет'}</span>
                  </div>
                  {selectedPatient.medicalInfo.height && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Рост/Вес/ИМТ:</span>
                      <span className="text-white">{selectedPatient.medicalInfo.height}см / {selectedPatient.medicalInfo.weight}кг / {selectedPatient.medicalInfo.bmi}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Аллергии:</span>
                    <div className="text-right">
                      {selectedPatient.medicalInfo.allergies.map((allergy, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1 inline-block ml-1">
                          {allergy}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Хронические заболевания:</span>
                    <div className="text-right">
                      {selectedPatient.medicalInfo.chronicDiseases.map((disease, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1 inline-block ml-1">
                          {disease}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Лекарства:</span>
                    <div className="text-right">
                      {selectedPatient.medicalInfo.currentMedications.map((med, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1 inline-block ml-1">
                          {med}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Лечение</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Диагноз:</span>
                    <span className="text-white text-right">{selectedPatient.treatment.diagnosis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус лечения:</span>
                    <StatusBadge status={selectedPatient.treatment.status} type="treatment" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Отделение:</span>
                    <StatusBadge status={selectedPatient.treatment.department} type="department" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Лечащий врач:</span>
                    <span className="text-white">{medicalStaff.find(s => s.id === selectedPatient.treatment.attendingDoctor)?.personalInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата поступления:</span>
                    <span className="text-white">{formatDate(selectedPatient.treatment.admissionDate)}</span>
                  </div>
                  {selectedPatient.treatment.dischargeDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Дата выписки:</span>
                      <span className="text-white">{formatDate(selectedPatient.treatment.dischargeDate)}</span>
                    </div>
                  )}
                  {selectedPatient.treatment.roomNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Палата/Койка:</span>
                      <span className="text-white">{selectedPatient.treatment.roomNumber}/{selectedPatient.treatment.bedNumber}</span>
                    </div>
                  )}
                  {selectedPatient.treatment.wardType && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Тип палаты:</span>
                      <StatusBadge status={selectedPatient.treatment.wardType} />
                    </div>
                  )}
                </div>
              </BentoCard>

              {selectedPatient.emergencyContact && (
                <BentoCard className="p-6" glowColor={COLORS.orange}>
                  <h4 className="text-lg font-semibold text-white mb-4">Экстренный контакт</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Имя:</span>
                      <span className="text-white">{selectedPatient.emergencyContact.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Телефон:</span>
                      <span className="text-white">{selectedPatient.emergencyContact.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Отношение:</span>
                      <span className="text-white">{selectedPatient.emergencyContact.relationship}</span>
                    </div>
                    {selectedPatient.emergencyContact.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white">{selectedPatient.emergencyContact.email}</span>
                      </div>
                    )}
                  </div>
                </BentoCard>
              )}
            </div>

            <BentoCard className="p-6" glowColor={COLORS.emerald}>
              <h4 className="text-lg font-semibold text-white mb-4">Предстоящие назначения</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPatient.appointments.upcoming.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onClick={() => setSelectedAppointment(appointment)}
                  />
                ))}
              </div>
            </BentoCard>

            {selectedPatient.appointments.completed.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.violet}>
                <h4 className="text-lg font-semibold text-white mb-4">Завершенные назначения</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPatient.appointments.completed.slice(0, 4).map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onClick={() => setSelectedAppointment(appointment)}
                    />
                  ))}
                </div>
              </BentoCard>
            )}

            {selectedPatient.notes && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm">{selectedPatient.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedStaff} 
        onClose={() => setSelectedStaff(null)}
        title={selectedStaff?.personalInfo.fullName}
        size="lg"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Контактная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedStaff.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedStaff.personalInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Должность:</span>
                    <StatusBadge status={selectedStaff.personalInfo.position} type="staff" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Специализация:</span>
                    <span className="text-white text-right">{selectedStaff.personalInfo.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Квалификация:</span>
                    <span className="text-white text-right">{selectedStaff.personalInfo.qualification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Опыт работы:</span>
                    <span className="text-white">{selectedStaff.personalInfo.experience} лет</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedStaff.status} type="staff" />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Расписание и контакты</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рабочие дни:</span>
                    <span className="text-white">{selectedStaff.schedule.days.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Часы работы:</span>
                    <span className="text-white">{selectedStaff.schedule.hours}</span>
                  </div>
                  {selectedStaff.schedule.shifts && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Смена:</span>
                      <span className="text-white capitalize">{selectedStaff.schedule.shifts}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Отделение:</span>
                    <StatusBadge status={selectedStaff.department} type="department" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Внутренний номер:</span>
                    <span className="text-white">{selectedStaff.contacts.internal}</span>
                  </div>
                  {selectedStaff.contacts.emergency && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Экстренный номер:</span>
                      <span className="text-white">{selectedStaff.contacts.emergency}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Показатели эффективности</h4>
              <div className="space-y-4">
                <ProgressBar 
                  value={selectedStaff.metrics.patientSatisfaction} 
                  label="Удовлетворенность пациентов" 
                  color={COLORS.emerald}
                  showValue={true}
                />
                <ProgressBar 
                  value={selectedStaff.metrics.onTimeAppointments} 
                  label="Пунктуальность назначений" 
                  color={COLORS.blue}
                  showValue={true}
                />
                <ProgressBar 
                  value={selectedStaff.metrics.successRate} 
                  label="Успешность процедур" 
                  color={COLORS.violet}
                  showValue={true}
                />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Завершено процедур:</span>
                  <span className="text-white font-semibold">{selectedStaff.metrics.completedProcedures}</span>
                </div>
              </div>
            </BentoCard>

            {selectedStaff.assignedPatients.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Назначенные пациенты</h4>
                <div className="space-y-3">
                  {selectedStaff.assignedPatients.map((patientId) => {
                    const patient = patients.find(p => p.id === patientId);
                    return patient ? (
                      <div 
                        key={patientId} 
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                            {getInitials(patient.personalInfo.fullName)}
                          </div>
                          <div>
                            <h5 className="text-white font-medium text-sm">{patient.personalInfo.fullName}</h5>
                            <p className="text-slate-400 text-xs">{patient.treatment.diagnosis}</p>
                          </div>
                        </div>
                        <StatusBadge status={patient.status} type="patient" size="sm" />
                      </div>
                    ) : null;
                  })}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedAppointment} 
        onClose={() => setSelectedAppointment(null)}
        title="Медицинское назначение"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип назначения:</span>
                    <StatusBadge status={selectedAppointment.type} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Врач:</span>
                    <span className="text-white">{medicalStaff.find(s => s.id === selectedAppointment.doctor)?.personalInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedAppointment.status} type="appointment" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Приоритет:</span>
                    <StatusBadge status={selectedAppointment.priority} type="urgency" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Отделение:</span>
                    <span className="text-white">{selectedAppointment.department}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Время и дата</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата:</span>
                    <span className="text-white">{formatDate(selectedAppointment.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Время:</span>
                    <span className="text-white">{selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Длительность:</span>
                    <span className="text-white">{selectedAppointment.duration} минут</span>
                  </div>
                  {selectedAppointment.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Место:</span>
                      <span className="text-white text-right">{selectedAppointment.location}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.purple}>
              <h4 className="text-lg font-semibold text-white mb-4">Описание назначения</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{selectedAppointment.description}</p>
            </BentoCard>

            {selectedAppointment.results && (
              <BentoCard className="p-6" glowColor={COLORS.emerald}>
                <h4 className="text-lg font-semibold text-white mb-4">Результаты</h4>
                <p className="text-slate-300 text-sm">{selectedAppointment.results}</p>
              </BentoCard>
            )}

            {selectedAppointment.recommendations && (
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Рекомендации</h4>
                <p className="text-slate-300 text-sm">{selectedAppointment.recommendations}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        title="Медицинский запрос"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о запросе</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип запроса:</span>
                    <StatusBadge status={selectedRequest.requestType} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedRequest.status} type="request" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Срочность:</span>
                    <StatusBadge status={selectedRequest.urgency} type="urgency" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Пациент:</span>
                    <span className="text-white text-right">
                      {patients.find(p => p.id === selectedRequest.patientId)?.personalInfo.fullName}
                    </span>
                  </div>
                  {selectedRequest.estimatedDuration && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Оцен. длительность:</span>
                      <span className="text-white">{selectedRequest.estimatedDuration} минут</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Таймлайн</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Подана:</span>
                    <span className="text-white">{formatDateTime(selectedRequest.timeline.submitted)}</span>
                  </div>
                  {selectedRequest.timeline.reviewed && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Рассмотрена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.reviewed)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.approved && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Одобрена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.approved)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.scheduled && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Запланирована:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.scheduled)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.completed && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Завершена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.completed)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Описание запроса</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{selectedRequest.description}</p>
            </BentoCard>

            {selectedRequest.requiredResources && selectedRequest.requiredResources.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.amber}>
                <h4 className="text-lg font-semibold text-white mb-4">Необходимые ресурсы</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.requiredResources.map((resource, index) => (
                    <span key={index} className="text-xs bg-white/10 text-slate-300 rounded-full px-3 py-1">
                      {resource}
                    </span>
                  ))}
                </div>
              </BentoCard>
            )}

            {selectedRequest.assignedStaff && (
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Ответственный сотрудник</h4>
                <div 
                  className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                  onClick={() => {
                    const staff = medicalStaff.find(s => s.id === selectedRequest.assignedStaff);
                    if (staff) setSelectedStaff(staff);
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    {getInitials(medicalStaff.find(s => s.id === selectedRequest.assignedStaff)?.personalInfo.fullName || '')}
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">
                      {medicalStaff.find(s => s.id === selectedRequest.assignedStaff)?.personalInfo.fullName}
                    </h5>
                    <p className="text-slate-400 text-sm">
                      {medicalStaff.find(s => s.id === selectedRequest.assignedStaff)?.personalInfo.specialization}
                    </p>
                  </div>
                </div>
              </BentoCard>
            )}

            {selectedRequest.notes && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm">{selectedRequest.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;