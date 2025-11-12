// /src/app/demo/medicine/user/modules/appointment/demo-data.ts
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image?: string;
  rating: number;
  experience: number;
  description: string;
  education: string;
  certifications: string[];
  availableSlots: TimeSlot[];
  price: number;
  clinic: string;
  address: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
  type: 'online' | 'offline';
}

export interface AppointmentFormData {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  slotId: string;
  symptoms: string;
  priority: 'routine' | 'urgent';
  type: 'online' | 'offline';
  insurance?: string;
  previousVisit?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  address: string;
  patientName: string;
  symptoms: string;
  type: 'online' | 'offline';
  priority: 'routine' | 'urgent';
  price: number;
  duration: number;
  notes?: string;
  createdAt: string;
}

export const specializations = [
  'Терапевт',
  'Кардиолог',
  'Невролог',
  'Офтальмолог',
  'Стоматолог',
  'Дерматолог',
  'Педиатр',
  'Хирург',
  'Гастроэнтеролог',
  'Эндокринолог',
  'Отоларинголог',
  'Уролог',
  'Гинеколог',
  'Ортопед',
  'Психиатр',
  'Психолог',
  'Диетолог',
  'Физиотерапевт'
];

// Генерация временных слотов на ближайшие 2 недели
const generateTimeSlots = (doctorId: string, days: number = 14): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startDate = new Date();
  const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Пропускаем выходные
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
    
    const dateString = currentDate.toISOString().split('T')[0];
    
    timeSlots.forEach((time, index) => {
      // Случайным образом делаем некоторые слоты недоступными
      const isAvailable = Math.random() > 0.3;
      // Чередуем онлайн и офлайн приемы
      const type: 'online' | 'offline' = index % 2 === 0 ? 'online' : 'offline';
      
      slots.push({
        id: `${doctorId}-${dateString}-${time}`,
        date: dateString,
        time: time,
        isAvailable,
        type
      });
    });
  }
  
  return slots;
};

