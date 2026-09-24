// src/app/modal/PolicyModalShell.tsx
"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";

export type PolicyPoint = { title: string; text: string; anchor: string };

export default function PolicyModalShell({
  title, lead, points, fullHref, fullLabel, updated,
}: {
  title: string;
  lead: string;
  points: PolicyPoint[];
  fullHref: string;
  fullLabel: string;
  updated: string;
}) {
  const router = useRouter();

  // Сноску открывают из формы — закрытие возвращает туда же, а при прямом заходе ведёт на главную.
  const close = useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }, [router]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return (
    <div className="policy-modal" role="dialog" aria-modal="true" aria-labelledby="policy-modal-title" onClick={close}>
      <div className="policy-modal__panel" onClick={e => e.stopPropagation()}>
        <div className="policy-modal__head">
          <div>
            <p className="service-eyebrow">OneStack · {updated}</p>
            <h1 id="policy-modal-title" className="policy-modal__title">{title}</h1>
          </div>
          <button type="button" onClick={close} aria-label="Закрыть" className="policy-modal__close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p className="policy-modal__lead">{lead}</p>

        <ol className="policy-modal__list">
          {points.map((p, i) => (
            <li key={p.anchor}>
              <span className="site-type__num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="policy-modal__point">{p.title}</p>
                <p className="policy-modal__text">
                  {p.text}{" "}
                  <Link href={`${fullHref}#${p.anchor}`} className="policy-modal__more">Подробнее</Link>
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Link href={fullHref} className="service-button service-button--secondary policy-modal__full">
          {fullLabel}<ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
