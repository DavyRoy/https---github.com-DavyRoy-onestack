"use client";

import Link from "next/link";
import { BadgeInfo, CalendarDays, ChevronRight, Flame, Sparkles } from "lucide-react";
import PriceBadge from "./PriceBadge";
import DurationBadge from "./DurationBadge";

/** Локальные стили, без внешних зависимостей */
const T = {
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm shadow-md",
  title: "text-base font-semibold leading-tight",
  dim: "text-white/70",
  mut: "text-white/60",
  chip:
    "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/80",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/30",
};

/** Типы */
export type ServiceEntity = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  duration: number; // мин
  status?: "active" | "inactive";
  popular?: boolean;
  seasonal?: boolean;
};

type Props = {
  service?: ServiceEntity; // делаем опциональным, чтобы не падать
  onBook?: (serviceId: string) => void;
  onOpen?: (serviceId: string) => void;
  onSchedule?: (serviceId: string) => void;
};

/** Скелет-карточка на случай undefined */
function ServiceCardSkeleton() {
  return (
    <div className={T.card + " animate-pulse"}>
      <div className="h-5 w-2/3 rounded bg-white/10" />
      <div className="mt-2 h-4 w-full rounded bg-white/10" />
      <div className="mt-1 h-4 w-3/4 rounded bg-white/10" />
      <div className="mt-3 flex items-center gap-2">
        <div className="h-6 w-20 rounded bg-white/10" />
        <div className="h-6 w-16 rounded bg-white/10" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-8 w-28 rounded bg-white/10" />
        <div className="h-8 w-28 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function ServiceCard(props: Props) {
  const { service, onBook, onOpen, onSchedule } = props;

  if (!service) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ServiceCard] prop `service` отсутствует — рендерю скелет.");
    }
    return <ServiceCardSkeleton />;
  }

  const {
    id,
    title,
    description = "",
    category = "",
    price,
    duration,
    status = "active",
    popular = false,
    seasonal = false,
  } = service;

  const handleBook = () => onBook?.(id);
  const handleOpen = () => onOpen?.(id);
  const handleSchedule = () => onSchedule?.(id);

  return (
    <div className={T.card}>
      {/* Заголовок + бейджи */}
      <div className="flex items-start gap-3">
        <div className="min-w-0">
          <div className={T.title}>
            <Link
              href={`/demo/manager/services/${id}`}
              className="hover:underline"
              onClick={(e) => {
                if (onOpen) {
                  e.preventDefault();
                  handleOpen();
                }
              }}
            >
              {title}
            </Link>
          </div>
          <div className={"mt-0.5 text-sm " + T.dim}>
            {category || "Без категории"}
            {status === "inactive" ? (
              <span className="ml-2 inline-block rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/80">
                Неактивна
              </span>
            ) : null}
          </div>
        </div>

        {/* Бейджи «Хит» / «Сезон» */}
        <div className="ml-auto flex items-center gap-1">
          {popular && (
            <span className={T.chip} title="Часто выбираемая услуга за последние 30 дней">
              <Flame width={12} height={12} /> Хит
            </span>
          )}
          {seasonal && (
            <span className={T.chip} title="Сезонное предложение — высокий спрос в текущем месяце">
              <Sparkles width={12} height={12} /> Сезон
            </span>
          )}
        </div>
      </div>

      {/* Описание */}
      {description && (
        <p className={"mt-2 line-clamp-2 text-sm " + "text-white/60"}>{description}</p>
      )}

      {/* Метки цены/длительности */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriceBadge value={price} />
        {/* ⬇️ ключевая правка: prop называется `min`, а не `mins` */}
        <DurationBadge min={duration} />
      </div>

      {/* Действия */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={T.btnPrimary} onClick={handleBook} aria-label="Записать клиента">
          <CalendarDays width={16} height={16} /> Записать клиента
        </button>
        <button type="button" className={T.btn} onClick={handleSchedule} aria-label="Открыть расписание">
          <BadgeInfo width={16} height={16} /> Расписание
        </button>

        <Link
          href={`/demo/manager/services/${id}`}
          className={T.btn}
          onClick={(e) => {
            if (onOpen) {
              e.preventDefault();
              handleOpen();
            }
          }}
          aria-label="Подробнее об услуге"
        >
          Детали <ChevronRight width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}