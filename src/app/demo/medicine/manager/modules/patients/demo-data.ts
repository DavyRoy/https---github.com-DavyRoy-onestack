export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientBirthDate?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'examination' | 'procedure' | 'surgery' | 'diagnostic';
  priority: 'routine' | 'urgent' | 'emergency';
  notes?: string;
  room?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  insurance?: string;
  reason?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  color: string;
  email: string;
  phone: string;
  room: string;
  workingHours: {
    start: string;
    end: string;
  };
  available: boolean;
  rating: number;
  experience: number;
  education: string[];
  photo?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: 'male' | 'female';
  insurance: string;
  medicalHistory: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: string;
  bloodType?: string;
  lastCheckup?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'therapist' | 'cardiology' | 'neurology' | 'ophthalmology' | 'procedure' | 'surgery' | 'emergency';
  floor: number;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance';
}

export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    color: '#3B82F6',
    email: 'a.ivanov@clinic.ru',
    phone: '+7 (495) 123-45-67',
    room: '204',
    workingHours: { start: '09:00', end: '18:00' },
    available: true,
    rating: 4.8,
    experience: 12,
    education: ['МГМУ им. Сеченова', 'Ординатура по терапии']
  },
  {
    id: 'doc-2',
    name: 'Петрова Мария Игоревна',
    specialization: 'Кардиолог',
    color: '#10B981',
    email: 'm.petrova@clinic.ru',
    phone: '+7 (495) 123-45-68',
    room: '105',
    workingHours: { start: '08:00', end: '16:00' },
    available: true,
    rating: 4.9,
    experience: 15,
    education: ['РНИМУ им. Пирогова', 'Докторская по кардиологии']
  },
  {
    id: 'doc-3',
    name: 'Сидоров Владимир Петрович',
    specialization: 'Невролог',
    color: '#8B5CF6',
    email: 'v.sidorov@clinic.ru',
    phone: '+7 (495) 123-45-69',
    room: '312',
    workingHours: { start: '10:00', end: '19:00' },
    available: true,
    rating: 4.7,
    experience: 10,
    education: ['СПбГМУ им. Павлова', 'Стажировка в Германии']
  },
  {
    id: 'doc-4',
    name: 'Козлова Елена Викторовна',
    specialization: 'Офтальмолог',
    color: '#F59E0B',
    email: 'e.kozlova@clinic.ru',
    phone: '+7 (495) 123-45-70',
    room: '208',
    workingHours: { start: '09:00', end: '17:00' },
    available: false,
    rating: 4.6,
    experience: 8,
    education: ['МГМСУ им. Евдокимова', 'Курсы микрохирургии']
  },
  {
    id: 'doc-5',
    name: 'Николаев Дмитрий Олегович',
    specialization: 'Хирург',
    color: '#EF4444',
    email: 'd.nikolaev@clinic.ru',
    phone: '+7 (495) 123-45-71',
    room: '401',
    workingHours: { start: '08:30', end: '17:30' },
    available: true,
    rating: 4.9,
    experience: 18,
    education: ['НГМУ', 'Стажировка в Швейцарии']
  },
  {
    id: 'doc-6',
    name: 'Орлова Светлана Михайловна',
    specialization: 'Педиатр',
    color: '#EC4899',
    email: 's.orlova@clinic.ru',
    phone: '+7 (495) 123-45-72',
    room: '115',
    workingHours: { start: '09:00', end: '18:00' },
    available: true,
    rating: 4.8,
    experience: 11,
    education: ['РУДН', 'Специализация по педиатрии']
  },
  {
    id: 'doc-7',
    name: 'Громов Андрей Викторович',
    specialization: 'Травматолог',
    color: '#8B5CF6',
    email: 'a.gromov@clinic.ru',
    phone: '+7 (495) 123-45-73',
    room: '305',
    workingHours: { start: '08:00', end: '17:00' },
    available: true,
    rating: 4.7,
    experience: 14,
    education: ['КГМУ', 'Ординатура по травматологии']
  },
  {
    id: 'doc-8',
    name: 'Федорова Ольга Дмитриевна',
    specialization: 'Гинеколог',
    color: '#F59E0B',
    email: 'o.fedorova@clinic.ru',
    phone: '+7 (495) 123-45-74',
    room: '210',
    workingHours: { start: '09:30', end: '18:30' },
    available: true,
    rating: 4.9,
    experience: 16,
    education: ['МГМУ им. Сеченова', 'Кандидат медицинских наук']
  }
];

