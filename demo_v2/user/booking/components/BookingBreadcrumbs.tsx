import Link from "next/link";

const crumbs = [
  { href: "/demo/user", label: "Кабинет" },
  { href: "/demo/user/services", label: "Услуги" },
  { href: "/demo/user/booking", label: "Бронирование" },
];

export default function BookingBreadcrumbs() {
  return (
    <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-1 text-xs text-[hsl(var(--muted))]">
      {crumbs.map((crumb, index) => (
        <span key={crumb.href} className="inline-flex items-center gap-1">
          {index > 0 && <span aria-hidden className="opacity-40">/</span>}
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-[hsl(var(--fg))]">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-[hsl(var(--fg))]">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
