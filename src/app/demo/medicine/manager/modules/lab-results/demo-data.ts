export interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  patientBirthDate: string;
  patientGender: 'male' | 'female';
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  orderDate: string;
  collectionDate: string;
  resultDate: string;
  status: 'pending' | 'completed' | 'cancelled' | 'rejected';
  priority: 'routine' | 'urgent' | 'stat';
  testType: 'blood' | 'urine' | 'biochemistry' | 'hematology' | 'microbiology' | 'immunology' | 'hormones';
  tests: LabTest[];
  laboratory: string;
  labReference: string;
  collectionMethod: string;
  specimenType: string;
  clinicalNotes?: string;
  interpretation?: string;
  recommendations?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  result: string;
  unit: string;
  normalRange: string;
  flag: 'normal' | 'low' | 'high' | 'critical';
  method: string;
  notes?: string;
  subTests?: LabSubTest[];
}

export interface LabSubTest {
  id: string;
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  flag: 'normal' | 'low' | 'high' | 'critical';
}

export interface Laboratory {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  testsPerformed: string[];
  turnaroundTime: string;
  accreditation: string[];
}

// Демо данные лабораторных результатов
export const labResults: LabResult[] = [
  {
    id: 'lab-001',
    patientId: 'pat-001',
    patientName: 'Иванов Алексей Петрович',
    patientBirthDate: '1985-03-15',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-89',
    doctorId: 'doc-001',
    doctorName: 'Смирнов Александр Иванович',
    doctorSpecialization: 'Кардиолог',
    orderDate: '2024-01-20',
    collectionDate: '2024-01-20',
    resultDate: '2024-01-21',
    status: 'completed',
    priority: 'routine',
    testType: 'blood',
    tests: [
      {
        id: 'test-001',
        name: 'Общий анализ крови',
        category: 'Гематология',
        result: 'Норма',
        unit: '',
        normalRange: '',
        flag: 'normal',
        method: 'Автоматический анализатор',
        subTests: [
          {
            id: 'sub-001',
            name: 'Гемоглобин',
            result: '145',
            unit: 'г/л',
            normalRange: '130-160',
            flag: 'normal'
          },
          {
            id: 'sub-002',
            name: 'Эритроциты',
            result: '5.2',
            unit: 'млн/мкл',
            normalRange: '4.5-5.5',
            flag: 'normal'
          },
          {
            id: 'sub-003',
            name: 'Лейкоциты',
            result: '6.8',
            unit: 'тыс/мкл',
            normalRange: '4.0-9.0',
            flag: 'normal'
          },
          {
            id: 'sub-004',
            name: 'Тромбоциты',
            result: '250',
            unit: 'тыс/мкл',
            normalRange: '150-400',
            flag: 'normal'
          }
        ]
      },
      {
        id: 'test-002',
        name: 'Биохимический анализ крови',
        category: 'Биохимия',
        result: 'Норма',
        unit: '',
        normalRange: '',
        flag: 'normal',
        method: 'Фотометрия',
        subTests: [
          {
            id: 'sub-005',
            name: 'Глюкоза',
            result: '5.8',
            unit: 'ммоль/л',
            normalRange: '3.9-6.1',
            flag: 'normal'
          },
          {
            id: 'sub-006',
            name: 'Холестерин общий',
            result: '5.9',
            unit: 'ммоль/л',
            normalRange: '3.0-5.2',
            flag: 'high'
          },
          {
            id: 'sub-007',
            name: 'АЛТ',
            result: '35',
            unit: 'Ед/л',
            normalRange: '10-40',
            flag: 'normal'
          },
          {
            id: 'sub-008',
            name: 'АСТ',
            result: '32',
            unit: 'Ед/л',
            normalRange: '10-40',
            flag: 'normal'
          },
          {
            id: 'sub-009',
            name: 'Креатинин',
            result: '88',
            unit: 'мкмоль/л',
            normalRange: '62-106',
            flag: 'normal'
          }
        ]
      }
    ],
    laboratory: 'Лаборатория "Диалаб"',
    labReference: 'DL-2024-001234',
    collectionMethod: 'Венозная кровь',
    specimenType: 'Цельная кровь',
    clinicalNotes: 'Контрольный анализ на фоне терапии гипертонии',
    interpretation: 'Результаты в пределах нормы, за исключением умеренно повышенного уровня холестерина. Рекомендована диета.',
    recommendations: 'Повторить анализ через 3 месяца. Соблюдать гиполипидемическую диету.',
    createdBy: 'Смирнов А.И.',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-21T14:30:00Z'
  },
  {
    id: 'lab-002',
    patientId: 'pat-002',
    patientName: 'Петрова Елена Владимировна',
    patientBirthDate: '1990-07-22',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-67-91',
    doctorId: 'doc-002',
    doctorName: 'Кузнецова Ольга Петровна',
    doctorSpecialization: 'Невролог',
    orderDate: '2024-01-24',
    collectionDate: '2024-01-24',
    resultDate: '2024-01-25',
    status: 'completed',
    priority: 'urgent',
    testType: 'blood',
    tests: [
      {
        id: 'test-003',
        name: 'Гормональный профиль',
        category: 'Эндокринология',
        result: 'Отклонения',
        unit: '',
        normalRange: '',
        flag: 'high',
        method: 'Иммунохемилюминесценция',
        subTests: [
          {
            id: 'sub-010',
            name: 'ТТГ',
            result: '4.8',
            unit: 'мкМЕ/мл',
            normalRange: '0.4-4.0',
            flag: 'high'
          },
          {
            id: 'sub-011',
            name: 'Т4 свободный',
            result: '14',
            unit: 'пмоль/л',
            normalRange: '9-19',
            flag: 'normal'
          },
          {
            id: 'sub-012',
            name: 'Пролактин',
            result: '850',
            unit: 'мМЕ/л',
            normalRange: '100-550',
            flag: 'high'
          }
        ]
      }
    ],
    laboratory: 'Центр молекулярной диагностики',
    labReference: 'CMD-2024-005678',
    collectionMethod: 'Венозная кровь',
    specimenType: 'Сыворотка',
    clinicalNotes: 'Обследование по поводу головных болей и нарушений менструального цикла',
    interpretation: 'Выявлено повышение уровня ТТГ и пролактина. Возможен синдром гиперпролактинемии.',
    recommendations: 'Консультация эндокринолога. МРТ гипофиза. Повторный анализ через 1 месяц.',
    createdBy: 'Кузнецова О.П.',
    createdAt: '2024-01-24T09:15:00Z',
    updatedAt: '2024-01-25T11:20:00Z'
  },
  {
    id: 'lab-003',
    patientId: 'pat-003',
    patientName: 'Сидоров Михаил Александрович',
    patientBirthDate: '1978-11-30',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-93',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    doctorSpecialization: 'Терапевт',
    orderDate: '2024-01-23',
    collectionDate: '2024-01-23',
    resultDate: '2024-01-24',
    status: 'completed',
    priority: 'routine',
    testType: 'urine',
    tests: [
      {
        id: 'test-004',
        name: 'Общий анализ мочи',
        category: 'Уринализ',
        result: 'Отклонения',
        unit: '',
        normalRange: '',
        flag: 'high',
        method: 'Тест-полоски, микроскопия',
        subTests: [
          {
            id: 'sub-013',
            name: 'Белок',
            result: '0.3',
            unit: 'г/л',
            normalRange: '0-0.1',
            flag: 'high'
          },
          {
            id: 'sub-014',
            name: 'Лейкоциты',
            result: '25',
            unit: 'в п/зр',
            normalRange: '0-5',
            flag: 'high'
          },
          {
            id: 'sub-015',
            name: 'Эритроциты',
            result: '10',
            unit: 'в п/зр',
            normalRange: '0-3',
            flag: 'high'
          },
          {
            id: 'sub-016',
            name: 'Нитриты',
            result: 'Положительно',
            unit: '',
            normalRange: 'Отрицательно',
            flag: 'high'
          }
        ]
      }
    ],
    laboratory: 'Клинико-диагностическая лаборатория',
    labReference: 'KDL-2024-003456',
    collectionMethod: 'Средняя порция утренней мочи',
    specimenType: 'Моча',
    clinicalNotes: 'Жалобы на боли в пояснице, учащенное мочеиспускание',
    interpretation: 'Признаки инфекции мочевыводящих путей. Протеинурия, лейкоцитурия, эритроцитурия.',
    recommendations: 'Посев мочи на флору и чувствительность. Консультация уролога. Антибактериальная терапия.',
    createdBy: 'Новиков А.М.',
    createdAt: '2024-01-23T14:00:00Z',
    updatedAt: '2024-01-24T16:45:00Z'
  },
  {
    id: 'lab-004',
    patientId: 'pat-004',
    patientName: 'Козлова Анна Сергеевна',
    patientBirthDate: '1995-05-14',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-67-95',
    doctorId: 'doc-004',
    doctorName: 'Лебедева Екатерина Александровна',
    doctorSpecialization: 'Гинеколог',
    orderDate: '2024-01-18',
    collectionDate: '2024-01-18',
    resultDate: '2024-01-20',
    status: 'completed',
    priority: 'routine',
    testType: 'hematology',
    tests: [
      {
        id: 'test-005',
        name: 'Гемостазиограмма',
        category: 'Коагулология',
        result: 'Норма',
        unit: '',
        normalRange: '',
        flag: 'normal',
        method: 'Коагулометрия',
        subTests: [
          {
            id: 'sub-017',
            name: 'Протромбиновое время',
            result: '12.5',
            unit: 'сек',
            normalRange: '11-14',
            flag: 'normal'
          },
          {
            id: 'sub-018',
            name: 'АЧТВ',
            result: '32',
            unit: 'сек',
            normalRange: '25-35',
            flag: 'normal'
          },
          {
            id: 'sub-019',
            name: 'Фибриноген',
            result: '3.2',
            unit: 'г/л',
            normalRange: '2.0-4.0',
            flag: 'normal'
          }
        ]
      },
      {
        id: 'test-006',
        name: 'Железо и ферритин',
        category: 'Биохимия',
        result: 'Отклонения',
        unit: '',
        normalRange: '',
        flag: 'low',
        method: 'Колориметрия',
        subTests: [
          {
            id: 'sub-020',
            name: 'Сывороточное железо',
            result: '8',
            unit: 'мкмоль/л',
            normalRange: '9-30',
            flag: 'low'
          },
          {
            id: 'sub-021',
            name: 'Ферритин',
            result: '15',
            unit: 'мкг/л',
            normalRange: '15-150',
            flag: 'low'
          }
        ]
      }
    ],
    laboratory: 'Лаборатория гемостаза',
    labReference: 'LG-2024-002345',
    collectionMethod: 'Венозная кровь',
    specimenType: 'Цитратная плазма, сыворотка',
    clinicalNotes: 'Обследование по поводу железодефицитной анемии',
    interpretation: 'Признаки латентного дефицита железа. Показатели гемостаза в норме.',
    recommendations: 'Препараты железа. Контроль через 1 месяц. Обогатить диету железосодержащими продуктами.',
    createdBy: 'Лебедева Е.А.',
    createdAt: '2024-01-18T10:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: 'lab-005',
    patientId: 'pat-005',
    patientName: 'Николаев Дмитрий Игоревич',
    patientBirthDate: '1982-09-08',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-97',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    doctorSpecialization: 'Терапевт',
    orderDate: '2024-01-24',
    collectionDate: '2024-01-24',
    resultDate: '2024-01-24',
    status: 'completed',
    priority: 'stat',
    testType: 'biochemistry',
    tests: [
      {
        id: 'test-007',
        name: 'Экспресс-тест на COVID-19',
        category: 'Вирусология',
        result: 'Отрицательный',
        unit: '',
        normalRange: 'Отрицательный',
        flag: 'normal',
        method: 'Иммунохроматография'
      },
      {
        id: 'test-008',
        name: 'С-реактивный белок',
        category: 'Воспаление',
        result: '25',
        unit: 'мг/л',
        normalRange: '0-5',
        flag: 'high',
        method: 'Иммунотурбидиметрия'
      }
    ],
    laboratory: 'Экспресс-лаборатория',
    labReference: 'EL-2024-001111',
    collectionMethod: 'Назофарингеальный мазок, венозная кровь',
    specimenType: 'Мазок, сыворотка',
    clinicalNotes: 'ОРВИ, температура 38.2°C, кашель',
    interpretation: 'COVID-19 не выявлен. Признаки острого воспалительного процесса.',
    recommendations: 'Симптоматическое лечение. Контроль температуры. При сохранении симптомов более 5 дней - повторная консультация.',
    createdBy: 'Новиков А.М.',
    createdAt: '2024-01-24T14:00:00Z',
    updatedAt: '2024-01-24T16:30:00Z'
  },
  {
    id: 'lab-006',
    patientId: 'pat-002',
    patientName: 'Петрова Елена Владимировна',
    patientBirthDate: '1990-07-22',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-67-91',
    doctorId: 'doc-002',
    doctorName: 'Кузнецова Ольга Петровна',
    doctorSpecialization: 'Невролог',
    orderDate: '2024-01-26',
    collectionDate: '2024-01-26',
    resultDate: '2024-01-27',
    status: 'pending',
    priority: 'routine',
    testType: 'immunology',
    tests: [
      {
        id: 'test-009',
        name: 'Антитела к тиреопероксидазе',
        category: 'Аутоиммунные',
        result: 'Ожидается',
        unit: '',
        normalRange: '0-34',
        flag: 'normal',
        method: 'ИФА'
      }
    ],
    laboratory: 'Иммунологическая лаборатория',
    labReference: 'IL-2024-004567',
    collectionMethod: 'Венозная кровь',
    specimenType: 'Сыворотка',
    clinicalNotes: 'Дополнительное обследование при повышении ТТГ',
    createdBy: 'Кузнецова О.П.',
    createdAt: '2024-01-26T11:00:00Z',
    updatedAt: '2024-01-26T11:00:00Z'
  },
  {
    id: 'lab-007',
    patientId: 'pat-007',
    patientName: 'Васильев Артем Олегович',
    patientBirthDate: '1992-02-18',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-68-01',
    doctorId: 'doc-003',
    doctorName: 'Попов Сергей Владимирович',
    doctorSpecialization: 'Хирург',
    orderDate: '2024-01-24',
    collectionDate: '2024-01-24',
    resultDate: '2024-01-26',
    status: 'completed',
    priority: 'urgent',
    testType: 'microbiology',
    tests: [
      {
        id: 'test-010',
        name: 'Посев на флору и чувствительность',
        category: 'Микробиология',
        result: 'Рост обнаружен',
        unit: '',
        normalRange: 'Нет роста',
        flag: 'high',
        method: 'Бактериологический посев',
        subTests: [
          {
            id: 'sub-022',
            name: 'Выделенный микроорганизм',
            result: 'Staphylococcus aureus',
            unit: '',
            normalRange: '',
            flag: 'high'
          },
          {
            id: 'sub-023',
            name: 'Чувствительность к антибиотикам',
            result: 'Чувствителен',
            unit: '',
            normalRange: '',
            flag: 'normal'
          }
        ]
      }
    ],
    laboratory: 'Бактериологическая лаборатория',
    labReference: 'BL-2024-003333',
    collectionMethod: 'Мазок из раны',
    specimenType: 'Отделяемое раны',
    clinicalNotes: 'Послеоперационная рана, признаки воспаления',
    interpretation: 'Выявлен Staphylococcus aureus. Чувствителен к оксациллину, цефазолину.',
    recommendations: 'Антибактериальная терапия согласно чувствительности. Местная обработка раны.',
    createdBy: 'Попов С.В.',
    createdAt: '2024-01-24T16:00:00Z',
    updatedAt: '2024-01-26T13:20:00Z'
  },
  {
    id: 'lab-008',
    patientId: 'pat-008',
    patientName: 'Морозова Татьяна Дмитриевна',
    patientBirthDate: '1975-06-25',
    patientGender: 'female',
    patientPhone: '+7 (912) 345-68-03',
    doctorId: 'doc-001',
    doctorName: 'Смирнов Александр Иванович',
    doctorSpecialization: 'Кардиолог',
    orderDate: '2024-01-22',
    collectionDate: '2024-01-22',
    resultDate: '2024-01-23',
    status: 'completed',
    priority: 'routine',
    testType: 'blood',
    tests: [
      {
        id: 'test-011',
        name: 'Липидный профиль',
        category: 'Биохимия',
        result: 'Отклонения',
        unit: '',
        normalRange: '',
        flag: 'high',
        method: 'Ферментативный',
        subTests: [
          {
            id: 'sub-024',
            name: 'ЛПНП',
            result: '4.5',
            unit: 'ммоль/л',
            normalRange: '0-3.0',
            flag: 'high'
          },
          {
            id: 'sub-025',
            name: 'ЛПВП',
            result: '0.9',
            unit: 'ммоль/л',
            normalRange: '1.0-2.0',
            flag: 'low'
          },
          {
            id: 'sub-026',
            name: 'Триглицериды',
            result: '2.8',
            unit: 'ммоль/л',
            normalRange: '0-1.7',
            flag: 'high'
          }
        ]
      }
    ],
    laboratory: 'Кардиологическая лаборатория',
    labReference: 'CL-2024-002222',
    collectionMethod: 'Венозная кровь',
    specimenType: 'Сыворотка',
    clinicalNotes: 'Контроль на фоне терапии статинами',
    interpretation: 'Выраженная дислипидемия. Необходима коррекция терапии.',
    recommendations: 'Увеличить дозу статина. Строгая гиполипидемическая диета. Контроль через 1 месяц.',
    createdBy: 'Смирнов А.И.',
    createdAt: '2024-01-22T15:30:00Z',
    updatedAt: '2024-01-23T10:15:00Z'
  },
  {
    id: 'lab-009',
    patientId: 'pat-001',
    patientName: 'Иванов Алексей Петрович',
    patientBirthDate: '1985-03-15',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-89',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    doctorSpecialization: 'Терапевт',
    orderDate: '2024-01-25',
    collectionDate: '2024-01-25',
    resultDate: '2024-01-25',
    status: 'cancelled',
    priority: 'routine',
    testType: 'blood',
    tests: [
      {
        id: 'test-012',
        name: 'Аллергопанель',
        category: 'Иммунология',
        result: 'Отменен',
        unit: '',
        normalRange: '',
        flag: 'normal',
        method: 'ИФА'
      }
    ],
    laboratory: 'Аллергологический центр',
    labReference: 'AC-2024-004444',
    collectionMethod: 'Венозная кровь',
    specimenType: 'Сыворотка',
    clinicalNotes: 'Отменен по просьбе пациента',
    createdBy: 'Новиков А.М.',
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z'
  },
  {
    id: 'lab-010',
    patientId: 'pat-003',
    patientName: 'Сидоров Михаил Александрович',
    patientBirthDate: '1978-11-30',
    patientGender: 'male',
    patientPhone: '+7 (912) 345-67-93',
    doctorId: 'doc-005',
    doctorName: 'Новиков Андрей Михайлович',
    doctorSpecialization: 'Терапевт',
    orderDate: '2024-01-27',
    collectionDate: '2024-01-27',
    resultDate: '2024-01-27',
    status: 'rejected',
    priority: 'routine',
    testType: 'urine',
    tests: [
      {
        id: 'test-013',
        name: 'Посев мочи',
        category: 'Микробиология',
        result: 'Непригоден',
        unit: '',
        normalRange: '',
        flag: 'critical',
        method: 'Бактериологический посев'
      }
    ],
    laboratory: 'Микробиологическая лаборатория',
    labReference: 'ML-2024-005555',
    collectionMethod: 'Средняя порция мочи',
    specimenType: 'Моча',
    clinicalNotes: 'Образец непригоден для исследования',
    interpretation: 'Недостаточный объем образца. Нарушены условия транспортировки.',
    recommendations: 'Повторить сбор мочи с соблюдением правил подготовки.',
    createdBy: 'Новиков А.М.',
    createdAt: '2024-01-27T08:30:00Z',
    updatedAt: '2024-01-27T14:00:00Z'
  }
];

