'use client';

import React from 'react';

interface KPI {
  title: string;
  value: string;
  change?: string;
}

interface DemoKPIProps {
  kpis: KPI[];
}

export default function DemoKPI({ kpis }: DemoKPIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white/70 text-sm font-medium">{kpi.title}</h3>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xs">📊</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            {kpi.change && (
              <div className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                {kpi.change}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}