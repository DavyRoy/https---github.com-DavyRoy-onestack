'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { roleConfigs } from '@/app/demo/medicine/config';

export default function RoleSwitcher() {
  const pathname = usePathname();
  const currentRole = pathname.split('/')[3] as 'user' | 'manager' | 'owner';

  return (
    <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1">
      {Object.values(roleConfigs).map((role) => (
        <Link
          key={role.id}
          href={`/demo/medicine/${role.id}`}
          className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            currentRole === role.id
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{role.icon}</span>
            <span className="hidden sm:inline">{role.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}