export const patients: Patient[] = [
  {
    id: 'p123',
    name: 'Смирнов Алексей Владимирович',
    phone: '+7 (999) 123-45-67',
    email: 'alex.smirnov@mail.ru',
    birthDate: '1985-03-15',
    gender: 'male',
    insurance: 'Полис ОМС №1234567890',
    medicalHistory: ['Гипертония', 'Сахарный диабет 2 типа', 'Ожирение 1 степени'],
    allergies: ['Пенициллин', 'Аспирин', 'Пыльца берёзы'],
    emergencyContact: {
      name: 'Смирнова Ольга Ивановна',
      phone: '+7 (999) 765-43-21',
      relationship: 'Жена'
    },
    address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
    bloodType: 'A+',
    lastCheckup: '2024-01-10'
  },
  {
    id: 'p124',
    name: 'Петрова Ольга Сергеевна',
    phone: '+7 (999) 234-56-78',
    email: 'olga.petrova@gmail.com',
    birthDate: '1978-07-22',
    gender: 'female',
    insurance: 'Полис ДМС №0987654321',
    medicalHistory: ['Аритмия', 'ИБС', 'Гипертония 2 степени'],
    allergies: ['Йод', 'Морепродукты'],
    emergencyContact: {
      name: 'Петров Игорь Владимирович',
      phone: '+7 (999) 876-54-32',
      relationship: 'Муж'
    },
    address: 'г. Москва, пр. Мира, д. 89, кв. 12',
    bloodType: 'B+',
    lastCheckup: '2024-01-15'
  },
  {
    id: 'p125',
    name: 'Козлов Дмитрий Александрович',
    phone: '+7 (999) 345-67-89',
    email: 'd.kozlov@yandex.ru',
    birthDate: '1990-11-30',
    gender: 'male',
    insurance: 'Полис ОМС №4567890123',
    medicalHistory: ['Мигрень', 'Вегетососудистая дистония'],
    allergies: ['Пыльца', 'Кошачья шерсть', 'Арахис'],
    emergencyContact: {
      name: 'Козлова Анна Дмитриевна',
      phone: '+7 (999) 987-65-43',
      relationship: 'Сестра'
    },
    address: 'г. Москва, ул. Пушкина, д. 23, кв. 7',
    bloodType: 'O+',
    lastCheckup: '2023-12-20'
  },
  {
    id: 'p126',
    name: 'Новикова Ирина Петровна',
    phone: '+7 (999) 456-78-90',
    email: 'i.novikova@mail.ru',
    birthDate: '1982-05-18',
    gender: 'female',
    insurance: 'Полис ДМС №5678901234',
    medicalHistory: ['Гипертония', 'Остеохондроз', 'Гастрит'],
    allergies: ['Морепродукты', 'Цитрусовые'],
    emergencyContact: {
      name: 'Новиков Андрей Сергеевич',
      phone: '+7 (999) 098-76-54',
      relationship: 'Муж'
    },
    address: 'г. Москва, ул. Гагарина, д. 45, кв. 89',
    bloodType: 'AB+',
    lastCheckup: '2024-01-08'
  },
  {
    id: 'p127',
    name: 'Федоров Сергей Николаевич',
    phone: '+7 (999) 567-89-01',
    email: 's.fedorov@gmail.com',
    birthDate: '1975-12-10',
    gender: 'male',
    insurance: 'Полис ОМС №6789012345',
    medicalHistory: ['ИБС', 'Стенокардия', 'Перенесённый инфаркт (2019)'],
    allergies: ['Новокаин'],
    emergencyContact: {
      name: 'Федорова Елена Викторовна',
      phone: '+7 (999) 111-22-33',
      relationship: 'Жена'
    },
    address: 'г. Москва, ул. Чехова, д. 67, кв. 15',
    bloodType: 'A-',
    lastCheckup: '2024-01-12'
  },
  {
    id: 'p128',
    name: 'Морозова Анна Викторовна',
    phone: '+7 (999) 678-90-12',
    email: 'a.morozova@mail.ru',
    birthDate: '1988-09-05',
    gender: 'female',
    insurance: 'Полис ДМС №7890123456',
    medicalHistory: ['Мигрень', 'Синдром хронической усталости'],
    allergies: ['Шоколад', 'Клубника'],
    emergencyContact: {
      name: 'Морозов Денис Олегович',
      phone: '+7 (999) 222-33-44',
      relationship: 'Муж'
    },
    address: 'г. Москва, пр. Вернадского, д. 78, кв. 23',
    bloodType: 'B-',
    lastCheckup: '2023-11-30'
  },
  {
    id: 'p129',
    name: 'Волков Павел Игоревич',
    phone: '+7 (999) 789-01-23',
    email: 'p.volkov@yandex.ru',
    birthDate: '1993-02-28',
    gender: 'male',
    insurance: 'Полис ОМС №8901234567',
    medicalHistory: ['Бронхиальная астма', 'Аллергический ринит'],
    allergies: ['Пыль', 'Плесень', 'Шерсть животных'],
    emergencyContact: {
      name: 'Волкова Марина Сергеевна',
      phone: '+7 (999) 333-44-55',
      relationship: 'Мать'
    },
    address: 'г. Москва, ул. Тверская, д. 34, кв. 56',
    bloodType: 'O+',
    lastCheckup: '2024-01-05'
  },
  {
    id: 'p130',
    name: 'Лебедева Мария Олеговна',
    phone: '+7 (999) 890-12-34',
    email: 'm.lebedeva@gmail.com',
    birthDate: '1979-06-14',
    gender: 'female',
    insurance: 'Полис ДМС №9012345678',
    medicalHistory: ['Гипотиреоз', 'Остеопороз'],
    allergies: ['Лактоза', 'Глютен'],
    emergencyContact: {
      name: 'Лебедев Алексей Петрович',
      phone: '+7 (999) 444-55-66',
      relationship: 'Муж'
    },
    address: 'г. Москва, ул. Садовая, д. 12, кв. 9',
    bloodType: 'A+',
    lastCheckup: '2023-12-15'
  },
  {
    id: 'p131',
    name: 'Громов Андрей Викторович',
    phone: '+7 (999) 901-23-45',
    email: 'a.gromov@mail.ru',
    birthDate: '1980-04-25',
    gender: 'male',
    insurance: 'Полис ОМС №0123456789',
    medicalHistory: ['Грыжа позвоночника', 'Протрузии'],
    allergies: ['Мёд', 'Орехи'],
    emergencyContact: {
      name: 'Громова Светлана Ивановна',
      phone: '+7 (999) 555-66-77',
      relationship: 'Жена'
    },
    address: 'г. Москва, ул. Кутузовская, д. 56, кв. 18',
    bloodType: 'B+',
    lastCheckup: '2023-10-20'
  },
  {
    id: 'p132',
    name: 'Соколова Екатерина Дмитриевна',
    phone: '+7 (999) 012-34-56',
    email: 'e.sokolova@gmail.com',
    birthDate: '1995-08-12',
    gender: 'female',
    insurance: 'Полис ОМС №1234509876',
    medicalHistory: ['Анемия', 'Вегетососудистая дистония'],
    allergies: ['Антибиотики тетрациклинового ряда'],
    emergencyContact: {
      name: 'Соколов Дмитрий Александрович',
      phone: '+7 (999) 666-77-88',
      relationship: 'Отец'
    },
    address: 'г. Москва, ул. Ломоносова, д. 89, кв. 34',
    bloodType: 'O-',
    lastCheckup: '2024-01-18'
  },
  {
    id: 'p133',
    name: 'Кузнецов Илья Сергеевич',
    phone: '+7 (999) 112-23-34',
    email: 'i.kuznetsov@yandex.ru',
    birthDate: '1987-11-03',
    gender: 'male',
    insurance: 'Полис ДМС №2345610987',
    medicalHistory: ['Гастрит', 'Дуоденит'],
    allergies: ['Яйца', 'Молочные продукты'],
    emergencyContact: {
      name: 'Кузнецова Ольга Викторовна',
      phone: '+7 (999) 777-88-99',
      relationship: 'Жена'
    },
    address: 'г. Москва, ул. Профсоюзная, д. 45, кв. 67',
    bloodType: 'AB-',
    lastCheckup: '2023-09-25'
  },
  {
    id: 'p134',
    name: 'Попова Виктория Андреевна',
    phone: '+7 (999) 223-34-45',
    email: 'v.popova@mail.ru',
    birthDate: '1991-03-22',
    gender: 'female',
    insurance: 'Полис ДМС №3456721098',
    medicalHistory: ['Миома матки', 'Эндометриоз'],
    allergies: ['Соя', 'Грибы'],
    emergencyContact: {
      name: 'Попов Андрей Николаевич',
      phone: '+7 (999) 888-99-00',
      relationship: 'Муж'
    },
    address: 'г. Москва, ул. Цветной бульвар, д. 23, кв. 11',
    bloodType: 'A+',
    lastCheckup: '2024-01-20'
  }
];

