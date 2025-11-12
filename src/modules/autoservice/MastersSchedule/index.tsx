'use client';

import React, { useState } from 'react';

interface ScheduleSlot {
  id: string;
  master: string;
  car: string;
  service: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  box: number;
  client: string;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const MASTERS = ['Иван Петров', 'Алексей Смирнов', 'Михаил Козлов', 'Дмитрий Новиков'];
const BOXES = [1, 2, 3, 4, 5];

const SAMPLE_SLOTS: ScheduleSlot[] = [
  {
    id: '1',
    master: 'Иван Петров',
    car: 'BMW X5',
    service: 'Замена масла',
    startTime: '09:00',
    endTime: '10:00',
    status: 'scheduled',
    box: 1,
    client: 'Александр П.'
  },
  {
    id: '2',
    master: 'Алексей Смирнов',
    car: 'Audi Q7',
    service: 'Диагностика подвески',
    startTime: '10:00',
    endTime: '12:00',
    status: 'in_progress',
    box: 2,
    client: 'Мария С.'
  },
  {
    id: '3',
    master: 'Михаил Козлов',
    car: 'Mercedes GLE',
    service: 'Замена тормозных колодок',
    startTime: '11:00',
    endTime: '13:00',
    status: 'scheduled',
    box: 3,
    client: 'Дмитрий И.'
  },
  {
    id: '4',
    master: 'Иван Петров',
    car: 'Toyota Camry',
    service: 'Плановое ТО',
    startTime: '14:00',
    endTime: '16:00',
    status: 'scheduled',
    box: 1,
    client: 'Ольга К.'
  }
];

export default function MastersSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedMaster, setSelectedMaster] = useState('Все');
  const [selectedBox, setSelectedBox] = useState('Все');

  const getStatusColor = (status: ScheduleSlot['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in_progress': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  const getSlotPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const duration = (endHour - startHour) + (parseInt(endTime.split(':')[1]) - startMinute) / 60;
    
    const startPosition = ((startHour - 8) * 60 + startMinute) / 60 * 80; // 80px per hour
    const height = duration * 80;
    
    return { top: startPosition, height };
  };

  const filteredSlots = SAMPLE_SLOTS.filter(slot => {
    const matchesMaster = selectedMaster === 'Все' || slot.master === selectedMaster;
    const matchesBox = selectedBox === 'Все' || slot.box.toString() === selectedBox;
    return matchesMaster && matchesBox;
  });

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              ←
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30"
            />
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              →
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                view === 'day' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              День
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                view === 'week' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Неделя
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Filters */}
          <select
            value={selectedMaster}
            onChange={(e) => setSelectedMaster(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30"
          >
            <option value="Все">Все мастера</option>
            {MASTERS.map(master => (
              <option key={master} value={master}>{master}</option>
            ))}
          </select>

          <select
            value={selectedBox}
            onChange={(e) => setSelectedBox(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30"
          >
            <option value="Все">Все боксы</option>
            {BOXES.map(box => (
              <option key={box} value={box.toString()}>Бокс {box}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="relative">
        {/* Time Labels */}
        <div className="flex">
          <div className="w-24 flex-shrink-0">
            {/* Empty corner */}
          </div>
          <div className="flex-1 grid grid-cols-5 gap-4 mb-4">
            {MASTERS.map(master => (
              <div key={master} className="text-center text-white/60 text-sm font-medium py-2">
                {master}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Body */}
        <div className="flex">
          {/* Time Column */}
          <div className="w-24 flex-shrink-0">
            {TIME_SLOTS.map(time => (
              <div key={time} className="h-20 border-b border-white/10 flex items-start justify-end pr-2">
                <span className="text-white/40 text-sm mt-1">{time}</span>
              </div>
            ))}
          </div>

          {/* Schedule Columns */}
          <div className="flex-1 grid grid-cols-5 gap-4 relative">
            {/* Grid Lines */}
            {TIME_SLOTS.map((time, index) => (
              <div
                key={time}
                className="absolute left-0 right-0 border-b border-white/5"
                style={{ top: `${index * 80}px`, height: '1px' }}
              />
            ))}

            {/* Master Columns */}
            {MASTERS.map((master, masterIndex) => (
              <div key={master} className="relative">
                {/* Slots */}
                {filteredSlots
                  .filter(slot => slot.master === master)
                  .map(slot => {
                    const position = getSlotPosition(slot.startTime, slot.endTime);
                    return (
                      <div
                        key={slot.id}
                        className={`absolute left-1 right-1 rounded-lg border p-2 cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(slot.status)}`}
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          minHeight: '40px'
                        }}
                      >
                        <div className="text-xs font-medium truncate">{slot.car}</div>
                        <div className="text-xs opacity-80 truncate">{slot.service}</div>
                        <div className="text-xs opacity-60 mt-1">
                          {slot.startTime}-{slot.endTime}
                        </div>
                        <div className="text-xs opacity-60">Бокс {slot.box}</div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" />
          <span className="text-white/60 text-sm">Запланировано</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/30" />
          <span className="text-white/60 text-sm">В работе</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
          <span className="text-white/60 text-sm">Завершено</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredSlots.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-white/60">На выбранную дату нет запланированных работ</p>
        </div>
      )}
    </div>
  );
}