// src/app/demo/user/notifications/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Panel } from "../../ui/DemoCards";
import { Label, Toggle } from "../../ui/inputs";
import { Modal } from "../../ui/Modal";
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  Trash2,
  Filter,
  ShieldCheck,
  Clock3,
  Info,
  MoreHorizontal,
} from "lucide-react";

/* ------------------------------- types/data ------------------------------- */

type Kind = "system" | "order" | "security";
type Notify = {
  id: string;
  title: string;
  text: string;
  kind: Kind;
  ts: string; // человекочитаемое, демо
  read: boolean;
  link?: string; // куда вести (демо: не навигируем)
};

const seed: Notify[] = [
  { id: "n-101", title: "Заказ оформлен", text: "ORD-1026 успешно создан", kind: "order", ts: "сегодня 12:10", read: false, link: "/demo/user/orders" },
  { id: "n-100", title: "Пароль изменён", text: "Если это были не вы — свяжитесь с поддержкой", kind: "security", ts: "вчера 21:02", read: true },
  { id: "n-099", title: "Обновление приложения", text: "Доступна новая версия 1.4.2", kind: "system", ts: "2 дн. назад", read: false },
  { id: "n-098", title: "Статус заказа", text: "ORD-1025: оплата получена", kind: "order", ts: "3 дн. назад", read: true },
];

/* -------------------------------- helpers -------------------------------- */

const KIND_BADGE: Record<Kind, string> = {
  order: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  security: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  system: "border-sky-400/30 bg-sky-400/10 text-sky-200",
};
const KIND_ICON: Record<Kind, JSX.Element> = {
  order: <CheckCircle2 className="h-4 w-4" />,
  security: <ShieldCheck className="h-4 w-4" />,
  system: <Bell className="h-4 w-4" />,
};

function UnreadDot() {
  return <span className="ml-1 inline-block h-2 w-2 rounded-full bg-white/90" aria-hidden />;
}

const LS_ITEMS = "__DEMO_USER_NOTICES__";
const LS_CHANNELS = "__DEMO_USER_CHANNELS__";

/* ---------------------------------- page ---------------------------------- */

