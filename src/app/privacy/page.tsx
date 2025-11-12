// src/app/privacy/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import PolicyLayout from "@/components/PolicyLayout";

/* ──────────────── SEO constants ──────────────── */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://onestack24.ru";
const CANONICAL = `${SITE_URL}/privacy`;

const ORG = {
  name: "OneStack",
  url: SITE_URL,
  email: "info@onestack24.ru",
  phone: "+7 (910) 948 61 06",
  sameAs: ["https://onestack24.ru"],
};

const TITLE = "Политика конфиденциальности — OneStack";
const DESCRIPTION =
  "Политика обработки персональных данных и конфиденциальности платформы OneStack.";

/* ──────────────── Metadata (App Router) ──────────────── */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: CANONICAL,
    siteName: ORG.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      { url: "/og/privacy.png", width: 1200, height: 630, alt: "OneStack — Политика конфиденциальности" },
    ],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og/privacy.png"],
  },
};

export default function PrivacyPage() {
  const toc = [
    { href: "#intro", label: "1. Общие положения" },
    { href: "#principles", label: "2. Принципы и цели обработки" },
    { href: "#scope", label: "3. Состав данных" },
    { href: "#legal", label: "4. Правовые основания" },
    { href: "#transfer", label: "5. Передача и хранение" },
    { href: "#rights", label: "6. Права субъектов" },
    { href: "#security", label: "7. Безопасность" },
    { href: "#cookies", label: "8. Cookies и аналитика" },
    { href: "#retention", label: "9. Сроки хранения" },
    { href: "#contacts", label: "10. Контакты" },
  ];

  // JSON-LD блоки
  const LD_WEBPAGE = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    url: CANONICAL,
    description: DESCRIPTION,
    inLanguage: "ru-RU",
    isPartOf: { "@type": "WebSite", name: ORG.name, url: SITE_URL },
    lastReviewed: "2025-08-25",
  };

  const LD_BREADCRUMBS = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Политика конфиденциальности", item: CANONICAL },
    ],
  };

  const LD_ORG = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG.name,
    url: ORG.url,
    email: ORG.email,
    telephone: ORG.phone,
    sameAs: ORG.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: ORG.email,
        telephone: ORG.phone,
        availableLanguage: ["ru", "en"],
        areaServed: ["RU", "KZ", "BY", "AM"],
      },
    ],
  };

  return (
    <>
      {/* JSON-LD для SEO */}
      <Script
        id="ld-webpage-privacy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_WEBPAGE) }}
      />
      <Script
        id="ld-breadcrumbs-privacy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_BREADCRUMBS) }}
      />
      <Script
        id="ld-organization-privacy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_ORG) }}
      />

      <PolicyLayout
        title="Политика конфиденциальности"
        subtitle="Как мы собираем, используем и защищаем ваши данные"
        updatedAt="25.08.2025"
        backHref="/home"
        toc={toc}
      >
        <h2 id="intro">1. Общие положения</h2>
        <p>
          Настоящая Политика конфиденциальности (далее — «Политика») действует
          в отношении всех персональных данных, которые <strong>OneStack</strong>{" "}
          (далее — «Мы», «Компания») может получить о пользователях в рамках
          предоставления услуг, демонстраций, тестовых окружений и коммуникаций
          через сайт, приложения и иные каналы связи.
        </p>
        <p>
          Обработка персональных данных осуществляется в соответствии с
          применимым законодательством, включая Федеральный закон РФ № 152-ФЗ
          «О персональных данных» и иные нормы в зависимости от юрисдикции
          пользователя.
        </p>

        <h2 id="principles">2. Принципы и цели обработки</h2>
        <ul>
          <li>Законность, справедливость и прозрачность обработки.</li>
          <li>Ограничение целями и минимизация собираемых данных.</li>
          <li>Точность и актуальность.</li>
          <li>Ограничение сроков хранения.</li>
          <li>Целостность и конфиденциальность (безопасность).</li>
        </ul>
        <p>Мы обрабатываем данные для следующих целей:</p>
        <ul>
          <li>обработка заявок, брифов и обратной связи;</li>
          <li>исполнение договоров и предоставление услуг;</li>
          <li>улучшение качества сервисов и пользовательского опыта;</li>
          <li>коммуникации по продуктам, новостям и обновлениям (с согласия);</li>
          <li>выполнение требований закона и защита прав и интересов.</li>
        </ul>

        <h2 id="scope">3. Состав данных</h2>
        <p>Мы можем обрабатывать следующие категории персональных данных:</p>
        <ul>
          <li>
            Идентификационные: имя, должность, компания, страна/город, контактные
            данные (email, телефон, мессенджеры).
          </li>
          <li>
            Данные, предоставленные в заявках/брифах: описание проекта, бюджеты/сроки,
            ссылки на материалы.
          </li>
          <li>
            Технические: IP-адрес, user-agent, cookie-файлы, параметры устройства,
            события взаимодействия (при использовании наших сайтов/демо).
          </li>
          <li>
            Данные о платежах/счетах (при заключении договора и оплате) — обрабатываются
            через интегрированных платёжных провайдеров.
          </li>
        </ul>

        <h2 id="legal">4. Правовые основания</h2>
        <p>
          Обработка осуществляется на основании вашего согласия, исполнения
          договора/оферты, законных интересов Компании (например, улучшение
          сервисов), а также в случаях, предусмотренных законом.
        </p>

        <h2 id="transfer">5. Передача и хранение данных</h2>
        <ul>
          <li>
            Подрядчики и провайдеры (хостинг, аналитика, платёжные сервисы,
            коммуникации) — исключительно в объёме, необходимом для оказания услуг.
          </li>
          <li>
            Трансграничная передача может осуществляться при условии обеспечения
            надлежащего уровня защиты и заключения необходимых соглашений.
          </li>
          <li>
            Хранение — на защищённых серверах провайдеров, с резервным копированием
            и ограничением доступа.
          </li>
        </ul>

        <h2 id="rights">6. Права субъектов данных</h2>
        <p>Вы вправе:</p>
        <ul>
          <li>получить сведения об обработке и доступ к своим данным;</li>
          <li>требовать исправления неточных данных;</li>
          <li>запросить удаление (если нет законных оснований для хранения);</li>
          <li>ограничить обработку или возразить против неё;</li>
          <li>отозвать согласие (не затрагивает законность предыдущей обработки).</li>
        </ul>
        <p>
          Запросы можно направлять по контактам, указанным в разделе 10.
          Для обработки запроса мы можем попросить подтвердить вашу личность.
        </p>

        <h2 id="security">7. Меры безопасности</h2>
        <ul>
          <li>шифрование каналов связи (HTTPS), контроль доступа, аудит;</li>
          <li>резервное копирование и план восстановления;</li>
          <li>регулярные обновления и мониторинг инцидентов;</li>
          <li>минимизация прав доступа и принцип необходимости знать.</li>
        </ul>

        <h2 id="cookies">8. Cookies и аналитика</h2>
        <p>
          Мы используем cookies, пиксели и аналогичные технологии для
          авторизации, сохранения настроек, статистики и улучшения интерфейсов.
          Вы можете управлять cookies в настройках браузера. Отключение части
          cookies может повлиять на работу некоторых функций.
        </p>

        <h2 id="retention">9. Сроки хранения</h2>
        <p>
          Данные хранятся до достижения целей обработки или истечения сроков,
          установленных законом/договором. После этого данные удаляются или
          обезличиваются.
        </p>

        <h2 id="contacts">10. Контакты</h2>
        <p>
          По вопросам обработки персональных данных пишите на{" "}
          <a href={`mailto:${ORG.email}`}>{ORG.email}</a>, звоните по телефону{" "}
          <a href="tel:+79109486106">{ORG.phone}</a> или оставьте заявку на{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE_URL.replace("https://", "")}
          </a>.
          {/* Telegram добавим после подключения бота: OneStack Assistant */}
        </p>
      </PolicyLayout>
    </>
  );
}