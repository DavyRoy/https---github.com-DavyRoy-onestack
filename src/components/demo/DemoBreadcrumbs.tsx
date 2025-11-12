'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

/* ===================== Types ===================== */
export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface DemoBreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  contextInfo?: {
    industry?: string;
    role?: string;
  };
}

/* ===================== Enhanced Dashboard Breadcrumbs ===================== */
export default function DemoBreadcrumbs({
  items,
  showHome = true,
  className = '',
  contextInfo,
}: DemoBreadcrumbsProps) {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allItems = showHome ? [{ label: 'Главная', href: '/', icon: '🏠' }, ...items] : items;
  const activeIndex = allItems.length - 1;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative flex flex-wrap items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 
        bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-md
        shadow-[0_0_20px_rgba(255,255,255,0.03)] ${className}`}
      aria-label="Навигационная цепочка"
    >
      {/* Left: Breadcrumb path */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
        {allItems.map((item, index) => {
          const isActive = index === activeIndex;
          const isLast = index === allItems.length - 1;

          return (
            <React.Fragment key={item.href}>
              {index > 0 && (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white/25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}

              {isActive ? (
                <span
                  className="relative font-medium text-white whitespace-nowrap px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10"
                  aria-current="page"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="relative text-white/60 hover:text-white transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                  {!isLast && (
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      layoutId="underline"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: Context info (Industry / Role) */}
      {contextInfo && (contextInfo.industry || contextInfo.role) && (
        <div className="hidden sm:flex items-center gap-4 text-xs sm:text-sm text-white/50">
          {contextInfo.industry && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400/60"></span>
              <span>
                Отрасль:{' '}
                <strong className="text-white/80 font-medium">{contextInfo.industry}</strong>
              </span>
            </div>
          )}
          {contextInfo.role && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400/60"></span>
              <span>
                Роль:{' '}
                <strong className="text-white/80 font-medium">{contextInfo.role}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </motion.nav>
  );
}

/* ===================== Hook for Auto Breadcrumbs ===================== */
export function useBreadcrumbs(additionalItems: BreadcrumbItem[] = []) {
  const pathname = usePathname();

  return React.useMemo(() => {
    const pathSegments = pathname.split('/').filter((s) => s);
    const breadcrumbItems: BreadcrumbItem[] = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { label, href };
    });

    return [...breadcrumbItems, ...additionalItems];
  }, [pathname, additionalItems]);
}

/* ===================== Compact Variant (for mobile headers) ===================== */
interface CompactBreadcrumbsProps {
  items: BreadcrumbItem[];
  contextInfo?: { industry?: string; role?: string };
  className?: string;
}

export function CompactBreadcrumbs({
  items,
  contextInfo,
  className = '',
}: CompactBreadcrumbsProps) {
  const currentItem = items[items.length - 1];
  const previous = items.length > 1 ? items[items.length - 2] : null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-between gap-3 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl backdrop-blur-sm ${className}`}
      aria-label="Упрощённая навигация"
    >
      <div className="flex items-center gap-2">
        {previous && (
          <Link
            href={previous.href}
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors duration-200 p-1.5 rounded-lg hover:bg-white/5"
            title={`Назад к ${previous.label}`}
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <span className="text-sm text-white/80 font-medium">{currentItem.label}</span>
      </div>

      {contextInfo?.role && (
        <div className="text-xs text-white/40 font-light">
          {contextInfo.role}
        </div>
      )}
    </motion.nav>
  );
}