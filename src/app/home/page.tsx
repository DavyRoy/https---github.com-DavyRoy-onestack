// src/app/home/page.tsx
// "/home" — историческая ссылка на главную. Оставляем 308-редирект на "/",
// чтобы не плодить дубль домашней страницы в индексе поисковиков.
import { permanentRedirect } from "next/navigation";

export default function HomeRedirect(): never {
  permanentRedirect("/");
}
