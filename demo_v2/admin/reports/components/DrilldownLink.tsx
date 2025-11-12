"use client";

import Link from "next/link";
import * as React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function DrilldownLink({ href, children, ariaLabel }: Props) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel || `Перейти: ${String(children)}`}
      className={`
        inline-block
        text-sm
        font-medium
        text-emerald-400
        underline underline-offset-2
        hover:text-emerald-300 hover:no-underline
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60
        active:opacity-80
        break-words
        transition-colors duration-150
      `}
    >
      {children}
    </Link>
  );
}