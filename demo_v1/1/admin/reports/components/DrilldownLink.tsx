"use client";

import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function DrilldownLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="
        inline-block
        text-sm
        text-emerald-400
        underline underline-offset-2
        hover:text-emerald-300 hover:no-underline
        active:opacity-80
        break-words
        transition-colors duration-150
      "
    >
      {children}
    </Link>
  );
}