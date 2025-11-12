"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminService, AdminServiceCategory } from "@/app/demo/(shared)/data/services";
import { useRouter, useSearchParams } from "next/navigation";

/* =================== утилиты =================== */

type Tab = "main" | "price" | "duration" | "resources" | "rules" | "media" | "seo";

const TABS: { id: Tab; label: string }[] = [
  { id: "main", label: "Основное" },
  { id: "price", label: "Цена" },
  { id: "duration", label: "Длительность/слоты" },
  { id: "resources", label: "Исполнители" },
  { id: "rules", label: "Правила" },
  { id: "media", label: "Медиа" },
  { id: "seo", label: "SEO" },
];

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function slugify(input: string) {
  const map: Record<string, string> = {
    а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"e", ж:"zh", з:"z", и:"i", й:"y",
    к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u", ф:"f",
    х:"h", ц:"c", ч:"ch", ш:"sh", щ:"sch", ъ:"", ы:"y", ь:"", э:"e", ю:"yu", я:"ya",
  };
  return input
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, ch => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* =================== компонент =================== */

export default function ServiceTabs({
  service,
  categories,
}: {
  service: AdminService;
  categories: AdminServiceCategory[];
}) {
  const sp = useSearchParams();
  const router = useRouter();

  // локальная форма
  const [name, setName] = useState(service.name);
  const [desc, setDesc] = useState<string>("");
  const [categoryId, setCategoryId] = useState(service.categoryId ?? "");
  const [tagsText, setTagsText] = useState((service.tags ?? []).join(", "));
  const [visibility, setVisibility] = useState<"all" | "crm">("all");

  const [basePrice, setBasePrice] = useState<number>(service.price);
  const [promoPrice, setPromoPrice] = useState<number | "">("");

  const [durationMin, setDurationMin] = useState<number>(service.durationMin);
  const [bufBefore, setBufBefore] = useState<number>(10);
  const [bufAfter, setBufAfter] = useState<number>(10);
  const [maxAheadDays, setMaxAheadDays] = useState<number>(30);

  const [requirePrepay, setRequirePrepay] = useState(false);
  const [freeCancelHours, setFreeCancelHours] = useState(24);
  const [penaltyRub, setPenaltyRub] = useState(0);
  const [autoConfirm, setAutoConfirm] = useState<"off" | "on">("off");

  const [slug, setSlug] = useState(service.slug ?? service.id);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [dirty, setDirty] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // активная вкладка из URL (?tab=)
  const tabFromUrl = (sp.get("tab") as Tab) || "main";
  const initialTab = TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl : "main";
  const [tab, setTab] = useState<Tab>(initialTab);

  // синхронизация вкладки → URL
  useEffect(() => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    next.set("tab", tab);
    router.replace(`?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // авто-slug при изменении названия
  useEffect(() => {
    if (!autoSlug) return;
    const nextSlug = slugify(name || service.slug || service.id);
    if (nextSlug !== slug) {
      setSlug(nextSlug);
      setDirty(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, autoSlug]);

  // формат чисел — мемоизируем форматтер
  const numFmt = useMemo(
    () => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }),
    []
  );
  const fmt = (n: number) => numFmt.format(Number.isFinite(n) ? n : 0);

  // парсинг тегов
  const tagsParsed = useMemo(
    () =>
      tagsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [tagsText]
  );

  // валидация
  const errors = useMemo(() => {
    const xs: string[] = [];
    const nameTrim = name.trim();
    const slugTrim = slug.trim();

    if (!nameTrim) xs.push("Укажите название услуги.");
    if (nameTrim.length > 120) xs.push("Название слишком длинное (макс. 120).");

    if (!slugTrim) xs.push("Slug обязателен.");
    if (slugTrim.length > 120) xs.push("Slug слишком длинный (макс. 120).");
    if (slugTrim && !SLUG_RE.test(slugTrim)) {
      xs.push("Slug может содержать только латиницу, цифры и дефисы (a-z, 0-9, -).");
    }

    if (!Number.isFinite(durationMin) || durationMin <= 0) {
      xs.push("Длительность должна быть больше 0.");
    }
    if (!Number.isFinite(basePrice) || basePrice < 0) {
      xs.push("Цена не может быть отрицательной.");
    }
    if (promoPrice !== "" && (!Number.isFinite(Number(promoPrice)) || Number(promoPrice) < 0)) {
      xs.push("Акционная цена не может быть отрицательной.");
    }
    if (promoPrice !== "" && Number(promoPrice) >= (Number(basePrice) || 0)) {
      xs.push("Акционная цена должна быть ниже базовой.");
    }

    return xs;
  }, [name, slug, durationMin, basePrice, promoPrice]);

  // индикатор «несохранённые изменения»
  const DirtyBadge = (
    <div
      className={cls(
        "text-[11px] rounded-lg px-2 py-0.5",
        dirty ? "bg-amber-400/15 text-amber-300" : "bg-white/10 text-white/60"
      )}
      title={dirty ? "Есть несохранённые изменения" : "Нет несохранённых изменений"}
    >
      {dirty ? "Изменено" : "Сохранено"}
    </div>
  );

  // сохранение (демо)
  const save = () => {
    if (errors.length) return;
    setDirty(false);
    alert("Сохранено (демо)");
  };

  // кнопка таба (клавиатурная навигация: ArrowLeft/Right)
  const TabBtn = ({ id, label, idx }: { id: Tab; label: string; idx: number }) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          const next = (idx + 1) % TABS.length;
          setTab(TABS[next].id);
        }
        if (e.key === "ArrowLeft") {
          const prev = (idx - 1 + TABS.length) % TABS.length;
          setTab(TABS[prev].id);
        }
      }}
      className={cls(
        "rounded-lg px-3 py-1.5 text-sm border transition",
        tab === id
          ? "border-white/30 bg-white/10"
          : "border-transparent bg-white/5 hover:bg-white/10"
      )}
      role="tab"
      aria-selected={tab === id}
      aria-controls={`panel-${id}`}
    >
      {label}
    </button>
  );

  return (
    <section className="grid gap-3">
      {/* таб-бар */}
      <div className="sticky top-0 z-10 -mx-4 md:-mx-5 px-4 md:px-5 py-2 backdrop-blur-sm bg-black/10 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar"
            role="tablist"
            aria-label="Вкладки услуги"
          >
            {TABS.map((t, i) => (
              <TabBtn key={t.id} id={t.id} label={t.label} idx={i} />
            ))}
          </div>
          {DirtyBadge}
        </div>
      </div>

      {/* ошибки */}
      {errors.length > 0 && (
        <ul className="mt-1 list-disc space-y-1 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300 pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {/* контент вкладок */}
      {tab === "main" && (
        <Section id="panel-main" title="Основное">
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Название</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDirty(true);
              }}
              maxLength={120}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Например: Стрижка женская"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs opacity-70">Краткое описание</span>
            <textarea
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                setDirty(true);
              }}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Коротко о пользе/этапах услуги…"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-xs opacity-70">Категория</span>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setDirty(true);
                }}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="">—</option>
                {(Array.isArray(categories) ? categories : []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs opacity-70">Теги (через запятую)</span>
              <input
                value={tagsText}
                onChange={(e) => {
                  setTagsText(e.target.value);
                  setDirty(true);
                }}
                placeholder="hit, season, vip"
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              />
              {tagsParsed.length > 0 && (
                <div className="text-[11px] text-white/60">
                  Итог:{" "}
                  {tagsParsed.map((t) => (
                    <span key={t} className="mr-1 inline-block rounded bg-white/10 px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </label>

            <label className="grid gap-1">
              <span className="text-xs opacity-70">Видимость</span>
              <select
                value={visibility}
                onChange={(e) => {
                  setVisibility(e.target.value as any);
                  setDirty(true);
                }}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="all">На сайте и в CRM</option>
                <option value="crm">Только в CRM</option>
              </select>
            </label>
          </div>

          <div className="text-xs text-white/60">Audit: изменено демо-пользователем 2025-09-10 12:00</div>
        </Section>
      )}

      {tab === "price" && (
        <Section id="panel-price" title="Цена">
          <div className="grid gap-3 md:grid-cols-3">
            <Num
              label="Базовая цена (₽)"
              value={basePrice}
              min={0}
              onChange={(v) => {
                setBasePrice(v ?? 0);
                setDirty(true);
              }}
            />
            <Num
              label="Акционная цена (₽)"
              value={promoPrice === "" ? "" : Number(promoPrice)}
              allowEmpty
              min={0}
              onChange={(v) => {
                setPromoPrice(v === null ? "" : v);
                setDirty(true);
              }}
            />
            <label className="grid gap-1">
              <span className="text-xs opacity-70">Канал</span>
              <select className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none">
                <option value="online">Online</option>
                <option value="manager">Manager</option>
              </select>
            </label>
          </div>

          <div className="mt-1 text-xs text-white/60">
            Итог для клиента:{" "}
            <span className="font-medium text-white/80">
              {fmt(promoPrice === "" ? basePrice : Number(promoPrice))} ₽
            </span>
            . Для массовых изменений используйте раздел «Прайс-лист».
          </div>
        </Section>
      )}

      {tab === "duration" && (
        <Section id="panel-duration" title="Длительность и слоты">
          <div className="grid gap-3 md:grid-cols-4">
            <Num
              label="Длительность (мин)"
              value={durationMin}
              min={1}
              onChange={(v) => {
                setDurationMin(v || 0);
                setDirty(true);
              }}
            />
            <Num
              label="Буфер до (мин)"
              value={bufBefore}
              min={0}
              onChange={(v) => {
                setBufBefore(v || 0);
                setDirty(true);
              }}
            />
            <Num
              label="Буфер после (мин)"
              value={bufAfter}
              min={0}
              onChange={(v) => {
                setBufAfter(v || 0);
                setDirty(true);
              }}
            />
            <Num
              label="Максимум вперёд (дней)"
              value={maxAheadDays}
              min={0}
              onChange={(v) => {
                setMaxAheadDays(v || 0);
                setDirty(true);
              }}
            />
          </div>
          <div className="text-xs text-white/60">
            Буферы помогают избежать «стыка» записей и учитывают подготовку/уборку.
          </div>
        </Section>
      )}

      {tab === "resources" && (
        <Section id="panel-resources" title="Исполнители/ресурсы (демо)">
          {/* В реале сюда подтягиваем список специалистов и их навыки */}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" onChange={() => setDirty(true)} /> Мастер 1
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked onChange={() => setDirty(true)} /> Мастер 2
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" onChange={() => setDirty(true)} /> Мастер 3
          </label>
        </Section>
      )}

      {tab === "rules" && (
        <Section id="panel-rules" title="Правила">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={requirePrepay}
              onChange={(e) => {
                setRequirePrepay(e.target.checked);
                setDirty(true);
              }}
            />
            Требовать предоплату
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <Num
              label="Бесплатная отмена до (ч)"
              value={freeCancelHours}
              min={0}
              onChange={(v) => {
                setFreeCancelHours(v || 0);
                setDirty(true);
              }}
            />
            <Num
              label="Штраф (₽)"
              value={penaltyRub}
              min={0}
              onChange={(v) => {
                setPenaltyRub(v || 0);
                setDirty(true);
              }}
            />
            <label className="grid gap-1">
              <span className="text-xs opacity-70">Автоподтверждение</span>
              <select
                value={autoConfirm}
                onChange={(e) => {
                  setAutoConfirm(e.target.value as "off" | "on");
                  setDirty(true);
                }}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
              >
                <option value="off">Выкл.</option>
                <option value="on">Вкл.</option>
              </select>
            </label>
          </div>
        </Section>
      )}

      {tab === "media" && (
        <Section id="panel-media" title="Медиа">
          <input
            type="file"
            multiple
            onChange={() => setDirty(true)}
            className="rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-6 text-sm"
          />
          <div className="text-xs text-white/60">Поддерживаются изображения до 10 МБ.</div>
        </Section>
      )}

      {tab === "seo" && (
        <Section id="panel-seo" title="SEO">
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Slug</span>
            <div className="flex items-center gap-2">
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase());
                  setAutoSlug(false);
                  setDirty(true);
                }}
                className={cls(
                  "flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30",
                  SLUG_RE.test(slug || "") ? "border-white/15 bg-white/10" : "border-rose-400 bg-rose-400/10"
                )}
                placeholder="female-haircut"
                maxLength={120}
                aria-invalid={!SLUG_RE.test(slug || "") || undefined}
              />
              <button
                type="button"
                onClick={() => {
                  setSlug(slugify(name || service.slug || service.id));
                  setAutoSlug(true);
                  setDirty(true);
                }}
                className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                title="Сгенерировать из названия"
              >
                Авто
              </button>
            </div>
            <div className="text-[11px] text-white/60">
              Урл-сегмент: латиница/цифры/дефис. Пример:{" "}
              <code className="opacity-80">/services/{slug || "slug"}</code>
            </div>
          </label>

          <label className="grid gap-1">
            <span className="text-xs opacity-70">Meta Title</span>
            <input
              value={metaTitle}
              onChange={(e) => {
                setMetaTitle(e.target.value);
                setDirty(true);
              }}
              maxLength={120}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs opacity-70">Meta Description</span>
            <textarea
              value={metaDescription}
              onChange={(e) => {
                setMetaDescription(e.target.value);
                setDirty(true);
              }}
              maxLength={300}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-white/30"
            />
          </label>
        </Section>
      )}

      {/* действия */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            // откат к исходным данным (минимальный)
            setName(service.name);
            setDesc("");
            setCategoryId(service.categoryId ?? "");
            setTagsText((service.tags ?? []).join(", "));
            setVisibility("all");

            setBasePrice(service.price);
            setPromoPrice("");

            setDurationMin(service.durationMin);
            setBufBefore(10);
            setBufAfter(10);
            setMaxAheadDays(30);

            setRequirePrepay(false);
            setFreeCancelHours(24);
            setPenaltyRub(0);
            setAutoConfirm("off");

            setSlug(service.slug ?? service.id);
            setMetaTitle("");
            setMetaDescription("");
            setAutoSlug(true);
            setDirty(false);
          }}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
        >
          Сбросить
        </button>
        <button
          onClick={save}
          disabled={errors.length > 0 || !dirty}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
          title={errors.length ? "Исправьте ошибки выше" : dirty ? "Сохранить изменения" : "Нет изменений"}
        >
          Сохранить
        </button>
      </div>
    </section>
  );
}

/* =================== вспомогательные =================== */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={id.replace("panel", "tab")}
      className="grid gap-3 rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">{title}</div>
      </div>
      {children}
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  min = 0,
  allowEmpty = false,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | null) => void;
  min?: number;
  allowEmpty?: boolean;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs opacity-70">{label}</span>
      <input
        type="number"
        value={value === "" ? "" : Number.isFinite(value) ? (value as number) : 0}
        min={min}
        onChange={(e) => {
          const raw = e.target.value;
          if (allowEmpty && raw === "") return onChange(null);
          const num = Number(raw);
          onChange(Number.isNaN(num) ? 0 : num);
        }}
        className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
      />
    </label>
  );
}