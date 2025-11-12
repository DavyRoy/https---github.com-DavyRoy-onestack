import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ReviewsManager = dynamic(() => import('@/modules/autoservice/Reviews'), {
  loading: () => <ReviewsSkeleton />
});

const ReviewStats = dynamic(() => import('./components/ReviewStats'), {
  loading: () => <StatsSkeleton />
});

/* ===================== Skeleton Components ===================== */
function ReviewsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
                <div>
                  <div className="h-5 w-32 rounded bg-white/10 animate-pulse mb-1" />
                  <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="h-5 w-24 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-12 rounded bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== Header Component ===================== */
function ModuleHeader() {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-sm text-white/60">
            <Link href="/demo" className="hover:text-white transition-colors">
              Демо
            </Link>
            <span>→</span>
            <Link href="/demo/autoservice" className="hover:text-white transition-colors">
              Автосервис
            </Link>
            <span>→</span>
            <Link href="/demo/autoservice/user" className="hover:text-white transition-colors">
              Клиент
            </Link>
            <span>→</span>
            <span className="text-white">Рейтинг и отзывы</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
              ⭐ Оставить отзыв
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              📊 Статистика
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              ❓ Помощь
            </button>
            <Link
              href="/demo/autoservice/user"
              className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              ← Назад
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(234, 179, 8, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(59, 130, 246, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <ModuleHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Рейтинг и отзывы
          </h1>
          <p className="text-white/60 text-lg">
            Поделитесь своим опытом и узнайте мнение других клиентов
          </p>
        </section>

        {/* Rating Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">4.7</div>
            <div className="text-white/60 text-sm">Общий рейтинг</div>
            <div className="text-yellow-400 text-xs mt-1">⭐ ⭐ ⭐ ⭐ ⭐</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">156</div>
            <div className="text-white/60 text-sm">Всего отзывов</div>
            <div className="text-green-400 text-xs mt-1">+12 за месяц</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">92%</div>
            <div className="text-white/60 text-sm">Рекомендуют</div>
            <div className="text-blue-400 text-xs mt-1">NPS +64</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">4.2</div>
            <div className="text-white/60 text-sm">Ваша средняя оценка</div>
            <div className="text-orange-400 text-xs mt-1">3 отзыва</div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Reviews Content */}
          <div className="lg:col-span-3">
            <ReviewsManager />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ReviewStats />
            
            {/* Quick Review */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Быстрый отзыв</h3>
              <div className="space-y-3">
                <div className="text-center text-2xl">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                      ⭐
                    </button>
                  ))}
                </div>
                <button className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg py-3 hover:bg-blue-500/30 transition-colors">
                  Оценить последний визит
                </button>
              </div>
            </div>

            {/* Review Guidelines */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">📝 Советы по отзывам</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p>• Опишите ваш опыт подробно</p>
                <p>• Отметьте конкретных мастеров</p>
                <p>• Укажите, что понравилось</p>
                <p>• Предложите улучшения</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}