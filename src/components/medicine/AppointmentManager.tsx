// /src/components/medicine/AppointmentManager.tsx (обновленная версия)
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Appointment, Doctor } from '@/app/demo/medicine/user/modules/appointment/demo-data';
import { InteractiveCard } from './InteractiveCard';
import { RescheduleModal } from './RescheduleModal';

interface AppointmentManagerProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onUpdateAppointment: (id: string, updates: Partial<Appointment>) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, newDoctorId: string, newSlotId: string) => void;
}

export function AppointmentManager({ 
  appointments, 
  doctors, 
  onUpdateAppointment, 
  onCancelAppointment,
  onRescheduleAppointment 
}: AppointmentManagerProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'completed': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждена';
      case 'pending': return 'Ожидание';
      case 'cancelled': return 'Отменена';
      case 'completed': return 'Завершена';
      default: return 'Неизвестно';
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      onCancelAppointment(selectedAppointment.id);
      setShowCancelModal(false);
      setSelectedAppointment(null);
    }
  };

  const handleRescheduleConfirm = (appointmentId: string, newDoctorId: string, newSlotId: string) => {
    const doctor = doctors.find(d => d.id === newDoctorId);
    const slot = doctor?.availableSlots.find(s => s.id === newSlotId);
    
    if (doctor && slot) {
      onRescheduleAppointment(appointmentId, newDoctorId, newSlotId);
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return `${new Date(date).toLocaleDateString('ru-RU')} в ${time}`;
  };

  return (
    <>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <InteractiveCard className="p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                    {appointment.type === 'online' ? '📞' : '🏥'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">{appointment.doctorName}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    
                    <p className="text-white/60 text-sm mb-3">{appointment.specialization}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Дата и время:</div>
                        <div className="text-white font-medium">
                          {formatDateTime(appointment.date, appointment.time)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-white/60">Тип приёма:</div>
                        <div className="text-white font-medium">
                          {appointment.type === 'online' ? '📞 Онлайн-консультация' : '🏥 В клинике'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-white/60">Жалобы:</div>
                        <div className="text-white line-clamp-2">{appointment.symptoms}</div>
                      </div>
                      
                      <div>
                        <div className="text-white/60">Стоимость:</div>
                        <div className="text-white font-medium">{appointment.price} ₽</div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="text-blue-400 text-sm font-medium">Примечание врача:</div>
                        <div className="text-blue-300/80 text-sm mt-1">{appointment.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <>
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all duration-200 text-blue-400 text-sm font-medium"
                      >
                        📅 Перенести
                      </button>
                      <button
                        onClick={() => handleCancel(appointment)}
                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200 text-red-400 text-sm font-medium"
                      >
                        ❌ Отменить
                      </button>
                    </>
                  )}
                  
                  {appointment.status === 'completed' && (
                    <button className="px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 transition-all duration-200 text-green-400 text-sm font-medium">
                      📋 Результаты
                    </button>
                  )}
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          doctors={doctors}
          isOpen={showRescheduleModal}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
          onReschedule={handleRescheduleConfirm}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Отмена записи</h3>
              
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="font-medium text-white">{selectedAppointment.doctorName}</div>
                <div className="text-white/60 text-sm mt-1">
                  {formatDateTime(selectedAppointment.date, selectedAppointment.time)}
                </div>
                <div className="text-white/60 text-sm">{selectedAppointment.specialization}</div>
              </div>

              <p className="text-white/60 mb-6">
                Вы уверены, что хотите отменить эту запись? Это действие нельзя отменить.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium"
                >
                  Нет, оставить
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-colors font-medium text-white"
                >
                  Да, отменить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}