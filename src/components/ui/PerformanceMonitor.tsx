'use client';
import { useReportWebVitals } from 'next/web-vitals';

export default function PerformanceMonitor() {
  useReportWebVitals((metric) => {
    console.log(metric); // Можно отправить в аналитику
  });

  return null;
}