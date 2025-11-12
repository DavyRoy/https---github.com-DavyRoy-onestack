'use client';

import React from 'react';
import Link from 'next/link';
import { AutoserviceModule } from '../config';

interface ModulesGridProps {
  modules: AutoserviceModule[];
}

const TYPE_BADGES = {
  form: { label: 'Форма', color: 'bg-blue-500/20 text-blue-300' },
  table: { label: 'Таблица', color: 'bg-green-500/20 text-green-300' },
  calendar: { label: 'Календарь', color: 'bg-purple-500/20 text-purple-300' },
  gallery: { label: 'Галерея', color: 'bg-pink-500/20 text-pink-300' },
  analytics: { label: 'Аналитика', color: 'bg-orange-500/20 text-orange-300' },
  billing: { label: 'Оплата', color: 'bg-emerald-500/20 text-emerald-300' }
};

export default function ModulesGrid({ modules }: ModulesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <Link
          key={module.id}
          href={module.path}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105"
        >
          {/* Module Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
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
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60">
              Доступен
            </span>
          </div>

          {/* Hover Indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white/60">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}