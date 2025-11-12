'use client';

import React from 'react';
import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">{action.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{action.title}</h3>
              <p className="text-white/60 text-sm truncate">{action.description}</p>
            </div>
            <span className="text-white/40 group-hover:text-white transition-colors">
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}