// Демо данные лабораторий
export const laboratories: Laboratory[] = [
  {
    id: 'lab-001',
    name: 'Лаборатория "Диалаб"',
    address: 'ул. Медицинская, 15, Москва',
    phone: '+7 (495) 111-22-33',
    email: 'info@dialab.ru',
    hours: '07:00-20:00',
    testsPerformed: ['Общеклинические', 'Биохимические', 'Гормональные'],
    turnaroundTime: '1-2 дня',
    accreditation: ['ISO 15189', 'CAP']
  },
  {
    id: 'lab-002',
    name: 'Центр молекулярной диагностики',
    address: 'пр. Научный, 28, Москва',
    phone: '+7 (495) 222-33-44',
    email: 'cmd@cmdiagnostics.ru',
    hours: '08:00-22:00',
    testsPerformed: ['Генетические', 'Молекулярные', 'Иммунологические'],
    turnaroundTime: '3-5 дней',
    accreditation: ['ISO 15189', 'CLIA']
  },
  {
    id: 'lab-003',
    name: 'Клинико-диагностическая лаборатория',
    address: 'ул. Лабораторная, 5, Москва',
    phone: '+7 (495) 333-44-55',
    email: 'kdl@laboratory.ru',
    hours: '06:00-23:00',
    testsPerformed: ['Все виды анализов', 'Срочные анализы'],
    turnaroundTime: '1-3 дня',
    accreditation: ['ISO 15189', 'Росздравнадзор']
  },
  {
    id: 'lab-004',
    name: 'Лаборатория гемостаза',
    address: 'ул. Кровяная, 12, Москва',
    phone: '+7 (495) 444-55-66',
    email: 'hemostasis@lab.ru',
    hours: '08:00-18:00',
    testsPerformed: ['Коагулологические', 'Гематологические'],
    turnaroundTime: '1 день',
    accreditation: ['ISO 15189']
  },
  {
    id: 'lab-005',
    name: 'Экспресс-лаборатория',
    address: 'ул. Срочная, 7, Москва',
    phone: '+7 (495) 555-66-77',
    email: 'express@lab.ru',
    hours: '00:00-23:59',
    testsPerformed: ['Экспресс-тесты', 'Срочные анализы'],
    turnaroundTime: '2-4 часа',
    accreditation: ['Росздравнадзор']
  }
];

