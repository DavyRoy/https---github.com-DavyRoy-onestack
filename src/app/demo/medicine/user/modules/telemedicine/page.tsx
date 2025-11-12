'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

// Форматирование времени
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function TelemedicinePage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'call' | 'chat' | 'info'>('call');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Имитация данных консультации
  const consultationData = useMemo(() => ({
    doctor: {
      name: 'Петрова Мария Ивановна',
      specialization: 'Кардиолог',
      rating: 4.9,
      experience: '12 лет',
      image: '👩‍⚕️',
      nextAvailable: '2024-01-25'
    },
    patient: {
      name: 'Иванов Алексей',
      age: 35,
      conditions: ['Гипертония', 'Аритмия']
    },
    vitalSigns: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 36.6,
      oxygen: 98
    },
    chatMessages: [
      {
        id: 1,
        sender: 'doctor',
        message: 'Здравствуйте, Алексей! Как ваше самочувствие?',
        time: '10:00',
        type: 'text'
      },
      {
        id: 2,
        sender: 'patient',
        message: 'Добрый день! Давление сегодня 135/85, чувствую легкое головокружение.',
        time: '10:01',
        type: 'text'
      },
      {
        id: 3,
        sender: 'doctor',
        message: 'Понятно. Принимали ли вы сегодня лекарства?',
        time: '10:02',
        type: 'text'
      },
      {
        id: 4,
        sender: 'system',
        message: 'Доктор отправил файл: Направление на ЭКГ',
        time: '10:03',
        type: 'file'
      }
    ]
  }), []);

  // Таймер звонка
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Исправление для гидрации
  useEffect(() => {
    setIsClient(true);
  }, []);

  const startCall = () => {
    setIsCallActive(true);
    setCallTime(0);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallTime(0);
    setIsRecording(false);
    setIsScreenSharing(false);
  };

  const sendMessage = () => {
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const quickActions = [
    { icon: '📋', label: 'История болезни', action: () => console.log('Open medical history') },
    { icon: '💊', label: 'Мои лекарства', action: () => console.log('Open medications') },
    { icon: '📊', label: 'Анализы', action: () => console.log('Open test results') },
    { icon: '📅', label: 'Запись на приём', action: () => console.log('Schedule appointment') }
  ];

  const upcomingConsultations = [
    { id: 1, doctor: 'Сидоров В.П.', specialization: 'Невролог', date: '2024-01-25', time: '14:00' },
    { id: 2, doctor: 'Козлова Е.В.', specialization: 'Офтальмолог', date: '2024-01-28', time: '11:30' }
  ];

  const stats = {
    total: 12,
    averageDuration: '45 мин',
    rating: 4.8,
    successRate: '95%'
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-white/5 rounded-2xl mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/demo/medicine/user"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="text-lg">←</span>
                  <span>Назад к дашборду</span>
                </Link>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Видео-консультация</h1>
              <p className="text-white/60 text-sm lg:text-base">
                Онлайн прием с врачом в реальном времени
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            <InteractiveCard className="p-3 lg:p-4 text-center">
              <div className="text-lg lg:text-2xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-white/60 text-xs lg:text-sm">Всего консультаций</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-green-500/10 border-green-500/20">
              <div className="text-lg lg:text-2xl font-bold text-green-400 mb-1">{stats.averageDuration}</div>
              <div className="text-green-400/60 text-xs lg:text-sm">Средняя длительность</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-blue-500/10 border-blue-500/20">
              <div className="text-lg lg:text-2xl font-bold text-blue-400 mb-1">{stats.rating}</div>
              <div className="text-blue-400/60 text-xs lg:text-sm">Оценка врачей</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-purple-500/10 border-purple-500/20">
              <div className="text-lg lg:text-2xl font-bold text-purple-400 mb-1">{stats.successRate}</div>
              <div className="text-purple-400/60 text-xs lg:text-sm">Успешных консультаций</div>
            </InteractiveCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <InteractiveCard className="overflow-hidden">
              {/* Video Call Interface */}
              <div className="relative bg-black rounded-2xl">
                {/* Main Video Area */}
                <div className="aspect-video bg-gray-900 relative rounded-t-2xl">
                  {isCallActive ? (
                    <>
                      {/* Doctor's Video (Main) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-blue-500/20 border-4 border-blue-500/30 flex items-center justify-center text-3xl lg:text-4xl mb-3 lg:mb-4 mx-auto">
                            {consultationData.doctor.image}
                          </div>
                          <div className="text-white font-semibold text-base lg:text-lg">{consultationData.doctor.name}</div>
                          <div className="text-white/60 text-sm lg:text-base">{consultationData.doctor.specialization}</div>
                        </div>
                      </div>

                      {/* Patient's Video (PiP) */}
                      <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 w-32 h-24 lg:w-48 lg:h-36 rounded-xl bg-gray-800 border-2 border-white/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center text-sm lg:text-lg mb-1 lg:mb-2 mx-auto">
                              👤
                            </div>
                            <div className="text-white text-xs lg:text-sm">Вы</div>
                          </div>
                        </div>
                      </div>

                      {/* Call Timer */}
                      <div className="absolute top-3 lg:top-4 left-3 lg:left-4 px-2 lg:px-3 py-1 lg:py-2 rounded-xl bg-black/50 backdrop-blur-sm">
                        <div className="text-white font-mono font-bold text-sm lg:text-base">{formatTime(callTime)}</div>
                      </div>

                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="absolute top-3 lg:top-4 right-3 lg:right-4 px-2 lg:px-3 py-1 lg:py-2 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-500/30">
                          <div className="flex items-center gap-1 lg:gap-2">
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-xs lg:text-sm">Идет запись</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Pre-call Screen */
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-center max-w-md">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-blue-500/20 border-4 border-blue-500/30 flex items-center justify-center text-3xl lg:text-4xl mb-4 lg:mb-6 mx-auto">
                          {consultationData.doctor.image}
                        </div>
                        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Готовы к консультации?</h2>
                        <p className="text-white/60 text-sm lg:text-base mb-4 lg:mb-6">
                          {consultationData.doctor.name} - {consultationData.doctor.specialization}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <motion.button
                            onClick={startCall}
                            className="px-6 lg:px-8 py-2 lg:py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-colors font-medium text-white flex items-center justify-center gap-2 text-sm lg:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>🎥</span>
                            <span>Начать видеозвонок</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls Panel */}
                {isCallActive && (
                  <div className="p-4 lg:p-6 bg-gray-800/50 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 lg:gap-4">
                      {/* Microphone Control */}
                      <motion.button
                        onClick={() => setIsMicMuted(!isMicMuted)}
                        className={`p-3 lg:p-4 rounded-2xl transition-all duration-200 ${
                          isMicMuted 
                            ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                        } border`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-xl lg:text-2xl">
                          {isMicMuted ? '🎤' : '🎤'}
                        </div>
                        <div className="text-xs mt-1">
                          {isMicMuted ? 'Вкл' : 'Выкл'}
                        </div>
                      </motion.button>

                      {/* Camera Control */}
                      <motion.button
                        onClick={() => setIsCameraOff(!isCameraOff)}
                        className={`p-3 lg:p-4 rounded-2xl transition-all duration-200 ${
                          isCameraOff 
                            ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                        } border`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-xl lg:text-2xl">
                          {isCameraOff ? '📹' : '📹'}
                        </div>
                        <div className="text-xs mt-1">
                          {isCameraOff ? 'Вкл' : 'Выкл'}
                        </div>
                      </motion.button>

                      {/* Screen Share */}
                      <motion.button
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className={`p-3 lg:p-4 rounded-2xl transition-all duration-200 ${
                          isScreenSharing 
                            ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                        } border`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-xl lg:text-2xl">
                          {isScreenSharing ? '🖥️' : '🖥️'}
                        </div>
                        <div className="text-xs mt-1">
                          Экран
                        </div>
                      </motion.button>

                      {/* Record */}
                      <motion.button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-3 lg:p-4 rounded-2xl transition-all duration-200 ${
                          isRecording 
                            ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                        } border`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-xl lg:text-2xl">
                          {isRecording ? '⏺️' : '⏺️'}
                        </div>
                        <div className="text-xs mt-1">
                          Запись
                        </div>
                      </motion.button>

                      {/* End Call */}
                      <motion.button
                        onClick={endCall}
                        className="p-3 lg:p-4 rounded-2xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors text-red-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-xl lg:text-2xl">📞</div>
                        <div className="text-xs mt-1">Завершить</div>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-white/10">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'call', label: '📹 Видеозвонок', icon: '📹' },
                    { id: 'chat', label: '💬 Чат', icon: '💬' },
                    { id: 'info', label: '📋 Информация', icon: '📋' }
                  ].map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 border-b-2 transition-colors flex-shrink-0 ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-white/60 hover:text-white'
                      }`}
                    >
                      <span className="text-sm lg:text-base">{icon}</span>
                      <span className="text-sm font-medium whitespace-nowrap">{label.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 lg:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'call' && (
                    <motion.div
                      key="call"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        {/* Patient Info */}
                        <div className="space-y-3 lg:space-y-4">
                          <h3 className="font-semibold text-white text-sm lg:text-base flex items-center gap-2">
                            <span>👤</span>
                            <span>Информация о пациенте</span>
                          </h3>
                          <div className="space-y-2 lg:space-y-3">
                            <div className="flex justify-between p-2 lg:p-3 rounded-xl bg-white/5">
                              <span className="text-white/60 text-xs lg:text-sm">Имя</span>
                              <span className="text-white font-medium text-xs lg:text-sm">{consultationData.patient.name}</span>
                            </div>
                            <div className="flex justify-between p-2 lg:p-3 rounded-xl bg-white/5">
                              <span className="text-white/60 text-xs lg:text-sm">Возраст</span>
                              <span className="text-white font-medium text-xs lg:text-sm">{consultationData.patient.age} лет</span>
                            </div>
                            <div className="p-2 lg:p-3 rounded-xl bg-white/5">
                              <span className="text-white/60 text-xs lg:text-sm">Диагнозы</span>
                              <div className="flex flex-wrap gap-1 lg:gap-2 mt-2">
                                {consultationData.patient.conditions.map((condition, index) => (
                                  <span key={index} className="px-2 lg:px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30">
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Vital Signs */}
                        <div className="space-y-3 lg:space-y-4">
                          <h3 className="font-semibold text-white text-sm lg:text-base flex items-center gap-2">
                            <span>📊</span>
                            <span>Показатели здоровья</span>
                          </h3>
                          <div className="grid grid-cols-2 gap-3 lg:gap-4">
                            <InteractiveCard className="p-3 lg:p-4 text-center bg-green-500/10 border-green-500/20">
                              <div className="text-lg lg:text-2xl font-bold text-green-400 mb-1">
                                {consultationData.vitalSigns.heartRate}
                              </div>
                              <div className="text-green-400/60 text-xs lg:text-sm">Пульс</div>
                              <div className="text-green-400/40 text-xs">уд/мин</div>
                            </InteractiveCard>
                            <InteractiveCard className="p-3 lg:p-4 text-center bg-blue-500/10 border-blue-500/20">
                              <div className="text-base lg:text-lg font-bold text-blue-400 mb-1">
                                {consultationData.vitalSigns.bloodPressure}
                              </div>
                              <div className="text-blue-400/60 text-xs lg:text-sm">Давление</div>
                              <div className="text-blue-400/40 text-xs">мм рт.ст.</div>
                            </InteractiveCard>
                            <InteractiveCard className="p-3 lg:p-4 text-center bg-yellow-500/10 border-yellow-500/20">
                              <div className="text-lg lg:text-2xl font-bold text-yellow-400 mb-1">
                                {consultationData.vitalSigns.temperature}
                              </div>
                              <div className="text-yellow-400/60 text-xs lg:text-sm">Температура</div>
                              <div className="text-yellow-400/40 text-xs">°C</div>
                            </InteractiveCard>
                            <InteractiveCard className="p-3 lg:p-4 text-center bg-purple-500/10 border-purple-500/20">
                              <div className="text-lg lg:text-2xl font-bold text-purple-400 mb-1">
                                {consultationData.vitalSigns.oxygen}%
                              </div>
                              <div className="text-purple-400/60 text-xs lg:text-sm">Сатурация</div>
                              <div className="text-purple-400/40 text-xs">SpO₂</div>
                            </InteractiveCard>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Chat Messages */}
                      <div className="h-48 lg:h-64 overflow-y-auto space-y-3 lg:space-y-4">
                        {consultationData.chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'} ${
                              msg.sender === 'system' ? 'justify-center' : ''
                            }`}
                          >
                            <div className={`max-w-xs lg:max-w-md ${
                              msg.sender === 'patient' 
                                ? 'bg-blue-500/20 border border-blue-500/30' 
                                : msg.sender === 'system'
                                  ? 'bg-yellow-500/20 border border-yellow-500/30'
                                  : 'bg-white/5 border border-white/10'
                            } rounded-2xl p-3 lg:p-4`}
                            >
                              {msg.sender === 'system' ? (
                                <div className="text-yellow-400 text-xs lg:text-sm text-center">{msg.message}</div>
                              ) : (
                                <>
                                  <div className="text-white text-xs lg:text-sm">{msg.message}</div>
                                  <div className="text-white/40 text-xs mt-1 text-right">{msg.time}</div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="flex gap-2 lg:gap-3">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Введите сообщение..."
                          className="flex-1 px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-colors text-white placeholder-white/40 text-sm lg:text-base"
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <motion.button
                          onClick={sendMessage}
                          className="px-4 lg:px-6 py-2 lg:py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white font-medium text-sm lg:text-base"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Отправить
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'info' && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 lg:space-y-6"
                    >
                      {/* Doctor Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="p-4 lg:p-6 rounded-xl bg-white/5 border border-white/10">
                          <h4 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4 flex items-center gap-2">
                            <span>👨‍⚕️</span>
                            <span>Информация о враче</span>
                          </h4>
                          <div className="space-y-2 lg:space-y-3">
                            <div className="flex justify-between">
                              <span className="text-white/60 text-xs lg:text-sm">Специализация:</span>
                              <span className="text-white font-medium text-xs lg:text-sm">{consultationData.doctor.specialization}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60 text-xs lg:text-sm">Опыт работы:</span>
                              <span className="text-white font-medium text-xs lg:text-sm">{consultationData.doctor.experience}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60 text-xs lg:text-sm">Рейтинг:</span>
                              <span className="text-yellow-400 font-medium text-xs lg:text-sm">★ {consultationData.doctor.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 lg:p-6 rounded-xl bg-white/5 border border-white/10">
                          <h4 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4 flex items-center gap-2">
                            <span>📋</span>
                            <span>Детали консультации</span>
                          </h4>
                          <div className="space-y-2 lg:space-y-3">
                            <div className="flex justify-between">
                              <span className="text-white/60 text-xs lg:text-sm">Тип:</span>
                              <span className="text-white font-medium text-xs lg:text-sm">Видео-консультация</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60 text-xs lg:text-sm">Длительность:</span>
                              <span className="text-white font-medium text-xs lg:text-sm">До 60 минут</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60 text-xs lg:text-sm">Стоимость:</span>
                              <span className="text-green-400 font-medium text-xs lg:text-sm">2 500 ₽</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Technical Information */}
                      <div className="p-4 lg:p-6 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4 flex items-center gap-2">
                          <span>🔧</span>
                          <span>Техническая информация</span>
                        </h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                          <div className="text-center p-3 lg:p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <div className="text-xl lg:text-2xl mb-2">📡</div>
                            <div className="text-green-400 font-medium text-sm lg:text-base">Отличное</div>
                            <div className="text-green-400/60 text-xs lg:text-sm">Соединение</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-xl lg:text-2xl mb-2">🎥</div>
                            <div className="text-blue-400 font-medium text-sm lg:text-base">1080p</div>
                            <div className="text-blue-400/60 text-xs lg:text-sm">Качество</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <div className="text-xl lg:text-2xl mb-2">🔊</div>
                            <div className="text-purple-400 font-medium text-sm lg:text-base">Чистый</div>
                            <div className="text-purple-400/60 text-xs lg:text-sm">Звук</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <div className="text-xl lg:text-2xl mb-2">⚡</div>
                            <div className="text-yellow-400 font-medium text-sm lg:text-base">35 мс</div>
                            <div className="text-yellow-400/60 text-xs lg:text-sm">Задержка</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </InteractiveCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Quick Actions */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">⚡ Быстрые действия</h3>
              <div className="space-y-2 lg:space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-lg lg:text-xl">{action.icon}</span>
                    <div>
                      <div className="font-medium text-white text-xs lg:text-sm">{action.label}</div>
                    </div>
                    <motion.span
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 2 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </InteractiveCard>

            {/* Upcoming Consultations */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">📅 Ближайшие консультации</h3>
              <div className="space-y-3 lg:space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <motion.div 
                    key={consultation.id} 
                    className="p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-2 lg:gap-3 mb-2">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs lg:text-sm">
                        👨‍⚕️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-xs lg:text-sm line-clamp-1">
                          {consultation.doctor}
                        </div>
                        <div className="text-white/60 text-xs line-clamp-1">
                          {consultation.specialization}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>{new Date(consultation.date).toLocaleDateString('ru-RU')}</span>
                      <span>{consultation.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button 
                className="w-full mt-3 lg:mt-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white text-xs lg:text-sm"
                whileHover={{ x: 4 }}
              >
                Показать все →
              </motion.button>
            </InteractiveCard>

            {/* Emergency Help */}
            <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-base lg:text-lg">
                  🚨
                </div>
                <div>
                  <div className="font-bold text-white text-sm lg:text-base">Экстренная помощь</div>
                  <div className="text-white/60 text-xs lg:text-sm">Круглосуточно</div>
                </div>
              </div>
              <div className="space-y-2">
                <motion.button 
                  className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-red-400 font-medium text-xs lg:text-sm">Скорая помощь</span>
                  <span className="text-white font-mono text-xs lg:text-sm">112 / 103</span>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-medium text-xs lg:text-sm">Регистратура</span>
                  <span className="text-white/60 text-xs lg:text-sm">+7 (495) 123-45-67</span>
                </motion.button>
              </div>
            </InteractiveCard>
          </div>
        </div>
      </div>
    </div>
  );
}