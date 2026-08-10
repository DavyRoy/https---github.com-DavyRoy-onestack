"use client";

import { useState } from "react";
import PolicyLayout from "@/components/PolicyLayout";
const ORG = {
  name: "OneStack",
  email: "info@onestack24.ru",
  phone: "+7 (910) 948 61 06",
  url: "https://onestack24.ru",
};

const TOC_RU = [
  { href: "#intro",      label: "1. Общие положения"           },
  { href: "#principles", label: "2. Принципы и цели"           },
  { href: "#scope",      label: "3. Состав данных"             },
  { href: "#legal",      label: "4. Правовые основания"        },
  { href: "#transfer",   label: "5. Передача и хранение"       },
  { href: "#rights",     label: "6. Права субъектов"           },
  { href: "#security",   label: "7. Безопасность"              },
  { href: "#cookies",    label: "8. Cookies и аналитика"       },
  { href: "#retention",  label: "9. Сроки хранения"            },
  { href: "#gdpr",       label: "10. Для пользователей из ЕС"  },
  { href: "#contacts",   label: "11. Контакты"                 },
];

const TOC_EN = [
  { href: "#intro",      label: "1. General Provisions"        },
  { href: "#principles", label: "2. Principles & Purposes"     },
  { href: "#scope",      label: "3. Data We Collect"           },
  { href: "#legal",      label: "4. Legal Bases"               },
  { href: "#transfer",   label: "5. Transfer & Storage"        },
  { href: "#rights",     label: "6. Your Rights"               },
  { href: "#security",   label: "7. Security"                  },
  { href: "#cookies",    label: "8. Cookies & Analytics"       },
  { href: "#retention",  label: "9. Retention"                 },
  { href: "#gdpr",       label: "10. EU / GDPR"                },
  { href: "#contacts",   label: "11. Contact Us"               },
];

