"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { serif } from "@/lib/fonts";
import { useI18n } from "@/i18n/I18nProvider";
import { useQuote } from "@/app/context/QuoteContext";
import type { ServiceKind } from "@/components/ServiceHero";

const LABELS = {
  sites: { ru: "Разработка сайта", en: "Website development", event: "site_contact_submit", form: "site_contact" },
  webapp: { ru: "Разработка веб-приложения", en: "Web application development", event: "webapp_contact_submit", form: "webapp_contact" },
  mobile: { ru: "Разработка мобильного приложения", en: "Mobile app development", event: "mobile_contact_submit", form: "mobile_contact" },
};

type AnalyticsWindow = Window & {
  gtag?: (command: string, event: string, params: Record<string, string | number>) => void;
  ym?: (id: number, command: string, goal: string) => void;
};

export default function ServiceContact({ service }: { service: ServiceKind }) {
  const { locale, localizePath } = useI18n();
  const isEn = locale === "en";
  const { quote, resetQuote } = useQuote();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const inFlight = useRef(false);
  const labels = LABELS[service];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    inFlight.current = true;
    setStatus("sending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          message: String(data.get("message") || "").trim(),
          agree: data.get("agree") === "on", website: "",
          source: `${service}/contact`, kind: [labels[isEn ? "en" : "ru"]], quote,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error("Contact request failed");
      setStatus("sent");
      form.reset();
      resetQuote();
      const analytics = window as AnalyticsWindow;
      try {
        analytics.gtag?.("event", "generate_lead", { form_id: labels.form, value: 1, currency: "RUB" });
        analytics.ym?.(105578590, "reachGoal", labels.event);
      } catch { /* Analytics must not change a successful submission. */ }
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
    }
  }

  return (
    <section id="contact" className="service-contact" aria-labelledby="service-contact-title" tabIndex={-1}>
      <div className="service-contact__inner">
        <div>
          <p className="service-eyebrow">{isEn ? "Let's build something together" : "Начнём с вашей задачи"}</p>
          <h2 id="service-contact-title" className={`${serif.className} service-contact__title`}>
            {isEn ? "Get in" : "Связаться"}<br /><span>{isEn ? "touch" : "с нами"}</span>
          </h2>
          <p className="service-contact__description">{isEn ? "Tell us what you have in mind. We will discuss the scope, timeline and next steps. No detailed specification needed." : "Расскажите, что хотите создать. Обсудим задачу, сроки и следующий шаг. Готовое техническое задание не обязательно."}</p>
          <div className="service-contact__links">
            <a href="mailto:info@onestack24.ru">info@onestack24.ru<ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="tel:+79109486106">+7 (910) 948 61 06<ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="https://t.me/onestack_assistant_bot" target="_blank" rel="noreferrer">Telegram<ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
        <form className="service-contact__form" onSubmit={submit} aria-busy={status === "sending"}>
          <p className="service-eyebrow">{labels[isEn ? "en" : "ru"]}</p>
          {quote && <div className="service-quote">
            <span>{isEn ? "Your calculator estimate will be included." : "Расчёт из калькулятора будет приложен к заявке."}</span>
            <button type="button" onClick={resetQuote}>{isEn ? "Remove" : "Убрать"}</button>
          </div>}
          <div hidden aria-hidden="true"><label htmlFor="service-website">Website</label><input id="service-website" name="website" autoComplete="off" tabIndex={-1} /></div>
          <label htmlFor="service-name">{isEn ? "Your name" : "Ваше имя"} *</label>
          <input id="service-name" name="name" autoComplete="name" required maxLength={120} placeholder={isEn ? "How should we address you?" : "Как к вам обращаться?"} />
          <label htmlFor="service-email">Email *</label>
          <input id="service-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" />
          <label htmlFor="service-message">{isEn ? "Your project" : "Ваша задача"} *</label>
          <textarea id="service-message" name="message" required minLength={10} maxLength={2000} rows={4} placeholder={isEn ? "What would you like to build or improve?" : "Что хотите создать или улучшить?"} />
          <details className="service-contact__optional">
            <summary>{isEn ? "Add a phone number (optional)" : "Добавить телефон (необязательно)"}</summary>
            <label htmlFor="service-phone">{isEn ? "Phone" : "Телефон"}</label>
            <input id="service-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </details>
          <label className="service-consent"><input name="agree" type="checkbox" required /><span>{isEn ? "I agree to the processing of my personal data. " : "Согласен на обработку персональных данных. "}<a href={localizePath("/privacy")} target="_blank" rel="noreferrer">{isEn ? "Privacy policy" : "Политика конфиденциальности"}</a></span></label>
          <button type="submit" disabled={status === "sending"} className="service-button service-button--primary">{status === "sending" ? (isEn ? "Sending…" : "Отправляем…") : (isEn ? "Send enquiry" : "Отправить заявку")}<ArrowUpRight size={18} aria-hidden="true" /></button>
          <div role="status" aria-live="polite">
            {status === "sent" && <p>{isEn ? "Thank you! Your enquiry has been received." : "Спасибо! Заявка принята."}</p>}
            {status === "error" && <p>{isEn ? "Could not send your enquiry. Please try again or contact us by email." : "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам на email."}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
