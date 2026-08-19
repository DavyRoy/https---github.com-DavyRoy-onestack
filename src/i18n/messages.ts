import type { Locale } from "./config";

export type Messages = {
  seo: {
    siteDescription: string;
    homeTitle: string;
    homeDescription: string;
  };
  nav: {
    brandAria: string;
    menuLabel: string;
    home: string;
    sites: string;
    webapp: string;
    mobile: string;
    demo: string;
    contact: string;
    skipToContent: string;
    mobileMenu: string;
  };
  hero: {
    aria: string;
    badge: string;
    headline: string;
    subline: string;
    detailsCta: string;
    contactCta: string;
    responseTime: string;
    metric1Value: string;
    metric1Label: string;
    metric2Value: string;
    metric2Label: string;
    metric3Value: string;
    metric3Label: string;
    service1: string;
    service2: string;
    service3: string;
    modalTitle: string;
    modalSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    briefLabel: string;
    attachPlaceholder: string;
    agreeLabel: string;
    submit: string;
    sending: string;
    cancel: string;
    close: string;
    success: string;
    errors: {
      nameRequired: string;
      emailInvalid: string;
      agreeRequired: string;
      fileTooLarge: string;
    };
  };
  cookie: {
    title: string;
    description: string;
    privacy: string;
    accept: string;
    onlyNecessary: string;
  };
};

export const messages: Record<Locale, Messages> = {
  ru: {
    seo: {
      siteDescription:
        "OneStack — разрабатываем сайты, веб-сервисы и мобильные приложения для бизнеса. Более 150 проектов, 4 года на рынке, спринты 1–2 недели.",
      homeTitle: "OneStack — сайты, веб-сервисы и мобильные приложения",
      homeDescription: "Разрабатываем сайты, веб-приложения и мобильные продукты для малого, среднего и крупного бизнеса. Фиксированные сроки, прозрачная смета, поддержка после запуска.",
    },
    nav: {
      brandAria: "На главную OneStack",
      menuLabel: "Основное меню",
      home: "Домашняя",
      sites: "Сайты",
      webapp: "Веб-приложение",
      mobile: "Мобильное приложение",
      demo: "Демо",
      contact: "Связаться с нами",
      skipToContent: "Перейти к основному содержанию",
      mobileMenu: "Мобильное меню",
    },
    hero: {
      aria: "Приветственный экран OneStack",
      badge: "Технологический партнёр · с 2021",
      headline: "Цифровые продукты в срок и по смете",
      subline: "Сайты, веб- и мобильные приложения с фиксированной ценой, спринтами 1–2 недели и поддержкой после запуска.",
      detailsCta: "Смотреть услуги",
      contactCta: "Обсудить проект",
      responseTime: "Ответим в течение рабочего дня",
      metric1Value: "150+",
      metric1Label: "проектов сдано",
      metric2Value: "98%",
      metric2Label: "сдаём в срок",
      metric3Value: "5",
      metric3Label: "лет на рынке",
      service1: "Сайты",
      service2: "Веб-приложения",
      service3: "Мобильные приложения",
      modalTitle: "Связаться с нами",
      modalSubtitle: "Форма обратной связи OneStack",
      nameLabel: "Как вас зовут",
      namePlaceholder: "Иван Петров",
      emailLabel: "Email",
      messageLabel: "Кратко опишите задачу",
      messagePlaceholder: "Цель проекта, сроки, ссылки на референсы…",
      briefLabel: "Бриф / презентация (необязательно)",
      attachPlaceholder: "Прикрепить файл (до 10 МБ)",
      agreeLabel: "Согласен(на) на обработку персональных данных и получение ответа",
      submit: "Отправить заявку",
      sending: "Отправляем…",
      cancel: "Отмена",
      close: "Закрыть",
      success: "Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.",
      errors: {
        nameRequired: "Как к вам обращаться?",
        emailInvalid: "Введите корректный email",
        agreeRequired: "Подтвердите согласие на обработку",
        fileTooLarge: "Файл больше 10 МБ",
      },
    },
    cookie: {
      title: "Настройки файлов cookie",
      description:
        "Мы используем технические cookies и локальное хранилище для работы сайта и сохранения настроек (например, параметров калькулятора).",
      privacy: "Политика конфиденциальности",
      accept: "Принять",
      onlyNecessary: "Только необходимые",
    },
  },
  en: {
    seo: {
      siteDescription:
        "OneStack — we build websites, web services and mobile apps for businesses of any size. 150+ projects, 4 years on the market, 1–2 week sprints.",
      homeTitle: "OneStack — websites, web services and mobile apps",
      homeDescription: "We build websites, web applications and mobile products for small, mid-size and enterprise clients. Fixed timelines, transparent estimates, post-launch support.",
    },
    nav: {
      brandAria: "Back to OneStack home",
      menuLabel: "Main menu",
      home: "Overview",
      sites: "Websites",
      webapp: "Web app",
      mobile: "Mobile app",
      demo: "Demo",
      contact: "Contact us",
      skipToContent: "Skip to main content",
      mobileMenu: "Mobile menu",
    },
    hero: {
      aria: "OneStack hero screen",
      badge: "Technology partner · since 2021",
      headline: "Digital products on time, on budget",
      subline: "Websites, web & mobile apps with fixed price, 1–2 week sprints and post-launch support.",
      detailsCta: "Our services",
      contactCta: "Start a project",
      responseTime: "We respond within one business day",
      metric1Value: "150+",
      metric1Label: "projects delivered",
      metric2Value: "98%",
      metric2Label: "on time",
      metric3Value: "5",
      metric3Label: "years in market",
      service1: "Websites",
      service2: "Web apps",
      service3: "Mobile apps",
      modalTitle: "Contact us",
      modalSubtitle: "OneStack contact form",
      nameLabel: "Your name",
      namePlaceholder: "John Smith",
      emailLabel: "Email",
      messageLabel: "Describe the task",
      messagePlaceholder: "Project goal, timeline, links to references…",
      briefLabel: "Brief / deck (optional)",
      attachPlaceholder: "Attach a file (up to 10 MB)",
      agreeLabel: "I agree to personal data processing and want a response",
      submit: "Send request",
      sending: "Sending…",
      cancel: "Cancel",
      close: "Close",
      success: "Thanks! We received your request and will get back to you shortly.",
      errors: {
        nameRequired: "How should we address you?",
        emailInvalid: "Enter a valid email",
        agreeRequired: "Confirm your consent to personal data processing",
        fileTooLarge: "File is larger than 10 MB",
      },
    },
    cookie: {
      title: "Cookie settings",
      description:
        "We use technical cookies and local storage to run the site and save your settings (e.g., calculator parameters).",
      privacy: "Privacy policy",
      accept: "Accept",
      onlyNecessary: "Essential only",
    },
  },
};