export const appointments: Appointment[] = [
  {
    id: 'app-1',
    patientName: 'Смирнов Алексей Владимирович',
    patientId: 'pat-1',
    patientPhone: '+7 (999) 123-45-67',
    patientEmail: 'alex.smirnov@mail.ru',
    patientBirthDate: '1985-03-15',
    doctorId: 'doc-1',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    date: '2024-01-24',
    startTime: '09:00',
    endTime: '09:30',
    status: 'completed',
    type: 'consultation',
    priority: 'routine',
    room: '204',
    duration: 30,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-24T09:30:00Z',
    insurance: 'Полис ОМС №1234567890',
    reason: 'Плановый осмотр, контроль давления'
  },
  {
    id: 'app-2',
    patientName: 'Петрова Ольга Сергеевна',
    patientId: 'pat-2',
    patientPhone: '+7 (999) 234-56-78',
    patientEmail: 'olga.petrova@gmail.com',
    patientBirthDate: '1978-07-22',
    doctorId: 'doc-1',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    date: '2024-01-24',
    startTime: '10:00',
    endTime: '10:45',
    status: 'in-progress',
    type: 'examination',
    priority: 'urgent',
    room: '204',
    duration: 45,
    createdAt: '2024-01-23T14:30:00Z',
    updatedAt: '2024-01-24T10:00:00Z',
    insurance: 'Полис ДМС №0987654321',
    reason: 'Боли в груди, повышенное давление',
    notes: 'Повторный прием, принести анализы крови и ЭКГ. Подозрение на стенокардию.'
  },
  {
    id: 'app-3',
    patientName: 'Козлов Дмитрий Александрович',
    patientId: 'pat-3',
    patientPhone: '+7 (999) 345-67-89',
    patientEmail: 'd.kozlov@yandex.ru',
    patientBirthDate: '1990-11-30',
    doctorId: 'doc-1',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    date: '2024-01-24',
    startTime: '11:00',
    endTime: '11:30',
    status: 'scheduled',
    type: 'consultation',
    priority: 'routine',
    room: '204',
    duration: 30,
    createdAt: '2024-01-22T16:45:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    insurance: 'Полис ОМС №4567890123',
    reason: 'Головные боли, общая слабость'
  },
  {
    id: 'app-4',
    patientName: 'Новикова Ирина Петровна',
    patientId: 'pat-4',
    patientPhone: '+7 (999) 456-78-90',
    patientEmail: 'i.novikova@mail.ru',
    patientBirthDate: '1982-05-18',
    doctorId: 'doc-2',
    doctorName: 'Петрова Мария Игоревна',
    specialization: 'Кардиолог',
    date: '2024-01-24',
    startTime: '08:30',
    endTime: '09:15',
    status: 'scheduled',
    type: 'examination',
    priority: 'urgent',
    room: '105',
    duration: 45,
    createdAt: '2024-01-23T09:15:00Z',
    updatedAt: '2024-01-23T09:15:00Z',
    insurance: 'Полис ДМС №5678901234',
    reason: 'Нарушение сердечного ритма, назначение холтера',
    notes: 'Пациентка жалуется на перебои в работе сердца в ночное время'
  },
  {
    id: 'app-5',
    patientName: 'Федоров Сергей Николаевич',
    patientId: 'pat-5',
    patientPhone: '+7 (999) 567-89-01',
    patientEmail: 's.fedorov@gmail.com',
    patientBirthDate: '1975-12-10',
    doctorId: 'doc-2',
    doctorName: 'Петрова Мария Игоревна',
    specialization: 'Кардиолог',
    date: '2024-01-24',
    startTime: '10:00',
    endTime: '10:45',
    status: 'scheduled',
    type: 'procedure',
    priority: 'routine',
    room: '105',
    duration: 45,
    createdAt: '2024-01-20T11:20:00Z',
    updatedAt: '2024-01-20T11:20:00Z',
    insurance: 'Полис ОМС №6789012345',
    reason: 'Плановое ЭКГ с нагрузкой',
    notes: 'Контроль после курса лечения. Принести предыдущие результаты ЭКГ.'
  },
  {
    id: 'app-6',
    patientName: 'Морозова Анна Викторовна',
    patientId: 'pat-6',
    patientPhone: '+7 (999) 678-90-12',
    patientEmail: 'a.morozova@mail.ru',
    patientBirthDate: '1988-09-05',
    doctorId: 'doc-3',
    doctorName: 'Сидоров Владимир Петрович',
    specialization: 'Невролог',
    date: '2024-01-24',
    startTime: '10:30',
    endTime: '11:15',
    status: 'scheduled',
    type: 'consultation',
    priority: 'routine',
    room: '312',
    duration: 45,
    createdAt: '2024-01-21T13:40:00Z',
    updatedAt: '2024-01-21T13:40:00Z',
    insurance: 'Полис ДМС №7890123456',
    reason: 'Головокружения, онемение пальцев рук'
  },
  {
    id: 'app-7',
    patientName: 'Волков Павел Игоревич',
    patientId: 'pat-7',
    patientPhone: '+7 (999) 789-01-23',
    patientEmail: 'p.volkov@yandex.ru',
    patientBirthDate: '1993-02-28',
    doctorId: 'doc-4',
    doctorName: 'Козлова Елена Викторовна',
    specialization: 'Офтальмолог',
    date: '2024-01-24',
    startTime: '11:00',
    endTime: '11:30',
    status: 'scheduled',
    type: 'examination',
    priority: 'routine',
    room: '208',
    duration: 30,
    createdAt: '2024-01-22T15:10:00Z',
    updatedAt: '2024-01-22T15:10:00Z',
    insurance: 'Полис ОМС №8901234567',
    reason: 'Проверка зрения, подбор очков'
  },
  {
    id: 'app-8',
    patientName: 'Лебедева Мария Олеговна',
    patientId: 'pat-8',
    patientPhone: '+7 (999) 890-12-34',
    patientEmail: 'm.lebedeva@gmail.com',
    patientBirthDate: '1979-06-14',
    doctorId: 'doc-1',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    date: '2024-01-24',
    startTime: '14:00',
    endTime: '14:30',
    status: 'scheduled',
    type: 'consultation',
    priority: 'routine',
    room: '204',
    duration: 30,
    createdAt: '2024-01-23T08:30:00Z',
    updatedAt: '2024-01-23T08:30:00Z',
    insurance: 'Полис ДМС №9012345678',
    reason: 'Оформление санаторно-курортной карты'
  },
  {
    id: 'app-9',
    patientName: 'Громов Андрей Викторович',
    patientId: 'pat-9',
    patientPhone: '+7 (999) 901-23-45',
    patientEmail: 'a.gromov@mail.ru',
    patientBirthDate: '1980-04-25',
    doctorId: 'doc-5',
    doctorName: 'Николаев Дмитрий Олегович',
    specialization: 'Хирург',
    date: '2024-01-24',
    startTime: '13:00',
    endTime: '13:45',
    status: 'scheduled',
    type: 'consultation',
    priority: 'urgent',
    room: '401',
    duration: 45,
    createdAt: '2024-01-24T07:15:00Z',
    updatedAt: '2024-01-24T07:15:00Z',
    insurance: 'Полис ОМС №0123456789',
    reason: 'Консультация по поводу грыжи',
    notes: 'Срочная консультация, пациент испытывает сильные боли'
  },
  {
    id: 'app-10',
    patientName: 'Соколова Екатерина Дмитриевна',
    patientId: 'pat-10',
    patientPhone: '+7 (999) 012-34-56',
    patientEmail: 'e.sokolova@gmail.com',
    patientBirthDate: '1995-08-12',
    doctorId: 'doc-6',
    doctorName: 'Орлова Светлана Михайловна',
    specialization: 'Педиатр',
    date: '2024-01-24',
    startTime: '15:00',
    endTime: '15:30',
    status: 'cancelled',
    type: 'consultation',
    priority: 'routine',
    room: '115',
    duration: 30,
    createdAt: '2024-01-21T12:00:00Z',
    updatedAt: '2024-01-23T16:20:00Z',
    insurance: 'Полис ОМС №1234509876',
    reason: 'Плановый осмотр ребенка',
    notes: 'Пациент отменил запись за сутки до приема'
  },
  {
    id: 'app-11',
    patientName: 'Кузнецов Илья Сергеевич',
    patientId: 'pat-11',
    patientPhone: '+7 (999) 112-23-34',
    patientEmail: 'i.kuznetsov@yandex.ru',
    patientBirthDate: '1987-11-03',
    doctorId: 'doc-3',
    doctorName: 'Сидоров Владимир Петрович',
    specialization: 'Невролог',
    date: '2024-01-24',
    startTime: '14:30',
    endTime: '15:15',
    status: 'no-show',
    type: 'diagnostic',
    priority: 'routine',
    room: '312',
    duration: 45,
    createdAt: '2024-01-19T14:45:00Z',
    updatedAt: '2024-01-24T14:45:00Z',
    insurance: 'Полис ДМС №2345610987',
    reason: 'ЭЭГ головного мозга',
    notes: 'Пациент не явился на прием, не предупредил'
  },
  {
    id: 'app-12',
    patientName: 'Попова Виктория Андреевна',
    patientId: 'pat-12',
    patientPhone: '+7 (999) 223-34-45',
    patientEmail: 'v.popova@mail.ru',
    patientBirthDate: '1991-03-22',
    doctorId: 'doc-8',
    doctorName: 'Федорова Ольга Дмитриевна',
    specialization: 'Гинеколог',
    date: '2024-01-24',
    startTime: '16:00',
    endTime: '16:30',
    status: 'scheduled',
    type: 'examination',
    priority: 'routine',
    room: '210',
    duration: 30,
    createdAt: '2024-01-22T10:20:00Z',
    updatedAt: '2024-01-22T10:20:00Z',
    insurance: 'Полис ДМС №3456721098',
    reason: 'Плановый гинекологический осмотр'
  },
  {
    id: 'app-13',
    patientName: 'Смирнов Алексей Владимирович',
    patientId: 'pat-1',
    patientPhone: '+7 (999) 123-45-67',
    patientEmail: 'alex.smirnov@mail.ru',
    patientBirthDate: '1985-03-15',
    doctorId: 'doc-2',
    doctorName: 'Петрова Мария Игоревна',
    specialization: 'Кардиолог',
    date: '2024-01-25',
    startTime: '09:00',
    endTime: '09:45',
    status: 'scheduled',
    type: 'consultation',
    priority: 'routine',
    room: '105',
    duration: 45,
    createdAt: '2024-01-24T11:00:00Z',
    updatedAt: '2024-01-24T11:00:00Z',
    insurance: 'Полис ОМС №1234567890',
    reason: 'Консультация кардиолога по направлению терапевта'
  },
  {
    id: 'app-14',
    patientName: 'Петрова Ольга Сергеевна',
    patientId: 'pat-2',
    patientPhone: '+7 (999) 234-56-78',
    patientEmail: 'olga.petrova@gmail.com',
    patientBirthDate: '1978-07-22',
    doctorId: 'doc-7',
    doctorName: 'Громов Андрей Викторович',
    specialization: 'Травматолог',
    date: '2024-01-25',
    startTime: '10:30',
    endTime: '11:15',
    status: 'scheduled',
    type: 'consultation',
    priority: 'urgent',
    room: '305',
    duration: 45,
    createdAt: '2024-01-24T12:30:00Z',
    updatedAt: '2024-01-24T12:30:00Z',
    insurance: 'Полис ДМС №0987654321',
    reason: 'Боли в коленном суставе',
    notes: 'После падения на льду, требуется рентген'
  }
];

