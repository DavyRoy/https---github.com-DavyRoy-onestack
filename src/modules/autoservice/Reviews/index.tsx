'use client';

import React, { useState } from 'react';

interface Review {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  master?: string;
  likes: number;
  isLiked: boolean;
  status: 'published' | 'pending' | 'rejected';
  photos?: string[];
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    clientName: 'Александр Петров',
    clientAvatar: 'AP',
    rating: 5,
    comment: 'Отличный сервис! Быстро выполнили замену масла и диагностику. Мастер Иван очень внимательный и профессиональный. Рекомендую!',
    date: '15.12.2023',
    service: 'Замена масла + диагностика',
    master: 'Иван Петров',
    likes: 12,
    isLiked: false,
    status: 'published',
    photos: ['/api/placeholder/300/200', '/api/placeholder/300/200']
  },
  {
    id: '2',
    clientName: 'Мария Сидорова',
    clientAvatar: 'МС',
    rating: 4,
    comment: 'Хороший сервис, но пришлось ждать дольше обещанного. Работу выполнили качественно, машина работает отлично.',
    date: '14.12.2023',
    service: 'Ремонт подвески',
    master: 'Алексей Смирнов',
    likes: 8,
    isLiked: true,
    status: 'published'
  },
  {
    id: '3',
    clientName: 'Дмитрий Иванов',
    clientAvatar: 'ДИ',
    rating: 5,
    comment: 'Лучший автосервис в городе! Честные цены, профессиональные мастера. Буду обращаться только сюда.',
    date: '12.12.2023',
    service: 'Полное ТО',
    master: 'Михаил Козлов',
    likes: 15,
    isLiked: false,
    status: 'published'
  },
  {
    id: '4',
    clientName: 'Ольга Козлова',
    clientAvatar: 'ОК',
    rating: 3,
    comment: 'Качество работ нормальное, но цены завышены. Мастер работал медленно.',
    date: '10.12.2023',
    service: 'Замена тормозных колодок',
    likes: 3,
    isLiked: false,
    status: 'published'
  }
];

const MY_REVIEWS: Review[] = [
  {
    id: 'my1',
    clientName: 'Вы',
    clientAvatar: 'В',
    rating: 5,
    comment: 'Отличный сервис, всё быстро и качественно! Особенно понравился мастер Иван - очень внимательный и профессиональный.',
    date: '08.12.2023',
    service: 'Диагностика ходовой части',
    master: 'Иван Петров',
    likes: 5,
    isLiked: false,
    status: 'published'
  },
  {
    id: 'my2',
    clientName: 'Вы',
    clientAvatar: 'В',
    rating: 4,
    comment: 'Хорошая работа, но пришлось немного подождать. В целом доволен.',
    date: '15.11.2023',
    service: 'Замена масла',
    likes: 2,
    isLiked: false,
    status: 'published'
  }
];

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [myReviews, setMyReviews] = useState<Review[]>(MY_REVIEWS);
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'new'>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    service: '',
    master: ''
  });

  const toggleLike = (reviewId: string) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? {
            ...review,
            likes: review.isLiked ? review.likes - 1 : review.likes + 1,
            isLiked: !review.isLiked
          }
        : review
    ));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    const review: Review = {
      id: `new-${Date.now()}`,
      clientName: 'Вы',
      clientAvatar: 'В',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('ru-RU'),
      service: newReview.service || 'Последний визит',
      master: newReview.master,
      likes: 0,
      isLiked: false,
      status: 'published'
    };

    setMyReviews(prev => [review, ...prev]);
    setReviews(prev => [review, ...prev]);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '', service: '', master: '' });
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={`text-2xl transition-transform ${
              interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
            } ${
              star <= rating ? 'text-yellow-400' : 'text-white/20'
            }`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  const displayedReviews = activeTab === 'my' ? myReviews : reviews;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Все отзывы
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'my'
              ? 'border-green-500 text-green-400'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Мои отзывы
        </button>
        <button
          onClick={() => setShowReviewForm(true)}
          className="px-4 py-3 border-b-2 border-transparent text-orange-400 hover:text-orange-300 transition-colors"
        >
          + Новый отзыв
        </button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Новый отзыв</h2>
              <button
                onClick={() => setShowReviewForm(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-4">
                  Ваша оценка
                </label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>

              {/* Service */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Услуга
                </label>
                <input
                  type="text"
                  value={newReview.service}
                  onChange={(e) => setNewReview(prev => ({ ...prev, service: e.target.value }))}
                  placeholder="Например: Замена масла, Диагностика..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 placeholder-white/30"
                />
              </div>

              {/* Master */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Мастер (если помните)
                </label>
                <input
                  type="text"
                  value={newReview.master}
                  onChange={(e) => setNewReview(prev => ({ ...prev, master: e.target.value }))}
                  placeholder="Имя мастера..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 placeholder-white/30"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Ваш отзыв
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  required
                  rows={6}
                  placeholder="Поделитесь вашими впечатлениями о сервисе..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 placeholder-white/30 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg py-3 hover:bg-green-500/30 transition-colors"
                >
                  Опубликовать отзыв
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map(review => (
          <div
            key={review.id}
            className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-semibold">
                  {review.clientAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{review.clientName}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <span>{review.date}</span>
                    {review.master && (
                      <>
                        <span>•</span>
                        <span>Мастер: {review.master}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {renderStars(review.rating)}
                <div className="text-white/60 text-sm mt-1">{review.service}</div>
              </div>
            </div>

            <p className="text-white/80 mb-4 leading-relaxed">{review.comment}</p>

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
              <div className="flex gap-2 mb-4">
                {review.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <span className="text-white/40">📷</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => toggleLike(review.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  review.isLiked
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                ❤️ {review.likes}
              </button>

              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors text-sm">
                  Ответить
                </button>
                {review.clientName === 'Вы' && (
                  <button className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                    Редактировать
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-white/60 mb-4">
            {activeTab === 'my' 
              ? 'У вас пока нет отзывов' 
              : 'Отзывы не найдены'
            }
          </p>
          {activeTab === 'my' && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Написать первый отзыв
            </button>
          )}
        </div>
      )}

      {/* Load More */}
      {displayedReviews.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            Загрузить еще отзывы
          </button>
        </div>
      )}
    </div>
  );
}