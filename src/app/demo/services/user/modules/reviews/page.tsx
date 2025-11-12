'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  serviceName: string;
  date: string;
  rating: number;
  comment: string;
  userName: string;
  status: 'published' | 'pending' | 'rejected';
  managerResponse?: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  canReview: boolean;
}

const MY_REVIEWS: Review[] = [
  {
    id: '1',
    serviceName: 'Стрижка мужская',
    date: '2024-11-10',
    rating: 5,
    comment: 'Отличный сервис, мастер - профессионал своего дела! Очень внимательный и аккуратный.',
    userName: 'Иван П.',
    status: 'published',
    managerResponse: 'Благодарим за отзыв! Рады, что вам понравилось. Ждём снова!'
  },
  {
    id: '2',
    serviceName: 'Маникюр классический',
    date: '2024-11-08',
    rating: 4,
    comment: 'Хороший маникюр, но ждала дольше назначенного времени.',
    userName: 'Мария К.',
    status: 'published'
  }
];

const SERVICES_FOR_REVIEW: Service[] = [
  {
    id: '1',
    name: 'Стрижка мужская',
    category: 'Парикмахерская',
    canReview: true
  },
  {
    id: '2',
    name: 'Спа-процедура',
    category: 'Уход',
    canReview: true
  },
  {
    id: '3',
    name: 'Массаж расслабляющий',
    category: 'Массаж',
    canReview: false
  }
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'write-review'>('my-reviews');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!selectedService || !rating || !comment) return;
    
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedService(null);
      setRating(0);
      setComment('');
      alert('Отзыв отправлен на модерацию!');
    }, 1500);
  };

  const RatingStars = ({ rating, onRatingChange, interactive = false }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : "button"}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`text-2xl ${
            star <= rating 
              ? 'text-yellow-400' 
              : 'text-gray-400'
          } ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          disabled={!interactive}
        >
          {star <= rating ? '★' : '☆'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo/services/user"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад к дашборду
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-semibold">Отзывы и рейтинг</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Статистика
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`pb-4 px-6 border-b-2 transition-colors ${
              activeTab === 'my-reviews'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Мои отзывы ({MY_REVIEWS.length})
          </button>
          <button
            onClick={() => setActiveTab('write-review')}
            className={`pb-4 px-6 border-b-2 transition-colors ${
              activeTab === 'write-review'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Написать отзыв
          </button>
        </div>

        {activeTab === 'my-reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">История отзывов</h2>
              <div className="text-sm text-gray-400">
                Средняя оценка: <span className="text-white font-semibold">4.5</span>
              </div>
            </div>

            <div className="space-y-4">
              {MY_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{review.serviceName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <RatingStars rating={review.rating} />
                          <span>{review.date}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            review.status === 'published'
                              ? 'bg-green-500/20 text-green-300'
                              : review.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {review.status === 'published' ? 'Опубликован' : 
                             review.status === 'pending' ? 'На модерации' : 'Отклонен'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                          Редактировать
                        </button>
                      </div>
                    </div>

                    {/* Review Comment */}
                    <div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>

                    {/* Manager Response */}
                    {review.managerResponse && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-blue-400 text-lg">💬</div>
                          <div>
                            <div className="font-semibold text-blue-300 text-sm mb-1">
                              Ответ заведения
                            </div>
                            <p className="text-blue-200/80 text-sm leading-relaxed">
                              {review.managerResponse}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {MY_REVIEWS.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-30">⭐</div>
                <h3 className="text-xl font-semibold mb-2">Отзывов пока нет</h3>
                <p className="text-gray-400 mb-6">
                  Поделитесь впечатлениями о посещенных услугах
                </p>
                <button
                  onClick={() => setActiveTab('write-review')}
                  className="bg-blue-500 text-white rounded-xl px-6 py-3 hover:bg-blue-600 transition-colors"
                >
                  Написать первый отзыв
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'write-review' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Написать отзыв</h2>
              <p className="text-gray-400">
                Выберите услугу и поделитесь вашими впечатлениями
              </p>
            </div>

            {/* Service Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Выберите услугу</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES_FOR_REVIEW.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    disabled={!service.canReview}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      selectedService?.id === service.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : service.canReview
                        ? 'border-white/10 bg-white/5 hover:border-white/20'
                        : 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-sm text-gray-400">{service.category}</p>
                      {!service.canReview && (
                        <p className="text-xs text-gray-500">Отзыв уже оставлен</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Review Form */}
            {selectedService && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {selectedService.category === 'Парикмахерская' ? '💇' : 
                     selectedService.category === 'Уход' ? '🧖' : '💆'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                    <p className="text-gray-400 text-sm">{selectedService.category}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Ваша оценка</label>
                    <RatingStars 
                      rating={rating} 
                      onRatingChange={setRating}
                      interactive 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Комментарий</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Поделитесь вашими впечатлениями о услуге..."
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="text-right text-sm text-gray-400 mt-2">
                      {comment.length}/500 символов
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      setRating(0);
                      setComment('');
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!rating || !comment || isSubmitting}
                    className="flex-1 bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Отправка...' : 'Опубликовать отзыв'}
                  </button>
                </div>
              </div>
            )}

            {!selectedService && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 opacity-30">📝</div>
                <p className="text-gray-400">
                  Выберите услугу, чтобы написать отзыв
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}