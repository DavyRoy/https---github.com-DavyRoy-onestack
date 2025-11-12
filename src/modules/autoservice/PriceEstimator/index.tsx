'use client';

import React, { useState } from 'react';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  duration: number;
  selected: boolean;
  partsType?: 'original' | 'analog';
  partsPrice?: number;
}

interface Estimate {
  services: ServiceItem[];
  carBrand: string;
  carModel: string;
  year: number;
  total: number;
  partsTotal: number;
  laborTotal: number;
}

const SERVICE_CATEGORIES = [
  { id: 'diagnostics', name: 'Диагностика', icon: '🔍' },
  { id: 'maintenance', name: 'Техническое обслуживание', icon: '🛠️' },
  { id: 'engine', name: 'Двигатель', icon: '⚙️' },
  { id: 'suspension', name: 'Ходовая часть', icon: '🚗' },
  { id: 'brakes', name: 'Тормозная система', icon: '🛑' },
  { id: 'electrical', name: 'Электрика', icon: '🔌' }
];

const CAR_BRANDS = ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Hyundai'];
const CAR_MODELS: Record<string, string[]> = {
  'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1'],
  'Mercedes': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class']
};

const INITIAL_SERVICES: ServiceItem[] = [
  // Диагностика
  { id: 'diag1', name: 'Компьютерная диагностика', category: 'diagnostics', basePrice: 1500, duration: 1, selected: false },
  { id: 'diag2', name: 'Диагностика подвески', category: 'diagnostics', basePrice: 1200, duration: 1, selected: false },
  
  // ТО
  { id: 'maint1', name: 'Замена масла и фильтра', category: 'maintenance', basePrice: 2500, duration: 1, selected: false, partsType: 'original', partsPrice: 4500 },
  { id: 'maint2', name: 'Замена воздушного фильтра', category: 'maintenance', basePrice: 800, duration: 0.5, selected: false, partsType: 'original', partsPrice: 1200 },
  
  // Двигатель
  { id: 'eng1', name: 'Замена свечей зажигания', category: 'engine', basePrice: 2000, duration: 1, selected: false, partsType: 'original', partsPrice: 3500 },
  { id: 'eng2', name: 'Замена ремня ГРМ', category: 'engine', basePrice: 5000, duration: 3, selected: false, partsType: 'original', partsPrice: 12000 },
  
  // Ходовая
  { id: 'susp1', name: 'Замена амортизаторов', category: 'suspension', basePrice: 4000, duration: 2, selected: false, partsType: 'original', partsPrice: 15000 },
  { id: 'susp2', name: 'Замена шаровых опор', category: 'suspension', basePrice: 2500, duration: 1.5, selected: false, partsType: 'original', partsPrice: 6000 },
  
  // Тормоза
  { id: 'brake1', name: 'Замена тормозных колодок', category: 'brakes', basePrice: 1500, duration: 1, selected: false, partsType: 'original', partsPrice: 8000 },
  { id: 'brake2', name: 'Замена тормозных дисков', category: 'brakes', basePrice: 3000, duration: 2, selected: false, partsType: 'original', partsPrice: 15000 },
];

export default function PriceEstimator() {
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [partsType, setPartsType] = useState<'original' | 'analog'>('original');
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [activeCategory, setActiveCategory] = useState('diagnostics');

  const toggleService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, selected: !service.selected }
        : service
    ));
  };

  const updatePartsType = (serviceId: string, newPartsType: 'original' | 'analog') => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            partsType: newPartsType,
            partsPrice: newPartsType === 'analog' 
              ? (service.partsPrice ? service.partsPrice * 0.6 : 0)
              : service.partsPrice
          }
        : service
    ));
  };

  const selectedServices = services.filter(s => s.selected);
  
  const laborTotal = selectedServices.reduce((sum, service) => sum + service.basePrice, 0);
  const partsTotal = selectedServices.reduce((sum, service) => {
    if (service.partsPrice) {
      return sum + service.partsPrice;
    }
    return sum;
  }, 0);
  
  const total = laborTotal + partsTotal;
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

  const filteredServices = services.filter(service => service.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Car Selection */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Информация об автомобиле</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Марка</label>
            <select 
              value={carBrand}
              onChange={(e) => {
                setCarBrand(e.target.value);
                setCarModel('');
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
            >
              <option value="">Выберите марку</option>
              {CAR_BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Модель</label>
            <select 
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              disabled={!carBrand}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
            >
              <option value="">Выберите модель</option>
              {carBrand && CAR_MODELS[carBrand]?.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Год выпуска</label>
            <input
              type="number"
              value={carYear}
              onChange={(e) => setCarYear(e.target.value)}
              min="1990"
              max={new Date().getFullYear()}
              placeholder="2020"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 placeholder-white/30"
            />
          </div>
        </div>
      </div>

      {/* Parts Type Selection */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Тип запчастей</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPartsType('original')}
            className={`flex-1 py-4 px-6 rounded-xl border transition-all ${
              partsType === 'original'
                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <div className="text-lg mb-1">🛡️</div>
            <div className="font-semibold">Оригинал</div>
            <div className="text-sm opacity-80">Высокое качество</div>
          </button>
          
          <button
            onClick={() => setPartsType('analog')}
            className={`flex-1 py-4 px-6 rounded-xl border transition-all ${
              partsType === 'analog'
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <div className="text-lg mb-1">💰</div>
            <div className="font-semibold">Аналог</div>
            <div className="text-sm opacity-80">Экономия 30-40%</div>
          </button>
        </div>
      </div>

      {/* Services Selection */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Выбор услуг</h2>
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {SERVICE_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                service.selected
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => toggleService(service.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={service.selected}
                    onChange={() => {}}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-white">{service.name}</div>
                    <div className="text-white/60 text-sm">
                      Время: {service.duration} ч • Работы: {service.basePrice.toLocaleString()} ₽
                      {service.partsPrice && ` • Запчасти: ${service.partsPrice.toLocaleString()} ₽`}
                    </div>
                  </div>
                </div>
                
                {service.partsPrice && service.selected && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePartsType(service.id, 'original');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs border ${
                        service.partsType === 'original'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      Оригинал
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePartsType(service.id, 'analog');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs border ${
                        service.partsType === 'analog'
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      Аналог
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Итоговый расчёт</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white/80">Детализация</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-white/60">
                <span>Стоимость работ:</span>
                <span>{laborTotal.toLocaleString()} ₽</span>
              </div>
              
              <div className="flex justify-between text-white/60">
                <span>Стоимость запчастей:</span>
                <span>{partsTotal.toLocaleString()} ₽</span>
              </div>
              
              <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-semibold">
                <span>Итого:</span>
                <span className="text-green-400">{total.toLocaleString()} ₽</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between text-white/60 text-sm">
                <span>Общее время работ:</span>
                <span>{totalDuration} часов</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white/80">Действия</h3>
            
            <button
              disabled={selectedServices.length === 0 || !carBrand || !carModel}
              className="w-full bg-green-500 text-white rounded-xl py-4 font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить на расчёт
            </button>
            
            <button className="w-full bg-white/5 border border-white/10 rounded-xl py-3 font-semibold hover:bg-white/10 transition-colors">
              Сохранить расчёт
            </button>
            
            <button className="w-full bg-white/5 border border-white/10 rounded-xl py-3 font-semibold hover:bg-white/10 transition-colors">
              Распечатать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}