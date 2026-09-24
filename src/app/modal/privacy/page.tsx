// src/app/modal/privacy/page.tsx
import PolicyModalShell from "@/app/modal/PolicyModalShell";

export const metadata = {
  title: "Политика конфиденциальности — кратко",
  robots: { index: false, follow: false },
};

export default function ModalPrivacy() {
  return (
    <PolicyModalShell
      title="Политика конфиденциальности"
      updated="редакция 2026"
      lead="Коротко о том, какие данные мы получаем через сайт и как с ними обращаемся. Обработка ведётся по 152-ФЗ, для пользователей из ЕС — по GDPR."
      fullHref="/privacy"
      fullLabel="Полная версия политики"
      points={[
        { anchor: "scope",     title: "Какие данные собираем",   text: "Имя, email, телефон, компанию и описание задачи, которые вы указываете в форме, а также файл, если прикладываете его." },
        { anchor: "principles", title: "Зачем",                   text: "Чтобы ответить на заявку, подготовить оценку проекта и связаться с вами." },
        { anchor: "transfer",  title: "Где хранятся",            text: "На защищённых серверах в России (Yandex Cloud, VK Cloud). Подрядчикам — хостингу, аналитике — передаём только необходимое и по соглашению о конфиденциальности." },
        { anchor: "cookies",   title: "Cookies и аналитика",     text: "Используем Яндекс Метрику и Google Analytics, чтобы улучшать сайт. Управлять cookies можно в настройках браузера." },
        { anchor: "rights",    title: "Ваши права",              text: "Вы можете запросить доступ к своим данным, исправить их, удалить или отозвать согласие — достаточно написать нам." },
        { anchor: "contacts",  title: "Как с нами связаться",    text: "По вопросам данных пишите на info@onestack24.ru или в Telegram @onestack_assistant_bot." },
      ]}
    />
  );
}
