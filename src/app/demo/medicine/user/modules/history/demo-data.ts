// /src/app/demo/medicine/user/modules/history/demo-data.ts
export interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  specialization: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescriptions: Prescription[];
  tests?: LabTest[];
  attachments: Attachment[];
  status: 'completed' | 'scheduled' | 'cancelled';
  visitType: 'in-person' | 'online';
  notes?: string;
  duration?: number;
  price?: number;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface LabTest {
  id: string;
  name: string;
  value: string;
  referenceRange: string;
  status: 'normal' | 'warning' | 'critical';
  date: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'lab_result' | 'xray' | 'prescription' | 'other';
  url: string;
  uploadDate: string;
}

export interface LabResult {
  id: string;
  name: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
  date: string;
  referenceRange: string;
}

export const medicalHistory: MedicalRecord[] = [
  {
    id: 'rec-1',
    date: '2024-01-15',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    diagnosis: 'Острый бронхит',
    symptoms: 'Кашель с мокротой, повышенная температура 37.8°C, общая слабость, боль в груди при кашле',
    treatment: 'Противовирусная терапия, обильное питье, постельный режим. Ингаляции с физраствором 2 раза в день. Контроль температуры каждые 4 часа.',
    prescriptions: [
      {
        id: 'med-1',
        medication: 'Амброксол',
        dosage: '30 мг',
        frequency: '3 раза в день',
        duration: '7 дней',
        instructions: 'После еды, запивая стаканом воды. Не сочетать с противокашлевыми средствами.'
      },
      {
        id: 'med-2',
        medication: 'Парацетамол',
        dosage: '500 мг',
        frequency: 'При температуре выше 38°C',
        duration: '3 дня',
        instructions: 'Не более 4 таблеток в сутки. Интервал между приемами не менее 4 часов.'
      },
      {
        id: 'med-3',
        medication: 'Витамин C',
        dosage: '1000 мг',
        frequency: '1 раз в день',
        duration: '10 дней',
        instructions: 'Утром после завтрака'
      }
    ],
    tests: [
      {
        id: 'test-1',
        name: 'Общий анализ крови',
        value: 'В норме',
        referenceRange: 'В пределах референсных значений',
        status: 'normal',
        date: '2024-01-15'
      },
      {
        id: 'test-2',
        name: 'С-реактивный белок',
        value: '12 мг/л',
        referenceRange: 'до 5 мг/л',
        status: 'warning',
        date: '2024-01-15'
      }
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Общий анализ крови',
        type: 'lab_result',
        url: '#',
        uploadDate: '2024-01-15'
      },
      {
        id: 'att-2',
        name: 'Рентген грудной клетки',
        type: 'xray',
        url: '#',
        uploadDate: '2024-01-15'
      },
      {
        id: 'att-3',
        name: 'Биохимический анализ',
        type: 'lab_result',
        url: '#',
        uploadDate: '2024-01-15'
      }
    ],
    status: 'completed',
    visitType: 'in-person',
    duration: 30,
    price: 2500,
    notes: 'Пациенту рекомендовано повторное обследование через 10 дней для контроля динамики. При ухудшении состояния - срочно обратиться к врачу.'
  },
  {
    id: 'rec-2',
    date: '2024-01-10',
    doctorName: 'Петрова Мария Ивановна',
    specialization: 'Кардиолог',
    diagnosis: 'Артериальная гипертензия I стадии',
    symptoms: 'Периодические головные боли в затылочной области, шум в ушах, АД 145/95 мм рт.ст., учащенное сердцебиение при физической нагрузке',
    treatment: 'Гипотензивная терапия, контроль АД 2 раза в день, диета с ограничением соли до 5г/сутки, умеренная физическая активность 30 мин в день',
    prescriptions: [
      {
        id: 'med-4',
        medication: 'Лизиноприл',
        dosage: '10 мг',
        frequency: '1 раз в день',
        duration: 'Постоянно',
        instructions: 'Утром, независимо от приема пищи. Контроль АД через 2 недели для коррекции дозы.'
      },
      {
        id: 'med-5',
        medication: 'Аспирин кардио',
        dosage: '100 мг',
        frequency: '1 раз в день',
        duration: 'Постоянно',
        instructions: 'Вечером после еды'
      }
    ],
    tests: [
      {
        id: 'test-3',
        name: 'ЭКГ',
        value: 'Синусовый ритм',
        referenceRange: 'Норма',
        status: 'normal',
        date: '2024-01-10'
      },
      {
        id: 'test-4',
        name: 'Холестерин общий',
        value: '5.8 ммоль/л',
        referenceRange: 'до 5.2 ммоль/л',
        status: 'warning',
        date: '2024-01-10'
      }
    ],
    attachments: [
      {
        id: 'att-4',
        name: 'ЭКГ',
        type: 'lab_result',
        url: '#',
        uploadDate: '2024-01-10'
      },
      {
        id: 'att-5',
        name: 'Суточный мониторинг АД',
        type: 'lab_result',
        url: '#',
        uploadDate: '2024-01-10'
      },
      {
        id: 'att-6',
        name: 'Эхокардиография',
        type: 'other',
        url: '#',
        uploadDate: '2024-01-10'
      }
    ],
    status: 'completed',
    visitType: 'online',
    duration: 45,
    price: 3500,
    notes: 'Рекомендовано ведение дневника АД с записью утренних и вечерних показателей. Контрольный прием через 1 месяц.'
  },
  {
    id: 'rec-3',
    date: '2024-01-05',
    doctorName: 'Сидоров Владимир Петрович',
    specialization: 'Невролог',
    diagnosis: 'Остеохондроз шейного отдела позвоночника',
    symptoms: 'Боли в шее при движении, головокружение при резких поворотах головы, онемение пальцев рук по утрам, скованность в шейном отделе',
    treatment: 'ЛФК для шейного отдела 2 раза в день, физиотерапия (магнитотерапия 10 сеансов), медикаментозное лечение, коррекция рабочего места',
    prescriptions: [
      {
        id: 'med-6',
        medication: 'Мидокалм',
        dosage: '150 мг',
        frequency: '2 раза в день',
        duration: '14 дней',
        instructions: 'После еды. Возможна сонливость - избегать вождения автомобиля.'
      },
      {
        id: 'med-7',
        medication: 'Витамины группы B (Нейромультивит)',
        dosage: '1 таблетка',
        frequency: '1 раз в день',
        duration: '30 дней',
        instructions: 'Утром после завтрака'
      },
      {
        id: 'med-8',
        medication: 'Диклофенак гель',
        dosage: '1%',
        frequency: '3 раза в день',
        duration: '10 дней',
        instructions: 'Наносить тонким слоем на болезненные участки шеи'
      }
    ],
    tests: [
      {
        id: 'test-5',
        name: 'МРТ шейного отдела',
        value: 'Остеохондроз C5-C7',
        referenceRange: 'Норма',
        status: 'warning',
        date: '2024-01-05'
      }
    ],
    attachments: [
      {
        id: 'att-7',
        name: 'МРТ шейного отдела',
        type: 'xray',
        url: '#',
        uploadDate: '2024-01-05'
      },
      {
        id: 'att-8',
        name: 'Заключение невролога',
        type: 'other',
        url: '#',
        uploadDate: '2024-01-05'
      }
    ],
    status: 'completed',
    visitType: 'in-person',
    duration: 40,
    price: 3200
  },
  {
    id: 'rec-4',
    date: '2024-01-28',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    diagnosis: 'Плановый профилактический осмотр',
    symptoms: 'Жалоб нет. Профилактический осмотр.',
    treatment: 'Стандартный профилактический осмотр, оценка общего состояния',
    prescriptions: [],
    attachments: [],
    status: 'scheduled',
    visitType: 'in-person',
    duration: 20,
    price: 1500
  },
  {
    id: 'rec-5',
    date: '2023-12-20',
    doctorName: 'Козлова Елена Викторовна',
    specialization: 'Офтальмолог',
    diagnosis: 'Миопия средней степени',
    symptoms: 'Ухудшение зрения вдаль, напряжение глаз при работе за компьютером',
    treatment: 'Коррекция зрения очками, гимнастика для глаз, ограничение времени за компьютером',
    prescriptions: [
      {
        id: 'med-9',
        medication: 'Капли для увлажнения глаз',
        dosage: '1 капля',
        frequency: '3 раза в день',
        duration: '30 дней',
        instructions: 'Закапывать в оба глаза при работе за компьютером'
      }
    ],
    attachments: [
      {
        id: 'att-9',
        name: 'Рецепт на очки',
        type: 'prescription',
        url: '#',
        uploadDate: '2023-12-20'
      }
    ],
    status: 'completed',
    visitType: 'in-person',
    duration: 25,
    price: 1800,
    notes: 'Рекомендовано ежегодное обследование у офтальмолога. Подобраны очки для дали: OD -2.5, OS -2.75'
  },
  {
    id: 'rec-6',
    date: '2023-12-10',
    doctorName: 'Григорьева Марина Олеговна',
    specialization: 'Гастроэнтеролог',
    diagnosis: 'Хронический гастрит',
    symptoms: 'Боли в эпигастрии после еды, изжога, отрыжка, нарушение пищеварения',
    treatment: 'Диета №1, дробное питание, медикаментозная терапия',
    prescriptions: [
      {
        id: 'med-10',
        medication: 'Омепразол',
        dosage: '20 мг',
        frequency: '2 раза в день',
        duration: '14 дней',
        instructions: 'За 30 минут до еды'
      },
      {
        id: 'med-11',
        medication: 'Алмагель',
        dosage: '1 ст.л.',
        frequency: '3 раза в день',
        duration: '10 дней',
        instructions: 'После еды'
      }
    ],
    tests: [
      {
        id: 'test-6',
        name: 'ФГДС',
        value: 'Поверхностный гастрит',
        referenceRange: 'Норма',
        status: 'warning',
        date: '2023-12-10'
      }
    ],
    attachments: [
      {
        id: 'att-10',
        name: 'Заключение ФГДС',
        type: 'lab_result',
        url: '#',
        uploadDate: '2023-12-10'
      }
    ],
    status: 'completed',
    visitType: 'online',
    duration: 35,
    price: 2900
  }
];

