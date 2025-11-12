"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Home, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";

type FormState = {
  name: string;
  email: string;
  phone: string;
  tags: string; // строка с запятыми, парсим при сабмите
  source: "site" | "ref" | "offline";
};

export default function ClientNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    tags: "",
    source: "site",
  });
  const [err, setErr] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  // нормализуем телефон только для проверки/tel-ссылки (демо)
  const normalizePhone = useCallback((v: string) => v.replace(/[^\d+]/g, ""), []);
  const emailRe = useMemo(() => /\S+@\S+\.\S+/, []);
  const phoneRe = useMemo(() => /^\+?[\d\s\-()]{6,}$/, []);

  const validate = useCallback(
    (s: FormState) => {
      const e: Partial<Record<keyof FormState, string>> = {};
      if (!s.name.trim()) e.name = "Имя обязательно";
      if (s.email && !emailRe.test(s.email.trim())) e.email = "Некорректный e-mail";
      if (s.phone && !phoneRe.test(s.phone.trim())) e.phone = "Некорректный телефон";
      return e;
    },
    [emailRe, phoneRe]
  );

  const onSubmit = useCallback(() => {
    if (saving) return;
    const nextErr = validate(form);
    setErr(nextErr);
    if (Object.keys(nextErr).length) {
      toast.error("Проверьте поля формы");
      return;
    }

    setSaving(true);

    // демо: создаём ID локально и редиректим
    const id = "cl-" + Date.now().toString().slice(-6);
    const tags = form.tags
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const qs = new URLSearchParams({
      created: "1",
      name: form.name.trim(),
      email: form.email.trim(),
      phone: normalizePhone(form.phone),
      tags: tags.join("|"),
      source: form.source,
    });

    toast.success("Клиент сохранён (демо)");
    router.push(`/demo/manager/crm/clients/${id}?${qs.toString()}`);
  }, [form, normalizePhone, router, saving, validate]);

  const Input = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    type = "text",
    autoComplete,
    inputMode,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    type?: "text" | "email" | "tel";
    autoComplete?: string;
    inputMode?: React.ComponentProps<"input">["inputMode"];
  }) => (
    <label htmlFor={id} className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint="done"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={
          T.input +
          (error ? " border-red-400/50 focus:ring-red-300/30" : "")
        }
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          // снимаем ошибку по мере правки конкретного поля
          if (error) setErr((prev) => ({ ...prev, [id]: undefined }));
        }}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <span id={`${id}-err`} className="text-[11px] text-red-300/90">
          {error}
        </span>
      )}
    </label>
  );

  return (
    <div className="grid gap-5 md:gap-6">
      {/* Хедер */}
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <nav
              className="flex items-center gap-1 text-xs text-white/70"
              aria-label="Хлебные крошки"
            >
              <Link
                href="/demo/manager/dashboard"
                prefetch={false}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Home width={14} height={14} /> Дашборд
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/demo/manager/crm" prefetch={false} className="hover:underline">
                CRM
              </Link>
              <span className="opacity-40">/</span>
              <Link
                href="/demo/manager/crm/clients"
                prefetch={false}
                className="hover:underline"
              >
                Клиенты
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-white/80" aria-current="page">
                Новый клиент
              </span>
            </nav>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              Новый клиент
            </h1>
            <p className={"mt-1 text-sm " + T.dim}>
              Заполните ключевые поля — остальные можно добавить позже.
            </p>
          </div>

          <Link
            href="/demo/manager/crm/clients"
            prefetch={false}
            className="btn min-h-[38px]"
            aria-label="Отмена и возврат к списку клиентов"
          >
            <ArrowLeft width={16} height={16} /> Отмена
          </Link>
        </div>
      </header>

      {/* Форма */}
      <section className={T.card}>
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          aria-labelledby="client-new-form-title"
        >
          <h2 id="client-new-form-title" className="sr-only">
            Форма создания клиента
          </h2>

          <Input
            id="name"
            label="Имя"
            value={form.name}
            onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            placeholder="Иван Петров / ООО «Пример»"
            error={err.name}
            autoComplete="name"
          />
          <Input
            id="email"
            type="email"
            inputMode="email"
            label="E-mail"
            value={form.email}
            onChange={(v) => setForm((s) => ({ ...s, email: v }))}
            placeholder="you@example.com"
            error={err.email}
            autoComplete="email"
          />
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            label="Телефон"
            value={form.phone}
            onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
            placeholder="+7 900 000-00-00"
            error={err.phone}
            autoComplete="tel"
          />
          <Input
            id="tags"
            label="Теги (через запятую)"
            value={form.tags}
            onChange={(v) => setForm((s) => ({ ...s, tags: v }))}
            placeholder="VIP, salon"
          />

          <label className="grid gap-1">
            <span className="text-xs text-white/70">Источник</span>
            <select
              className={T.input}
              value={form.source}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  source: e.target.value as FormState["source"],
                }))
              }
              aria-label="Источник клиента"
            >
              <option value="site">Сайт</option>
              <option value="ref">Реферал</option>
              <option value="offline">Офлайн</option>
            </select>
          </label>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="btn btn-primary min-h-[40px] inline-flex items-center gap-2"
              disabled={saving}
              aria-disabled={saving}
            >
              <Save width={16} height={16} />
              {saving ? "Сохранение…" : "Сохранить"}
            </button>
            <Link
              className="btn min-h-[40px]"
              href="/demo/manager/crm/clients"
              prefetch={false}
            >
              Отмена
            </Link>
          </div>

          {/* live-зона для озвучивания ошибок/сохранения скринридерам */}
          <div className="sr-only" aria-live="polite">
            {Object.values(err).filter(Boolean).length
              ? "Есть ошибки в форме"
              : saving
              ? "Идёт сохранение"
              : ""}
          </div>
        </form>
      </section>
    </div>
  );
}