// src/app/modal/privacy/page.tsx
import PolicyModalShell from "@/app/modal/PolicyModalShell";

export const metadata = {
  title: "Политика конфиденциальности — OneStack (модалка)",
  robots: { index: false, follow: false }, // модал-страницу обычно не индексируем
};

export default function ModalPrivacy() {
  return (
    <PolicyModalShell title="Политика конфиденциальности" closeHref="/privacy">
      <p className="text-white/70 text-sm">
        Полная версия доступна на странице <a href="/privacy">/privacy</a>.
      </p>
      <hr className="my-4 border-white/10" />
      <h3>Коротко</h3>
      <ul>
        <li>Обрабатываем данные для оказания услуг и ответа на запросы.</li>
        <li>Cookies и аналитика — для улучшения UX.</li>
        <li>Права субъекта — доступ, исправление, удаление, отзыв согласия.</li>
      </ul>
    </PolicyModalShell>
  );
}