export default function UserNotificationsPage() {
  // список
  const [items, setItems] = useState<Notify[]>(seed);
  const [loading, setLoading] = useState(true);

  // выбор фильтров
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "unread" | Kind>("all");
  const [sortDesc, setSortDesc] = useState(true);

  // модалки
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = useMemo(() => items.find((i) => i.id === openId) || null, [items, openId]);
  const [confirmClear, setConfirmClear] = useState(false);

  // каналы (демо)
  const [emailOn, setEmailOn] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [digestOn, setDigestOn] = useState(false);

  // загрузка/сохранение в localStorage
  useEffect(() => {
    // имитация загрузки (для скелетона) + подхват localStorage
    const t = setTimeout(() => setLoading(false), 420);
    try {
      const raw = localStorage.getItem(LS_ITEMS);
      if (raw) setItems(JSON.parse(raw));
      const ch = localStorage.getItem(LS_CHANNELS);
      if (ch) {
        const p = JSON.parse(ch);
        setEmailOn(!!p.emailOn);
        setPushOn(!!p.pushOn);
        setDigestOn(!!p.digestOn);
      }
    } catch {}
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_ITEMS, JSON.stringify(items));
    } catch {}
  }, [items]);
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_CHANNELS,
        JSON.stringify({ emailOn, pushOn, digestOn })
      );
    } catch {}
  }, [emailOn, pushOn, digestOn]);

  // быстрый фокус на поиск по клавише '/'
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // отфильтрованный/отсортированный список
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let arr = items.filter((i) => {
      const okTab = tab === "all" ? true : tab === "unread" ? !i.read : i.kind === tab;
      const okQ = !s || i.title.toLowerCase().includes(s) || i.text.toLowerCase().includes(s);
      return okTab && okQ;
    });
    // непрочитанные сверху + сортировка по «видимому» ts (демо)
    arr = arr.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return sortDesc ? b.ts.localeCompare(a.ts) : a.ts.localeCompare(b.ts);
    });
    return arr;
  }, [items, q, tab, sortDesc]);

  const unreadCount = items.filter((i) => !i.read).length;
  const unreadInFiltered = filtered.filter((i) => !i.read).length;

  // действия
  const markRead = (id: string) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, read: true } : x)));
  const toggleRead = (id: string) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, read: !x.read } : x)));
  const markAll = () => setItems((xs) => xs.map((x) => ({ ...x, read: true })));
  const clearRead = () => setItems((xs) => xs.filter((x) => !x.read));
  const removeOne = (id: string) => setItems((xs) => xs.filter((x) => x.id !== id));

  // маленькое меню действий для мобильной версии
  const [menuFor, setMenuFor] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* фикс-плашка непрочитанных (не мешает лэйауту) */}
      <div
        className="fixed right-4 top-4 z-20 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-sm backdrop-blur-sm hidden sm:flex items-center gap-2"
        role="status"
        aria-live="polite"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <>Непрочитанных: <span className="font-semibold tabular-nums">{unreadCount}</span></>
        ) : ("Все прочитано")}
      </div>

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
            <Bell className="h-4 w-4" />
          </span>
          <div>
            <div className="text-3xl font-extrabold leading-tight">Уведомления</div>
            <p className="mt-1 text-white/70">Центр уведомлений: события аккаунта, заказы и системные сообщения.</p>
          </div>
        </div>
        {/* на мобильном счётчик остаётся сверху в фикс-плашке */}
      </div>

      {/* Фильтры/действия */}
      <Panel title="Фильтры и действия">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по заголовку/тексту…  (нажмите «/»)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-4 py-2.5 outline-none placeholder:text-white/40"
              aria-label="Поиск по уведомлениям"
            />
          </div>

          {/* сегментированный контроль вместо текстовой кнопки сортировки */}
          <div className="inline-flex rounded-full border border-white/15 bg-white/[0.04] p-1 self-start">
            {[
              { v: true, label: "сначала новые" },
              { v: false, label: "сначала старые" },
            ].map((o) => {
              const active = sortDesc === o.v;
              return (
                <button
                  key={String(o.v)}
                  onClick={() => setSortDesc(o.v)}
                  aria-pressed={active}
                  className={`px-3.5 py-1.5 text-sm rounded-full transition ${active ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.18)]" : "text-white/85 hover:bg-white/[0.08]"}`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "unread", "system", "order", "security"] as const).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-2 text-sm border capitalize transition ${
                    active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"
                  }`}
                  aria-pressed={active}
                >
                  {t === "all" ? "все" : t === "unread" ? "непрочитанные" : t}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 lg:ml-auto">
            <button
              onClick={markAll}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              <CheckCircle2 className="h-4 w-4" /> Прочитать всё
            </button>
            <button
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" /> Очистить прочитанные
            </button>
          </div>
        </div>
      </Panel>

      {/* Список уведомлений (внутренний скролл + липкая шапка) */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="sticky top-0 z-[1] px-5 py-3 border-b border-white/10 text-sm font-semibold bg-black/30 backdrop-blur-md">
          {loading ? "Загрузка…" : <>Найдено: {filtered.length} · Непрочитанных: {unreadInFiltered}</>}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <ul className="divide-y divide-white/10">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="px-5 py-4">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 w-56 rounded bg-white/10" />
                    <div className="h-3 w-80 rounded bg-white/10" />
                    <div className="h-3 w-24 rounded bg-white/10" />
                  </div>
                </li>
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-8 text-white/60">Пусто. Попробуйте изменить фильтр или поиск.</div>
          ) : (
            <ul className="divide-y divide-white/10">
              {filtered.map((n, idx) => {
                const showDivider = unreadInFiltered > 0 && idx === unreadInFiltered;
                return (
                  <li key={n.id} className={n.read ? "" : "bg-white/[0.02] shadow-[0_0_24px_rgba(255,255,255,0.06)]"}>
                    {/* Divider «Ранее прочитанные» */}
                    {showDivider && (
                      <div className="sticky top-[44px] z-[1]">
                        <div className="px-5 py-2 text-[11px] tracking-widest uppercase text-white/40 bg-white/[0.02] border-t border-b border-white/10">
                          Ранее прочитанные
                        </div>
                      </div>
                    )}

                    <div className="px-5 py-3 sm:py-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border px-0.5 ${KIND_BADGE[n.kind]}`}
                        >
                          {KIND_ICON[n.kind]}
                        </span>

                        {/* Кликабельный блок */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenId(n.id);
                            if (!n.read) markRead(n.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setOpenId(n.id);
                              if (!n.read) markRead(n.id);
                            }
                          }}
                          className={`flex-1 min-w-0 text-left rounded-xl transition p-2 -m-2 ${n.read ? "hover:bg-white/[0.04]" : "hover:bg-white/[0.06]"}`}
                          aria-label={`Открыть уведомление: ${n.title}`}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-semibold">
                              {n.title}
                              {!n.read && <UnreadDot />}
                            </div>
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${KIND_BADGE[n.kind]}`}>
                              {n.kind}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] ${
                                n.read
                                  ? "border-white/15 bg-white/5 text-white/70"
                                  : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                              }`}
                            >
                              {n.read ? "прочитано" : "новое"}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-white/80 truncate">{n.text}</div>
                          <div className="mt-1 text-xs text-white/55 inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" /> {n.ts}
                          </div>
                        </button>

                        {/* Actions: desktop — кнопки, mobile — меню */}
                        <div className="shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                          {/* Desktop */}
                          <div className="hidden sm:flex items-center gap-2">
                            <button
                              onClick={() => toggleRead(n.id)}
                              className="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                            >
                              {n.read ? "Сделать непрочитанным" : "Отметить прочитанным"}
                            </button>
                            <button
                              onClick={() => removeOne(n.id)}
                              title="Удалить"
                              className="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                            >
                              Удалить
                            </button>
                          </div>
                          {/* Mobile: compact menu */}
                          <div className="relative sm:hidden">
                            <button
                              onClick={() => setMenuFor((m) => (m === n.id ? null : n.id))}
                              className="rounded-full border border-white/20 p-2 hover:bg-white/10"
                              aria-haspopup="menu"
                              aria-expanded={menuFor === n.id}
                              aria-label="Действия"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {menuFor === n.id && (
                              <div
                                role="menu"
                                className="absolute right-0 mt-2 w-44 rounded-xl border border-white/15 bg-[#0b0d0e] shadow-xl p-1 z-10"
                              >
                                <button
                                  role="menuitem"
                                  onClick={() => {
                                    toggleRead(n.id);
                                    setMenuFor(null);
                                  }}
                                  className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                                >
                                  {n.read ? "Сделать непрочитанным" : "Отметить прочитанным"}
                                </button>
                                <button
                                  role="menuitem"
                                  onClick={() => {
                                    removeOne(n.id);
                                    setMenuFor(null);
                                  }}
                                  className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                                >
                                  Удалить
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Настройки каналов доставки (стек карточки + демо-превью) */}
      <Panel title="Каналы доставки" footer={<div className="text-xs text-white/55">В демо настройки локальные. В проде — сохраняем предпочтения в профиле и уважаем «тихий режим».</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ChannelCard
            icon={<Mail className="h-4 w-4" />}
            title="Email"
            desc="Заказы, безопасность, системные"
            checked={emailOn}
            onChange={setEmailOn}
            onDemo={() => setOpenId("demo-email")}
          />
          <ChannelCard
            icon={<Smartphone className="h-4 w-4" />}
            title="Push"
            desc="Быстрые события и алерты"
            checked={pushOn}
            onChange={setPushOn}
            onDemo={() => setOpenId("demo-push")}
          />
          <ChannelCard
            icon={<Bell className="h-4 w-4" />}
            title="Дайджест"
            desc="Ежедневная сводка"
            checked={digestOn}
            onChange={setDigestOn}
            onDemo={() => setOpenId("demo-digest")}
          />
        </div>
      </Panel>

      {/* модалка уведомления / каналов */}
      <Modal
        open={!!openId}
        onClose={() => setOpenId(null)}
        title={opened ? opened.title : "Информация"}
        footer={<div className="text-xs text-white/70">Это демо. Детальные действия недоступны.</div>}
      >
        {opened ? (
          <div className="space-y-2 text-sm">
            <Row k="Тип" v={opened.kind} />
            <Row k="Текст" v={opened.text} />
            <Row k="Время" v={opened.ts} />
            <Row k="Статус" v={opened.read ? "прочитано" : "непрочитано"} />
            {opened.link && <Row k="Ссылка" v={opened.link} />}
          </div>
        ) : (
          <DemoChannelPreview id={openId} />
        )}
      </Modal>

      {/* модалка подтверждения очистки */}
      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Очистить прочитанные?"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmClear(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              onClick={() => {
                clearRead();
                setConfirmClear(false);
              }}
              className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold"
            >
              Очистить
            </button>
          </div>
        }
      >
        <div className="text-sm text-white/80">Все прочитанные уведомления будут удалены из списка.</div>
      </Modal>
    </div>
  );
}

