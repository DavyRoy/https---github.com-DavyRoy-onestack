'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Ticket {
  id: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  section: string;
  seat: string;
  price: number;
  status: 'active' | 'used' | 'cancelled';
  qrCode: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  price: number;
  availableTickets: number;
  image?: string;
  category: string;
}

const EVENTS: Event[] = [
  {
    id: '1',
    name: 'Jazz Band Live',
    date: '2024-11-20',
    time: '19:00',
    venue: 'Концертный зал "Филармония"',
    description: 'Вечер джазовой музыки в исполнении лучших музыкантов города',
    price: 2500,
    availableTickets: 45,
    category: 'Концерт'
  },
  {
    id: '2',
    name: 'Спектакль "Гамлет"',
    date: '2024-11-22',
    time: '18:30',
    venue: 'Драматический театр',
    description: 'Классическая постановка шекспировской трагедии',
    price: 1800,
    availableTickets: 23,
    category: 'Театр'
  },
  {
    id: '3',
    name: 'Стендап вечер',
    date: '2024-11-25',
    time: '20:00',
    venue: 'Comedy Club',
    description: 'Лучшие комики города в одном шоу',
    price: 1200,
    availableTickets: 67,
    category: 'Юмор'
  },
];

const MY_TICKETS: Ticket[] = [
  {
    id: '1',
    eventName: 'Jazz Band Live',
    date: '2024-11-20',
    time: '19:00',
    venue: 'Концертный зал "Филармония"',
    section: 'Партер',
    seat: 'A12',
    price: 2500,
    status: 'active',
    qrCode: 'mock-qr-1'
  }
];

export default function TicketingPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'my-tickets'>('events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'confirmation'>('select');

  const handleBuyTickets = (event: Event) => {
    setSelectedEvent(event);
    setPaymentStep('details');
  };

  const handlePayment = () => {
    // Mock payment processing
    setTimeout(() => {
      setPaymentStep('confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo/services/user"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад к дашборду
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-semibold">Билеты и оплата</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                История
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 px-6 border-b-2 transition-colors ${
              activeTab === 'events'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Мероприятия
          </button>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`pb-4 px-6 border-b-2 transition-colors ${
              activeTab === 'my-tickets'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Мои билеты ({MY_TICKETS.length})
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ближайшие мероприятия</h2>
              <div className="flex gap-3">
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Все категории</option>
                  <option>Концерт</option>
                  <option>Театр</option>
                  <option>Юмор</option>
                </select>
                <input
                  type="text"
                  placeholder="Поиск мероприятий..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    {/* Event Image Placeholder */}
                    <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center">
                      <div className="text-4xl opacity-30">
                        {event.category === 'Концерт' ? '🎵' : 
                         event.category === 'Театр' ? '🎭' : '😂'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg leading-tight">{event.name}</h3>
                        <span className="text-sm bg-blue-500/20 text-blue-300 rounded-full px-2 py-1">
                          {event.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Дата:</span>
                          <span>{event.date} в {event.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Место:</span>
                          <span className="text-right">{event.venue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Доступно:</span>
                          <span>{event.availableTickets} билетов</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-bold">{event.price} ₽</span>
                        <button
                          onClick={() => handleBuyTickets(event)}
                          disabled={event.availableTickets === 0}
                          className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                          Купить билет
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-tickets' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Мои билеты</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MY_TICKETS.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{ticket.eventName}</h3>
                        <p className="text-gray-400 text-sm">{ticket.date} в {ticket.time}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : ticket.status === 'used'
                          ? 'bg-gray-500/20 text-gray-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {ticket.status === 'active' ? 'Активен' : 
                         ticket.status === 'used' ? 'Использован' : 'Отменен'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Место</div>
                        <div className="font-medium">{ticket.venue}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Место</div>
                        <div className="font-medium">{ticket.section}, {ticket.seat}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Стоимость</div>
                        <div className="font-medium">{ticket.price} ₽</div>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">📱</div>
                        <div className="text-xs text-gray-600">QR-код билета</div>
                        <div className="text-xs text-gray-500 mt-1">{ticket.qrCode}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                        Скачать PDF
                      </button>
                      <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                        Переслать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {MY_TICKETS.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-30">🎫</div>
                <h3 className="text-xl font-semibold mb-2">Билетов пока нет</h3>
                <p className="text-gray-400">
                  Приобретите билеты на интересующие вас мероприятия
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {selectedEvent && paymentStep !== 'select' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {paymentStep === 'details' ? 'Оформление заказа' : 'Подтверждение'}
              </h2>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setPaymentStep('select');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {paymentStep === 'details' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-semibold mb-3">{selectedEvent.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Дата и время</div>
                      <div>{selectedEvent.date} в {selectedEvent.time}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Место</div>
                      <div>{selectedEvent.venue}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Данные для покупки</h4>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Количество билетов</label>
                      <select
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num} билет{num > 1 ? 'а' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email для билетов</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Способ оплаты</h4>
                    
                    <div className="space-y-2">
                      {['💳 Банковская карта', '📱 Apple Pay/Google Pay', '🌐 Интернет-банкинг'].map((method) => (
                        <label key={method} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                          <input type="radio" name="payment" className="text-blue-500" />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>{ticketCount} билет{ticketCount > 1 ? 'а' : ''} × {selectedEvent.price} ₽</span>
                        <span>{selectedEvent.price * ticketCount} ₽</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Итого</span>
                        <span>{selectedEvent.price * ticketCount} ₽</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setPaymentStep('select');
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors"
                  >
                    Оплатить {selectedEvent.price * ticketCount} ₽
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'confirmation' && (
              <div className="text-center space-y-6">
                <div className="text-6xl">🎉</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Оплата прошла успешно!</h3>
                  <p className="text-gray-400">
                    Билеты отправлены на вашу почту. QR-коды также доступны в разделе "Мои билеты".
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 text-sm">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <div className="text-gray-400">Номер заказа</div>
                      <div className="font-mono">TKT-{Date.now()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Сумма</div>
                      <div>{selectedEvent.price * ticketCount} ₽</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setPaymentStep('select');
                      setActiveTab('my-tickets');
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                  >
                    Мои билеты
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setPaymentStep('select');
                    }}
                    className="flex-1 bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors"
                  >
                    На мероприятия
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}