'use client';

import React from 'react';
import Link from 'next/link';
import { AUTOSERVICE_ROLES } from '../config';

export default function RolePreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Выберите свою роль
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Исследуйте возможности системы с точки зрения разных участников процесса
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Object.entries(AUTOSERVICE_ROLES).map(([roleKey, role]) => (
          <div
            key={roleKey}
            className="group relative rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur hover:bg-white/10 transition-all duration-300 hover:border-white/20"
          >
            {/* Role Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">
                  {roleKey === 'user' ? '👤' : roleKey === 'manager' ? '🔧' : '👑'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
              <p className="text-white/60 text-sm">{role.description}</p>
            </div>

            {/* KPI Cards */}
            <div className="space-y-4 mb-8">
              {role.kpi.map((kpi, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors"
                >
                  <span className="text-white/70 text-sm">{kpi.title}</span>
                  <div className="text-right">
                    <div className="text-white font-semibold">{kpi.value}</div>
                    {kpi.change && (
                      <div className="text-xs text-green-400">{kpi.change}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 mb-8">
              <h4 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">
                Быстрые действия
              </h4>
              {role.quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group/action"
                >
                  <span className="text-lg">{action.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium text-sm">{action.title}</div>
                    <div className="text-white/40 text-xs">{action.description}</div>
                  </div>
                  <span className="opacity-0 group-hover/action:opacity-100 transition-opacity">
                    →
                  </span>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={`/demo/autoservice/${roleKey}`}
              className="block w-full py-3 px-4 text-center bg-white/10 border border-white/10 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-200 group-hover:border-white/30"
            >
              Открыть дашборд
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}