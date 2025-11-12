'use client';

import React, { useState } from 'react';
import { Doctor, TimeSlot, AppointmentFormData } from './types';

interface AppointmentBookingProps {
  doctors: Doctor[];
  onAppointmentBooked: (data: AppointmentFormData) => void;
  initialData?: Partial<AppointmentFormData>;
}

export default function AppointmentBooking({
  doctors,
  onAppointmentBooked,
  initialData = {}
}: AppointmentBookingProps) {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>(initialData);

  const specializations = Array.from(new Set(doctors.map(d => d.specialization)));
  const filteredDoctors = selectedSpecialization 
    ? doctors.filter(doctor => doctor.specialization === selectedSpecialization)
    : doctors;

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
  const availableSlots = selectedDoctorData?.availableSlots.filter(slot => slot.isAvailable) || [];

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctorData && selectedSlot) {
      const appointmentData: AppointmentFormData = {
        patientName: formData.patientName || '',
        patientPhone: formData.patientPhone || '',
        patientEmail: formData.patientEmail || '',
        doctorId: selectedDoctor,
        slotId: selectedSlot,
        symptoms: formData.symptoms || '',
        priority: formData.priority || 'routine'
      };
      onAppointmentBooked(appointmentData);
      handleNextStep();
    }
  };

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['Специализация', 'Врач', 'Время', 'Данные'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > index + 1 
                  ? 'bg-green-500 text-white' 
                  : currentStep === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/60'
              }`}>
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep >= index + 1 ? 'text-white' : 'text-white/60'
              }`}>
                {step}
              </span>
              {index < 3 && (
                <div className={`w-12 h-px mx-4 ${
                  currentStep > index + 1 ? 'bg-green-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        {/* Step 1: Specialization Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Выберите специализацию</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    setSelectedSpecialization(spec);
                    handleNextStep();
                  }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-center group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {getSpecializationIcon(spec)}
                  </div>
                  <div className="text-sm font-medium text-white">{spec}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Doctor Selection */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handlePrevStep}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                ←
              </button>
              <h2 className="text-xl font-semibold">Выберите врача</h2>
            </div>

            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor.id);
                    handleNextStep();
                  }}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                      👨‍⚕️
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{doctor.name}</h3>
                      <p className="text-white/60 text-sm">{doctor.specialization}</p>
                      <p className="text-white/60 text-sm mt-1">{doctor.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                        <span>⭐ {doctor.rating}</span>
                        <span>📅 {doctor.experience} лет опыта</span>
                        <span>🕒 {doctor.availableSlots.filter(s => s.isAvailable).length} слотов</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time Slot Selection */}
        {currentStep === 3 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handlePrevStep}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                ←
              </button>
              <h2 className="text-xl font-semibold">Выберите время приёма</h2>
            </div>

            {selectedDoctorData && (
              <div>
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                    👨‍⚕️
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedDoctorData.name}</h3>
                    <p className="text-white/60 text-sm">{selectedDoctorData.specialization}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => {
                        setSelectedSlot(slot.id);
                        handleNextStep();
                      }}
                      className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                        selectedSlot === slot.id
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <div className="font-medium">{slot.time}</div>
                      <div className="text-sm opacity-70">
                        {new Date(slot.date).toLocaleDateString('ru-RU')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Patient Information */}
        {currentStep === 4 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handlePrevStep}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                ←
              </button>
              <h2 className="text-xl font-semibold">Ваши данные</h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Form fields same as in page.tsx */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  ФИО пациента
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName || ''}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              {/* ... other form fields ... */}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium text-white"
                >
                  Подтвердить запись
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-3xl mb-6 mx-auto">
              ✅
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Запись подтверждена!</h2>
            <p className="text-white/60 mb-6">
              Вы успешно записаны на приём. Подтверждение отправлено на вашу почту.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getSpecializationIcon(spec: string): string {
  const icons: Record<string, string> = {
    'Терапевт': '👨‍⚕️',
    'Кардиолог': '❤️',
    'Невролог': '🧠',
    'Офтальмолог': '👁️',
    'Стоматолог': '🦷',
    'Дерматолог': '🔬',
    'Педиатр': '👶',
    'Хирург': '🔪'
  };
  return icons[spec] || '👨‍⚕️';
}