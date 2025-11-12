// /src/app/demo/medicine/user/modules/chat/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

// Типы данных
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

interface Chat {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
  clinic: string;
  rating: number;
  experience: number;
}

// Моковые данные
const mockChats: Chat[] = [
  {
    id: '1',
    doctorName: 'Др. Иванова Мария',
    doctorSpecialty: 'Кардиолог',
    lastMessage: 'Результаты анализов в норме, продолжайте принимать препараты',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 0,
    isOnline: true,
    avatar: '👩‍⚕️',
    clinic: 'Кардиоцентр №1',
    rating: 4.9,
    experience: 12
  },
  {
    id: '2',
    doctorName: 'Др. Петров Сергей',
    doctorSpecialty: 'Терапевт',
    lastMessage: 'Напомните, пожалуйста, когда были последние симптомы?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
    isOnline: false,
    avatar: '👨‍⚕️',
    clinic: 'Поликлиника №3',
    rating: 4.7,
    experience: 8
  },
  {
    id: '3',
    doctorName: 'Др. Сидорова Анна',
    doctorSpecialty: 'Невролог',
    lastMessage: 'Запишитесь на повторный прием через 2 недели',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    isOnline: true,
    avatar: '👩‍⚕️',
    clinic: 'Неврологический центр',
    rating: 4.8,
    experience: 15
  },
  {
    id: '4',
    doctorName: 'Др. Козлов Алексей',
    doctorSpecialty: 'Хирург',
    lastMessage: 'Результаты МРТ готовы, обсудим на следующем приеме',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 1,
    isOnline: true,
    avatar: '👨‍⚕️',
    clinic: 'Хирургическое отделение',
    rating: 4.9,
    experience: 10
  }
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      text: 'Здравствуйте! Как ваше самочувствие после последнего приема?',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      type: 'text'
    },
    {
      id: '1-2',
      text: 'Здравствуйте! В целом лучше, но иногда беспокоит легкое головокружение',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      read: true,
      type: 'text'
    },
    {
      id: '1-3',
      text: 'Это может быть связано с изменением дозировки. Продолжайте наблюдать. Если симптомы усилятся - свяжитесь со мной',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
      read: true,
      type: 'text'
    },
    {
      id: '1-4',
      text: 'Результаты анализов в норме, продолжайте принимать препараты',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: true,
      type: 'text'
    }
  ],
  '2': [
    {
      id: '2-1',
      text: 'Добрый день! Напомните, пожалуйста, когда были последние симптомы?',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      type: 'text'
    }
  ],
  '3': [
    {
      id: '3-1',
      text: 'Запишитесь на повторный прием через 2 недели для контроля динамики',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      type: 'text'
    }
  ],
  '4': [
    {
      id: '4-1',
      text: 'Результаты МРТ готовы, обсудим на следующем приеме',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      type: 'text'
    },
    {
      id: '4-2',
      text: 'Также прикрепляю рекомендации по восстановлению',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      read: false,
      type: 'file',
      attachment: {
        name: 'Рекомендации_по_восстановлению.pdf',
        size: '2.4 МБ',
        type: 'pdf'
      }
    }
  ]
};

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

  // Фильтрация чатов по поиску
  const filteredChats = chats.filter(chat =>
    chat.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.clinic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Симуляция набора сообщения врачом
  useEffect(() => {
    if (selectedChat && currentMessages.length > 0) {
      const lastMessage = currentMessages[currentMessages.length - 1];
      if (lastMessage.sender === 'user') {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
          // Автоматический ответ (можно убрать в реальном приложении)
          setTimeout(() => {
            const autoReply: Message = {
              id: `${selectedChat}-auto-${Date.now()}`,
              text: 'Спасибо за информацию. Изучил ваши симптомы и готов дать рекомендации.',
              sender: 'doctor',
              timestamp: new Date(),
              read: false,
              type: 'text'
            };
            setMessages(prev => ({
              ...prev,
              [selectedChat]: [...(prev[selectedChat] || []), autoReply]
            }));
          }, 2000);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentMessages, selectedChat]);

  // Обработчик отправки сообщения
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: `${selectedChat}-${Date.now()}`,
      text: messageInput,
      sender: 'user',
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    // Обновляем сообщения
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    // Обновляем последнее сообщение в списке чатов
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: messageInput, lastMessageTime: new Date() }
        : chat
    ));

    setMessageInput('');
  };

  // Обработчик отправки файла
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    const fileMessage: Message = {
      id: `${selectedChat}-file-${Date.now()}`,
      text: `Файл: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      read: false,
      type: 'file',
      attachment: {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} МБ`,
        type: file.type.split('/')[1] || 'file'
      }
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), fileMessage]
    }));

    setChats(prev => prev.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: `Файл: ${file.name}`, lastMessageTime: new Date() }
        : chat
    ));

    // Очищаем input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Форматирование времени
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      jpg: '🖼️',
      png: '🖼️',
      txt: '📃',
      default: '📎'
    };
    return icons[fileType] || icons.default;
  };

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Заголовок и навигация */}
        <motion.header
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <Link
                href="/demo/medicine/user"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                <span className="text-lg">←</span>
                <span>Назад</span>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">Медицинский чат</h1>
                <p className="text-white/60 text-sm lg:text-base">
                  Общайтесь с вашими врачами онлайн
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-sm font-medium"
              >
                <span>👨‍⚕️</span>
                <span className="hidden sm:inline">Новый чат</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-180px)]">
          {/* Список чатов */}
          <motion.section
            className="lg:col-span-1 flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Поиск */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск врачей..."
                  className="w-full px-4 py-3 pl-10 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors duration-200 text-sm"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  🔍
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h2 className="text-lg lg:text-xl font-bold text-white">Диалоги</h2>
              <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">
                {filteredChats.length} из {chats.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 lg:space-y-3">
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <InteractiveCard
                    className={`p-3 lg:p-4 cursor-pointer transition-all duration-200 ${
                      selectedChat === chat.id 
                        ? 'bg-blue-500/20 border-blue-500/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => {
                      setSelectedChat(chat.id);
                      // Помечаем сообщения как прочитанные
                      if (chat.unreadCount > 0) {
                        setChats(prev => 
                          prev.map(c => 
                            c.id === chat.id ? { ...c, unreadCount: 0 } : c
                          )
                        );
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-base lg:text-lg">
                          {chat.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 rounded-full border-2 border-slate-800 ${
                          chat.isOnline ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-white text-sm truncate">
                            {chat.doctorName}
                          </div>
                          <div className="text-xs text-white/40">
                            {formatTime(chat.lastMessageTime)}
                          </div>
                        </div>
                        
                        <div className="text-xs text-white/60 mb-1 truncate">
                          {chat.doctorSpecialty} • {chat.clinic}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-white/70 text-xs truncate flex-1 mr-2">
                            {chat.lastMessage}
                          </div>
                          {chat.unreadCount > 0 && (
                            <div className="flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>
              ))}
            </div>

            {/* Пустой список чатов */}
            {filteredChats.length === 0 && (
              <motion.div variants={itemVariants} className="mt-8">
                <InteractiveCard className="p-4 lg:p-6 text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl lg:text-2xl mb-3 lg:mb-4 mx-auto">
                    💬
                  </div>
                  <div className="font-semibold text-white text-sm lg:text-base mb-1 lg:mb-2">
                    {searchQuery ? 'Чаты не найдены' : 'Нет активных чатов'}
                  </div>
                  <div className="text-white/60 text-xs lg:text-sm mb-3 lg:mb-4">
                    {searchQuery ? 'Попробуйте изменить запрос' : 'Начните общение с вашим врачом'}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-sm lg:text-base font-medium"
                  >
                    <span>👨‍⚕️</span>
                    <span>Найти врача</span>
                  </motion.button>
                </InteractiveCard>
              </motion.div>
            )}
          </motion.section>

          {/* Область сообщений */}
          <motion.section
            className="lg:col-span-3 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {selectedChat ? (
              <>
                {/* Заголовок чата */}
                <InteractiveCard className="p-3 lg:p-4 mb-3 lg:mb-4 rounded-2xl">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-base lg:text-lg">
                        {selectedChatData?.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 rounded-full border-2 border-slate-800 ${
                        selectedChatData?.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-white text-base lg:text-lg truncate">
                          {selectedChatData?.doctorName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">
                          <span>⭐ {selectedChatData?.rating}</span>
                        </div>
                      </div>
                      <div className="text-white/60 text-xs lg:text-sm truncate">
                        {selectedChatData?.doctorSpecialty} • {selectedChatData?.clinic}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 lg:p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
                        title="Аудиозвонок"
                      >
                        <span className="text-base lg:text-lg">📞</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 lg:p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
                        title="Видеозвонок"
                      >
                        <span className="text-base lg:text-lg">📹</span>
                      </motion.button>
                    </div>
                  </div>
                </InteractiveCard>

                {/* Сообщения */}
                <InteractiveCard className="flex-1 p-3 lg:p-4 mb-3 lg:mb-4 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-3 lg:space-y-4 p-2">
                      {currentMessages.map((message, index) => {
                        const showDate = index === 0 || 
                          formatDate(message.timestamp) !== formatDate(currentMessages[index - 1].timestamp);
                        
                        return (
                          <div key={message.id}>
                            {/* Дата */}
                            {showDate && (
                              <div className="flex justify-center mb-3 lg:mb-4">
                                <div className="px-3 py-1 bg-white/10 rounded-full text-white/60 text-xs">
                                  {formatDate(message.timestamp)}
                                </div>
                              </div>
                            )}
                            
                            {/* Сообщение */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 lg:py-3 rounded-2xl ${
                                  message.sender === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-white/10 text-white rounded-bl-none'
                                }`}
                              >
                                {message.type === 'file' && message.attachment && (
                                  <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                                    <span className="text-lg">{getFileIcon(message.attachment.type)}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">{message.attachment.name}</div>
                                      <div className="text-xs opacity-70">{message.attachment.size}</div>
                                    </div>
                                    <button className="p-1 rounded hover:bg-white/20 transition-colors">
                                      📥
                                    </button>
                                  </div>
                                )}
                                <div className="text-sm leading-relaxed">
                                  {message.text}
                                </div>
                                <div className={`text-xs mt-1 ${
                                  message.sender === 'user' ? 'text-blue-200' : 'text-white/40'
                                }`}>
                                  {formatTime(message.timestamp)}
                                  {message.sender === 'user' && (
                                    <span className="ml-1">
                                      {message.read ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}

                      {/* Индикатор набора сообщения */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white/10 text-white rounded-2xl rounded-bl-none px-4 py-3">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </InteractiveCard>

                {/* Поле ввода */}
                <form onSubmit={handleSendMessage}>
                  <InteractiveCard className="p-3 lg:p-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 lg:p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
                        onClick={() => fileInputRef.current?.click()}
                        title="Прикрепить файл"
                      >
                        <span className="text-base lg:text-lg">📎</span>
                      </motion.button>
                      
                      <div className="flex-1">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Введите сообщение..."
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors duration-200 text-sm lg:text-base"
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!messageInput.trim()}
                        className={`p-2 lg:p-3 rounded-2xl transition-all duration-200 ${
                          messageInput.trim()
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-white/5 text-white/40 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-base lg:text-lg">➤</span>
                      </motion.button>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-2 lg:mt-3 text-xs text-white/40 gap-1">
                      <div>Сообщения защищены сквозным шифрованием</div>
                      <div>Врач обычно отвечает в течение 15 минут</div>
                    </div>
                  </InteractiveCard>
                </form>
              </>
            ) : (
              /* Состояние при невыбранном чате */
              <InteractiveCard className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl lg:text-3xl mb-4 lg:mb-6 mx-auto">
                    💬
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-3">
                    Выберите чат
                  </h3>
                  <p className="text-white/60 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed">
                    Выберите диалог с врачом из списка слева чтобы начать общение, 
                    или создайте новый чат для консультации
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-sm lg:text-base font-medium"
                    >
                      <span>👨‍⚕️</span>
                      <span>Найти врача</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-white text-sm lg:text-base font-medium"
                    >
                      <span>📋</span>
                      <span>Мои врачи</span>
                    </motion.button>
                  </div>
                </div>
              </InteractiveCard>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}