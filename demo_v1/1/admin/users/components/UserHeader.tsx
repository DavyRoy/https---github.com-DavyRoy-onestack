"use client";

import React from "react";

type User = {
  name: string;
  email: string;
  status: string;
};

export default function UserHeader({ user }: { user: User }) {
  return (
    <header
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2
      "
    >
      <div className="min-w-0">
        <div className="text-xl font-semibold truncate">{user.name}</div>
        <div className="text-white/70 text-sm break-words">{user.email}</div>
      </div>

      <div
        className={`
          text-xs px-3 py-1 rounded-full border font-medium
          ${
            user.status === "active"
              ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
              : user.status === "invited"
              ? "border-amber-400/40 text-amber-300 bg-amber-400/5"
              : "border-white/20 text-white/70"
          }
        `}
      >
        {user.status}
      </div>
    </header>
  );
}