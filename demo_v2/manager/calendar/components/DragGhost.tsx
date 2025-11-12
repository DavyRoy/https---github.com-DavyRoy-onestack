"use client";

import React from "react";

export default function DragGhost({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label: string;
}) {
  return (
    <div
      className="
        pointer-events-none fixed z-[95]
        -translate-x-1/2 -translate-y-1/2
        select-none touch-none
      "
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        willChange: "transform, left, top",
      }}
      aria-hidden="true"
    >
      <div
        className="
          rounded-xl border border-white/20 bg-white/25
          px-3 py-1.5 text-xs md:text-sm
          backdrop-blur-md shadow-lg text-white/90
          transition-transform duration-75 ease-out
          scale-100
        "
        style={{
          minWidth: "80px",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
}