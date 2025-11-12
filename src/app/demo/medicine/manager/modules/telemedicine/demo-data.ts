export interface VideoCall {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledTime: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  duration?: number;
  recordingUrl?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  callId: string;
  sender: 'patient' | 'doctor' | 'system';
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'prescription';
  fileUrl?: string;
}

export interface PatientVitals {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  lastUpdated: string;
}

export const activeCall: VideoCall = {
  id: 'call-001',
  patientId: 'pat-001',
  patientName: 'Смирнов Алексей',
  doctorId: 'doc-1',
  doctorName: 'Иванов А.С.',
  scheduledTime: '2024-01-24T14:30:00',
  status: 'active',
  duration: 15,
  notes: 'Жалобы на головную боль и температуру'
};

export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    callId: 'call-001',
    sender: 'system',
    message: 'Видеосессия начата',
    timestamp: '2024-01-24T14:30:00',
    type: 'text'
  },
  {
    id: 'msg-2',
    callId: 'call-001',
    sender: 'doctor',
    message: 'Здравствуйте, Алексей! Расскажите, что вас беспокоит?',
    timestamp: '2024-01-24T14:30:15',
    type: 'text'
  },
  {
    id: 'msg-3',
    callId: 'call-001',
    sender: 'patient',
    message: 'Добрый день! У меня второй день температура 37.8 и сильная головная боль',
    timestamp: '2024-01-24T14:31:30',
    type: 'text'
  },
  {
    id: 'msg-4',
    callId: 'call-001',
    sender: 'patient',
    message: 'Также есть кашель и общая слабость',
    timestamp: '2024-01-24T14:32:00',
    type: 'text'
  },
  {
    id: 'msg-5',
    callId: 'call-001',
    sender: 'doctor',
    message: 'Понятно. Отправьте, пожалуйста, фото горла, если возможно',
    timestamp: '2024-01-24T14:32:45',
    type: 'text'
  },
  {
    id: 'msg-6',
    callId: 'call-001',
    sender: 'patient',
    message: 'Фото горла',
    timestamp: '2024-01-24T14:33:30',
    type: 'file',
    fileUrl: '#'
  },
  {
    id: 'msg-7',
    callId: 'call-001',
    sender: 'doctor',
    message: 'Спасибо. Вижу покраснение. Измерьте температуру сейчас и сообщите',
    timestamp: '2024-01-24T14:34:15',
    type: 'text'
  }
];

export const patientVitals: PatientVitals = {
  heartRate: 72,
  bloodPressure: '125/80',
  temperature: 37.8,
  oxygenSaturation: 98,
  lastUpdated: '2024-01-24T14:25:00'
};

export const upcomingCalls: VideoCall[] = [
  {
    id: 'call-002',
    patientId: 'pat-002',
    patientName: 'Петрова Ольга',
    doctorId: 'doc-2',
    doctorName: 'Петрова М.И.',
    scheduledTime: '2024-01-24T15:00:00',
    status: 'scheduled'
  },
  {
    id: 'call-003',
    patientId: 'pat-003',
    patientName: 'Козлов Дмитрий',
    doctorId: 'doc-1',
    doctorName: 'Иванов А.С.',
    scheduledTime: '2024-01-24T16:30:00',
    status: 'scheduled'
  }
];