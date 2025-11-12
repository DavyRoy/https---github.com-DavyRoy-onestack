'use client';

import React, { useState } from 'react';
import { OrderFormData } from './types';

// Step Components
function SenderStep({ data, onChange, onNext, onBack, isFirst }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Данные отправителя</h2>
        <p className="text-gray-400">Укажите информацию о том, кто отправляет груз</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">ФИО отправителя *</label>
          <input
            type="text"
            value={data.senderName}
            onChange={(e) => onChange({ ...data, senderName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Иванов Иван Иванович"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Телефон *</label>
          <input
            type="tel"
            value={data.senderPhone}
            onChange={(e) => onChange({ ...data, senderPhone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="+7 912 345-67-89"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-white">Адрес забора груза *</label>
          <textarea
            value={data.senderAddress}
            onChange={(e) => onChange({ ...data, senderAddress: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            placeholder="г. Москва, ул. Тверская, д. 1, кв. 10"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        {!isFirst && (
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
          >
            Назад
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!data.senderName || !data.senderPhone || !data.senderAddress}
          className="ml-auto px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}

function ReceiverStep({ data, onChange, onNext, onBack }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Данные получателя</h2>
        <p className="text-gray-400">Укажите информацию о том, кому доставить груз</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">ФИО получателя *</label>
          <input
            type="text"
            value={data.receiverName}
            onChange={(e) => onChange({ ...data, receiverName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Петров Петр Петрович"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Телефон *</label>
          <input
            type="tel"
            value={data.receiverPhone}
            onChange={(e) => onChange({ ...data, receiverPhone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="+7 912 345-67-90"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-white">Адрес доставки *</label>
          <textarea
            value={data.receiverAddress}
            onChange={(e) => onChange({ ...data, receiverAddress: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            placeholder="г. Москва, ул. Арбат, д. 25, кв. 5"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
        >
          Назад
        </button>
        <button
          onClick={onNext}
          disabled={!data.receiverName || !data.receiverPhone || !data.receiverAddress}
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}

function CargoStep({ data, onChange, onNext, onBack }: any) {
  const cargoTypes = [
    'Документы',
    'Одежда',
    'Электроника',
    'Продукты',
    'Хрупкие предметы',
    'Мебель',
    'Другое'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Информация о грузе</h2>
        <p className="text-gray-400">Опишите что и в каком количестве нужно доставить</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Тип груза *</label>
          <select
            value={data.cargoType}
            onChange={(e) => onChange({ ...data, cargoType: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            <option value="">Выберите тип</option>
            {cargoTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Вес, кг *</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={data.weight}
            onChange={(e) => onChange({ ...data, weight: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="0.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Объём, м³</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={data.volume}
            onChange={(e) => onChange({ ...data, volume: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="0.1"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Срочность *</label>
          <select
            value={data.urgency}
            onChange={(e) => onChange({ ...data, urgency: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            <option value="standard">Стандарт (1-2 дня)</option>
            <option value="express">Экспресс (до 24 часов)</option>
            <option value="same_day">В течение дня</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-white">Описание груза</label>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            placeholder="Подробное описание содержимого..."
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
        >
          Назад
        </button>
        <button
          onClick={onNext}
          disabled={!data.cargoType || !data.weight || !data.urgency}
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}

function ServicesStep({ data, onChange, onNext, onBack }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Дополнительные услуги</h2>
        <p className="text-gray-400">Выберите дополнительные опции для вашей доставки</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="space-y-1">
            <div className="font-medium text-white">Страхование груза</div>
            <div className="text-sm text-gray-400">Защита от повреждения или утери</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.insurance}
              onChange={(e) => onChange({ ...data, insurance: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {data.insurance && (
          <div className="ml-8 space-y-2">
            <label className="text-sm font-medium text-white">Стоимость груза для страхования</label>
            <input
              type="number"
              value={data.insuranceValue || ''}
              onChange={(e) => onChange({ ...data, insuranceValue: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="10000"
            />
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="space-y-1">
            <div className="font-medium text-white">Доставка до двери</div>
            <div className="text-sm text-gray-400">Подъем на этаж и передача в руки</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.doorDelivery}
              onChange={(e) => onChange({ ...data, doorDelivery: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="space-y-1">
            <div className="font-medium text-white">Сборка мебели</div>
            <div className="text-sm text-gray-400">Распаковка и сборка на месте</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.assemblyRequired}
              onChange={(e) => onChange({ ...data, assemblyRequired: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
        >
          Назад
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
        >
          Рассчитать стоимость
        </button>
      </div>
    </div>
  );
}

function SummaryStep({ data, onBack, onSubmit }: any) {
  const calculateCost = () => {
    let baseCost = 300;
    if (data.urgency === 'express') baseCost *= 1.5;
    if (data.urgency === 'same_day') baseCost *= 2;
    if (data.weight > 5) baseCost += (data.weight - 5) * 50;
    if (data.insurance && data.insuranceValue) baseCost += data.insuranceValue * 0.01;
    if (data.doorDelivery) baseCost += 200;
    if (data.assemblyRequired) baseCost += 500;
    
    return Math.round(baseCost);
  };

  const cost = calculateCost();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Подтверждение заказа</h2>
        <p className="text-gray-400">Проверьте информацию перед оформлением</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Отправитель</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ФИО:</span>
                <span className="text-white">{data.senderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Телефон:</span>
                <span className="text-white">{data.senderPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Адрес:</span>
                <span className="text-white text-right">{data.senderAddress}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Получатель</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ФИО:</span>
                <span className="text-white">{data.receiverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Телефон:</span>
                <span className="text-white">{data.receiverPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Адрес:</span>
                <span className="text-white text-right">{data.receiverAddress}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Груз</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Тип:</span>
                <span className="text-white">{data.cargoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Вес:</span>
                <span className="text-white">{data.weight} кг</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Объём:</span>
                <span className="text-white">{data.volume} м³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Срочность:</span>
                <span className="text-white">
                  {data.urgency === 'standard' && 'Стандарт'}
                  {data.urgency === 'express' && 'Экспресс'}
                  {data.urgency === 'same_day' && 'В течение дня'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Услуги</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Страхование:</span>
                <span className="text-white">{data.insurance ? 'Да' : 'Нет'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">До двери:</span>
                <span className="text-white">{data.doorDelivery ? 'Да' : 'Нет'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Сборка:</span>
                <span className="text-white">{data.assemblyRequired ? 'Да' : 'Нет'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span className="text-white">Итого к оплате:</span>
          <span className="text-blue-400">{cost} ₽</span>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
        >
          Назад
        </button>
        <button
          onClick={onSubmit}
          className="px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-colors duration-200 font-semibold"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function OrderPlacement() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    cargoType: '',
    weight: 0,
    volume: 0,
    deliveryDate: '',
    deliveryWindow: '09:00-18:00',
    urgency: 'standard',
    insurance: false,
    doorDelivery: false,
    assemblyRequired: false,
  });

  const steps = [
    { title: 'Отправитель', component: SenderStep },
    { title: 'Получатель', component: ReceiverStep },
    { title: 'Груз', component: CargoStep },
    { title: 'Услуги', component: ServicesStep },
    { title: 'Подтверждение', component: SummaryStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Здесь будет логика отправки заказа
    alert('Заказ успешно создан! Номер заказа: ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    // Сброс формы
    setFormData({
      senderName: '',
      senderPhone: '',
      senderAddress: '',
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      cargoType: '',
      weight: 0,
      volume: 0,
      deliveryDate: '',
      deliveryWindow: '09:00-18:00',
      urgency: 'standard',
      insurance: false,
      doorDelivery: false,
      assemblyRequired: false,
    });
    setCurrentStep(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-2 transition-colors duration-300 ${
                    index <= currentStep ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 transition-colors duration-300 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <CurrentStepComponent
          data={formData}
          onChange={setFormData}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 1}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}