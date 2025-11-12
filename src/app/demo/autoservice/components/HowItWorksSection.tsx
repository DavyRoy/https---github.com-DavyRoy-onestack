'use client';

import React from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Онлайн-запись',
    description: 'Клиент оставляет заявку через сайт или приложение, указывая симптомы и выбирая удобное время',
    icon: '📝'
  },
  {
    number: '02',
    title: 'Диагностика и расчёт',
    description: 'Мастер проводит диагностику, формирует смету и согласует с клиентом',
    icon: '🔍'
  },
  {
    number: '03',
    title: 'Ремонт и фотоотчёт',
    description: 'Выполнение работ с регулярным фотоотчётом для клиента',
    icon: '🔧'
  },
  {
    number: '04',
    title: 'Оплата и отзыв',
    description: 'Клиент оплачивает услуги онлайн и оставляет обратную связь',
    icon: '⭐'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Как это работает
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Простой и прозрачный процесс от заявки до выдачи автомобиля
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {STEPS.map((step, index) => (
          <div key={index} className="flex gap-8 items-start group">
            {/* Step Number and Connector */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                <span className="text-2xl">{step.icon}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 w-0.5 bg-white/10 my-4 group-hover:bg-white/20 transition-colors" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-12 group-last:pb-0">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-white/40">{step.number}</span>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-white/60 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <div className="inline-flex items-center px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
          <span className="text-white/60 mr-4">🚀</span>
          <span className="text-white font-semibold">
            Готовы оптимизировать работу вашего автосервиса?
          </span>
        </div>
      </div>
    </section>
  );
}