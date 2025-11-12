// /src/app/demo/medicine/owner/modules/analytics/demo-data.ts

// Типы данных
export interface AnalyticsData {
  summary: SummaryMetrics;
  attendance: AttendanceData;
  revenue: RevenueData;
  doctorsPerformance: DoctorPerformance[];
  patientDemographics: DemographicData;
  trends: TrendData;
  predictions: PredictionData;
  alerts: Alert[];
  comparisons: ComparisonData;
}

export interface SummaryMetrics {
  totalPatients: number;
  totalAppointments: number;
  occupancyRate: number;
  averageWaitTime: number;
  noShowRate: number;
  patientSatisfaction: number;
  averageRevenuePerPatient: number;
  newPatientsThisMonth: number;
  returningPatientsRate: number;
  emergencyCases: number;
  plannedProcedures: number;
}

export interface AttendanceData {
  daily: DailyAttendance[];
  weekly: WeeklyAttendance[];
  monthly: MonthlyAttendance[];
  byTimeSlot: TimeSlotAttendance[];
  byDayOfWeek: DayOfWeekAttendance[];
}

export interface DailyAttendance {
  date: string;
  appointments: number;
  completed: number;
  noShows: number;
  cancellations: number;
  occupancyRate: number;
  emergencyCases: number;
  averageSessionTime: number;
}

export interface WeeklyAttendance {
  week: string;
  appointments: number;
  completed: number;
  occupancy: number;
  revenue: number;
  growth: number;
  efficiency: number;
  peakDay: string;
}

export interface MonthlyAttendance {
  month: string;
  appointments: number;
  completed: number;
  revenue: number;
  newPatients: number;
  satisfaction: number;
  profitMargin: number;
  operationalCosts: number;
}

export interface TimeSlotAttendance {
  timeSlot: string;
  appointments: number;
  occupancy: number;
  peak: boolean;
  revenuePerSlot: number;
  efficiency: number;
}

export interface DayOfWeekAttendance {
  day: string;
  appointments: number;
  occupancy: number;
  revenue: number;
  noShowRate: number;
  satisfaction: number;
}

export interface RevenueData {
  daily: RevenuePoint[];
  weekly: RevenuePoint[];
  monthly: RevenuePoint[];
  bySpecialization: SpecializationRevenue[];
  byPaymentMethod: PaymentMethodRevenue[];
  byServiceType: ServiceTypeRevenue[];
  recurringRevenue: RecurringRevenue;
}

export interface RevenuePoint {
  date: string;
  amount: number;
  services: number;
  growth?: number;
  profit: number;
  operationalCosts: number;
}

