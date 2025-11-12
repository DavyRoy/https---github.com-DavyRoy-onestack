'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  color: string;
}

interface Shift {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'work' | 'vacation' | 'sick';
  notes?: string;
}

const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Анна Смирнова', position: 'Старший барбер', email: 'anna@salon.com', phone: '+7 999 123-45-67', color: 'bg-pink-500' },
  { id: '2', name: 'Мария Иванова', position: 'Мастер маникюра', email: 'maria@salon.com', phone: '+7 999 123-45-68', color: 'bg-purple-500' },
  { id: '3', name: 'Елена Петрова', position: 'Косметолог', email: 'elena@salon.com', phone: '+7 999 123-45-69', color: 'bg-blue-500' },
  { id: '4', name: 'Ольга Сидорова', position: 'Массажист', email: 'olga@salon.com', phone: '+7 999 123-45-70', color: 'bg-green-500' },
];

const SHIFTS: Shift[] = [
  { id: '1', employeeId: '1', date: '2024-11-18', startTime: '09:00', endTime: '18:00', type: 'work' },
  { id: '2', employeeId: '2', date: '2024-11-18', startTime: '10:00', endTime: '19:00', type: 'work' },
  { id: '3', employeeId: '1', date: '2024-11-19', startTime: '09:00', endTime: '18:00', type: 'work' },
  { id: '4', employeeId: '3', date: '2024-11-19', startTime: '11:00', endTime: '20:00', type: 'work' },
  { id: '5', employeeId: '4', date: '2024-11-20', startTime: '09:00', endTime: '18:00', type: 'work' },
  { id: '6', employeeId: '2', date: '2024-11-21', startTime: '10:00', endTime: '19:00', type: 'work' },
  { id: '7', employeeId: '3', date: '2024-11-22', startTime: '11:00', endTime: '20:00', type: 'sick', notes: 'Больничный' },
];

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function StaffRosterPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreatingShift, setIsCreatingShift] = useState(false);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const getShiftsForDay = (employeeId: string, date: Date) => {
    return SHIFTS.filter(shift => 
      shift.employeeId === employeeId && 
      shift.date === date.toISOString().split('T')[0]
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo/services/manager"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад к дашборду
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-semibold">Расписание сотрудников</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsCreatingShift(true)}
                className="bg-green-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-600 transition-colors"
              >
                + Смена
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Экспорт
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                ←
              </button>
              <div className="text-lg font-semibold min-w-[200px] text-center">
                {weekDates[0].toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' })} - 
                {weekDates[6].toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' })}
              </div>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                →
              </button>
            </div>

            <button
              onClick={() => setCurrentWeek(new Date())}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors"
            >
              Сегодня
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                view === 'calendar'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              Календарь
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                view === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              Список
            </button>
          </div>
        </div>

        {view === 'calendar' ? (
          /* Calendar View */
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Header Row */}
            <div className="grid grid-cols-8 border-b border-white/10">
              <div className="p-4 border-r border-white/10"></div>
              {weekDates.map((date, index) => (
                <div key={index} className="p-4 text-center border-r border-white/10 last:border-r-0">
                  <div className="text-sm text-gray-400">{DAYS[index]}</div>
                  <div className="text-lg font-semibold">{date.getDate()}</div>
                </div>
              ))}
            </div>

            {/* Employee Rows */}
            {EMPLOYEES.map((employee) => (
              <div key={employee.id} className="grid grid-cols-8 border-b border-white/10 last:border-b-0">
                {/* Employee Info */}
                <div className="p-4 border-r border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${employee.color}`}></div>
                    <div>
                      <div className="font-semibold">{employee.name}</div>
                      <div className="text-sm text-gray-400">{employee.position}</div>
                    </div>
                  </div>
                </div>

                {/* Shifts for each day */}
                {weekDates.map((date, dayIndex) => {
                  const shifts = getShiftsForDay(employee.id, date);
                  
                  return (
                    <div key={dayIndex} className="p-2 border-r border-white/10 last:border-r-0 min-h-[80px]">
                      {shifts.map((shift) => (
                        <div
                          key={shift.id}
                          className={`p-2 rounded-lg text-xs mb-1 cursor-pointer hover:opacity-80 transition-opacity ${
                            shift.type === 'work' 
                              ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                              : shift.type === 'vacation'
                              ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                              : 'bg-red-500/20 border border-red-500/30 text-red-300'
                          }`}
                        >
                          <div className="font-semibold">
                            {shift.startTime} - {shift.endTime}
                          </div>
                          {shift.notes && (
                            <div className="mt-1 opacity-80">{shift.notes}</div>
                          )}
                        </div>
                      ))}
                      
                      {shifts.length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">
                          —
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {EMPLOYEES.map((employee) => (
              <div key={employee.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${employee.color}`}></div>
                    <div>
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-gray-400 text-sm">{employee.position}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {employee.email} • {employee.phone}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {weekDates.map((date, index) => {
                    const shifts = getShiftsForDay(employee.id, date);
                    
                    return (
                      <div key={index} className="text-center">
                        <div className="text-sm text-gray-400 mb-2">
                          {DAYS[index]} {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {shifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={`text-xs p-1 rounded ${
                                shift.type === 'work' 
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : shift.type === 'vacation'
                                  ? 'bg-green-500/20 text-green-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {shift.startTime}-{shift.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">{EMPLOYEES.length}</div>
            <div className="text-sm text-gray-400">Всего сотрудников</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-gray-400">Смен на неделе</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-gray-400">Отсутствуют</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">86%</div>
            <div className="text-sm text-gray-400">Заполняемость</div>
          </div>
        </div>
      </main>

      {/* Create Shift Modal */}
      {isCreatingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Добавить смену</h2>
              <button
                onClick={() => setIsCreatingShift(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Сотрудник</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Выберите сотрудника</option>
                  {EMPLOYEES.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Дата</label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Тип</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="work">Рабочая</option>
                    <option value="vacation">Отпуск</option>
                    <option value="sick">Больничный</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Начало</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Конец</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Примечания</label>
                <textarea 
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Дополнительная информация..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCreatingShift(false)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
              >
                Отмена
              </button>
              <button className="flex-1 bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}