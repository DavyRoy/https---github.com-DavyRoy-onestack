// /src/components/medicine/RescheduleModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doctor, TimeSlot, Appointment } from '@/app/demo/medicine/user/modules/appointment/demo-data';
import { InteractiveCard } from './InteractiveCard';

interface RescheduleModalProps {
  appointment: Appointment;
  doctors: Doctor[];
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (appointmentId: string, newDoctorId: string, newSlotId: string) => void;
}

export function RescheduleModal({ appointment, doctors, isOpen, onClose, onReschedule }: RescheduleModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string>(appointment.doctorId);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'doctor' | 'time'>('doctor');

  const currentDoctor = doctors.find(d => d.id === selectedDoctor);
  const availableSlots = currentDoctor?.availableSlots.filter(slot => 
    slot.isAvailable && 
    (slot.date !== appointment.date || slot.time !== appointment.time) // Исключаем текущий слот
  ) || [];

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setSelectedSlot('');
    setCurrentStep('time');
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      onReschedule(appointment.id, selectedDoctor, selectedSlot);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep === 'time') {
      setCurrentStep('doctor');
      setSelectedSlot('');
    } else {
      onClose();
    }
  };

  const getSelectedSlotData = () => {
    if (!currentDoctor || !selectedSlot) return null;
    return currentDoctor.availableSlots.find(slot => slot.id === selectedSlot);
  };

  const selectedSlotData = getSelectedSlotData();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Перенос записи</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-white text-lg">✕</span>
              </button>
            </div>

            {/* Current Appointment Info */}
            <InteractiveCard className="p-4 mb-6 bg-blue-500/10 border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  📅
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Текущая запись</div>
                  <div className="text-white/60 text-sm">
                    {appointment.doctorName} • {new Date(appointment.date).toLocaleDateString('ru-RU')} в {appointment.time}
                  </div>
                </div>
              </div>
            </InteractiveCard>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'doctor' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {currentStep === 'doctor' ? '1' : '✓'}
                </div>
                <div className="w-12 h-1 mx-2 bg-white/10" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'time'
                    ? 'bg-blue-500 text-white'
                    : currentStep === 'doctor'
                    ? 'bg-white/10 text-white/60'
                    : 'bg-green-500 text-white'
                }`}>
                  {currentStep === 'time' ? '2' : '✓'}
                </div>
              </div>
            </div>

            {/* Step 1: Doctor Selection */}
            {currentStep === 'doctor' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h4 className="font-semibold text-white mb-4">Выберите врача</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                        selectedDoctor === doctor.id
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                          👨‍⚕️
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{doctor.name}</div>
                          <div className="text-white/60 text-sm">{doctor.specialization}</div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                            <span>⭐ {doctor.rating}</span>
                            <span>🕒 {doctor.availableSlots.filter(s => s.isAvailable).length} слотов</span>
                          </div>
                        </div>
                        {selectedDoctor === doctor.id && (
                          <div className="text-blue-400">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Time Slot Selection */}
            {currentStep === 'time' && currentDoctor && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={handleBack}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    ←
                  </button>
                  <h4 className="font-semibold text-white">Выберите новое время</h4>
                </div>

                {/* Doctor Info */}
                <InteractiveCard className="p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                      👨‍⚕️
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{currentDoctor.name}</div>
                      <div className="text-white/60 text-sm">{currentDoctor.specialization}</div>
                    </div>
                  </div>
                </InteractiveCard>

                {/* Available Slots */}
                <h5 className="font-medium text-white mb-3">Доступные слоты:</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot.id)}
                      className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                        selectedSlot === slot.id
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                      }`}
                    >
                      <div className="font-medium">{slot.time}</div>
                      <div className="text-sm opacity-70">
                        {new Date(slot.date).toLocaleDateString('ru-RU')}
                      </div>
                      <div className={`text-xs mt-1 px-2 py-1 rounded-lg ${
                        slot.type === 'online' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {slot.type === 'online' ? 'Онлайн' : 'В клинике'}
                      </div>
                    </button>
                  ))}
                </div>

                {availableSlots.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl mb-3 mx-auto">
                      ⚠️
                    </div>
                    <div className="font-medium text-white mb-2">Нет доступных слотов</div>
                    <div className="text-white/60 text-sm">
                      У выбранного врача нет свободного времени для записи
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Selected Slot Summary */}
            {selectedSlotData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
              >
                <div className="font-semibold text-white mb-2">Новое время приёма:</div>
                <div className="text-white/80">
                  {new Date(selectedSlotData.date).toLocaleDateString('ru-RU', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })} в {selectedSlotData.time}
                </div>
                <div className="text-white/60 text-sm mt-1">
                  {currentDoctor?.name} • {selectedSlotData.type === 'online' ? 'Онлайн-консультация' : 'Приём в клинике'}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium"
              >
                {currentStep === 'doctor' ? 'Отмена' : 'Назад'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedSlot}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedSlot
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-white/5 text-white/40 cursor-not-allowed'
                }`}
              >
                Подтвердить перенос
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}