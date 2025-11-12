// src/app/modal/terms/page.tsx
import PolicyModalShell from "@/app/modal/PolicyModalShell";

export const metadata = {
  title: "Пользовательское соглашение — OneStack (модалка)",
  robots: { index: false, follow: false },
};

export default function ModalTerms() {
  return (
    <PolicyModalShell title="Пользовательское соглашение" closeHref="/terms">
      <p className="text-white/70 text-sm">
        Полная версия — на странице <a href="/terms">/terms</a>.
      </p>
      <hr className="my-4 border-white/10" />
      <h3>Коротко</h3>
      <ul>
        <li>Использование сайта и демо — по правилам Компании.</li>
        <li>Интеллектуальная собственность — защищена.</li>
        <li>Ответственность ограничена, форс-мажор и т. п.</li>
      </ul>
    </PolicyModalShell>
  );
}