export const doctors: Doctor[] = [
  // Терапевты
  {
    id: '1',
    name: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    rating: 4.8,
    experience: 12,
    price: 2500,
    clinic: 'Медицинский центр "Здоровье"',
    address: 'ул. Медицинская, 15, каб. 204',
    description: 'Специалист общей практики. Диагностика и лечение широкого спектра заболеваний. Ведение пациентов с хроническими заболеваниями.',
    education: 'Первый Московский государственный медицинский университет',
    certifications: ['Терапия', 'Функциональная диагностика', 'Эксперт по COVID-19'],
    availableSlots: generateTimeSlots('1')
  },
  {
    id: '2',
    name: 'Петрова Мария Ивановна',
    specialization: 'Терапевт',
    rating: 4.9,
    experience: 15,
    price: 2700,
    clinic: 'Клиника "Медикал Груп"',
    address: 'пр. Ленинградский, 45, каб. 101',
    description: 'Врач высшей категории. Специализация на заболеваниях дыхательной системы и аллергологии.',
    education: 'Российский национальный исследовательский медицинский университет',
    certifications: ['Пульмонология', 'Аллергология', 'Иммунология'],
    availableSlots: generateTimeSlots('2')
  },

  // Кардиологи
  {
    id: '3',
    name: 'Сидоров Владимир Петрович',
    specialization: 'Кардиолог',
    rating: 4.9,
    experience: 15,
    price: 3500,
    clinic: 'Кардиологический центр "Сердце"',
    address: 'ул. Кардиологическая, 8, каб. 105',
    description: 'Эксперт в области сердечно-сосудистых заболеваний. Кандидат медицинских наук. Специализация на артериальной гипертензии и ИБС.',
    education: 'Российский национальный исследовательский медицинский университет',
    certifications: ['Кардиология', 'Эхокардиография', 'Реаниматология'],
    availableSlots: generateTimeSlots('3')
  },
  {
    id: '4',
    name: 'Кузнецова Анна Дмитриевна',
    specialization: 'Кардиолог',
    rating: 4.7,
    experience: 10,
    price: 3200,
    clinic: 'Медицинский центр "Кардио"',
    address: 'ул. Сердечная, 12, каб. 208',
    description: 'Специалист по нарушениям ритма сердца. Опыт работы в кардиохирургическом отделении.',
    education: 'Московский государственный медико-стоматологический университет',
    certifications: ['Аритмология', 'ЭКГ-диагностика', 'Функциональная диагностика'],
    availableSlots: generateTimeSlots('4')
  },

  // Неврологи
  {
    id: '5',
    name: 'Попов Дмитрий Викторович',
    specialization: 'Невролог',
    rating: 4.7,
    experience: 8,
    price: 3200,
    clinic: 'Неврологическая клиника "Нейро"',
    address: 'ул. Неврологическая, 22, каб. 301',
    description: 'Специализируется на заболеваниях нервной системы и реабилитации. Опыт работы с пациентами после инсультов.',
    education: 'Московский государственный медико-стоматологический университет',
    certifications: ['Неврология', 'Реабилитология', 'ЭЭГ-диагностика'],
    availableSlots: generateTimeSlots('5')
  },
  {
    id: '6',
    name: 'Федорова Ольга Сергеевна',
    specialization: 'Невролог',
    rating: 4.8,
    experience: 11,
    price: 3400,
    clinic: 'Центр неврологии "Атлас"',
    address: 'ул. Новая, 33, каб. 405',
    description: 'Эксперт по головным болям и мигреням. Специализация на болевых синдромах.',
    education: 'Санкт-Петербургский государственный педиатрический медицинский университет',
    certifications: ['Цефалгология', 'Ботулинотерапия', 'УЗИ нервов'],
    availableSlots: generateTimeSlots('6')
  },

  // Офтальмологи
  {
    id: '7',
    name: 'Козлова Елена Викторовна',
    specialization: 'Офтальмолог',
    rating: 4.6,
    experience: 10,
    price: 2800,
    clinic: 'Офтальмологический центр "Зрение"',
    address: 'ул. Офтальмологическая, 5, каб. 108',
    description: 'Диагностика и лечение заболеваний глаз. Современные методы коррекции зрения. Опыт лазерной хирургии.',
    education: 'Санкт-Петербургский государственный педиатрический медицинский университет',
    certifications: ['Офтальмология', 'Лазерная хирургия', 'Детская офтальмология'],
    availableSlots: generateTimeSlots('7')
  },
  {
    id: '8',
    name: 'Орлов Михаил Александрович',
    specialization: 'Офтальмолог',
    rating: 4.9,
    experience: 14,
    price: 4500,
    clinic: 'Клиника "Микрохирургия глаза"',
    address: 'пр. Мира, 89, каб. 512',
    description: 'Хирург-офтальмолог высшей категории. Проведение сложных операций на сетчатке.',
    education: 'Московская медицинская академия им. Сеченова',
    certifications: ['Витреоретинальная хирургия', 'Катарактальная хирургия', 'Офтальмоонкология'],
    availableSlots: generateTimeSlots('8')
  },

  // Стоматологи
  {
    id: '9',
    name: 'Смирнова Татьяна Владимировна',
    specialization: 'Стоматолог',
    rating: 4.8,
    experience: 9,
    price: 2200,
    clinic: 'Стоматология "Улыбка"',
    address: 'ул. Зубная, 17, каб. 303',
    description: 'Стоматолог-терапевт. Лечение кариеса, эстетическая реставрация, профессиональная гигиена.',
    education: 'Московский государственный медико-стоматологический университет',
    certifications: ['Терапевтическая стоматология', 'Эндодонтия', 'Эстетическая стоматология'],
    availableSlots: generateTimeSlots('9')
  },
  {
    id: '10',
    name: 'Волков Артем Игоревич',
    specialization: 'Стоматолог',
    rating: 4.7,
    experience: 7,
    price: 3800,
    clinic: 'Центр дентальной имплантации',
    address: 'ул. Имплантационная, 3, каб. 201',
    description: 'Стоматолог-хирург, имплантолог. Установка имплантов любой сложности.',
    education: 'Казанский государственный медицинский университет',
    certifications: ['Имплантология', 'Челюстно-лицевая хирургия', 'Костная пластика'],
    availableSlots: generateTimeSlots('10')
  },

  // Дерматологи
  {
    id: '11',
    name: 'Николаева Ирина Петровна',
    specialization: 'Дерматолог',
    rating: 4.6,
    experience: 8,
    price: 2600,
    clinic: 'Клиника кожи "Дерма"',
    address: 'ул. Кожная, 11, каб. 104',
    description: 'Дерматолог-косметолог. Лечение акне, псориаза, экземы. Эстетические процедуры.',
    education: 'Ростовский государственный медицинский университет',
    certifications: ['Дерматология', 'Косметология', 'Трихология'],
    availableSlots: generateTimeSlots('11')
  },

  // Педиатры
  {
    id: '12',
    name: 'Захарова Светлана Михайловна',
    specialization: 'Педиатр',
    rating: 4.9,
    experience: 13,
    price: 2000,
    clinic: 'Детский медицинский центр "Здоровый ребенок"',
    address: 'ул. Детская, 25, каб. 401',
    description: 'Врач-педиатр высшей категории. Ведение детей от 0 до 18 лет. Вакцинация.',
    education: 'Санкт-Петербургский государственный педиатрический медицинский университет',
    certifications: ['Педиатрия', 'Неонатология', 'Вакцинопрофилактика'],
    availableSlots: generateTimeSlots('12')
  },

  // Хирурги
  {
    id: '13',
    name: 'Белов Андрей Николаевич',
    specialization: 'Хирург',
    rating: 4.8,
    experience: 16,
    price: 4200,
    clinic: 'Хирургический центр "Операция"',
    address: 'ул. Хирургическая, 7, каб. 205',
    description: 'Хирург общей практики. Лапароскопические операции. Экстренная хирургия.',
    education: 'Новосибирский государственный медицинский университет',
    certifications: ['Общая хирургия', 'Лапароскопия', 'Эндоскопия'],
    availableSlots: generateTimeSlots('13')
  },

  // Гастроэнтерологи
  {
    id: '14',
    name: 'Григорьева Марина Олеговна',
    specialization: 'Гастроэнтеролог',
    rating: 4.7,
    experience: 10,
    price: 2900,
    clinic: 'Клиника гастроэнтерологии "Пищеварение"',
    address: 'ул. Желудочная, 14, каб. 302',
    description: 'Специалист по заболеваниям ЖКТ. Эндоскопическая диагностика. Лечение ГЭРБ, СРК.',
    education: 'Самарский государственный медицинский университет',
    certifications: ['Гастроэнтерология', 'Эндоскопия', 'Гепатология'],
    availableSlots: generateTimeSlots('14')
  },

  // Эндокринологи
  {
    id: '15',
    name: 'Ковалев Павел Сергеевич',
    specialization: 'Эндокринолог',
    rating: 4.8,
    experience: 12,
    price: 3100,
    clinic: 'Эндокринологический центр "Гормоны"',
    address: 'ул. Эндокринная, 9, каб. 107',
    description: 'Специализация на сахарном диабете, заболеваниях щитовидной железы, ожирении.',
    education: 'Уральский государственный медицинский университет',
    certifications: ['Эндокринология', 'Диабетология', 'Тиреоидология'],
    availableSlots: generateTimeSlots('15')
  },

  // Отоларингологи
  {
    id: '16',
    name: 'Морозова Екатерина Викторовна',
    specialization: 'Отоларинголог',
    rating: 4.6,
    experience: 9,
    price: 2700,
    clinic: 'ЛОР-клиника "Слух"',
    address: 'ул. Ушная, 6, каб. 203',
    description: 'Диагностика и лечение заболеваний уха, горла, носа. Эндоскопические исследования.',
    education: 'Воронежский государственный медицинский университет',
    certifications: ['Оториноларингология', 'Аудиология', 'Эндоскопия ЛОР-органов'],
    availableSlots: generateTimeSlots('16')
  },

  // Урологи
  {
    id: '17',
    name: 'Тихонов Иван Дмитриевич',
    specialization: 'Уролог',
    rating: 4.7,
    experience: 11,
    price: 3300,
    clinic: 'Урологическая клиника "Андрос"',
    address: 'ул. Урологическая, 13, каб. 409',
    description: 'Специалист по заболеваниям мочеполовой системы. Малоинвазивные операции.',
    education: 'Омский государственный медицинский университет',
    certifications: ['Урология', 'Андрология', 'УЗИ в урологии'],
    availableSlots: generateTimeSlots('17')
  },

  // Гинекологи
  {
    id: '18',
    name: 'Романова Юлия Александровна',
    specialization: 'Гинеколог',
    rating: 4.9,
    experience: 14,
    price: 2800,
    clinic: 'Центр женского здоровья "Гинея"',
    address: 'ул. Гинекологическая, 4, каб. 501',
    description: 'Врач-гинеколог высшей категории. Ведение беременности, лечение бесплодия.',
    education: 'Красноярский государственный медицинский университет',
    certifications: ['Гинекология', 'УЗИ в гинекологии', 'Репродуктология'],
    availableSlots: generateTimeSlots('18')
  },

  // Ортопеды
  {
    id: '19',
    name: 'Фролов Сергей Владимирович',
    specialization: 'Ортопед',
    rating: 4.7,
    experience: 10,
    price: 3500,
    clinic: 'Ортопедический центр "Опорно-двигательный"',
    address: 'ул. Ортопедическая, 18, каб. 306',
    description: 'Специалист по заболеваниям суставов и позвоночника. Артроскопические операции.',
    education: 'Иркутский государственный медицинский университет',
    certifications: ['Ортопедия', 'Травматология', 'Артроскопия'],
    availableSlots: generateTimeSlots('19')
  },

  // Психиатры
  {
    id: '20',
    name: 'Семенова Анна Викторовна',
    specialization: 'Психиатр',
    rating: 4.8,
    experience: 12,
    price: 4000,
    clinic: 'Психиатрический центр "Психея"',
    address: 'ул. Психиатрическая, 2, каб. 601',
    description: 'Психиатр-психотерапевт. Лечение депрессий, тревожных расстройств, ПТСР.',
    education: 'Московский научно-исследовательский институт психиатрии',
    certifications: ['Психиатрия', 'Психотерапия', 'Наркология'],
    availableSlots: generateTimeSlots('20')
  },

  // Психологи
  {
    id: '21',
    name: 'Крылов Денис Олегович',
    specialization: 'Психолог',
    rating: 4.9,
    experience: 8,
    price: 2500,
    clinic: 'Психологический центр "Гармония"',
    address: 'ул. Психологическая, 10, каб. 702',
    description: 'Клинический психолог. Когнитивно-поведенческая терапия. Семейное консультирование.',
    education: 'Московский государственный университет',
    certifications: ['Клиническая психология', 'КПТ', 'Семейная терапия'],
    availableSlots: generateTimeSlots('21')
  },

  // Диетологи
  {
    id: '22',
    name: 'Мельникова Ольга Игоревна',
    specialization: 'Диетолог',
    rating: 4.7,
    experience: 7,
    price: 2300,
    clinic: 'Центр диетологии "Питание"',
    address: 'ул. Диетическая, 8, каб. 404',
    description: 'Врач-диетолог. Составление индивидуальных программ питания. Коррекция веса.',
    education: 'Московский государственный университет пищевых производств',
    certifications: ['Диетология', 'Нутрициология', 'Спортивная диетология'],
    availableSlots: generateTimeSlots('22')
  },

  // Физиотерапевты
  {
    id: '23',
    name: 'Данилов Алексей Петрович',
    specialization: 'Физиотерапевт',
    rating: 4.6,
    experience: 9,
    price: 2100,
    clinic: 'Центр физиотерапии "Реабилитация"',
    address: 'ул. Физиотерапевтическая, 16, каб. 508',
    description: 'Врач-физиотерапевт. Восстановительное лечение после травм и операций.',
    education: 'Волгоградский государственный медицинский университет',
    certifications: ['Физиотерапия', 'Реабилитология', 'Кинезиотерапия'],
    availableSlots: generateTimeSlots('23')
  }
];

