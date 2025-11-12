// src/app/demo/medicine/user/modules/payment/components/InvoiceDetailsModal.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Invoice } from '@/app/demo/medicine/user/modules/payment/demo-data';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

interface InvoiceDetailsModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPay: () => void;
}

export default function InvoiceDetailsModal({ invoice, onClose, onPay }: InvoiceDetailsModalProps) {
  const subtotal = invoice.services.reduce((sum, service) => sum + service.total, 0);
  const tax = invoice.taxAmount || 0;
  const discount = invoice.discount || 0;
  const total = subtotal + tax - discount;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Оплачен';
      case 'pending': return 'Ожидает оплаты';
      case 'overdue': return 'Просрочен';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return '✅';
      case 'pending': return '⏳';
      case 'overdue': return '🚨';
      default: return '📄';
    }
  };

  return (
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
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 sticky top-0 bg-gray-900 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Детали счета</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <span className="text-white text-lg">✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <InteractiveCard className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                  invoice.status === 'paid' ? 'bg-green-500/20 border-green-500/30' :
                  invoice.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/30' :
                  invoice.status === 'overdue' ? 'bg-red-500/20 border-red-500/30' :
                  'bg-gray-500/20 border-gray-500/30'
                } border`}>
                  {getStatusIcon(invoice.status)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl mb-1">{invoice.number}</h3>
                  <p className="text-white/60">Счет на медицинские услуги</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-2">{invoice.amount.toLocaleString()} ₽</div>
                <span className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(invoice.status)}`}>
                  {getStatusText(invoice.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-white/60">Дата выставления</div>
                <div className="text-white font-medium">
                  {new Date(invoice.date).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div>
                <div className="text-white/60">Срок оплаты</div>
                <div className="text-white font-medium">
                  {new Date(invoice.dueDate).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div>
                <div className="text-white/60">Пациент</div>
                <div className="text-white font-medium">{invoice.patientName}</div>
              </div>
              <div>
                <div className="text-white/60">ID пациента</div>
                <div className="text-white font-medium">{invoice.patientId}</div>
              </div>
            </div>
          </InteractiveCard>

          {/* Clinic Info */}
          {invoice.clinicInfo && (
            <div>
              <h4 className="font-semibold text-white mb-3">🏥 Информация о клинике</h4>
              <InteractiveCard className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Название</div>
                    <div className="text-white font-medium">{invoice.clinicInfo.name}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Адрес</div>
                    <div className="text-white font-medium">{invoice.clinicInfo.address}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Телефон</div>
                    <div className="text-white font-medium">{invoice.clinicInfo.phone}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Email</div>
                    <div className="text-white font-medium">{invoice.clinicInfo.email}</div>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          )}

          {/* Services Table */}
          <div>
            <h4 className="font-semibold text-white mb-4">📋 Услуги</h4>
            <InteractiveCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left p-4 text-white/80 text-sm font-medium">Услуга</th>
                      <th className="text-right p-4 text-white/80 text-sm font-medium">Кол-во</th>
                      <th className="text-right p-4 text-white/80 text-sm font-medium">Цена</th>
                      <th className="text-right p-4 text-white/80 text-sm font-medium">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.services.map((service, index) => (
                      <tr key={service.id} className={index % 2 === 0 ? 'bg-white/2.5' : 'bg-white/5'}>
                        <td className="p-4">
                          <div className="text-white font-medium">{service.name}</div>
                          <div className="text-white/60 text-sm">{service.description}</div>
                          {service.category && (
                            <div className="text-blue-400 text-xs mt-1">{service.category}</div>
                          )}
                          {service.duration && (
                            <div className="text-white/40 text-xs">{service.duration}</div>
                          )}
                        </td>
                        <td className="p-4 text-right text-white/80">{service.quantity}</td>
                        <td className="p-4 text-right text-white/80">{service.price.toLocaleString()} ₽</td>
                        <td className="p-4 text-right text-white font-medium">{service.total.toLocaleString()} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InteractiveCard>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-white/80">
                <span>Подытог:</span>
                <span>{subtotal.toLocaleString()} ₽</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Скидка:</span>
                  <span>-{discount.toLocaleString()} ₽</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-white/80">
                  <span>Налог:</span>
                  <span>{tax.toLocaleString()} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-xl border-t border-white/10 pt-3">
                <span>Итого:</span>
                <span>{total.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {invoice.paymentMethod && (
            <div>
              <h4 className="font-semibold text-white mb-3">💳 Информация об оплате</h4>
              <InteractiveCard className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Способ оплаты</div>
                    <div className="text-white font-medium">{invoice.paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Дата оплаты</div>
                    <div className="text-white font-medium">
                      {new Date(invoice.paidDate!).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium">
              <span>🖨️</span>
              <span>Распечатать</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors font-medium text-blue-400">
              <span>📤</span>
              <span>Экспорт PDF</span>
            </button>
            {(invoice.status === 'pending' || invoice.status === 'overdue') && (
              <button
                onClick={onPay}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-colors font-medium text-white"
              >
                <span>⚡</span>
                <span>Оплатить сейчас</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}