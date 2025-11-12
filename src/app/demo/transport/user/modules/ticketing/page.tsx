'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seat: string;
  status: 'active' | 'used' | 'cancelled';
  qrCode: string;
  carrier: string;
  number: string;
}

export default function TicketingPage() {
  const [step, setStep] = useState<'select' | 'passenger' | 'payment' | 'ticket'>('select');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [passengerData, setPassengerData] = useState({
    name: '',
    document: '',
    phone: '',
    email: ''
  });
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      from: 'Москва',
      to: 'Санкт-Петербург',
      date: '2024-01-20',
      time: '08:00',
      price: 2500,
      seat: '12A',
      status: 'active',
      qrCode: 'demo-qr-123',
      carrier: 'Газпромтранс',
      number: '101А'
    }
  ]);

  const availableTrips = [
    {
      id: '1',
      from: 'Москва',
      to: 'Санкт-Петербург',
      date: '2024-01-20',
      time: '08:00',
      price: 2500,
      duration: '8ч 30м',
      carrier: 'Газпромтранс',
      number: '101А',
      freeSeats: 12
    },
    {
      id: '2',
      from: 'Москва',
      to: 'Санкт-Петербург',
      date: '2024-01-20',
      time: '10:30',
      price: 2100,
      duration: '8ч 45м',
      carrier: 'Экспресс-Линии',
      number: '202Б',
      freeSeats: 6
    }
  ];

  const handleTripSelect = (trip: any) => {
    setSelectedTrip(trip);
    setStep('passenger');
  };

  const handlePassengerSubmit = () => {
    setStep('payment');
  };

  const handlePayment = () => {
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      from: selectedTrip.from,
      to: selectedTrip.to,
      date: selectedTrip.date,
      time: selectedTrip.time,
      price: selectedTrip.price,
      seat: '15B',
      status: 'active',
      qrCode: `demo-${Math.random().toString(36).substr(2, 9)}`,
      carrier: selectedTrip.carrier,
      number: selectedTrip.number
    };
    setTickets(prev => [newTicket, ...prev]);
    setStep('ticket');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo/transport/user" className="text-gray-400 hover:text-white transition-colors">
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Покупка билета</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${step === 'select' ? 'bg-blue-500' : 'bg-white/20'}`} />
              <div className={`w-3 h-3 rounded-full ${step === 'passenger' ? 'bg-blue-500' : 'bg-white/20'}`} />
              <div className={`w-3 h-3 rounded-full ${step === 'payment' ? 'bg-blue-500' : 'bg-white/20'}`} />
              <div className={`w-3 h-3 rounded-full ${step === 'ticket' ? 'bg-blue-500' : 'bg-white/20'}`} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {step === 'select' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Выберите рейс</h1>
              <p className="text-gray-400">Найдите подходящий маршрут и время отправления</p>
            </div>

            <div className="space-y-4">
              {availableTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-3xl">🚌</div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{trip.time}</div>
                          <div className="text-sm text-gray-400">{trip.from}</div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-gray-400">{trip.duration}</div>
                          <div className="w-24 h-px bg-white/20 my-2" />
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {new Date(trip.date + 'T' + trip.time).getHours() + 8}:30
                          </div>
                          <div className="text-sm text-gray-400">{trip.to}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{trip.price} ₽</div>
                        <div className="text-sm text-green-400">{trip.freeSeats} мест</div>
                      </div>
                      
                      <button 
                        onClick={() => handleTripSelect(trip)}
                        className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium"
                      >
                        Выбрать
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                    <span className="text-sm text-gray-400">№ {trip.number}</span>
                    <span className="text-sm text-gray-400">{trip.carrier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'passenger' && selectedTrip && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Данные пассажира</h1>
              <p className="text-gray-400">Заполните информацию для оформления билета</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ФИО пассажира</label>
                  <input
                    type="text"
                    value={passengerData.name}
                    onChange={(e) => setPassengerData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Документ</label>
                  <input
                    type="text"
                    value={passengerData.document}
                    onChange={(e) => setPassengerData(prev => ({ ...prev, document: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Паспорт РФ"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={passengerData.phone}
                    onChange={(e) => setPassengerData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={passengerData.email}
                    onChange={(e) => setPassengerData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="ivanov@example.com"
                  />
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold">Итого: {selectedTrip.price} ₽</div>
                    <div className="text-sm text-gray-400">{selectedTrip.from} → {selectedTrip.to}</div>
                  </div>
                  <button
                    onClick={handlePassengerSubmit}
                    className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium"
                  >
                    Перейти к оплате
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && selectedTrip && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Оплата билета</h1>
              <p className="text-gray-400">Выберите способ оплаты</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      💳
                    </div>
                    <div>
                      <div className="font-semibold text-white">Банковская карта</div>
                      <div className="text-sm text-gray-400">Visa, Mastercard, Мир</div>
                    </div>
                  </div>
                </button>
                
                <button className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <div className="font-semibold text-white">Электронный кошелёк</div>
                      <div className="text-sm text-gray-400">ЮMoney, Qiwi</div>
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <h3 className="font-semibold mb-4">Детали поездки</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Маршрут:</span>
                    <span>{selectedTrip.from} → {selectedTrip.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Дата и время:</span>
                    <span>{selectedTrip.date} в {selectedTrip.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Пассажир:</span>
                    <span>{passengerData.name}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-white/10">
                    <span>К оплате:</span>
                    <span>{selectedTrip.price} ₽</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium text-lg"
              >
                Оплатить {selectedTrip.price} ₽
              </button>
            </div>
          </div>
        )}

        {step === 'ticket' && tickets[0] && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Билет оформлен!</h1>
              <p className="text-gray-400">Ваш электронный билет готов</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center text-4xl mb-4">
                  🎫
                </div>
                <div className="text-sm text-gray-400">QR-код: {tickets[0].qrCode}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold mb-4">Информация о поездке</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Маршрут:</span>
                      <span>{tickets[0].from} → {tickets[0].to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Дата:</span>
                      <span>{tickets[0].date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Время:</span>
                      <span>{tickets[0].time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Место:</span>
                      <span>{tickets[0].seat}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Информация о пассажире</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ФИО:</span>
                      <span>{passengerData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Документ:</span>
                      <span>{passengerData.document}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Перевозчик:</span>
                      <span>{tickets[0].carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Рейс:</span>
                      <span>№ {tickets[0].number}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  Скачать PDF
                </button>
                <button 
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium"
                >
                  Купить ещё билет
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}