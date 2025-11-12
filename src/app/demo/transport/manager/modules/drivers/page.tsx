'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Driver {
  id: string;
  name: string;
  license: string;
  status: 'active' | 'vacation' | 'sick' | 'inactive';
  vehicle: string;
  route: string;
  shift: string;
  phone: string;
  experience: string;
  rating: number;
  lastMedicalCheck: string;
  nextMedicalCheck: string;
}

export default function DriversPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'vacation' | 'sick'>('all');

  const drivers: Driver[] = [
    {
      id: '1',
      name: 'Иванов Петр Сергеевич',
      license: 'AB123456',
      status: 'active',
      vehicle: 'А123БВ',
      route: '101А Москва-СПб',
      shift: '08:00-20:00',
      phone: '+7 (999) 123-45-67',
      experience: '8 лет',
      rating: 4.8,
      lastMedicalCheck: '2024-01-10',
      nextMedicalCheck: '2024-07-10'
    },
    {
      id: '2',
      name: 'Петров Алексей Владимирович',
      license: 'CD789012',
      status: 'active',
      vehicle: 'В456ГД',
      route: '202Б Москва-НН',
      shift: '06:00-18:00',
      phone: '+7 (999) 234-56-78',
      experience: '5 лет',
      rating: 4.6,
      lastMedicalCheck: '2024-01-08',
      nextMedicalCheck: '2024-07-08'
    },
    {
      id: '3',
      name: 'Сидоров Михаил Константинович',
      license: 'EF345678',
      status: 'sick',
      vehicle: '-',
      route: '303В Москва-Казань',
      shift: '09:00-21:00',
      phone: '+7 (999) 345-67-89',
      experience: '12 лет',
      rating: 4.9,
      lastMedicalCheck: '2023-12-20',
      nextMedicalCheck: '2024-06-20'
    },
    {
      id: '4',
      name: 'Кузнецов Дмитрий Андреевич',
      license: 'GH901234',
      status: 'vacation',
      vehicle: '-',
      route: '101А Москва-СПб',
      shift: '10:00-22:00',
      phone: '+7 (999) 456-78-90',
      experience: '3 года',
      rating: 4.4,
      lastMedicalCheck: '2023-12-15',
      nextMedicalCheck: '2024-06-15'
    }
  ];

  const filteredDrivers = drivers.filter(driver => 
    filter === 'all' || driver.status === filter
  );

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    onVacation: drivers.filter(d => d.status === 'vacation').length,
    sick: drivers.filter(d => d.status === 'sick').length
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo/transport/manager" className="text-gray-400 hover:text-white transition-colors">
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Управление водителями</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                График смен
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm">
                + Добавить водителя
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">{stats.total}</div>
              <div className="text-sm text-gray-400">Всего водителей</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400 mb-2">{stats.active}</div>
              <div className="text-sm text-gray-400">На смене</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.onVacation}</div>
              <div className="text-sm text-gray-400">В отпуске</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-red-400 mb-2">{stats.sick}</div>
              <div className="text-sm text-gray-400">На больничном</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex bg-white/5 rounded-xl p-1">
              {(['all', 'active', 'vacation', 'sick'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    filter === status ? 'bg-blue-500 text-white' : 'text-gray-400'
                  }`}
                >
                  {status === 'all' ? 'Все' : 
                   status === 'active' ? 'На смене' :
                   status === 'vacation' ? 'Отпуск' : 'Больничный'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Drivers Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map(driver => (
              <div
                key={driver.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg">
                      👨‍✈️
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{driver.name}</h3>
                      <div className="text-sm text-gray-400">Водительское удостоверение: {driver.license}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    driver.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    driver.status === 'vacation' ? 'bg-yellow-500/20 text-yellow-400