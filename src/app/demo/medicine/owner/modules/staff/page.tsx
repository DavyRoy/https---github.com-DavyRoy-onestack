'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Mock данные
const staffMembers = [
  {
    id: 1,
    firstName: 'Александр',
    lastName: 'Петров',
    role: 'doctor',
    specialization: 'Терапевт',
    department: 'Терапия',
    email: 'a.petrov@clinic.ru',
    phone: '+7 (912) 345-67-89',
    hireDate: '2020-03-15',
    salary: 120000,
    status: 'active',
    employeeId: 'DOC-001',
    permissions: ['patients:read', 'patients:write', 'appointments:manage'],
    performance: {
      appointments: 186,
      satisfaction: 4.8,
      efficiency: 94,
      attendance: 98,
      revenue: 856200
    }
  },
  {
    id: 2,
    firstName: 'Мария',
    lastName: 'Сидорова',
    role: 'doctor',
    specialization: 'Кардиолог',
    department: 'Кардиология',
    email: 'm.sidorova@clinic.ru',
    phone: '+7 (912) 345-67-90',
    hireDate: '2019-07-22',
    salary: 150000,
    status: 'active',
    employeeId: 'DOC-002',
    permissions: ['patients:read', 'patients:write', 'appointments:manage', 'diagnostics:order'],
    performance: {
      appointments: 124,
      satisfaction: 4.9,
      efficiency: 96,
      attendance: 99,
      revenue: 985400
    }
  },
  {
    id: 3,
    firstName: 'Елена',
    lastName: 'Иванова',
    role: 'nurse',
    specialization: 'Старшая медсестра',
    department: 'Терапия',
    email: 'e.ivanova@clinic.ru',
    phone: '+7 (912) 345-67-91',
    hireDate: '2021-01-10',
    salary: 65000,
    status: 'active',
    employeeId: 'NUR-001',
    permissions: ['patients:read', 'procedures:perform'],
    performance: {
      appointments: 342,
      satisfaction: 4.7,
      efficiency: 88,
      attendance: 95,
      revenue: 456200
    }
  },
  {
    id: 4,
    firstName: 'Дмитрий',
    lastName: 'Козлов',
    role: 'technician',
    specialization: 'Лаборант',
    department: 'Лаборатория',
    email: 'd.kozlov@clinic.ru',
    phone: '+7 (912) 345-67-92',
    hireDate: '2022-05-20',
    salary: 55000,
    status: 'active',
    employeeId: 'TEC-001',
    permissions: ['lab:tests', 'equipment:maintain'],
    performance: {
      appointments: 215,
      satisfaction: 4.6,
      efficiency: 92,
      attendance: 97,
      revenue: 324100
    }
  },
  {
    id: 5,
    firstName: 'Сергей',
    lastName: 'Николаев',
    role: 'administrator',
    specialization: 'Администратор',
    department: 'Регистратура',
    email: 's.nikolaev@clinic.ru',
    phone: '+7 (912) 345-67-93',
    hireDate: '2020-11-05',
    salary: 48000,
    status: 'vacation',
    employeeId: 'ADM-001',
    permissions: ['appointments:schedule', 'patients:register'],
    performance: {
      appointments: 428,
      satisfaction: 4.8,
      efficiency: 89,
      attendance: 93,
      revenue: 1256800
    }
  },
  {
    id: 6,
    firstName: 'Анна',
    lastName: 'Орлова',
    role: 'doctor',
    specialization: 'Стоматолог',
    department: 'Стоматология',
    email: 'a.orlova@clinic.ru',
    phone: '+7 (912) 345-67-94',
    hireDate: '2021-09-12',
    salary: 110000,
    status: 'sick',
    employeeId: 'DOC-003',
    permissions: ['patients:read', 'patients:write', 'appointments:manage', 'procedures:perform'],
    performance: {
      appointments: 98,
      satisfaction: 4.9,
      efficiency: 91,
      attendance: 96,
      revenue: 418900
    }
  }
];

