export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientBirthDate: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  issueDate: string;
  expirationDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  priority: 'routine' | 'urgent' | 'emergency';
  type: 'medication' | 'procedure' | 'examination' | 'therapy';
  diagnosis: string;
  medications: PrescriptionMedication[];
  instructions: string;
  notes?: string;
  pharmacyNotes?: string;
  refills: number;
  refillsRemaining: number;
  lastFilled?: string;
  nextRefillDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionMedication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'ointment' | 'inhaler' | 'suppository';
  strength: string;
  quantity: number;
  unit: string;
  frequency: string;
  duration: string;
  route: 'oral' | 'topical' | 'inhalation' | 'injection' | 'rectal' | 'vaginal';
  timing: string;
  withFood: boolean;
  instructions: string;
  sideEffects?: string[];
  contraindications?: string[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  is24h: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Демо данные рецептов
export const prescriptions: Prescription[] = [
  {
    id: 'rx-001',
    patientId: 'pat-001',
    patientName: 'Иванов Алексей Петрович',
    patientBirthDate: '1985-03-15',
    patientPhone: '+7 (912) 345-67-89',
    doctorId: 'doc-001',
    doctorName: 'Смирнов Александр Иванович',
    doctorSpecialization: 'Кардиолог',
    issueDate: '2024-01-20',
    expirationDate: '2024-04-20',
    status: 'active',
    priority: 'routine',
    type: 'medication',
    diagnosis: 'Артериальная гипертензия, стабильное течение',
    medications: [
      {
        id: 'med-001',
        name: 'Лизиноприл',
        genericName: 'Lisinopril',
        dosage: '10 мг',
        form: 'tablet',
        strength: '10mg',
        quantity: 30,
        unit: 'таблеток',
        frequency: '1 раз в день',
        duration: '30 дней',
        route: 'oral',
        timing: 'Утром',
        withFood: false,
        instructions: 'Принимать утром, независимо от приема пищи. Контролировать АД ежедневно.',
        sideEffects: ['Головокружение', 'Сухой кашель', 'Гипотония'],
        contraindications: ['Беременность', 'Ангионевротический отек в анамнезе']
      }
    ],
    instructions: 'Контроль артериального давления 2 раза в день. Явиться на контрольный осмотр через 1 месяц.',
    notes: 'Пациент хорошо переносит терапию. АД стабильно 130/85 мм рт.ст.',
    pharmacyNotes: 'Выдавать ежемесячно. Требуется контроль АД перед каждым возобновлением.',
    refills: 3,
    refillsRemaining: 2,
    lastFilled: '2024-01-20',
    nextRefillDate: '2024-02-20',
    createdBy: 'Смирнов А.И.',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'rx-002',
    patientId: 'pat-002',
    patientName: 'Петрова Елена Владимировна',
    patientBirthDate: '1990-07-22',
    patientPhone: '+7 (912) 345-67-91',
    doctorId: 'doc-002',
    doctorName: 'Кузнецова Ольга Петровна',
    doctorSpecialization: 'Невролог',
    issueDate: '2024-01-24',
    expirationDate: '2024-02-24',
    status: 'active',
    priority: 'urgent',
    type: 'medication',
    diagnosis: 'Мигрень с аурой, острый приступ',
    medications: [
      {
        id: 'med-002',
        name: 'Суматриптан',
        genericName: 'Sumatriptan',
        dosage: '50 мг',
        form: 'tablet',
        strength: '50mg',
        quantity: 6,
        unit: 'таблеток',
        frequency: 'По необходимости, не более 2 раз в сутки',
        duration: '1 месяц',
        route: 'oral',
        timing: 'При появлении первых симптомов мигрени',
        withFood: true,
        instructions: 'Принять 1 таблетку при первых признаках мигрени. Если боль не прошла через 2 часа, можно принять вторую таблетку. Не превышать 100 мг в сутки.',
        sideEffects: ['Слабость', 'Головокружение', 'Чувство жара'],
        contraindications: ['ИБС', 'Не контролируемая гипертензия', 'Беременность']
      }
    ],
    instructions: 'Избегать триггеров мигрени (стресс, недосыпание, определенные продукты). Вести дневник головной боли.',
    notes: 'Пациентка с частыми приступами мигрени. Назначена для купирования острых приступов.',
    refills: 1,
    refillsRemaining: 1,
    createdBy: 'Кузнецова О.П.',
    createdAt: '2024-01-24T14:30:00Z',
    updatedAt: '2024-01-24T14:30:00Z'
  },
  {
    id: 'rx-003',
    patientId: 'pat-003',
    patientName: 'Сидоров Михаил Александрович',
    patientBirthDate: '1978-11-30',
    patientPhone: '+7 (912) 345-67-93',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    doctorSpecialization: 'Терапевт',
    issueDate: '2024-01-23',
    expirationDate: '2024-02-06',
    status: 'completed',
    priority: 'routine',
    type: 'medication',
    diagnosis: 'Обострение хронического гастрита',
    medications: [
      {
        id: 'med-003',
        name: 'Омепразол',
        genericName: 'Omeprazole',
        dosage: '20 мг',
        form: 'capsule',
        strength: '20mg',
        quantity: 28,
        unit: 'капсул',
        frequency: '2 раза в день',
        duration: '14 дней',
        route: 'oral',
        timing: 'За 30 минут до завтрака и ужина',
        withFood: false,
        instructions: 'Принимать за 30 минут до еды. Запивать стаканом воды. Не разжевывать.',
        sideEffects: ['Головная боль', 'Тошнота', 'Метеоризм'],
        contraindications: ['Повышенная чувствительность']
      }
    ],
    instructions: 'Соблюдать диету №1. Исключить острое, жареное, алкоголь. Питаться дробно, небольшими порциями.',
    notes: 'Пациент с хроническим гастритом в стадии обострения. Рекомендована гастроскопия после курса лечения.',
    refills: 0,
    refillsRemaining: 0,
    lastFilled: '2024-01-23',
    createdBy: 'Новиков А.М.',
    createdAt: '2024-01-23T15:00:00Z',
    updatedAt: '2024-02-06T00:00:00Z'
  },
  {
    id: 'rx-004',
    patientId: 'pat-004',
    patientName: 'Козлова Анна Сергеевна',
    patientBirthDate: '1995-05-14',
    patientPhone: '+7 (912) 345-67-95',
    doctorId: 'doc-004',
    doctorName: 'Лебедева Екатерина Александровна',
    doctorSpecialization: 'Гинеколог',
    issueDate: '2024-01-18',
    expirationDate: '2024-07-18',
    status: 'active',
    priority: 'routine',
    type: 'medication',
    diagnosis: 'Железодефицитная анемия легкой степени',
    medications: [
      {
        id: 'med-004',
        name: 'Ферретаб',
        genericName: 'Ferrous Fumarate',
        dosage: '100 мг',
        form: 'capsule',
        strength: '100mg',
        quantity: 30,
        unit: 'капсул',
        frequency: '1 раз в день',
        duration: '3 месяца',
        route: 'oral',
        timing: 'После еды',
        withFood: true,
        instructions: 'Принимать после завтрака. Запивать водой. Не принимать с молочными продуктами, чаем или кофе.',
        sideEffects: ['Тошнота', 'Запор', 'Потемнение стула'],
        contraindications: ['Гемохроматоз', 'Гемосидероз']
      }
    ],
    instructions: 'Обогатить диету продуктами, содержащими железо (красное мясо, печень, гранаты, яблоки). Контроль ОАК через 1 месяц.',
    refills: 2,
    refillsRemaining: 2,
    lastFilled: '2024-01-18',
    nextRefillDate: '2024-02-18',
    createdBy: 'Лебедева Е.А.',
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-18T11:15:00Z'
  },
  {
    id: 'rx-005',
    patientId: 'pat-005',
    patientName: 'Николаев Дмитрий Игоревич',
    patientBirthDate: '1982-09-08',
    patientPhone: '+7 (912) 345-67-97',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    doctorSpecialization: 'Терапевт',
    issueDate: '2024-01-24',
    expirationDate: '2024-01-29',
    status: 'active',
    priority: 'routine',
    type: 'medication',
    diagnosis: 'ОРВИ, острая фаза',
    medications: [
      {
        id: 'med-005',
        name: 'Парацетамол',
        genericName: 'Paracetamol',
        dosage: '500 мг',
        form: 'tablet',
        strength: '500mg',
        quantity: 10,
        unit: 'таблеток',
        frequency: '3 раза в день',
        duration: '5 дней',
        route: 'oral',
        timing: 'После еды',
        withFood: true,
        instructions: 'Принимать при температуре выше 38°C или сильной головной боли. Не превышать 4 г в сутки.',
        sideEffects: ['Тошнота', 'Боль в животе', 'Аллергические реакции'],
        contraindications: ['Тяжелые нарушения функции печени', 'Алкоголизм']
      }
    ],
    instructions: 'Постельный режим, обильное питье. При сохранении температуры более 3 дней - обратиться к врачу.',
    notes: 'Температура 38.2°C, катаральные явления. Состояние средней тяжести.',
    refills: 0,
    refillsRemaining: 0,
    createdBy: 'Новиков А.М.',
    createdAt: '2024-01-24T14:00:00Z',
    updatedAt: '2024-01-24T14:00:00Z'
  },
  {
    id: 'rx-006',
    patientId: 'pat-002',
    patientName: 'Петрова Елена Владимировна',
    patientBirthDate: '1990-07-22',
    patientPhone: '+7 (912) 345-67-91',
    doctorId: 'doc-002',
    doctorName: 'Кузнецова Ольга Петровна',
    doctorSpecialization: 'Невролог',
    issueDate: '2024-01-10',
    expirationDate: '2024-04-10',
    status: 'cancelled',
    priority: 'routine',
    type: 'medication',
    diagnosis: 'Хроническая головная боль напряжения',
    medications: [
      {
        id: 'med-006',
        name: 'Амитриптилин',
        genericName: 'Amitriptyline',
        dosage: '25 мг',
        form: 'tablet',
        strength: '25mg',
        quantity: 30,
        unit: 'таблеток',
        frequency: '1 раз в день на ночь',
        duration: '3 месяца',
        route: 'oral',
        timing: 'Вечером перед сном',
        withFood: false,
        instructions: 'Начинать с 1/2 таблетки, через 3 дня увеличить до целой таблетки. Не резко прекращать прием.',
        sideEffects: ['Сонливость', 'Сухость во рту', 'Запор', 'Увеличение веса'],
        contraindications: ['Острый инфаркт миокарда', 'Глаукома', 'Беременность']
      }
    ],
    instructions: 'Избегать стрессовых ситуаций. Практиковать релаксационные техники. Регулярный сон не менее 7-8 часов.',
    notes: 'Рецепт отменен в связи с развитием побочных эффектов (выраженная сонливость).',
    pharmacyNotes: 'Рецепт аннулирован по указанию врача.',
    refills: 2,
    refillsRemaining: 0,
    createdBy: 'Кузнецова О.П.',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z'
  },
  {
    id: 'rx-007',
    patientId: 'pat-007',
    patientName: 'Васильев Артем Олегович',
    patientBirthDate: '1992-02-18',
    patientPhone: '+7 (912) 345-68-01',
    doctorId: 'doc-003',
    doctorName: 'Попов Сергей Владимирович',
    doctorSpecialization: 'Хирург',
    issueDate: '2024-01-24',
    expirationDate: '2024-02-07',
    status: 'active',
    priority: 'urgent',
    type: 'medication',
    diagnosis: 'Послеоперационный болевой синдром после артроскопии коленного сустава',
    medications: [
      {
        id: 'med-007',
        name: 'Кеторолак',
        genericName: 'Ketorolac',
        dosage: '10 мг',
        form: 'tablet',
        strength: '10mg',
        quantity: 20,
        unit: 'таблеток',
        frequency: '3-4 раза в день при болях',
        duration: '5 дней',
        route: 'oral',
        timing: 'После еды',
        withFood: true,
        instructions: 'Принимать только при сильной боли. Не использовать более 5 дней подряд.',
        sideEffects: ['Боль в желудке', 'Тошнота', 'Головокружение'],
        contraindications: ['Язвенная болезнь', 'Почечная недостаточность', 'Беременность']
      }
    ],
    instructions: 'Холод на сустав 3-4 раза в день по 15 минут. Ограничить нагрузку на ногу. Явиться на перевязку через 2 дня.',
    notes: 'Состояние после артроскопии правого коленного сустава. Выраженный болевой синдром.',
    refills: 0,
    refillsRemaining: 0,
    createdBy: 'Попов С.В.',
    createdAt: '2024-01-24T16:45:00Z',
    updatedAt: '2024-01-24T16:45:00Z'
  },
  {
    id: 'rx-008',
    patientId: 'pat-008',
    patientName: 'Морозова Татьяна Дмитриевна',
    patientBirthDate: '1975-06-25',
    patientPhone: '+7 (912) 345-68-03',
    doctorId: 'doc-001',
    doctorName: 'Смирнов Александр Иванович',
    doctorSpecialization: 'Кардиолог',
    issueDate: '2024-01-22',
    expirationDate: '2024-04-22',
    status: 'active',
    priority: 'routine',
    type: 'medication',
    diagnosis: 'Сахарный диабет 2 типа, артериальная гипертензия',
    medications: [
      {
        id: 'med-008',
        name: 'Метформин',
        genericName: 'Metformin',
        dosage: '850 мг',
        form: 'tablet',
        strength: '850mg',
        quantity: 60,
        unit: 'таблеток',
        frequency: '2 раза в день',
        duration: '1 месяц',
        route: 'oral',
        timing: 'Во время еды',
        withFood: true,
        instructions: 'Принимать во время завтрака и ужина. Начинать с 1 таблетки в день, через неделю увеличить до 2.',
        sideEffects: ['Тошнота', 'Диарея', 'Металлический привкус'],
        contraindications: ['Почечная недостаточность', 'Декомпенсированная сердечная недостаточность']
      },
      {
        id: 'med-009',
        name: 'Лизиноприл',
        genericName: 'Lisinopril',
        dosage: '5 мг',
        form: 'tablet',
        strength: '5mg',
        quantity: 30,
        unit: 'таблеток',
        frequency: '1 раз в день',
        duration: '1 месяц',
        route: 'oral',
        timing: 'Утром',
        withFood: false,
        instructions: 'Принимать утром. Контролировать АД и функцию почек.',
        sideEffects: ['Головокружение', 'Сухой кашель'],
        contraindications: ['Ангионевротический отек', 'Беременность']
      }
    ],
    instructions: 'Самоконтроль гликемии 2 раза в день (натощак и через 2 часа после еды). Контроль АД утром и вечером. Диета №9.',
    notes: 'Комбинированная терапия. Пациентка обучена самоконтролю.',
    refills: 2,
    refillsRemaining: 2,
    lastFilled: '2024-01-22',
    nextRefillDate: '2024-02-22',
    createdBy: 'Смирнов А.И.',
    createdAt: '2024-01-22T16:30:00Z',
    updatedAt: '2024-01-22T16:30:00Z'
  },
  {
    id: 'rx-009',
    patientId: 'pat-001',
    patientName: 'Иванов Алексей Петрович',
    patientBirthDate: '1985-03-15',
    patientPhone: '+7 (912) 345-67-89',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    doctorSpecialization: 'Терапевт',
    issueDate: '2024-01-15',
    expirationDate: '2024-01-30',
    status: 'expired',
    priority: 'routine',
    type: 'medication',
    diagnosis: 'Острый бронхит',
    medications: [
      {
        id: 'med-010',
        name: 'Азитромицин',
        genericName: 'Azithromycin',
        dosage: '500 мг',
        form: 'tablet',
        strength: '500mg',
        quantity: 3,
        unit: 'таблеток',
        frequency: '1 раз в день',
        duration: '3 дня',
        route: 'oral',
        timing: 'За 1 час до еды или через 2 часа после',
        withFood: false,
        instructions: 'Принимать 1 таблетку в день в течение 3 дней. Запивать большим количеством воды.',
        sideEffects: ['Тошнота', 'Диарея', 'Боль в животе'],
        contraindications: ['Тяжелые нарушения функции печени', 'Аллергия на макролиды']
      }
    ],
    instructions: 'Обильное питье, постельный режим. При сохранении кашля более 7 дней - повторная консультация.',
    notes: 'Кашель с мокротой, температура 37.8°C. Состояние удовлетворительное.',
    refills: 0,
    refillsRemaining: 0,
    lastFilled: '2024-01-15',
    createdBy: 'Новиков А.М.',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z'
  }
];

// Демо данные аптек
export const pharmacies: Pharmacy[] = [
  {
    id: 'ph-001',
    name: 'Аптека №1 "Здоровье"',
    address: 'ул. Ленина, 15, Москва',
    phone: '+7 (495) 123-45-67',
    email: 'apteka1@health.ru',
    hours: '08:00-22:00',
    is24h: false,
    coordinates: { lat: 55.7558, lng: 37.6173 }
  },
  {
    id: 'ph-002',
    name: 'Аптека "Доктор"',
    address: 'пр. Мира, 28, Москва',
    phone: '+7 (495) 234-56-78',
    email: 'doctor@pharmacy.ru',
    hours: '09:00-21:00',
    is24h: false,
    coordinates: { lat: 55.7818, lng: 37.6333 }
  },
  {
    id: 'ph-003',
    name: 'Аптека "Неотложка"',
    address: 'ул. Тверская, 10, Москва',
    phone: '+7 (495) 345-67-89',
    email: 'neotlozhka@apteka.ru',
    hours: '00:00-23:59',
    is24h: true,
    coordinates: { lat: 55.7570, lng: 37.6070 }
  },
  {
    id: 'ph-004',
    name: 'Сетевая аптека "Фармация"',
    address: 'ул. Арбат, 35, Москва',
    phone: '+7 (495) 456-78-90',
    email: 'farmaciya@mail.ru',
    hours: '08:00-23:00',
    is24h: false,
    coordinates: { lat: 55.7490, lng: 37.5910 }
  },
  {
    id: 'ph-005',
    name: 'Аптека "Витамин"',
    address: 'ул. Новый Арбат, 21, Москва',
    phone: '+7 (495) 567-89-01',
    email: 'vitamin@apteka.ru',
    hours: '07:00-00:00',
    is24h: false,
    coordinates: { lat: 55.7520, lng: 37.5830 }
  }
];

// Вспомогательные функции
export const getPrescriptionById = (id: string): Prescription | undefined => {
  return prescriptions.find(prescription => prescription.id === id);
};

export const getPrescriptionsByPatientId = (patientId: string): Prescription[] => {
  return prescriptions.filter(prescription => prescription.patientId === patientId);
};

export const getPrescriptionsByDoctorId = (doctorId: string): Prescription[] => {
  return prescriptions.filter(prescription => prescription.doctorId === doctorId);
};

export const getActivePrescriptions = (): Prescription[] => {
  return prescriptions.filter(prescription => prescription.status === 'active');
};

export const getExpiringPrescriptions = (days: number = 7): Prescription[] => {
  const today = new Date();
  const threshold = new Date();
  threshold.setDate(today.getDate() + days);
  
  return prescriptions.filter(prescription => {
    const expDate = new Date(prescription.expirationDate);
    return prescription.status === 'active' && expDate <= threshold && expDate >= today;
  });
};

export const getUrgentPrescriptions = (): Prescription[] => {
  return prescriptions.filter(prescription => 
    prescription.status === 'active' && prescription.priority === 'urgent'
  );
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

export const getStatusConfig = (status: Prescription['status']) => {
  const configs = {
    active: { color: 'bg-green-500/20 border-green-500/30 text-green-400', label: 'Активен', icon: '✅' },
    completed: { color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', label: 'Завершен', icon: '📋' },
    cancelled: { color: 'bg-red-500/20 border-red-500/30 text-red-400', label: 'Отменен', icon: '❌' },
    expired: { color: 'bg-gray-500/20 border-gray-500/30 text-gray-400', label: 'Истек', icon: '⏰' }
  };
  return configs[status];
};

export const getPriorityConfig = (priority: Prescription['priority']) => {
  const configs = {
    routine: { color: 'bg-gray-500/20 text-gray-400', label: 'Обычный', icon: '⚪' },
    urgent: { color: 'bg-orange-500/20 text-orange-400', label: 'Срочный', icon: '🟡' },
    emergency: { color: 'bg-red-500/20 text-red-400', label: 'Экстренный', icon: '🔴' }
  };
  return configs[priority];
};

export const getTypeConfig = (type: Prescription['type']) => {
  const configs = {
    medication: { icon: '💊', label: 'Лекарства', color: 'text-blue-400' },
    procedure: { icon: '🩺', label: 'Процедура', color: 'text-purple-400' },
    examination: { icon: '🔍', label: 'Обследование', color: 'text-green-400' },
    therapy: { icon: '🧘', label: 'Терапия', color: 'text-orange-400' }
  };
  return configs[type];
};

export const getFormConfig = (form: PrescriptionMedication['form']) => {
  const configs = {
    tablet: { icon: '💊', label: 'Таблетки' },
    capsule: { icon: '💊', label: 'Капсулы' },
    liquid: { icon: '🧴', label: 'Жидкость' },
    injection: { icon: '💉', label: 'Инъекции' },
    ointment: { icon: '🧴', label: 'Мазь' },
    inhaler: { icon: '💨', label: 'Ингалятор' },
    suppository: { icon: '💊', label: 'Суппозитории' }
  };
  return configs[form];
};

export const isPrescriptionExpired = (prescription: Prescription): boolean => {
  return new Date(prescription.expirationDate) < new Date();
};

export const canRefill = (prescription: Prescription): boolean => {
  return prescription.status === 'active' && 
         prescription.refillsRemaining > 0 && 
         !isPrescriptionExpired(prescription);
};