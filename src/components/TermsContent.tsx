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
  { href: "#subject",   label: "1. Предмет соглашения"          },
  { href: "#access",    label: "2. Доступ и учётные записи"      },
  { href: "#use",       label: "3. Правила использования"        },
  { href: "#ip",        label: "4. Интеллектуальная собственность"},
  { href: "#payments",  label: "5. Стоимость и расчёты"          },
  { href: "#warranty",  label: "6. Гарантии и ответственность"   },
  { href: "#privacy",   label: "7. Конфиденциальность"           },
  { href: "#eu",        label: "8. Для пользователей из ЕС"      },
  { href: "#changes",   label: "9. Изменение условий"            },
  { href: "#law",       label: "10. Применимое право и споры"    },
  { href: "#contacts",  label: "11. Контакты"                    },
];

const TOC_EN = [
  { href: "#subject",   label: "1. Subject Matter"               },
  { href: "#access",    label: "2. Access & Accounts"            },
  { href: "#use",       label: "3. Acceptable Use"               },
  { href: "#ip",        label: "4. Intellectual Property"        },
  { href: "#payments",  label: "5. Pricing & Payments"           },
  { href: "#warranty",  label: "6. Warranties & Liability"       },
  { href: "#privacy",   label: "7. Privacy"                      },
  { href: "#eu",        label: "8. EU Consumer Rights"           },
  { href: "#changes",   label: "9. Changes to Terms"             },
  { href: "#law",       label: "10. Governing Law & Disputes"    },
  { href: "#contacts",  label: "11. Contact Us"                  },
];

