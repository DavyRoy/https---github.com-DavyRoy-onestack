'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
}

const SERVICES: Service[] = [
  { id: '1', name: 'Стрижка мужская', duration: 60, price: 1500, category: 'Парикмахерская' },
  { id: '2', name: 'Стрижка женская', duration: 90, price: 2500, category: 'Парикмахерская' },
  { id: '3', name: 'Маникюр классический', duration: 60, price: 1200, category: 'Ногтевой сервис' },
  { id: '4', name: 'Спа-процедура', duration: 120, price: 3500, category: 'Уход' },
];

const TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '09:00', available: true, price: 0 },
  { id: '2', time: '10:00', available: true, price: 0 },
  { id: '3', time: '11:00', available: false, price: 0 },
  { id: '4', time: '12:00', available: true, price: 0 },
  { id: '5', time: '13:00', available: true, price: 0 },
  { id: '6', time: '14:00', available: true, price: 0 },
  { id: '7', time: '15:00', available: false, price: 0 },
  { id: '8', time: '16:00', available: true, price: 0 },
];

export default function BookingPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleBooking = () => {
    // Mock booking logic
    setTimeout(() => {
      alert('Бронь успешно создана!');
      router.push('/demo/services/user');
    }, 1000);
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
              <h1 className="text-xl font-semibold">Онлайн-бронирование</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= stepNumber 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                <span className={`text-sm ${
                  step >= stepNumber ? 'text-white' : 'text-gray-400'
                }`}>
                  {stepNumber === 1 && 'Услуга'}
                  {stepNumber === 2 && 'Время'}
                  {stepNumber === 3 && 'Подтверждение'}
                </span>
                {stepNumber < 3 && (
                  <div className="w-12 h-px bg-white/20 ml-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Выберите услугу</h2>
              <p className="text-gray-400">Выберите категорию и конкретную услугу</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                    selectedService?.id === service.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{service.duration} мин</span>
                      <span>{service.price} ₽</span>
                    </div>
                    <div className="text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1 inline-block">
                      {service.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedService}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                Далее: Выбор времени
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Выберите дату и время</h2>
              <p className="text-gray-400">Доступные слоты для {selectedService?.name}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-4 gap-4">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedTime(slot)}
                    disabled={!slot.available}
                    className={`p-4 rounded-xl text-center transition-all duration-300 ${
                      selectedTime?.id === slot.id
                        ? 'bg-blue-500 text-white'
                        : slot.available
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-white/5 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium">{slot.time}</div>
                    {!slot.available && (
                      <div className="text-xs mt-1">Занято</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedTime}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                Далее: Подтверждение
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && selectedService && selectedTime && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Подтверждение брони</h2>
              <p className="text-gray-400">Проверьте детали вашей записи</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Услуга</div>
                  <div className="font-medium">{selectedService.name}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Время</div>
                  <div className="font-medium">{selectedTime.time}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Длительность</div>
                  <div className="font-medium">{selectedService.duration} минут</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Стоимость</div>
                  <div className="font-medium">{selectedService.price} ₽</div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Итого к оплате</span>
                  <span>{selectedService.price} ₽</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={handleBooking}
                className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                Подтвердить бронь
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}