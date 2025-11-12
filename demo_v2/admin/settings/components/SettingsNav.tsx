"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export default function SettingsNav({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  const pathname = usePathname();

  return (
    <header
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 sm:p-5 w-full max-w-full min-w-0
      "
    >
      <div
        className="
          flex flex-col md:flex-row md:items-center md:justify-between gap-3
          min-w-0
        "
      >
        <h2 className="text-lg md:text-xl font-semibold leading-tight break-words">
          {title}
        </h2>

        {/* горизонтальный скролл только внутри навигации на узких экранах */}
        <nav
          aria-label={`${title}: навигация`}
          className="
            -mx-1 overflow-x-auto supports-[overflow:clip]:overflow-x-clip
            w-full md:w-auto
          "
        >
          <div
            className="
              px-1 flex gap-2 min-w-max md:min-w-0
              justify-stretch md:justify-end
              w-full
            "
          >
            {items.map((i) => {
              const active = pathname === i.href;
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    flex-1 sm:flex-none text-center text-sm
                    rounded-lg border px-3 py-2 transition
                    focus:outline-none focus:ring-2 focus:ring-white/30
                    whitespace-nowrap
                    ${active
                      ? "border-white/25 bg-white/[0.10] text-white"
                      : "border-white/15 hover:bg-white/[0.08] text-white/90"}
                  `}
                >
                  {i.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}