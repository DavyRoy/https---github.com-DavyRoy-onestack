"use client";

import { useState } from "react";
import * as Lucide from "lucide-react";
import { ADMIN_BUNDLES } from "@/app/demo/(shared)/data/services";

type Bundle = typeof ADMIN_BUNDLES[number];

export default function BundleRulesPanel({ initial }: { initial?: Bundle }) {
  const [transferable, setTransferable] = useState(initial?.status === "active" ? false : false);
  const [freezeDays, setFreezeDays] = useState<number>(0);
  const [autoRenew, setAutoRenew] = useState(false);
  const [notifyExp, setNotifyExp] = useState(true);

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm grid gap-4"
      aria-labelledby="bundle-rules-title"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lucide.ShieldCheck className="h-5 w-5 opacity-80" />
          <h2 id="bundle-rules-title" className="text-sm font-medium">
            Правила и ограничения
          </h2>
        </div>
        <div className="text-xs text-white/60">Настройки для клиентов</div>
      </div>

      {/* Основные чекбоксы */}
      <div className="grid gap-3">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={transferable}
            onChange={(e) => setTransferable(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Разрешить передачу пакета/абонемента другому клиенту
            <span className="block text-xs text-white/60">
              Позволяет делиться пакетом или переоформлять его при согласии администратора.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Автоматическое продление
            <span className="block text-xs text-white/60">
              Для абонементов: при окончании срока автоматически продлевается при наличии средств.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={notifyExp}
            onChange={(e) => setNotifyExp(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Уведомлять о скором окончании
            <span className="block text-xs text-white/60">
              Клиент получит напоминание за 3 дня до завершения срока действия.
            </span>
          </span>
        </label>
      </div>

      {/* Настройки заморозки */}
      <div className="grid sm:grid-cols-2 gap-3 items-end">
        <label className="grid gap-1">
          <span className="text-xs opacity-70 flex items-center gap-1">
            Заморозка (макс. дней)
            <Lucide.HelpCircle
              className="h-3.5 w-3.5 opacity-50"
              title="Максимальное количество дней, на которое можно приостановить действие абонемента."
            />
          </span>
          <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/10 overflow-hidden w-max">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center hover:bg-white/10"
              onClick={() => setFreezeDays((v) => Math.max(0, v - 1))}
              aria-label="Уменьшить на 1 день"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              step={1}
              value={freezeDays}
              onChange={(e) => setFreezeDays(Math.max(0, Number(e.target.value) || 0))}
              className="w-24 bg-transparent px-3 py-2 text-sm outline-none text-center tabular-nums"
              aria-label="Максимальное число дней заморозки"
            />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center hover:bg-white/10"
              onClick={() => setFreezeDays((v) => v + 1)}
              aria-label="Увеличить на 1 день"
            >
              +
            </button>
          </div>
        </label>

        <div className="text-xs text-white/60 flex items-center gap-2">
          <Lucide.Info className="h-4 w-4 opacity-60" />
          Обычно 7–30 дней, в зависимости от политики салона.
        </div>
      </div>

      {/* Резюме */}
      <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm grid gap-1">
        <div className="flex items-center gap-2">
          <Lucide.FileCheck className="h-4 w-4 opacity-70" />
          <span>Итоговые параметры:</span>
        </div>
        <ul className="ml-5 list-disc text-white/80 text-xs leading-relaxed mt-1">
          <li>
            {transferable ? (
              <span className="text-emerald-400">Передача разрешена</span>
            ) : (
              "Передача запрещена"
            )}
          </li>
          <li>
            {autoRenew
              ? "Автоматическое продление включено"
              : "Без автопродления"}
          </li>
          <li>
            {notifyExp
              ? "Клиенты получают уведомление о завершении"
              : "Без уведомлений"}
          </li>
          <li>Заморозка до {freezeDays} дн.</li>
        </ul>
      </div>
    </section>
  );
}