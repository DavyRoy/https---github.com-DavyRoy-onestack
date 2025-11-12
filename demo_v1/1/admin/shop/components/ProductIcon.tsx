"use client";

import { CatalogIcon } from "@/app/lib/catalog/iconRegistry";

export function ProductIcon({
  iconId,
  size = 20,
  className = "",
}: {
  iconId?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span className="inline-grid place-items-center rounded-lg bg-white/10 p-2">
      <CatalogIcon id={iconId} size={size} className={className} />
    </span>
  );
}