/* ------------------------------- subcomponents ---------------------------- */

function ChannelCard({
  icon,
  title,
  desc,
  checked,
  onChange,
  onDemo,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  onDemo: () => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
            {icon}
          </span>
          <div>
            <Label>{title}</Label>
            <div className="text-xs text-white/60">{desc}</div>
          </div>
        </div>
        <Toggle checked={checked} onChange={onChange} label={checked ? "Вкл" : "Выкл"} />
      </header>
      <footer>
        <button
          onClick={onDemo}
          className="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
        >
          Как это работает?
        </button>
      </footer>
    </article>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-28 text-white/60">{k}</div>
      <div className="flex-1">{v}</div>
    </div>
  );
}

function DemoChannelPreview({ id }: { id: string | null }) {
  // простые демо-карточки для каналов
  const map: Record<string, { title: string; body: string; meta: string }> = {
    "demo-email": {
      title: "Подтверждение заказа ORD-1027",
      body: "Ваш заказ успешно оформлен. Счёт приложен PDF, статус: 'в работе'.",
      meta: "из: noreply@demo.app",
    },
    "demo-push": {
      title: "Статус заказа обновлён",
      body: "ORD-1027: отправлен в доставку.",
      meta: "push: мгновенно",
    },
    "demo-digest": {
      title: "Дайджест за день",
      body: "3 системных сообщения, 2 события безопасности, 1 заказ.",
      meta: "ежедневно 09:00",
    },
  };
  const content = (id && map[id]) || { title: "Демо-канал", body: "Пример содержимого уведомления.", meta: "пример" };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
      <div className="font-semibold">{content.title}</div>
      <div className="mt-1 text-white/80">{content.body}</div>
      <div className="mt-2 text-xs text-white/55">{content.meta}</div>
    </div>
  );
}