export interface MedicalCard {
  id: string;
  patientId: string;
  patientName: string;
  patientBirthDate: string;
  patientGender: 'male' | 'female';
  patientPhone: string;
  patientEmail: string;
  bloodType: string;
  rhFactor: '+' | '-';
  insurance: string;
  insuranceNumber: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'temporary';
  lastVisit: string;
  nextAppointment?: string;
  attendingPhysician: string;
  physicianId: string;
}

export interface MedicalHistory {
  id: string;
  cardId: string;
  date: string;
  type: 'diagnosis' | 'treatment' | 'examination' | 'procedure' | 'vaccination';
  title: string;
  description: string;
  doctor: string;
  department: string;
  attachments?: string[];
  medications?: Medication[];
  labResults?: LabResult[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface LabResult {
  id: string;
  testName: string;
  testDate: string;
  result: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
}

export interface Allergy {
  id: string;
  cardId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  firstObserved: string;
  status: 'active' | 'resolved';
}

export interface ChronicDisease {
  id: string;
  cardId: string;
  disease: string;
  diagnosedDate: string;
  status: 'active' | 'in-remission' | 'resolved';
  treatment: string;
  notes: string;
}

// Демо данные медицинских карт
export const medicalCards: MedicalCard[] = [
  {
    id: 'card-001',
    patientId: 'pat-001',
    patientName: 'Иванов Алексей Петрович',
    patientBirthDate: '1985-03-15',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-89',
    patientEmail: 'alexey.ivanov@email.com',
    bloodType: 'A',
    rhFactor: '+',
    insurance: 'ОМС',
    insuranceNumber: 'ОМС-1234567890',
    createdAt: '2020-05-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    status: 'active',
    lastVisit: '2024-01-20',
    nextAppointment: '2024-02-24',
    attendingPhysician: 'Смирнов Александр Иванович',
    physicianId: 'doc-001'
  },
  {
    id: 'card-002',
    patientId: 'pat-002',
    patientName: 'Петрова Елена Владимировна',
    patientBirthDate: '1990-07-22',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-67-91',
    patientEmail: 'elena.petrova@email.com',
    bloodType: 'O',
    rhFactor: '+',
    insurance: 'ДМС',
    insuranceNumber: 'ДМС-9876543210',
    createdAt: '2019-11-15T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z',
    status: 'active',
    lastVisit: '2024-01-24',
    nextAppointment: '2024-02-28',
    attendingPhysician: 'Кузнецова Ольга Петровна',
    physicianId: 'doc-002'
  },
  {
    id: 'card-003',
    patientId: 'pat-003',
    patientName: 'Сидоров Михаил Александрович',
    patientBirthDate: '1978-11-30',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-93',
    patientEmail: 'mikhail.sidorov@email.com',
    bloodType: 'B',
    rhFactor: '+',
    insurance: 'ОМС',
    insuranceNumber: 'ОМС-4567890123',
    createdAt: '2021-02-20T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z',
    status: 'active',
    lastVisit: '2024-01-23',
    attendingPhysician: 'Попов Сергей Владимирович',
    physicianId: 'doc-003'
  },
  {
    id: 'card-004',
    patientId: 'pat-004',
    patientName: 'Козлова Анна Сергеевна',
    patientBirthDate: '1995-05-14',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-67-95',
    patientEmail: 'anna.kozlova@email.com',
    bloodType: 'AB',
    rhFactor: '+',
    insurance: 'ДМС',
    insuranceNumber: 'ДМС-5678901234',
    createdAt: '2022-08-05T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    status: 'active',
    lastVisit: '2024-01-18',
    nextAppointment: '2024-01-26',
    attendingPhysician: 'Лебедева Екатерина Александровна',
    physicianId: 'doc-004'
  },
  {
    id: 'card-005',
    patientId: 'pat-005',
    patientName: 'Николаев Дмитрий Игоревич',
    patientBirthDate: '1982-09-08',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-97',
    patientEmail: 'dmitry.nikolaev@email.com',
    bloodType: 'A',
    rhFactor: '-',
    insurance: 'ОМС',
    insuranceNumber: 'ОМС-7890123456',
    createdAt: '2020-12-12T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z',
    status: 'active',
    lastVisit: '2024-01-24',
    attendingPhysician: 'Новиков Андрей Михайлович',
    physicianId: 'doc-005'
  },
  {
    id: 'card-006',
    patientId: 'pat-006',
    patientName: 'Федорова Светлана Викторовна',
    patientBirthDate: '1988-12-03',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-67-99',
    patientEmail: 'svetlana.fedorova@email.com',
    bloodType: 'O',
    rhFactor: '-',
    insurance: 'ДМС',
    insuranceNumber: 'ДМС-3456789012',
    createdAt: '2018-06-30T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    status: 'archived',
    lastVisit: '2023-12-15',
    attendingPhysician: 'Фролова Марина Викторовна',
    physicianId: 'doc-006'
  },
  {
    id: 'card-007',
    patientId: 'pat-007',
    patientName: 'Васильев Артем Олегович',
    patientBirthDate: '1992-02-18',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-68-01',
    patientEmail: 'artem.vasiliev@email.com',
    bloodType: 'B',
    rhFactor: '-',
    insurance: 'ОМС',
    insuranceNumber: 'ОМС-2345678901',
    createdAt: '2023-03-22T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z',
    status: 'active',
    lastVisit: '2024-01-24',
    nextAppointment: '2024-01-26',
    attendingPhysician: 'Попов Сергей Владимирович',
    physicianId: 'doc-003'
  },
  {
    id: 'card-008',
    patientId: 'pat-008',
    patientName: 'Морозова Татьяна Дмитриевна',
    patientBirthDate: '1975-06-25',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-68-03',
    patientEmail: 'tatiana.morozova@email.com',
    bloodType: 'A',
    rhFactor: '+',
    insurance: 'ДМС',
    insuranceNumber: 'ДМС-8765432109',
    createdAt: '2017-09-14T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
    status: 'active',
    lastVisit: '2024-01-22',
    nextAppointment: '2024-02-15',
    attendingPhysician: 'Смирнов Александр Иванович',
    physicianId: 'doc-001'
  }
];

// Демо данные медицинской истории
export const medicalHistory: MedicalHistory[] = [
  {
    id: 'hist-001',
    cardId: 'card-001',
    date: '2024-01-20',
    type: 'diagnosis',
    title: 'Контрольный осмотр кардиолога',
    description: 'Пациент проходит плановый контроль артериального давления. Состояние стабильное, АД 130/85 мм рт.ст.',
    doctor: 'Смирнов Александр Иванович',
    department: 'Кардиология',
    medications: [
      {
        id: 'med-001',
        name: 'Лизиноприл',
        dosage: '10 мг',
        frequency: '1 раз в день',
        duration: 'Постоянно',
        startDate: '2023-06-15',
        endDate: '2024-06-15',
        prescribedBy: 'Смирнов А.И.',
        status: 'active'
      }
    ]
  },
  {
    id: 'hist-002',
    cardId: 'card-002',
    date: '2024-01-24',
    type: 'diagnosis',
    title: 'Консультация невролога',
    description: 'Пациентка жалуется на сильные головные боли и головокружение. Назначено МРТ головного мозга.',
    doctor: 'Кузнецова Ольга Петровна',
    department: 'Неврология',
    medications: [
      {
        id: 'med-002',
        name: 'Суматриптан',
        dosage: '50 мг',
        frequency: 'При необходимости',
        duration: '1 месяц',
        startDate: '2024-01-24',
        endDate: '2024-02-24',
        prescribedBy: 'Кузнецова О.П.',
        status: 'active'
      }
    ]
  },
  {
    id: 'hist-003',
    cardId: 'card-003',
    date: '2024-01-23',
    type: 'diagnosis',
    title: 'Обострение гастрита',
    description: 'Пациент жалуется на боль в желудке и изжогу. Рекомендована гастроскопия.',
    doctor: 'Новиков Андрей Михайлович',
    department: 'Терапия',
    medications: [
      {
        id: 'med-003',
        name: 'Омепразол',
        dosage: '20 мг',
        frequency: '2 раза в день',
        duration: '14 дней',
        startDate: '2024-01-23',
        endDate: '2024-02-06',
        prescribedBy: 'Новиков А.М.',
        status: 'active'
      }
    ]
  },
  {
    id: 'hist-004',
    cardId: 'card-004',
    date: '2024-01-18',
    type: 'examination',
    title: 'Плановый гинекологический осмотр',
    description: 'Проведен плановый осмотр, взяты анализы. Состояние удовлетворительное.',
    doctor: 'Лебедева Екатерина Александровна',
    department: 'Гинекология'
  },
  {
    id: 'hist-005',
    cardId: 'card-005',
    date: '2024-01-24',
    type: 'diagnosis',
    title: 'ОРВИ',
    description: 'Острая респираторная вирусная инфекция. Температура 38.2°C, кашель, насморк.',
    doctor: 'Новиков Андрей Михайлович',
    department: 'Терапия',
    medications: [
      {
        id: 'med-004',
        name: 'Парацетамол',
        dosage: '500 мг',
        frequency: '3 раза в день',
        duration: '5 дней',
        startDate: '2024-01-24',
        endDate: '2024-01-29',
        prescribedBy: 'Новиков А.М.',
        status: 'active'
      }
    ]
  },
  {
    id: 'hist-006',
    cardId: 'card-007',
    date: '2024-01-24',
    type: 'examination',
    title: 'Консультация хирурга',
    description: 'Острая боль в колене после спортивной травмы. Назначена артроскопия.',
    doctor: 'Попов Сергей Владимирович',
    department: 'Хирургия'
  },
  {
    id: 'hist-007',
    cardId: 'card-008',
    date: '2024-01-22',
    type: 'diagnosis',
    title: 'Контроль терапии гипертонии',
    description: 'Коррекция антигипертензивной терапии. АД 140/90 мм рт.ст.',
    doctor: 'Смирнов Александр Иванович',
    department: 'Кардиология'
  }
];

// Демо данные аллергий
export const allergies: Allergy[] = [
  {
    id: 'allergy-001',
    cardId: 'card-001',
    allergen: 'Пенициллин',
    severity: 'severe',
    reaction: 'Анафилактический шок',
    firstObserved: '2010-05-15',
    status: 'active'
  },
  {
    id: 'allergy-002',
    cardId: 'card-001',
    allergen: 'Пыльца',
    severity: 'moderate',
    reaction: 'Аллергический ринит',
    firstObserved: '2015-04-20',
    status: 'active'
  },
  {
    id: 'allergy-003',
    cardId: 'card-002',
    allergen: 'Аспирин',
    severity: 'severe',
    reaction: 'Бронхоспазм',
    firstObserved: '2018-03-10',
    status: 'active'
  },
  {
    id: 'allergy-004',
    cardId: 'card-002',
    allergen: 'Шерсть животных',
    severity: 'mild',
    reaction: 'Кожная сыпь',
    firstObserved: '2020-11-05',
    status: 'active'
  },
  {
    id: 'allergy-005',
    cardId: 'card-003',
    allergen: 'Морепродукты',
    severity: 'moderate',
    reaction: 'Отек Квинке',
    firstObserved: '2019-07-22',
    status: 'active'
  },
  {
    id: 'allergy-006',
    cardId: 'card-004',
    allergen: 'Лактоза',
    severity: 'mild',
    reaction: 'Диарея, вздутие',
    firstObserved: '2021-02-14',
    status: 'active'
  },
  {
    id: 'allergy-007',
    cardId: 'card-004',
    allergen: 'Пыль',
    severity: 'moderate',
    reaction: 'Аллергический конъюнктивит',
    firstObserved: '2022-08-30',
    status: 'active'
  },
  {
    id: 'allergy-008',
    cardId: 'card-005',
    allergen: 'Пенициллин',
    severity: 'moderate',
    reaction: 'Крапивница',
    firstObserved: '2017-12-18',
    status: 'active'
  }
];

// Демо данные хронических заболеваний
export const chronicDiseases: ChronicDisease[] = [
  {
    id: 'chronic-001',
    cardId: 'card-001',
    disease: 'Гипертония',
    diagnosedDate: '2018-03-15',
    status: 'active',
    treatment: 'Антигипертензивная терапия',
    notes: 'Стабильное течение, регулярный контроль АД'
  },
  {
    id: 'chronic-002',
    cardId: 'card-001',
    disease: 'Сахарный диабет 2 типа',
    diagnosedDate: '2019-07-20',
    status: 'active',
    treatment: 'Диета, метформин',
    notes: 'Компенсированное состояние'
  },
  {
    id: 'chronic-003',
    cardId: 'card-002',
    disease: 'Мигрень',
    diagnosedDate: '2016-11-08',
    status: 'active',
    treatment: 'Триптаны по требованию',
    notes: 'Частота приступов 2-3 раза в месяц'
  },
  {
    id: 'chronic-004',
    cardId: 'card-002',
    disease: 'Астма',
    diagnosedDate: '2014-05-12',
    status: 'in-remission',
    treatment: 'Ингаляционные кортикостероиды',
    notes: 'Ремиссия более 1 года'
  },
  {
    id: 'chronic-005',
    cardId: 'card-003',
    disease: 'Артрит',
    diagnosedDate: '2015-09-30',
    status: 'active',
    treatment: 'НПВП, физиотерапия',
    notes: 'Поражение коленных суставов'
  },
  {
    id: 'chronic-006',
    cardId: 'card-003',
    disease: 'Гастрит',
    diagnosedDate: '2017-12-05',
    status: 'active',
    treatment: 'Диета, антациды',
    notes: 'Периодические обострения'
  },
  {
    id: 'chronic-007',
    cardId: 'card-004',
    disease: 'Анемия',
    diagnosedDate: '2022-03-18',
    status: 'active',
    treatment: 'Препараты железа',
    notes: 'Железодефицитная анемия'
  },
  {
    id: 'chronic-008',
    cardId: 'card-008',
    disease: 'Диабет',
    diagnosedDate: '2012-08-22',
    status: 'active',
    treatment: 'Инсулинотерапия',
    notes: 'Сахарный диабет 1 типа'
  },
  {
    id: 'chronic-009',
    cardId: 'card-008',
    disease: 'Гипертония',
    diagnosedDate: '2010-04-15',
    status: 'active',
    treatment: 'Комбинированная терапия',
    notes: 'Резистентная гипертония'
  },
  {
    id: 'chronic-010',
    cardId: 'card-008',
    disease: 'Артрит',
    diagnosedDate: '2013-11-30',
    status: 'active',
    treatment: 'Биологические препараты',
    notes: 'Ревматоидный артрит'
  }
];

// Демо данные лабораторных результатов
export const labResults: LabResult[] = [
  {
    id: 'lab-001',
    testName: 'Общий анализ крови',
    testDate: '2024-01-20',
    result: '5.2',
    unit: 'млн/мкл',
    normalRange: '4.5-5.5',
    status: 'normal'
  },
  {
    id: 'lab-002',
    testName: 'Гемоглобин',
    testDate: '2024-01-20',
    result: '145',
    unit: 'г/л',
    normalRange: '130-160',
    status: 'normal'
  },
  {
    id: 'lab-003',
    testName: 'Глюкоза',
    testDate: '2024-01-20',
    result: '6.8',
    unit: 'ммоль/л',
    normalRange: '3.9-6.1',
    status: 'abnormal'
  },
  {
    id: 'lab-004',
    testName: 'Холестерин',
    testDate: '2024-01-20',
    result: '5.9',
    unit: 'ммоль/л',
    normalRange: '3.0-5.2',
    status: 'abnormal'
  }
];

// Вспомогательные функции
export const getMedicalCardById = (id: string): MedicalCard | undefined => {
  return medicalCards.find(card => card.id === id);
};

export const getMedicalHistoryByCardId = (cardId: string): MedicalHistory[] => {
  return medicalHistory.filter(history => history.cardId === cardId);
};

export const getAllergiesByCardId = (cardId: string): Allergy[] => {
  return allergies.filter(allergy => allergy.cardId === cardId);
};

export const getChronicDiseasesByCardId = (cardId: string): ChronicDisease[] => {
  return chronicDiseases.filter(disease => disease.cardId === cardId);
};

export const getLabResultsByCardId = (cardId: string): LabResult[] => {
  return labResults; // В демо все результаты для всех карт
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

export const getStatusConfig = (status: MedicalCard['status']) => {
  const configs = {
    active: { color: 'bg-green-500/20 border-green-500/30 text-green-400', label: 'Активна', icon: '✅' },
    archived: { color: 'bg-gray-500/20 border-gray-500/30 text-gray-400', label: 'В архиве', icon: '📁' },
    temporary: { color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', label: 'Временная', icon: '⏱️' }
  };
  return configs[status];
};

export const getBloodTypeConfig = (bloodType: string, rhFactor: string) => {
  const configs: { [key: string]: { color: string, label: string } } = {
    'A+': { color: 'bg-red-500/20 text-red-400', label: 'A+' },
    'A-': { color: 'bg-red-500/20 text-red-400', label: 'A-' },
    'B+': { color: 'bg-blue-500/20 text-blue-400', label: 'B+' },
    'B-': { color: 'bg-blue-500/20 text-blue-400', label: 'B-' },
    'AB+': { color: 'bg-purple-500/20 text-purple-400', label: 'AB+' },
    'AB-': { color: 'bg-purple-500/20 text-purple-400', label: 'AB-' },
    'O+': { color: 'bg-green-500/20 text-green-400', label: 'O+' },
    'O-': { color: 'bg-green-500/20 text-green-400', label: 'O-' }
  };
  return configs[`${bloodType}${rhFactor}`] || { color: 'bg-gray-500/20 text-gray-400', label: `${bloodType}${rhFactor}` };
};