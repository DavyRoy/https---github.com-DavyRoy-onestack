import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const RepairRequestForm = dynamic(() => import('@/modules/autoservice/RepairRequest'), {
  loading: () => <FormSkeleton />
});

const RequestHistory = dynamic(() => import('./components/RequestHistory'), {
  loading: () => <HistorySkeleton />
});

/* ===================== Skeleton Components ===================== */
function FormSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-5 w-32 rounded bg-white/10 animate-pulse" />
            <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
          </div>
        ))}
        <div className="h-12 w-40 rounded-xl bg-white/10 animate-pulse mt-6" />
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-8 w-48 rounded-lg bg-white/10 animate-pulse mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
            <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-48 rounded bg-white/10 animate-pulse mb-2" />
              <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
            </div>
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
            <span className="text-white">Онлайн-заявка</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
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

/* ===================== Main Module Component ===================== */
export default function RepairRequestPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(120, 119, 198, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(255, 138, 0, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <ModuleHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Онлайн-заявка на ремонт
          </h1>
          <p className="text-white/60 text-lg">
            Запишитесь на ремонт или техническое обслуживание вашего автомобиля
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <RepairRequestForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RequestHistory />
            
            {/* Info Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Как это работает</h3>
              <div className="space-y-3 text-sm text-white/60">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">1.</span>
                  <p>Заполните заявку с описанием проблемы</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">2.</span>
                  <p>Мастер свяжется для уточнения деталей</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">3.</span>
                  <p>Получите расчёт стоимости и дату ремонта</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p>📞 +7 (495) 123-45-67</p>
                <p>🕒 9:00 - 21:00 ежедневно</p>
                <p>📍 Москва, ул. Автосервисная, 15</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}