// Вспомогательные функции
export const getLabResultById = (id: string): LabResult | undefined => {
  return labResults.find(result => result.id === id);
};

export const getLabResultsByPatientId = (patientId: string): LabResult[] => {
  return labResults.filter(result => result.patientId === patientId);
};

export const getLabResultsByDoctorId = (doctorId: string): LabResult[] => {
  return labResults.filter(result => result.doctorId === doctorId);
};

export const getPendingLabResults = (): LabResult[] => {
  return labResults.filter(result => result.status === 'pending');
};

export const getCriticalLabResults = (): LabResult[] => {
  const criticalResults: LabResult[] = [];
  labResults.forEach(result => {
    if (result.status === 'completed') {
      const hasCritical = result.tests.some(test => 
        test.flag === 'critical' || 
        test.subTests?.some(subTest => subTest.flag === 'critical')
      );
      if (hasCritical) criticalResults.push(result);
    }
  });
  return criticalResults;
};

export const getAbnormalLabResults = (): LabResult[] => {
  const abnormalResults: LabResult[] = [];
  labResults.forEach(result => {
    if (result.status === 'completed') {
      const hasAbnormal = result.tests.some(test => 
        test.flag !== 'normal' || 
        test.subTests?.some(subTest => subTest.flag !== 'normal')
      );
      if (hasAbnormal) abnormalResults.push(result);
    }
  });
  return abnormalResults;
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

export const getStatusConfig = (status: LabResult['status']) => {
  const configs = {
    pending: { color: 'bg-orange-500/20 border-orange-500/30 text-orange-400', label: 'В процессе', icon: '⏳' },
    completed: { color: 'bg-green-500/20 border-green-500/30 text-green-400', label: 'Завершен', icon: '✅' },
    cancelled: { color: 'bg-red-500/20 border-red-500/30 text-red-400', label: 'Отменен', icon: '❌' },
    rejected: { color: 'bg-gray-500/20 border-gray-500/30 text-gray-400', label: 'Отклонен', icon: '🚫' }
  };
  return configs[status];
};

export const getPriorityConfig = (priority: LabResult['priority']) => {
  const configs = {
    routine: { color: 'bg-gray-500/20 text-gray-400', label: 'Обычный', icon: '⚪' },
    urgent: { color: 'bg-orange-500/20 text-orange-400', label: 'Срочный', icon: '🟡' },
    stat: { color: 'bg-red-500/20 text-red-400', label: 'STAT', icon: '🔴' }
  };
  return configs[priority];
};

export const getTestTypeConfig = (testType: LabResult['testType']) => {
  const configs = {
    blood: { icon: '💉', label: 'Кровь', color: 'text-red-400' },
    urine: { icon: '🧪', label: 'Моча', color: 'text-yellow-400' },
    biochemistry: { icon: '🔬', label: 'Биохимия', color: 'text-blue-400' },
    hematology: { icon: '🩸', label: 'Гематология', color: 'text-red-400' },
    microbiology: { icon: '🧫', label: 'Микробиология', color: 'text-green-400' },
    immunology: { icon: '🛡️', label: 'Иммунология', color: 'text-purple-400' },
    hormones: { icon: '⚖️', label: 'Гормоны', color: 'text-pink-400' }
  };
  return configs[testType];
};

export const getFlagConfig = (flag: LabTest['flag']) => {
  const configs = {
    normal: { color: 'bg-green-500/20 text-green-400', label: 'Норма', icon: '✅' },
    low: { color: 'bg-blue-500/20 text-blue-400', label: 'Низкий', icon: '⬇️' },
    high: { color: 'bg-orange-500/20 text-orange-400', label: 'Высокий', icon: '⬆️' },
    critical: { color: 'bg-red-500/20 text-red-400', label: 'Критичный', icon: '🚨' }
  };
  return configs[flag];
};

export const getOverallFlag = (tests: LabTest[]): LabTest['flag'] => {
  if (tests.some(test => test.flag === 'critical' || test.subTests?.some(st => st.flag === 'critical'))) {
    return 'critical';
  }
  if (tests.some(test => test.flag === 'high' || test.subTests?.some(st => st.flag === 'high'))) {
    return 'high';
  }
  if (tests.some(test => test.flag === 'low' || test.subTests?.some(st => st.flag === 'low'))) {
    return 'low';
  }
  return 'normal';
};