export interface SpecializationRevenue {
  specialization: string;
  revenue: number;
  growth: number;
  appointments: number;
  averageTicket: number;
  color: string;
  profitMargin: number;
  patientSatisfaction: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PaymentMethodRevenue {
  method: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  fee: number;
  processingTime: number;
}

export interface ServiceTypeRevenue {
  type: string;
  amount: number;
  percentage: number;
  appointments: number;
  averagePrice: number;
  category: 'consultation' | 'procedure' | 'diagnostic' | 'surgery';
}

export interface RecurringRevenue {
  monthly: number;
  quarterly: number;
  annual: number;
  growth: number;
  percentageOfTotal: number;
}

export interface DoctorPerformance {
  doctorId: string;
  doctorName: string;
  specialization: string;
  appointments: number;
  occupancy: number;
  revenue: number;
  satisfaction: number;
  noShowRate: number;
  efficiency: number;
  avatar: string;
  trend: 'up' | 'down' | 'stable';
  experience: number;
  patientRetention: number;
  emergencyCases: number;
  averageSessionTime: number;
  ratings: {
    professionalism: number;
    communication: number;
    punctuality: number;
    expertise: number;
  };
}

export interface DemographicData {
  byAge: AgeGroup[];
  byGender: GenderGroup[];
  byLocation: LocationGroup[];
  bySource: SourceGroup[];
  byInsurance: InsuranceGroup[];
  byOccupation: OccupationGroup[];
}

export interface AgeGroup {
  group: string;
  count: number;
  percentage: number;
  averageVisits: number;
  averageSpend: number;
  commonConditions: string[];
}

export interface GenderGroup {
  gender: string;
  count: number;
  percentage: number;
  averageSpend: number;
  averageAge: number;
  preference: string[];
}

export interface LocationGroup {
  location: string;
  count: number;
  percentage: number;
  distance: number;
  averageRevenue: number;
  growth: number;
}

export interface SourceGroup {
  source: string;
  count: number;
  percentage: number;
  conversion: number;
  costPerAcquisition: number;
  lifetimeValue: number;
}

export interface InsuranceGroup {
  type: string;
  count: number;
  percentage: number;
  coverage: number;
  satisfaction: number;
}

export interface OccupationGroup {
  occupation: string;
  count: number;
  percentage: number;
  averageSpend: number;
  visitFrequency: number;
}

export interface TrendData {
  patientGrowth: TrendPoint[];
  revenueGrowth: TrendPoint[];
  satisfactionTrend: TrendPoint[];
  efficiencyTrend: TrendPoint[];
  costTrend: TrendPoint[];
  marketShare: TrendPoint[];
}

export interface TrendPoint {
  period: string;
  value: number;
  change: number;
  target: number;
  status: 'exceeded' | 'met' | 'below';
}

export interface PredictionData {
  nextWeek: WeekPrediction;
  nextMonth: MonthPrediction;
  nextQuarter: QuarterPrediction;
  riskFactors: RiskFactor[];
  opportunities: Opportunity[];
}

export interface WeekPrediction {
  appointments: number;
  revenue: number;
  occupancy: number;
  confidence: number;
  peakDays: string[];
  resourceNeeds: string[];
}

export interface MonthPrediction {
  appointments: number;
  revenue: number;
  newPatients: number;
  growth: number;
  seasonalFactors: string[];
  marketingImpact: number;
}

export interface QuarterPrediction {
  revenue: number;
  patientGrowth: number;
  marketShare: number;
  operationalEfficiency: number;
  strategicInitiatives: string[];
}

export interface RiskFactor {
  factor: string;
  level: 'low' | 'medium' | 'high';
  impact: string;
  trend: 'improving' | 'worsening' | 'stable';
  probability: number;
  mitigation: string;
}

export interface Opportunity {
  area: string;
  potential: 'low' | 'medium' | 'high';
  impact: string;
  timeline: 'short' | 'medium' | 'long';
  requirements: string[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  relatedTo: string;
}

export interface ComparisonData {
  industryAverages: IndustryAverages;
  competitors: Competitor[];
  previousYear: PreviousYearComparison;
}

export interface IndustryAverages {
  occupancyRate: number;
  patientSatisfaction: number;
  noShowRate: number;
  revenuePerPatient: number;
  growthRate: number;
}

export interface Competitor {
  name: string;
  occupancy: number;
  satisfaction: number;
  pricing: number;
  services: string[];
  advantage: string;
}

export interface PreviousYearComparison {
  revenueGrowth: number;
  patientGrowth: number;
  efficiencyImprovement: number;
  costReduction: number;
}

// Вспомогательные функции
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up': return '↗️';
    case 'down': return '↘️';
    case 'stable': return '→';
  }
};

export const getRiskColor = (level: 'low' | 'medium' | 'high'): string => {
  switch (level) {
    case 'low': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-red-400';
  }
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'low': return 'bg-blue-500/20 text-blue-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'high': return 'bg-red-500/20 text-red-400';
  }
};

