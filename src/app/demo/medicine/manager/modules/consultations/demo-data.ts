// src/app/demo/medicine/manager/modules/consultations/demo-data.ts

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodType: string;
  insurance: string;
  medicalHistory: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  room: string;
  schedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  workingHours: {
    start: string;
    end: string;
  };
  qualifications: string[];
  experience: number;
  photo?: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: 'consultation' | 'examination' | 'procedure' | 'surgery' | 'diagnostic';
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'consultation' | 'examination' | 'procedure' | 'surgery' | 'diagnostic';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'routine' | 'urgent' | 'emergency';
  room: string;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  insurance: string;
  createdAt: string;
  updatedAt: string;
  followUpRequired: boolean;
  followUpDate?: string;
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  labTests?: string[];
  images?: string[];
}

// Демо данные пациентов
export const patients: Patient[] = [
  {
    id: 'pat-001',
    name: 'Иванов Алексей Петрович',
    phone: '+7 (912) 345-67-89',
    email: 'alexey.ivanov@email.com',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    bloodType: 'A+',
    insurance: 'ОМС',
    medicalHistory: ['Гипертония', 'Сахарный диабет 2 типа'],
    allergies: ['Пенициллин', 'Пыльца'],
    emergencyContact: {
      name: 'Иванова Мария',
      phone: '+7 (912) 345-67-90',
      relationship: 'Жена'
    }
  },
  {
    id: 'pat-002',
    name: 'Петрова Елена Владимировна',
    phone: '+7 (912) 345-67-91',
    email: 'elena.petrova@email.com',
    dateOfBirth: '1990-07-22',
    gender: 'female',
    bloodType: 'O+',
    insurance: 'ДМС',
    medicalHistory: ['Мигрень', 'Астма'],
    allergies: ['Аспирин', 'Шерсть животных'],
    emergencyContact: {
      name: 'Петров Дмитрий',
      phone: '+7 (912) 345-67-92',
      relationship: 'Муж'
    }
  },
  {
    id: 'pat-003',
    name: 'Сидоров Михаил Александрович',
    phone: '+7 (912) 345-67-93',
    email: 'mikhail.sidorov@email.com',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    bloodType: 'B+',
    insurance: 'ОМС',
    medicalHistory: ['Артрит', 'Гастрит'],
    allergies: ['Морепродукты'],
    emergencyContact: {
      name: 'Сидорова Ольга',
      phone: '+7 (912) 345-67-94',
      relationship: 'Жена'
    }
  },
  {
    id: 'pat-004',
    name: 'Козлова Анна Сергеевна',
    phone: '+7 (912) 345-67-95',
    email: 'anna.kozlova@email.com',
    dateOfBirth: '1995-05-14',
    gender: 'female',
    bloodType: 'AB+',
    insurance: 'ДМС',
    medicalHistory: ['Анемия'],
    allergies: ['Лактоза', 'Пыль'],
    emergencyContact: {
      name: 'Козлов Сергей',
      phone: '+7 (912) 345-67-96',
      relationship: 'Отец'
    }
  },
  {
    id: 'pat-005',
    name: 'Николаев Дмитрий Игоревич',
    phone: '+7 (912) 345-67-97',
    email: 'dmitry.nikolaev@email.com',
    dateOfBirth: '1982-09-08',
    gender: 'male',
    bloodType: 'A-',
    insurance: 'ОМС',
    medicalHistory: ['Гипертония', 'Остеохондроз'],
    allergies: ['Пенициллин'],
    emergencyContact: {
      name: 'Николаева Ирина',
      phone: '+7 (912) 345-67-98',
      relationship: 'Жена'
    }
  },
  {
    id: 'pat-006',
    name: 'Федорова Светлана Викторовна',
    phone: '+7 (912) 345-67-99',
    email: 'svetlana.fedorova@email.com',
    dateOfBirth: '1988-12-03',
    gender: 'female',
    bloodType: 'O-',
    insurance: 'ДМС',
    medicalHistory: ['Миома', 'Варикоз'],
    allergies: ['Йод', 'Антибиотики'],
    emergencyContact: {
      name: 'Федоров Виктор',
      phone: '+7 (912) 345-68-00',
      relationship: 'Муж'
    }
  },
  {
    id: 'pat-007',
    name: 'Васильев Артем Олегович',
    phone: '+7 (912) 345-68-01',
    email: 'artem.vasiliev@email.com',
    dateOfBirth: '1992-02-18',
    gender: 'male',
    bloodType: 'B-',
    insurance: 'ОМС',
    medicalHistory: ['Спортивная травма колена'],
    allergies: [],
    emergencyContact: {
      name: 'Васильева Елена',
      phone: '+7 (912) 345-68-02',
      relationship: 'Мать'
    }
  },
  {
    id: 'pat-008',
    name: 'Морозова Татьяна Дмитриевна',
    phone: '+7 (912) 345-68-03',
    email: 'tatiana.morozova@email.com',
    dateOfBirth: '1975-06-25',
    gender: 'female',
    bloodType: 'A+',
    insurance: 'ДМС',
    medicalHistory: ['Диабет', 'Гипертония', 'Артрит'],
    allergies: ['Мед', 'Орехи'],
    emergencyContact: {
      name: 'Морозов Дмитрий',
      phone: '+7 (912) 345-68-04',
      relationship: 'Муж'
    }
  }
];

