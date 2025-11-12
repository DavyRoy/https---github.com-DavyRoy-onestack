"use client";

export default function TechMarquee({ className = "", items }: { className?: string; items: string[] }) {
  const text = items.join(" · ");

  return (
    <div
      className={`
        relative overflow-hidden border-t border-white/10 pt-6
        mx-[calc(50%-50vw)] px-[calc(50vw-50%)]
        ${className}
      `}
    >
      <div className="mask-fade pointer-events-none absolute inset-0" />
      <div className="marquee flex gap-12 whitespace-nowrap will-change-transform">
        <span className="opacity-90">{text}</span>
        <span className="opacity-90">{text}</span>
        <span className="opacity-90">{text}</span>
      </div>

      <style jsx>{`
        .marquee { animation: marquee 22s linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .mask-fade {
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0) 12%,
            rgba(0, 0, 0, 0) 88%,
            rgba(0, 0, 0, 1) 100%
          );
        }
      `}</style>
    </div>
  );
}