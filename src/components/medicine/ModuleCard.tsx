import React from 'react';
import Link from 'next/link';
import { MedicineModule } from '@/app/demo/medicine/config';

interface ModuleCardProps {
  module: MedicineModule;
  role: 'user' | 'manager' | 'owner';
  basePath: string;
}

export default function ModuleCard({ module, role, basePath }: ModuleCardProps) {
  const userPermissions = module.permissions[role];
  
  return (
    <Link
      href={`${basePath}/modules/${module.id}`}
      className="block group"
    >
      <div className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 p-6 transition-all duration-300 hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            {module.icon}
          </div>
          
          <div className="flex gap-1">
            {userPermissions.includes('read') && (
              <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-400">
                чтение
              </span>
            )}
            {userPermissions.includes('write') && (
              <span className="px-2 py-1 rounded-lg text-xs bg-green-500/20 text-green-400">
                запись
              </span>
            )}
            {userPermissions.includes('delete') && (
              <span className="px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-400">
                удаление
              </span>
            )}
          </div>
        </div>
        
        <h3 className="font-semibold text-white mb-2 group-hover:text-white/90">
          {module.name}
        </h3>
        
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          {module.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {module.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-lg text-xs bg-white/5 text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40 capitalize">
            {module.uiType}
          </span>
          <span className="text-white/60 group-hover:text-white transition-colors">
            Открыть →
          </span>
        </div>
      </div>
    </Link>
  );
}