// Демо данные врачей
export const doctors: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Смирнов Александр Иванович',
    specialization: 'Кардиолог',
    phone: '+7 (912) 100-00-01',
    email: 'a.smirnov@clinic.ru',
    room: '101',
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    qualifications: ['Высшая категория', 'Кандидат медицинских наук'],
    experience: 15
  },
  {
    id: 'doc-002',
    name: 'Кузнецова Ольга Петровна',
    specialization: 'Невролог',
    phone: '+7 (912) 100-00-02',
    email: 'o.kuznetsova@clinic.ru',
    room: '205',
    schedule: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: true,
      friday: false,
      saturday: true,
      sunday: false
    },
    workingHours: {
      start: '08:00',
      end: '16:00'
    },
    qualifications: ['Первая категория', 'Доктор медицинских наук'],
    experience: 12
  },
  {
    id: 'doc-003',
    name: 'Попов Сергей Владимирович',
    specialization: 'Хирург',
    phone: '+7 (912) 100-00-03',
    email: 's.popov@clinic.ru',
    room: '310',
    schedule: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false
    },
    workingHours: {
      start: '10:00',
      end: '18:00'
    },
    qualifications: ['Высшая категория', 'Профессор'],
    experience: 20
  },
  {
    id: 'doc-004',
    name: 'Лебедева Екатерина Александровна',
    specialization: 'Гинеколог',
    phone: '+7 (912) 100-00-04',
    email: 'e.lebedeva@clinic.ru',
    room: '415',
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    qualifications: ['Вторая категория'],
    experience: 8
  },
  {
    id: 'doc-005',
    name: 'Новиков Андрей Михайлович',
    specialization: 'Терапевт',
    phone: '+7 (912) 100-00-05',
    email: 'a.novikov@clinic.ru',
    room: '102',
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    workingHours: {
      start: '08:00',
      end: '16:00'
    },
    qualifications: ['Первая категория'],
    experience: 10
  },
  {
    id: 'doc-006',
    name: 'Фролова Марина Викторовна',
    specialization: 'Педиатр',
    phone: '+7 (912) 100-00-06',
    email: 'm.frolova@clinic.ru',
    room: '216',
    schedule: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    qualifications: ['Высшая категория'],
    experience: 14
  }
];

// Демо данные кабинетов
export const rooms: Room[] = [
  {
    id: 'room-001',
    number: '101',
    floor: 1,
    type: 'consultation',
    equipment: ['Стол', 'Стулья', 'Компьютер', 'Тонометр'],
    status: 'available'
  },
  {
    id: 'room-002',
    number: '102',
    floor: 1,
    type: 'consultation',
    equipment: ['Стол', 'Стулья', 'Компьютер', 'Тонометр', 'ЭКГ'],
    status: 'available'
  },
  {
    id: 'room-003',
    number: '205',
    floor: 2,
    type: 'consultation',
    equipment: ['Стол', 'Стулья', 'Компьютер', 'Неврологический молоточек'],
    status: 'available'
  },
  {
    id: 'room-004',
    number: '310',
    floor: 3,
    type: 'surgery',
    equipment: ['Операционный стол', 'Хирургические инструменты', 'Анестезиологический аппарат'],
    status: 'maintenance'
  },
  {
    id: 'room-005',
    number: '415',
    floor: 4,
    type: 'examination',
    equipment: ['Гинекологическое кресло', 'УЗИ аппарат', 'Кольпоскоп'],
    status: 'available'
  },
  {
    id: 'room-006',
    number: '216',
    floor: 2,
    type: 'consultation',
    equipment: ['Стол', 'Стулья', 'Компьютер', 'Педиатрические весы', 'Ростомер'],
    status: 'occupied'
  },
  {
    id: 'room-007',
    number: '105',
    floor: 1,
    type: 'diagnostic',
    equipment: ['Рентген аппарат', 'Компьютер', 'Защитный экран'],
    status: 'available'
  },
  {
    id: 'room-008',
    number: '208',
    floor: 2,
    type: 'procedure',
    equipment: ['Процедурная кушетка', 'Шприцы', 'Капельницы', 'Перевязочный материал'],
    status: 'cleaning'
  }
];

