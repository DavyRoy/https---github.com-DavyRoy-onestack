// /src/app/demo/medicine/owner/modules/staff/demo-data.ts

export interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'doctor' | 'nurse' | 'administrator' | 'technician' | 'manager' | 'receptionist';
  specialization?: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'vacation' | 'sick' | 'training';
  schedule: WorkSchedule;
  salary: number;
  permissions: string[];
  performance: PerformanceMetrics;
  avatar?: string;
  qualifications: Qualification[];
  emergencyContact?: EmergencyContact;
  notes?: string;
  lastEvaluation?: string;
  nextEvaluation?: string;
}

export interface WorkSchedule {
  monday: Shift[];
  tuesday: Shift[];
  wednesday: Shift[];
  thursday: Shift[];
  friday: Shift[];
  saturday: Shift[];
  sunday: Shift[];
  timeZone: string;
  workHoursPerWeek: number;
}

export interface Shift {
  start: string;
  end: string;
  type: 'work' | 'break' | 'on-call' | 'overtime' | 'emergency';
  location?: string;
  notes?: string;
}

export interface PerformanceMetrics {
  appointments: number;
  satisfaction: number;
  revenue: number;
  efficiency: number;
  attendance: number;
  productivity: number;
  quality: number;
  patientOutcomes: number;
  compliance: number;
  growth: number;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  budget: number;
  location: string;
  contact: string;
  specialties: string[];
  equipment: string[];
  performance: DepartmentPerformance;
}

export interface DepartmentPerformance {
  occupancy: number;
  efficiency: number;
  satisfaction: number;
  revenue: number;
  growth: number;
}

export interface Qualification {
  type: string;
  name: string;
  institution: string;
  year: number;
  expiration?: string;
  verified: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface StaffStats {
  total: number;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
  byDepartment: Record<string, number>;
  averageSalary: number;
  turnoverRate: number;
  vacancyCount: number;
}

// Вспомогательные функции
export const getRoleIcon = (role: string): string => {
  const icons: Record<string, string> = {
    doctor: '👨‍⚕️',
    nurse: '👩‍⚕️',
    administrator: '💼',
    technician: '🔧',
    manager: '👔',
    receptionist: '📞'
  };
  return icons[role] || '👤';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
    vacation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    sick: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    training: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };
  return colors[status] || 'bg-white/5 text-white/60 border-white/10';
};

export const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    active: 'Активен',
    inactive: 'Неактивен',
    vacation: 'Отпуск',
    sick: 'Больничный',
    training: 'Обучение'
  };
  return texts[status] || status;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('₽', '₽');
};

export const calculateStaffStats = (staff: StaffMember[]): StaffStats => {
  const byRole: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byDepartment: Record<string, number> = {};
  
  let totalSalary = 0;
  let inactiveCount = 0;

  staff.forEach(member => {
    byRole[member.role] = (byRole[member.role] || 0) + 1;
    byStatus[member.status] = (byStatus[member.status] || 0) + 1;
    byDepartment[member.department] = (byDepartment[member.department] || 0) + 1;
    
    totalSalary += member.salary;
    if (member.status === 'inactive') inactiveCount++;
  });

  return {
    total: staff.length,
    byRole,
    byStatus,
    byDepartment,
    averageSalary: Math.round(totalSalary / staff.length),
    turnoverRate: (inactiveCount / staff.length) * 100,
    vacancyCount: Math.max(0, 25 - staff.length) // Assuming optimal staff count is 25
  };
};

export const getUpcomingEvaluations = (staff: StaffMember[]): StaffMember[] => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return staff.filter(member => {
    if (!member.nextEvaluation) return false;
    const evalDate = new Date(member.nextEvaluation);
    return evalDate <= nextWeek && evalDate >= new Date();
  });
};

export const getStaffOnLeave = (staff: StaffMember[]): StaffMember[] => {
  return staff.filter(member => 
    member.status === 'vacation' || member.status === 'sick'
  );
};

export const getTopPerformers = (staff: StaffMember[], count: number = 3): StaffMember[] => {
  return staff
    .filter(member => member.status === 'active')
    .sort((a, b) => b.performance.efficiency - a.performance.efficiency)
    .slice(0, count);
};