export const upcomingAppointments: Appointment[] = [
  {
    id: 'app-1',
    doctorId: '1',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    date: '2024-01-24',
    time: '15:30',
    status: 'confirmed',
    address: 'ул. Медицинская, 15, каб. 204',
    patientName: 'Иванов Алексей Петрович',
    symptoms: 'Повышенное давление, головные боли, общая слабость. Контроль артериальной гипертензии.',
    type: 'offline',
    priority: 'routine',
    price: 2500,
    duration: 30,
    notes: 'Принести результаты предыдущих анализов',
    createdAt: '2024-01-20'
  },
  {
    id: 'app-2',
    doctorId: '3',
    doctorName: 'Сидоров Владимир Петрович',
    specialization: 'Кардиолог',
    date: '2024-01-26',
    time: '11:00',
    status: 'pending',
    address: 'ул. Кардиологическая, 8, каб. 105',
    patientName: 'Иванов Алексей Петрович',
    symptoms: 'Консультация по результатам ЭКГ, боли в груди при физической нагрузке.',
    type: 'online',
    priority: 'routine',
    price: 3500,
    duration: 45,
    createdAt: '2024-01-22'
  },
  {
    id: 'app-3',
    doctorId: '5',
    doctorName: 'Попов Дмитрий Викторович',
    specialization: 'Невролог',
    date: '2024-01-28',
    time: '14:00',
    status: 'confirmed',
    address: 'ул. Неврологическая, 22, каб. 301',
    patientName: 'Иванов Алексей Петрович',
    symptoms: 'Головокружения, шум в ушах, нарушение координации. Контроль неврологического статуса.',
    type: 'offline',
    priority: 'urgent',
    price: 3200,
    duration: 40,
    createdAt: '2024-01-23'
  },
  {
    id: 'app-4',
    doctorId: '7',
    doctorName: 'Козлова Елена Викторовна',
    specialization: 'Офтальмолог',
    date: '2024-01-29',
    time: '10:30',
    status: 'pending',
    address: 'ул. Офтальмологическая, 5, каб. 108',
    patientName: 'Иванов Алексей Петрович',
    symptoms: 'Ухудшение зрения, покраснение глаз, необходимость подбора очков.',
    type: 'offline',
    priority: 'routine',
    price: 2800,
    duration: 30,
    createdAt: '2024-01-24'
  },
  {
    id: 'app-5',
    doctorId: '14',
    doctorName: 'Григорьева Марина Олеговна',
    specialization: 'Гастроэнтеролог',
    date: '2024-01-30',
    time: '16:00',
    status: 'confirmed',
    address: 'ул. Желудочная, 14, каб. 302',
    patientName: 'Иванов Алексей Петрович',
    symptoms: 'Боли в животе, изжога, нарушение пищеварения после приема пищи.',
    type: 'online',
    priority: 'routine',
    price: 2900,
    duration: 45,
    createdAt: '2024-01-25'
  }
];

export const appointmentStats = {
  total: 12,
  upcoming: 5,
  completed: 6,
  cancelled: 1,
  monthly: 4
};

export type { Doctor, TimeSlot, AppointmentFormData, Appointment };