// Демо данные консультаций
export const appointments: Appointment[] = [
  {
    id: 'app-001',
    patientId: 'pat-001',
    patientName: 'Иванов Алексей Петрович',
    patientPhone: '+7 (912) 345-67-89',
    patientEmail: 'alexey.ivanov@email.com',
    doctorId: 'doc-001',
    doctorName: 'Смирнов Александр Иванович',
    specialization: 'Кардиолог',
    date: '2024-01-24',
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    priority: 'routine',
    room: '101',
    reason: 'Плановый осмотр, контроль артериального давления',
    insurance: 'ОМС',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
    followUpRequired: true,
    followUpDate: '2024-02-24'
  },
  {
    id: 'app-002',
    patientId: 'pat-002',
    patientName: 'Петрова Елена Владимировна',
    patientPhone: '+7 (912) 345-67-91',
    patientEmail: 'elena.petrova@email.com',
    doctorId: 'doc-002',
    doctorName: 'Кузнецова Ольга Петровна',
    specialization: 'Невролог',
    date: '2024-01-24',
    startTime: '10:00',
    endTime: '10:45',
    duration: 45,
    type: 'consultation',
    status: 'in-progress',
    priority: 'urgent',
    room: '205',
    reason: 'Сильные головные боли, головокружение',
    diagnosis: 'Мигрень',
    treatment: 'Назначены препараты для купирования приступов',
    notes: 'Рекомендовано МРТ головного мозга',
    insurance: 'ДМС',
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-24T09:45:00Z',
    followUpRequired: true,
    medications: [
      {
        name: 'Суматриптан',
        dosage: '50 мг',
        frequency: 'При необходимости',
        duration: '1 месяц'
      }
    ],
    labTests: ['Общий анализ крови', 'Биохимический анализ крови']
  },
  {
    id: 'app-003',
    patientId: 'pat-003',
    patientName: 'Сидоров Михаил Александрович',
    patientPhone: '+7 (912) 345-67-93',
    patientEmail: 'mikhail.sidorov@email.com',
    doctorId: 'doc-003',
    doctorName: 'Попов Сергей Владимирович',
    specialization: 'Хирург',
    date: '2024-01-24',
    startTime: '11:30',
    endTime: '12:30',
    duration: 60,
    type: 'surgery',
    status: 'scheduled',
    priority: 'routine',
    room: '310',
    reason: 'Плановое удаление липомы на спине',
    insurance: 'ОМС',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-23T16:20:00Z',
    followUpRequired: true,
    followUpDate: '2024-01-31'
  },
  {
    id: 'app-004',
    patientId: 'pat-004',
    patientName: 'Козлова Анна Сергеевна',
    patientPhone: '+7 (912) 345-67-95',
    patientEmail: 'anna.kozlova@email.com',
    doctorId: 'doc-004',
    doctorName: 'Лебедева Екатерина Александровна',
    specialization: 'Гинеколог',
    date: '2024-01-24',
    startTime: '13:00',
    endTime: '13:30',
    duration: 30,
    type: 'examination',
    status: 'scheduled',
    priority: 'routine',
    room: '415',
    reason: 'Плановый гинекологический осмотр',
    insurance: 'ДМС',
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-18T11:15:00Z',
    followUpRequired: false
  },
  {
    id: 'app-005',
    patientId: 'pat-005',
    patientName: 'Николаев Дмитрий Игоревич',
    patientPhone: '+7 (912) 345-67-97',
    patientEmail: 'dmitry.nikolaev@email.com',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    specialization: 'Терапевт',
    date: '2024-01-24',
    startTime: '14:00',
    endTime: '14:20',
    duration: 20,
    type: 'consultation',
    status: 'completed',
    priority: 'routine',
    room: '102',
    reason: 'Острая респираторная инфекция',
    diagnosis: 'ОРВИ',
    treatment: 'Симптоматическое лечение, постельный режим',
    notes: 'Температура 38.2°C, кашель, насморк',
    insurance: 'ОМС',
    createdAt: '2024-01-23T18:30:00Z',
    updatedAt: '2024-01-24T14:25:00Z',
    followUpRequired: false,
    medications: [
      {
        name: 'Парацетамол',
        dosage: '500 мг',
        frequency: '3 раза в день',
        duration: '5 дней'
      }
    ]
  },
  {
    id: 'app-006',
    patientId: 'pat-006',
    patientName: 'Федорова Светлана Викторовна',
    patientPhone: '+7 (912) 345-67-99',
    patientEmail: 'svetlana.fedorova@email.com',
    doctorId: 'doc-006',
    doctorName: 'Фролова Марина Викторовна',
    specialization: 'Педиатр',
    date: '2024-01-24',
    startTime: '15:00',
    endTime: '15:30',
    duration: 30,
    type: 'consultation',
    status: 'cancelled',
    priority: 'routine',
    room: '216',
    reason: 'Профилактический осмотр ребенка',
    insurance: 'ДМС',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-23T20:15:00Z',
    followUpRequired: false
  },
  {
    id: 'app-007',
    patientId: 'pat-007',
    patientName: 'Васильев Артем Олегович',
    patientPhone: '+7 (912) 345-68-01',
    patientEmail: 'artem.vasiliev@email.com',
    doctorId: 'doc-003',
    doctorName: 'Попов Сергей Владимирович',
    specialization: 'Хирург',
    date: '2024-01-24',
    startTime: '16:00',
    endTime: '16:45',
    duration: 45,
    type: 'consultation',
    status: 'scheduled',
    priority: 'urgent',
    room: '310',
    reason: 'Острая боль в колене после спортивной травмы',
    insurance: 'ОМС',
    createdAt: '2024-01-24T08:30:00Z',
    updatedAt: '2024-01-24T08:30:00Z',
    followUpRequired: true
  },
  {
    id: 'app-008',
    patientId: 'pat-008',
    patientName: 'Морозова Татьяна Дмитриевна',
    patientPhone: '+7 (912) 345-68-03',
    patientEmail: 'tatiana.morozova@email.com',
    doctorId: 'doc-001',
    doctorName: 'Смирнов Александр Иванович',
    specialization: 'Кардиолог',
    date: '2024-01-25',
    startTime: '09:30',
    endTime: '10:15',
    duration: 45,
    type: 'consultation',
    status: 'scheduled',
    priority: 'routine',
    room: '101',
    reason: 'Контроль артериального давления, коррекция терапии',
    insurance: 'ДМС',
    createdAt: '2024-01-22T16:45:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    followUpRequired: true
  },
  {
    id: 'app-009',
    patientId: 'pat-001',
    patientName: 'Иванов Алексей Петрович',
    patientPhone: '+7 (912) 345-67-89',
    patientEmail: 'alexey.ivanov@email.com',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    specialization: 'Терапевт',
    date: '2024-01-25',
    startTime: '11:00',
    endTime: '11:30',
    duration: 30,
    type: 'diagnostic',
    status: 'scheduled',
    priority: 'routine',
    room: '105',
    reason: 'Ежегодный профилактический осмотр',
    insurance: 'ОМС',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    followUpRequired: false
  },
  {
    id: 'app-010',
    patientId: 'pat-002',
    patientName: 'Петрова Елена Владимировна',
    patientPhone: '+7 (912) 345-67-91',
    patientEmail: 'elena.petrova@email.com',
    doctorId: 'doc-002',
    doctorName: 'Кузнецова Ольга Петровна',
    specialization: 'Невролог',
    date: '2024-01-25',
    startTime: '14:00',
    endTime: '14:45',
    duration: 45,
    type: 'consultation',
    status: 'scheduled',
    priority: 'urgent',
    room: '205',
    reason: 'Обсуждение результатов МРТ',
    insurance: 'ДМС',
    createdAt: '2024-01-24T15:20:00Z',
    updatedAt: '2024-01-24T15:20:00Z',
    followUpRequired: true
  },
  {
    id: 'app-011',
    patientId: 'pat-004',
    patientName: 'Козлова Анна Сергеевна',
    patientPhone: '+7 (912) 345-67-95',
    patientEmail: 'anna.kozlova@email.com',
    doctorId: 'doc-004',
    doctorName: 'Лебедева Екатерина Александровна',
    specialization: 'Гинеколог',
    date: '2024-01-26',
    startTime: '10:30',
    endTime: '11:15',
    duration: 45,
    type: 'procedure',
    status: 'scheduled',
    priority: 'routine',
    room: '208',
    reason: 'Забор анализов',
    insurance: 'ДМС',
    createdAt: '2024-01-24T13:10:00Z',
    updatedAt: '2024-01-24T13:10:00Z',
    followUpRequired: true
  },
  {
    id: 'app-012',
    patientId: 'pat-007',
    patientName: 'Васильев Артем Олегович',
    patientPhone: '+7 (912) 345-68-01',
    patientEmail: 'artem.vasiliev@email.com',
    doctorId: 'doc-003',
    doctorName: 'Попов Сергей Владимирович',
    specialization: 'Хирург',
    date: '2024-01-26',
    startTime: '13:00',
    endTime: '14:00',
    duration: 60,
    type: 'surgery',
    status: 'scheduled',
    priority: 'emergency',
    room: '310',
    reason: 'Артроскопия коленного сустава',
    insurance: 'ОМС',
    createdAt: '2024-01-24T16:45:00Z',
    updatedAt: '2024-01-24T16:45:00Z',
    followUpRequired: true,
    followUpDate: '2024-02-02'
  },
  {
    id: 'app-013',
    patientId: 'pat-003',
    patientName: 'Сидоров Михаил Александрович',
    patientPhone: '+7 (912) 345-67-93',
    patientEmail: 'mikhail.sidorov@email.com',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    specialization: 'Терапевт',
    date: '2024-01-23',
    startTime: '15:00',
    endTime: '15:30',
    duration: 30,
    type: 'consultation',
    status: 'completed',
    priority: 'routine',
    room: '102',
    reason: 'Боль в желудке, изжога',
    diagnosis: 'Обострение гастрита',
    treatment: 'Диета, антацидные препараты',
    notes: 'Рекомендована гастроскопия',
    insurance: 'ОМС',
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-23T15:35:00Z',
    followUpRequired: true,
    followUpDate: '2024-02-06',
    medications: [
      {
        name: 'Омепразол',
        dosage: '20 мг',
        frequency: '2 раза в день',
        duration: '14 дней'
      }
    ]
  },
  {
    id: 'app-014',
    patientId: 'pat-006',
    patientName: 'Федорова Светлана Викторовна',
    patientPhone: '+7 (912) 345-67-99',
    patientEmail: 'svetlana.fedorova@email.com',
    doctorId: 'doc-001',
    doctorName: 'Смирнов Александр Иванович',
    specialization: 'Кардиолог',
    date: '2024-01-23',
    startTime: '16:30',
    endTime: '17:15',
    duration: 45,
    type: 'consultation',
    status: 'no-show',
    priority: 'routine',
    room: '101',
    reason: 'Консультация по результатам холтеровского мониторирования',
    insurance: 'ДМС',
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-23T17:30:00Z',
    followUpRequired: true
  },
  {
    id: 'app-015',
    patientId: 'pat-005',
    patientName: 'Николаев Дмитрий Игоревич',
    patientPhone: '+7 (912) 345-67-97',
    patientEmail: 'dmitry.nikolaev@email.com',
    doctorId: 'doc-002',
    doctorName: 'Кузнецова Ольга Петровна',
    specialization: 'Невролог',
    date: '2024-01-27',
    startTime: '09:00',
    endTime: '09:45',
    duration: 45,
    type: 'consultation',
    status: 'scheduled',
    priority: 'urgent',
    room: '205',
    reason: 'Онемение в левой руке, головокружение',
    insurance: 'ОМС',
    createdAt: '2024-01-24T17:20:00Z',
    updatedAt: '2024-01-24T17:20:00Z',
    followUpRequired: true
  }
];

// Вспомогательные функции
export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export const getRoomByNumber = (number: string): Room | undefined => {
  return rooms.find(room => room.number === number);
};

export const getAppointmentsByDate = (date: string): Appointment[] => {
  return appointments.filter(appointment => appointment.date === date);
};

export const getAppointmentsByDoctor = (doctorId: string): Appointment[] => {
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getAppointmentsByStatus = (status: Appointment['status']): Appointment[] => {
  return appointments.filter(appointment => appointment.status === status);
};

export const getUpcomingAppointments = (limit?: number): Appointment[] => {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments
    .filter(appointment => appointment.date >= today && appointment.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
};

export const getUrgentAppointments = (): Appointment[] => {
  return appointments.filter(appointment => 
    appointment.priority === 'urgent' && 
    appointment.status === 'scheduled'
  );
};