// Основные данные
export const departments: Department[] = [
  {
    id: 'dept-1',
    name: 'Терапия',
    head: 'Иванов А.С.',
    staffCount: 8,
    budget: 2500000,
    location: 'Этаж 2, Северное крыло',
    contact: '+7 (495) 123-45-67',
    specialties: ['Общая терапия', 'Семейная медицина', 'Профилактика'],
    equipment: ['ЭКГ аппараты', 'УЗИ', 'Лабораторное оборудование'],
    performance: {
      occupancy: 85,
      efficiency: 88,
      satisfaction: 4.7,
      revenue: 12500000,
      growth: 12.5
    }
  },
  {
    id: 'dept-2',
    name: 'Кардиология',
    head: 'Петрова М.И.',
    staffCount: 6,
    budget: 1800000,
    location: 'Этаж 3, Восточное крыло',
    contact: '+7 (495) 123-45-68',
    specialties: ['Кардиодиагностика', 'Реабилитация', 'Хирургия'],
    equipment: ['Эхокардиографы', 'Холтеры', 'Кардиомониторы'],
    performance: {
      occupancy: 92,
      efficiency: 85,
      satisfaction: 4.9,
      revenue: 9800000,
      growth: 15.7
    }
  },
  {
    id: 'dept-3',
    name: 'Неврология',
    head: 'Сидоров В.П.',
    staffCount: 5,
    budget: 1500000,
    location: 'Этаж 3, Западное крыло',
    contact: '+7 (495) 123-45-69',
    specialties: ['Неврология', 'Эпилептология', 'Реабилитация'],
    equipment: ['ЭЭГ', 'МРТ', 'ТМС аппараты'],
    performance: {
      occupancy: 78,
      efficiency: 82,
      satisfaction: 4.6,
      revenue: 7560000,
      growth: 8.9
    }
  },
  {
    id: 'dept-4',
    name: 'Диагностика',
    head: 'Козлова Е.В.',
    staffCount: 12,
    budget: 3200000,
    location: 'Этаж 1, Центральное крыло',
    contact: '+7 (495) 123-45-70',
    specialties: ['Лучевая диагностика', 'Лабораторная диагностика', 'Функциональная диагностика'],
    equipment: ['КТ', 'МРТ', 'Рентген', 'УЗИ', 'Лабораторные анализаторы'],
    performance: {
      occupancy: 95,
      efficiency: 90,
      satisfaction: 4.8,
      revenue: 18500000,
      growth: 18.3
    }
  },
  {
    id: 'dept-5',
    name: 'Хирургия',
    head: 'Николаев Д.В.',
    staffCount: 7,
    budget: 4200000,
    location: 'Этаж 4, Операционный блок',
    contact: '+7 (495) 123-45-71',
    specialties: ['Общая хирургия', 'Эндоскопия', 'Травматология'],
    equipment: ['Операционные столы', 'Эндоскопы', 'Анестезиологическое оборудование'],
    performance: {
      occupancy: 88,
      efficiency: 78,
      satisfaction: 4.7,
      revenue: 14200000,
      growth: 6.3
    }
  },
  {
    id: 'dept-6',
    name: 'Педиатрия',
    head: 'Орлова С.М.',
    staffCount: 4,
    budget: 1200000,
    location: 'Этаж 2, Детское отделение',
    contact: '+7 (495) 123-45-72',
    specialties: ['Педиатрия', 'Неонатология', 'Вакцинация'],
    equipment: ['Детское диагностическое оборудование', 'Инкубаторы'],
    performance: {
      occupancy: 82,
      efficiency: 85,
      satisfaction: 4.9,
      revenue: 6850000,
      growth: 11.2
    }
  }
];