export const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
];

export const rooms: Room[] = [
  { 
    id: '204', 
    name: 'Кабинет 204', 
    type: 'therapist',
    floor: 2,
    equipment: ['Стол врача', 'Кушетка', 'Тонометр', 'Глюкометр'],
    status: 'available'
  },
  { 
    id: '105', 
    name: 'Кабинет 105', 
    type: 'cardiology',
    floor: 1,
    equipment: ['ЭКГ аппарат', 'Холтер', 'Велоэргометр', 'Дефибриллятор'],
    status: 'occupied'
  },
  { 
    id: '312', 
    name: 'Кабинет 312', 
    type: 'neurology',
    floor: 3,
    equipment: ['Неврологический молоточек', 'Монитор ЭЭГ', 'Транскраниальный допплер'],
    status: 'available'
  },
  { 
    id: '208', 
    name: 'Кабинет 208', 
    type: 'ophthalmology',
    floor: 2,
    equipment: ['Щелевая лампа', 'Авторефрактометр', 'Офтальмоскоп', 'Таблица для проверки зрения'],
    status: 'available'
  },
  { 
    id: '401', 
    name: 'Кабинет 401', 
    type: 'surgery',
    floor: 4,
    equipment: ['Хирургический стол', 'Осветительная система', 'Стерилизатор', 'Накопитель отходов'],
    status: 'available'
  },
  { 
    id: '115', 
    name: 'Кабинет 115', 
    type: 'therapist',
    floor: 1,
    equipment: ['Педиатрические весы', 'Ростомер', 'Небулайзер', 'Ингалятор'],
    status: 'available'
  },
  { 
    id: '210', 
    name: 'Кабинет 210', 
    type: 'therapist',
    floor: 2,
    equipment: ['Гинекологическое кресло', 'УЗИ аппарат', 'Кольпоскоп'],
    status: 'available'
  },
  { 
    id: '305', 
    name: 'Кабинет 305', 
    type: 'procedure',
    floor: 3,
    equipment: ['Рентген аппарат', 'Стол для перевязок', 'Шины', 'Костыли'],
    status: 'available'
  },
  { 
    id: '101', 
    name: 'Процедурный кабинет 101', 
    type: 'procedure',
    floor: 1,
    equipment: ['Центрифуга', 'Шприцы', 'Капельницы', 'Холодильник для препаратов'],
    status: 'maintenance'
  },
  { 
    id: '500', 
    name: 'Реанимация', 
    type: 'emergency',
    floor: 5,
    equipment: ['Аппарат ИВЛ', 'Монитор пациента', 'Дефибриллятор', 'Кислородный концентратор'],
    status: 'available'
  }
];

