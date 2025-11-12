'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { activeCall, chatMessages, patientVitals, upcomingCalls, ChatMessage } from './demo-data';

export default function TelemedicinePage() {
  const [isCallActive, setIsCallActive] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [callTime, setCallTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'vitals' | 'actions'>('chat');
  const [showCallEnded, setShowCallEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        callId: activeCall.id,
        sender: 'doctor',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setTimeout(() => setShowCallEnded(true), 1000);
  };

  const handlePrescribe = () => {
    const prescriptionMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      callId: activeCall.id,
      sender: 'doctor',
      message: 'Назначен рецепт: Амброксол 30мг 3 раза в день, 7 дней',
      timestamp: new Date().toISOString(),
      type: 'prescription'
    };
    setMessages(prev => [...prev, prescriptionMsg]);
  };

  const handleResumeCall = () => {
    setIsCallActive(true);
    setShowCallEnded(false);
  };

  // Mobile-optimized call controls
  const CallControls = () => (
    <div className="flex items-center justify-center gap-2 lg:gap-3 bg-black/60 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-3 lg:p-4 border border-white/10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAudioOn(!isAudioOn)}
        className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center ${
          isAudioOn 
            ? 'bg-white/10 hover:bg-white/20 text-white' 
            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
        }`}
      >
        <span className="text-lg lg:text-xl">{isAudioOn ? '🎤' : '🚫'}</span>
        <span className="sr-only">{isAudioOn ? 'Выключить микрофон' : 'Включить микрофон'}</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsVideoOn(!isVideoOn)}
        className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center ${
          isVideoOn 
            ? 'bg-white/10 hover:bg-white/20 text-white' 
            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
        }`}
      >
        <span className="text-lg lg:text-xl">{isVideoOn ? '📹' : '🚫'}</span>
        <span className="sr-only">{isVideoOn ? 'Выключить камеру' : 'Включить камеру'}</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsScreenSharing(!isScreenSharing)}
        className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center ${
          isScreenSharing 
            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        <span className="text-lg lg:text-xl">🖥️</span>
        <span className="sr-only">{isScreenSharing ? 'Остановить демонстрацию' : 'Начать демонстрацию'}</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsRecording(!isRecording)}
        className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center ${
          isRecording 
            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        <span className="text-lg lg:text-xl">⏺️</span>
        <span className="sr-only">{isRecording ? 'Остановить запись' : 'Начать запись'}</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEndCall}
        className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-red-500 hover:bg-red-600 transition-colors text-white flex items-center justify-center"
      >
        <span className="text-lg lg:text-xl">📞</span>
        <span className="sr-only">Завершить звонок</span>
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                Видео-консультация
              </h1>
              <p className="text-white/60 text-xs lg:text-base">
                {activeCall.patientName} • {activeCall.doctorName}
              </p>
              <div className="flex items-center gap-3 mt-1 lg:mt-2">
                <span className="text-white/40 text-xs lg:text-sm">
                  ⏰ {formatTime(callTime)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  isCallActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {isCallActive ? 'В процессе' : 'Завершён'}
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    Запись
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/demo/medicine/manager"
                className="px-3 lg:px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Video Area */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {/* Video Call Interface */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-2xl shadow-black/20"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-black">
                {/* Patient Video */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                  <div className="text-center">
                    <div className={`w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-white/10 flex items-center justify-center text-2xl lg:text-4xl mb-3 lg:mb-4 mx-auto border-2 ${isVideoOn ? 'border-white/20' : 'border-red-500/50'}`}>
                      {isVideoOn ? '👨' : '📹'}
                    </div>
                    <div className="text-white font-medium text-sm lg:text-base">{activeCall.patientName}</div>
                    <div className="text-white/60 text-xs lg:text-sm">Пациент</div>
                    {!isVideoOn && (
                      <div className="mt-1 lg:mt-2 text-white/40 text-xs">Камера выключена</div>
                    )}
                  </div>
                </div>

                {/* Doctor Video (PiP) */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="absolute bottom-16 lg:bottom-4 right-3 lg:right-4 w-24 h-18 lg:w-48 lg:h-36 rounded-xl lg:rounded-2xl bg-white/5 border border-white/20 backdrop-blur-sm overflow-hidden shadow-lg"
                >
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                    <div className="text-center">
                      <div className={`w-8 h-8 lg:w-16 lg:h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-sm lg:text-xl mb-1 lg:mb-2 mx-auto border ${isVideoOn ? 'border-blue-500/30' : 'border-red-500/30'}`}>
                        👨‍⚕️
                      </div>
                      <div className="text-white text-xs lg:text-sm font-medium">Вы</div>
                      {!isVideoOn && (
                        <div className="text-white/40 text-xs">Выкл.</div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Call Controls - Desktop */}
                <div className="hidden lg:block absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <CallControls />
                </div>

                {/* Call Info Bar */}
                <div className="absolute top-3 lg:top-4 left-3 lg:left-4 bg-black/50 backdrop-blur-sm rounded-xl px-3 lg:px-4 py-2 border border-white/10">
                  <div className="text-white text-sm font-medium">
                    {formatTime(callTime)}
                  </div>
                </div>
              </div>

              {/* Call Controls - Mobile */}
              <div className="lg:hidden p-4 border-t border-white/10 bg-white/5">
                <CallControls />
              </div>
            </motion.div>

            {/* Mobile Tabs */}
            <div className="xl:hidden">
              <div className="flex border-b border-white/10">
                {[
                  { id: 'chat' as const, label: '💬 Чат', icon: '💬' },
                  { id: 'vitals' as const, label: '📊 Показатели', icon: '📊' },
                  { id: 'actions' as const, label: '⚡ Действия', icon: '⚡' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-lg">{tab.icon}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  {activeTab === 'chat' && (
                    <ChatSection
                      messages={messages}
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      handleSendMessage={handleSendMessage}
                      handleKeyPress={handleKeyPress}
                      messagesEndRef={messagesEndRef}
                    />
                  )}

                  {activeTab === 'vitals' && (
                    <VitalsSection patientVitals={patientVitals} />
                  )}

                  {activeTab === 'actions' && (
                    <ActionsSection 
                      handlePrescribe={handlePrescribe}
                      upcomingCalls={upcomingCalls}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Patient Vitals - Desktop */}
            <div className="hidden xl:block rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 p-4 lg:p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>📊</span>
                Показатели пациента
              </h3>
              <VitalsGrid patientVitals={patientVitals} />
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden xl:block space-y-4 lg:space-y-6">
            <ChatSection
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
              messagesEndRef={messagesEndRef}
            />

            <ActionsSection 
              handlePrescribe={handlePrescribe}
              upcomingCalls={upcomingCalls}
            />
          </div>
        </div>
      </div>

      {/* Call Ended Modal */}
      <AnimatePresence>
        {showCallEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl max-w-md w-full p-6 text-center"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl lg:text-3xl mb-4 lg:mb-6 mx-auto">
                ✅
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
                Консультация завершена
              </h2>
              <p className="text-white/60 text-sm lg:text-base mb-6">
                Видеосессия с {activeCall.patientName} успешно завершена.
                <br />
                Продолжительность: {formatTime(callTime)}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResumeCall}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium text-white"
                >
                  Вернуться
                </motion.button>
                <Link
                  href="/demo/medicine/manager"
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-medium text-white text-center"
                >
                  В дашборд
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chat Component
function ChatSection({ messages, newMessage, setNewMessage, handleSendMessage, handleKeyPress, messagesEndRef }) {
  return (
    <div className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 flex flex-col h-80 lg:h-96">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span>💬</span>
          Чат консультации
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3 custom-scrollbar">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-2xl p-3 ${
                message.sender === 'doctor'
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : message.sender === 'patient'
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-yellow-500/20 border border-yellow-500/30'
              }`}
            >
              {message.type === 'file' && (
                <div className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <span>📎</span>
                    <span className="text-white/80">Фото горла.jpg</span>
                  </div>
                </div>
              )}
              
              {message.type === 'prescription' && (
                <div className="mb-2 p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                  <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                    <span>💊</span>
                    <span>Назначение</span>
                  </div>
                </div>
              )}
              
              <div className="text-white/80 text-sm">{message.message}</div>
              <div className="text-white/40 text-xs mt-1">
                {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 lg:p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            className="flex-1 px-3 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white placeholder-white/40 text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            className="px-4 py-2 lg:py-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-white flex items-center justify-center"
          >
            <span className="text-lg">➤</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Vitals Component
function VitalsSection({ patientVitals }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <span>📊</span>
        Показатели пациента
      </h3>
      <VitalsGrid patientVitals={patientVitals} />
    </div>
  );
}

function VitalsGrid({ patientVitals }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4">
      <div className="text-center p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
        <div className="text-2xl lg:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">❤️</div>
        <div className="text-white font-semibold text-lg lg:text-xl">{patientVitals.heartRate} уд/мин</div>
        <div className="text-white/60 text-xs lg:text-sm">Пульс</div>
      </div>
      
      <div className="text-center p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
        <div className="text-2xl lg:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">🩸</div>
        <div className="text-white font-semibold text-lg lg:text-xl">{patientVitals.bloodPressure}</div>
        <div className="text-white/60 text-xs lg:text-sm">Давление</div>
      </div>
      
      <div className="text-center p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
        <div className="text-2xl lg:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">🌡️</div>
        <div className="text-white font-semibold text-lg lg:text-xl">{patientVitals.temperature}°C</div>
        <div className="text-white/60 text-xs lg:text-sm">Температура</div>
      </div>
      
      <div className="text-center p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
        <div className="text-2xl lg:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">💨</div>
        <div className="text-white font-semibold text-lg lg:text-xl">{patientVitals.oxygenSaturation}%</div>
        <div className="text-white/60 text-xs lg:text-sm">Сатурация</div>
      </div>
    </div>
  );
}

// Actions Component
function ActionsSection({ handlePrescribe, upcomingCalls }) {
  return (
    <>
      <div className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 p-4 lg:p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>⚡</span>
          Быстрые действия
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {[
            { icon: '💊', label: 'Выписать рецепт', onClick: handlePrescribe },
            { icon: '📋', label: 'Заполнить историю болезни' },
            { icon: '🔄', label: 'Отправить на анализы' },
            { icon: '📄', label: 'Создать справку' }
          ].map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 flex items-center gap-3 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">{action.icon}</span>
              <span className="text-sm font-medium text-white">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 p-4 lg:p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>⏰</span>
          Ближайшие консультации
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {upcomingCalls.slice(0, 3).map((call) => (
            <motion.div 
              key={call.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="text-white font-medium text-sm truncate flex-1">{call.patientName}</div>
                <div className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded-lg ml-2">
                  {new Date(call.scheduledTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="text-white/60 text-xs flex items-center gap-1">
                <span>{call.doctorName}</span>
                <span>•</span>
                <span className="truncate">{call.specialization}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}