export const staffMembers: StaffMember[] = [
  {
    id: 'emp-1',
    employeeId: 'DOC-001',
    firstName: 'Алексей',
    lastName: 'Иванов',
    email: 'a.ivanov@clinic.ru',
    phone: '+7 (999) 123-45-67',
    role: 'doctor',
    specialization: 'Терапевт',
    department: 'Терапия',
    hireDate: '2020-03-15',
    status: 'active',
    salary: 150000,
    permissions: ['appointments', 'prescriptions', 'medical_records', 'telemedicine'],
    schedule: {
      monday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Каб. 201' }],
      tuesday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Каб. 201' }],
      wednesday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Каб. 201' }],
      thursday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Каб. 201' }],
      friday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Каб. 201' }],
      saturday: [],
      sunday: [],
      timeZone: 'Europe/Moscow',
      workHoursPerWeek: 40
    },
    performance: {
      appointments: 156,
      satisfaction: 4.8,
      revenue: 4500000,
      efficiency: 92,
      attendance: 98,
      productivity: 94,
      quality: 4.7,
      patientOutcomes: 4.8,
      compliance: 96,
      growth: 12.5
    },
    qualifications: [
      {
        type: 'Диплом',
        name: 'Лечебное дело',
        institution: 'Первый МГМУ им. И.М. Сеченова',
        year: 2015,
        verified: true
      },
      {
        type: 'Сертификат',
        name: 'Терапия',
        institution: 'РМАНПО',
        year: 2020,
        expiration: '2025-12-31',
        verified: true
      }
    ],
    emergencyContact: {
      name: 'Иванова Мария',
      relationship: 'Жена',
      phone: '+7 (999) 765-43-21',
      email: 'm.ivanova@mail.ru'
    },
    lastEvaluation: '2024-01-15',
    nextEvaluation: '2024-07-15'
  },
  {
    id: 'emp-2',
    employeeId: 'DOC-002',
    firstName: 'Мария',
    lastName: 'Петрова',
    email: 'm.petrova@clinic.ru',
    phone: '+7 (999) 234-56-78',
    role: 'doctor',
    specialization: 'Кардиолог',
    department: 'Кардиология',
    hireDate: '2018-07-22',
    status: 'active',
    salary: 180000,
    permissions: ['appointments', 'prescriptions', 'medical_records', 'diagnostics', 'procedures'],
    schedule: {
      monday: [{ start: '08:00', end: '16:00', type: 'work', location: 'Каб. 301' }],
      tuesday: [{ start: '08:00', end: '16:00', type: 'work', location: 'Каб. 301' }],
      wednesday: [{ start: '08:00', end: '16:00', type: 'work', location: 'Каб. 301' }],
      thursday: [{ start: '08:00', end: '16:00', type: 'work', location: 'Каб. 301' }],
      friday: [{ start: '08:00', end: '16:00', type: 'work', location: 'Каб. 301' }],
      saturday: [],
      sunday: [],
      timeZone: 'Europe/Moscow',
      workHoursPerWeek: 40
    },
    performance: {
      appointments: 98,
      satisfaction: 4.9,
      revenue: 3200000,
      efficiency: 88,
      attendance: 95,
      productivity: 90,
      quality: 4.9,
      patientOutcomes: 4.8,
      compliance: 98,
      growth: 8.3
    },
    qualifications: [
      {
        type: 'Диплом',
        name: 'Лечебное дело',
        institution: 'РНИМУ им. Н.И. Пирогова',
        year: 2014,
        verified: true
      },
      {
        type: 'Сертификат',
        name: 'Кардиология',
        institution: 'МГМСУ',
        year: 2019,
        expiration: '2024-12-31',
        verified: true
      }
    ],
    lastEvaluation: '2024-01-20',
    nextEvaluation: '2024-07-20'
  },
  {
    id: 'emp-3',
    employeeId: 'NUR-001',
    firstName: 'Ольга',
    lastName: 'Смирнова',
    email: 'o.smirnova@clinic.ru',
    phone: '+7 (999) 345-67-89',
    role: 'nurse',
    department: 'Терапия',
    hireDate: '2021-11-10',
    status: 'active',
    salary: 75000,
    permissions: ['appointments', 'procedures', 'patient_care', 'vital_signs'],
    schedule: {
      monday: [{ start: '08:00', end: '20:00', type: 'work', location: 'Пост медсестры' }],
      tuesday: [],
      wednesday: [{ start: '08:00', end: '20:00', type: 'work', location: 'Пост медсестры' }],
      thursday: [],
      friday: [{ start: '08:00', end: '20:00', type: 'work', location: 'Пост медсестры' }],
      saturday: [{ start: '10:00', end: '18:00', type: 'work', location: 'Пост медсестры' }],
      sunday: [],
      timeZone: 'Europe/Moscow',
      workHoursPerWeek: 36
    },
    performance: {
      appointments: 245,
      satisfaction: 4.7,
      revenue: 450000,
      efficiency: 85,
      attendance: 100,
      productivity: 88,
      quality: 4.6,
      patientOutcomes: 4.7,
      compliance: 94,
      growth: 5.2
    },
    qualifications: [
      {
        type: 'Диплом',
        name: 'Сестринское дело',
        institution: 'Медицинский колледж №1',
        year: 2020,
        verified: true
      }
    ],
    lastEvaluation: '2024-02-01',
    nextEvaluation: '2024-08-01'
  },
  {
    id: 'emp-4',
    employeeId: 'ADM-001',
    firstName: 'Дмитрий',
    lastName: 'Козлов',
    email: 'd.kozlov@clinic.ru',
    phone: '+7 (999) 456-78-90',
    role: 'administrator',
    department: 'Администрация',
    hireDate: '2019-05-30',
    status: 'vacation',
    salary: 60000,
    permissions: ['scheduling', 'billing', 'patient_registration', 'reporting'],
    schedule: {
      monday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Регистратура' }],
      tuesday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Регистратура' }],
      wednesday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Регистратура' }],
      thursday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Регистратура' }],
      friday: [{ start: '09:00', end: '18:00', type: 'work', location: 'Регистратура' }],
      saturday: [],
      sunday: [],
      timeZone: 'Europe/Moscow',
      workHoursPerWeek: 40
    },
    performance: {
      appointments: 0,
      satisfaction: 4.5,
      revenue: 0,
      efficiency: 90,
      attendance: 92,
      productivity: 87,
      quality: 4.5,
      patientOutcomes: 0,
      compliance: 95,
      growth: 3.8
    },
    qualifications: [
      {
        type: 'Диплом',
        name: 'Менеджмент',
        institution: 'РЭУ им. Г.В. Плеханова',
        year: 2018,
        verified: true
      }
    ],
    lastEvaluation: '2024-01-10',
    nextEvaluation: '2024-07-10'
  },
  {
    id: 'emp-5',
    employeeId: 'TEC-001',
    firstName: 'Сергей',
    lastName: 'Федоров',
    email: 's.fedorov@clinic.ru',
    phone: '+7 (999) 567-89-01',
    role: 'technician',
    department: 'Диагностика',
    hireDate: '2022-02-14',
    status: 'active',
    salary: 85000,
    permissions: ['equipment_operation', 'maintenance', 'diagnostics', 'safety'],
    schedule: {
      monday: [{ start: '07:00', end: '15:00', type: 'work', location: 'Рентген кабинет' }],
      tuesday: [{ start: '07:00', end: '15:00', type: 'work', location: 'Рентген кабинет' }],
      wednesday: [{ start: '07:00', end: '15:00', type: 'work', location: 'Рентген кабинет' }],
      thursday: [{ start: '07:00', end: '15:00', type: 'work', location: 'Рентген кабинет' }],
      friday: [{ start: '07:00', end: '15:00', type: 'work', location: 'Рентген кабинет' }],
      saturday: [],
      sunday: [],
      timeZone: 'Europe/Moscow',
      workHoursPerWeek: 40
    },
    performance: {
      appointments: 0,
      satisfaction: 4.6,
      revenue: 1200000,
      efficiency: 88,
      attendance: 96,
      productivity: 85,
      quality: 4.7,
      patientOutcomes: 0,
      compliance: 97,
      growth: 7.1
    },
    qualifications: [
      {
        type: 'Диплом',
        name: 'Медицинская физика',
        institution: 'МФТИ',
        year: 2021,
        verified: true
      },
      {
        type: 'Сертификат',
        name: 'Эксплуатация МРТ оборудования',
        institution: 'Siemens Healthineers',
        year: 2022,
        expiration: '2025-06-30',
        verified: true
      }
    ],
    lastEvaluation: '2024-02-15',
    nextEvaluation: '2024-08-15'
  },
  {
    id: 'emp-6',
    employeeId: 'MGR-001',
    firstName: 'Анна',
    lastName: 'Волкова',
    email: 'a.volkova@clinic.ru',
    phone: '+7 (999) 678-90-12',
    role: 'manager',
    department: 'Администрация',
    hireDate: '2017-09-05',
    status: 'active',
    salary: 120000,
    permissions: ['staff_management', 'scheduling', 'reporting', 'budgeting', 'analytics'],
    schedule: {
      monday: [{ start: '10:00', end: '19:00', type: 'work', location: 'Каб. 101' }],
      tuesday: [{ start: '10:00', end: '19:00', type: 'work', location: 'Каб. 101' }],
      wednesday: [{ start: '10:00', end: '19:00', type: 'work', location: 'Каб. 101' }],
      thursday: [{ start: '10:00', end: '19:00', type: 'work', location: 'Каб. 101' }],
      friday: [{ start: '10:00', end: '19:00', type: 'work', location: 'Каб. 101' }],
      saturday: [],
      sunday: [],
      timeZone: 'Europe/Moscow',
      workHoursPerWeek: 40
    },
    performance: {
      appointments: 0,
      satisfaction: 4.8,
      revenue: 0,
      efficiency: 94,
      attendance: 98,
      productivity: 92,
      quality: 4.8,
      patientOutcomes: 0,
      compliance: 99,
      growth: 10.2
    },
    qualifications: [
      {
        type: 'Диплом',
        name: 'Менеджмент в здравоохранении',
        institution: 'ВШЭ',
        year: 2016,
        verified: true
      },
      {
        type: 'MBA',
        name: 'Управление здравоохранением',
        institution: 'Сколково',
        year: 2020,
        verified: true
      }
    ],
    lastEvaluation: '2024-01-25',
    nextEvaluation: '2024-07-25'
  },
  {
    id: 'emp-7',
    employeeId: 'REC-001',
    firstName: 'Екатерина',
    lastName: 'Новикова',
    email: 'e.novikova@clinic.ru',
    phone: '+7 (999) 789-01-23',
    role: 'receptionist',
    department: 'Администрация',
    hireDate: '2023-03-20',
    status: 'training',
    salary: 45000,
    permissions: ['patient_registration', 'scheduling', 'information'],
    schedule: {
      monday: [{ start: '08:00', end: '17:00', type: 'work', location: 'Ресепшен' }],
      tuesday: [{ start: '08:00', end: '17:00', type: 'work', location: 'Ресепшен' }],
      wednesday: [{ start: '08:00', end: '17:00', type: 'work', location: 'Ресепшен' }],
      thursday: [{ start: '08:00', end: '17:00', type: 'work', location: 'Ресепшен' }],
      friday: [{ start: '08:00', end: '17:00', type: 'work', location: 'Ресепшен' }],
      saturday: [],
      sunday: [],
      timeZone: 'Europe/Moscow',
      workHoursPerWeek: 40
    },
    performance: {
      appointments: 156,
      satisfaction: 4.4,
      revenue: 0,
      efficiency: 78,
      attendance: 100,
      productivity: 75,
      quality: 4.3,
      patientOutcomes: 0,
      compliance: 88,
      growth: 15.7
    },
    qualifications: [
      {
        type: 'Диплом',
        name: 'Гостиничный сервис',
        institution: 'Колледж сферы услуг',
        year: 2022,
        verified: true
      }
    ],
    lastEvaluation: '2024-03-01',
    nextEvaluation: '2024-09-01'
  }
];

export const rolePermissions = {
  doctor: ['appointments', 'prescriptions', 'medical_records', 'telemedicine', 'diagnostics', 'procedures'],
  nurse: ['appointments', 'procedures', 'patient_care', 'vital_signs', 'medication_administration'],
  administrator: ['scheduling', 'billing', 'patient_registration', 'reporting', 'inventory'],
  technician: ['equipment_operation', 'maintenance', 'diagnostics', 'safety', 'calibration'],
  manager: ['staff_management', 'scheduling', 'reporting', 'budgeting', 'analytics', 'strategic_planning'],
  receptionist: ['patient_registration', 'scheduling', 'information', 'cash_handling']
};

// Экспорт по умолчанию для удобства
export default {
  staffMembers,
  departments,
  rolePermissions,
  getRoleIcon,
  getStatusColor,
  getStatusText,
  formatCurrency,
  calculateStaffStats,
  getUpcomingEvaluations,
  getStaffOnLeave,
  getTopPerformers
};