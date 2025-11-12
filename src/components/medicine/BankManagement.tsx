// src/app/demo/medicine/user/modules/payment/components/BankManagement.tsx
'use client';

import React, { useState } from 'react';

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  currency: string;
  isActive: boolean;
  swiftCode?: string;
  iban?: string;
  isDefault: boolean;
}

interface BankManagementProps {
  onClose: () => void;
  onUpdate: (accounts: BankAccount[]) => void;
  existingAccounts?: BankAccount[];
}

export default function BankManagement({ onClose, onUpdate, existingAccounts = [] }: BankManagementProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>(existingAccounts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    currency: 'RUB',
    swiftCode: '',
    iban: '',
    isActive: true,
    isDefault: false
  });

  const handleAddAccount = () => {
    if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountHolder) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const account: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newAccount.bankName!,
      accountNumber: newAccount.accountNumber!,
      accountHolder: newAccount.accountHolder!,
      currency: newAccount.currency || 'RUB',
      swiftCode: newAccount.swiftCode,
      iban: newAccount.iban,
      isActive: true,
      isDefault: newAccount.isDefault || false
    };

    // Если это первый счет или выбран как основной, снимаем флаг с других
    let updatedAccounts = [...accounts];
    if (account.isDefault) {
      updatedAccounts = updatedAccounts.map(acc => ({ ...acc, isDefault: false }));
    }

    updatedAccounts.push(account);
    setAccounts(updatedAccounts);
    setShowAddForm(false);
    resetForm();
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setNewAccount(account);
  };

  const handleUpdateAccount = () => {
    if (!editingAccount || !newAccount.bankName || !newAccount.accountNumber || !newAccount.accountHolder) {
      return;
    }

    const updatedAccounts = accounts.map(acc => 
      acc.id === editingAccount.id 
        ? { 
            ...acc, 
            bankName: newAccount.bankName!,
            accountNumber: newAccount.accountNumber!,
            accountHolder: newAccount.accountHolder!,
            currency: newAccount.currency || 'RUB',
            swiftCode: newAccount.swiftCode,
            iban: newAccount.iban,
            isDefault: newAccount.isDefault || false
          }
        : newAccount.isDefault ? { ...acc, isDefault: false } : acc
    );

    setAccounts(updatedAccounts);
    setEditingAccount(null);
    resetForm();
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот банковский счет?')) {
      const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
      setAccounts(updatedAccounts);
    }
  };

  const setDefaultAccount = (accountId: string) => {
    const updatedAccounts = accounts.map(acc => ({
      ...acc,
      isDefault: acc.id === accountId
    }));
    setAccounts(updatedAccounts);
  };

  const resetForm = () => {
    setNewAccount({
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      currency: 'RUB',
      swiftCode: '',
      iban: '',
      isActive: true,
      isDefault: false
    });
  };

  const handleSave = () => {
    onUpdate(accounts);
  };

  const maskAccountNumber = (number: string) => {
    if (number.length <= 4) return number;
    return `•••• ${number.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Управление банковскими счетами</h2>
              <p className="text-white/60 text-sm mt-1">Добавьте и управляйте банковскими счетами для переводов</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Account Button */}
          {!showAddForm && !editingAccount && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors text-white/60 hover:text-white/80 flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              Добавить банковский счет
            </button>
          )}

          {/* Add/Edit Form */}
          {(showAddForm || editingAccount) && (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4 animate-fadeIn">
              <h3 className="font-semibold text-white">
                {editingAccount ? 'Редактирование счета' : 'Добавление нового счета'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Название банка *
                  </label>
                  <input
                    type="text"
                    placeholder="Сбербанк, Тинькофф и т.д."
                    value={newAccount.bankName}
                    onChange={(e) => setNewAccount(prev => ({...prev, bankName: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Номер счета *
                  </label>
                  <input
                    type="text"
                    placeholder="40817810099910004312"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount(prev => ({...prev, accountNumber: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Владелец счета *
                  </label>
                  <input
                    type="text"
                    placeholder="Иванов Иван Иванович"
                    value={newAccount.accountHolder}
                    onChange={(e) => setNewAccount(prev => ({...prev, accountHolder: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Валюта
                  </label>
                  <select
                    value={newAccount.currency}
                    onChange={(e) => setNewAccount(prev => ({...prev, currency: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white"
                  >
                    <option value="RUB">Рубль (RUB)</option>
                    <option value="USD">Доллар (USD)</option>
                    <option value="EUR">Евро (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    SWIFT код
                  </label>
                  <input
                    type="text"
                    placeholder="SABRRUMM"
                    value={newAccount.swiftCode}
                    onChange={(e) => setNewAccount(prev => ({...prev, swiftCode: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    IBAN
                  </label>
                  <input
                    type="text"
                    placeholder="RU02000000000000000000"
                    value={newAccount.iban}
                    onChange={(e) => setNewAccount(prev => ({...prev, iban: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAccount.isDefault || false}
                    onChange={(e) => setNewAccount(prev => ({...prev, isDefault: e.target.checked}))}
                    className="rounded bg-white/10 border-white/20"
                  />
                  <span className="text-white/80 text-sm">Сделать основным счетом</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editingAccount ? handleUpdateAccount : handleAddAccount}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium text-white"
                >
                  {editingAccount ? 'Обновить счет' : 'Добавить счет'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAccount(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium text-white"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Bank Accounts List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Ваши банковские счета</h3>
            
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-4 mx-auto">
                  🏦
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Нет добавленных счетов</h4>
                <p className="text-white/60">Добавьте банковский счет для осуществления переводов</p>
              </div>
            ) : (
              accounts.map((account) => (
                <div key={account.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xl">🏦</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{account.bankName}</span>
                          {account.isDefault && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              Основной
                            </span>
                          )}
                          {account.isActive && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              Активен
                            </span>
                          )}
                        </div>
                        
                        <div className="text-white/60 text-sm space-y-1">
                          <div>Счет: {maskAccountNumber(account.accountNumber)}</div>
                          <div>Владелец: {account.accountHolder}</div>
                          <div>Валюта: {account.currency}</div>
                          {account.swiftCode && <div>SWIFT: {account.swiftCode}</div>}
                          {account.iban && <div>IBAN: {account.iban}</div>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!account.isDefault && (
                        <button
                          onClick={() => setDefaultAccount(account.id)}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white text-sm"
                        >
                          Сделать основным
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-colors text-red-400 hover:text-red-300"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bank Transfer Instructions */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <h4 className="font-semibold text-blue-400 mb-2">Инструкция по банковскому переводу</h4>
            <div className="text-blue-300/80 text-sm space-y-1">
              <p>1. Выберите счет для оплаты</p>
              <p>2. Используйте реквизиты для перевода через ваш банк</p>
              <p>3. Укажите номер счета в назначении платежа</p>
              <p>4. Сохраните квитанцию об оплате</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium text-white"
            >
              Сохранить изменения
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium text-white"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}