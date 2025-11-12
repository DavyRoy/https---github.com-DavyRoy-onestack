// components/AIPaymentAssistant.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AIPaymentAssistantProps {
  invoice: any;
  onSuggestionApply: (suggestion: string) => void;
}

export default function AIPaymentAssistant({ invoice, onSuggestionApply }: AIPaymentAssistantProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Привет! Вижу у вас есть счет ${invoice.number} на сумму ${invoice.totalAmount.toLocaleString()} ₽. Могу помочь с оплатой или рассрочкой!`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, invoice);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickSuggestions = [
    "Какие способы оплаты доступны?",
    "Можно ли получить рассрочку?",
    "Как оплатить страховкой?",
    "Есть ли скидки?",
    "Нужна помощь с оплатой"
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
          AI
        </div>
        <div>
          <h3 className="font-semibold text-white">Помощник по оплате</h3>
          <p className="text-white/60 text-sm">AI-ассистент всегда готов помочь</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 text-white'
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-blue-100' : 'text-white/60'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {quickSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setInputMessage(suggestion)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/80 text-xs text-center"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Задайте вопрос о платеже..."
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40 text-sm"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all text-white font-medium"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}

function generateAIResponse(message: string, invoice: any): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('способ') || lowerMessage.includes('оплат')) {
    return "Доступные способы оплаты: 💳 Банковские карты (Visa, Mastercard, Мир), 🏦 Банковский перевод, 📱 Электронные кошельки (ЮMoney, Qiwi), 🛡️ Оплата через страховку. Рекомендую карту для мгновенного подтверждения!";
  }

  if (lowerMessage.includes('рассроч') || lowerMessage.includes('распис')) {
    return `Для счета ${invoice.number} доступна рассрочка на 3-6 месяцев без процентов! Хотите оформить? Сумма платежа составит около ${Math.ceil(invoice.totalAmount / 3).toLocaleString()} ₽ в месяц.`;
  }

  if (lowerMessage.includes('скидк') || lowerMessage.includes('акци')) {
    return "Сейчас действуют акции: 🎯 10% скидка при оплате картой онлайн, 🎯 5% кешбэк за отзыв, 🎯 Специальные условия для пенсионеров. Могу применить подходящую скидку!";
  }

  if (lowerMessage.includes('страхов') || lowerMessage.includes('страхован')) {
    return "Для оплаты через страховку нужен полис ДМС. У вас есть действующий полис? Могу помочь с оформлением документов для страховой компании.";
  }

  if (lowerMessage.includes('помощ') || lowerMessage.includes('проблем')) {
    return "Конечно, помогу! Свяжу вас с финансовым консультантом. Также доступна круглосуточная поддержка по телефону 8-800-XXX-XXXX.";
  }

  return "Понимаю ваш вопрос! Как помощник по оплате, я могу: 💡 Подобрать оптимальный способ оплаты, 💡 Оформить рассрочку, 💡 Применить доступные скидки, 💡 Помочь со страховкой. Что именно вас интересует?";
}