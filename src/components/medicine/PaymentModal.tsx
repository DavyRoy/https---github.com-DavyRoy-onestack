// src/app/demo/medicine/user/modules/payment/components/PaymentModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invoice, PaymentMethod } from '../demo-data';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

interface PaymentModalProps {
  invoice: Invoice;
  paymentMethods: PaymentMethod[];
  onClose: () => void;
  onSubmit: (paymentData: any) => void;
}

export default function PaymentModal({ invoice, paymentMethods, onClose, onSubmit }: PaymentModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'details' | 'processing'>('method');

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep('processing');
    
    const paymentData = {
      invoiceId: invoice.id,
      amount: invoice.amount,
      method: selectedPaymentMethod,
      cardDetails: selectedPaymentMethod.includes('card') ? cardDetails : undefined
    };

    await new Promise(resolve => setTimeout(resolve, 3000));
    await onSubmit(paymentData);
    setIsProcessing(false);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (!paymentMethods.find(m => m.id === methodId)?.details?.cardNumber) {
      setStep('details');
    }
  };

  return (
    <AnimatePresence>
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
          className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 sticky top-0 bg-gray-900 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Оплата счета</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Invoice Summary */}
            <InteractiveCard className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60">Счет:</span>
                <span className="font-medium text-white">{invoice.number}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60">Сумма:</span>
                <span className="text-xl font-bold text-white">{invoice.amount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Срок оплаты:</span>
                <span className="text-white/80">
                  {new Date(invoice.dueDate).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </InteractiveCard>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6">
              {[
                { step: 'method', label: 'Метод', icon: '💳' },
                { step: 'details', label: 'Детали', icon: '📝' },
                { step: 'processing', label: 'Оплата', icon: '⚡' }
              ].map(({ step: s, label, icon }, index) => (
                <div key={s} className="flex items-center">
                  <div className={`flex flex-col items-center ${s === step ? 'text-blue-400' : 'text-white/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
                      s === step ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'
                    }`}>
                      {icon}
                    </div>
                    <span className="text-xs">{label}</span>
                  </div>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 mx-2 ${s === step ? 'bg-blue-500/30' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Выберите способ оплаты
                    </label>
                    <div className="space-y-3">
                      {paymentMethods.filter(method => method.isActive).map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === method.id
                              ? 'bg-blue-500/20 border-blue-500'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => handleMethodSelect(e.target.value)}
                            className="text-blue-500"
                          />
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{method.icon}</span>
                            <div>
                              <div className="text-white font-medium">{method.name}</div>
                              <div className="text-white/60 text-sm">{method.description}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectedPaymentMethod && setStep('details')}
                    disabled={!selectedPaymentMethod}
                    className="w-full mt-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 disabled:text-white/40 disabled:cursor-not-allowed transition-colors font-medium text-white"
                  >
                    Продолжить
                  </button>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Saved Card */}
                  {selectedMethod?.type === 'card' && selectedMethod.details?.cardNumber && (
                    <InteractiveCard className="p-4 animate-fadeIn">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">💳</span>
                        <div>
                          <div className="text-white font-medium">{selectedMethod.name}</div>
                          <div className="text-white/60 text-sm">
                            •••• {selectedMethod.details.cardNumber} • {selectedMethod.details.expiryDate}
                          </div>
                        </div>
                      </div>
                    </InteractiveCard>
                  )}

                  {/* New Card Details */}
                  {selectedMethod?.type === 'card' && !selectedMethod.details?.cardNumber && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Номер карты
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails(prev => ({...prev, number: e.target.value}))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Срок действия
                          </label>
                          <input
                            type="text"
                            placeholder="ММ/ГГ"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails(prev => ({...prev, expiry: e.target.value}))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({...prev, cvv: e.target.value}))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Владелец карты
                        </label>
                        <input
                          type="text"
                          placeholder="IVAN IVANOV"
                          value={cardDetails.holder}
                          onChange={(e) => setCardDetails(prev => ({...prev, holder: e.target.value}))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                        />
                      </div>
                    </>
                  )}

                  {/* Bank Transfer Info */}
                  {selectedMethod?.type === 'bank_transfer' && (
                    <InteractiveCard className="p-4 bg-blue-500/10 border-blue-500/20">
                      <h4 className="font-semibold text-blue-400 mb-2">Реквизиты для перевода</h4>
                      <div className="text-blue-300/80 text-sm space-y-1">
                        <p>Банк: Сбербанк</p>
                        <p>Счет: 40817810099910004312</p>
                        <p>БИК: 044525225</p>
                        <p>Назначение: {invoice.number}</p>
                      </div>
                    </InteractiveCard>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('method')}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium text-white"
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium text-white flex items-center justify-center gap-2"
                    >
                      <span>⚡</span>
                      <span>Оплатить {invoice.amount.toLocaleString()} ₽</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl mb-4 mx-auto">
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⚡
                      </motion.div>
                    ) : (
                      '✅'
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isProcessing ? 'Обработка платежа...' : 'Платеж выполнен!'}
                  </h3>
                  <p className="text-white/60">
                    {isProcessing ? 'Пожалуйста, подождите' : 'Счет успешно оплачен'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center text-white/40 text-xs">
              🔒 Платеж защищен SSL-шифрованием
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}