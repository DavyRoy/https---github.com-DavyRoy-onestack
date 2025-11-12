'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { getPatientById, getAppointmentsByPatient, calculateAge } from '../demo-data';

export default function PatientPage() {
  const params = useParams();
  const patientId = params.id as string;
  
  const patient = getPatientById(patientId);
  const patientAppointments = getAppointmentsByPatient(patientId);

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <DemoBreadcrumbs 
            items={[
              { label: 'Демо', href: '/demo' },
              { label: 'Медицина', href: '/demo/medicine' },
              { label: 'Менеджер', href: '/demo/medicine/manager' },
              { label: 'Пациенты', href: '/demo/medicine/manager/modules/patients' },
              { label: 'Не найден', href: '#' }
            ]} 
          />
          
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Пациент не найден</h1>
            <p className="text-white/60 mb-6">Пациент с ID {patientId} не существует</p>
            <Link
              href="/demo/medicine/manager/modules/patients"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Вернуться к списку пациентов
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const age = calculateAge(patient.birthDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <DemoBreadcrumbs 
            items={[
              { label: 'Демо', href: '/demo' },
              { label: 'Медицина', href: '/demo/medicine' },
              { label: 'Менеджер', href: '/demo/medicine/manager' },
              { label: 'Пациенты', href: '/demo/medicine/manager/modules/patients' },
              { label: patient.name, href: '#' }
            ]} 
          />
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-6 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{patient.name}</h1>
              <p className="text-white/60">
                Карта пациента • {age} лет • {patient.gender === 'male' ? 'Мужской' : 'Женский'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/demo/medicine/manager/modules/patients"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-white font-medium"
              >
                ← Назад
              </Link>
              <button className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
                Редактировать
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Контактная информация</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm">Телефон</label>
                  <p className="text-white font-medium">{patient.phone}</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Email</label>
                  <p className="text-white font-medium">{patient.email}</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Дата рождения</label>
                  <p className="text-white font-medium">
                    {new Date(patient.birthDate).toLocaleDateString('ru-RU')} ({age} лет)
                  </p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Страховка</label>
                  <p className="text-white font-medium">{patient.insurance}</p>
                </div>
                {patient.address && (
                  <div className="md:col-span-2">
                    <label className="text-white/60 text-sm">Адрес</label>
                    <p className="text-white font-medium">{patient.address}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Экстренный контакт */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Экстренный контакт</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm">Имя</label>
                  <p className="text-white font-medium">{patient.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Телефон</label>
                  <p className="text-white font-medium">{patient.emergencyContact.phone}</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Отношение</label>
                  <p className="text-white font-medium">{patient.emergencyContact.relationship}</p>
                </div>
              </div>
            </motion.div>

            {/* История приемов */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">История приемов</h2>
              {patientAppointments.length === 0 ? (
                <p className="text-white/60 text-center py-4">Нет записей на прием</p>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div>
                        <p className="text-white font-medium">{appointment.doctorName}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(appointment.date).toLocaleDateString('ru-RU')} • {appointment.startTime}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        appointment.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                        appointment.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {appointment.status === 'completed' ? 'Завершен' :
                         appointment.status === 'scheduled' ? 'Запланирован' :
                         appointment.status === 'in-progress' ? 'В процессе' :
                         'Отменен'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Медицинская информация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Медицинская информация</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm">Группа крови</label>
                  <p className="text-white font-medium">{patient.bloodType || 'Не указана'}</p>
                </div>
                
                <div>
                  <label className="text-white/60 text-sm">Последний осмотр</label>
                  <p className="text-white font-medium">
                    {patient.lastCheckup 
                      ? new Date(patient.lastCheckup).toLocaleDateString('ru-RU')
                      : 'Не указан'
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* История болезней */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">История болезней</h2>
              {patient.medicalHistory.length === 0 ? (
                <p className="text-white/60">Нет записей</p>
              ) : (
                <div className="space-y-2">
                  {patient.medicalHistory.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-white/80"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      {condition}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Аллергии */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Аллергии</h2>
              {patient.allergies.length === 0 ? (
                <p className="text-white/60">Нет аллергий</p>
              ) : (
                <div className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-white/80"
                    >
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      {allergy}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}