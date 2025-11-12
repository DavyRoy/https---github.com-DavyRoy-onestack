'use client';

import React, { useState } from 'react';

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  timestamp: string;
  stage: 'diagnostics' | 'repair' | 'completion';
  category: string;
  author: string;
}

const REPAIR_STAGES = [
  { id: 'diagnostics', name: 'Диагностика', icon: '🔍', color: 'blue' },
  { id: 'repair', name: 'Ремонт', icon: '🔧', color: 'orange' },
  { id: 'completion', name: 'Завершение', icon: '✅', color: 'green' }
];

const SAMPLE_PHOTOS: Photo[] = [
  {
    id: '1',
    url: '/api/placeholder/400/300',
    title: 'Тормозные колодки - до',
    description: 'Сильный износ тормозных колодок',
    timestamp: '2023-12-15 09:30',
    stage: 'diagnostics',
    category: 'Тормозная система',
    author: 'Иван Петров'
  },
  {
    id: '2',
    url: '/api/placeholder/400/300',
    title: 'Замена колодок',
    description: 'Процесс установки новых колодок',
    timestamp: '2023-12-15 11:15',
    stage: 'repair',
    category: 'Тормозная система',
    author: 'Иван Петров'
  },
  {
    id: '3',
    url: '/api/placeholder/400/300',
    title: 'Тормозные колодки - после',
    description: 'Установлены новые колодки Brembo',
    timestamp: '2023-12-15 12:45',
    stage: 'completion',
    category: 'Тормозная система',
    author: 'Иван Петров'
  },
  {
    id: '4',
    url: '/api/placeholder/400/300',
    title: 'Диагностика подвески',
    description: 'Проверка амортизаторов и сайлентблоков',
    timestamp: '2023-12-15 10:00',
    stage: 'diagnostics',
    category: 'Ходовая часть',
    author: 'Иван Петров'
  }
];

export default function PhotoReport() {
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredPhotos = selectedStage === 'all' 
    ? photos 
    : photos.filter(photo => photo.stage === selectedStage);

  const getStageColor = (stage: string) => {
    const stageConfig = REPAIR_STAGES.find(s => s.id === stage);
    switch (stageConfig?.color) {
      case 'blue': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'orange': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'green': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        title: `Новое фото ${index + 1}`,
        description: '',
        timestamp: new Date().toLocaleString('ru-RU'),
        stage: 'diagnostics',
        category: 'Новая категория',
        author: 'Иван Петров'
      }));

      setPhotos(prev => [...newPhotos, ...prev]);
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
        <div className="flex flex-wrap gap-2">
          {/* Stage Filter */}
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedStage === 'all'
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            Все этапы
          </button>
          {REPAIR_STAGES.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                selectedStage === stage.id
                  ? getStageColor(stage.id)
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>{stage.icon}</span>
              <span>{stage.name}</span>
            </button>
          ))}
        </div>

        {/* Upload Button */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <button
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              isUploading
                ? 'bg-orange-500/20 border-orange-500/30 text-orange-300'
                : 'bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30'
            }`}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-orange-300 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                📸 Загрузить фото
              </>
            )}
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhotos.map(photo => (
          <div
            key={photo.id}
            className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Photo */}
            <div className="aspect-video bg-white/5 relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-white/20">
                📷 Изображение
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(photo.stage)}`}>
                  {REPAIR_STAGES.find(s => s.id === photo.stage)?.icon}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium text-white mb-1 truncate">{photo.title}</h3>
              <p className="text-white/60 text-sm mb-2 line-clamp-2">{photo.description}</p>
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{photo.timestamp}</span>
                <span>{photo.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-white/60 mb-4">Нет фотографий для выбранного этапа</p>
          <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
            Сделать первое фото
          </button>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">{selectedPhoto.title}</h2>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photo */}
                <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center">
                  <span className="text-white/40 text-lg">📷 Увеличенное изображение</span>
                </div>
                
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm">Описание</label>
                    <p className="text-white mt-1">{selectedPhoto.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm">Этап</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(selectedPhoto.stage)}`}>
                          {REPAIR_STAGES.find(s => s.id === selectedPhoto.stage)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm">Категория</label>
                      <p className="text-white mt-1">{selectedPhoto.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm">Автор</label>
                      <p className="text-white mt-1">{selectedPhoto.author}</p>
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm">Время</label>
                      <p className="text-white mt-1">{selectedPhoto.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg py-2 hover:bg-blue-500/30 transition-colors">
                      Редактировать
                    </button>
                    <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 hover:bg-white/10 transition-colors">
                      Скачать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}