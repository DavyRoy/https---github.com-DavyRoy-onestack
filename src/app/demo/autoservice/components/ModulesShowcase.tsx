'use client';

import React from 'react';
import Link from 'next/link';
import { AUTOSERVICE_MODULES } from '../config';

const TYPE_BADGES = {
  form: { label: 'Форма', color: 'bg-blue-500/20 text-blue-300' },
  table: { label: 'Таблица', color: 'bg-green-500/20 text-green-300' },
  calendar: { label: 'Календарь', color: 'bg-purple-500/20 text-purple-300' },
  gallery: { label: 'Галерея', color: 'bg-pink-500/20 text-pink-300' },
  analytics: { label: 'Аналитика', color: 'bg-orange-500/20 text-orange-300' },
  billing: { label: 'Оплата', color: 'bg-emerald-500/20 text-emerald-300' }
};

const ROLE_BADGES = {
  user: { label: 'Клиент', color: 'bg-gray-500/20 text-gray-300' },
  manager: { label: 'Мастер', color: 'bg-yellow-500/20 text-yellow-300' },
  owner: { label: 'Директор', color: 'bg-red-500/20 text-red-300' }
};

export default function ModulesShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Все модули системы
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          10 ключевых модулей для полного цикла управления автосервисом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-rows-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {AUTOSERVICE_MODULES.map((module) => (
          <Link
            key={module.id}
            href={module.path}
            className="group relative rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:scale-105"
          >
            {/* Module Icon */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">{module.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white flex-1">{module.title}</h3>
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              {module.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_BADGES[module.type].color}`}>
                {TYPE_BADGES[module.type].label}
              </span>
              {module.roles.map((role) => (
                <span
                  key={role}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_BADGES[role].color}`}
                >
                  {ROLE_BADGES[role].label}
                </span>
              ))}
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white/60">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}