'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Integrations from '@/modules/logistics/Integrations';

export default function IntegrationsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад
              </button>
              <span className="text-gray-600">/</span>
              <span className="text-white font-medium">API-интеграции</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                ℹ️
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        <Integrations />
      </main>
    </div>
  );
}