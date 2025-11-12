"use client";

type Item = { href: string; label: string };

export default function SettingsNav({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
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

        <nav
          className="
            flex flex-wrap gap-2
            w-full md:w-auto
          "
        >
          {items.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="
                flex-1 sm:flex-none text-center
                text-sm rounded-lg border border-white/15
                px-3 py-2
                hover:bg-white/[0.08]
                transition
                focus:outline-none focus:ring-2 focus:ring-white/30
                whitespace-nowrap
              "
            >
              {i.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}