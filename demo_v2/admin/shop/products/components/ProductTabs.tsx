// app/demo/admin/shop/products/components/ProductTabs.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/app/demo/(shared)/data/catalog/products.food";
import { CATEGORIES } from "@/app/demo/(shared)/data/catalog/categories.food";

type Tab = "main" | "variants" | "price" | "inventory" | "media" | "seo" | "attrs";

export default function ProductTabs({
  product,
  onDirty,
}: {
  product: Product;
  onDirty: () => void;
}) {
  const sp = useSearchParams();
  const router = useRouter();

  const order: Tab[] = ["main", "variants", "price", "inventory", "media", "seo", "attrs"];

  // URL → state (и наоборот), + локальная память на конкретный продукт
  const urlTab = (sp.get("tab") as Tab) || null;
  const lsKey = `product.tabs.last.${product.id}`;

  const savedTab =
    typeof window !== "undefined" ? (localStorage.getItem(lsKey) as Tab | null) : null;

  const [tab, setTab] = useState<Tab>(urlTab ?? savedTab ?? "main");

  // если пользователь вернулся по истории и ?tab изменился — синхронизируем state
  useEffect(() => {
    if (urlTab && urlTab !== tab) setTab(urlTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTab]);

  // state → URL + localStorage
  useEffect(() => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    if (next.get("tab") !== tab) {
      next.set("tab", tab);
      router.replace(`?${next.toString()}`);
    }
    try {
      localStorage.setItem(lsKey, tab);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // a11y-клавиатура: стрелки + Home/End
  const onKeyTabs = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = order.indexOf(tab);
    const ni =
      e.key === "Home"
        ? 0
        : e.key === "End"
        ? order.length - 1
        : e.key === "ArrowRight"
        ? (i + 1) % order.length
        : (i - 1 + order.length) % order.length;
    setTab(order[ni]);
    // сфокусируем следующую кнопку (роуминг табиндекса)
    const btn = tabsRef.current?.querySelector<HTMLButtonElement>(`button[data-tab="${order[ni]}"]`);
    btn?.focus();
  };

  // бейдж «Медиа»
  const counts = useMemo(() => ({ media: product.media?.length ?? 0 }), [product.media]);

  const tabsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLButtonElement>(`button[data-tab="${tab}"]`);
    el?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [tab]);

  const TabButton = ({
    id,
    label,
    badge,
  }: {
    id: Tab;
    label: string;
    badge?: number;
  }) => {
    const active = tab === id;
    return (
      <button
        data-tab={id}
        id={`tab-${id}`}
        role="tab"
        aria-selected={active}
        aria-controls={`panel-${id}`}
        tabIndex={active ? 0 : -1}
        onClick={() => setTab(id)}
        className={
          "relative whitespace-nowrap rounded-lg px-3 py-1.5 text-sm border transition-colors " +
          (active ? "border-white/30 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10")
        }
      >
        {label}
        {typeof badge === "number" && (
          <span
            className={
              "ml-1 inline-flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-5 " +
              (badge > 0 ? "bg-white/20 text-white" : "bg-white/10 text-white/70")
            }
          >
            {badge}
          </span>
        )}
        {active && (
          <span className="pointer-events-none absolute inset-x-2 -bottom-2 block h-0.5 rounded bg-white/60" />
        )}
      </button>
    );
  };

  return (
    <section className="grid gap-3">
      {/* Tabs */}
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Вкладки товара"
        onKeyDown={onKeyTabs}
        className="flex w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto rounded-2xl border border-white/15 bg-white/[0.04] p-2"
      >
        <TabButton id="main" label="Основное" />
        <TabButton id="variants" label="Варианты" />
        <TabButton id="price" label="Цена" />
        <TabButton id="inventory" label="Склад" />
        <TabButton id="media" label="Медиа" badge={counts.media} />
        <TabButton id="seo" label="SEO" />
        <TabButton id="attrs" label="Атрибуты" />
      </div>

      {/* Panels */}
      <div
        id="panel-main"
        role="tabpanel"
        aria-labelledby="tab-main"
        hidden={tab !== "main"}
        className={tab === "main" ? "block" : "hidden"}
      >
        <MainTab product={product} onDirty={onDirty} />
      </div>
      <div id="panel-variants" role="tabpanel" aria-labelledby="tab-variants" hidden={tab !== "variants"} className={tab === "variants" ? "block" : "hidden"}>
        <VariantsTab onDirty={onDirty} />
      </div>
      <div id="panel-price" role="tabpanel" aria-labelledby="tab-price" hidden={tab !== "price"} className={tab === "price" ? "block" : "hidden"}>
        <PriceTab onDirty={onDirty} />
      </div>
      <div id="panel-inventory" role="tabpanel" aria-labelledby="tab-inventory" hidden={tab !== "inventory"} className={tab === "inventory" ? "block" : "hidden"}>
        <InventoryTab onDirty={onDirty} />
      </div>
      <div id="panel-media" role="tabpanel" aria-labelledby="tab-media" hidden={tab !== "media"} className={tab === "media" ? "block" : "hidden"}>
        <MediaTab onDirty={onDirty} />
      </div>
      <div id="panel-seo" role="tabpanel" aria-labelledby="tab-seo" hidden={tab !== "seo"} className={tab === "seo" ? "block" : "hidden"}>
        <SeoTab onDirty={onDirty} />
      </div>
      <div id="panel-attrs" role="tabpanel" aria-labelledby="tab-attrs" hidden={tab !== "attrs"} className={tab === "attrs" ? "block" : "hidden"}>
        <AttrsTab onDirty={onDirty} />
      </div>
    </section>
  );
}

/* ---------- обёртка секции ---------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3">
      <div className="text-sm font-medium">{title}</div>
      {children}
    </div>
  );
}

/* ---------- вкладки ---------- */
function MainTab({ product, onDirty }: { product: Product; onDirty: () => void }) {
  return (
    <Section title="Основные поля">
      <label className="grid gap-1">
        <span className="text-xs opacity-70">Название</span>
        <input
          defaultValue={product.name}
          onChange={onDirty}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
          placeholder="Напр. Хлеб ржаной 400г"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs opacity-70">Описание</span>
        <textarea
          defaultValue={"Демо-описание товара…"}
          onChange={onDirty}
          className="min-h-[120px] rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Категория</span>
          <select
            defaultValue={product.categoryId || ""}
            onChange={onDirty}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
          >
            <option value="">—</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-xs opacity-70">Slug</span>
          <input
            defaultValue={(product.sku || product.id).toLowerCase()}
            onChange={onDirty}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs opacity-70">Теги (демо)</span>
          <input
            placeholder="хит, сезон"
            onChange={onDirty}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
          />
        </label>
      </div>
    </Section>
  );
}

function VariantsTab({ onDirty }: { onDirty: () => void }) {
  return (
    <Section title="Варианты и опции">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" onChange={onDirty} /> Включить варианты
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Опции (через запятую)</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
            placeholder="Вкус, Объём"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Генерация SKU (демо)</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
            placeholder="Шаблон SKU"
          />
        </label>
      </div>
      <div className="text-xs text-white/70">
        Демо: таблица вариантов опущена; тут может быть матрица.
      </div>
    </Section>
  );
}

function PriceTab({ onDirty }: { onDirty: () => void }) {
  return (
    <Section title="Цена (демо)">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Цена базовая (₽)</span>
          <input
            type="number"
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Акционная цена (₽)</span>
          <input
            type="number"
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Канал</span>
          <select
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          >
            <option value="online">Online</option>
            <option value="manager">Manager</option>
          </select>
        </label>
      </div>
      <div className="text-xs text-white/70">
        Демо: матрица по каналам/локациям/валютам может быть добавлена позже.
      </div>
    </Section>
  );
}

function InventoryTab({ onDirty }: { onDirty: () => void }) {
  return (
    <Section title="Склад (демо)">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Остаток общий</span>
          <input
            type="number"
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Минимальный остаток</span>
          <input
            type="number"
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Политика бэк-ордера</span>
          <select
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          >
            <option>Запретить</option>
            <option>Разрешить</option>
          </select>
        </label>
      </div>
    </Section>
  );
}

function MediaTab({ onDirty }: { onDirty: () => void }) {
  return (
    <Section title="Медиа">
      <div className="grid gap-2">
        <input
          type="file"
          onChange={onDirty}
          className="rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-4 text-sm"
        />
        <div className="text-xs text-white/70">Перетащите файлы сюда (демо)</div>
      </div>
    </Section>
  );
}

function SeoTab({ onDirty }: { onDirty: () => void }) {
  return (
    <Section title="SEO">
      <label className="grid gap-1">
        <span className="text-xs opacity-70">Meta Title</span>
        <input
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
          onChange={onDirty}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs opacity-70">Meta Description</span>
        <textarea
          className="min-h-[100px] rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
          onChange={onDirty}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" onChange={onDirty} /> Разрешить индексацию
      </label>
    </Section>
  );
}

function AttrsTab({ onDirty }: { onDirty: () => void }) {
  return (
    <Section title="Атрибуты">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Бренд</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Материал</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Гарантия (мес)</span>
          <input
            type="number"
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onChange={onDirty}
          />
        </label>
      </div>
    </Section>
  );
}