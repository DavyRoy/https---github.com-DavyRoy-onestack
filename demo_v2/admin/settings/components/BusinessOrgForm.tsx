"use client";

type Business = {
  name?: string;
  reg?: string;
  address?: string;
  site?: string;
  email?: string;
  tz?: string;
  phone?: string;
};

export default function BusinessOrgForm({
  value,
  onChange,
}: {
  value: Business;
  onChange: (v: Business) => void;
}) {
  const v = value || {};
  const update = (key: keyof Business, val: string) => onChange({ ...v, [key]: val });

  // helpers
  const trim = (s: string) => s.trim();
  const normalizeUrl = (s: string) => {
    const t = trim(s);
    if (!t) return "";
    if (/^https?:\/\//i.test(t)) return t;
    try {
      // если ввели домен без схемы — добавим https://
      // не валидируем глубоко, лишь не ломаем ввод
      return `https://${t}`;
    } catch {
      return t;
    }
  };
  const normalizeEmail = (s: string) => trim(s).toLowerCase();

  return (
    <section className="grid gap-4 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Организация</div>

      <div className="grid gap-3 sm:grid-cols-2 min-w-0">
        {/* Название */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="biz-name">
          <span className="text-white/80">Название</span>
          <input
            id="biz-name"
            name="organization"
            autoComplete="organization"
            spellCheck={false}
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            placeholder="ООО «Компания»"
            value={v.name || ""}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>

        {/* Рег */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="biz-reg">
          <span className="text-white/80">ИНН / Рег. номер</span>
          <input
            id="biz-reg"
            name="tax-id"
            autoComplete="off"
            spellCheck={false}
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            placeholder="7700000000"
            value={v.reg || ""}
            onChange={(e) => update("reg", e.target.value)}
          />
        </label>

        {/* Адрес */}
        <label className="grid gap-1 text-sm sm:col-span-2 min-w-0" htmlFor="biz-address">
          <span className="text-white/80">Юридический адрес</span>
          <input
            id="biz-address"
            name="street-address"
            autoComplete="street-address"
            spellCheck={false}
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            placeholder="г. Москва, ул. Примерная, д. 1"
            value={v.address || ""}
            onChange={(e) => update("address", e.target.value)}
          />
        </label>

        {/* Сайт */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="biz-site">
          <span className="text-white/80">Сайт</span>
          <input
            id="biz-site"
            name="url"
            type="url"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="https://example.com"
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.site || ""}
            onChange={(e) => update("site", e.target.value)}
            onBlur={(e) => update("site", normalizeUrl(e.target.value))}
            aria-describedby="biz-site-hint"
          />
          <span id="biz-site-hint" className="text-[11px] text-white/50">
            Если схема не указана, добавим <code>https://</code>
          </span>
        </label>

        {/* Email */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="biz-email">
          <span className="text-white/80">E-mail для чеков</span>
          <input
            id="biz-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="billing@example.com"
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.email || ""}
            onChange={(e) => update("email", e.target.value)}
            onBlur={(e) => update("email", normalizeEmail(e.target.value))}
          />
        </label>

        {/* TZ */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="biz-tz">
          <span className="text-white/80">Часовой пояс</span>
          <select
            id="biz-tz"
            name="timezone"
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.tz || "Europe/Moscow"}
            onChange={(e) => update("tz", e.target.value)}
          >
            <option value="Europe/Moscow">Europe/Moscow</option>
            <option value="Asia/Seoul">Asia/Seoul</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </label>

        {/* Телефон */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="biz-phone">
          <span className="text-white/80">Телефон</span>
          <input
            id="biz-phone"
            name="tel"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 000 000-00-00"
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.phone || ""}
            onChange={(e) => update("phone", e.target.value)}
          />
        </label>
      </div>

      {/* Preview */}
      <div
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/70 mt-2 overflow-x-auto"
        role="region"
        aria-labelledby="biz-preview-title"
      >
        <div id="biz-preview-title" className="sr-only">
          Предпросмотр данных
        </div>
        <div className="font-medium text-white/80 mb-1 not-sr-only">Предпросмотр данных</div>
        <pre className="text-[11px] whitespace-pre-wrap break-words">
          {JSON.stringify(v, null, 2)}
        </pre>
      </div>
    </section>
  );
}