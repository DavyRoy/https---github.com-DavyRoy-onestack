/** @type {import('next').NextConfig} */
const nextConfig = {
  // чтобы работал копирование .next/standalone в Docker
  output: 'standalone',

  // ускоряем CI/докер-сборку
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // NOTE: i18n config здесь НЕ используется — это App Router.
  // Мультиязычность реализована через кастомный middleware (middleware.ts)
  // и I18nProvider. Конфиг i18n работает только с Pages Router.
};

export default nextConfig;
