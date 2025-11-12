"use client";

import Link from "next/link";

export default function SavedViewCard({
  title,
  where,
  href,
  onRename,
  onDelete,
}: {
  title: string;
  where: string;
  href: string;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.05] p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs opacity-70">{where}</div>
        </div>
        <div className="flex gap-2">
          <Link href={href} className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">
            Применить
          </Link>
          <button onClick={onRename} className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">
            Переименовать
          </button>
          <button onClick={onDelete} className="rounded-lg border border-red-300/30 bg-red-300/10 px-3 py-1.5 text-sm hover:bg-red-300/20">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}