function ContentRU() {
  return (
    <>
      <h2 id="intro">1. Общие положения</h2>
      <p>
        Настоящая Политика конфиденциальности (далее — «Политика») действует в отношении
        всех персональных данных, которые <strong>OneStack</strong> (далее — «Мы», «Компания»)
        может получить о пользователях при предоставлении услуг, демонстраций, тестовых
        окружений и коммуникаций через сайт, приложения и иные каналы связи.
      </p>
      <p>
        Обработка персональных данных осуществляется в соответствии с Федеральным
        законом РФ № 152-ФЗ «О персональных данных» от 27.07.2006, а также иными
        применимыми нормами в зависимости от юрисдикции пользователя (включая GDPR
        для резидентов ЕЭЗ — см. раздел 10).
      </p>

      <h2 id="principles">2. Принципы и цели обработки</h2>
      <p>Мы придерживаемся следующих принципов:</p>
      <ul>
        <li>Законность, добросовестность и прозрачность обработки.</li>
        <li>Ограничение целями и минимизация собираемых данных.</li>
        <li>Точность и актуальность данных.</li>
        <li>Ограничение сроков хранения.</li>
        <li>Целостность и конфиденциальность (безопасность).</li>
      </ul>
      <p>Мы обрабатываем данные в следующих целях:</p>
      <ul>
        <li>приём и обработка заявок, брифов и обратной связи;</li>
        <li>исполнение договоров и оказание услуг;</li>
        <li>улучшение качества сервисов и пользовательского опыта;</li>
        <li>информирование о продуктах и обновлениях (с вашего согласия);</li>
        <li>соблюдение требований законодательства и защита законных интересов.</li>
      </ul>

      <h2 id="scope">3. Состав обрабатываемых данных</h2>
      <p>Мы можем обрабатывать следующие категории данных:</p>
      <ul>
        <li><strong>Идентификационные:</strong> имя, должность, компания, страна/город, email, телефон, мессенджеры.</li>
        <li><strong>Данные заявок/брифов:</strong> описание проекта, бюджет, сроки, ссылки на материалы.</li>
        <li><strong>Технические:</strong> IP-адрес, user-agent, cookie-файлы, параметры устройства, события взаимодействия.</li>
        <li><strong>Платёжные:</strong> реквизиты счетов и договоров (обрабатываются через интегрированных провайдеров).</li>
      </ul>

      <h2 id="legal">4. Правовые основания обработки</h2>
      <p>Обработка данных осуществляется на основании:</p>
      <ul>
        <li><strong>согласия</strong> субъекта персональных данных (ч. 1 ст. 6 152-ФЗ);</li>
        <li><strong>исполнения договора</strong>, стороной которого является субъект;</li>
        <li><strong>законных интересов</strong> Компании (улучшение сервисов, безопасность);</li>
        <li><strong>требований закона</strong> в случаях, предусмотренных нормативными актами РФ.</li>
      </ul>

      <h2 id="transfer">5. Передача и хранение данных</h2>
      <ul>
        <li>Данные передаются подрядчикам и провайдерам (хостинг, аналитика, платёжные сервисы, коммуникации) исключительно в необходимом объёме и на основании соглашений о конфиденциальности.</li>
        <li>Трансграничная передача осуществляется при условии надлежащего уровня защиты и с соблюдением требований ст. 12 152-ФЗ (уведомление Роскомнадзора при необходимости).</li>
        <li>Данные хранятся на защищённых серверах, расположенных на территории РФ и/или в юрисдикциях с надлежащим уровнем защиты.</li>
        <li>Мы используем российские облачные решения (Yandex Cloud, VK Cloud) для хранения данных пользователей из РФ.</li>
      </ul>

      <h2 id="rights">6. Права субъектов данных</h2>
      <p>В соответствии с 152-ФЗ вы вправе:</p>
      <ul>
        <li>получить информацию об обработке ваших данных и доступ к ним;</li>
        <li>требовать уточнения, блокирования или уничтожения данных;</li>
        <li>отозвать согласие на обработку (не затрагивает законность предыдущей обработки);</li>
        <li>обжаловать действия Компании в Роскомнадзор или в суд.</li>
      </ul>
      <p>Запросы направляйте по контактам из раздела 11. Для подтверждения личности мы можем запросить дополнительные сведения.</p>

      <h2 id="security">7. Меры безопасности</h2>
      <ul>
        <li>Шифрование каналов связи (HTTPS/TLS), контроль доступа и аудит.</li>
        <li>Резервное копирование и план восстановления после инцидентов.</li>
        <li>Регулярные обновления программного обеспечения и мониторинг угроз.</li>
        <li>Принцип минимальных привилегий доступа к данным.</li>
      </ul>

      <h2 id="cookies">8. Cookies и аналитика</h2>
      <p>
        Мы используем cookies, пиксели и аналогичные технологии для авторизации,
        сохранения настроек, сбора статистики (Яндекс Метрика, Google Analytics)
        и улучшения интерфейсов. Вы можете управлять cookies в настройках браузера.
        Отключение части cookies может повлиять на функциональность сервиса.
      </p>

      <h2 id="retention">9. Сроки хранения данных</h2>
      <p>
        Данные хранятся до достижения целей обработки или истечения сроков, установленных
        законом РФ (как правило, не более 5 лет с момента прекращения отношений). После
        этого данные удаляются или необратимо обезличиваются.
      </p>

      <h2 id="gdpr">10. Для пользователей из ЕС / ЕЭЗ (GDPR)</h2>
      <p>
        Если вы находитесь в Европейском Союзе или Европейской экономической зоне, на
        обработку ваших данных дополнительно распространяется Регламент (ЕС) 2016/679
        (GDPR). В этом случае:
      </p>
      <ul>
        <li>Контролёр данных: <strong>OneStack</strong>, {ORG.email}.</li>
        <li>Правовые основания по GDPR: согласие (ст. 6(1)(a)), исполнение договора (ст. 6(1)(b)), законные интересы (ст. 6(1)(f)).</li>
        <li>Вы вправе: получить доступ к данным (ст. 15), исправить (ст. 16), удалить (ст. 17), ограничить обработку (ст. 18), на переносимость (ст. 20), возразить (ст. 21).</li>
        <li>Вы вправе подать жалобу в надзорный орган по месту жительства.</li>
        <li>Передача данных за пределы ЕЭЗ осуществляется на основании стандартных договорных условий (SCC) или иных механизмов, предусмотренных GDPR.</li>
        <li>Мы не осуществляем автоматизированное принятие решений, оказывающих существенное влияние на ваши права (профилинг в смысле ст. 22 GDPR).</li>
      </ul>

      <h2 id="contacts">11. Контакты</h2>
      <p>По вопросам обработки персональных данных:</p>
      <ul>
        <li>Email: <a href={`mailto:${ORG.email}`}>{ORG.email}</a></li>
        <li>Телефон: <a href="tel:+79109486106">{ORG.phone}</a></li>
        <li>Telegram: <a href="https://t.me/onestack_assistant_bot" target="_blank" rel="noopener noreferrer">@onestack_assistant_bot</a></li>
        <li>Сайт: <a href={ORG.url} target="_blank" rel="noopener noreferrer">{ORG.url.replace("https://", "")}</a></li>
      </ul>
    </>
  );
}

