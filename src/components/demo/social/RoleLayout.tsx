'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { SOCIAL_NAVIGATION } from '@/app/demo/social/config';
import type { RoleId } from '@/app/demo/social/types';

const ROLE_SWITCHER: Array<{ id: RoleId; label: string; href: string; icon: string; badge: string }> = [
  { id: 'user', label: 'Гражданин', href: '/demo/social/user', icon: '👤', badge: 'Self-service' },
  { id: 'manager', label: 'Менеджер', href: '/demo/social/manager', icon: '👨‍💼', badge: 'Operations' },
  { id: 'owner', label: 'Владелец бизнеса', href: '/demo/social/owner', icon: '👑', badge: 'HQ' },
];

type RoleLayoutProps = PropsWithChildren<{ role: RoleId }>;

export default function RoleLayout({ role, children }: RoleLayoutProps) {
  const pathname = usePathname();
  const sections = SOCIAL_NAVIGATION[role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950 text-white">
      <div className="flex">
        <nav className="sticky top-0 hidden h-screen w-80 flex-shrink-0 flex-col border-r border-white/10 bg-white/5/5 px-6 py-8 backdrop-blur-2xl lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Роли</p>
            <div className="mt-4 space-y-3">
              {ROLE_SWITCHER.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                    item.id === role
                      ? 'border-white/30 bg-white/10 text-white'
                      : 'border-white/5 text-white/70 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {item.icon} {item.label}
                  </span>
                  <span className="text-xs text-white/60">{item.badge}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex-1 overflow-y-auto pr-2">
            {sections.map(section => (
              <div key={section.key} className="mb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{section.title}</p>
                <div className="mt-3 space-y-2">
                  {section.items.map(item => {
                    const isActive = pathname?.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-2xl border px-4 py-3 transition ${
                          isActive
                            ? 'border-white/30 bg-white/10 text-white'
                            : 'border-white/5 text-white/70 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {item.icon} {item.label}
                          </span>
                          {item.children?.length ? (
                            <span className="text-xs text-white/50">{item.children.length}</span>
                          ) : null}
                        </div>
                        {item.children?.length ? (
                          <p className="mt-1 text-xs text-white/60">Доступно {item.children.length} сценариев</p>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 text-sm text-white/80">
            <p className="text-xs uppercase text-white/60">Статистика</p>
            <p className="mt-2 text-2xl font-semibold text-white">+52</p>
            <p>модуля в роли</p>
            <p className="mt-2 text-xs text-white/50">Собранная дизайн-система и данные</p>
          </div>
        </nav>

        <main className="flex-1 px-4 py-8 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="lg:hidden rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase text-white/60">Навигация</p>
              <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
                {sections.flatMap(section =>
                  section.items.map(item => {
                    const isActive = pathname?.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`snap-center rounded-2xl border px-4 py-2 text-sm ${
                          isActive ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-white/70'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  }),
                )}
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