// Основные данные
export const analyticsData: AnalyticsData = {
  summary: {
    totalPatients: 2847,
    totalAppointments: 1242,
    occupancyRate: 78,
    averageWaitTime: 12,
    noShowRate: 8.3,
    patientSatisfaction: 4.7,
    averageRevenuePerPatient: 3560,
    newPatientsThisMonth: 156,
    returningPatientsRate: 68,
    emergencyCases: 42,
    plannedProcedures: 298
  },
  attendance: {
    daily: [
      { 
        date: '2024-01-24', 
        appointments: 56, 
        completed: 52, 
        noShows: 3, 
        cancellations: 1, 
        occupancyRate: 92,
        emergencyCases: 4,
        averageSessionTime: 28
      },
      { 
        date: '2024-01-23', 
        appointments: 48, 
        completed: 44, 
        noShows: 3, 
        cancellations: 1, 
        occupancyRate: 88,
        emergencyCases: 3,
        averageSessionTime: 25
      },
      { 
        date: '2024-01-22', 
        appointments: 52, 
        completed: 48, 
        noShows: 3, 
        cancellations: 1, 
        occupancyRate: 90,
        emergencyCases: 5,
        averageSessionTime: 26
      },
      { 
        date: '2024-01-21', 
        appointments: 38, 
        completed: 35, 
        noShows: 2, 
        cancellations: 1, 
        occupancyRate: 85,
        emergencyCases: 2,
        averageSessionTime: 24
      },
      { 
        date: '2024-01-20', 
        appointments: 42, 
        completed: 39, 
        noShows: 2, 
        cancellations: 1, 
        occupancyRate: 87,
        emergencyCases: 3,
        averageSessionTime: 27
      },
      { 
        date: '2024-01-19', 
        appointments: 54, 
        completed: 50, 
        noShows: 3, 
        cancellations: 1, 
        occupancyRate: 91,
        emergencyCases: 4,
        averageSessionTime: 29
      },
      { 
        date: '2024-01-18', 
        appointments: 50, 
        completed: 46, 
        noShows: 3, 
        cancellations: 1, 
        occupancyRate: 89,
        emergencyCases: 3,
        averageSessionTime: 26
      }
    ],
    weekly: [
      { 
        week: '18-24 Янв', 
        appointments: 342, 
        completed: 316, 
        occupancy: 88, 
        revenue: 1245800, 
        growth: 12.5,
        efficiency: 92,
        peakDay: 'Среда'
      },
      { 
        week: '11-17 Янв', 
        appointments: 298, 
        completed: 275, 
        occupancy: 85, 
        revenue: 1084200, 
        growth: 8.3,
        efficiency: 89,
        peakDay: 'Понедельник'
      },
      { 
        week: '4-10 Янв', 
        appointments: 275, 
        completed: 252, 
        occupancy: 82, 
        revenue: 956800, 
        growth: 5.7,
        efficiency: 87,
        peakDay: 'Вторник'
      },
      { 
        week: '28 Дек-3 Янв', 
        appointments: 248, 
        completed: 225, 
        occupancy: 78, 
        revenue: 842300, 
        growth: 3.2,
        efficiency: 85,
        peakDay: 'Четверг'
      }
    ],
    monthly: [
      { 
        month: 'Январь 2024', 
        appointments: 1242, 
        completed: 1148, 
        revenue: 4256800, 
        newPatients: 156, 
        satisfaction: 4.7,
        profitMargin: 28,
        operationalCosts: 1250000
      },
      { 
        month: 'Декабрь 2023', 
        appointments: 1156, 
        completed: 1068, 
        revenue: 3854200, 
        newPatients: 142, 
        satisfaction: 4.6,
        profitMargin: 26,
        operationalCosts: 1180000
      },
      { 
        month: 'Ноябрь 2023', 
        appointments: 1084, 
        completed: 998, 
        revenue: 3568200, 
        newPatients: 128, 
        satisfaction: 4.5,
        profitMargin: 25,
        operationalCosts: 1120000
      },
      { 
        month: 'Октябрь 2023', 
        appointments: 1248, 
        completed: 1156, 
        revenue: 4125600, 
        newPatients: 165, 
        satisfaction: 4.7,
        profitMargin: 29,
        operationalCosts: 1220000
      }
    ],
    byTimeSlot: [
      { 
        timeSlot: '08:00-10:00', 
        appointments: 186, 
        occupancy: 65, 
        peak: false,
        revenuePerSlot: 456200,
        efficiency: 78
      },
      { 
        timeSlot: '10:00-12:00', 
        appointments: 342, 
        occupancy: 92, 
        peak: true,
        revenuePerSlot: 985400,
        efficiency: 94
      },
      { 
        timeSlot: '12:00-14:00', 
        appointments: 298, 
        occupancy: 85, 
        peak: true,
        revenuePerSlot: 856300,
        efficiency: 89
      },
      { 
        timeSlot: '14:00-16:00', 
        appointments: 256, 
        occupancy: 78, 
        peak: false,
        revenuePerSlot: 642100,
        efficiency: 82
      },
      { 
        timeSlot: '16:00-18:00', 
        appointments: 184, 
        occupancy: 62, 
        peak: false,
        revenuePerSlot: 418900,
        efficiency: 75
      }
    ],
    byDayOfWeek: [
      { day: 'Понедельник', appointments: 198, occupancy: 85, revenue: 685200, noShowRate: 7.2, satisfaction: 4.6 },
      { day: 'Вторник', appointments: 215, occupancy: 88, revenue: 742100, noShowRate: 6.8, satisfaction: 4.7 },
      { day: 'Среда', appointments: 228, occupancy: 92, revenue: 798400, noShowRate: 5.9, satisfaction: 4.8 },
      { day: 'Четверг', appointments: 204, occupancy: 86, revenue: 712300, noShowRate: 7.1, satisfaction: 4.7 },
      { day: 'Пятница', appointments: 192, occupancy: 82, revenue: 652800, noShowRate: 8.5, satisfaction: 4.5 },
      { day: 'Суббота', appointments: 156, occupancy: 68, revenue: 512400, noShowRate: 9.2, satisfaction: 4.6 },
      { day: 'Воскресенье', appointments: 49, occupancy: 45, revenue: 154200, noShowRate: 12.4, satisfaction: 4.4 }
    ]
  },
  revenue: {
    daily: [
      { date: '2024-01-24', amount: 215600, services: 56, growth: 15.2, profit: 64500, operationalCosts: 38500 },
      { date: '2024-01-23', amount: 184200, services: 48, growth: 12.8, profit: 52500, operationalCosts: 36500 },
      { date: '2024-01-22', amount: 198400, services: 52, growth: 14.1, profit: 59500, operationalCosts: 39500 },
      { date: '2024-01-21', amount: 142300, services: 38, growth: 8.5, profit: 38500, operationalCosts: 28500 },
      { date: '2024-01-20', amount: 156800, services: 42, growth: 10.3, profit: 42500, operationalCosts: 30500 },
      { date: '2024-01-19', amount: 208900, services: 54, growth: 16.7, profit: 68500, operationalCosts: 41500 },
      { date: '2024-01-18', amount: 192500, services: 50, growth: 13.9, profit: 55500, operationalCosts: 38500 }
    ],
    weekly: [
      { date: '18-24 Янв', amount: 1245800, services: 342, growth: 12.5, profit: 385000, operationalCosts: 245000 },
      { date: '11-17 Янв', amount: 1084200, services: 298, growth: 8.3, profit: 325000, operationalCosts: 228000 },
      { date: '4-10 Янв', amount: 956800, services: 275, growth: 5.7, profit: 285000, operationalCosts: 215000 },
      { date: '28 Дек-3 Янв', amount: 842300, services: 248, growth: 3.2, profit: 245000, operationalCosts: 198000 }
    ],
    monthly: [
      { date: 'Январь 2024', amount: 4256800, services: 1242, growth: 10.4, profit: 1250000, operationalCosts: 985000 },
      { date: 'Декабрь 2023', amount: 3854200, services: 1156, growth: 8.1, profit: 1120000, operationalCosts: 895000 },
      { date: 'Ноябрь 2023', amount: 3568200, services: 1084, growth: 5.9, profit: 985000, operationalCosts: 845000 },
      { date: 'Октябрь 2023', amount: 4125600, services: 1248, growth: 12.3, profit: 1220000, operationalCosts: 925000 }
    ],
    bySpecialization: [
      { 
        specialization: 'Терапия', 
        revenue: 1256800, 
        growth: 12.5, 
        appointments: 456, 
        averageTicket: 2756,
        color: '#3B82F6',
        profitMargin: 30,
        patientSatisfaction: 4.6,
        trend: 'up'
      },
      { 
        specialization: 'Кардиология', 
        revenue: 985400, 
        growth: 15.7, 
        appointments: 298, 
        averageTicket: 3306,
        color: '#EF4444',
        profitMargin: 35,
        patientSatisfaction: 4.8,
        trend: 'up'
      },
      { 
        specialization: 'Неврология', 
        revenue: 856200, 
        growth: 8.9, 
        appointments: 264, 
        averageTicket: 3243,
        color: '#8B5CF6',
        profitMargin: 32,
        patientSatisfaction: 4.7,
        trend: 'stable'
      },
      { 
        specialization: 'Хирургия', 
        revenue: 542300, 
        growth: 6.3, 
        appointments: 156, 
        averageTicket: 3476,
        color: '#10B981',
        profitMargin: 40,
        patientSatisfaction: 4.5,
        trend: 'down'
      },
      { 
        specialization: 'Офтальмология', 
        revenue: 418900, 
        growth: 11.2, 
        appointments: 142, 
        averageTicket: 2950,
        color: '#F59E0B',
        profitMargin: 28,
        patientSatisfaction: 4.8,
        trend: 'up'
      },
      { 
        specialization: 'Стоматология', 
        revenue: 198200, 
        growth: 18.4, 
        appointments: 86, 
        averageTicket: 2305,
        color: '#EC4899',
        profitMargin: 25,
        patientSatisfaction: 4.9,
        trend: 'up'
      }
    ],
    byPaymentMethod: [
      { 
        method: 'Банковская карта', 
        amount: 2568400, 
        percentage: 52, 
        trend: 'up',
        fee: 1.8,
        processingTime: 1
      },
      { 
        method: 'Наличные', 
        amount: 1256800, 
        percentage: 25, 
        trend: 'down',
        fee: 0,
        processingTime: 5
      },
      { 
        method: 'Страхование', 
        amount: 892500, 
        percentage: 18, 
        trend: 'up',
        fee: 2.5,
        processingTime: 14
      },
      { 
        method: 'Онлайн-оплата', 
        amount: 298100, 
        percentage: 5, 
        trend: 'up',
        fee: 1.5,
        processingTime: 0
      }
    ],
    byServiceType: [
      { 
        type: 'Консультации', 
        amount: 1856200, 
        percentage: 37, 
        appointments: 842, 
        averagePrice: 2200,
        category: 'consultation'
      },
      { 
        type: 'Диагностика', 
        amount: 1568400, 
        percentage: 31, 
        appointments: 298, 
        averagePrice: 5260,
        category: 'diagnostic'
      },
      { 
        type: 'Процедуры', 
        amount: 985200, 
        percentage: 20, 
        appointments: 156, 
        averagePrice: 6315,
        category: 'procedure'
      },
      { 
        type: 'Хирургия', 
        amount: 542300, 
        percentage: 11, 
        appointments: 86, 
        averagePrice: 6305,
        category: 'surgery'
      }
    ],
    recurringRevenue: {
      monthly: 856200,
      quarterly: 2568400,
      annual: 10273600,
      growth: 12.5,
      percentageOfTotal: 32
    }
  },
  doctorsPerformance: [
    {
      doctorId: 'doc-1',
      doctorName: 'Петров А.В.',
      specialization: 'Терапевт',
      appointments: 186,
      occupancy: 92,
      revenue: 856200,
      satisfaction: 4.8,
      noShowRate: 4.2,
      efficiency: 94,
      avatar: '👨‍⚕️',
      trend: 'up',
      experience: 12,
      patientRetention: 88,
      emergencyCases: 24,
      averageSessionTime: 25,
      ratings: {
        professionalism: 4.9,
        communication: 4.7,
        punctuality: 4.8,
        expertise: 4.9
      }
    },
    {
      doctorId: 'doc-2',
      doctorName: 'Сидорова М.И.',
      specialization: 'Кардиолог',
      appointments: 124,
      occupancy: 88,
      revenue: 985400,
      satisfaction: 4.9,
      noShowRate: 3.8,
      efficiency: 96,
      avatar: '👩‍⚕️',
      trend: 'up',
      experience: 15,
      patientRetention: 92,
      emergencyCases: 18,
      averageSessionTime: 35,
      ratings: {
        professionalism: 4.9,
        communication: 4.8,
        punctuality: 4.9,
        expertise: 5.0
      }
    },
    {
      doctorId: 'doc-3',
      doctorName: 'Иванова Е.С.',
      specialization: 'Невролог',
      appointments: 98,
      occupancy: 85,
      revenue: 756300,
      satisfaction: 4.7,
      noShowRate: 6.1,
      efficiency: 88,
      avatar: '👩‍⚕️',
      trend: 'stable',
      experience: 8,
      patientRetention: 85,
      emergencyCases: 12,
      averageSessionTime: 40,
      ratings: {
        professionalism: 4.8,
        communication: 4.6,
        punctuality: 4.7,
        expertise: 4.8
      }
    },
    {
      doctorId: 'doc-4',
      doctorName: 'Козлов Д.Н.',
      specialization: 'Хирург',
      appointments: 56,
      occupancy: 78,
      revenue: 542300,
      satisfaction: 4.6,
      noShowRate: 8.4,
      efficiency: 82,
      avatar: '👨‍⚕️',
      trend: 'down',
      experience: 20,
      patientRetention: 78,
      emergencyCases: 28,
      averageSessionTime: 85,
      ratings: {
        professionalism: 4.7,
        communication: 4.4,
        punctuality: 4.5,
        expertise: 4.8
      }
    },
    {
      doctorId: 'doc-5',
      doctorName: 'Николаев С.П.',
      specialization: 'Офтальмолог',
      appointments: 64,
      occupancy: 82,
      revenue: 418900,
      satisfaction: 4.8,
      noShowRate: 5.7,
      efficiency: 89,
      avatar: '👨‍⚕️',
      trend: 'up',
      experience: 10,
      patientRetention: 86,
      emergencyCases: 8,
      averageSessionTime: 30,
      ratings: {
        professionalism: 4.8,
        communication: 4.7,
        punctuality: 4.8,
        expertise: 4.8
      }
    },
    {
      doctorId: 'doc-6',
      doctorName: 'Орлова А.В.',
      specialization: 'Стоматолог',
      appointments: 42,
      occupancy: 75,
      revenue: 198200,
      satisfaction: 4.9,
      noShowRate: 4.8,
      efficiency: 91,
      avatar: '👩‍⚕️',
      trend: 'up',
      experience: 6,
      patientRetention: 90,
      emergencyCases: 5,
      averageSessionTime: 45,
      ratings: {
        professionalism: 4.9,
        communication: 4.8,
        punctuality: 4.9,
        expertise: 4.8
      }
    }
  ],
  patientDemographics: {
    byAge: [
      { 
        group: '18-25', 
        count: 342, 
        percentage: 12, 
        averageVisits: 1.8, 
        averageSpend: 2850,
        commonConditions: ['ОРВИ', 'Аллергии', 'Спортивные травмы']
      },
      { 
        group: '26-35', 
        count: 854, 
        percentage: 30, 
        averageVisits: 2.3, 
        averageSpend: 3250,
        commonConditions: ['Хронические заболевания', 'Профосмотры', 'ЖКТ']
      },
      { 
        group: '36-45', 
        count: 1139, 
        percentage: 40, 
        averageVisits: 2.8, 
        averageSpend: 3850,
        commonConditions: ['Кардиология', 'Неврология', 'Эндокринология']
      },
      { 
        group: '46-55', 
        count: 427, 
        percentage: 15, 
        averageVisits: 3.2, 
        averageSpend: 4250,
        commonConditions: ['Артериальная гипертензия', 'Сахарный диабет', 'Ортопедия']
      },
      { 
        group: '56+', 
        count: 85, 
        percentage: 3, 
        averageVisits: 4.1, 
        averageSpend: 4850,
        commonConditions: ['Хронические заболевания', 'Реабилитация', 'Кардиология']
      }
    ],
    byGender: [
      { 
        gender: 'Мужской', 
        count: 1256, 
        percentage: 44, 
        averageSpend: 3420, 
        averageAge: 42,
        preference: ['Кардиология', 'Хирургия', 'Урология']
      },
      { 
        gender: 'Женский', 
        count: 1591, 
        percentage: 56, 
        averageSpend: 3680, 
        averageAge: 38,
        preference: ['Гинекология', 'Эндокринология', 'Дерматология']
      }
    ],
    byLocation: [
      { 
        location: 'Центральный район', 
        count: 1139, 
        percentage: 40, 
        distance: 2.1, 
        averageRevenue: 3850,
        growth: 12.5
      },
      { 
        location: 'Северный район', 
        count: 854, 
        percentage: 30, 
        distance: 5.8, 
        averageRevenue: 3420,
        growth: 8.3
      },
      { 
        location: 'Южный район', 
        count: 569, 
        percentage: 20, 
        distance: 4.3, 
        averageRevenue: 2980,
        growth: 15.7
      },
      { 
        location: 'Западный район', 
        count: 285, 
        percentage: 10, 
        distance: 7.2, 
        averageRevenue: 2650,
        growth: 5.9
      }
    ],
    bySource: [
      { 
        source: 'Рекомендации', 
        count: 854, 
        percentage: 30, 
        conversion: 85, 
        costPerAcquisition: 0,
        lifetimeValue: 12500
      },
      { 
        source: 'Поиск в интернете', 
        count: 683, 
        percentage: 24, 
        conversion: 72, 
        costPerAcquisition: 450,
        lifetimeValue: 9800
      },
      { 
        source: 'Социальные сети', 
        count: 569, 
        percentage: 20, 
        conversion: 68, 
        costPerAcquisition: 320,
        lifetimeValue: 8600
      },
      { 
        source: 'Наружная реклама', 
        count: 427, 
        percentage: 15, 
        conversion: 55, 
        costPerAcquisition: 680,
        lifetimeValue: 7200
      },
      { 
        source: 'Другие источники', 
        count: 314, 
        percentage: 11, 
        conversion: 48, 
        costPerAcquisition: 520,
        lifetimeValue: 6500
      }
    ],
    byInsurance: [
      { type: 'ОМС', count: 1568, percentage: 55, coverage: 85, satisfaction: 4.5 },
      { type: 'ДМС', count: 854, percentage: 30, coverage: 95, satisfaction: 4.8 },
      { type: 'Платные услуги', count: 425, percentage: 15, coverage: 100, satisfaction: 4.9 }
    ],
    byOccupation: [
      { occupation: 'Офисные работники', count: 1139, percentage: 40, averageSpend: 3650, visitFrequency: 2.1 },
      { occupation: 'Производство', count: 854, percentage: 30, averageSpend: 3120, visitFrequency: 2.8 },
      { occupation: 'Предприниматели', count: 569, percentage: 20, averageSpend: 4250, visitFrequency: 1.8 },
      { occupation: 'Студенты', count: 285, percentage: 10, averageSpend: 2450, visitFrequency: 1.5 }
    ]
  },
  trends: {
    patientGrowth: [
      { period: 'Янв 24', value: 156, change: 12.5, target: 140, status: 'exceeded' },
      { period: 'Дек 23', value: 142, change: 8.3, target: 135, status: 'exceeded' },
      { period: 'Ноя 23', value: 128, change: 5.7, target: 130, status: 'below' },
      { period: 'Окт 23', value: 165, change: 15.2, target: 145, status: 'exceeded' },
      { period: 'Сен 23', value: 148, change: 10.8, target: 140, status: 'exceeded' }
    ],
    revenueGrowth: [
      { period: 'Янв 24', value: 4256800, change: 10.4, target: 4100000, status: 'exceeded' },
      { period: 'Дек 23', value: 3854200, change: 8.1, target: 3800000, status: 'exceeded' },
      { period: 'Ноя 23', value: 3568200, change: 5.9, target: 3600000, status: 'below' },
      { period: 'Окт 23', value: 4125600, change: 12.3, target: 4000000, status: 'exceeded' },
      { period: 'Сен 23', value: 3689400, change: 9.7, target: 3600000, status: 'exceeded' }
    ],
    satisfactionTrend: [
      { period: 'Янв 24', value: 4.7, change: 2.1, target: 4.6, status: 'exceeded' },
      { period: 'Дек 23', value: 4.6, change: 1.8, target: 4.6, status: 'met' },
      { period: 'Ноя 23', value: 4.5, change: 1.2, target: 4.6, status: 'below' },
      { period: 'Окт 23', value: 4.7, change: 2.3, target: 4.6, status: 'exceeded' },
      { period: 'Сен 23', value: 4.6, change: 1.9, target: 4.6, status: 'met' }
    ],
    efficiencyTrend: [
      { period: 'Янв 24', value: 89, change: 3.2, target: 87, status: 'exceeded' },
      { period: 'Дек 23', value: 87, change: 2.8, target: 86, status: 'exceeded' },
      { period: 'Ноя 23', value: 85, change: 1.5, target: 86, status: 'below' },
      { period: 'Окт 23', value: 88, change: 3.5, target: 86, status: 'exceeded' },
      { period: 'Сен 23', value: 86, change: 2.1, target: 85, status: 'exceeded' }
    ],
    costTrend: [
      { period: 'Янв 24', value: 985000, change: -2.1, target: 1000000, status: 'exceeded' },
      { period: 'Дек 23', value: 895000, change: -1.8, target: 900000, status: 'exceeded' },
      { period: 'Ноя 23', value: 845000, change: 1.2, target: 850000, status: 'below' },
      { period: 'Окт 23', value: 925000, change: -0.5, target: 950000, status: 'exceeded' },
      { period: 'Сен 23', value: 865000, change: -1.2, target: 880000, status: 'exceeded' }
    ],
    marketShare: [
      { period: 'Янв 24', value: 18.5, change: 1.2, target: 18.0, status: 'exceeded' },
      { period: 'Дек 23', value: 17.8, change: 0.8, target: 17.5, status: 'exceeded' },
      { period: 'Ноя 23', value: 16.9, change: 0.3, target: 17.0, status: 'below' },
      { period: 'Окт 23', value: 18.2, change: 1.5, target: 17.8, status: 'exceeded' },
      { period: 'Сен 23', value: 17.5, change: 0.9, target: 17.2, status: 'exceeded' }
    ]
  },
  predictions: {
    nextWeek: {
      appointments: 358,
      revenue: 1320000,
      occupancy: 86,
      confidence: 88,
      peakDays: ['Среда', 'Четверг'],
      resourceNeeds: ['Увеличение персонала на 2 человека', 'Дополнительные диагностические аппараты']
    },
    nextMonth: {
      appointments: 1425,
      revenue: 4850000,
      newPatients: 168,
      growth: 12.8,
      seasonalFactors: ['Сезон гриппа', 'Новый филиал'],
      marketingImpact: 15
    },
    nextQuarter: {
      revenue: 14800000,
      patientGrowth: 18.5,
      marketShare: 19.2,
      operationalEfficiency: 91,
      strategicInitiatives: ['Цифровизация процессов', 'Расширение спектра услуг', 'Партнерства со страховыми компаниями']
    },
    riskFactors: [
      {
        factor: 'Сезонность заболеваний',
        level: 'medium',
        impact: 'Увеличение нагрузки на терапевтов на 25%',
        trend: 'worsening',
        probability: 65,
        mitigation: 'Подготовить дополнительный персонал, увеличить запас медикаментов'
      },
      {
        factor: 'Кадровая текучесть',
        level: 'low',
        impact: 'Стабильность работы отделений',
        trend: 'stable',
        probability: 20,
        mitigation: 'Программы удержания персонала, повышение квалификации'
      },
      {
        factor: 'Конкуренция в районе',
        level: 'high',
        impact: 'Снижение потока новых пациентов на 8-12%',
        trend: 'worsening',
        probability: 75,
        mitigation: 'Усиление маркетинга, программы лояльности, улучшение сервиса'
      },
      {
        factor: 'Техническое оснащение',
        level: 'medium',
        impact: 'Возможности для расширения услуг и увеличения доходности на 15%',
        trend: 'improving',
        probability: 60,
        mitigation: 'Инвестиции в новое оборудование, обучение персонала'
      }
    ],
    opportunities: [
      {
        area: 'Телемедицина',
        potential: 'high',
        impact: 'Увеличение охвата пациентов на 25%, снижение нагрузки на офис',
        timeline: 'short',
        requirements: ['Платформа для онлайн-консультаций', 'Обучение персонала', 'Юридическое оформление']
      },
      {
        area: 'Профилактические программы',
        potential: 'medium',
        impact: 'Увеличение лояльности пациентов, дополнительный доход',
        timeline: 'medium',
        requirements: ['Разработка программ', 'Маркетинг', 'Координация с врачами']
      },
      {
        area: 'Специализированные check-up',
        potential: 'high',
        impact: 'Привлечение корпоративных клиентов, стабильный доход',
        timeline: 'medium',
        requirements: ['Разработка пакетов услуг', 'Продажи B2B', 'Координация обследований']
      }
    ]
  },
  alerts: [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'Высокая нагрузка на терапевтов',
      message: 'За последнюю неделю нагрузка увеличилась на 15%. Рекомендуется распределение нагрузки.',
      timestamp: '2024-01-24T10:30:00',
      priority: 'medium',
      actionRequired: true,
      relatedTo: 'occupancy'
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'Рост онлайн-записей',
      message: 'Количество онлайн-записей увеличилось на 25% за месяц.',
      timestamp: '2024-01-24T09:15:00',
      priority: 'low',
      actionRequired: false,
      relatedTo: 'appointments'
    },
    {
      id: 'alert-3',
      type: 'success',
      title: 'Целевые показатели достигнуты',
      message: 'Показатели удовлетворенности пациентов превысили целевые значения.',
      timestamp: '2024-01-23T16:45:00',
      priority: 'low',
      actionRequired: false,
      relatedTo: 'satisfaction'
    }
  ],
  comparisons: {
    industryAverages: {
      occupancyRate: 72,
      patientSatisfaction: 4.4,
      noShowRate: 12.5,
      revenuePerPatient: 2850,
      growthRate: 8.2
    },
    competitors: [
      {
        name: 'Клиника "Здоровье+"',
        occupancy: 75,
        satisfaction: 4.5,
        pricing: 3200,
        services: ['Терапия', 'Кардиология', 'Диагностика'],
        advantage: 'Удобное расположение'
      },
      {
        name: 'Медицинский центр "Альфа"',
        occupancy: 82,
        satisfaction: 4.7,
        pricing: 3800,
        services: ['Все специализации', 'Стационар', 'Реабилитация'],
        advantage: 'Полный спектр услуг'
      },
      {
        name: 'Поликлиника №1',
        occupancy: 68,
        satisfaction: 4.2,
        pricing: 2500,
        services: ['Терапия', 'Основные специализации'],
        advantage: 'Низкие цены'
      }
    ],
    previousYear: {
      revenueGrowth: 15.8,
      patientGrowth: 12.3,
      efficiencyImprovement: 8.7,
      costReduction: 5.2
    }
  }
};

// Дополнительные вспомогательные функции
export const getTopPerformers = (doctors: DoctorPerformance[], count: number = 3): DoctorPerformance[] => {
  return doctors
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, count);
};

export const getSpecializationTrend = (specialization: string, data: SpecializationRevenue[]): 'up' | 'down' | 'stable' => {
  const spec = data.find(s => s.specialization === specialization);
  return spec?.trend || 'stable';
};

export const calculatePatientLifetimeValue = (demographics: DemographicData): number => {
  const totalPatients = demographics.byAge.reduce((sum, group) => sum + group.count, 0);
  const totalRevenue = demographics.byAge.reduce((sum, group) => sum + (group.count * group.averageSpend * group.averageVisits), 0);
  return totalRevenue / totalPatients;
};

export const getPeakHours = (timeSlots: TimeSlotAttendance[]): string[] => {
  return timeSlots
    .filter(slot => slot.peak)
    .map(slot => slot.timeSlot);
};

// Экспорт по умолчанию для удобства
export default analyticsData;