// Вспомогательные функции
export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};

export const getPatientByName = (name: string): Patient | undefined => {
  return patients.find(patient => patient.name === name);
};

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export const getAppointmentsByDoctor = (doctorId: string): Appointment[] => {
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getAppointmentsByPatient = (patientId: string): Appointment[] => {
  return appointments.filter(appointment => appointment.patientId === patientId);
};

export const getAppointmentsByDate = (date: string): Appointment[] => {
  return appointments.filter(appointment => appointment.date === date);
};

export const getAppointmentsByStatus = (status: Appointment['status']): Appointment[] => {
  return appointments.filter(appointment => appointment.status === status);
};

export const getAvailableTimeSlots = (doctorId: string, date: string): string[] => {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];

  const doctorAppointments = getAppointmentsByDoctor(doctorId)
    .filter(appointment => appointment.date === date && appointment.status !== 'cancelled');

  const bookedSlots = doctorAppointments.map(appointment => appointment.startTime);
  
  return timeSlots.filter(slot => {
    const slotTime = new Date(`1970-01-01T${slot}:00`);
    const workStart = new Date(`1970-01-01T${doctor.workingHours.start}:00`);
    const workEnd = new Date(`1970-01-01T${doctor.workingHours.end}:00`);
    
    return slotTime >= workStart && slotTime < workEnd && !bookedSlots.includes(slot);
  });
};