const departments = [
  { id: 1, name: 'Терапия', staffCount: 8, head: 'Петров А.В.', location: 'Этаж 2, каб. 201-208', budget: 2500000 },
  { id: 2, name: 'Кардиология', staffCount: 6, head: 'Сидорова М.И.', location: 'Этаж 3, каб. 301-306', budget: 1800000 },
  { id: 3, name: 'Хирургия', staffCount: 5, head: 'Козлов Д.Н.', location: 'Этаж 4, каб. 401-405', budget: 3200000 },
  { id: 4, name: 'Лаборатория', staffCount: 4, head: 'Иванова Е.С.', location: 'Этаж 1, каб. 101-104', budget: 950000 },
  { id: 5, name: 'Регистратура', staffCount: 3, head: 'Николаев С.П.', location: 'Этаж 1, холл', budget: 450000 }
];

export default function StaffPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredStaff = useMemo(() => 
    staffMembers.filter(staff => {
      const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
      const matchesRole = selectedRole === 'all' || staff.role === selectedRole;
      const matchesSearch = staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDepartment && matchesRole && matchesSearch;
    }),
    [selectedDepartment, selectedRole, searchTerm]
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'administrator': return '💼';
      case 'technician': return '🔧';
      case 'manager': return '👔';
      default: return '👤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'vacation': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'sick': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'vacation': return 'Отпуск';
      case 'sick': return 'Больничный';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    if (!isClient) return `${amount} ₽`;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₽', '₽');
  };

  const formatDate = (dateString: string) => {
    if (!isClient) return dateString;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  // Статистика персонала
  const staffStats = useMemo(() => [
    {
      title: 'Всего сотрудников',
      value: staffMembers.length,
      icon: '👥',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Врачи',
      value: staffMembers.filter(s => s.role === 'doctor').length,
      icon: '👨‍⚕️',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Медсёстры',
      value: staffMembers.filter(s => s.role === 'nurse').length,
      icon: '👩‍⚕️',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Активные',
      value: staffMembers.filter(s => s.status === 'active').length,
      icon: '✅',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'В отпуске',
      value: staffMembers.filter(s => s.status === 'vacation').length,
      icon: '🏖️',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'На больничном',
      value: staffMembers.filter(s => s.status === 'sick').length,
      icon: '🏥',
      color: 'from-red-500 to-pink-500'
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl lg:text-3xl">
                👥
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Управление сотрудниками
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  Персонал, роли и расписание работы медицинской клиники
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>📊</span>
                <span>Отчёт</span>
              </motion.button>
              <motion.button 
                onClick={() => setIsAddingStaff(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>+</span>
                <span>Добавить сотрудника</span>
              </motion.button>
              <Link
                href="/demo/medicine/owner"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Назад</span>
              </Link>
            </div>
          </div>

          {/* Staff Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
            {staffStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-3 lg:p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white/60 text-xs lg:text-sm font-medium truncate">
                      {stat.title}
                    </h3>
                    <p className="text-lg lg:text-xl font-bold text-white mt-1 truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`text-xl lg:text-2xl ml-2 group-hover:scale-110 transition-transform duration-200 ${
                    stat.color.includes('blue') ? 'text-blue-400' :
                    stat.color.includes('green') ? 'text-green-400' :
                    stat.color.includes('purple') ? 'text-purple-400' :
                    stat.color.includes('yellow') ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4 mb-4 lg:mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">Все отделения</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">Все роли</option>
              <option value="doctor">Врачи</option>
              <option value="nurse">Медсёстры</option>
              <option value="administrator">Администраторы</option>
              <option value="technician">Техники</option>
              <option value="manager">Менеджеры</option>
            </select>
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по имени, фамилии или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 placeholder-white/40"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {filteredStaff.map((staff, index) => (
                <motion.div
                  key={staff.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedStaff(staff)}
                  className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer group backdrop-blur-sm"
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center text-xl lg:text-2xl">
                          {getRoleIcon(staff.role)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-base lg:text-lg truncate">
                            {staff.firstName} {staff.lastName}
                          </h3>
                          <p className="text-white/60 text-sm truncate">
                            {staff.specialization || staff.role} • {staff.department}
                          </p>
                          <p className="text-white/40 text-xs truncate">{staff.employeeId}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(staff.status)}`}>
                          {getStatusText(staff.status)}
                        </span>
                        <div className="text-white/60 text-sm">
                          {formatCurrency(staff.salary)}
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4">
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <div className="text-white font-medium text-base lg:text-lg">
                          {staff.performance.appointments}
                        </div>
                        <div className="text-white/60 text-xs">Приёмов</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <div className="text-white font-medium text-base lg:text-lg">
                          {staff.performance.satisfaction}/5
                        </div>
                        <div className="text-white/60 text-xs">Удовлетворённость</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-white/60 text-xs lg:text-sm">
                        Начало работы: {formatDate(staff.hireDate)}
                      </div>
                      <div className="text-white/60 group-hover:text-white transition-colors text-xs lg:text-sm">
                        Подробнее →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredStaff.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-2 text-center py-8 lg:py-12"
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center text-xl lg:text-2xl mb-4 mx-auto">
                    👥
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-2">Сотрудники не найдены</h3>
                  <p className="text-white/60 text-sm">Попробуйте изменить параметры поиска или фильтрации</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Departments Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 p-4 lg:p-6 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>🏢</span>
                Отделения
              </h3>
              <div className="space-y-3">
                {departments.map((dept, index) => (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-white font-medium text-sm">{dept.name}</div>
                      <div className="text-white/60 text-xs">{dept.staffCount} чел.</div>
                    </div>
                    <div className="text-white/60 text-xs">
                      {dept.head} • {dept.location}
                    </div>
                    <div className="text-white/40 text-xs mt-1">
                      Бюджет: {formatCurrency(dept.budget)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 p-4 lg:p-6 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                Быстрые действия
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { icon: '📋', label: 'Штатное расписание' },
                  { icon: '💰', label: 'Расчёт зарплат' },
                  { icon: '📊', label: 'Отчёт по эффективности' },
                  { icon: '🔄', label: 'Массовые изменения' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center gap-3"
                  >
                    <span>{action.icon}</span>
                    <span className="text-sm">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Staff Detail Modal */}
        <AnimatePresence>
          {selectedStaff && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 lg:p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
              >
                <div className="p-4 lg:p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Профиль сотрудника</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedStaff(null)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>

                <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center text-2xl lg:text-3xl">
                          {getRoleIcon(selectedStaff.role)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-2xl font-bold text-white truncate">
                            {selectedStaff.firstName} {selectedStaff.lastName}
                          </h3>
                          <p className="text-white/60 text-base lg:text-lg truncate">
                            {selectedStaff.specialization || selectedStaff.role} • {selectedStaff.department}
                          </p>
                          <p className="text-white/40 text-sm truncate">{selectedStaff.employeeId}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm">Статус</div>
                        <div className={`inline-flex px-2 lg:px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedStaff.status)}`}>
                          {getStatusText(selectedStaff.status)}
                        </div>
                      </div>
                      
                      <div className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm">Зарплата</div>
                        <div className="text-white font-medium text-base lg:text-lg">
                          {formatCurrency(selectedStaff.salary)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                      <span>📞</span>
                      Контактная информация
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                      {[
                        { label: 'Email', value: selectedStaff.email },
                        { label: 'Телефон', value: selectedStaff.phone },
                        { label: 'Дата найма', value: formatDate(selectedStaff.hireDate) },
                        { label: 'Отдел', value: selectedStaff.department }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="text-white/60 text-sm mb-1">{item.label}</div>
                          <div className="text-white font-medium text-sm lg:text-base">{item.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                      <span>📊</span>
                      Показатели эффективности
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4">
                      {[
                        { value: selectedStaff.performance.appointments, label: 'Приёмов', color: 'text-white' },
                        { value: selectedStaff.performance.satisfaction, label: 'Удовлетворённость', color: 'text-green-400' },
                        { value: `${selectedStaff.performance.efficiency}%`, label: 'Эффективность', color: 'text-blue-400' },
                        { value: `${selectedStaff.performance.attendance}%`, label: 'Посещаемость', color: 'text-yellow-400' },
                        { value: formatCurrency(selectedStaff.performance.revenue), label: 'Выручка', color: 'text-purple-400' }
                      ].map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className={`text-lg lg:text-xl font-bold mb-1 ${metric.color}`}>
                            {metric.value}
                          </div>
                          <div className="text-white/60 text-xs">{metric.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                      <span>🔐</span>
                      Права доступа
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStaff.permissions.map((permission: string, index: number) => (
                        <motion.span
                          key={permission}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-2 lg:px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs lg:text-sm"
                        >
                          {permission}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 font-medium text-white"
                    >
                      Редактировать
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-200 font-medium text-white"
                    >
                      Сохранить изменения
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}