function ContentEN() {
  return (
    <>
      <h2 id="intro">1. General Provisions</h2>
      <p>
        This Privacy Policy (&ldquo;Policy&rdquo;) applies to all personal data that <strong>OneStack</strong>
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;Company&rdquo;) may collect about users when providing services,
        demos, test environments, and communications via the website, applications, and other channels.
      </p>
      <p>
        We process personal data in accordance with applicable law, including Russian Federal Law
        No. 152-FZ &ldquo;On Personal Data&rdquo; and, for users in the EU/EEA, Regulation (EU)
        2016/679 (GDPR) — see Section 10.
      </p>

      <h2 id="principles">2. Principles &amp; Purposes</h2>
      <p>We are committed to the following principles:</p>
      <ul>
        <li>Lawfulness, fairness, and transparency.</li>
        <li>Purpose limitation and data minimisation.</li>
        <li>Accuracy and up-to-date data.</li>
        <li>Storage limitation.</li>
        <li>Integrity and confidentiality (security).</li>
      </ul>
      <p>We process data for the following purposes:</p>
      <ul>
        <li>Receiving and processing requests, briefs, and feedback.</li>
        <li>Performing contracts and providing services.</li>
        <li>Improving service quality and user experience.</li>
        <li>Communicating about products and updates (with your consent).</li>
        <li>Complying with legal obligations and protecting legitimate interests.</li>
      </ul>

      <h2 id="scope">3. Data We Collect</h2>
      <p>We may process the following categories of data:</p>
      <ul>
        <li><strong>Identification:</strong> name, position, company, country/city, email, phone, messengers.</li>
        <li><strong>Project data:</strong> project description, budget, timeline, reference materials.</li>
        <li><strong>Technical:</strong> IP address, user-agent, cookies, device parameters, interaction events.</li>
        <li><strong>Payment:</strong> invoice and contract details (processed via integrated payment providers).</li>
      </ul>

      <h2 id="legal">4. Legal Bases</h2>
      <p>We process personal data on the following legal bases:</p>
      <ul>
        <li><strong>Consent</strong> of the data subject.</li>
        <li><strong>Performance of a contract</strong> to which the data subject is a party.</li>
        <li><strong>Legitimate interests</strong> of the Company (service improvement, security).</li>
        <li><strong>Legal obligation</strong> where required by applicable law.</li>
      </ul>

      <h2 id="transfer">5. Transfer &amp; Storage</h2>
      <ul>
        <li>Data is shared with contractors and providers (hosting, analytics, payment services, communications) only to the extent necessary and under confidentiality agreements.</li>
        <li>Cross-border transfers are carried out with adequate protection safeguards (Standard Contractual Clauses for EU transfers, or equivalent mechanisms).</li>
        <li>Data is stored on secure servers in Russia and/or jurisdictions with adequate protection levels.</li>
        <li>For Russian users we use domestic cloud solutions (Yandex Cloud, VK Cloud).</li>
      </ul>

      <h2 id="rights">6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data and information about its processing.</li>
        <li>Rectify inaccurate data.</li>
        <li>Request erasure (where no legal basis for retention exists).</li>
        <li>Restrict or object to processing.</li>
        <li>Withdraw consent at any time (without affecting prior lawful processing).</li>
        <li>Lodge a complaint with the relevant supervisory authority.</li>
      </ul>
      <p>Submit requests via the contacts in Section 11. We may ask you to verify your identity.</p>

      <h2 id="security">7. Security</h2>
      <ul>
        <li>Encrypted communications (HTTPS/TLS), access controls, and audit logging.</li>
        <li>Regular backups and disaster-recovery procedures.</li>
        <li>Ongoing software updates and threat monitoring.</li>
        <li>Principle of least privilege for data access.</li>
      </ul>

      <h2 id="cookies">8. Cookies &amp; Analytics</h2>
      <p>
        We use cookies, pixels, and similar technologies for authentication, preference storage,
        usage analytics (Yandex Metrica, Google Analytics), and interface improvements. You can
        manage cookies via your browser settings. Disabling certain cookies may affect service
        functionality.
      </p>

      <h2 id="retention">9. Retention</h2>
      <p>
        Data is retained until the processing purpose is fulfilled or until the end of legally
        mandated retention periods (generally no more than 5 years after the end of the
        relationship). After that, data is deleted or irreversibly anonymised.
      </p>

      <h2 id="gdpr">10. EU / EEA Users — GDPR</h2>
      <p>
        If you are located in the European Union or European Economic Area, Regulation (EU)
        2016/679 (GDPR) applies additionally to our processing of your data:
      </p>
      <ul>
        <li><strong>Data Controller:</strong> OneStack, {ORG.email}.</li>
        <li><strong>Legal bases (GDPR):</strong> consent (Art. 6(1)(a)), contract performance (Art. 6(1)(b)), legitimate interests (Art. 6(1)(f)).</li>
        <li><strong>GDPR rights:</strong> access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), data portability (Art. 20), objection (Art. 21).</li>
        <li>You may lodge a complaint with the supervisory authority in your country of residence.</li>
        <li>Transfers outside the EEA are safeguarded by Standard Contractual Clauses (SCCs) or equivalent mechanisms.</li>
        <li>We do not carry out automated decision-making with significant legal effects (profiling under Art. 22 GDPR).</li>
        <li>Response time to GDPR requests: within 30 days (Art. 12 GDPR).</li>
      </ul>

      <h2 id="contacts">11. Contact Us</h2>
      <p>For questions about personal data processing:</p>
      <ul>
        <li>Email: <a href={`mailto:${ORG.email}`}>{ORG.email}</a></li>
        <li>Phone: <a href="tel:+79109486106">{ORG.phone}</a></li>
        <li>Telegram: <a href="https://t.me/onestack_assistant_bot" target="_blank" rel="noopener noreferrer">@onestack_assistant_bot</a></li>
        <li>Website: <a href={ORG.url} target="_blank" rel="noopener noreferrer">{ORG.url.replace("https://", "")}</a></li>
      </ul>
    </>
  );
}

export default function PrivacyContent() {
  const [lang, setLang] = useState<"ru" | "en">("ru");

  const langToggle = (
    <div className="flex rounded-full overflow-hidden border border-white/15 text-xs font-medium">
      {(["ru", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-3 py-1.5 transition-colors focus:outline-none"
          style={{
            background: lang === l ? "rgba(45,212,191,0.15)" : "transparent",
            color: lang === l ? "#2dd4bf" : "rgba(244,250,248,0.45)",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <PolicyLayout
      title={lang === "ru" ? "Политика конфиденциальности" : "Privacy Policy"}
      subtitle={lang === "ru"
        ? "Обработка персональных данных — ФЗ-152 и GDPR"
        : "Personal Data Processing — Russian Law & GDPR"}
      updatedAt="2026-01-01"
      backHref="/home"
      toc={lang === "ru" ? TOC_RU : TOC_EN}
      langToggle={langToggle}
    >
      {lang === "ru" ? <ContentRU /> : <ContentEN />}
    </PolicyLayout>
  );
}
