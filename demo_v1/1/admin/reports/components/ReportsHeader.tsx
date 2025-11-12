"use client";

import React from "react";
import CompareToggle from "./CompareToggle";
import ExportMenu from "./ExportMenu";

type Props = {
  title?: string;
  onChange?: (ctx: {
    range: string;
    locations: string[];
    channel: "all" | "online" | "manager";
    currency: "RUB" | "KRW" | "USD";
    compare: boolean;
  }) => void;
};

export default function ReportsHeader({
  title = "Отчёты (админ)",
  onChange,
}: Props) {
  const [range, setRange] = React.useState("30d");
  const [locations, setLocations] = React.useState<string[]>([]);
  const [channel, setChannel] = React.useState<"all" | "online" | "manager">(
    "all"
  );
  const [currency, setCurrency] = React.useState<"RUB" | "KRW" | "USD">("RUB");
  const [compare, setCompare] = React.useState(false);

  React.useEffect(() => {
    onChange?.({ range, locations, channel, currency, compare });
  }, [range, locations, channel, currency, compare, onChange]);

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between w-full">
      {/* Заголовок и описание */}
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
          {title}
        </h1>
        <p className="mt-1 text-sm text-white/60 break-words">
          Период, локация, канал и валюта применяются ко всем виджетам.
        </p>
      </div>

      {/* Панель фильтров */}
      <div
        className="
          flex flex-wrap items-center gap-2
          bg-white/[0.03] border border-white/10 rounded-2xl
          p-3 sm:p-4 md:bg-transparent md:border-0 md:p-0
          w-full md:w-auto
        "
      >
        {/* Период */}
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="flex-1 min-w-[130px] rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="today">Сегодня</option>
          <option value="7d">7 дней</option>
          <option value="30d">30 дней</option>
          <option value="qtr">Квартал</option>
          <option value="year">Год</option>
          <option value="custom">Custom</option>
        </select>

        {/* Локации */}
        <select
          multiple
          value={locations}
          onChange={(e) =>
            setLocations(Array.from(e.target.selectedOptions).map((o) => o.value))
          }
          className="flex-1 min-w-[140px] rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20 h-10"
        >
          <option value="center">Центр</option>
          <option value="south">Юг</option>
          <option value="north">Север</option>
          <option value="west">Запад</option>
        </select>

        {/* Канал */}
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value as any)}
          className="flex-1 min-w-[120px] rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="all">Все каналы</option>
          <option value="online">Online</option>
          <option value="manager">Менеджер</option>
        </select>

        {/* Валюта */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as any)}
          className="flex-1 min-w-[100px] rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="RUB">RUB</option>
          <option value="KRW">KRW</option>
          <option value="USD">USD</option>
        </select>

        {/* Сравнение и экспорт */}
        <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
          <CompareToggle value={compare} onChange={setCompare} />
          <ExportMenu />
        </div>
      </div>
    </header>
  );
}