// Типы для фильтрации
export type AppointmentFilter = {
  doctorId?: string;
  date?: string;
  status?: Appointment['status'];
  type?: Appointment['type'];
  priority?: Appointment['priority'];
};

export const filterAppointments = (filters: AppointmentFilter): Appointment[] => {
  return appointments.filter(appointment => {
    if (filters.doctorId && appointment.doctorId !== filters.doctorId) return false;
    if (filters.date && appointment.date !== filters.date) return false;
    if (filters.status && appointment.status !== filters.status) return false;
    if (filters.type && appointment.type !== filters.type) return false;
    if (filters.priority && appointment.priority !== filters.priority) return false;
    return true;
  });
};

// Статистика
export const getAppointmentStats = () => {
  const total = appointments.length;
  const byStatus = {
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    'in-progress': appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    'no-show': appointments.filter(a => a.status === 'no-show').length,
  };
  const byType = {
    consultation: appointments.filter(a => a.type === 'consultation').length,
    examination: appointments.filter(a => a.type === 'examination').length,
    procedure: appointments.filter(a => a.type === 'procedure').length,
    surgery: appointments.filter(a => a.type === 'surgery').length,
    diagnostic: appointments.filter(a => a.type === 'diagnostic').length,
  };
  const byPriority = {
    routine: appointments.filter(a => a.priority === 'routine').length,
    urgent: appointments.filter(a => a.priority === 'urgent').length,
    emergency: appointments.filter(a => a.priority === 'emergency').length,
  };

  return { total, byStatus, byType, byPriority };
};

