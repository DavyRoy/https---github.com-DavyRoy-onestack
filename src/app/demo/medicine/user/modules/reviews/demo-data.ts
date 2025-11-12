// src/app/demo/medicine/user/modules/reviews/demo-data.ts
export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  specialization: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
  visitType: 'in-person' | 'online';
  appointmentId: string;
  helpful: number;
  replies: ReviewReply[];
  tags: string[];
}

export interface ReviewReply {
  id: string;
  author: string;
  role: 'doctor' | 'manager' | 'admin';
  message: string;
  date: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  bySpecialization: {
    specialization: string;
    averageRating: number;
    totalReviews: number;
  }[];
}

export const reviewStats: ReviewStats = {
  averageRating: 4.6,
  totalReviews: 147,
  ratingDistribution: {
    5: 89,
    4: 42,
    3: 12,
    2: 3,
    1: 1
  },
  bySpecialization: [
    { specialization: 'Терапевт', averageRating: 4.8, totalReviews: 56 },
    { specialization: 'Кардиолог', averageRating: 4.9, totalReviews: 34 },
    { specialization: 'Невролог', averageRating: 4.7, totalReviews: 28 },
    { specialization: 'Офтальмолог', averageRating: 4.5, totalReviews: 19 },
    { specialization: 'Стоматолог', averageRating: 4.6, totalReviews: 10 }
  ]
};

