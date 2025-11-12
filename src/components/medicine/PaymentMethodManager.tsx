// components/PaymentMethodManager.tsx
'use client';

import React, { useState } from 'react';

interface PaymentMethodManagerProps {
  onClose: () => void;
}

export default function PaymentMethodManager({ onClose }: PaymentMethodManagerProps) {
  const [activeTab, setActiveTab] = useState<'cards' | 'banks' | 'wallets'>('cards');
  const [showAddForm, setShowAddForm] = useState(false);

  const [cards, setCards] = useState([
    {
      id: 'card-1',
      lastFour: '4242',
      brand: 'visa' as const,
      expiryMonth: '12',
      expiryYear: '25',
      isDefault: true,
      holderName: 'Иван Иванов'
    }
  ]);

  const [banks, setBanks] = useState([
    {
      id: 'bank-1',
      bankName: 'Сбербанк',
      accountNumber: '**** 4832',
      isDefault: true
    }
  ]);

  const [wallets, setWallets] = useState([
    {
      id: 'wallet-1',
      provider: 'yoomoney' as const,
      walletNumber: '4100******1234',
      isDefault: true
    }
  ]);

  const handleAddCard = (cardData: any) => {
    const newCard = {
      ...cardData,
      id: `card-${Date.now()}`,
      isDefault: cards.length === 0
    };
    setCards(prev => [...prev, newCard]);
    setShowAddForm(false);
  };

  const handleSetDefault = (id: string, type: 'cards' | 'banks' | 'wallets') => {
    const setters = {
      cards: setCards,
      banks: setBanks,
      wallets: setWallets
    };

    setters[type](prev => prev.map(item => ({
      ...item,
      isDefault: item.id === id
    })));
  };

  const handleDelete = (id: string, type: 'cards' | 'banks' | 'wallets') => {
    const setters = {
      cards: setCards,
      banks: setBanks,
      wallets: setWallets
    };

    setters[type](prev => {
      const newItems = prev.filter(item => item.id !== id);
      // Если удаляем дефолтный, устанавливаем первый как дефолтный
      if (newItems.length > 0 && !newItems.some(item => item.isDefault)) {
        newItems[0].isDefault = true;
      }
      return newItems;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Управление способами оплаты</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-6">
            {[
              { id: 'cards', label: '💳 Банковские карты', count: cards.length },
              { id: 'banks', label: '🏦 Банковские счета', count: banks.length },
              { id: 'wallets', label: '📱 Электронные кошельки', count: wallets.length }
            ].map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            {activeTab === 'cards' && (
              <CardManagement
                cards={cards}
                onAddCard={handleAddCard}
                onSetDefault={(id) => handleSetDefault(id, 'cards')}
                onDelete={(id) => handleDelete(id, 'cards')}
                showAddForm={showAddForm}
                onShowAddForm={setShowAddForm}
              />
            )}

            {activeTab === 'banks' && (
              <BankManagement
                banks={banks}
                onSetDefault={(id) => handleSetDefault(id, 'banks')}
                onDelete={(id) => handleDelete(id, 'banks')}
              />
            )}

            {activeTab === 'wallets' && (
              <WalletManagement
                wallets={wallets}
                onSetDefault={(id) => handleSetDefault(id, 'wallets')}
                onDelete={(id) => handleDelete(id, 'wallets')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Подкомпоненты для управления разными типами оплаты
const CardManagement = ({ cards, onAddCard, onSetDefault, onDelete, showAddForm, onShowAddForm }: any) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-white">Банковские карты</h3>
      <button
        onClick={() => onShowAddForm(true)}
        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium text-white"
      >
        + Добавить карту
      </button>
    </div>

    {showAddForm && (
      <AddCardForm onSave={onAddCard} onCancel={() => onShowAddForm(false)} />
    )}

    <div className="space-y-3">
      {cards.map((card: any) => (
        <div key={card.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-xs">
                {card.brand === 'visa' ? 'VISA' : card.brand === 'mastercard' ? 'MC' : 'МИР'}
              </div>
              <div>
                <div className="text-white font-medium">•••• {card.lastFour}</div>
                <div className="text-white/60 text-sm">
                  {card.holderName} • {card.expiryMonth}/{card.expiryYear}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {card.isDefault && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  По умолчанию
                </span>
              )}
              {!card.isDefault && (
                <button
                  onClick={() => onSetDefault(card.id)}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                >
                  Сделать основным
                </button>
              )}
              <button
                onClick={() => onDelete(card.id)}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors text-red-400"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AddCardForm = ({ onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь была бы валидация и шифрование данных
    onSave({
      lastFour: formData.cardNumber.slice(-4),
      brand: 'visa', // Определялось бы по номеру карты
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      holderName: formData.holderName
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Номер карты</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Месяц</label>
            <input
              type="text"
              placeholder="MM"
              maxLength={2}
              value={formData.expiryMonth}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryMonth: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Год</label>
            <input
              type="text"
              placeholder="ГГ"
              maxLength={2}
              value={formData.expiryYear}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryYear: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">CVV</label>
            <input
              type="text"
              placeholder="123"
              maxLength={3}
              value={formData.cvv}
              onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Имя владельца</label>
          <input
            type="text"
            placeholder="IVAN IVANOV"
            value={formData.holderName}
            onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium text-white"
          >
            Сохранить карту
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium"
          >
            Отмена
          </button>
        </div>
      </div>
    </form>
  );
};

// Аналогичные компоненты для BankManagement и WalletManagement...