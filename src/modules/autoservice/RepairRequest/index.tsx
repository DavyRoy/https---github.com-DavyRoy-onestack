'use client';

import React, { useState } from 'react';

interface RepairRequestFormData {
  carBrand: string;
  carModel: string;
  licensePlate: string;
  year: string;
  mileage: string;
  problemType: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  contactPhone: string;
  contactEmail: string;
}

const CAR_BRANDS = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota',
  'Honda', 'Ford', 'Hyundai', 'Kia', 'Nissan', 'Skoda', 'Lexus'
];

const PROBLEM_TYPES = [
  'Диагностика',
  'Техническое обслуживание',
  'Ремонт двигателя',
  'Ремонт ходовой части',
  'Ремонт тормозной системы',
  'Ремонт электрики',
  'Кузовной ремонт',
  'Шиномонтаж',
  'Другое'
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function RepairRequestForm() {
  const [formData, setFormData] = useState<RepairRequestFormData>({
    carBrand: '',
    carModel: '',
    licensePlate: '',
    year: '',
    mileage: '',
    problemType: '',
    problemDescription: '',
    preferredDate: '',
    preferredTime: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Заявка принята!</h2>
        <p className="text-white/60 mb-6">
          Мы свяжемся с вами в течение 30 минут для уточнения деталей.
        </p>
        <div className="space-y-2 text-sm text-white/40">
          <p>Номер заявки: #A-2023-{Date.now().toString().slice(-6)}</p>
          <p>Ожидайте звонка по номеру {formData.contactPhone}</p>
        </div>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-6 px-6 py-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors"
        >
          Создать новую заявку
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h2 className="text-2xl font-bold mb-6">Новая заявка на ремонт</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Car Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Марка автомобиля *
            </label>
            <select
              name="carBrand"
              value={formData.carBrand}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="">Выберите марку</option>
              {CAR_BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Модель *
            </label>
            <input
              type="text"
              name="carModel"
              value={formData.carModel}
              onChange={handleChange}
              required
              placeholder="Например: X5, Camry, Golf"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder-white/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Госномер *
            </label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              required
              placeholder="А123БВ777"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder-white/30 uppercase"
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Год выпуска *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1990"
              max={new Date().getFullYear()}
              placeholder="2020"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder-white/30"
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Пробег (км) *
            </label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              required
              placeholder="75000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder-white/30"
            />
          </div>
        </div>

        {/* Problem Information */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Тип проблемы *
          </label>
          <select
            name="problemType"
            value={formData.problemType}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="">Выберите тип проблемы</option>
            {PROBLEM_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Описание проблемы *
          </label>
          <textarea
            name="problemDescription"
            value={formData.problemDescription}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Подробно опишите симптомы проблемы, когда появилась, при каких условиях проявляется..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder-white/30 resize-none"
          />
        </div>

        {/* Preferred Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Предпочтительная дата *
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Предпочтительное время *
            </label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="">Выберите время</option>
              {TIME_SLOTS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Телефон для связи *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              placeholder="+7 (999) 123-45-67"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder-white/30"
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email для уведомлений
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="example@mail.ru"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder-white/30"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-white text-black rounded-xl py-4 font-semibold hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Отправка...
              </div>
            ) : (
              'Отправить заявку'
            )}
          </button>
          
          <button
            type="button"
            className="px-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            Очистить
          </button>
        </div>
      </form>
    </div>
  );
}