function ContentRU() {
  return (
    <>
      <h2 id="subject">1. Предмет соглашения</h2>
      <p>
        Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует порядок
        использования сайта, демо-окружений, материалов и услуг <strong>OneStack</strong>
        (далее — «Компания»). Посещая сайт или используя наши сервисы, вы подтверждаете
        согласие с условиями Соглашения.
      </p>
      <p>
        Соглашение применяется наряду с отдельным договором на оказание услуг (при его
        наличии). В случае противоречия приоритет имеет договор.
      </p>

      <h2 id="access">2. Доступ и учётные записи</h2>
      <ul>
        <li>Демо-доступ предоставляется «как есть» и может быть ограничен по срокам, функциональности и нагрузке.</li>
        <li>Вы обязуетесь предоставлять достоверную информацию при регистрации или обратной связи и самостоятельно защищать данные учётной записи.</li>
        <li>Компания вправе приостанавливать или прекращать доступ при нарушении условий либо для обеспечения безопасности и стабильности сервисов.</li>
        <li>Уведомление о прекращении доступа направляется на указанный вами контакт (email / телефон) не менее чем за 3 рабочих дня, кроме случаев нарушения закона.</li>
      </ul>

      <h2 id="use">3. Правила использования</h2>
      <ul>
        <li>Запрещены действия, нарушающие законодательство РФ, права третьих лиц и общепринятые нормы морали.</li>
        <li>Запрещены попытки несанкционированного доступа, выявления уязвимостей, реверс-инжиниринга без письменного согласия Компании.</li>
        <li>Запрещено размещение вредоносного кода, спама, нелегального контента.</li>
        <li>Нагрузочное тестирование и парсинг допускаются только по письменному согласованию.</li>
      </ul>

      <h2 id="ip">4. Интеллектуальная собственность</h2>
      <p>
        Все исключительные права на результаты интеллектуальной деятельности (дизайн, код,
        тексты, графика, логотипы и т. п.), размещённые на сайте и в демо, принадлежат
        Компании или используются на законных основаниях (ч. 4 ГК РФ).
      </p>
      <p>
        Использование материалов допускается только в пределах, явно разрешённых Компанией.
        Любое иное использование требует письменного согласия.
      </p>
      <p>
        Код, создаваемый в рамках договора с клиентом, переходит к клиенту в соответствии
        с условиями договора после полной оплаты.
      </p>

      <h2 id="payments">5. Стоимость и расчёты</h2>
      <p>
        Стоимость работ определяется индивидуально по брифу/смете. Оплата — по счётам в
        рублях (₽). Возможна поэтапная оплата: аванс, промежуточные платежи и итоговый расчёт.
      </p>
      <ul>
        <li>Авансовый платёж не подлежит возврату, если работы начаты и клиент отказался от проекта без вины Компании.</li>
        <li>Налоги (НДС, если применимо) указываются в счёте отдельно.</li>
        <li>При просрочке оплаты Компания вправе приостановить работы и начислить неустойку в соответствии с договором.</li>
      </ul>

      <h2 id="warranty">6. Гарантии и ответственность</h2>
      <p>
        Сайт и демо-среды предоставляются «как есть». Мы не гарантируем бесперебойную
        работу и пригодность для конкретных целей в части демонстрационного доступа.
      </p>
      <p>
        Компания не несёт ответственности за косвенные убытки, упущенную выгоду и
        последствия форс-мажора (ст. 401 ГК РФ). Для продуктивных систем условия
        качества, доступности и ответственности определяются договором и SLA.
      </p>

      <h2 id="privacy">7. Конфиденциальность</h2>
      <p>
        Обработка персональных данных осуществляется в соответствии с{" "}
        <a href="/privacy">Политикой конфиденциальности</a> и Федеральным законом
        № 152-ФЗ. Используя сервисы, вы соглашаетесь с указанными там условиями.
      </p>

      <h2 id="eu">8. Для пользователей из ЕС</h2>
      <p>
        Если вы находитесь в Европейском Союзе или ЕЭЗ, применяются дополнительные
        положения потребительского и цифрового права ЕС:
      </p>
      <ul>
        <li>Вы вправе отказаться от договора об оказании цифровых услуг в течение 14 дней с момента заключения (Директива 2011/83/EU), если услуги ещё не оказаны.</li>
        <li>Оферта на оказание услуг содержит всю необходимую предконтрактную информацию согласно требованиям ЕС.</li>
        <li>Споры с потребителями могут быть переданы в процедуру альтернативного разрешения споров (ADR/ODR) согласно Директиве 2013/11/EU.</li>
        <li>Подробнее о правах при обработке данных — в разделе 10 <a href="/privacy">Политики конфиденциальности</a>.</li>
      </ul>

      <h2 id="changes">9. Изменение условий</h2>
      <p>
        Компания вправе обновлять Соглашение. Актуальная версия публикуется на сайте
        с датой обновления. Уведомление об изменениях направляется за 7 дней до вступления
        в силу. Продолжение использования сервисов означает согласие с новой редакцией.
      </p>

      <h2 id="law">10. Применимое право и споры</h2>
      <p>
        К Соглашению применяется право Российской Федерации, если иное не предусмотрено
        договором. Споры решаются путём переговоров, при недостижении результата —
        в компетентном суде РФ по месту нахождения Компании.
      </p>
      <p>
        Для потребителей из ЕС — применимое право определяется в соответствии с
        Регламентом (ЕС) № 593/2008 (Рим I), при этом обязательные нормы защиты
        потребителей страны проживания сохраняют силу.
      </p>

      <h2 id="contacts">11. Контакты</h2>
      <p>По юридическим вопросам и офертам:</p>
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
      <h2 id="subject">1. Subject Matter</h2>
      <p>
        These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the website,
        demo environments, materials, and services of <strong>OneStack</strong> (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;Company&rdquo;). By visiting the site or using our services, you
        agree to these Terms.
      </p>
      <p>
        These Terms apply alongside any separate service agreement. In the event of conflict,
        the service agreement takes precedence.
      </p>

      <h2 id="access">2. Access &amp; Accounts</h2>
      <ul>
        <li>Demo access is provided &ldquo;as is&rdquo; and may be limited in duration, functionality, and capacity.</li>
        <li>You agree to provide accurate information when registering or submitting inquiries, and to keep your account credentials secure.</li>
        <li>We may suspend or terminate access in case of breach of these Terms or to maintain security and service stability.</li>
        <li>We will provide at least 3 business days&rsquo; notice of access termination, except where required by law or urgent security reasons.</li>
      </ul>

      <h2 id="use">3. Acceptable Use</h2>
      <ul>
        <li>You must not use our services in violation of applicable law, third-party rights, or accepted standards of conduct.</li>
        <li>Unauthorised access attempts, vulnerability scanning, or reverse-engineering without written consent are prohibited.</li>
        <li>Uploading malicious code, spam, or illegal content is prohibited.</li>
        <li>Load testing and scraping require prior written approval.</li>
      </ul>

      <h2 id="ip">4. Intellectual Property</h2>
      <p>
        All intellectual property rights in the content on the site and in demos (design, code,
        text, graphics, logos, etc.) belong to the Company or are used under a lawful licence.
      </p>
      <p>
        You may use our materials only to the extent expressly permitted. Any other use requires
        written consent.
      </p>
      <p>
        Code produced under a client service agreement transfers to the client upon full payment,
        as specified in the agreement.
      </p>

      <h2 id="payments">5. Pricing &amp; Payments</h2>
      <p>
        Service pricing is determined individually based on brief/estimate. Invoices are issued
        in Russian rubles (₽). Payments may be staged: advance, milestone payments, and final settlement.
      </p>
      <ul>
        <li>Advance payments are non-refundable if work has commenced and the client withdraws without fault on our part.</li>
        <li>Applicable taxes (VAT where applicable) are shown separately on invoices.</li>
        <li>Late payment may result in work suspension and contractual late-payment charges.</li>
      </ul>

      <h2 id="warranty">6. Warranties &amp; Liability</h2>
      <p>
        The website and demo environments are provided &ldquo;as is&rdquo; without warranties of
        fitness for a particular purpose as regards demo access.
      </p>
      <p>
        We are not liable for indirect damages, lost profits, or consequences of force majeure.
        For production systems, quality, availability, and liability terms are set out in the
        service agreement and SLA.
      </p>

      <h2 id="privacy">7. Privacy</h2>
      <p>
        Personal data processing is governed by our{" "}
        <a href="/privacy">Privacy Policy</a>, which is compliant with both Russian Federal Law
        152-FZ and EU GDPR. By using our services you agree to those terms.
      </p>

      <h2 id="eu">8. EU Consumer Rights</h2>
      <p>
        If you are located in the European Union or EEA, the following additional provisions apply:
      </p>
      <ul>
        <li><strong>Right of withdrawal:</strong> You have the right to withdraw from a digital services contract within 14 days of conclusion (Directive 2011/83/EU), provided services have not yet been performed.</li>
        <li><strong>Pre-contractual information:</strong> All required pre-contractual disclosures are provided in our service offer before you commit.</li>
        <li><strong>Alternative dispute resolution:</strong> Disputes may be referred to an ADR/ODR procedure under Directive 2013/11/EU. ODR platform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.</li>
        <li><strong>Digital content conformity:</strong> We ensure our digital deliverables conform to agreed specifications under Directive (EU) 2019/770.</li>
        <li>For data rights, see Section 10 of our <a href="/privacy">Privacy Policy</a>.</li>
      </ul>

      <h2 id="changes">9. Changes to Terms</h2>
      <p>
        We may update these Terms at any time. The current version is published on the site with
        the revision date. We will give at least 7 days&rsquo; notice before material changes take
        effect. Continued use constitutes acceptance of the revised Terms.
      </p>

      <h2 id="law">10. Governing Law &amp; Disputes</h2>
      <p>
        These Terms are governed by the law of the Russian Federation unless otherwise specified
        in a service agreement. Disputes are resolved by negotiation; if unresolved, by a competent
        court in Russia.
      </p>
      <p>
        For EU consumers, mandatory consumer-protection provisions of your country of residence
        remain unaffected pursuant to Regulation (EC) No 593/2008 (Rome I).
      </p>

      <h2 id="contacts">11. Contact Us</h2>
      <p>For legal enquiries and service offers:</p>
      <ul>
        <li>Email: <a href={`mailto:${ORG.email}`}>{ORG.email}</a></li>
        <li>Phone: <a href="tel:+79109486106">{ORG.phone}</a></li>
        <li>Telegram: <a href="https://t.me/onestack_assistant_bot" target="_blank" rel="noopener noreferrer">@onestack_assistant_bot</a></li>
        <li>Website: <a href={ORG.url} target="_blank" rel="noopener noreferrer">{ORG.url.replace("https://", "")}</a></li>
      </ul>
    </>
  );
}

export default function TermsContent() {
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
      title={lang === "ru" ? "Пользовательское соглашение" : "Terms of Use"}
      subtitle={lang === "ru"
        ? "Условия использования сайта, демо и услуг"
        : "Website, demo environments & services"}
      updatedAt="2026-01-01"
      backHref="/home"
      toc={lang === "ru" ? TOC_RU : TOC_EN}
      langToggle={langToggle}
    >
      {lang === "ru" ? <ContentRU /> : <ContentEN />}
    </PolicyLayout>
  );
}