// Статистика пациентов
export const getPatientStats = () => {
  const total = patients.length;
  const byGender = {
    male: patients.filter(p => p.gender === 'male').length,
    female: patients.filter(p => p.gender === 'female').length,
  };
  const byAgeGroup = {
    '18-30': patients.filter(p => {
      const age = calculateAge(p.birthDate);
      return age >= 18 && age <= 30;
    }).length,
    '31-45': patients.filter(p => {
      const age = calculateAge(p.birthDate);
      return age >= 31 && age <= 45;
    }).length,
    '46-60': patients.filter(p => {
      const age = calculateAge(p.birthDate);
      return age >= 46 && age <= 60;
    }).length,
    '60+': patients.filter(p => {
      const age = calculateAge(p.birthDate);
      return age > 60;
    }).length,
  };

  return { total, byGender, byAgeGroup };
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Функции для работы с пациентами
export const getPatientsWithStats = () => {
  return patients.map(patient => {
    const patientAppointments = getAppointmentsByPatient(patient.id);
    const lastAppointment = patientAppointments
      .filter(apt => apt.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const upcomingAppointments = patientAppointments
      .filter(apt => apt.status === 'scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const status: 'active' | 'inactive' | 'new' = patientAppointments.length === 0 ? 'new' : 
                               lastAppointment && new Date().getTime() - new Date(lastAppointment.date).getTime() > 90 * 24 * 60 * 60 * 1000 ? 'inactive' : 'active';

    return {
      ...patient,
      appointmentsCount: patientAppointments.length,
      lastVisit: lastAppointment?.date,
      upcomingAppointments,
      status,
      age: calculateAge(patient.birthDate)
    };
  });
};

// Поиск пациентов
export const searchPatients = (query: string): Patient[] => {
  const lowerQuery = query.toLowerCase();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(lowerQuery) ||
    patient.phone.includes(query) ||
    patient.email.toLowerCase().includes(lowerQuery) ||
    patient.insurance.toLowerCase().includes(lowerQuery)
  );
};

// Фильтрация пациентов
export type PatientFilter = {
  gender?: 'male' | 'female';
  minAge?: number;
  maxAge?: number;
  hasAllergies?: boolean;
  hasMedicalHistory?: boolean;
};

export const filterPatients = (filters: PatientFilter): Patient[] => {
  return patients.filter(patient => {
    if (filters.gender && patient.gender !== filters.gender) return false;
    
    const age = calculateAge(patient.birthDate);
    if (filters.minAge && age < filters.minAge) return false;
    if (filters.maxAge && age > filters.maxAge) return false;
    
    if (filters.hasAllergies && patient.allergies.length === 0) return false;
    if (filters.hasMedicalHistory && patient.medicalHistory.length === 0) return false;
    
    return true;
  });
};

// Функция для получения patientId по имени пациента
export const getPatientIdByName = (patientName: string): string => {
  const patient = patients.find(p => p.name === patientName);
  return patient ? patient.id : 'unknown';
};