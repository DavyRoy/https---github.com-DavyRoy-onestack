'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { reviews, reviewStats, pendingReviews, Review, ReviewStats } from './demo-data';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

// Форматирование чисел без использования locale для избежания ошибок гидрации
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Форматирование даты с фиксированной локалью
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'pending'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState<ReviewStats>(reviewStats);

  // Исправление для гидрации - рендерим только на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my' && review.patientName === 'Иванов Алексей') ||
                      (activeTab === 'pending' && review.status === 'pending');
      const matchesRating = ratingFilter === null || review.rating === ratingFilter;
      return matchesTab && matchesRating;
    });
  }, [activeTab, ratingFilter]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [filteredReviews, sortBy]);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };

    return (
      <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${
              star <= rating ? 'text-yellow-400' : 'text-white/20'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getRatingPercentage = (rating: number) => {
    const total = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);
    return ((stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / total) * 100);
  };

  const getSpecializationIcon = (spec: string) => {
    const icons: Record<string, string> = {
      'Терапевт': '👨‍⚕️',
      'Кардиолог': '❤️',
      'Невролог': '🧠',
      'Офтальмолог': '👁️',
      'Стоматолог': '🦷',
      'Дерматолог': '🔬',
      'Педиатр': '👶',
      'Хирург': '🔪',
      'Гастроэнтеролог': '🍽️',
      'Эндокринолог': '🦋'
    };
    return icons[spec] || '👨‍⚕️';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Опубликован';
      case 'pending': return 'На модерации';
      case 'rejected': return 'Отклонён';
      default: return status;
    }
  };

  // Статистика для табов
  const tabStats = useMemo(() => ({
    all: reviews.length,
    my: reviews.filter(r => r.patientName === 'Иванов Алексей').length,
    pending: pendingReviews.length
  }), []);

  // Не рендерим контент до гидрации
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/demo/medicine/user"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="text-lg">←</span>
                  <span>Назад к дашборду</span>
                </Link>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Отзывы пациентов</h1>
              <p className="text-white/60 text-sm lg:text-base">
                Оценка качества обслуживания и обратная связь от пациентов
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            <InteractiveCard className="p-3 lg:p-4 text-center">
              <div className="text-lg lg:text-2xl font-bold text-white mb-1">{stats.totalReviews}</div>
              <div className="text-white/60 text-xs lg:text-sm">Всего отзывов</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-yellow-500/10 border-yellow-500/20">
              <div className="text-lg lg:text-2xl font-bold text-yellow-400 mb-1">{stats.averageRating}</div>
              <div className="text-yellow-400/60 text-xs lg:text-sm">Средняя оценка</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-green-500/10 border-green-500/20">
              <div className="text-lg lg:text-2xl font-bold text-green-400 mb-1">
                {stats.ratingDistribution[5]}
              </div>
              <div className="text-green-400/60 text-xs lg:text-sm">Пятерок</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-blue-500/10 border-blue-500/20">
              <div className="text-lg lg:text-2xl font-bold text-blue-400 mb-1">
                {pendingReviews.length}
              </div>
              <div className="text-blue-400/60 text-xs lg:text-sm">На модерации</div>
            </InteractiveCard>
          </div>

          {/* Tabs and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* View Toggle */}
              <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
                {[
                  { value: 'all', label: 'Все отзывы', count: tabStats.all },
                  { value: 'my', label: 'Мои отзывы', count: tabStats.my },
                  { value: 'pending', label: 'Ожидают', count: tabStats.pending }
                ].map(({ value, label, count }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === value
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="hidden xs:inline">{label}</span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Rating Filter */}
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => setRatingFilter(null)}
                  className={`px-3 py-2 rounded-2xl text-sm font-medium border transition-all duration-200 ${
                    ratingFilter === null
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Все оценки
                </motion.button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <motion.button
                    key={rating}
                    onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                    className={`px-3 py-2 rounded-2xl text-sm font-medium border transition-all duration-200 ${
                      ratingFilter === rating
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {rating}★
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="date">По дате</option>
                <option value="rating">По оценке</option>
                <option value="helpful">По полезности</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${ratingFilter}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 lg:space-y-6"
              >
                {sortedReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InteractiveCard 
                      className="p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                      onClick={() => setSelectedReview(review)}
                    >
                      <div className="flex items-start gap-3 lg:gap-4">
                        {/* Patient Avatar */}
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-base lg:text-lg flex-shrink-0">
                          👤
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-3 lg:mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-base lg:text-lg mb-1 line-clamp-1">
                                {review.patientName}
                              </h3>
                              <p className="text-white/60 text-sm">
                                {review.patientAge} лет • {formatDateShort(review.date)}
                              </p>
                            </div>
                            
                            <div className="flex flex-col xs:flex-row gap-2">
                              <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${getStatusColor(review.status)} whitespace-nowrap`}>
                                {getStatusText(review.status)}
                              </span>
                              <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${
                                review.visitType === 'in-person' 
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  : 'bg-green-500/20 text-green-400 border-green-500/30'
                              } whitespace-nowrap`}>
                                {review.visitType === 'in-person' ? '🏥 Очно' : '📞 Онлайн'}
                              </span>
                            </div>
                          </div>

                          {/* Doctor Info */}
                          <div className="mb-3 lg:mb-4 p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 lg:gap-3">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm lg:text-base">
                                {getSpecializationIcon(review.specialization)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium text-sm lg:text-base line-clamp-1">
                                  {review.doctorName}
                                </div>
                                <div className="text-white/60 text-xs lg:text-sm line-clamp-1">
                                  {review.specialization}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg lg:text-xl font-bold text-yellow-400 mb-1">{review.rating}.0</div>
                                {renderStars(review.rating, 'sm')}
                              </div>
                            </div>
                          </div>

                          {/* Review Content */}
                          <div className="mb-3 lg:mb-4">
                            <h4 className="font-semibold text-white text-sm lg:text-base mb-2">{review.title}</h4>
                            <p className="text-white/80 text-sm lg:text-base leading-relaxed line-clamp-3">
                              {review.comment}
                            </p>
                          </div>

                          {/* Tags */}
                          {review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3 lg:mb-4">
                              {review.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 lg:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs lg:text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 lg:pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-white/60">
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Marked as helpful:', review.id);
                            }}
                            className="flex items-center gap-1 hover:text-white transition-colors group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.span
                              whileHover={{ scale: 1.2 }}
                              className="group-hover:text-green-400 transition-colors"
                            >
                              👍
                            </motion.span>
                            <span>Полезно ({review.helpful})</span>
                          </motion.button>
                          {review.replies.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>💬</span>
                              <span>{review.replies.length} ответов</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-white/60 group-hover:text-white transition-colors flex items-center gap-1 text-xs lg:text-sm">
                          <span>Подробнее</span>
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </div>
                      </div>

                      {/* Replies Preview */}
                      {review.replies.length > 0 && (
                        <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-white/10">
                          <div className="flex gap-2 lg:gap-3">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs lg:text-sm">
                              {review.replies[0].role === 'doctor' ? '👨‍⚕️' : '💼'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium text-xs lg:text-sm line-clamp-1">
                                  {review.replies[0].author}
                                </span>
                                <span className="text-white/40 text-xs">
                                  {formatDateShort(review.replies[0].date)}
                                </span>
                              </div>
                              <p className="text-white/70 text-xs lg:text-sm line-clamp-2">
                                {review.replies[0].message}
                              </p>
                            </div>
                          </div>
                          {review.replies.length > 1 && (
                            <div className="text-center mt-2">
                              <button className="text-blue-400 hover:text-blue-300 text-xs lg:text-sm">
                                Показать все {review.replies.length} ответов
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </InteractiveCard>
                  </motion.div>
                ))}

                {sortedReviews.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <InteractiveCard className="p-8 lg:p-12 text-center">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl lg:text-3xl mb-4 lg:mb-6 mx-auto">
                        📝
                      </div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 lg:mb-3">Отзывы не найдены</h3>
                      <p className="text-white/60 text-sm lg:text-base mb-6 lg:mb-8">
                        Попробуйте изменить параметры поиска или фильтрации
                      </p>
                      <motion.button
                        onClick={() => {
                          setActiveTab('all');
                          setRatingFilter(null);
                        }}
                        className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-sm lg:text-base font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>🔄</span>
                        <span>Сбросить фильтры</span>
                      </motion.button>
                    </InteractiveCard>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Rating Overview */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">⭐ Общая оценка</h3>
              <div className="text-center mb-4 lg:mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stats.averageRating}</div>
                {renderStars(Math.round(stats.averageRating), 'lg')}
                <div className="text-white/60 text-xs lg:text-sm mt-2">
                  {formatNumber(stats.totalReviews)} отзывов
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2 lg:space-y-3">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2 lg:gap-3">
                    <div className="flex items-center gap-1 w-12 lg:w-14">
                      <span className="text-white/80 text-xs lg:text-sm">{rating}</span>
                      <span className="text-yellow-400 text-xs lg:text-sm">★</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getRatingPercentage(rating)}%` }}
                        transition={{ duration: 1, delay: rating * 0.1 }}
                        className="bg-yellow-400 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-white/60 text-xs lg:text-sm w-6 lg:w-8 text-right">
                      {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </InteractiveCard>

            {/* Specialization Ratings */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">🏥 По специализациям</h3>
              <div className="space-y-3 lg:space-y-4">
                {stats.bySpecialization.map((spec, index) => (
                  <motion.div
                    key={spec.specialization}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs lg:text-sm">
                        {getSpecializationIcon(spec.specialization)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-medium text-xs lg:text-sm line-clamp-1">
                          {spec.specialization}
                        </div>
                        <div className="text-white/60 text-xs">{spec.totalReviews} отзывов</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium text-sm lg:text-lg">{spec.averageRating}</div>
                      {renderStars(Math.round(spec.averageRating), 'sm')}
                    </div>
                  </motion.div>
                ))}
              </div>
            </InteractiveCard>

            {/* Write Review CTA */}
            <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl lg:text-2xl mb-3 lg:mb-4 mx-auto">
                ✏️
              </div>
              <h3 className="font-semibold text-white text-sm lg:text-base mb-2">Оставить отзыв</h3>
              <p className="text-white/60 text-xs lg:text-sm mb-4 lg:mb-6">
                Поделитесь вашим опытом посещения клиники
              </p>
              <motion.button 
                onClick={() => setShowWriteReview(true)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-xs lg:text-sm font-medium text-white flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>📝</span>
                <span>Написать отзыв</span>
              </motion.button>
            </InteractiveCard>

            {/* Quick Stats */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">📊 Статистика</h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs lg:text-sm">Всего ответов</span>
                  <span className="text-white font-medium text-sm lg:text-base">
                    {reviews.reduce((acc, review) => acc + review.replies.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs lg:text-sm">Полезных оценок</span>
                  <span className="text-white font-medium text-sm lg:text-base">
                    {reviews.reduce((acc, review) => acc + review.helpful, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs lg:text-sm">Онлайн-консультаций</span>
                  <span className="text-white font-medium text-sm lg:text-base">
                    {reviews.filter(r => r.visitType === 'online').length}
                  </span>
                </div>
              </div>
            </InteractiveCard>
          </div>
        </div>

        {/* Review Detail Modal */}
        <AnimatePresence>
          {selectedReview && (
            <ReviewDetailModal
              review={selectedReview}
              onClose={() => setSelectedReview(null)}
              formatDate={formatDate}
              formatDateShort={formatDateShort}
              renderStars={renderStars}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getSpecializationIcon={getSpecializationIcon}
            />
          )}
        </AnimatePresence>

        {/* Write Review Modal */}
        <AnimatePresence>
          {showWriteReview && (
            <WriteReviewModal onClose={() => setShowWriteReview(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Компонент модального окна деталей отзыва
const ReviewDetailModal = ({ 
  review, 
  onClose, 
  formatDate, 
  formatDateShort, 
  renderStars, 
  getStatusColor, 
  getStatusText, 
  getSpecializationIcon 
}: any) => {
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
        className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-white/10 sticky top-0 bg-slate-900 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Детали отзыва</h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-white text-lg">✕</span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Review Header */}
          <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/10 flex items-center justify-center text-xl lg:text-2xl">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base lg:text-lg mb-1 line-clamp-1">
                    {review.patientName}
                  </h3>
                  <p className="text-white/60 text-sm lg:text-base">
                    {review.patientAge} лет • {formatDate(review.date)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${getStatusColor(review.status)} whitespace-nowrap`}>
                      {getStatusText(review.status)}
                    </span>
                    <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${
                      review.visitType === 'in-person' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    } whitespace-nowrap`}>
                      {review.visitType === 'in-person' ? '🏥 Очный приём' : '📞 Онлайн-консультация'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-400 mb-1">{review.rating}.0</div>
                {renderStars(review.rating, 'lg')}
              </div>
            </div>
          </InteractiveCard>

          {/* Doctor Info */}
          <div>
            <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3">👨‍⚕️ Врач</h4>
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg lg:text-xl">
                  {getSpecializationIcon(review.specialization)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm lg:text-lg line-clamp-1">
                    {review.doctorName}
                  </div>
                  <div className="text-white/60 text-sm lg:text-base">{review.specialization}</div>
                </div>
              </div>
            </InteractiveCard>
          </div>

          {/* Review Content */}
          <div>
            <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3">📝 Отзыв</h4>
            <InteractiveCard className="p-3 lg:p-4">
              <h3 className="font-bold text-white text-base lg:text-lg mb-2 lg:mb-3">{review.title}</h3>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed">{review.comment}</p>
            </InteractiveCard>
          </div>

          {/* Tags */}
          {review.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3">🏷️ Теги</h4>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 lg:px-3 py-1 lg:py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs lg:text-sm hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Replies */}
          {review.replies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <h4 className="font-semibold text-white text-sm lg:text-base">💬 Ответы ({review.replies.length})</h4>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {review.replies.map((reply: any) => (
                  <InteractiveCard key={reply.id} className="p-3 lg:p-4">
                    <div className="flex items-start gap-2 lg:gap-3">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center text-xs lg:text-sm ${
                        reply.role === 'doctor' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {reply.role === 'doctor' ? '👨‍⚕️' : '💼'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-white font-medium text-sm lg:text-base">{reply.author}</span>
                          <span className="text-white/40 text-xs lg:text-sm">
                            {formatDate(reply.date)}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs ${
                            reply.role === 'doctor' 
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {reply.role === 'doctor' ? 'Врач' : 'Администрация'}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm lg:text-base">{reply.message}</p>
                      </div>
                    </div>
                  </InteractiveCard>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            <InteractiveCard className="p-3 lg:p-4 text-center bg-green-500/10 border-green-500/20">
              <div className="text-xl lg:text-2xl font-bold text-green-400 mb-1">{review.helpful}</div>
              <div className="text-green-400/60 text-xs lg:text-sm">Полезных оценок</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-blue-500/10 border-blue-500/20">
              <div className="text-xl lg:text-2xl font-bold text-blue-400 mb-1">{review.replies.length}</div>
              <div className="text-blue-400/60 text-xs lg:text-sm">Ответов</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-purple-500/10 border-purple-500/20">
              <div className="text-xl lg:text-2xl font-bold text-purple-400 mb-1">{review.rating}.0</div>
              <div className="text-purple-400/60 text-xs lg:text-sm">Оценка</div>
            </InteractiveCard>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 pt-4 border-t border-white/10">
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium text-xs lg:text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>👍</span>
              <span>Полезно</span>
            </motion.button>
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors font-medium text-blue-400 text-xs lg:text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>💬</span>
              <span>Ответить</span>
            </motion.button>
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-colors font-medium text-white text-xs lg:text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>📤</span>
              <span>Поделиться</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Компонент модального окна написания отзыва
const WriteReviewModal = ({ onClose }: { onClose: () => void }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doctors = [
    { id: 'doc-1', name: 'Иванов Алексей Сергеевич', specialization: 'Терапевт' },
    { id: 'doc-2', name: 'Петрова Мария Ивановна', specialization: 'Кардиолог' },
    { id: 'doc-3', name: 'Сидоров Владимир Петрович', specialization: 'Невролог' },
    { id: 'doc-4', name: 'Козлова Елена Викторовна', specialization: 'Офтальмолог' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки отзыва
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Review submitted:', {
      rating,
      title,
      comment,
      doctor: selectedDoctor
    });

    setIsSubmitting(false);
    onClose();
    
    // Здесь можно добавить уведомление об успешной отправке
    alert('Отзыв успешно отправлен на модерацию!');
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
        className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Написать отзыв</h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-white text-lg">✕</span>
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
              Выберите врача *
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-colors text-white text-sm lg:text-base"
            >
              <option value="">Выберите врача</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
              Ваша оценка *
            </label>
            <div className="flex gap-1 lg:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl lg:text-3xl transition-transform hover:scale-110 ${
                    star <= rating ? 'text-yellow-400' : 'text-white/20'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="text-white/60 text-sm mt-2">
              {rating === 5 && 'Отлично'}
              {rating === 4 && 'Хорошо'}
              {rating === 3 && 'Удовлетворительно'}
              {rating === 2 && 'Плохо'}
              {rating === 1 && 'Очень плохо'}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Заголовок отзыва *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Например: Отличный врач, рекомендую!"
              className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-colors text-white placeholder-white/40 text-sm lg:text-base"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Текст отзыва *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={6}
              placeholder="Опишите ваш опыт посещения врача..."
              className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-colors text-white placeholder-white/40 resize-none text-sm lg:text-base"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !selectedDoctor || !title || !comment}
            className="w-full py-2 lg:py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 disabled:text-white/40 disabled:cursor-not-allowed transition-colors font-medium text-white flex items-center justify-center gap-2 text-sm lg:text-base"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <span>📝</span>
                <span>Отправить отзыв</span>
              </>
            )}
          </motion.button>

          <div className="text-center text-white/40 text-xs lg:text-sm">
            Отзыв будет опубликован после проверки модератором
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};