export const healthMetrics = {
  bloodPressure: '125/80',
  heartRate: '72 уд/мин',
  temperature: '36.6°C',
  weight: '75 кг',
  height: '180 см',
  bmi: '23.1'
};

export const recentLabResults: LabResult[] = [
  {
    id: 'lab-1',
    name: 'Глюкоза крови',
    value: '5.2 ммоль/л',
    status: 'normal',
    date: '2024-01-15',
    referenceRange: '3.3-6.1 ммоль/л'
  },
  {
    id: 'lab-2',
    name: 'Холестерин общий',
    value: '5.8 ммоль/л',
    status: 'warning',
    date: '2024-01-15',
    referenceRange: 'до 5.2 ммоль/л'
  },
  {
    id: 'lab-3',
    name: 'АЛТ',
    value: '45 Ед/л',
    status: 'normal',
    date: '2024-01-15',
    referenceRange: 'до 41 Ед/л'
  },
  {
    id: 'lab-4',
    name: 'Креатинин',
    value: '92 мкмоль/л',
    status: 'normal',
    date: '2024-01-15',
    referenceRange: '62-106 мкмоль/л'
  },
  {
    id: 'lab-5',
    name: 'Гемоглобин',
    value: '145 г/л',
    status: 'normal',
    date: '2024-01-15',
    referenceRange: '130-160 г/л'
  }
];

export type { MedicalRecord, Prescription, Attachment, LabResult };