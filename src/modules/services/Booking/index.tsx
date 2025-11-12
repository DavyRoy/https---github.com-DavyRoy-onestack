'use client';

import React from 'react';
import { BookingFormData, BookingService, BookingSlot, BookingEmployee } from './types';

interface BookingWizardProps {
  services: BookingService[];
  employees: BookingEmployee[];
  slots: BookingSlot[];
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  services,
  employees,
  slots,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<BookingFormData>>({});

  const handleServiceSelect = (service: BookingService) => {
    setFormData(prev => ({ ...prev, serviceId: service.id }));
    setCurrentStep(2);
  };

  const handleEmployeeSelect = (employee: BookingEmployee) => {
    setFormData(prev => ({ ...prev, employeeId: employee.id }));
    setCurrentStep(3);
  };

  const handleSlotSelect = (slot: BookingSlot) => {
    setFormData(prev => ({ ...prev, timeSlotId: slot.id }));
    setCurrentStep(4);
  };

  const handleSubmit = (finalData: Partial<BookingFormData>) => {
    // Validate and submit
    onSubmit(finalData as BookingFormData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep >= step 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-gray-400'
              }`}>
                {step}
              </div>
              <span className={`text-sm ${
                currentStep >= step ? 'text-white' : 'text-gray-400'
              }`}>
                {step === 1 && 'Услуга'}
                {step === 2 && 'Специалист'}
                {step === 3 && 'Время'}
                {step === 4 && 'Данные'}
              </span>
              {step < 4 && (
                <div className="w-12 h-px bg-white/20 ml-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        {currentStep === 1 && (
          <ServiceSelection 
            services={services}
            onSelect={handleServiceSelect}
          />
        )}

        {currentStep === 2 && (
          <EmployeeSelection 
            employees={employees.filter(e => 
              e.services.includes(formData.serviceId!)
            )}
            onSelect={handleEmployeeSelect}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <TimeSelection 
            slots={slots}
            onSelect={handleSlotSelect}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <CustomerForm 
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  );
};

const ServiceSelection: React.FC<{
  services: BookingService[];
  onSelect: (service: BookingService) => void;
}> = ({ services, onSelect }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Выберите услугу</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelect(service)}
          className="p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-left"
        >
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <p className="text-gray-400 text-sm">{service.description}</p>
            <div className="flex justify-between text-sm">
              <span>{service.duration} мин</span>
              <span className="font-semibold">{service.price} ₽</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const EmployeeSelection: React.FC<{
  employees: BookingEmployee[];
  onSelect: (employee: BookingEmployee) => void;
  onBack: () => void;
}> = ({ employees, onSelect, onBack }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Выберите специалиста</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {employees.map((employee) => (
        <button
          key={employee.id}
          onClick={() => onSelect(employee)}
          className="p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-left"
        >
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <p className="text-gray-400 text-sm">{employee.position}</p>
          </div>
        </button>
      ))}
    </div>
    <div className="flex justify-between">
      <button
        onClick={onBack}
        className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
      >
        Назад
      </button>
    </div>
  </div>
);

const TimeSelection: React.FC<{
  slots: BookingSlot[];
  onSelect: (slot: BookingSlot) => void;
  onBack: () => void;
}> = ({ slots, onSelect, onBack }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Выберите время</h2>
    <div className="grid grid-cols-4 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSelect(slot)}
          disabled={!slot.available}
          className={`p-4 rounded-xl text-center transition-all duration-300 ${
            slot.available
              ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
              : 'bg-white/5 opacity-30 cursor-not-allowed border border-white/5'
          }`}
        >
          <div className="font-medium">{slot.startTime}</div>
          {!slot.available && (
            <div className="text-xs mt-1 text-gray-400">Занято</div>
          )}
        </button>
      ))}
    </div>
    <div className="flex justify-between">
      <button
        onClick={onBack}
        className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
      >
        Назад
      </button>
    </div>
  </div>
);

const CustomerForm: React.FC<{
  formData: Partial<BookingFormData>;
  onChange: (data: Partial<BookingFormData>) => void;
  onSubmit: (data: Partial<BookingFormData>) => void;
  onBack: () => void;
}> = ({ formData, onChange, onSubmit, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Ваши данные</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Имя</label>
          <input
            type="text"
            required
            value={formData.customerName || ''}
            onChange={(e) => onChange({ ...formData, customerName: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Телефон</label>
          <input
            type="tel"
            required
            value={formData.customerPhone || ''}
            onChange={(e) => onChange({ ...formData, customerPhone: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.customerEmail || ''}
            onChange={(e) => onChange({ ...formData, customerEmail: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-2">Примечания (опционально)</label>
          <textarea
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => onChange({ ...formData, notes: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
        >
          Назад
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Забронировать
        </button>
      </div>
    </form>
  );
};