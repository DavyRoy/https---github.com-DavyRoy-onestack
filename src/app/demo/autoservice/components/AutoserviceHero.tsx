'use client';

import React from 'react';
import Link from 'next/link';
import { AUTOSERVICE_HERO } from '../config';

export default function AutoserviceHero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
          <span className="text-sm font-medium text-white/80">Автомобильная отрасль</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {AUTOSERVICE_HERO.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-3xl mx-auto leading-relaxed">
          {AUTOSERVICE_HERO.subtitle}
        </p>

        {/* Description */}
        <p className="text-lg text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed">
          {AUTOSERVICE_HERO.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="#roles"
            className="px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {AUTOSERVICE_HERO.cta.primary.text}
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur"
          >
            {AUTOSERVICE_HERO.cta.secondary.text}
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {AUTOSERVICE_HERO.features.map((feature, index) => (
            <div key={index} className="text-center space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:bg-white/10 transition-all duration-200">
                <span className="text-lg">✨</span>
              </div>
              <p className="text-white/70 font-medium group-hover:text-white transition-colors">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}