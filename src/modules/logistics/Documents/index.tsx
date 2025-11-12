'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'ttn',
    orderId: 'ORD-001',
    number: 'TTN-2024-001',
    date: '2024-01-15',
    sender: {
      name: 'ООО "Логистик Групп"',
      address: 'Москва, ул. Промышленная, д. 15',
      phone: '+7 495 123-45-67',
      inn: '7712345678'
    },
    receiver: {
      name: 'Иван Петров',
      address: 'Москва, ул. Арбат, д. 25, кв. 5',
      phone: '+7 912 345-67-89'
    },
    items: [
      {
        name: 'Документы',
        quantity: 1,
        unit: 'шт',
        weight: 0.5,
        value: 1000,
        description: 'Важные документы'
      }
    ],
    totalWeight: 0.5,
    totalValue: 1000,
    barcode: '2001234567890',
    status: 'issued'
  }
];

const documentTypes = [
  { id: 'ttn', name: 'Товарно-транспортная накладная', icon: '📄' },
  { id: 'invoice', name: 'Счёт-фактура', icon: '🧾' },
  { id: 'act', name: 'Акт приёма-передачи', icon: '📑' },
  { id: 'waybill', name: 'Путевой лист', icon: '🗺️' }
];

function DocumentPreview({ document }: { document: Document }) {
  const [scale, setScale] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Предпросмотр документа</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setScale(Math.min(scale + 0.1, 2))}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            +
          </button>
          <button
            onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            -
          </button>
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-lg p-8" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        {/* Заголовок документа */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
            {document.type === 'ttn' && 'ТОВАРНО-ТРАНСПОРТНАЯ НАКЛАДНАЯ'}
            {document.type === 'invoice' && 'СЧЁТ-ФАКТУРА'}
            {document.type === 'act' && 'АКТ ПРИЁМА-ПЕРЕДАЧИ'}
            {document.type === 'waybill' && 'ПУТЕВОЙ ЛИСТ'}
          </h1>
          <div className="text-black">№ {document.number} от {new Date(document.date).toLocaleDateString('ru-RU')}</div>
        </div>

        {/* Информация о сторонах */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-black mb-2">Отправитель:</h3>
            <div className="text-black">
              <div>{document.sender.name}</div>
              <div>{document.sender.address}</div>
              <div>Тел: {document.sender.phone}</div>
              {document.sender.inn && <div>ИНН: {document.sender.inn}</div>}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-2">Получатель:</h3>
            <div className="text-black">
              <div>{document.receiver.name}</div>
              <div>{document.receiver.address}</div>
              <div>Тел: {document.receiver.phone}</div>
              {document.receiver.inn && <div>ИНН: {document.receiver.inn}</div>}
            </div>
          </div>
        </div>

        {/* Таблица товаров */}
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-black text-left">№</th>
              <th className="border border-gray-300 p-2 text-black text-left">Наименование</th>
              <th className="border border-gray-300 p-2 text-black text-left">Кол-во</th>
              <th className="border border-gray-300 p-2 text-black text-left">Ед.</th>
              <th className="border border-gray-300 p-2 text-black text-left">Вес</th>
              <th className="border border-gray-300 p-2 text-black text-left">Стоимость</th>
            </tr>
          </thead>
          <tbody>
            {document.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 text-black">{index + 1}</td>
                <td className="border border-gray-300 p-2 text-black">{item.name}</td>
                <td className="border border-gray-300 p-2 text-black">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-black">{item.unit}</td>
                <td className="border border-gray-300 p-2 text-black">{item.weight} кг</td>
                <td className="border border-gray-300 p-2 text-black">{item.value} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Итоги */}
        <div className="flex justify-between items-start">
          <div className="text-black">
            <div>Общий вес: {document.totalWeight} кг</div>
            {document.totalValue && <div>Общая стоимость: {document.totalValue} ₽</div>}
          </div>
          <div className="text-center">
            <div className="mb-4">
              {/* Штрих-код (заглушка) */}
              <div className="bg-black text-white p-2 text-xs font-mono inline-block">
                {document.barcode}
              </div>
            </div>
            <div className="text-black border-t border-gray-300 pt-2">
              Подпись отправителя: _________________
            </div>
          </div>
        </div>

        {document.notes && (
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-black text-sm">Примечание: {document.notes}</div>
          </div>
        )}
      </div>

      {/* Действия с документом */}
      <div className="flex gap-3">
        <button className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white">
          📥 Скачать PDF
        </button>
        <button className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-colors text-white">
          🖨️ Печать
        </button>
        <button className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors text-white">
          📧 Отправить по email
        </button>
        <button className="px-6 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 transition-colors text-white">
          ✏️ Редактировать
        </button>
      </div>
    </div>
  );
}

function DocumentList({ documents, onDocumentSelect }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">История документов</h3>
      <div className="space-y-3">
        {documents.map((doc: Document) => (
          <div
            key={doc.id}
            onClick={() => onDocumentSelect(doc)}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {doc.type === 'ttn' && '📄'}
                  {doc.type === 'invoice' && '🧾'}
                  {doc.type === 'act' && '📑'}
                  {doc.type === 'waybill' && '🗺️'}
                </div>
                <div>
                  <div className="font-semibold text-white">{doc.number}</div>
                  <div className="text-sm text-gray-400">
                    Заказ {doc.orderId} • {new Date(doc.date).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`
                  text-xs px-2 py-1 rounded-full
                  ${doc.status === 'issued' ? 'bg-green-500/20 text-green-400' : ''}
                  ${doc.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                  ${doc.status === 'signed' ? 'bg-blue-500/20 text-blue-400' : ''}
                `}>
                  {doc.status === 'issued' && 'Выдан'}
                  {doc.status === 'draft' && 'Черновик'}
                  {doc.status === 'signed' && 'Подписан'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {doc.items.length} позиций
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Documents() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(mockDocuments[0]);
  const [selectedType, setSelectedType] = useState('ttn');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => doc.type === selectedType);
  }, [selectedType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Генерация документов</h1>
          <p className="text-gray-400 mt-2">Создание и управление накладными, актами и отчётами</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white"
        >
          + Создать документ
        </button>
      </div>

      {/* Document Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {documentTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedType === type.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <div className="font-semibold text-white text-sm">{type.name}</div>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DocumentList
            documents={filteredDocuments}
            onDocumentSelect={setSelectedDocument}
          />
        </div>
        
        <div className="lg:col-span-2">
          {selectedDocument ? (
            <DocumentPreview document={selectedDocument} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-white mb-2">Выберите документ</h3>
              <p className="text-gray-400">Выберите документ из списка для просмотра и редактирования</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Document Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Создать новый документ</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Тип документа</label>
                <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                  {documentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Номер заказа</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  placeholder="ORD-001"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    alert('Документ создан!');
                  }}
                  className="px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}