export const reviews: Review[] = [
  {
    id: 'rev-1',
    patientId: 'pat-001',
    patientName: 'Смирнов Алексей',
    patientAge: 35,
    doctorId: 'doc-1',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    rating: 5,
    title: 'Отличный врач! Профессионал своего дела',
    comment: 'Очень внимательный и профессиональный врач. Тщательно провёл осмотр, подробно объяснил диагноз и назначил эффективное лечение. Приём прошёл вовремя, без задержек. Особенно понравилось, что доктор ответил на все мои вопросы и дал подробные рекомендации по профилактике. Чувствую значительное улучшение состояния после курса лечения.',
    date: '2024-01-20',
    status: 'published',
    visitType: 'in-person',
    appointmentId: 'app-001',
    helpful: 24,
    replies: [
      {
        id: 'reply-1',
        author: 'Иванов А.С.',
        role: 'doctor',
        message: 'Спасибо за ваш отзыв! Рад, что смог помочь. Будьте здоровы и не забывайте о регулярных профилактических осмотрах!',
        date: '2024-01-21'
      },
      {
        id: 'reply-2',
        author: 'Администрация клиники',
        role: 'manager',
        message: 'Благодарим за обратную связь! Мы ценим каждого пациента и стремимся предоставлять качественные медицинские услуги.',
        date: '2024-01-21'
      }
    ],
    tags: ['профессионализм', 'внимательность', 'точность диагноза', 'эффективное лечение']
  },
  {
    id: 'rev-2',
    patientId: 'pat-002',
    patientName: 'Петрова Ольга',
    patientAge: 42,
    doctorId: 'doc-2',
    doctorName: 'Петрова Мария Ивановна',
    specialization: 'Кардиолог',
    rating: 5,
    title: 'Высококвалифицированный специалист с большим опытом',
    comment: 'Доктор Петрова провела полное обследование, назначила необходимые анализы. Очень грамотно объяснила результаты и дала подробные рекомендации по лечению и профилактике сердечно-сосудистых заболеваний. Отдельно хочу отметить современное оборудование кабинета и доброжелательную атмосферу. После курса лечения чувствую себя значительно лучше, нормализовалось давление.',
    date: '2024-01-18',
    status: 'published',
    visitType: 'online',
    appointmentId: 'app-002',
    helpful: 18,
    replies: [],
    tags: ['квалификация', 'обследование', 'рекомендации', 'современное оборудование']
  },
  {
    id: 'rev-3',
    patientId: 'pat-003',
    patientName: 'Козлов Дмитрий',
    patientAge: 28,
    doctorId: 'doc-3',
    doctorName: 'Сидоров Владимир Петрович',
    specialization: 'Невролог',
    rating: 4,
    title: 'Хороший приём, но были небольшие задержки',
    comment: 'Врач внимательно выслушал жалобы, провёл осмотр. Назначенное лечение помогает, но приём начался с небольшой задержкой. В целом остался доволен квалификацией врача и назначенным лечением. Мигрень действительно прошла после курса терапии. Рекомендую специалиста, но советую записываться на утренние часы.',
    date: '2024-01-15',
    status: 'published',
    visitType: 'in-person',
    appointmentId: 'app-003',
    helpful: 12,
    replies: [
      {
        id: 'reply-3',
        author: 'Администратор',
        role: 'manager',
        message: 'Благодарим за обратную связь! Приносим извинения за задержку. Работаем над улучшением организации приёмов. Рады, что лечение оказалось эффективным!',
        date: '2024-01-16'
      }
    ],
    tags: ['внимательность', 'задержка', 'эффективное лечение', 'квалификация']
  },
  {
    id: 'rev-4',
    patientId: 'pat-004',
    patientName: 'Новикова Ирина',
    patientAge: 31,
    doctorId: 'doc-1',
    doctorName: 'Иванов Алексей Сергеевич',
    specialization: 'Терапевт',
    rating: 3,
    title: 'Нормальный приём, но чувствовалась торопливость',
    comment: 'Врач компетентный, но немного торопился. Не все вопросы успела задать. Лечение назначено адекватное, помогло справиться с простудой. Кабинет чистый, оборудование современное. В целом неплохо, но хотелось бы больше времени на консультацию.',
    date: '2024-01-12',
    status: 'published',
    visitType: 'in-person',
    appointmentId: 'app-004',
    helpful: 7,
    replies: [],
    tags: ['компетентность', 'торопливость', 'чистота', 'оборудование']
  },
  {
    id: 'rev-5',
    patientId: 'pat-005',
    patientName: 'Федоров Сергей',
    patientAge: 55,
    doctorId: 'doc-4',
    doctorName: 'Козлова Елена Викторовна',
    specialization: 'Офтальмолог',
    rating: 5,
    title: 'Прекрасный специалист с индивидуальным подходом',
    comment: 'Очень доволен приёмом. Доктор Козлова провела полную диагностику зрения, подробно объяснила все процедуры. Оборудование современное, кабинет чистый и уютный. Подобрали очки идеально - зрение стало комфортным. Отдельное спасибо за терпение и внимательное отношение к пожилому пациенту.',
    date: '2024-01-10',
    status: 'published',
    visitType: 'in-person',
    appointmentId: 'app-005',
    helpful: 31,
    replies: [],
    tags: ['диагностика', 'оборудование', 'чистота', 'индивидуальный подход', 'внимательность']
  },
  {
    id: 'rev-6',
    patientId: 'pat-006',
    patientName: 'Морозова Анна',
    patientAge: 29,
    doctorId: 'doc-2',
    doctorName: 'Петрова Мария Ивановна',
    specialization: 'Кардиолог',
    rating: 5,
    title: 'Лучший кардиолог в городе!',
    comment: 'Очень благодарна доктору Петровой за профессиональный подход и внимательное отношение. Назначенное лечение действительно помогает! После курса терапии исчезли боли в сердце, нормализовался сон. Доктор не только лечит, но и учит правильно заботиться о своем здоровье. Рекомендую всем!',
    date: '2024-01-22',
    status: 'published',
    visitType: 'online',
    appointmentId: 'app-006',
    helpful: 15,
    replies: [
      {
        id: 'reply-4',
        author: 'Петрова М.И.',
        role: 'doctor',
        message: 'Анна, благодарю за теплые слова! Здоровье пациентов - моя главная цель. Продолжайте следовать рекомендациям и будьте здоровы!',
        date: '2024-01-23'
      }
    ],
    tags: ['профессионализм', 'внимательность', 'эффективное лечение', 'рекомендации']
  }
];

export const pendingReviews: Review[] = [
  {
    id: 'rev-7',
    patientId: 'pat-007',
    patientName: 'Волков Андрей',
    patientAge: 45,
    doctorId: 'doc-3',
    doctorName: 'Сидоров Владимир Петрович',
    specialization: 'Невролог',
    rating: 4,
    title: 'Хороший специалист, помог с болями в спине',
    comment: 'Доктор провел тщательный осмотр, назначил лечение которое действительно помогло. Немного смутила стоимость некоторых процедур, но результат того стоит.',
    date: '2024-01-24',
    status: 'pending',
    visitType: 'in-person',
    appointmentId: 'app-007',
    helpful: 0,
    replies: [],
    tags: ['квалификация', 'эффективное лечение', 'стоимость']
  }
];